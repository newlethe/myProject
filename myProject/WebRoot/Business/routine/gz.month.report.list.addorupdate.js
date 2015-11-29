var bean = "com.sgepit.pmis.routine.hbm.GzMonthReportList";
var business = "baseMgm";
var listMethod = "findwhereorderby";

var primaryKey = 'uuid';
var filterStrItem = "";

var monthArray = [['01', '01月'], ['02', '02月'], ['03', '03月'], ['04', '04月'],
		['05', '05月'], ['06', '06月'], ['07', '07月'], ['08', '08月'],
		['09', '09月'], ['10', '10月'], ['11', '11月'], ['12', '12月']];
var checkLastItem = "";
var checkLastUser = "";
var formWin
Ext.onReady(function() {

	var flow = ""
	if (isFlwTask) {
		flow = "&isTask=true"
	}

	DWREngine.setAsync(false);
	// -----------------当前部门员工（负责人）
	var user = new Array();
	baseMgm.getData("select userid,realname from rock_user where dept_id = '"
			+ USERDEPTID + "'", function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			user.push(temp);
		}
	});
	DWREngine.setAsync(true);

	var userDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : user
	})

	var BUTTON_CONFIG = {
		'BACK' : {
			text : '返回',
			iconCls : 'returnTo',
			handler : function() {
				// history.back();
				var url = BASE_PATH
						+ "Business/routine/gz.month.report.jsp?uuid="
						+ report_uuid + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		},
		'SAVE' : {
			id : 'save',
			text : '保存',
			handler : formSave
		},
		'RESET' : {
			id : 'reset',
			text : '取消',
			handler : function() {
				// history.back();
				var url = BASE_PATH
						+ "Business/routine/gz.month.report.jsp?uuid="
						+ report_uuid + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		}
	};

	var fm = Ext.form;

	var fc = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : 'UUID',
			hidden : true,
			anchor : '95%'
		},
		'reportuuid' : {
			name : 'reportuuid',
			fieldLabel : '月报编号',
			hidden : true,
			anchor : '95%'
		},
		'thismonthitem' : {
			name : 'thismonthitem',
			fieldLabel : '本月项目',
			allowBlank : false,
			width : 120,
			anchor : '95%'
		},
		'thisuser' : {
			name : 'thisuser',
			fieldLabel : '负责人',
			allowBlank : false,
			anchor : '95%'
		},
		'plantime' : {
			name : 'plantime',
			fieldLabel : '计划完成时间',
			allowBlank : false,
			anchor : '95%'
		},
		'lastmonthitem' : {
			name : 'lastmonthitem',
			fieldLabel : '上月项目',
			readOnly : true,
			width : 200,
			anchor : '95%'
		},
		'lastuser' : {
			name : 'lastuser',
			fieldLabel : '负责人',
			readOnly : true,
			width : 200,
			anchor : '95%'
		},
		'complete' : {
			name : 'complete',
			fieldLabel : '完成情况',
			width : 200,
			anchor : '95%'
		},
		'remove' : {
			name : 'remove',
			hidden : true
		}
	};

	var Columns = [{
		name : 'uuid',
		type : 'string'
	},		// Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'reportuuid',
				type : 'string'
			}, {
				name : 'thismonthitem',
				type : 'string'
			}, {
				name : 'thisuser',
				type : 'string'
			}, {
				name : 'plantime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'lastmonthitem',
				type : 'string'
			}, {
				name : 'lastuser',
				type : 'string'
			}, {
				name : 'complete',
				type : 'string'
			}, {
				name : 'remove',
				type : 'string'
			}];

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if (report_Cont_uuid == null || report_Cont_uuid == "") {
		loadFormRecord = new formRecord({
			uuid : '',
			reportuuid : report_uuid,
			thismonthitem : '',
			thisuser : '',
			plantime : '',
			lastmonthitem : '',
			lastuser : '',
			complete : '',
			remove : '0'
		});
	} else {
		DWREngine.setAsync(false);
		baseMgm.findById(bean, report_Cont_uuid, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
	}

	var planTimeField = new Ext.form.DateField({
		name : 'plantime',
		fieldLabel : '计划完成时间',
		allowBlank : false,
		readOnly : true,
		width : 200,
		format : 'Y-m-d'
	})
	var thisUserCombo = new fm.ComboBox({
		name : fc['thisuser'].name,
		fieldLabel : fc['thisuser'].fieldLabel,
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : userDs,
		width : 200,
		readOnly : true
	})
	var lastUserCombo = new fm.ComboBox({
		name : fc['lastuser'].name,
		fieldLabel : fc['lastuser'].fieldLabel,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : userDs,
		width : 200,
		disabled : true,
		readOnly : true
	})

	var lastBtnShow = new Ext.Button({
		text : '上月项目',
		handler : showLastItem
	})
	var completeField = new fm.TextArea({
		name : fc['complete'].name,
		fieldLabel : fc['complete'].fieldLabel,
		readOnly : true,
		width : 340,
		height : 130
	})

	var checkItemPanel = new Ext.Panel({
		layout : "column",
		width : 470,
		bodyStyle : 'border:0px;',
		items : [{
			layout : 'form',
			columnWidth : .5,
			bodyStyle : 'border: 0px;',
			items : [new fm.TextField(fc['thismonthitem'])]
		}, {
			layout : 'form',
			columnWidth : .5,
			bodyStyle : 'border: 0px;',
			items : [lastBtnShow]
		}]
	})

	function showLastItem() {
		if (!formWin) {
			formWin = new Ext.Window({
				title : '选择上月项目',
				width : 600,
				minWidth : 460,
				height : 400,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : false,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [lastItemPanel]
			});
		}
		formWin.show();
	}
	var checkLastBtn = new Ext.Button({
		text : '选择',
		tooltip : '选择',
		iconCls : 'btn',
		handler : checkLastItemFun
	})
	function checkLastItemFun() {
		if (checkLastItem != "" && checkLastItem != "") {
			var form = formPanel.getForm();
			var item = form.findField('thismonthitem').getValue();
			if (item == null || item == "") {
				form.findField('thismonthitem').setValue(checkLastItem);
			}
			var user = form.findField('thisuser').getValue();
			if (user == null || user == "") {
				form.findField('thisuser').setValue(checkLastUser);
			}
			form.findField('lastmonthitem').setValue(checkLastItem);
			form.findField('lastuser').setValue(checkLastUser);
			form.findField('complete').getEl().dom.readOnly = false;
			form.findField('complete').allowBlank = false;
			// o.setDisabled(true);
			// o.allowBlank=true;
			formWin.hide();
		}
	}

	// ----------------上月项目列表

	var ColumnsItem = [{
		name : 'uuid',
		type : 'string'
	}, {
		name : 'thismonthitem',
		type : 'string'
	}, {
		name : 'thisuser',
		type : 'string'
	}]
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'uuid',
		header : 'UUID',
		dataIndex : 'uuid',
		hidden : true
	}, {
		id : 'thismonthitem',
		header : '上月项目',
		dataIndex : 'thismonthitem'
	}, {
		id : 'thisuser',
		header : '责任人',
		dataIndex : 'thisuser',
		renderer : function(value) {
			for (var i = 0; i < user.length; i++) {
				if (value == user[i][0]) {
					return user[i][1];
				}
			}
		}
	}]);

	// 查询出上月计划的UUID
	var lastUuid = "";
	DWREngine.setAsync(false);
	baseMgm.getData("select UUID from GZ_MONTH_REPORT where REPORTDEPT='"
			+ USERDEPTID
			+ "' and TO_DATE(reportMonth,'YYYYMM') = ADD_MONTHS(TO_DATE('"
			+ month + "','YYYYMM'),-1)", function(list) {
		if (list.length > 0) {
			lastUuid = list[0]
		}
	});
	DWREngine.setAsync(true);
	// Select thisMonthItem,thisUser from GZ_MONTH_REPORT_LIST where
	// reportUuid=(select UUID from GZ_MONTH_REPORT where
	// TO_DATE(reportMonth,'YYYYMM') =
	// ADD_MONTHS(TO_DATE('201002','YYYYMM'),-1))
	filterStrItem = "reportUuid='" + lastUuid + "' ";

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : filterStrItem
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, ColumnsItem),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	// ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	var lastItemPanel = new Ext.grid.GridPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		split : true,
		height : 286,
		model : 'mini',
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['选择上月项目', '->', checkLastBtn],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
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
		})
	})
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	sm.on('rowselect', function(sm, rowIndex, record) {
		checkLastItem = record.get('thismonthitem');
		checkLastUser = record.get('thisuser');
	})

	var formPanel = new Ext.FormPanel({
		id : 'form-panel',
		header : false,
		border : false,
		autoScroll : true,
		// width: 500,
		region : 'center',
		bodyStyle : 'padding:10px 10px;',
		labelAlign : 'left',
		items : [new Ext.form.FieldSet({
			title : '基本信息',
			autoWidth : true,
			border : true,
			layout : 'column',
			items : [new fm.TextField(fc['uuid']),
					new fm.TextField(fc['reportuuid']),
					new fm.TextField(fc['remove']), {
						layout : 'form',
						columnWidth : .70,
						bodyStyle : 'border:0px;',
						items : [
								checkItemPanel,
								// new fm.TextField(fc['thismonthitem']),
								// new fm.TextField(fc['thisuser']),
								// new fm.DateField(fc['plantime'])
								// lastBtn,
								thisUserCombo,
								planTimeField,
								// ]
								// },
								// {
								// layout: 'form',
								// columnWidth:.40,
								// bodyStyle: 'border:0px;',
								// items:[
								new fm.TextField(fc['lastmonthitem']),
								lastUserCombo,
								// new fm.TextArea(fc['complete'])
								completeField]
					}]
		})],
		buttons : [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	});

	var contentPanel = new Ext.Panel({
		region : 'center',
		border : false,
		layout : 'fit',
		tbar : ['<font color=#15428b><b>&nbsp;部门月工作计划</b></font>', '->',
				BUTTON_CONFIG['BACK']],
		items : [formPanel]
	});

	// 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
		layout : 'border',
		autoWidth : true,
		items : [contentPanel]
	});

	// 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);

	function formSave() {
		var form = formPanel.getForm();
		var thisitem = form.findField('thismonthitem').getValue();
		var thisuser = form.findField('thisuser').getValue();
		var plantime = form.findField('plantime').getValue();
		var lastitem = form.findField('lastmonthitem').getValue();
		var complete = form.findField('complete').getValue();
		if (thisitem == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '本月项目不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (thisuser == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '工作详情本月项目负责人不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (plantime == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '计划完成时间不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		
		if (lastitem != "" && complete == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '完成情况不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
	
		if (form.isValid()) {
			doFormSave();
		}
	}
	
	function doFormSave(dataArr) {
		
		var form = formPanel.getForm()
		var obj = form.getValues()
		for (var i = 0; i < Columns.length; i++) {
			var n = Columns[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		
		
		DWREngine.setAsync(false);
		if (obj.uuid == '' || obj.uuid == null) {
			gzJhMgm.addOrUpdateMonthReportList(obj, function(state) {
				if ("1" == state) {
					// if(isFlwTask != true){
					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.month.report.jsp?uuid="
							+ report_uuid + "&flowid=" + bh_flow + flow;
					window.location.href = url;
					// }else{
					/*
					 * Ext.Msg.show({ title: '保存成功！', msg: '您成功新增了一条部门工作周报！ <br>下一步进行物资材料的选择！',
					 * buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO, fn:
					 * function(value){ if ('ok' == value){ var url =
					 * BASE_PATH+"Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&flowid="+obj.bh;
					 * window.location.href = url; } } });
					 */
					// }
				} else {
					Ext.Msg.show({
						title : '提示',
						msg : state,
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		} else {
			
			
			gzJhMgm.addOrUpdateMonthReportList(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.month.report.jsp?uuid="
							+ report_uuid + "&flowid=" + bh_flow + flow;
					window.location.href = url;
				} else {
					Ext.Msg.show({
						title : '提示',
						msg : state,
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
		}
		DWREngine.setAsync(true);
	}

})