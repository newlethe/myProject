var bean = "com.sgepit.pmis.routine.hbm.GzWeekReport";
var business = "baseMgm";
var listMethod = "findwhereorderby";

var planstate = new Array();
planstate = [['0', '未汇总'], ['1', '已汇总']];
var completestate = new Array();
completestate = [['0', '未完成'], ['1', '已完成']];
var billstate = new Array();
billstate = [['0', '新增'], ['-1', '审批中'], ['1', '已审批']];

var monthArray = [['01', '01月'], ['02', '02月'], ['03', '03月'], ['04', '04月'],
		['05', '05月'], ['06', '06月'], ['07', '07月'], ['08', '08月'],
		['09', '09月'], ['10', '10月'], ['11', '11月'], ['12', '12月']];
var weekArray = [['01', '第1周'], ['02', '第2周'], ['03', '第3周'], ['04', '第4周']];

var reportuser = new Array();
var reportdept = new Array();
var reportdeptlead = new Array();
var pid=CURRENTAPPID;
Ext.onReady(function() {
	var flow = ""
	if (isFlwTask) {
		flow = "&isTask=true"
	}

	var BUTTON_CONFIG = {
		'BACK' : {
			text : '返回',
			id : 'back',
			iconCls : 'returnTo',
			handler : function() {
				// history.back();
				var url = BASE_PATH
						+ "Business/routine/gz.week.report.jsp?uuid="
						+ uuid_edit + "&flowid=" + bh_flow + flow;
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
						+ "Business/routine/gz.week.report.jsp?uuid="
						+ uuid_edit + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		}
	};

	/*
	 * //新增编号获取 maxStockBhPrefix = USERNAME + new Date().format('ym');
	 * DWREngine.setAsync(false);
	 * stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","GZ_WEEK_REPORT",null,function(dat){
	 * if(dat != "") { maxStockBh = dat; incrementLsh =
	 * (maxStockBh.substr(maxStockBhPrefix.length,4)) *1 } });
	 * 
	 * 
	 * //汇总状态 appMgm.getCodeValue('汇总状态',function(list){ for(i = 0; i <
	 * list.length; i++) { var temp = new Array();
	 * temp.push(list[i].propertyCode); temp.push(list[i].propertyName);
	 * planstate.push(temp); } });
	 * 
	 * //完成情况 appMgm.getCodeValue('完成情况',function(list){ for(i = 0; i <
	 * list.length; i++) { var temp = new Array();
	 * temp.push(list[i].propertyCode); temp.push(list[i].propertyName);
	 * completestate.push(temp); } });
	 * 
	 * 
	 * DWREngine.setAsync(true);
	 */

	DWREngine.setAsync(false);
	// -----------------汇报人
	var reportUser = new Array();
	baseMgm.getData("select userid,realname from rock_user where userid = '"
			+ USERID + "'", function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			reportUser.push(temp);
		}
	});

	// -----------------汇报部门
	var reportDept = new Array();
	
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"
			+ USERDEPTID + "' order by unitid", function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			reportDept.push(temp);
		}
	});

	DWREngine.setAsync(true);
	var reportUserDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : reportUser
	})
	var reportDeptDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : reportDept
	})

	/*
	 * var planStateDs = new Ext.data.SimpleStore({ fields:['k','v'],
	 * data:planstate }) var completeStateDs = new Ext.data.SimpleStore({
	 * fields:['k','v'], data:completestate })
	 */

	var fm = Ext.form;

	var fc = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : 'UUID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'pid',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'flowid' : {
			name : 'flowid',
			fieldLabel : '编号',
			readOnly : true,
			anchor : '95%'
		},
		'reportweek' : {
			name : 'reportweek',
			fieldLabel : '汇报周期',
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '汇报时间',
			anchor : '95%'
		},
		'reportuser' : {
			name : 'reportuser',
			fieldLabel : '汇报人',
			anchor : '95%'
		},
		'reportdept' : {
			name : 'reportdept',
			fieldLabel : '汇报部门',
			anchor : '95%'
		},
		'reportdeptlead' : {
			name : 'reportdeptlead',
			fieldLabel : '部门领导',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'planstate' : {
			name : 'planstate',
			fieldLabel : '汇总状态',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '审批流程状态',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'completestate' : {
			name : 'completestate',
			fieldLabel : '完成情况',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'recordstate' : {
			name : 'recordstate',
			fieldLabel : '记录状态',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}

	};

	Columns = [{
		name : 'uuid',
		type : 'string'
	},
	{
		name : 'pid',
		type : 'string'
	},
	{
		name : 'flowid',
		type : 'string'
	}, {
		name : 'reportweek',
		type : 'string'
	}, {
		name : 'reporttime',
		type : 'date',
		dateFormat : 'Y-m-d H:i:s'
	}, {
		name : 'reportuser',
		type : 'string'
	}, {
		name : 'reportdept',
		type : 'string'
	}, {
		name : 'reportdeptlead',
		type : 'string'
	}, {
		name : 'planstate',
		type : 'string'
	}, {
		name : 'billstate',
		type : 'float'
	}, {
		name : 'completestate',
		type : 'string'
	}, {
		name : 'recordstate',
		type : 'string'
	}];

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if (uuid_edit == null || uuid_edit == "") {
		var bill = 0;
		if(isFlwTask){
			bill = -1;
		}
		loadFormRecord = new formRecord({
			uuid : '',
			flowid : bh_flow,
			month : new Date().format('m'),
			reportweek : '',
			reporttime : '',
			reportuser : '',
			reportdept : '',
			reportdeptlead : '',
			planstate : '0',
			billstate : bill,
			completestate : '0',
			recordstate : '0',
			pid:pid
		});
	} else {
		DWREngine.setAsync(false);
		baseMgm.findById(bean, uuid_edit, function(obj) {
			if (obj.reportweek != null && obj.reportweek != "") {
				obj.month = obj.reportweek.substr(4, 2);
				obj.week = obj.reportweek.substr(6, 2);
			}
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
	}

	var comboMonth = new Ext.form.ComboBox({
		id : 'month',
		fieldLabel : '汇报周期',
		allowBlank : false,
		readOnly : true,
		width : 70,
		valueField : 'id',
		displayField : 'name',
		store : new Ext.data.SimpleStore({
			fields : ['id', 'name'],
			data : monthArray
		}),
		mode : 'local',
		displayField : 'name',
		valueField : 'id',
		triggerAction : 'all',
		listeners : {
			select : insertReportWeek
		}
	});
	var comboWeek = new Ext.form.ComboBox({
		id : 'week',
		hideLabel : true,
		allowBlank : false,
		readOnly : true,
		width : 70,
		store : new Ext.data.SimpleStore({
			fields : ['id', 'name'],
			data : weekArray
		}),
		mode : 'local',
		displayField : 'name',
		valueField : 'id',
		triggerAction : 'all',
		listeners : {
			select : insertReportWeek
		}
	});

	var reportWeekAllField = new Ext.Panel({
		layout : "column",
		width : 360,
		bodyStyle : 'border:0px;',
		items : [{
			layout : 'form',
			columnWidth : .5,
			bodyStyle : 'border: 0px;',
			items : [comboMonth]
		}, {
			layout : 'form',
			columnWidth : .5,
			bodyStyle : 'border: 0px;',
			items : [comboWeek]
		}]
	})

	var reportTimeField = new Ext.form.DateField({
		name : 'reporttime',
		fieldLabel : '汇报时间',
		allowBlank : false,
		format : 'Y-m-d H:i',
		menu : new DatetimeMenu()
	})

	var reportUserField = new fm.ComboBox({
		name : 'reportuser',
		fieldLabel : '汇报人',
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : reportUserDs,
		readOnly : true
	})

	var reportDeptField = new fm.ComboBox({
		name : 'reportdept',
		fieldLabel : '汇报部门',
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : reportDeptDs,
		readOnly : true
	})

	var formPanel = new Ext.FormPanel({
		id : 'form-panel',
		header : false,
		border : false,
		autoScroll : true,
		region : 'center',
		bodyStyle : 'padding:10px 10px;',
		labelAlign : 'left',
		items : [new Ext.form.FieldSet({
			title : '基本信息',
			autoWidth : true,
			border : true,
			layout : 'column',
			items : [new fm.TextField(fc['uuid']),
				     new fm.TextField(fc['pid']),
					new fm.TextField(fc['reportweek']),
					new fm.TextField(fc['reportdeptlead']),
					new fm.TextField(fc['planstate']),
					new fm.TextField(fc['billstate']),
					new fm.TextField(fc['completestate']),
					new fm.TextField(fc['recordstate']), {
						layout : 'form',
						columnWidth : .60,
						bodyStyle : 'border:0px;',
						items : [new fm.TextField(fc['flowid']),
								reportWeekAllField, reportTimeField,
								reportUserField, reportDeptField]
					}]
		})],
		buttons : [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	});

	var contentPanel = new Ext.Panel({
		region : 'center',
		border : false,
		layout : 'fit',
		tbar : ['<font color=#15428b><b>&nbsp;部门周工作计划</b></font>', '->',
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

	formPanel.getForm().findField('reportuser').setValue(reportUser[0][0]);
	formPanel.getForm().findField('reportdept').setValue(reportDept[0][0]);

	if (isFlwTask) {
		Ext.get('reset').setVisible(false);
		Ext.get('back').setVisible(false);
	}

	function formSave() {
		var form = formPanel.getForm();
		var reportweek = form.findField('reportweek').getValue();
		var month = form.findField('month').getValue();
		var week = form.findField('week').getValue();
		var time = form.findField('reporttime').getValue();
		var dept = form.findField('reportdept').getValue();
		var user = form.findField('reportuser').getValue();
		if (month == "" || week == "" || reportweek == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '汇报周期有误，请重新选择！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (time == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '汇报时间不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (user == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '汇报人不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (dept == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '汇报部门不能为空！',
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
			gzJhMgm.addOrUpdateWeekReport(obj, function(state) {
				if ("1" == state) {
					if (isFlwTask != true) {
						Ext.example.msg('保存成功！', '您成功新增了一条信息！');
						// history.back();
						// var url =
						// BASE_PATH+"Business/routine/gz.week.report.jsp?uuid="+uuid_edit+"&flowid="+bh_flow;
						var url = BASE_PATH
								+ "Business/routine/gz.week.report.jsp?uuid="
								+ uuid_edit;
						window.location.href = url;
					} else {
						Ext.Msg.show({
							title : '保存成功！',
							msg : '您成功新增了一条部门工作周报！　　　<br>下一步进行周报的详细内容填写！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO,
							fn : function(value) {
								if ('ok' == value) {
									var url = BASE_PATH
											+ "Business/routine/gz.week.report.jsp?flowid="
											+ obj.flowid + "&uuid=" + flow;
									window.location.href = url;
								}
							}
						});
					}
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
			gzJhMgm.addOrUpdateWeekReport(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.week.report.jsp?flowid="
							+ obj.flowid + "&uuid=" + uuid_edit + flow;
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

	function insertReportWeek() {
		var form = formPanel.getForm();
		var month = form.findField('month').getValue();
		var week = form.findField('week').getValue();
		var dept = form.findField('reportdept').getValue();
		if (month == null || month == "") {
			month = new Date().format('m');
		}
		var reportWeekValue = new Date().format('Y') + month + week;
		// 2010-11-10 zhangh 在此处检查同一部门汇报周期的唯一性
		DWREngine.setAsync(false);
		baseMgm.getData("select * from gz_week_report where REPORTWEEK='"
				+ reportWeekValue + "' and REPORTDEPT='" + USERDEPTID + "'",
				function(list) {
					if (list.length > 0) {
						Ext.Msg.show({
							title : '提示',
							msg : "本期周报已经存在，请勿重复汇报！",
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
						// form.findField('week').setValue('');
					} else {
						form.findField('reportweek').setValue(reportWeekValue);
					}
				})
		DWREngine.setAsync(true);
	}

})