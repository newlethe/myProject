var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.budget.hbm.VConApp"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
var gridPanelTitle = "所有记录"
var formPanelTitle = "编辑记录（查看详细信息）"
var propertyName = "condivno"
var propertyValue = "1"
var SPLITB = "`"
var pid = CURRENTAPPID;
var partBs = new Array();
var contractType = new Array();
var contarctType2 = new Array();
var appType = [['convaluemoney-conappmoney', '合同总金额分摊不平衡'],['conmoney-initappmoney', '合同签订分摊不平衡'],
['concha-changeappmoney', '合同变更分摊不平衡'],['concla-claappmoney', '合同索赔分摊不平衡'],['conbre-breachappmoney', '合同违约分摊不平衡']
,['conpay-factappmoney', '合同付款分摊不平衡']
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
	conpartybMgm.getPartyB(function(list) { // 获取乙方单位
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].cpid);
					temp.push(list[i].partyb);
					partBs.push(temp);
				}
			});
	appMgm.getCodeValue('合同状态', function(list) { // 获取合同状态
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					BillState.push(temp);
				}
			});
	appMgm.getCodeValue('合同划分类型', function(list) { // 获取合同划分类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					contractType.push(temp);
				}
			});
	appMgm.getCodeValue('合同付款方式', function(list) { // 获取合同付款方式
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					payways.push(temp);
				}
			});

	DWREngine.endBatch();
	DWREngine.setAsync(true);

	var dsPartB = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : partBs
			});

	var dsContractType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : contractType
			});

	var dsBillState = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : BillState
			});

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
		},
		'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : '合同总金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'conappmoney' : {
			name : 'conappmoney',
			fieldLabel : '合同分摊总金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'condivno' : {
			name : 'condivno',
			fieldLabel : '合同分类编码',
			valueField : 'k',
			displayField : 'v',
			inputType : 'select-one',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsContractType,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'signdate' : {
			name : 'signdate',
			fieldLabel : '签订日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			disabledDays : [0, 6],
			hidden:true,
			disabledDaysText : '只能选择工作日！',
			anchor : '95%'
		},
		'convalue' : {
			name : 'convalue',
			fieldLabel : '合同金额',
			readOnly : true,
			anchor : '95%'
		},
		'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签订金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'initappmoney' : {
			name : 'initappmoney',
			fieldLabel : '合同签订分摊金额',
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
		'concla' : {
			name : 'concla',
			fieldLabel : '合同索赔金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'claappmoney' : {
			name : 'claappmoney',
			fieldLabel : '索赔分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'conbre' : {
			name : 'conbre',
			fieldLabel : '违约金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'breachappmoney' : {
			name : 'breachappmoney',
			fieldLabel : '违约分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'conpay' : {
			name : 'conpay',
			fieldLabel : '付款金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'factappmoney' : {
			name : 'factappmoney',
			fieldLabel : '付款分摊金额',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		
		'bidno' : {
			name : 'bidno',
			fieldLabel : '招标编号',
			anchor : '95%'
		},
		'partya' : {
			name : 'partya',
			fieldLabel : '甲方',
			anchor : '95%'
		},
		'actionpartya' : {
			name : 'actionpartya',
			fieldLabel : '甲方经办人',
			anchor : '95%'
		},
		'partybno' : {
			name : 'partybno',
			fieldLabel : '乙方单位',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			hidden:true,
			store : dsPartB,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'partybman' : {
			name : 'partybman',
			fieldLabel : '乙方代表',
			anchor : '95%'
		},
		'partybphone' : {
			name : 'partybphone',
			fieldLabel : '乙方代表电话',
			anchor : '95%'
		},
		'advmoney' : {
			name : 'advmoney',
			fieldLabel : '预付款',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'matmoney' : {
			name : 'matmoney',
			fieldLabel : '质保金',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'context' : {
			name : 'context',
			fieldLabel : '合同摘要',
			height : 200,
			width : 200,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '合同状态',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			emptyText : '合同审定',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsBillState,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'payper' : {
			name : 'payper',
			fieldLabel : '付款比例',
			anchor : '95%'
		},
		'payway' : {
			name : 'payway',
			fieldLabel : '付款方式',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			// store: dsPayway,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'conadmin' : {
			name : 'conadmin',
			fieldLabel : '合同管理员',
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
				width : 120,
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
				width : 180,
				type : 'string',
				renderer : renderConno

			}, {
				id : 'convaluemoney',
				header : fc['convaluemoney'].fieldLabel,
				dataIndex : fc['convaluemoney'].name,
				width : 100,
				align : 'right',
				type : 'string',
				renderer : cnMoneyToPrec

			}, {
				id : 'conappmoney',
				header : fc['conappmoney'].fieldLabel,
				dataIndex : fc['conappmoney'].name,
				width : 120,
				align : 'right',
				type : 'string',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var conappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ conappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +conappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +conappmoney
								+ '</div>';						
					}
					return str;	
				}

			}, {
				id : "partybno",
				header : fc['partybno'].fieldLabel,
				dataIndex : fc['partybno'].name,
				hidden:true,
				renderer : partbRender,
				type : 'string'
			}, {
				id : "conmoney",
				header : fc['conmoney'].fieldLabel,
				dataIndex : fc['conmoney'].name,
				width : 120,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "initappmoney",
				header : fc['initappmoney'].fieldLabel,
				dataIndex : fc['initappmoney'].name,
				width : 120,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var initappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ initappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +initappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +initappmoney
								+ '</div>';						
					}
					return str;	
				},
				type : 'float'
			}, {
				id : "concha",
				header : fc['concha'].fieldLabel,
				dataIndex : fc['concha'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "changeappmoney",
				header : fc['changeappmoney'].fieldLabel,
				dataIndex : fc['changeappmoney'].name,
				width : 100,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var changeappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ changeappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +changeappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +changeappmoney
								+ '</div>';						
					}
					return str;	
				},type : 'float'
			}, {
				id : "concla",
				header : fc['concla'].fieldLabel,
				dataIndex : fc['concla'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "claappmoney",
				header : fc['claappmoney'].fieldLabel,
				dataIndex : fc['claappmoney'].name,
				width : 100,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var claappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ claappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +claappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +claappmoney
								+ '</div>';						
					}
					return str;	
				},type : 'float'
			}, {
				id : "conbre",
				header : fc['conbre'].fieldLabel,
				dataIndex : fc['conbre'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "conpay",
				header : fc['conpay'].fieldLabel,
				dataIndex : fc['conpay'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "breachappmoney",
				header : fc['breachappmoney'].fieldLabel,
				dataIndex : fc['breachappmoney'].name,
				width : 100,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var breachappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ breachappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +breachappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +breachappmoney
								+ '</div>';						
					}
					return str;	
				},type : 'float'
			}, {
				id : "factappmoney",
				header : fc['factappmoney'].fieldLabel,
				dataIndex : fc['factappmoney'].name,
				width : 100,
				align : 'right',
				renderer :function(value, metadata, record){
					var convaluemoney=cnMoneyToPrec(record.get("convaluemoney"));
					var factappmoney=cnMoneyToPrec(value);
					var str;
					if (value<record.get("convaluemoney")) {
						str = '<div align=right style="color:green">'
								+ factappmoney + '</div>';
					} else if(value>record.get("convaluemoney")) {
						str = '<div align=right style="color:red">' +factappmoney
								+ '</div>';
					}else{
						str = '<div align=right>' +factappmoney
								+ '</div>';						
					}
					return str;	
				},type : 'float'
			}, {
				id : "signdate",
				header : fc['signdate'].fieldLabel,
				dataIndex : fc['signdate'].name,
				align : 'center',
				hidden : true,
				renderer : formatDate,
				type : 'date'
			}, {
				id : "billstate",
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				disabled : true,
				width : 80,
				hidden : true
				// renderer: BillStateRender
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
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'conappmoney',
				type : 'float'
			}, {
				name : 'partybno',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			}, {
				name : 'initappmoney',
				type : 'float'
			}, {
				name : 'concha',
				type : 'float'
			}, {
				name : 'changeappmoney',
				type : 'float'
			}, {
				name : 'concla',
				type : 'float'
			}, {
				name : 'claappmoney',
				type : 'float'
			}, {
				name : 'conbre',
				type : 'float'
			}, {
				name : 'breachappmoney',
				type : 'float'
			}, {
				name : 'conpay',
				type : 'float'
			}, {
				name : 'factappmoney',
				type : 'float'
			}, {
				name : 'billstate',
				type : 'string'
			}, {
				name : 'signdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];
	var Fields = Columns.concat([{
				name : 'condivno',
				type : 'string'
			}, {
				name : 'convalue',
				type : 'double'
			}, // 表单增加的列
			{
				name : 'bidno',
				type : 'string'
			}, {
				name : 'partya',
				type : 'string'
			}, {
				name : 'actionpartya',
				type : 'string'
			}, {
				name : 'advmoney',
				type : 'Double'
			}, {
				name : 'matmoney',
				type : 'Double'
			}, {
				name : 'context',
				type : 'long'
			}, {
				name : 'payper',
				type : 'string'
			}, {
				name : 'payway',
				type : 'string'
			}, {
				name : 'conadmin',
				type : 'string'
			}])
	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantInt = {
		pid : CURRENTAPPID,
		conno : '',
		conname : '',
		convaluemoney:0,
		conappmoney:0,
		partybno : '',
		conmoney : 0,
		initappmoney:0,
		concha:0,
		changeappmoney:0,
		concla:0,
		claappmoney:0,
		conbre:0,
		breachappmoney:0,
		conpay:0,
		factappmoney:0,
		billstate : 1
	} // 设置初始值
	var PlantFieldsInt = new Object();
	Ext.applyIf(PlantFieldsInt, PlantInt)
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
				condivno : '',
				convalue : 0,
				bidno : '',
				partya : '',
				actionpartya : '',
				advmoney : 0,
				matmoney : 0,
				context : '',
				payper : '',
				payway : '',
				clearway : '',
				conadmin : ''
			});

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
		if ('convaluemoney-conappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.convaluemoney)<>round(v.conappmoney)";
		} else if ('conmoney-initappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.conmoney)<>round(v.initappmoney)";
		} else if ('concha-changeappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.concha)<>round(v.changeappmoney)";
		} else if ('concla-claappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.concla)<>round(v.claappmoney)";
		}
		else if ('conbre-breachappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.conbre)<>round(v.breachappmoney)";
		}
		else if ('conpay-factappmoney' == _value) {
			_SQL = "select distinct v.conid from v_con_app v where round(v.conpay)<>round(v.factappmoney)";
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
//				autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					forceFit : false,
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
//				tb.items.get("money").enable();
//				tb.items.get("pay").enable();
//				tb.items.get("change").enable();
//				tb.items.get("compensate").enable();
//				tb.items.get("balance").enable();
//				tb.items.get("breach").enable();
//				tb.items.get("main").enable();
//				tb.items.get("project").enable();
			});

	sm.on('rowdeselect', function() {
				var tb = parent.mainPanel.getTopToolbar();
				parent.disableed();
//				tb.items.get("money").disable();
//				tb.items.get("pay").disable();
//				tb.items.get("change").disable();
//				tb.items.get("compensate").disable();
//				tb.items.get("balance").disable();
//				tb.items.get("breach").disable();
//				tb.items.get("main").disable();
//				tb.items.get("project").disable();
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

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	function renderConno(value, metadata, record) {
		var getConid = record.get('conid');
		var  output ="<a title='" + value + "' style='color:blue;' href=Business/contract/cont.generalInfo.view.jsp?windowMode=1&conid="+ getConid 
		+ "&conids="+encodeURIComponent(CONIDS)+"&optype="+OPTYPE+"&uids="+UIDS+"&dyView="+dyView+"\>" + value + "</a>"		
		return output;
	}

	// 下拉列表中 k v 的mapping
	// 乙方单位
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < partBs.length; i++) {
			if (partBs[i][0] == value) {
				str = partBs[i][1]
				break;
			}
		}
		var qtip = "qtip=" + str;
		return'<span ' + qtip + '>' + str + '</span>';
	}
	// 合同状态
	function BillStateRender(value, cellmeta, record) {
		var str = '';
		for (var i = 0; i < BillState.length; i++) {
			if (BillState[i][0] == value) {
				str = BillState[i][1]
				break;
			}
		}
		var conid = record.get('conid');
		DWREngine.setAsync(false);
		conoveMgm.isApportion(conid, function(flag) {
					if (flag == true)
						str = '<font color=#00ff00>' + str + '</font>';
				});
		DWREngine.setAsync(true);

		return str;
	}
	// 选择乙方单位，并保存下来
	function selectPartB() {
		var record = smPB.getSelected();
		var partybno = record.get('partybno');
		var partybman = record.get('partyblawer');
		var partybbank = record.get('partybbank');
		var partybbankno = record.get('partybbankno');

		DWREngine.setAsync(false);
		conpartybMgm.getPartyB(function(list) { // 再获取一遍获取乙方单位
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].partybno);
						temp.push(list[i].partyb);
						partBs.push(temp);
					}
				});
		DWREngine.setAsync(true);

		partBField.setValue(partybno);
		partybmanField.setValue(partybman);
		partybbankField.setValue(partybbank);
		partybbanknoField.setValue(partybbankno);
		partbWindow.hide();
	}

});
