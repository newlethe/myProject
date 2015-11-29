var bean = "com.sgepit.pmis.routine.hbm.GzWeekReportList";
var business = "baseMgm";
var listMethod = "findwhereorderby";

var contenttype = new Array();
contenttype = [['0', '本周完成情况'], ['1', '本周存在的问题'], ['2', '需要上级解决的问题'],
		['3', '下周工作计划']];
Ext.onReady(function() {

	var flow = ""
	if (isFlwTask) {
		flow = "&isTask=true"
	}

	var BUTTON_CONFIG = {
		'BACK' : {
			text : '返回',
			iconCls : 'returnTo',
			handler : function() {
				// history.back();
				var url = BASE_PATH
						+ "Business/routine/gz.week.report.jsp?uuid="
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
						+ "Business/routine/gz.week.report.jsp?uuid="
						+ report_uuid + "&flowid=" + bh_flow + flow;
				window.location.href = url;
			}
		}
	};

	var contentTypeDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : contenttype
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
		'reportuuid' : {
			name : 'reportuuid',
			fieldLabel : '周报编号',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'reportcontent' : {
			name : 'reportcontent',
			fieldLabel : '工作详情',
			anchor : '95%'
		},
		'contenttype' : {
			name : 'contenttype',
			fieldLabel : '内容分类',
			anchor : '95%'
		},
		'remove' : {
			name : 'remove',
			hidden : true
		}
	};

	Columns = [{
		name : 'uuid',
		type : 'string'
	}, {
		name : 'reportuuid',
		type : 'string'
	}, {
		name : 'reportcontent',
		type : 'string'
	}, {
		name : 'contenttype',
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
			reportcontent : '',
			contenttype : '0',
			remove : '0'
		});
	} else {
		DWREngine.setAsync(false);
		baseMgm.findById(bean, report_Cont_uuid, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
	}

	var contentTypeld = new fm.ComboBox({
		name : 'contenttype',
		fieldLabel : '内容分类',
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : contentTypeDs,
		readOnly : true
	})

	var reportContentField = new fm.TextArea({
		name : 'reportcontent',
		fieldLabel : '工作详情',
		allowBlank : false,
		width : 360,
		height : 200
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
					new fm.TextField(fc['reportuuid']),
					new fm.TextField(fc['remove']), {
						layout : 'form',
						columnWidth : .60,
						bodyStyle : 'border:0px;',
						items : [contentTypeld, reportContentField]
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

	function formSave() {
		
		var form = formPanel.getForm();
		var cont = form.findField('reportcontent').getValue();
		var type = form.findField('contenttype').getValue();
		if (type == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '内容分类不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		if (cont == "") {
			Ext.Msg.show({
				title : '提示',
				msg : '工作详情不能为空！',
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
			gzJhMgm.addOrUpdateWeekReportList(obj, function(state) {
				if ("1" == state) {
					// if(isFlwTask != true){
					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.week.report.jsp?uuid="
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
			gzJhMgm.addOrUpdateWeekReportList(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					// history.back();
					var url = BASE_PATH
							+ "Business/routine/gz.week.report.jsp?uuid="
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