var bean = "com.sgepit.pmis.routine.hbm.GzMonthReport";
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

var reportuser = new Array();
var reportdept = new Array();
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
						+ "Business/routine/gz.month.report.jsp?uuid="
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
						+ "Business/routine/gz.month.report.jsp?uuid="
						+ uuid_edit + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		}
	};

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
		'reportmonth' : {
			name : 'reportmonth',
			fieldLabel : '汇报月份',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '汇报时间',
			readOnly : true,
			anchor : '95%'
		},
		'reportuser' : {
			name : 'reportuser',
			fieldLabel : '汇报人',
			readOnly : true,
			anchor : '95%'
		},
		'reportdept' : {
			name : 'reportdept',
			fieldLabel : '汇报部门',
			readOnly : true,
			anchor : '95%'
		},
		'reportdeptlead' : {
			name : 'reportdeptlead',
			fieldLabel : '部门领导',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		},
		'planstate' : {
			name : 'planstate',
			fieldLabel : '计划状态',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		},
		'completestate' : {
			name : 'completestate',
			fieldLabel : '完成状态',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		},
		'recordstate' : {
			name : 'recordstate',
			fieldLabel : '记录状态',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '审批流程状态',
			hidden : true,
			readOnly : true,
			anchor : '95%'
		}
	}
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
		name : 'reportmonth',
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
			reportmonth : '',
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
			if (obj.reportmonth != null && obj.reportmonth != "") {
				obj.month = obj.reportmonth.substr(0, 4) + "年"
						+ obj.reportmonth.substr(4, 2) + "月";
			}
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
	}

	var reportTimeField = new Ext.form.DateField({
		name : 'reporttime',
		fieldLabel : '汇报时间',
		allowBlank : false,
		format : 'Y-m-d H:i',
		menu : new DatetimeMenu()
	})

	var monthField = new Ext.ux.MonthField({
		id : 'month',
		fieldLabel : '汇报月份',
		allowBlank : false,
		readOnly : true,
		format : 'Y年m月',
		altFormats : 'Y年m月',
		listeners : {
			"blur" : insertReportMonth
		}
	});

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
					new fm.TextField(fc['reportmonth']),
					new fm.TextField(fc['reportdeptlead']),
					new fm.TextField(fc['planstate']),
					new fm.TextField(fc['billstate']),
					new fm.TextField(fc['completestate']),
					new fm.TextField(fc['recordstate']), {
						layout : 'form',
						columnWidth : .60,
						bodyStyle : 'border:0px;',
						items : [new fm.TextField(fc['flowid']), monthField,
								reportTimeField, reportUserField,
								reportDeptField]
					}]
		})],
		buttons : [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	})

	var contentPanel = new Ext.Panel({
		region : 'center',
		border : false,
		layout : 'fit',
		tbar : ['<font color=#15428b><b>&nbsp;部门月工作计划</b></font>', '->',
				BUTTON_CONFIG['BACK']],
		items : [formPanel]
	})

	var viewport = new Ext.Viewport({
		layout : 'border',
		autoWidth : true,
		items : [contentPanel]
	});

	formPanel.getForm().loadRecord(loadFormRecord);
	formPanel.getForm().findField('reportuser').setValue(reportUser[0][0]);
	formPanel.getForm().findField('reportdept').setValue(reportDept[0][0]);

	if (isFlwTask) {
		Ext.get('reset').setVisible(false);
		Ext.get('back').setVisible(false);
	}

	function formSave() {
		var form = formPanel.getForm();
		var reportmonth = form.findField('reportmonth').getValue();
		var flowid = form.findField('flowid').getValue();
		var time = form.findField('reporttime').getValue();
		var dept = form.findField('reportdept').getValue();
		var user = form.findField('reportuser').getValue();
		if (flowid == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '流程编号不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (reportmonth == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '汇报月份有误，请重新选择！',
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
			gzJhMgm.addOrUpdateMonthReport(obj, function(state) {
				if ("1" == state) {
					if (isFlwTask != true) {
						Ext.example.msg('保存成功！', '您成功新增了一条信息！');
						// history.back();
						var url = BASE_PATH
								+ "Business/routine/gz.month.report.jsp?uuid="
								+ uuid_edit;
						window.location.href = url;
					} else {
						Ext.Msg.show({
							title : '保存成功！',
							msg : '您成功新增了一条部门工作月报！　　　<br>下一步进行月报的详细内容填写！',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO,
							fn : function(value) {
								if ('ok' == value) {
									var url = BASE_PATH
											+ "Business/routine/gz.month.report.jsp?flowid="
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
			gzJhMgm.addOrUpdateMonthReport(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.month.report.jsp?flowid="
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

	function insertReportMonth() {
		var form = formPanel.getForm();
		var month = form.findField('month').getValue().format("Ym");
		var reportMonthValue = month;
		// 2010-11-16 zhangh 在此处检查同一部门汇报月份的唯一性
		DWREngine.setAsync(false);
		baseMgm.getData("select * from gz_month_report where REPORTMONTH='"
				+ reportMonthValue + "' and REPORTDEPT='" + USERDEPTID + "'",
				function(list) {
					if (list.length > 0) {
						Ext.Msg.show({
							title : '提示',
							msg : "本期月报已经存在，请勿重复汇报！",
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.ERROR
						});
					} else {
						form.findField('reportmonth')
								.setValue(reportMonthValue);
					}
				})
		DWREngine.setAsync(true);
	}
})