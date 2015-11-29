﻿var bean = "com.sgepit.pmis.contract.hbm.ConPay"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "payid"
var orderColumn = "payno"
var gridPanelTitle = "合同：" + selectedConName + "(合同总金额：￥" + selectconmoney
		+ ")，所有付款记录";
var formPanelTitle = "编辑记录（查看详细信息）"
var SPLITB = "`"
var propertyName = "conid";
var propertyValue = selectedConId;
var billTypes = new Array();
var penaltytypes = new Array();
var changes = new Array();
var payTypes = new Array();
var dspenaltytype = new Array();
var compensateTypes = new Array();
var countInfoList = new Array();
var flowWindow;
var _conPer;
var addToolbar;
var CON_SERVLET=CONTEXT_PATH +"/servlet/ConServlet";
// 当前查询条件
var whereStr = propertyName + "='" + propertyValue + "'";
var outFilter ="1=1";
var getPayid;
if(UIDS!=""){
	var len=UIDS.split(',');
	var str ="";
	for(var i=0;i<len.length;i++){
	    str+="'"+len[i]+"'";
	    if(i<len.length-1){
	       str+=","
	    }
	}
   outFilter=" payid in ("+str+")";
}
//是否禁用新增/修改/删除按钮
var btnDisabled =dyView=='true'?true:(ModuleLVL != '1');
var currentPid=CURRENTAPPID;
if(pid!=""){
	currentPid =pid;
}
var gridfilter = "pid = '" + currentPid + "'"+" and conid='"+selectedConId+"'";
if(payBillState!=""&&payBillState!=null){
	whereStr+=" and billstate=1";
}
Ext.onReady(function() {
	// 1. 创建选择模式
	var sm = new Ext.grid.RowSelectionModel()

	// 2. 创建列模型
	var fm = Ext.form; // 包名简写（缩写）
	DWREngine.setAsync(false);
	DWREngine.beginBatch();
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

	//高级查询使用
	appMgm.getCodeValue('合同付款类型', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyName);
					temp.push(list[i].propertyName);	//原始数据中付款类型存储的是属性名称（如“余额”），不是属性代码
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

	appMgm.getCodeValue('单据状态', function(list) { // 获取付款类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					billTypes.push(temp);
				}
			});

	DWREngine.endBatch();
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

	var fc = { // 创建编辑域配置
		'payid' : {
			name : 'payid',
			fieldLabel : '付款编号',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同名称',
			readOnly : true,
			allowBlank : false,
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
			allowBlank : false,
			anchor : '95%'
		},
		'paytype' : {
			name : 'paytype',
			fieldLabel : '付款类型',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : payTypeStore,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			allowBlank : false,
			anchor : '95%'
		},
		'payins' : {
			name : 'payins',
			fieldLabel : '付款说明',
			height : 130,
			width : 490,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '单据状态',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : billTypestate,
			lazyRender : true,
			listClass : 'x-combo-list-small',
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
			maxValue : 100000000,
			anchor : '95%'
		},
		'passmoney' : {
			name : 'passmoney',
			fieldLabel : '批准付款',
			allowNegative : false,
			maxValue : 100000000,
			anchor : '95%'
		},
		'demoney' : {
			name : 'demoney',
			fieldLabel : '应扣款',
			allowNegative : false,
			// maxValue: 100000000,
			anchor : '95%'
		},
		'paymoney' : {
			name : 'paymoney',
			fieldLabel : '实际付款',
			allowNegative : false,
			maxValue : 100000000,
			allowBlank : false,
			anchor : '95%'
		},
		'invoicemoney' : {
			name : 'invoicemoney',
			fieldLabel : '发票金额',
			allowNegative : false,
			maxValue : 100000000,
			allowBlank : false,
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '付款备注',
			allowBlank : true,
			anchor : '95%'
		},
		'planmoney' : {
			name : 'planmoney',
			fieldLabel : '计划付款',
			allowBlank : false,
			anchor : '95%'
		},
		'paymentno':{
			name: 'paymentno',
			fieldLabel: '付款凭证号',
			allowBlank : false,
			anchor : '95%'
			
		},
		'invoicerecord':{
			name: 'invoicerecord',
			fieldLabel: '发票入账票证号',
			allowBlank : false,
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
			    hidden: true,
				width : 120,
				renderer : renderConid
			}, {
				id : 'payno',
				header : fc['payno'].fieldLabel,
				dataIndex : fc['payno'].name,
				width : 120,
				align : 'center',
				renderer : renderPayno
			}, {
				id : 'paydate',
				header : fc['paydate'].fieldLabel,
				dataIndex : fc['paydate'].name,
				width : 90,
				hidden: true,
				align : 'center',
				renderer : formatDate,
				type : 'date'
			}, {
				id : 'appmoney',
				header : fc['appmoney'].fieldLabel,
				dataIndex : fc['appmoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'passmoney',
				header : fc['passmoney'].fieldLabel,
				dataIndex : fc['passmoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'demoney',
				header : fc['demoney'].fieldLabel,
				dataIndex : fc['demoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'planmoney',
				header : fc['planmoney'].fieldLabel,
				dataIndex : fc['planmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'paymoney',
				header : fc['paymoney'].fieldLabel,
				dataIndex : fc['paymoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'invoicemoney',
				header : fc['invoicemoney'].fieldLabel,
				dataIndex : fc['invoicemoney'].name,
				width : 100,
				align : 'right',
				renderer : cnMoneyToPrec
			},{ id : 'paymentno',
				header : fc['paymentno'].fieldLabel,
				dataIndex : fc['paymentno'].name,
				width : 90,
				align : 'center',
				type : 'date'
			},{
				id : 'invoicerecord',
				header : fc['invoicerecord'].fieldLabel,
				dataIndex : fc['invoicerecord'].name,
				width : 90,
				align : 'center',
				type : 'date'               
			},{
				id : 'paytype',
				header : fc['paytype'].fieldLabel,
				dataIndex : fc['paytype'].name,
				width : 120,
				align : 'center',
				store : fc['paytype'].store,
				type : 'combo'
		}	, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				align :'center',
				width : 100
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				align : 'center',
				width : 120,
				renderer : billTypeRender
			}]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'payid',
				type : 'string'
			}, 
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'payno',
				type : 'string'
			}, {
				name : 'paydate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'appmoney',
				type : 'float'
			}, {
				name : 'passmoney',
				type : 'float'
			}, {
				name : 'demoney',
				type : 'float'
			}, {
				name : 'planmoney',
				type : 'float'
			}, {
				name : 'paymoney',
				type : 'float'
			}, {
				name : 'paytype',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'billstate',
				type : 'float'
			}, {
				name : 'actman',
				type : 'string'
			}, {
				name : 'payins',
				type : 'string'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'invoicemoney',
				type : 'float'
			},{
				name :  'paymentno',
				type :  'string'
			},{
				name :  'invoicerecord',
				type :  'string' 
			}];
	var Fields = Columns.concat([ // 表单增加的列

			])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();

	var PlantInt = {
		pid : currentPid,
		conid : selectedConId,
		payno : '',
		paydate : '',
		appmoney : '',
		paymoney : '',
		demoney : '',
		planmoney : '',
		paytype : '',
		remark : '',
		invoicemoney : '',
		billstate : '',
		paymentno : '',
		invoicerecord : ''
		
	};

	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
				actman : '',
				payins : "",
				filelsh : ""
			});

	// 4. 创建数据源
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'listPcBusinessConPay',
			params : gridfilter,
			outFilter :outFilter,
			sj:sj
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : CON_SERVLET
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
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列


	ds.on('beforeload', function(ds1) {
				//取出查询字符串
				var curParam = ds1.baseParams.params;
				if ( curParam.trim() != '' ){
					curParam += ' and ';
					
				}
				curParam += whereStr;
				Ext.apply(ds1.baseParams, {
					
							params :curParam

						});
			});

	var titleBar = new Ext.Button({
		text : '<font color=#15428b><b>&nbsp;' + gridPanelTitle + '</b></font>',
		iconCls : 'title'
	})

	var btnReturn = new Ext.Button({
				text : '返回',
				tooltip : '返回',
				iconCls : 'returnTo',
				handler : function() {
					//history.back();
				var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
				window.location.href = url + "isBack=1&uids="+UIDS+"&optype="+OPTYPE+"&conids="+CONIDS+"&dyView="+dyView;					
				}
			});

	var btnAdd = new Ext.Button({
				id : 'add',
				text : '新增',
				tooltip : '新增',
				iconCls : 'add',
				handler : insertPercent,
				disabled : btnDisabled
			});

	var btnEdit = new Ext.Button({
				id : 'edit',
				text : '修改',
				tooltip : '修改',
				iconCls : 'btn',
				disabled : true,
				handler : function() {
					if (sm.getSelected()) {
						var url = BASE_PATH
								+ "Business/contract/cont.payInfo.addorupdate.jsp?";
						//国锦项目单独付款新增页面
//			    		if(CURRENTAPPID=='1030603') {
//				    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?";
//			    		}
						window.location.href = url + "conid=" + selectedConId
								+ "&payid=" + sm.getSelected().get('payid')+"&modid="+MODID;
					} else {
						Ext.example.msg('提示', '请先选择数据！');
					}
				}
			});

   

    	  var addToolbar = new Ext.Toolbar({
	      items :['付款状态',{xtype :'combo',
	                   id : 'combox',
	                   fieldLabel : '付款状态',
	                   valuefield :'k',
	                   displayField : 'v',
	                   mode  : 'local',
	                   typeAhead : true,
	                   triggerAction :'all',
	                   lazyRender : true,
	                   store : new Ext.data.SimpleStore({
	                       fields :['k','v'],
	                       data :[['pay-apply','申请中付款'],
	                           ['pay-process','处理中付款'],
	                           ['pay-finish','已处理付款'],
	                           ['pay-all','本合同所有付款']
	                       ]
	                   }),
	                   listeners :{
	                       'select' : doPayFilter
	                   },
	                   readOnly : true,
	                   listClass: 'x-combo-list-small'
	                    
	          }, '->', '<font color=green>处理中付款累计：</font>', {
							xtype : 'textfield',
							id : 'processTotal',
							readOnly : true,
							cls : 'shawsar'
						}, '-', '<font color=red>已处理付款累计：</font>', {
							xtype : 'textfield',
							id : 'finishTotal',
							readOnly : true,
							cls : 'shawsar'
						}, '-', '<font color=blue>付款比例：</font>', {
							xtype : 'textfield',
							id : 'peper',
							readOnly : true,
							width : 50
						}]
	  })	
	// 5. 创建可编辑的grid: grid-panel
	var grid = new Ext.grid.QueryExcelGridPanel({
				store : ds,
				cm : cm,
				sm : sm,
				tbar : new Ext.Toolbar({
				    items :[titleBar, '->', btnAdd, '-', btnEdit
				    ]
				}) ,
				listeners : {
				    'render' : function (){
				        addToolbar.render(this.tbar);
				    }
				},
				// split: true,
				iconCls : 'icon-show-all',
				border : false,
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
				width : 800,
				height : 450
			});
			
	
			
	// var totalsList = [['累计质保金','800'],['累计质保金22','1000']];

	var cmTotal = new Ext.grid.ColumnModel([{
				header : '累计名称',
				dataIndex : 'name'
			}, {
				header : '累计金额',
				dataIndex : 'money',
				maxValue : 100000000,
				align : 'right',
				renderer : cnMoneyToPrec
			}]);

	var dsTotal = new Ext.data.Store({
				proxy : new Ext.data.MemoryProxy(countInfoList),
				reader : new Ext.data.ArrayReader({}, [{
									name : 'name'
								}, {
									name : 'money'
								}])
			});
	// dsTotal.load();
	var gridTotal = new Ext.grid.GridPanel({
				ds : dsTotal,
				cm : cmTotal,
				title : '累计',
				header : true,
				iconCls : 'icon-show-all',
				split : true,
				autoScroll : true,
				minSize : 175,
				maxSize : 445,
				border : false,
				region : 'center',
				forceFit : true,
				loadMask : true,
				width : 180
			});

	var gridMenu = new Ext.menu.Menu({
				id : 'gridMenu'
			});
	grid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var data = record.get("payid");
		var payno = record.get("payno");
		gridMenu.removeAll();
		gridMenu.addMenuItem({
					id : 'menu_edit',
					text : '　修改',
					value : data,
					iconCls : 'btn',
					disabled : btnDisabled,
					handler : toHandler
				});
		gridMenu.addMenuItem({
					id : 'menu_del',
					text : '　删除',
					value : data,
					payno : payno,
					disabled : btnDisabled,
					iconCls : 'multiplication',
					handler : toHandler
				});
		gridMenu.add('-');
		gridMenu.addMenuItem({
					id : 'menu_view',
					text : '　查看',
					value : data,
					iconCls : 'form',
					handler : toHandler
				});
		gridMenu.addMenuItem({
					id : 'menu_flow',
					text : '　流程信息',
					value : data,
					payno : payno,
					iconCls : 'flow',
					handler : toHandler
				});
		coords = e.getXY();
		gridMenu.showAt([coords[0], coords[1]]);
	}

	function toHandler() {
		var state = this.id;
		var menu_payid = this.value;
		var _payno = this.payno;
		var url = BASE_PATH + "Business/contract/cont.payInfo.addorupdate.jsp?";
		//国锦项目单独付款新增页面
//		if(CURRENTAPPID=='1030603') {
//    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?";
//		}
		if ("" != state) {
			if ("menu_view" == state) {
				var viewUrl = BASE_PATH
						+ "Business/contract/cont.payInfo.view.jsp?";
				window.location.href = viewUrl + "conid=" + selectedConId
						+ "&conname=" + selectedConName + "&conno="
						+ selectedConNo + "&payid=" + menu_payid+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
			} else if ("menu_add" == state) {
				insertPercent();
			} else if ("menu_edit"== state) {
				window.location.href = url + "conid=" + selectedConId
						+ "&payid=" + menu_payid+"&modid="+MODID;
			} else if ("menu_del" == state) {
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				flwInstanceMgm.isFlwData('payno', _payno, function(flag) {
					if (!flag) {
						Ext.Msg.show({
							title : '提示',
							msg : '是否要删除?　　　　',
							buttons : Ext.Msg.YESNO,
							icon : Ext.MessageBox.QUESTION,
							fn : function(value) {
								if ("yes" == value) {
									Ext.get('loading-mask').show();
									Ext.get('loading').show();
									conpayMgm.deleteConpay(menu_payid,MODID,
											function(flag) {
												Ext.get('loading-mask').hide();
												Ext.get('loading').hide();
												if ("0" == flag) {
													Ext.example.msg('删除成功！',
															'您成功删除了一条付款信息！');
													ds.load();
													window.location.reload();
												} else if ("1" == flag) {
													Ext.Msg.show({
														title : '提示',
														msg : '数据删除失败！',
														buttons : Ext.Msg.OK,
														icon : Ext.MessageBox.ERROR
													});
												} else {
													Ext.Msg.show({
														title : '提示',
														msg : flag,
														buttons : Ext.Msg.OK,
														icon : Ext.MessageBox.ERROR
													})
												};
											});
								}
							}
						});
					} else {
						Ext.example.msg('提示', '流程中的数据不能删除！');
					}
				});
			} else if ("menu_flow" == state) {
				Ext.get('loading-mask').hide();
				Ext.get('loading').hide();
				baseDao.findByWhere2(
						"com.sgepit.frame.flow.hbm.FlwFaceParamsIns",
						"paramvalues like '%payno:" + _payno + "%'", function(
								list) {
							if (list.length > 0) {
								showFlow(list[0].insid);
							} else {
								Ext.example.msg('提示', '该条付款记录没有走流程！');
							}
						});
			} else {
				return;
			}
		}
	}

	var viewport = new Ext.Viewport({
				layout : 'border',
				border : false,
				items : [grid, {
							region : 'south',
							height : 180,
							layout : 'border',
							border : false,
							split : true,
							items : [
									// gridTotal, {
									{
								id : 'form-payins',
								xtype : 'form',
								region : 'center',
								title : '付款说明',
								border : false,
								split : true,
								frame : true,
								bodyStyle : 'padding: 5px 5px;',
								layout : 'fit',
								items : [{
											xtype : 'textarea',
											id : 'pay-payins',
											hideLabel : true,
											readOnly : true,
											height : 130
										}]
							}, {
								xtype : 'form',
								region : 'east',
								width : 260,
								border : false,
								split : true,
								frame : true,
								bodyStyle : 'padding: 5px 5px;',
								items : [{
											xtype : 'textfield',
											id : 'appmoneyTotal',
											fieldLabel : '申请付款累计',
											readOnly : true,
											cls : 'shawsar'
										}, {
											xtype : 'textfield',
											id : 'passmoneyTotal',
											fieldLabel : '批准付款累计',
											readOnly : true,
											cls : 'shawsar'
										}, {
											xtype : 'textfield',
											id : 'paymoneyTotal',
											fieldLabel : '实际付款累计',
											readOnly : true,
											cls : 'shawsar'
										}, {
											xtype : 'textfield',
											id : 'invoicemoneyTotal',
											fieldLabel : '发票金额累计',
											readOnly : true,
											cls : 'shawsar'
										}]
							}]
						}],
				listeners : {
					afterlayout : loadPayTotal
				}
			});


	sm.on('selectionchange', function(sm) {
		var record = sm.getSelected()
		if (record != null) {
			Ext.getCmp('form-payins').setTitle('付款说明 - ' + record.get('payno'));
			Ext.getCmp('pay-payins').setValue(record.get('payins'));
			if ( !btnDisabled ){
				btnEdit.setDisabled(false);
			}
			
		}
	});

	ds.load();

	// 13. 其他自定义函数，如格式化，校验等
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};

	function renderConid(value, metadata, record) {
		var getConid = record.get('conid');
		var output = '<span style="color:blue;" onmouseover="this.style.cursor = \'hand\';"'
		output += 'onmouseout="this.style.cursor = \'default\';"'
		output += 'onclick="Ext.get(\'loading\').hide();Ext.get(\'loading-mask\').hide();';
		output += 'window.location.href=\'' + BASE_PATH
		output += 'Business/contract/cont.generalInfo.view.jsp?conid='
				+ getConid + '\'">' + selectedConName + '</span>'
		return output;
	}

	function renderPayno(value, metadata, record) {
		getPayid = record.get('payid');
		var output ="";
	     output ="<a title='"+value+"' style='color:blue;cursor:hand' onclick='openConPayDetailModelessDialog()' >" + value + "</a>";		
	
		return output;
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

	function processResult(value) {
		if ("yes" == value) {
			var url = BASE_PATH
					+ "Business/contract/cont.payInfo.addorupdate.jsp?conid="
					+ selectedConId+"&modid="+MODID;
			//国锦项目单独付款新增页面
//    		if(CURRENTAPPID=='1030603') {
//	    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?conid="+ selectedConId+"&modid="+MODID;
//    		}
			window.location.href = url;
		}
	}

	function insertPercent() {
		conpayMgm.percentCheck(selectedConId, function(flag) {
			Ext.get('loading-mask').hide();
			Ext.get('loading').hide();
			if ("1" == flag) {
				Ext.Msg.show({
							title : '提示',
							msg : '付款金额已经大于合同总金额的90%，是否继续？',
							buttons : Ext.Msg.YESNO,
							fn : processResult,
							icon : Ext.MessageBox.QUESTION
						})
			} else if ("-1" == flag) {
				Ext.Msg.show({
							title : '提示',
							msg : '合同签订金额为零，是否继续？',
							buttons : Ext.Msg.YESNO,
							fn : processResult,
							icon : Ext.MessageBox.QUESTION
						})
			} else {
				var url = BASE_PATH
						+ "Business/contract/cont.payInfo.addorupdate.jsp?conid="
						+ selectedConId+"&modid="+MODID;
				//国锦项目单独付款新增页面
//	    		if(CURRENTAPPID=='1030603') {
//		    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?conid="+ selectedConId+"&modid="+MODID;
//	    		}
				window.location.href = url;
			}
		});
	}

	function doPayFilter(combo,rec,index) {
		//清除现有的条件
		ds.baseParams.params = '';
		var _type=rec.get('k');
		if ('pay-apply' == _type) {
			whereStr = propertyName + "='" + propertyValue
					+ "' and billstate=0";
		} else if ('pay-process' == _type) {
			whereStr = propertyName + "='" + propertyValue
					+ "' and billstate=-1";
		} else if ('pay-finish' == _type) {
			whereStr = propertyName + "='" + propertyValue
					+ "' and billstate=1";
		} else if ('pay-all' == _type) {
			whereStr = propertyName + "='" + propertyValue + "'";
		}
		whereStr+=" and pid = '" + currentPid + "'";
		ds.baseParams.params=whereStr;
		ds.load();
	}

	function loadPayTotal() {
		var _value_process = 0, _value_finish = 0;
		var _total_appmoney = 0, _total_passmoney = 0, _total_paymoney = 0, _total_invoicemoney = 0;
		baseDao.findByWhere5(bean, "conid='" + selectedConId + "'", null, null,
				null, function(list) {
					if (list) {
						for (var i = 0; i < list.length; i++) {
							if (1 == list[i].billstate) {
								_value_finish += list[i].paymoney;
							} else if (1 != list[i].billstate
									|| 0 != list[i].billstate) {
								_value_process += list[i].appmoney;
							}
							_total_appmoney += list[i].appmoney;
							_total_passmoney += list[i].passmoney;
							_total_paymoney += list[i].paymoney;
							_total_invoicemoney += list[i].invoicemoney;
						}
					}
					if (selectconmoney == 0) {
						_conPer = '0.00' + '%';
					} else {
						_conPer = (_value_finish / selectconmoney * 100)
								.toFixed(2)
								+ '%';
					}
					Ext.getCmp('finishTotal').setValue(cnMoneyToPrec(_value_finish));
					Ext.getCmp('peper').setValue(_conPer);
					Ext.getCmp('processTotal')
							.setValue(cnMoneyToPrec(_value_process));
					Ext.getCmp('appmoneyTotal')
							.setValue(cnMoneyToPrec(_total_appmoney));
					Ext.getCmp('passmoneyTotal')
							.setValue(cnMoneyToPrec(_total_passmoney));
					Ext.getCmp('paymoneyTotal')
							.setValue(cnMoneyToPrec(_total_paymoney));
					Ext.getCmp('invoicemoneyTotal')
							.setValue(cnMoneyToPrec(_total_invoicemoney));
				});
	}

	function showFlow(_insid) {
		if (!flowWindow) {
			flowWindow = new Ext.Window({
						title : ' 流程信息',
						iconCls : 'form',
						width : 900,
						height : 500,
						modal : true,
						closeAction : 'hide',
						maximizable : false,
						resizable : false,
						plain : true,
						autoLoad : {
							url : BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
							params : 'type=flwInfo&insid=' + _insid,
							text : 'Loading...'
						}
					});
		} else {
			flowWindow.autoLoad.params = 'type=flwInfo&insid=' + _insid;
			flowWindow.doAutoLoad();
		}
		flowWindow.show();
	}

});
function openConPayDetailModelessDialog(){
		var url=CONTEXT_PATH+"/PCBusiness/pcCon/contract/cont.payInfo.view.jsp?payid="+getPayid+'&conname=' + encodeURIComponent(selectedConName) + '&conno=' + selectedConNo+ '&conid=' + selectedConId +'&uids='+UIDS+'&conids='+CONIDS+'&optype='+OPTYPE+'&dyView=true';
		window.showModalDialog(url, null,"dialogHeight=500px;dialogWidth=900px;scroll=0;status=0;help=1;resizable=1;Minimize=no;Maximize=yes;");
}
