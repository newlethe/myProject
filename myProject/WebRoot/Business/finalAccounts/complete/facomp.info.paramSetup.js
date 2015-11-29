var fcParams, fcProgress, fcEqu, fcInvesment;
var paramsPanel, progressPanel, equPanel, invesmentPanel;
var paramBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompParams";
var business = "baseMgm";
var listMethod = "findWhereOrderby"
var pageSize = PAGE_SIZE;
var gridfilter = "pid = '" + pid + "'";
var orderColumn = "paramNo";
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";

Ext.onReady(function() {

	var paramTypeArr = [];
	DWREngine.setAsync(false);
	appMgm.getCodeValue('工程概况参数类型', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					paramTypeArr.push(temp);
				}
			});

	DWREngine.setAsync(true);

	var paramTypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : paramTypeArr
			});

	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}

	// 日期renderer
	var dateRenderer = Ext.util.Format.dateRenderer('Y年n月j日');

	// 参数类型下拉框
	var paramTypeCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : paramTypeStore,
				valueField : 'k',
				displayField : 'v',
				readOnly : true,
				allowBlank : false
			});

	// 数据类型下拉框
	var dataTypeCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				allowBlank : true,
				store : new Ext.data.SimpleStore({
							fields : ['k', 'v'],
							data : [['char', '字符'], ['deci', '数字'],
									['date', '日期']]
						})
			});

	// 包名简写
	var fm = Ext.form;

	/*
	 * 工程参数部分
	 */

	fcParams = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids',
			hidden : true
		},
		pid : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true
		},
		paramNo : {
			name : 'paramNo',
			fieldLabel : '参数编号' + requiredMark
		},
		paramType : {
			name : 'paramType',
			fieldLabel : '参数类别' + requiredMark
		},
		paramName : {
			name : 'paramName',
			fieldLabel : '参数名称' + requiredMark
		},
		paramValue : {
			name : 'paramValue',
			fieldLabel : '参数值'
		},
		unit : {
			name : 'unit',
			fieldLabel : '单位' + requiredMark
		},
		dataType : {
			name : 'dataType',
			fieldLabel : '数据类型'

		},
		remark : {
			name : 'remark',
			fieldLabel : '备注',
			hidden : true
		}
	};

	var ColumnsParam = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'paramNo',
				type : 'float'
			}, {
				name : 'paramName',
				type : 'string'
			}, {
				name : 'paramType',
				type : 'string'
			}, {
				name : 'paramValue',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'dataType',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}];

	var PlantParam = Ext.data.Record.create(ColumnsParam);
	var PlantParamInt = {
		pid : pid,
		paramNo : '',
		paramName : '',
		paramType : '',
		paramValue : null,
		unit : '',
		dataType : null,
		remark : null
	};
	var smParam = new Ext.grid.CheckboxSelectionModel({});

	// 列模型
	var cmParam = new Ext.grid.ColumnModel([smParam, {
				id : 'uids',
				header : fcParams['uids'].fieldLabel,
				dataIndex : fcParams['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcParams['pid'].fieldLabel,
				dataIndex : fcParams['pid'].name,
				hidden : fcParams['pid'].hidden
			}, {
				id : 'paramNo',
				header : fcParams['paramNo'].fieldLabel,
				dataIndex : fcParams['paramNo'].name,
				editor : new Ext.form.NumberField({
							allowBlank : false
						}),
				width : 50,
				renderer : function(v) {
					return "<div align='center'>" + v + "</div>";
				}
			}, {
				id : 'paramType',
				header : fcParams['paramType'].fieldLabel,
				dataIndex : fcParams['paramType'].name,
				editor : paramTypeCombo,
				renderer : Ext.util.Format
						.comboRenderer(paramTypeCombo)
			}, {
				id : 'paramName',
				header : fcParams['paramName'].fieldLabel,
				dataIndex : fcParams['paramName'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : 'paramValue',
				header : fcParams['paramValue'].fieldLabel,
				dataIndex : fcParams['paramValue'].name,
				hidden : true
			}, {
				id : 'unit',
				header : fcParams['unit'].fieldLabel,
				dataIndex : fcParams['unit'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : 'dataType',
				header : fcParams['dataType'].fieldLabel,
				dataIndex : fcParams['dataType'].name,
				hidden : true,
				editor : dataTypeCombo,
				renderer : Ext.util.Format.comboRenderer(dataTypeCombo)
			}, {
				id : 'remark',
				header : fcParams['remark'].fieldLabel,
				dataIndex : fcParams['remark'].name,
				editor : new Ext.form.TextField()
			}]);
	cmParam.defaultSortable = true;

	// 工程参数部分数据源
	var paramDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : paramBeanName,
					business : business,
					method : listMethod,
					params : gridfilter
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, ColumnsParam),
				remoteSort : true,
				pruneModifiedRecords : true

			});
	paramDs.setDefaultSort(orderColumn, 'asc');

	// 工程参数
	paramsPanel = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				id : 'params-panel',
				title : '工程参数',
				iconCls : 'icon-by-category',
				ds : paramDs,
				cm : cmParam,
				sm : smParam,
				servletUrl : MAIN_SERVLET,
				bean : paramBeanName,
				tbar : [],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 1,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : paramDs,
							displayInfo : true,
							emptyMsg : "无记录"
						}),
				plant : PlantParam,
				plantInt : PlantParamInt,
				deleteHandler : deleteHandler,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});

	paramsPanel.on('aftersave',function(){
		paramDs.reload();
	})

	function deleteHandler() {
		var panelId = this.id;
		var ds = this.getStore();
		var sm = this.getSelectionModel();
		if (sm.getCount() == 0) {
			Ext.example.msg('提示', '请选择一条记录!');
			return;
		}
		var records = sm.getSelections();
		var flag = 0;
		Ext.each(records, function(record) {
					if (record.get('paramValue')) {
						flag = 1;
						Ext.example.msg('提示', '已填写详细参数值，不允许删除!');
						return false;
					}
				});
		if (flag == 0) {
			paramsPanel.defaultDeleteHandler();
		}
	}

	// 创建viewport，加入面板
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [paramsPanel]
			});

	paramDs.load({
				params : {
					start : 0,
					limit : pageSize
				}
			});
});
