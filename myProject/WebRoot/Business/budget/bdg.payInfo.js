/*
 * Ext JS Library 2.0 Beta 1 Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量
var ServletUrl = CONTEXT_PATH + "/servlet/BdgServlet";
var bean = "com.sgepit.pmis.contract.hbm.ConPay"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "payid"
var orderColumn = "payno"
var gridPanelTitle = "合同：" + selectedConName + "，所有付款记录";
var SPLITB = "`"
var pid = CURRENTAPPID;
var propertyName = "conid";
var propertyValue = selectedConId;
// var billTypes = [['1','结算'],['0','未结算'],['-1','流程中']];
var billTypes = new Array();
var penaltytypes = new Array();
var changes = new Array();
var payTypes = new Array();
var compensateTypes = new Array();
var expressList = new Array();
var outFilter = "1=1";
if (UIDS != "") {
	var len = UIDS.split(',');
	var str = "";
	for (var i = 0; i < len.length; i++) {
		str += "'" + len[i] + "'";
		if (i < len.length - 1) {
			str += ","
		}
	}
	outFilter = " payid in (" + str + ")";
}
Ext.onReady(function() {
	var btnReturn = new Ext.Button({
				text : '返回',
				iconCls : 'returnTo',
				handler : function() {
					var url = BASE_PATH
							+ "Business/budget/bdg.generalInfo.input.jsp?conids="
							+ CONIDS + "&uids=" + UIDS + "&optype=" + OPTYPE
							+ "&dyView=" + dyView
					if (window.parent.name == 'contentFrame') {
						window.location.href = url;
					} else {
//						window.parent.location.href = url;
						window.parent.frames[0].location.href=url;
					}
				}
			});

	var btnPay = new Ext.Button({
		id : 'pay',
		text : '付款分摊',
		tooltip : '合同付款分摊',
		iconCls : 'btn',
		disabled : true,
		handler : function() {
			var record = sm.getSelected();
			var id = record.get('conid');
			if (id) {
				var payAppUrl;
				if (hasNk == '0') {
					payAppUrl = "Business/budget/bdg.pay.apportion.jsp";
				} else {
					payAppUrl = "Business/budget/bdg.pay.apportion.combine.jsp";
				}

				window.location.href = BASE_PATH + payAppUrl + "?conid=" + id
						+ "&conno=" + g_conno + "&payid=" + record.get("payid")
						+ "&payno=" + record.get("payno") + "&conname="
						+ encodeURIComponent(selectedConName) + "&uids=" + UIDS
						+ "&conids=" + CONIDS + "&optype=" + OPTYPE
						+ "&dyView=" + dyView;
			}
		}
	});
	// 1. 创建选择模式
	var sm = new Ext.grid.RowSelectionModel()

	// 2. 创建列模型
	var fm = Ext.form; // 包名简写（缩写）
	DWREngine.setAsync(false);
	appMgm.getCodeValue('单据状态', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					billTypes.push(temp);
				}
			});
	appMgm.getCodeValue('合同违约类型', function(list) { // 获取违约类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					penaltytypes.push(temp);
				}
			});

	appMgm.getCodeValue('合同变更类型', function(list) { // 获取变更类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					changes.push(temp);
				}
			});

	appMgm.getCodeValue('合同付款方式', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					payTypes.push(temp);
				}
			});

	appMgm.getCodeValue('合同索赔类型', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					compensateTypes.push(temp);
				}
			});

	/*
	 * conexpMgm.getExpression('合同付款', function(list){ //获取合同付款表达式 for (i = 0; i <
	 * list.length; i++){ var temp = new Array(); temp.push(list[i].expression);
	 * temp.push(list[i].expression); expressList.push(temp); } });
	 */

	DWREngine.setAsync(true);

	var payTypeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : payTypes
			});

	// 1结算 0未结算 -1流程中
	var billTypestate = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : billTypes
			});

	/*
	 * var expressType = new Ext.data.SimpleStore({ fields: ['k', 'v'], data :
	 * expressList });
	 */

	var fc = { // 创建编辑域配置
		'payid' : {
			name : 'payid',
			fieldLabel : '付款编号',
			anchor : '95%',
			hidden : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			hidden : true,
			anchor : '95%'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键',
			hidden : true,
			anchor : '95%'
		},
		'payno' : {
			name : 'payno',
			fieldLabel : '付款编号',
			anchor : '95%'
		},
		'actman' : {
			name : 'actman',
			fieldLabel : '经办人',
			anchor : '95%'
		},
		'paydate' : {
			name : 'paydate',
			fieldLabel : '付款申请日期',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'paytype' : {
			name : 'paytype',
			fieldLabel : '付款类型*',
			allowBlank : false,
			anchor : '95%'
		},
		'payins' : {
			name : 'payins',
			fieldLabel : '付款说明',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '单据状态',
			anchor : '95%'
		},
		'filelsh' : {
			name : 'filelsh',
			fieldLabel : '付款附件编号',
			anchor : '95%'
		},
		'appmoney' : {
			name : 'appmoney',
			fieldLabel : '申请付款',
			allowNegative : false,
			renderer : cnMoneyToPrec,
			anchor : '95%'
		},
		'paymoney' : {
			name : 'paymoney',
			fieldLabel : '实际付款',
			renderer : cnMoneyToPrec,
			anchor : '95%'
		},
		'factpaymoney' : {
			name : 'factpaymoney',
			fieldLabel : '付款分摊实际金额',
			renderer : cnMoneyToPrec,
			anchor : '95%'
		}
	}

	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	{
				id : 'payid',
				header : fc['payid'].fieldLabel,
				dataIndex : fc['payid'].name,
				hidden : true,
				width : 200
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true,
				width : 120
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true,
				width : 60
			}, {
				id : 'payno',
				header : fc['payno'].fieldLabel,
				dataIndex : fc['payno'].name,
				renderer : renderPayno,
				align : 'center',
				width : 120
			}, {
				id : 'actman',
				header : fc['actman'].fieldLabel,
				dataIndex : fc['actman'].name,
				align : 'center',
				width : 120,
				renderer : function(data) {
					DWREngine.setAsync(false);
					var data1;
					baseMgm.getData(
							"select realname from rock_user where userid='"
									+ data + "'", function(list) {
								// for(var i = 0; i < list.length; i++){
								// data1=list[i];
								// }
								return data1 = list[0];
							})
					DWREngine.setAsync(true);
					return data1;
				}
			}, {
				id : 'paydate',
				header : fc['paydate'].fieldLabel,
				dataIndex : fc['paydate'].name,
				width : 90,
				align : 'center',
				renderer : formatDate
			}, {
				header : fc['appmoney'].fieldLabel,
				dataIndex : fc['appmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				header : fc['paymoney'].fieldLabel,
				dataIndex : fc['paymoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				header : fc['factpaymoney'].fieldLabel,
				dataIndex : fc['factpaymoney'].name,
				width :100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'paytype',
				header : fc['paytype'].fieldLabel,
				dataIndex : fc['paytype'].name,
				align : 'center',
				width : 120
				// ,
			// renderer: payTypeRender
		}	, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				width : 120,
				align : 'center',
				renderer : billTypeRender
			}, {
				header : fc['payins'].fieldLabel,
				dataIndex : fc['payins'].name,
				align : 'center',
				width : 120
			}, {
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				hidden : true,
				width : 120
			}]);
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
				name : 'payid',
				type : 'string'
			}, {
				name : 'payno',
				type : 'string'
			}, {
				name : 'actman',
				type : 'string'
			}, {
				name : 'paydate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'paytype',
				type : 'string'
			}, {
				name : 'payins',
				type : 'string'
			}, {
				name : 'billstate',
				type : 'float'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'appmoney',
				type : 'float'
			}, {
				name : 'paymoney',
				type : 'float'
			}, {
				name : 'factpaymoney',
				type : 'float'
			}
			];

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'listPay', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : propertyName + "='" + propertyValue + "'",
			outFilter : outFilter,
			conid:selectedConId
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url :ServletUrl
				}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : primaryKey
				}, Columns),

		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});

	var grid = new Ext.grid.GridPanel({
				store : ds,
				cm : cm,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				width : 800,
				height : 300,
				iconCls : 'icon-show-all',
				border : false,
				region : 'center'
			});

	grid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var gridMenu = new Ext.menu.Menu({
					id : 'gridMenu',
					items : [{
								text : '付款分摊',
								iconCls : 'btn',
								value : record,
								handler : toHandler
							}]
				});

		coords = e.getXY();
		gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler() {
		window.location.href = BASE_PATH
				+ "Business/budget/budgetAllocation/bdg.pay.apportion.jsp?conid="
				+ this.value.get("conid") + "&payid=" + this.value.get("payid")
				+ "&payno=" + this.value.get("payno") + "&conname="
				+ selectedConName + "&uids=" + UIDS + "&conids=" + CONIDS
				+ "&optype=" + OPTYPE + "&dyView=" + dyView;
	}

	// 9. 创建viewport，加入面板action和content
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

	grid.getTopToolbar().add({
		text : '<font color=#15428b><b>&nbsp;' + gridPanelTitle + '</b></font>',
		iconCls : 'title'
	})
	grid.getTopToolbar().add('->')
	grid.getTopToolbar().add(btnPay);
	grid.getTopToolbar().add('-');
	grid.getTopToolbar().add(btnReturn);

	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected()
				var tb = grid.getTopToolbar()
				if (record != null) {
					if(dyView=='true'){
						
					}else {
						tb.items.get("pay").enable()
					}
				} else {
					tb.items.get("pay").disable()
				}

			});

	// 12. 加载数据
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function renderPayno(value, metadata, record) {
		var getPayid = record.get('payid');
		dyView=true;
		return '<a href="' + BASE_PATH
				+ 'Business/contract/cont.payInfo.view.jsp?conid='
				+ selectedConId + '&conname=' + selectedConName + '&conno='
				+ g_conno + '&payid=' + getPayid + '&uids=' + UIDS + '&conids='
				+ CONIDS + '&optype=' + OPTYPE + '&dyView=' + dyView + '">'
				+ value + '</a>'

	}

	// 下拉列表中 k v 的mapping
	function payTypeRender(value) { // 付款类型
		var str = '';
		for (var i = 0; i < payTypes.length; i++) {
			if (payTypes[i][0] == value) {
				str = payTypes[i][1]
				break;
			}
		}
		return str;
	}
	function billTypeRender(value) { // 单据状态类型
		var str = '';
		for (var i = 0; i < billTypes.length; i++) {
			if (billTypes[i][0] == value) {
				str = billTypes[i][1]
				break;
			}
		}
		return str;
	}
});
