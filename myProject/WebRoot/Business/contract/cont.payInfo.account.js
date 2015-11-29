var bean = "com.sgepit.pmis.contract.hbm.ConPayAccountView";
var payBean = "com.sgepit.pmis.contract.hbm.ConPay";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var BillStateNoFilter = new Array();
var contractType = new Array();
var contarctType2 = new Array();
var contractTypeArr = new Array();
var contractTypeArr2 = new Array();

var defaultFirstSort = "";
var defaultFirstSortName = "";
var gridfilter = "pid='" + CURRENTAPPID + "'";
var paramsStr = gridfilter; // ds传递参数
var conDiv = '-1'; // 导出时合同一级分类
var conSort = '-1'; // 导出时合同二级分类
var demonArr = new Array();//合同扣款数组
var conPayDs,conPayChargeGrid,conPayChargeWin; //合同付款扣款记录

//国峰财务部,改为按权限级别
var isFinance = ModuleLVL < 3 ? true : false;

Ext.onReady(function(){

	/** ************************************ 合同信息begin ************************* */
	//合同分类二
	var dsCombo2 = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['', '']]
		});

	DWREngine.setAsync(false);
	appMgm.getCodeValue('合同状态', function(list) { // 获取合同状态
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
	        temp.push(list[i].propertyCode);
	        temp.push(list[i].propertyName);
	        BillStateNoFilter.push(temp);
		}
	});
	appMgm.getCodeValue('合同划分类型', function(list) {
		var com1 = new Array();
		com1.push('-1');
		com1.push('所有合同');
		contractType.push(com1);
		for (i = 0; i < list.length; i++) {
			if (i == 0) {
				defaultFirstSort = '-1'; // list[i].propertyCode
				defaultFirstSortName = '所有合同'; // list[i].propertyName
				contarctType2 = new Array();
				contarctType2.push(['-1', '所有合同']);
				appMgm.getCodeValue(defaultFirstSortName, function(list2) {
							for (j = 0; j < list2.length; j++) {
								var temp = new Array();
								temp.push(list2[j].propertyCode);
								temp.push(list2[j].propertyName);
								contarctType2.push(temp);
								contractTypeArr2.push(list2[j].propertyCode);
							}
						});
				dsCombo2.removeAll();
				var ds2 = new Array();
				ds2.push(['-1', '所有合同']);
				dsCombo2.loadData(ds2);
			}
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			contractType.push(temp);
			contractTypeArr.push(list[i].propertyCode);
		}
	});
	appMgm.getCodeValue('扣款项目名称', function(list) {
			for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);
				temp.push(list[i].propertyName);
				demonArr.push(temp);
			}
		});
	DWREngine.setAsync(true);

	//合同分类一
	var dsContractType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : contractType
			});
	//显示更多下拉框
	var cmArray = [['selectAll','全部']];
	var cmHide = new Array();
	var store1 = new Ext.data.SimpleStore({
	      fields : ['k', 'v'],
	      data : cmArray
	});

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号'
		},
		'conno' : {
			name : 'conno',
			fieldLabel : '合同编号'
		},
		'conname' : {
			name : 'conname',
			fieldLabel : '合同名称'
		},
		'partyb' : {
			name : 'partyb',
			fieldLabel : '乙方单位'
		},
		'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : '合同总金额'
		},
		'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签订金额'
		},
		'signdate' : {
			name : 'signdate',
			fieldLabel : '签订日期'
		},
		'coninvoicemoney' : {
			name : 'coninvoicemoney',
			fieldLabel : '发票金额'
		},
		'noinvoicemoney' : {
			name : 'noinvoicemoney',
			fieldLabel : '未开票金额'
		},
		'conpay' : {
			name : 'conpay',
			fieldLabel : '付款金额'
		},
		'nopay' : {
			name : 'nopay',
			fieldLabel : '未付金额'
		},
		'payper' : {
			name : 'payper',
			fieldLabel : '付款比例'
		},
		'performanceMoney' : {
			name : 'performanceMoney',
			fieldLabel : '保函金额'
		},
		'performancedate' : {
			name : 'performancedate',
			fieldLabel : '履约保函到期日'
		},
		'conAdjust' : {
			name : 'conAdjust',
			fieldLabel : '附件'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '合同状态'
		}
	};

	var cm = [{
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
			hidden : true,
			locked : true
		}, {
			id : 'pid',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true,
			locked : true
		}, {
			id : 'conno',
			header : fc['conno'].fieldLabel,
			dataIndex : fc['conno'].name,
			width : 120,
			locked : true,
			renderer : function(data) {
				var qtip = "qtip=" + data;
				return '<span ' + qtip + '>' + data + '</span>';
			}
		}, {
			id : 'conname',
			header : fc['conname'].fieldLabel,
			dataIndex : fc['conname'].name,
			width : 220,
			renderer : function(value, metadata, record) {
				var getConid = record.get('conid');
				return "<a style='color:blue;' href='javascript:renderConno(\"" + getConid + "\")'>" + value + "</a>";
			},
			locked : true
		}, {
			id : 'partyb',
			header : fc['partyb'].fieldLabel,
			dataIndex : fc['partyb'].name,
			width : 220,
			locked : true
		}, {
			id : 'convaluemoney',
			header : fc['convaluemoney'].fieldLabel,
			dataIndex : fc['convaluemoney'].name,
			width : 90,
			align : 'right',
			locked : true,
			renderer : function(value) {
				return cnMoneyToPrec(value/10000, 2);
			}
		}, {
			id : 'conmoney',
			header : fc['conmoney'].fieldLabel,
			dataIndex : fc['conmoney'].name,
			hidden : true,
			align : 'right',
			renderer : function(value) {
				return cnMoneyToPrec(value/10000, 2);
			}
		}, {
			id : 'signdate',
			header : fc['signdate'].fieldLabel,
			dataIndex : fc['signdate'].name,
			align : 'center',
			width : 80,
			renderer : function(value) {
				return value ? value.dateFormat('Y-m-d') : '';
			}
		}, {
			id : 'coninvoicemoney',
			header : fc['coninvoicemoney'].fieldLabel,
			dataIndex : fc['coninvoicemoney'].name,
			width : 90,
			align : 'right',
			renderer : function(value) {
				return cnMoneyToPrec(value/10000, 2);
			}
		}, {
			id : 'noinvoicemoney',
			header : fc['noinvoicemoney'].fieldLabel,
			dataIndex : fc['noinvoicemoney'].name,
			width : 90,
			align : 'right',
			renderer : function(v, m, r){
				return cnMoneyToPrec((r.get('convaluemoney') - r.get('coninvoicemoney'))/10000, 2);
			}
		}, {
			id : 'conpay',
			header : fc['conpay'].fieldLabel,
			dataIndex : fc['conpay'].name,
			width : 90,
			align : 'right',
			renderer : function(value) {
				return cnMoneyToPrec(value/10000, 2);
			}
		}, {
			id : 'nopay',
			header : fc['nopay'].fieldLabel,
			dataIndex : fc['nopay'].name,
			width : 90,
			align : 'right',
			renderer : function(v, m, r){
				return cnMoneyToPrec((r.get('coninvoicemoney') - r.get('conpay'))/10000, 2);
			}
		}, {
			id : 'payper',
			header : fc['payper'].fieldLabel,
			dataIndex : fc['payper'].name,
			width : 90,
			align : 'left',
			renderer : function(value) {
				var qtip = "qtip=" + value;
				return '<span ' + qtip + '>' + value + '</span>';
			}
		}, {
			id : 'performanceMoney',
			header : fc['performanceMoney'].fieldLabel,
			dataIndex : fc['performanceMoney'].name,
			width : 90,
			align : 'right',
			renderer : function(v, m, r){
				m.attr = "style=background-color:#FBF8BF";
				return cnMoneyToPrec(v/10000, 2);
			}
		}, {
			id : 'performancedate',
			header : fc['performancedate'].fieldLabel,
			dataIndex : fc['performancedate'].name,
			align : 'center',
			width : 120,
			renderer : function(value) {
				return value ? value.dateFormat('Y-m-d') : '';
			}
		}, {
			id : 'conAdjust',
			header : fc['conAdjust'].fieldLabel,
			dataIndex : fc['conAdjust'].name,
			align : 'center',
			width : 60,
			renderer : function(v, m, record) {
				var getConid = record.get('conid');
				var getConno = record.get('conno');
				var count = 0;
				DWREngine.setAsync(false);
				baseMgm.getData("select count(infoid) as infoid,count(fileno) as fileno from zl_info" +
						" where modtabid='" + getConid + "'", function(list) {
									if (list != null) {
										count = list[0][0];
									}
								});
				DWREngine.setAsync(true);
				if (count != 0) {
					return "<a href='javascript:void(0)'  style='color:blue;' onclick='conAdjustWin(\""
							+ getConid + "\",\"" + getConno + "\")'>查看[" + count + "]</a>";
				} else {
					return "<a href='javascript:void(0)' style='color:gray;'>查看[" + count + "]</a>";
				}
			}
		}, {
			id : 'billstate',
			header : fc['billstate'].fieldLabel,
			dataIndex : fc['billstate'].name,
			align : 'center',
			hidden : true,
			renderer : function(value) {
				for (var i = 0; i < BillStateNoFilter.length; i++) {
					if (BillStateNoFilter[i][0] == value) {
						return BillStateNoFilter[i][1];
					}
				}
			}
		}];

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	sm.on('rowSelect', function() {
		var rec = sm.getSelected();
		payDs.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='" + rec.get('conid') + "'";
		payDs.load();
		beginPayDate.setValue('');
		endPayDate.setValue('');
	});

	var Columns = [{
			name : 'conid',
			type : 'string'
		}, {
			name : 'pid',
			type : 'string'
		}, {
			name : 'conno',
			type : 'string'
		}, {
			name : 'conname',
			type : 'string'
		}, {
			name : 'partyb',
			type : 'string'
		}, {
			name : 'convaluemoney',
			type : 'float'
		}, {
			name : 'conmoney',
			type : 'float'
		}, {
			name : 'signdate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'coninvoicemoney',
			type : 'float'
		}, {
			name : 'noinvoicemoney',
			type : 'float'
		}, {
			name : 'conpay',
			type : 'float'
		}, {
			name : 'nopay',
			type : 'float'
		}, {
			name : 'payper',
			type : 'string'
		}, {
			name : 'performanceMoney',
			type : 'float'
		}, {
			name : 'performancedate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'billstate',
			type : 'string'
		}];

	var ds = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : bean,
				business : business,
				method : listMethod,
				params : gridfilter
			},
			// 设置代理（保持默认）
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			// 创建reader读取数据（保持默认）
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'cpid'
					}, Columns),
			// 设置是否可以服务器端排序
			remoteSort : true,
			pruneModifiedRecords : true
		});
	ds.setDefaultSort('conno', 'desc'); // 设置默认排序列
	ds.on('load', function() {
		var convaluemoney = 0;
		var coninvoicemoney = 0;
		var noinvoicemoney = 0;
		var conpay = 0;
		var nopay = 0;
		var performanceMoney = 0;
		if(ds.getCount() < PAGE_SIZE){
			convaluemoney = ds.sum('convaluemoney');
			coninvoicemoney = ds.sum('coninvoicemoney');
			noinvoicemoney = convaluemoney - coninvoicemoney;
			conpay = ds.sum('conpay');
			nopay = coninvoicemoney - conpay;
			performanceMoney = ds.sum('performanceMoney');
		} else {
			DWREngine.setAsync(false);
			var sql = "SELECT SUM(T.CONVALUEMONEY),SUM(T.CONINVOICEMONEY),SUM(T.CONVALUEMONEY)-SUM(T.CONINVOICEMONEY)," +
					"SUM(T.CONPAY),SUM(T.CONINVOICEMONEY)-SUM(T.CONPAY),SUM(T.PERFORMANCE_MONEY) FROM CON_PAY_ACCOUNT_VIEW T";
			baseMgm.getData(sql + " WHERE " + paramsStr, function(list){
				if (list != null && list.length==1){
					convaluemoney = list[0][0];
					coninvoicemoney = list[0][1];
					noinvoicemoney = list[0][2];
					conpay = list[0][3];
					nopay = list[0][4];
					performanceMoney = list[0][5];
				}
			});
			DWREngine.setAsync(true);
		}
		Ext.getCmp('convaluemoneyTotal').setValue(cnMoneyToPrec(convaluemoney/10000, 2));
		Ext.getCmp('coninvoicemoneyTotal').setValue(cnMoneyToPrec(coninvoicemoney/10000, 2));
		Ext.getCmp('noinvoicemoneyTotal').setValue(cnMoneyToPrec(noinvoicemoney/10000, 2));
		Ext.getCmp('conpayTotal').setValue(cnMoneyToPrec(conpay/10000, 2));
		Ext.getCmp('nopayTotal').setValue(cnMoneyToPrec(nopay/10000, 2));
		Ext.getCmp('performanceMoneyTotal').setValue(cnMoneyToPrec(performanceMoney/10000, 2));
	});

	var combo = new Ext.form.ComboBox({
		store : dsContractType,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择合同分类一....',
		selectOnFocus : true,
		width : 110,
		listeners : {
			'select' : function() {
				combo2.clearValue();
				combo2.setDisabled(true);
				conDiv = combo.getValue();
				conSort = '-1';
				var conDivDesc = combo.getRawValue();
				if (conDiv == "-1") {
					paramsStr = gridfilter;
				} else {
					paramsStr = "condivno='" + conDiv + "' and " + gridfilter;
					DWREngine.setAsync(false);
					contarctType2 = new Array();
					contarctType2.push(['-1', '所有合同']);
					appMgm.getCodeValue(conDivDesc, function(list) { // 获取工程合同划分类型
								for (i = 0; i < list.length; i++) {
									var temp = new Array();
									temp.push(list[i].propertyCode);
									temp.push(list[i].propertyName);
									contarctType2.push(temp);
									contractTypeArr2.push(list[i].propertyCode);
								}
							});
					if (conDiv != "-1" && contarctType2.length > 0) {
						dsCombo2.loadData(contarctType2);
						combo2.setDisabled(false);
					}
					DWREngine.setAsync(true);
				}
				reload();
			}
		}
	});
	var combo2 = new Ext.form.ComboBox({
		store : dsCombo2,
		displayField : 'v',
		valueField : 'k',
		typeAhead : true,
		mode : 'local',
		triggerAction : 'all',
		emptyText : '选择合同分类二....',
		selectOnFocus : true,
		disabled : true,
		width : 110,
		listeners : {
			'select' : function() {
				conSort = combo2.getValue();
				if (conSort != '-1') {
					paramsStr = "condivno='" + conDiv + "' and sort='" + conSort + "' and " + gridfilter;
				} else {
					paramsStr = "condivno='" + conDiv + "' and " + gridfilter;
				}
				reload();
			}
		}
	});
	var beginDate = new Ext.form.DateField({
				id : 'beginDate',
				format : 'Y-m-d',
				minValue : '2000-01-01',
				width : 100,
				emptyText : '开始日期'
			});
	var endDate = new Ext.form.DateField({
				id : 'endDate',
				format : 'Y-m-d',
				minValue : '2000-01-01',
				width : 100,
				emptyText : '截止日期'
			});
	var nameField = new Ext.form.TextField({
		id : 'nameField',
		emptyText : '合同名称',
		enableKeyEvents: true,
		width : 130,
		listeners : {
			specialKey : function(field, e) {
			if(e.getKey()==e.ENTER){
			      doSearch();
				}
			}
		}
	});
	var partybField = new Ext.form.TextField({
		id : 'partybField',
		emptyText : '乙方单位',
		enableKeyEvents: true,
		width : 130,
		listeners : {
			specialKey : function(field, e) {
			if(e.getKey()==e.ENTER){
			      doSearch();
				}
			}
		}
	});
	var searchBtn = new Ext.Button({
		id : 'searchBtn',
		tooltip : '查询',
		text : "",
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/cx.png',
		handler : doSearch
	});
	var resetBtn = new Ext.Button({
		id : 'resetBtn',
		tooltip : '重置',
		text : "",
		iconCls : 'btn',
		handler : function() {
			var newparams = gridfilter;
			if (conDiv != '-1') {
				newparams += " and condivno='" + conDiv + "'";
				if (conSort != '-1') {
					newparams += " and sort='" + conSort + "'";
				}
			}
			paramsStr = newparams;
			reload();
			beginDate.setValue(null);
			endDate.setValue(null);
			nameField.setValue("");
			partybField.setValue("");

		}
	});
	var exportConBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		disabled : !isFinance,
		handler : function() {
			exportConFile();
		}
	});
	var chooseRow = new Ext.form.MultiSelect({
		id : 'chooserow',
		width : 150,
		store : store1,
		readOnly : true,
		displayField : 'v',
		valueField : 'k',
		emptyText : '显示更多信息',
		mode : 'local',
		triggerAction : 'all',
		onSelect : function(r, i) {
			var colModel = grid.getColumnModel();
			if (i == 0) {
				if (r.get(this.checkField)) {
					chooseRow.setValue(cmHide);
					cmSelectById(colModel, cmHide);
				} else {
					this.selectAll();
					cmSelectById(colModel, this.getCheckedValue());
				}
			} else {
				r.set(this.checkField, !r.get(this.checkField));
				chooseRow.setValue(this.getCheckedValue());
				cmSelectById(colModel, this.getCheckedValue());
			}
		}
	});

	var tb = new Ext.Toolbar({
				items :[combo, combo2, '-', beginDate, endDate, '-', nameField, '-', partybField,
				searchBtn, resetBtn, '->', chooseRow, '-', exportConBtn, '-', "计量单位：万元"]
		});
	var addConBbar = new Ext.Toolbar({
		items : [
			'<font color=green>合同金额合计：</font>',{xtype: 'textfield', id: 'convaluemoneyTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>发票金额合计：</font>',{xtype: 'textfield', id: 'coninvoicemoneyTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>未开票金额合计：</font>',{xtype: 'textfield', id: 'noinvoicemoneyTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>付款金额合计：</font>',{xtype: 'textfield', id: 'conpayTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>未付金额合计：</font>',{xtype: 'textfield', id: 'nopayTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>保函金额合计：</font>',{xtype: 'textfield', id: 'performanceMoneyTotal', readOnly: true, cls: 'shawsar', width : 110}
		]
	});

	grid = new Ext.grid.LockingGridPanel({
				store : ds,
				columns : cm,
				sm : sm,
				// zhangh 2010-10-18 在此处将合同状态修改为ComboBox
				tbar : tb,
				border : false,
				region : 'center',
				model : 'mini',
				header : true,
				title : '合同信息',
				autoScroll : true, // 自动出现滚动条
				collapsible : true, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				trackMouseOver : true,
				viewConfig : {
					ignoreAdd : true,
					getRowClass : function(rec, rowIndex, rowparams, ds) {
						var date = new Date();
						var perdate = rec.data.performancedate;
						var abs = -1;
						if (perdate != '') {
							abs = parseInt((perdate - date) / 1000 / 60 / 60 / 24)
						}
						if (abs >= 0 && abs <= 10) {
							return 'x-grid-record-red';
						}
						return '';
					}
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				listeners : {
					"render" : function() {
						addConBbar.render(this.bbar);
					},
					"cellClick" : function(grid, rowIndex, columnIndex, e) {
						var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
						// 建筑工程 - 工程量
						if(fieldName == 'performanceMoney' && isFinance){
							moneyWin.show();
						}
					},
					'collapse' : function(panel) {
						var xy = payGrid.getPosition();
						payGrid.setPagePosition(xy[0], panel.getFrameHeight() - panel.getInnerHeight());
						payGrid.setHeight(document.body.clientHeight);
					},
					'expand' : function() {
						var xy = payGrid.getPosition();
						payGrid.setPagePosition(xy[0], tabXY[1]);
						payGrid.setHeight(document.body.clientHeight * 0.5);
					}
				}
			});
	//默认grid列可排序
	grid.getColumnModel().defaultSortable = true;
	/** ************************************ 合同信息end *************************** */
	/** ************************************ 付款信息begin ************************* */
	var payFc = {
		'payid' : {
			name : 'payid',
			fieldLabel : '付款主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键'
		},
		'payno' : {
			name : 'payno',
			fieldLabel : '付款编号'
		},
		'invoiceDate' : {
			name : 'invoiceDate',
			fieldLabel : '发票日期'
		},
		'invoicemoney' : {
			name : 'invoicemoney',
			fieldLabel : '发票金额'
		},
		'invoicerecord':{
			name: 'invoicerecord',
			fieldLabel: '发票记账凭证'
		},
		'paydate' : {
			name : 'paydate',
			fieldLabel : '付款日期'
		},
		'passmoney' : {
			name : 'passmoney',
			fieldLabel : '付款金额'
		},
		'demoney' : {
			name : 'demoney',
			fieldLabel : '考核金额'
		},
		'passDemoney' : {
			name : 'passDemoney',
			fieldLabel : '核定金额'
		},
		'paymentno':{
			name: 'paymentno',
			fieldLabel: '付款记账凭证'
		},
		'actman' : {
			name : 'actman',
			fieldLabel : '经办人'
		},
		'paytype' : {
			name : 'paytype',
			fieldLabel : '付款类型'
		},
		'payway' : {
			name : 'payway',
			fieldLabel : '付款方式'
		},
		'payins' : {
			name : 'payins',
			fieldLabel : '付款说明'
		}
	};
	
	var payCm = new Ext.grid.ColumnModel([ // 创建列模型
			{
				id : 'payid',
				header : payFc['payid'].fieldLabel,
				dataIndex : payFc['payid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : payFc['pid'].fieldLabel,
				dataIndex : payFc['pid'].name,
				hidden : true
			}, {
				id : 'conid',
				header : payFc['conid'].fieldLabel,
				dataIndex : payFc['conid'].name,
			    hidden: true
			}, {
				id : 'payno',
				header : payFc['payno'].fieldLabel,
				dataIndex : payFc['payno'].name,
				width : 120,
				align : 'left'
			}, {
				id : 'invoiceDate',
				header : payFc['invoiceDate'].fieldLabel,
				dataIndex : payFc['invoiceDate'].name,
				width : 90,
				align : 'center',
				hidden : true,
				editor : new Ext.form.DateField({
					name : 'invoiceDate'
				}),
				renderer : function(value, m, r){
					m.attr = "style=background-color:#FBF8BF";
					return value ? value.dateFormat('Y-m-d') : '';
				}
			}, {
				id : 'invoicemoney',
				header : payFc['invoicemoney'].fieldLabel,
				dataIndex : payFc['invoicemoney'].name,
				width : 90,
				align : 'right',
				renderer : function(value) {
					return cnMoneyToPrec(value, 2);
				}
			}, {
				id : 'invoicerecord',
				header : payFc['invoicerecord'].fieldLabel,
				dataIndex : payFc['invoicerecord'].name,
				width : 150,
				align : 'center'
			}, {
				id : 'paydate',
				header : payFc['paydate'].fieldLabel,
				dataIndex : payFc['paydate'].name,
				width : 90,
				align : 'center',
				renderer : function(value, m, r){
					return value ? value.dateFormat('Y-m-d') : '';
				}
			}, {
				id : 'passmoney',
				header : payFc['passmoney'].fieldLabel,
				dataIndex : payFc['passmoney'].name,
				width : 90,
				align : 'right',
				renderer : function(value) {
					return cnMoneyToPrec(value, 2);
				}
			}, {
				id : 'demoney',
				header : payFc['demoney'].fieldLabel,
				dataIndex : payFc['demoney'].name,
				width : 90,
				align : 'right',
				renderer : function(value, m, r) {
					var payid = r.get('payid');
					return "<a style='color:blue' href='javascript:demoneyShow(\"" + payid + "\")'>" + cnMoneyToPrec(value, 2) + "</a>";
				}
			}, {
				id : 'passDemoney',
				header : payFc['passDemoney'].fieldLabel,
				dataIndex : payFc['passDemoney'].name,
				width : 90,
				align : 'right',
				renderer : function(value, m, r) {
					var passmoney = r.get('passmoney') != null ? r.get('passmoney') : 0;
					var demoney = r.get('demoney') != null ? r.get('demoney') : 0;
					return cnMoneyToPrec(passmoney - demoney, 2);
				}
			}, {
				id : 'paymentno',
				header : payFc['paymentno'].fieldLabel,
				dataIndex : payFc['paymentno'].name,
				width : 150,
				align : 'center'
			}, {
				id : 'actman',
				header : payFc['actman'].fieldLabel,
				dataIndex : payFc['actman'].name,
				hidden : true
			}, {
				id : 'paytype',
				header : payFc['paytype'].fieldLabel,
				dataIndex : payFc['paytype'].name,
				width : 90,
				align : 'center'
			}, {
				id : 'payway',
				header : payFc['payway'].fieldLabel,
				dataIndex : payFc['payway'].name,
				width : 90,
				align : 'center'
			}, {
				id : 'payins',
				header : payFc['payins'].fieldLabel,
				dataIndex : payFc['payins'].name,
				width : 200
			}]);

	var paySm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var payColumns = [{
			name : 'payid',
			type : 'string'
		}, {
			name : 'pid',
			type : 'string'
		}, {
			name : 'conid',
			type : 'string'
		}, {
			name : 'payno',
			type : 'string'
		}, {
			name : 'invoiceDate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'invoicemoney',
			type : 'float'
		}, {
			name: 'invoicerecord',
			type: 'string'
		}, {
			name : 'paydate',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'passmoney',
			type : 'float'
		}, {
			name : 'demoney',
			type : 'float'
		}, {
			name: 'paymentno',
			type: 'string'
		}, {
			name : 'actman',
			type : 'string'
		}, {
			name : 'paytype',
			type : 'string'
		}, {
			name : 'payway',
			type : 'string'
		}, {
			name : 'payins',
			type : 'string'
		}];

	var payDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : payBean,
			business : business,
			method : listMethod,
			params : "pid='" + CURRENTAPPID + "'"
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : 'payid'
				}, payColumns),
		// 设置是否可以服务器端排序
		// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		remoteSort : true,
		pruneModifiedRecords : true
	});
	payDs.setDefaultSort('payno', 'desc'); // 设置默认排序列
	payDs.on('load', function(){
		var invoicemoneyTotal = 0;
		var passmoneyTotal = 0;
		var demoneyTotal = 0;
		if (payDs.getCount() > 0){
			invoicemoneyTotal = cnMoneyToPrec(payDs.sum('invoicemoney'), 2);
			passmoneyTotal = cnMoneyToPrec(payDs.sum('passmoney'), 2);
			demoneyTotal = cnMoneyToPrec(payDs.sum('demoney'), 2);
			exportPayBtn.setDisabled(!isFinance);
		} else {
			exportPayBtn.setDisabled(true);
		}
		Ext.getCmp('invoicemoneyTotal').setValue(invoicemoneyTotal);
		Ext.getCmp('passmoneyTotal').setValue(passmoneyTotal);
		Ext.getCmp('demoneyTotal').setValue(demoneyTotal);
	});

	var beginPayDate = new Ext.form.DateField({
				id : 'beginPayDate',
				format : 'Y-m-d',
				minValue : '2000-01-01',
				width : 100,
				emptyText : '开始日期'
			});
	var endPayDate = new Ext.form.DateField({
				id : 'endPayDate',
				format : 'Y-m-d',
				minValue : '2000-01-01',
				width : 100,
				emptyText : '截止日期'
			});
	var searchPayBtn = new Ext.Button({
		id : 'searchPayBtn',
		tooltip : '查询',
		text : "",
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/cx.png',
		handler : doPaySearch
	});
	var resetPayBtn = new Ext.Button({
		id : 'resetPayBtn',
		tooltip : '重置',
		text : "",
		iconCls : 'btn',
		handler : function() {
			beginPayDate.setValue(null);
			endPayDate.setValue(null);
			var rec = sm.getSelected();
			var newparams = "pid='" + CURRENTAPPID + "'";
			if (rec != null){
				newparams += " and conid='" + rec.get('conid') + "'";
			}
			payDs.baseParams.params = newparams;
			payDs.load();
		}
	});

	var exportPayBtn = new Ext.Button({
		id : 'exportPay',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		disabled : !isFinance,
		handler : function() {
			exportPayFile();
		}
	});

	var addPayBbar = new Ext.Toolbar({
		items : [
			'<font color=green>发票金额合计：</font>',{xtype: 'textfield', id: 'invoicemoneyTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>付款金额合计：</font>',{xtype: 'textfield', id: 'passmoneyTotal', readOnly: true, cls: 'shawsar', width : 110},
    		'<font color=green>考核金额合计：</font>',{xtype: 'textfield', id: 'demoneyTotal', readOnly: true, cls: 'shawsar', width : 110}
		]
	});

	var payGrid = new Ext.grid.EditorGridTbarPanel({
				ds : payDs,
				cm : payCm,
				sm : paySm,
				region : 'south',
				model : 'mini',
				height : document.body.clientHeight * 0.5,
				border : false,
				header : true,
				title : '付款信息',
				autoScroll : true, // 自动出现滚动条
				collapsible : true, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				addBtn : false,
				saveBtn : true,
				delBtn : false,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				clicksToEdit : 1,
				tbar : [beginPayDate, endPayDate, searchPayBtn, resetPayBtn, '->'],
				bbar : addPayBbar,
				servletUrl: MAIN_SERVLET,		
				bean : payBean,					
				business : business,
				primaryKey :"payid",
				listeners : {
					'render' : function() {
						var payTbar = this.getTopToolbar();
						payTbar.add(exportPayBtn);
						payTbar.add('-');
						payTbar.add("计量单位：元");
					},
					'beforeedit' : function(){
						if (!isFinance){
							return false;
						}
					}
				}
			});
	/** ************************************ 付款信息end *************************** */
	/** ******************************** 保函金额窗口 begin ************************ */
	//保函金额
	var moneyField = new Ext.form.NumberField(fc['performanceMoney']);
	var saveBtn = new Ext.Button({
		id : 'save',
		text : "保存",
		iconCls : 'save',
		handler : function(){
			var rec = sm.getSelected();
			var money = moneyField.getValue() != null ? moneyField.getValue() : 0;
			var oldMoney = rec.get('performanceMoney');
			rec.set('performanceMoney', money);
			rec.commit();
			baseDao.updateBySQL("UPDATE CON_OVE T SET T.PERFORMANCE_MONEY=" + money + " WHERE T.CONID='" + rec.get('conid') + "'");
			Ext.example.msg('提示', '保存成功！');
			moneyWin.hide();
			var oldSumMoney = Ext.getCmp('performanceMoneyTotal').getValue();
			Ext.getCmp('performanceMoneyTotal').setValue(cnMoneyToPrec((oldSumMoney - oldMoney + money)/10000, 2));
		}
	});
	var cancelBtn = new Ext.Button({
		id : 'cancel',
		text : "取消",
		iconCls : 'cancel',
		handler : function(){
			moneyWin.hide();
		}
	});
	var moneyForm = new Ext.FormPanel({
			region : 'center',
			border: false,
			bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
			iconCls : 'icon-detail-form', // 面板样式
			labelAlign : 'left',
			items : [moneyField],
			buttonAlign : 'center',
			buttons : [saveBtn, cancelBtn]
		});
	var moneyWin = new Ext.Window({
				title : '保函金额',
				width : 320,
				height : 120,
				resizable : false,
				border : false,
				modal : true,
				layout : 'border',
				closeAction : 'hide',
				modal : true,
				items : [moneyForm],
				listeners : {
					'show' : function(){
						var money = sm.getSelected().get('performanceMoney');
						moneyField.setValue(money);
					}
				}
			});
	/** ******************************** 保函金额窗口 end ************************** */

	var viewport = new Ext.Viewport({
		layout : 'border',
		border : false,
		items : [grid, payGrid]
	});

	reload();
	payDs.load();

	var tabXY = payGrid.getPosition();

	for (var o in fc) {
		var temp = new Array();
		temp.push(fc[o].name);
		temp.push(fc[o].fieldLabel);
		var colModel = grid.getColumnModel();
		// 锁定列不在显示更多信息中出现
		if (colModel.getLockedCount() <= colModel.findColumnIndex(fc[o].name)) {
			cmArray.push(temp);
			if (!colModel.isHidden(colModel.getIndexById(o))) {
				cmHide.push(o);
			}
		}
	}
	store1.loadData(cmArray)

	chooseRow.setValue(cmHide);
	chooseRow.setRawValue("显示更多信息");

	Ext.getCmp("chooserow").on("mouseout", function(){
			if(chooseRow.getValue()==""||chooseRow.getValue()==null){
				chooseRow.setValue(cmHide);
				chooseRow.setRawValue("显示更多信息");
			}
	}, this);
	Ext.getCmp('showQuery').hide();

	function doSearch() {
		var newparams = gridfilter;
		if (conDiv != '-1') {
			newparams += " and condivno='" + conDiv + "'";
			if (conSort != '-1') {
				newparams += " and sort='" + conSort + "'";
			}
		}
		if (beginDate.getValue()) {
			newparams += " and signdate >= to_date('" + Ext.util.Format.date(beginDate.getValue(), 'Ymd') + "','YYYYMMDD')";
		}
		if (endDate.getValue()) {
			newparams += " and signdate <= to_date('" + Ext.util.Format.date(endDate.getValue(), 'Ymd') + "','YYYYMMDD')";
		}
		if (nameField.getValue()) {
			newparams += " and conname like '%" + nameField.getValue() + "%'";
		}
		if (partybField.getValue()) {
			newparams += " and partyb like '%" + partybField.getValue() + "%'";
		}
		paramsStr = newparams;
		reload();
	}

	function doPaySearch() {
		var rec = sm.getSelected();
		var newparams = "pid='" + CURRENTAPPID + "'";
		if (rec != null){
			newparams += " and conid='" + rec.get('conid') + "'";
		}
		if (beginPayDate.getValue()) {
			newparams += " and paydate >= to_date('" + Ext.util.Format.date(beginPayDate.getValue(), 'Ymd') + "','YYYYMMDD')";
		}
		if (endPayDate.getValue()) {
			newparams += " and paydate <= to_date('" + Ext.util.Format.date(endPayDate.getValue(), 'Ymd') + "','YYYYMMDD')";
		}
		payDs.baseParams.params = newparams;
		payDs.load();
	}

	function cmSelectById(cm, str) {
		var cmHide = str.toString().split(',');
		var lockedCol = colModel.getLockedCount();
		for (var i = lockedCol; i < cm.getColumnCount(); i++) {
			for (var j = 0; j < cmHide.length; j++) {
				if (cm.getDataIndex(i) == cmHide[j]) {
					cm.setHidden(i, false);
					break;
				} else {
					cm.setHidden(i, true);
				}
			}
		}
	}

	function reload() {
		ds.baseParams.params = paramsStr;
		ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	function exportConFile() {
		var openUrl = CONTEXT_PATH + "/servlet/ConServlet?ac=exportConPayAccount&businessType=ConPayAccountCon&filter=" + encodeURI(encodeURI(paramsStr));
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	function exportPayFile() {
		var baseParam = payDs.baseParams.params;
		baseParam = baseParam.replace(/(pid=)/, 'CON_PAY.pid=');
		baseParam = baseParam.replace(/(conid=)/, 'CON_PAY.conid=');
		var params = baseParam + " and con_pay_account_view.conid=CON_PAY.conid";
		var openUrl = CONTEXT_PATH + "/servlet/ConServlet?ac=exportConPayAccount&businessType=ConPayAccountPay&filter=" + params;
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

})

function renderConno(conid) {
	var conUrl = CONTEXT_PATH + "/Business/contract/cont.generalInfo.view.jsp?query=true&conid=" + conid + "&acc=con&windowMode=1";
	var conWin = new Ext.Window({
				title : "合同信息",
				width : 1000,
				height : document.body.clientHeight - 20,
				minWidth : 350,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='" + conUrl + "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	conWin.show();
}

// 查看合同附件函数
function conAdjustWin(conid, conno) {
	var fileUrl = CONTEXT_PATH + "/Business/contract/cont.files.view.jsp?select=" + conid + "&conno=" + conno;
	var fileWin = new Ext.Window({
				title : "合同附件",
				width : 700,
				height : 400,
				minWidth : 350,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='" + fileUrl + "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}

//弹出扣款记录窗口
function demoneyShow(payid) {
	if (!conPayChargeGrid) {
		var conPayChargeColumns = [{
					name : 'uids',
					type : 'string'
				}, {
					name : 'conid',
					type : 'string'
				}, {
					name : 'conpaytype',
					type : 'string'
				}, {
					name : 'chargename',
					type : 'string'
				}, {
					name : 'chargemoney',
					type : 'float'
				}, {
					name : 'chargeremark',
					type : 'string'
				}, {
					name : 'pid',
					type : 'string'
				}]
		conPayDs = new Ext.data.Store({
					baseParams : {
						ac : 'list',
						bean : 'com.sgepit.pmis.contract.hbm.ConPayCharge',
						business : 'baseMgm',
						method : 'findwhereorderby',
						params : "1=1"
					},
					proxy : new Ext.data.HttpProxy({
								url : MAIN_SERVLET,
								method : 'GET'
							}),
					reader : new Ext.data.JsonReader({
								root : 'topics',
								totalProperty : 'totalCount'
							}, conPayChargeColumns)
				})
		var conPaySm = new Ext.grid.CheckboxSelectionModel();
		var conPayCm = new Ext.grid.ColumnModel([{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					hidden : true
				}, {
					id : 'conid',
					header : 'conid',
					dataIndex : 'conid',
					hidden : true
				}, {
					id : 'chargename',
					header : '扣款项目名称',
					dataIndex : 'chargename',
					align : 'center',
					width : 250,
					renderer : function(v) {
						for (var i = 0; i < demonArr.length; i++) {
							if (demonArr[i][0] == v) {
								return demonArr[i][1];
							}
						}
					}
				}, {
					id : 'chargemoney',
					header : '扣款金额',
					dataIndex : 'chargemoney',
					width : 80
				}, {
					id : 'pid',
					header : 'pid',
					dataIndex : 'pid',
					hidden : true
				}])
		conPayChargeGrid = new Ext.grid.GridPanel({
					height : 300,
					width : 400,
					ds : conPayDs,
					sm : conPaySm,
					cm : conPayCm,
					border : false,
					header : true,
					autoScroll : true,
					collapsible : false,
					animCollapse : false,
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 20,
								store : conPayDs,
								displayInfo : true,
								displayMsg : ' {0} - {1} / {2}',
								emptyMsg : "无记录。"
							})
				})
	}
	if (!conPayChargeWin) {
		conPayChargeWin = new Ext.Window({
					title : '扣款记录列表',
					width : 420,
					height : 340,
					modal : true,
					closeAction : 'hide',
					maximizable : true,
					minimizable : true,
					resizable : true,
					autoScroll : true,
					plain : true,
					items : [conPayChargeGrid],
					listeners : {
						'hide' : function() {
							conPayDs.removeAll();
						}
					}
				})
	}
	conPayDs.baseParams.params = "payid='" + payid + "'";
	conPayDs.load({params:{start : 0,limit : PAGE_SIZE}});
	conPayChargeWin.show();
}