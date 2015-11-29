var flowtitle = new Ext.form.TextField({
	id: 'flowtitle', name: 'flowtitle',
	fieldLabel: "流程类型"
});

var title = new Ext.form.TextField({
	id: 'title', name: 'title',
	fieldLabel: "流程主题"
});

var beginDate = new Ext.form.DateField({
	id: 'bDate', name: 'bDate',
	format: 'Y-m-d',
	fieldLabel: "开始时间"
});

var endDate = new Ext.form.DateField({
	id: 'eDate', name: 'eDate',
	format: 'Y-m-d',
	fieldLabel: "结束时间"
});

var doSelect = new Ext.Button({
	text: '查询',
	iconCls: 'btn',
	handler: selHandler
});
var formPanelQuery;
formPanelQuery = new Ext.FormPanel({
    header: false, border: false, autoScroll: true,
    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
	bbar: ['->',doSelect
	]
});
var fieldSet = new Ext.form.FieldSet({
	title: '字段查询',
     	border: true,
     	layout: 'table',
     	layoutConfig: {columns: 1},
     	defaults: {bodyStyle:'padding:1px 1px'}
});
fieldSet.add(new Ext.Panel({
	layout: 'form',
	border: false,
	width: 400,
	items: [flowtitle]
}));
fieldSet.add(new Ext.Panel({
	layout: 'form',
	border: false,
	width: 400,
	items: [title]
}));
fieldSet.add(new Ext.Panel({
	layout: 'column',
	border: false,
	width: 500,
	items:[{
		layout: 'form', columnWidth: .8, bodyStyle: 'border: 0px;',
					items:[
						beginDate
		]
	},{
		layout: 'form', columnWidth: .8, bodyStyle: 'border: 1px;',
					items:[
			endDate
		]
	}]
}));
formPanelQuery.add(fieldSet);
var controlMenu = new Ext.Button({
	text: '相关操作', iconCls: 'option',
	menu: {
		items: [{
			id: 'log', text: '　流转日志', iconCls: 'refresh',
			handler: controlHandler
		}, {
			id: 'file', text: '　流程文件', iconCls: 'word',
			handler: controlHandler
		}, {
			id: 'adjunct', text: '　流程附件', iconCls: 'copyUser',
			handler: controlHandler
		}, {
			id: 'module', text: '　业务数据', iconCls: 'select',
			handler: controlHandler
		}, {
			id: 'remove_tozl', text: '　移交当前资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}, {
			id: 'remove_all', text: '　移交全部资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}]
	}
});

var qPanel = new Ext.Panel({
	border: false,
	region: 'north',
	split: true,
	bodyStyle: 'display: none;',
	collapseMode: 'mini',
	collapsible: true,
	animCollapse: true,
	collapsed: false,
	bbar: ['-',
		'<font color=#15428b>流程类型：</font>', flowtitle, '-',
		'<font color=#15428b>主题：</font>', title, '-',
		'<font color=#15428b>时间：</font>', beginDate, '-', endDate, '->', doSelect, '-', controlMenu, '-']
});

function selHandler(){
	if ("" != beginDate.getValue && "" != endDate.getValue() && beginDate.getValue() > endDate.getValue()){
		Ext.example.msg('提示！', '查询结束日期必须大于开始日期！');
		return;
	}else{
		sql = params;
		var fFlowtitle = flowtitle.getValue();
		if ('' != fFlowtitle){
			sql += " and flowtitle like '%"+fFlowtitle+"%'";
		}
		var fTitle = title.getValue();
		if ('' != fTitle){
			sql += " and title like '%"+fTitle+"%'";
		}
		var fBeginDate = formatDate(beginDate.getValue());
		var fEndDate = formatDate(endDate.getValue());
		if ('' != fBeginDate && '' == fEndDate) {
			sql += " and ftime > to_date('"+fBeginDate+"','YYYY-MM-DD')";
		} else if ('' == fBeginDate && '' != fEndDate) {
			sql += " and ftime < to_date('"+fEndDate+"','YYYY-MM-DD')";
		} else if ('' != fBeginDate && '' != fEndDate) {
			sql += " and ftime between to_date('"+fBeginDate+"','YYYY-MM-DD') "
			+"and to_date('"+fEndDate+"', 'YYYY-MM-DD')";
		}
		ds.baseParams.params = sql;
		ds.load({
			params: {
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
		});
//		if (!qPanel.collapsed) qPanel.collapse();
	}
	formPanelQuery.getForm().reset();
	formWin.hide();
}

function controlHandler(){
	var _type = this.id;
	if(_type=="remove_all"&&parent.showRemoveFiles) {//parent jsp is flw.main.frame.jsp
		parent.showRemoveFiles(grid.getStore());	
	}else if  (grid.getSelectionModel().getSelected()){
		var record = grid.getSelectionModel().getSelected();
		var _insid = record.get('insid'), _title = record.get('title');
		if(!_insid && !_title){
			_insid = record.get('INSID'); 
			_title = record.get('TITLE');
		}
		if ('log' == _type) {
			parent.showLogWin(_insid, _title);
		} else if ('file' == _type) {
			parent.showFlowFile(_insid, _title);
		} else if ('adjunct' == _type) {
			parent.showFlowAdjunct(_insid, _title);
		} else if ('module' == _type) {
			parent.showModule(_insid, _title);
		} else if ('remove_tozl' == _type) {
			parent.showRemoveFiles(grid.getStore(),_insid, _title);
		} 
	} else {
		Ext.example.msg('提示', '请先选择一条数据！');
	}
}

function formatDate(value){
    return value ? value.dateFormat('Y-m-d') : '';
};