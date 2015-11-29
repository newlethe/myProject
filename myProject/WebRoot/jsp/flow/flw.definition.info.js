
Ext.onReady(function(){
//	var date = new Date();
	//alert(date.dateFormat('Y-m-d H:i'))
	var fm = Ext.form;
	
	//流程实例
	var fc_ins = {
		'insid': {
			name: 'insid',
			fieldLabel: '流程实例主键',
			hidden: true,
			hideLabel: true
		}, 'status': {	//流转状态：0-新建；1-流转；2-休眠；3-结束,0-单节点流转；1-会签；
			name: 'status',
			fieldLabel: '流转状态'
		}, 'params': {
			name: 'params',
			fieldLabel: '业务模块参数'
		}
	};
	
	//流转日志
	var fc_log = {
		'logid': {
			name: 'logid',
			filedLabel: '流转日志主键',
			hidden: true,
			hideLabel: true
		}, 'fromnode': {
			name: 'fromnode',
			fieldLabel: '发送人'
		}, 'tonode': {
			name: 'tonode',
			fieldLabel: '接受人'
		}, 'ftime': {
			name: 'ftime',
			fieldLabel: '发送时间',
			width: 125,
			format: 'Y-m-d',
			minValue: '2000-01-01',
			value: new Date(),
			disabled: true
		}, 'ftype': {
			name: 'ftype',
			fieldLabel: '发送类型'
		}, 'notes': {
			name: 'notes',
			height: 97,
			width: 162,
			fieldLabel: '步骤说明'
		}
	};
	
	//待办事项
	var fc_task = {
		'taskid': {
			name: 'taskid',
			fieldLabel: '待办事项主键',
			hidden: true,
			hideLabel: true
		}, 'title': {
			name: 'title',
			fieldLabel: '主题'
		}, 'property': {
			name: 'property',
			fieldLabel: '任务类型'
		}
	};
	
	var form_ins = new Ext.form.FormPanel({
		id: 'form-ins',
		header: false,
		border: false,
		bodyStyle: 'padding:10px 10px;',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
		items: [
			new Ext.form.FieldSet({
				title: '流程实例',
				border: true,
				layout: 'form',
				items: [
					new fm.TextField(fc_ins['insid']),
					new fm.TextField(fc_ins['status']),
					new fm.TextField(fc_ins['params'])
				]
			})
		]
	});
	
	var getUserBtn = new Ext.Button({
    	iconCls: 'select',
    	tooltip: '选择流程发送人',
    	handler: showWin
    });
    
	var form_log = new Ext.form.FormPanel({
		id: 'form-log',
		header: false,
		border: false,
		bodyStyle: 'padding:10px 10px;',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
		items: [
			new Ext.form.FieldSet({
				title: '流转日志',
				border: true,
				layout: 'table',
				layoutConfig: {columns: 2},
				items: [{
					width: 240,
					layout: 'form', border: false,
					items: [ new fm.TextField(fc_log['tonode']) ]
				},{
					width: 27,
					layout: 'form', border: false,
					items: [ getUserBtn ]
				},{
					width: 240,
					layout: 'form', border: false,
					items: [ new fm.TextField(fc_log['fromnode']) ]
				},{
					width: 27,
					layout: 'form', border: false,
					items: [ new fm.TextField(fc_log['logid']) ]
				},{
					colspan: 2, width: 240,
					layout: 'form', border: false,
					items: [ new fm.DateField(fc_log['ftime']) ]
				},{
					colspan: 2, width: 240,
					layout: 'form', border: false,
					items: [ new fm.TextField(fc_log['ftype']) ]
				},{
					colspan: 2, width: 270,
					layout: 'form', border: false,
					items: [ new fm.TextArea(fc_log['notes']) ]
				}]
			})
		]
	});
	
	var form_task = new Ext.form.FormPanel({
		id: 'form-task',
		header: false,
		border: false,
		bodyStyle: 'padding:10px 10px;',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
		items: [
			new Ext.form.FieldSet({
				title: '待办事项',
				border: true,
				layout: 'form',
				items: [
					new fm.TextField(fc_task['taskid']),
					new fm.TextField(fc_task['title']),
					new fm.TextField(fc_task['property'])
				]
			})
		]
	});
	
	var mainPanel = new Ext.Panel({
		layout: 'column',
		border: false,
		items: [{
			layout: 'form', columnWidth: .5,
			bodyStyle: 'border: 0px;',
			items:[form_ins, form_task]
		},{
			layout: 'form', columnWidth: .5,
			bodyStyle: 'border: 0px;',
			items:[form_log]
		}],
		bbar: ['->', new Ext.Button({text: '确定', iconCls: 'returnTo'})]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [mainPanel]
	});
	
});

function showWin(){
	if(!userWindow){
		userWindow = new Ext.Window({	               
			title: '接受人列表',
			iconCls: 'form',
			layout: 'border',
			width: 600,
			height: 300,
			modal: true,
			closeAction: 'hide',
			maximizable: true,
			plain: true,	                
			items: [treePanel, grid]
		});
		buildOrgTree();
	}
	userWindow.show();
}
