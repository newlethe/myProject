var servletName = 'servlet/FACompleteServlet';
var paramBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompParams";
var equBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompEqu";
var progressBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompInfoProgress";
var investmentBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompInvestment";
var fcParams, fcProgress, fcEqu, fcInvesment;
var paramsPanel, progressPanel, equPanel, invesmentPanel;
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var pageSize = 10;
var gridfilter = "pid = '" + pid + "'";
// 是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";

Ext.onReady(function() {

	var paramTypeArr = [];

	DWREngine.setAsync(false);
	appMgm.getCodeValue('工程概况参数类型', function(list) {
				paramTypeArr.push(['-1', '全部']);
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
				allowBlank : true

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

	// 域模型
	var fc = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids'
		},
		pid : {
			id : 'pid',
			name : 'pid',
			fieldLabel : 'pid'
		},
		prjName : {
			name : 'prjName',
			fieldLabel : '工程名称' + requiredMark,
			allowBlank : false
		},
		prjAddress : {
			name : 'prjAddress',
			fieldLabel : '工程地址',
			allowBlank : true
		},
		designUnit : {
			name : 'designUnit',
			fieldLabel : '主要设计单位',
			allowBlank : true
		},
		constructUnit : {
			name : 'constructUnit',
			fieldLabel : '主要建设单位',
			allowBlank : true
		},
		eqIntensity : {
			name : 'eqIntensity',
			fieldLabel : '地震强度',
			allowBlank : true
		},
		fdIntensity : {
			name : 'fdIntensity',
			fieldLabel : '地基计算强度',
			allowBlank : true
		},
		qualityDeter : {
			name : 'qualityDeter',
			fieldLabel : '工程质量鉴定',
			height : 80
		},
		buildProper : {
			name : 'buildProper',
			fieldLabel : '建设性质'
		},
		supervision : {
			name : 'supervision',
			fieldLabel : '监理单位'
		},
		ratifyOrgan : {
			name : 'ratifyOrgan',
			fieldLabel : '最終概算批准机关、文号'
		}
	};

	// 基本信息fieldSet
	var formFieldsSet = new fm.FieldSet({
				title : '项目信息',
				border : true,
				width : 1150,
				layout : 'column',
				items : [{
					layout : 'form',
					border : false,
					columnWidth : .33,
					defaults : { // defaults are applied to items,
						// not the container
						width : 250
					},
					items : [new fm.TextField(fc['prjName']),
							new fm.TextField(fc['designUnit']),
							new fm.TextField(fc['eqIntensity']),
							new fm.TextField(fc['buildProper'])]
							
				}, {
					layout : 'form',
					border : false,
					columnWidth : .33,
					defaults : { // defaults are applied to items,
						// not the container
						width : 250
					},
					items : [new fm.TextField(fc['prjAddress']),
							new fm.TextField(fc['constructUnit']),
							new fm.TextField(fc['fdIntensity']),
							new fm.TextField(fc['supervision'])]
				}, {
					layout : 'form',
					border : false,
					columnWidth : .33,
					defaults : { // defaults are applied to items,
						// not the container
						width : 250
					},
					items : [new fm.TextField(fc['ratifyOrgan']),
							new fm.TextArea(fc['qualityDeter']),
							new fm.Hidden(fc['uids']),
							new fm.Hidden(fc['pid'])]
				}]
			});

	// 按钮
	var saveBtn = new Ext.Button({
				text : '保存',
				disabled : btnDisabled,
				handler : function() {
					if (!formPanel.getForm().isValid()) {
						return;
					}
					if (!formPanel.getForm().findField('pid').getValue()) {
						formPanel.getForm().findField('pid').setValue(pid);
					}
					var prjInfoOve = formPanel.getForm().getValues();
					saveOrUpdate(prjInfoOve);
				}
			});

	// 创建表单Panel
	var formPanel = new Ext.FormPanel({
				id : 'form-panel',
				title : '工程基本信息',
				region : 'north',
				height : 230,
				labelAlign : 'left',
				bodyStyle : 'padding:10px 10px;',
				items : [formFieldsSet],
				buttonAlign : 'left',
				buttons : [saveBtn]
			});

	/*
	 * 工程参数部分 pid VARCHAR2(32), param_no VARCHAR2(32) not null, param_type
	 * VARCHAR2(32), param_name VARCHAR2(30), data_format VARCHAR2(50), unit
	 * VARCHAR2(10), data_type VARCHAR2(10), param_value VARCHAR2(100),
	 */
	fcParams = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids',
			readOnly : true,
			hidden : true
		},
		pid : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			readOnly : true,
			hidden : true
		},
		paramNo : {
			name : 'paramNo',
			fieldLabel : '参数编号'
		},
		paramType : {
			name : 'paramType',
			fieldLabel : '参数类别'
		},
		paramName : {
			name : 'paramName',
			fieldLabel : '参数名称'
		},
		paramValue : {
			name : 'paramValue',
			fieldLabel : '参数值'
		},
		unit : {
			name : 'unit',
			fieldLabel : '数字单位'
		},
		dataType : {
			name : 'dataType',
			fieldLabel : '数据类型'
		},
		remark : {
			name : 'remark',
			fieldLabel : '备注'
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
				type : 'string'
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

	var smParam = new Ext.grid.CheckboxSelectionModel({});

	// 列模型
	var cmParam = new Ext.grid.ColumnModel([smParam,
			{
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
				dataIndex : fcParams['paramNo'].name
			}, {
				id : 'paramType',
				header : fcParams['paramType'].fieldLabel,
				dataIndex : fcParams['paramType'].name,
				renderer : Ext.util.Format.comboRenderer(paramTypeCombo)
			}, {
				id : 'paramName',
				header : fcParams['paramName'].fieldLabel,
				dataIndex : fcParams['paramName'].name
			}, {
				id : 'paramValue',
				header : fcParams['paramValue'].fieldLabel,
				dataIndex : fcParams['paramValue'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						}),
				renderer : editorColor
			}, {
				id : 'unit',
				header : fcParams['unit'].fieldLabel,
				dataIndex : fcParams['unit'].name
			}, {
				id : 'dataType',
				header : fcParams['dataType'].fieldLabel,
				dataIndex : fcParams['dataType'].name,
				hidden : true,
				renderer : Ext.util.Format.comboRenderer(dataTypeCombo)
			}, {
				id : 'remark',
				header : fcParams['remark'].fieldLabel,
				dataIndex : fcParams['remark'].name
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

	paramDs.setDefaultSort('paramNo', 'asc');

	// 参数类型过滤Combo
	var paramTypeFilterCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : paramTypeStore,
				valueField : 'k',
				displayField : 'v',
				allowBlank : true,
				editable : false,
				value : '-1'

			});

	paramTypeFilterCombo.on('select', function(combo, record) {
				var filterStr = gridfilter;
				if (record.data.k != '-1') {
					filterStr += " and paramType = '" + record.data.k + "'";
				}
				paramDs.baseParams.params = filterStr;
				paramDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
			});

	// 工程概况参数tab页
	paramsPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'params-panel',
				title : '工程参数',
				iconCls : 'icon-by-category',
				addBtn : false,
				delBtn : false,
				ds : paramDs,
				cm : cmParam,
				sm : smParam,
				servletUrl : MAIN_SERVLET,
				bean : paramBeanName,
				tbar : [paramTypeFilterCombo],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 2,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : paramDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});

	/*
	 * 
	 * 主要设备部分
	 */
	fcEqu = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids',
			readOnly : true,
			hidden : true
		},
		pid : {
			name : 'pid',
			fieldLabel : 'pid',
			readOnly : true,
			hidden : true
		},
		equNo : {
			name : 'equNo',
			fieldLabel : '编号' + requiredMark
		},
		equName : {
			name : 'equName',
			fieldLabel : '设备名称'
		},
		equModel : {
			name : 'equModel',
			fieldLabel : '设备型号'
		},
		equMaker : {
			name : 'equMaker',
			fieldLabel : '产地制造商'
		},
		equPrice : {
			name : 'equPrice',
			fieldLabel : '出厂价格(元)'
		}

	}

	var ColumnsEqu = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'equNo',
				type : 'string'
			}, {
				name : 'equName',
				type : 'string'
			}, {
				name : 'equModel',
				type : 'string'
			}, {
				name : 'equMaker',
				type : 'string'
			}, {
				name : 'equPrice',
				type : 'string'
			}];

	var PlantEqu = Ext.data.Record.create(ColumnsEqu);
	var PlantEquInt = {
		pid : pid,
		equNo : '',
		equName : '',
		equModel : null,
		equMaker : null,
		equPrice : null
	};
	var smEqu = new Ext.grid.CheckboxSelectionModel({});

	// 列模型
	var cmEqu = new Ext.grid.ColumnModel([smEqu, {
				id : 'uids',
				header : fcEqu['uids'].fieldLabel,
				dataIndex : fcEqu['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcEqu['pid'].fieldLabel,
				dataIndex : fcEqu['pid'].name,
				hidden : fcEqu['pid'].hidden
			}, {
				id : 'equNo',
				header : fcEqu['equNo'].fieldLabel,
				dataIndex : fcEqu['equNo'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : 'equName',
				header : fcEqu['equName'].fieldLabel,
				dataIndex : fcEqu['equName'].name,
				editor : new Ext.form.TextField()
			}, {
				id : 'equModel',
				header : fcEqu['equModel'].fieldLabel,
				dataIndex : fcEqu['equModel'].name,
				editor : new Ext.form.TextField()
			}, {
				id : 'equMaker',
				header : fcEqu['equMaker'].fieldLabel,
				dataIndex : fcEqu['equMaker'].name,
				editor : new Ext.form.TextField()
			}, {
				id : 'equPrice',
				align : 'right',
				header : fcEqu['equPrice'].fieldLabel,
				dataIndex : fcEqu['equPrice'].name,
				renderer : cnMoney,
				editor : new Ext.form.NumberField()
			}

	]);
	cmEqu.defaultSortable = true;

	// 设备概况部分数据源
	var equDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : equBeanName,
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
						}, ColumnsEqu),
				remoteSort : true,
				pruneModifiedRecords : true

			});

	equDs.setDefaultSort('equNo', 'asc');

	// 设备概况参数tab页
	equPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'equ-panel',
				title : '主要设备简况',
				iconCls : 'icon-by-category',
				ds : equDs,
				cm : cmEqu,
				sm : smEqu,
				servletUrl : MAIN_SERVLET,
				bean : equBeanName,
				tbar : [],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 2,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : equDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
				plant : PlantEqu,
				plantInt : PlantEquInt,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});

	/*
	 * 
	 * 工程进度部分
	 */
	fcProgress = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids',
			readOnly : true,
			hidden : true
		},
		pid : {
			name : 'pid',
			fieldLabel : 'pid',
			readOnly : true,
			hidden : true
		},
		progName : {
			name : 'progName',
			fieldLabel : '名称' + requiredMark
		},
		planDate : {
			name : 'planDate',
			fieldLabel : '计划时间' + requiredMark
		},
		assesDate : {
			name : 'assesDate',
			fieldLabel : '考核时间' + requiredMark
		},
		actualDate : {
			name : 'actualDate',
			fieldLabel : '实际时间' + requiredMark
		},
		createDate : {
			name : 'createDate',
			fieldLabel : '创建时间'
		},
		progNo : {
			name : 'progNo',
			fieldLabel : '编号' + requiredMark
		}
	}

	var ColumnsProgress = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'progNo',
				type : 'float'
			}, {
				name : 'progName',
				type : 'string'
			}, {
				name : 'planDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'assesDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'actualDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}

	];

	var PlantProgress = Ext.data.Record.create(ColumnsProgress);
	var PlantProgressInt = {
		pid : pid,
		progNo : '',
		progName : '',
		planDate : '',
		assesDate : '',
		actualDate : '',
		createDate : new Date()
	};
	var smProgress = new Ext.grid.CheckboxSelectionModel({});

	// 列模型
	var cmProgress = new Ext.grid.ColumnModel([smProgress, {
				id : 'uids',
				header : fcProgress['uids'].fieldLabel,
				dataIndex : fcProgress['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcProgress['pid'].fieldLabel,
				dataIndex : fcProgress['pid'].name,
				hidden : fcProgress['pid'].hidden
			}, {
				id : 'progNo',
				header : fcProgress['progNo'].fieldLabel,
				dataIndex : fcProgress['progNo'].name,
				editor : new Ext.form.NumberField({
							allowBlank : false
						})
			}, {
				id : 'progName',
				header : fcProgress['progName'].fieldLabel,
				dataIndex : fcProgress['progName'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : 'planDate',
				header : fcProgress['planDate'].fieldLabel,
				dataIndex : fcProgress['planDate'].name,
				editor : new Ext.form.DateField({
							allowBlank : false
						}),
				renderer : dateRenderer
			}, {
				id : 'assesDate',
				header : fcProgress['assesDate'].fieldLabel,
				dataIndex : fcProgress['assesDate'].name,
				editor : new Ext.form.DateField({
							allowBlank : false
						}),
				renderer : dateRenderer

			}, {
				id : 'actualDate',
				header : fcProgress['actualDate'].fieldLabel,
				dataIndex : fcProgress['actualDate'].name,
				editor : new Ext.form.DateField({
							allowBlank : false
						}),
				renderer : dateRenderer
			}, {
				id : 'createDate',
				header : fcProgress['createDate'].fieldLabel,
				dataIndex : fcProgress['createDate'].name,
				editor : new Ext.form.DateField(),
				renderer : dateRenderer,
				hidden : true
			}]);
	cmProgress.defaultSortable = true;

	// 设备概况部分数据源
	var progressDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : progressBeanName,
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
						}, ColumnsProgress),
				remoteSort : true,
				pruneModifiedRecords : true
			});

	progressDs.setDefaultSort('createDate', 'desc');

	// 设备概况参数tab页
	progressPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'progress-panel',
				title : '工程进度',
				iconCls : 'icon-by-category',
				ds : progressDs,
				cm : cmProgress,
				sm : smProgress,
				servletUrl : MAIN_SERVLET,
				bean : progressBeanName,
				tbar : [],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 2,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : progressDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
				plant : PlantProgress,
				plantInt : PlantProgressInt,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});

	/*
	 * 
	 * 投资部分
	 */
	fcInvesment = {
		uids : {
			name : 'uids',
			fieldLabel : 'uids',
			readOnly : true,
			hidden : true
		},
		pid : {
			name : 'pid',
			fieldLabel : 'pid',
			readOnly : true,
			hidden : true
		},
		invesName : {
			name : 'invesName',
			fieldLabel : '名称' + requiredMark
		},
		invesTotal : {
			name : 'invesTotal',
			fieldLabel : '总投资（万元）' + requiredMark
		},
		invesAvg : {
			name : 'invesAvg',
			fieldLabel : '单位投资（元/千瓦）'
		},
		createDate : {
			name : 'createDate',
			fieldLabel : '创建时间'
		}
	}

	var ColumnsInvesment = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'invesName',
				type : 'string'
			}, {
				name : 'invesTotal',
				type : 'float'
			}, {
				name : 'invesAvg',
				type : 'float'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];

	var PlantInvesment = Ext.data.Record.create(ColumnsInvesment);
	var PlantInvesmentInt = {
		pid : pid,
		invesName : '',
		invesTotal : '',
		invesAvg : '',
		createDate : new Date()
	}
	var smInvesment = new Ext.grid.CheckboxSelectionModel({});

	// 列模型
	var cmInvesment = new Ext.grid.ColumnModel([smInvesment, {
				id : 'uids',
				header : fcInvesment['uids'].fieldLabel,
				dataIndex : fcInvesment['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcInvesment['pid'].fieldLabel,
				dataIndex : fcInvesment['pid'].name,
				hidden : fcInvesment['pid'].hidden
			}, {
				id : 'invesName',
				header : fcInvesment['invesName'].fieldLabel,
				dataIndex : fcInvesment['invesName'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : 'invesTotal',
				header : fcInvesment['invesTotal'].fieldLabel,
				dataIndex : fcInvesment['invesTotal'].name,
				align : 'right',
				editor : new Ext.form.NumberField({
							allowBlank : false,
							decimalPrecision  : 4
						})
			}, {
				id : 'invesAvg',
				header : fcInvesment['invesAvg'].fieldLabel,
				dataIndex : fcInvesment['invesAvg'].name,
				align : 'right',
				editor : new Ext.form.NumberField()
			}, {
				id : 'createDate',
				header : fcInvesment['createDate'].fieldLabel,
				dataIndex : fcInvesment['createDate'].name,
				editor : new Ext.form.DateField({
							allowBlank : false
						}),
				renderer : dateRenderer,
				hidden : true
			}]);
	cmInvesment.defaultSortable = true;

	// 设备概况部分数据源
	var invesmentDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : investmentBeanName,
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
						}, ColumnsInvesment),
				remoteSort : true,
				pruneModifiedRecords : true

			});

	invesmentDs.setDefaultSort('createDate', 'desc');

	// 投资tab页
	invesmentPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'invesment-panel',
				title : '投资概况',
				iconCls : 'icon-by-category',
				ds : invesmentDs,
				cm : cmInvesment,
				sm : smInvesment,
				servletUrl : MAIN_SERVLET,
				bean : investmentBeanName,
				tbar : [],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 2,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : "第",
							store : invesmentDs,
							displayInfo : true,
							displayMsg : ' {0} - {1} / {2}',
							emptyMsg : "无记录"
						}),
				plant : PlantInvesment,
				plantInt : PlantInvesmentInt,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});

	function saveOrUpdate(prjOveInfo) {
		Ext.Ajax.request({
					method : 'post',
					url : servletName,
					params : {
						ac : 'save-update',
						beanType : 'infoOve',
						pid : pid
					},
					jsonData : Ext.encode(prjOveInfo),
					success : function(result, request) {
						loadPrjInfo();
						Ext.example.msg('保存', '保存成功！');
					},
					failure : function(result, request) {
						Ext.Msg.show({
									title : '操作失败',
									msg : '操作失败',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	}

	// TAB面板
	var tabPanel = new Ext.TabPanel({
				region : 'center',
				border : false,
				activeTab : 0,
				items : [paramsPanel, equPanel, progressPanel, invesmentPanel]
			});

	// 创建viewport，加入面板
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [formPanel, tabPanel]
			});

	loadPrjInfo();

	reload('params-panel');
	reload('equ-panel');
	reload('progress-panel');
	reload('invesment-panel');

	function reload(id) {
		switch (id) {
			case 'params-panel' :
				paramDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
				break;
			case 'equ-panel' :
				equDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
				break;
			case 'progress-panel' :
				progressDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});
				break;

			case 'invesment-panel' :
				invesmentDs.load({
							params : {
								start : 0,
								limit : pageSize
							}
						});

				break;
		}
	}

	function loadPrjInfo() {
		formPanel.getForm().load({
					url : servletName,
					root : 'data',
					params : {
						ac : 'getCompOveInfo'
					}
				});
	}

	function editorColor(v, m, r) {
		m.attr = "style=background-color:#FBF8BF";
		return v;
	}
});
