var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.budget.hbm.VConProjectApp"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var gridPanelTitle = "所有记录"
var formPanelTitle = "编辑记录（查看详细信息）"
var propertyValue = "1"
var SPLITB = "`"
var pid = CURRENTAPPID;
var appType = [['initappmoney-projectmoney', '工程量分摊不平衡']
,['changeappmoney-projectchangemoney', '工程量变更分摊不平衡']
];
var BillState = new Array();
var payways = new Array();
var formWindow;
var partbWindow;
var partbDet;
var partBField;
var outFilter ="1=1";
if(CONIDS!=""){
	var len=CONIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" conid in ("+str+")";
}
Ext.onReady(function() {
	DWREngine.setAsync(false);
	DWREngine.beginBatch();

	DWREngine.endBatch();
	DWREngine.setAsync(true);
	var dsApp = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : appType
			});

	// 1. 创建选择模式
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			})

	// 2. 创建列模型
	var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			readOnly : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			readOnly : true,
			hidden : true,
			allowBlank : false,
			hideLabel : true,
			anchor : '95%'
		},
		'conno' : {
			name : 'conno',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'conname' : {
			name : 'conname',
			fieldLabel : '合同名称',
			anchor : '95%'
		}
		,
		'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签定金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'initappmoney' : {
			name : 'initappmoney',
			fieldLabel : '合同签定分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'projectmoney' : {
			name : 'projectmoney',
			fieldLabel : '工程量分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'concha' : {
			name : 'concha',
			fieldLabel : '合同变更金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'changeappmoney' : {
			name : 'changeappmoney',
			fieldLabel : '变更分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'projectchangemoney' : {
			name : 'projectchangemoney',
			fieldLabel : '工程量变更分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		}
	}
	// partBFiled = new fm.ComboBox(fc['partybno']);
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true,
				type : 'string',
				width : 200
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true,
				type : 'string',
				width : 120
			}, {
				id : 'conno',
				header : fc['conno'].fieldLabel,
				dataIndex : fc['conno'].name,
				width : 60,
				type : 'string',
				// 鼠标悬停时显示完整信息
				renderer : function(data, metadata, record, rowIndex,
						columnIndex, store) {
					var qtip = "qtip=" + data;
					return '<span ' + qtip + '>' + data + '</span>';

					return data;
				}
			}, {
				id : 'conname',
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				width : 120,
				type : 'string',
				renderer : renderConno

			}, {
				id : "conmoney",
				header : fc['conmoney'].fieldLabel,
				dataIndex : fc['conmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "initappmoney",
				header : fc['initappmoney'].fieldLabel,
				dataIndex : fc['initappmoney'].name,
				width : 70,
				align : 'right',
				renderer :cnMoneyToPrec,
				type : 'float'
			}, {
				id : "projectmoney",
				header : fc['projectmoney'].fieldLabel,
				dataIndex : fc['projectmoney'].name,
				width : 70,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("initappmoney"));
					var projectmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("initappmoney")) {
						str = '<div align=right style="color:green">'
								+ projectmoney + '</div>';
					} else{
						str = '<div align=right>' +projectmoney
								+ '</div>';						
					}
					return str;	
				},
				type : 'float'
			}, {
				id : "concha",
				header : fc['concha'].fieldLabel,
				dataIndex : fc['concha'].name,
				width : 50,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "changeappmoney",
				header : fc['changeappmoney'].fieldLabel,
				dataIndex : fc['changeappmoney'].name,
				width : 50,
				align : 'right',
				renderer :cnMoneyToPrec,
				type : 'float'
			}, {
				id : "projectchangemoney",
				header : fc['projectchangemoney'].fieldLabel,
				dataIndex : fc['projectchangemoney'].name,
				width : 50,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("changeappmoney"));
					var projectchangemoney=cnMoneyToPrec(value);
					var str;
					if (value>record.get("changeappmoney")) {
						str = '<div align=right style="color:red">'
								+ projectchangemoney + '</div>';
					}else{
						str = '<div align=right>' +projectchangemoney
								+ '</div>';						
					}
					return str;	
				},type : 'float'
			}

	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'conid',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			}, {
				name : 'initappmoney',
				type : 'float'
			}, {
				name : 'projectmoney',
				type : 'float'
			}, {
				name : 'concha',
				type : 'float'
			}, {
				name : 'changeappmoney',
				type : 'float'
			}, {
				name : 'projectchangemoney',
				type : 'float'
			}];
	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : " pid='" + CURRENTAPPID + "'",
			outFilter : outFilter
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : ServletUrl
				}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'cpid'
				}, Columns),
		// sortInfo:{field:'conid',direction:'DESC'},
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列

	var combo= new Ext.form.ComboBox({
				store : dsApp,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择平衡类型....',
				selectOnFocus : true,
				width : 135,
				listeners : {
					select : comboselect
				}
			});

	function comboselect() {
		var _value = combo.getValue();
		var _SQL = "-1", _conids = "";
		if ('initappmoney-projectmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_project_app v where round(v.initappmoney)<>round(v.projectmoney)";
		} else if ('changeappmoney-projectchangemoney' == _value) {
			_SQL = "select distinct v.conid from v_con_project_app v where round(v.changeappmoney)<>round(v.projectchangemoney)";
		} 
		if ('-1' == _SQL)
			return;
		DWREngine.setAsync(false);
		baseMgm.getData(_SQL, function(list) {
					if (list) {
						for (var i = 0; i < list.length; i++) {
							_conids += "'" + list[i]+ "'";
							if (list.length - 1 != i)
								_conids += ',';
						}
						if (list.length == 0)
							_conids = "''";
					}
				});
		DWREngine.setAsync(true);
		ds.baseParams.params = " pid='" + CURRENTAPPID + "' and conid " + ('none' == _value ? " not " : "")
				+ " in (" + _conids + ")";
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	var grid = new Ext.grid.QueryExcelGridPanel({
				store : ds,
				cm : cm,
				sm : sm,
				tbar : ['-',combo, '-'],
				title : gridPanelTitle,
				iconCls : 'icon-show-all',
				border : false,
				layout : 'fit',
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				width : 800,
				height : 300
			});

	// 10. 创建viewport，加入面板action和content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					layout : 'border',
					items : [grid],
					title : 'Simple Tasks',
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [grid]
				});

	}

	// grid.getTopToolbar().add(new Ext.Toolbar.TextItem('<font
	// color=#00cc00>合同状态颜色为绿色的为分摊合同</font>'));
	// 11. 事件绑定
	sm.on('rowselect', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				parent.conid = record.get('conid');
				parent.conno = record.get('conno');
				parent.conname = record.get('conname');
				parent.conmoney = record.get('conmoney');
				parent.enable();
			});

	sm.on('rowdeselect', function() {
				var tb = parent.mainPanel.getTopToolbar();
				parent.disableed();
			})
	// 12. 加载数据
	reload();
	function reload() {
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	function renderConno(value, metadata, record) {
		var getConid = record.get('conid');
		var  output ="<a title='" + value + "' style='color:blue;' href=Business/contract/cont.generalInfo.view.jsp?windowMode=1&conid="+ getConid 
		+ "&conids="+encodeURIComponent(CONIDS)+"&optype="+OPTYPE+"&uids="+UIDS+"&dyView="+dyView+"\>" + value + "</a>"		
		return output;
	}



});
