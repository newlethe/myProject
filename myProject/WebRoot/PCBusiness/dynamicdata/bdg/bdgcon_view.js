var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.contract.hbm.ConOveView"
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
var appType = [['none', '未分摊合同'], ['conovenopay', '合同分摊(无付款分摊)'],
		['conovenocha', '合同分摊(无变更分摊)'], ['pay', '付款分摊'], ['change', '变更分摊'],
		['pay-change', '付款-变更分摊']];
var BillState = new Array();
var payways = new Array();
// var contractType= [['01', '工程合同'],['02', '其他合同'],['03', '总承包合同'],['04',
// '设备(自营)合同'],['05','前期合同'],['06', '设备(总包)合同'],['-1', '所有合同']];
// var BillState = [[1,'合同签订'],[2,'合同执行'],[3,'付款完成'],[4,'合同结算'],[5,'终止合同']];
var dsCombo2 = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['', '']]
		});

var formWindow;
var partbWindow;
var partbDet;
var partBField;

Ext.onReady(function() {

	contractType.push(['-1', '所有合同'])

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
	/*
	 * appMgm.getCodeValue('工程合同分类',function(list){ //获取工程合同划分类型 for(i = 0; i <
	 * list.length; i++) { var temp = new Array();
	 * temp.push(list[i].propertyCode); temp.push(list[i].propertyName);
	 * contSort2_gc.push(temp); } });
	 * 
	 * appMgm.getCodeValue('设备合同分类',function(list){ //获取设备合同划分类型 for(i = 0; i <
	 * list.length; i++) { var temp = new Array();
	 * temp.push(list[i].propertyCode); temp.push(list[i].propertyName);
	 * contSort2_sb.push(temp); } });
	 * appMgm.getCodeValue('其它合同分类',function(list){ //获取设备合同划分类型 for(i = 0; i <
	 * list.length; i++) { var temp = new Array();
	 * temp.push(list[i].propertyCode); temp.push(list[i].propertyName);
	 * contSort2_qt.push(temp); } });
	 */

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
		     header : '',
		     singleSelect : true
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
			fieldLabel : '合同签定金额',
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
				width : 60,
				align:'center',
				type : 'string',
				renderer : renderConno
			}, {
				id : 'conname',
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				width : 120,
				align:'center',
				type : 'string',
				// 鼠标悬停时显示完整信息
				renderer : function(data, metadata, record, rowIndex,
						columnIndex, store) {

					var qtip = "qtip=" + data;
					return '<span ' + qtip + '>' + data + '</span>';

					return data;
				}

			}, {
				id : "partybno",
				header : fc['partybno'].fieldLabel,
				dataIndex : fc['partybno'].name,
				width : 120,
				align:'center',
				renderer : partbRender,
				type : 'string'
			}, {
				id : "conmoney",
				header : fc['conmoney'].fieldLabel,
				dataIndex : fc['conmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec,
				type : 'float'
			}, {
				id : "signdate",
				header : fc['signdate'].fieldLabel,
				dataIndex : fc['signdate'].name,
				align : 'center',
				width : 60,
				renderer : formatDate,
				type : 'date'
			}, {
				id : "billstate",
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				disabled : true,
				width : 60,
				hidden : true
				// renderer: BillStateRender
		}

	]);

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
				name : 'partybno',
				type : 'string'
			}, {
				name : 'conmoney',
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

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			beanName : bean,
			primaryKey : primaryKey,
			pid : PID,
			uids : UIDS
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CONTEXT_PATH + "/servlet/DynamicServlet"
				}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount'
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
		});

	var grid = new Ext.grid.GridPanel({
				store : ds,
				cm : cm,
				sm : sm,
				tbar : [],
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
//				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
//					pageSize : PAGE_SIZE,
//					store : ds,
//					displayInfo : true,
//					displayMsg : ' {0} - {1} / {2}',
//					emptyMsg : "无记录。"
//				}),
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
		ds.load(
				);

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
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
		output += 'window.location.href=\'' + BASE_PATH
		output += 'PCBusiness/dynamicdata/conove/con_ove.detail.jsp?conid='
				+ getConid + '\'">' + value + '</span>'
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
		return str;
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

});
