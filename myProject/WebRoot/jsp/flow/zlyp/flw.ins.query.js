var title = new Ext.form.TextField({
	id: 'title', name: 'title'
});

var beginDate = new Ext.form.DateField({
	id: 'bDate', name: 'bDate',
	format: 'Y-m-d'
});

var endDate = new Ext.form.DateField({
	id: 'eDate', name: 'eDate',
	format: 'Y-m-d'
});

var doSelect = new Ext.Button({
	text: '查询',
	iconCls: 'btn',
	handler: selHandler
});

var newFlow = new Ext.Button({
	text: '发起流程',
	iconCls: 'returnTo',
	handler: fireFlow
});

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
			id: 'flow_remove', text: '　删除流程', iconCls: 'multiplication',
			disabled: type == 'flowed' ? true : false,
			handler: controlHandler
		}, {
			id: 'remove_tozl', text: '　移交当前资料', iconCls: 'print',
			disabled: type == 'flowing' ? true : false,hidden:false,
			handler: controlHandler
		}, {
			id: 'remove_all', text: '　移交全部资料', iconCls: 'print',
			disabled: type == 'flowing' ? true : false,hidden:false,
			handler: controlHandler
		}, {
			id: 'reset', text: '　重置受理人', iconCls: 'pasteUser0',
			disabled: type == 'flowed' ? true : false,
			handler: controlHandler
		}, {
			id: 'save_flw_title', text: '　修改主题', iconCls: 'save',
			disabled: type == 'flowed' ? true : false,
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
		'<font color=#15428b>主题：</font>', title, '-',
		'<font color=#15428b>时间：</font>', beginDate, '-', endDate, '->', doSelect, '-', newFlow, '-', controlMenu, '-']
});

function selHandler(){
	if ("" != beginDate.getValue && "" != endDate.getValue() && beginDate.getValue() > endDate.getValue()){
		Ext.example.msg('提示！', '查询结束日期必须大于开始日期！');
		return;
	}else{
		sql = params;
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
	}
}

function controlHandler(){
	var _type = this.id;
	if ('remove_all' == _type) {
		if(!window["filesWin"]||!(window["filesWin"].show)){
			window["filesWin"] = new Flw.FlwFilesWindow({});
		}
		window["filesWin"].show(ds);
	}else if (grid.getSelectionModel().getSelected()){
		var record = grid.getSelectionModel().getSelected();
		if ('log' == _type) {
			parent.showLogWin(record.get('insid'), record.get('title'));
		} else if ('file' == _type) {
			parent.showFlowFile(record.get('insid'), record.get('title'));
		} else if ('adjunct' == _type) {
			parent.showFlowAdjunct(record.get('insid'), record.get('title'));
		} else if ('module' == _type) {
			parent.showModule(record.get('insid'), record.get('title'));
		} else if ('flow_remove' == _type) {
			removeFlow(record.get('insid'));
		}  else if ('reset' == _type) {
			parent.resetRecipients(record.get('insid'), record.get('title'));
		} else if ('save_flw_title' == _type) {
			parent.saveFlwTitle(record.get('insid'), record.get('title'));
		} else if ('remove_tozl' == _type) {
			if(!window["filesWin"]||!(window["filesWin"].show)){
				window["filesWin"] = new Flw.FlwFilesWindow({});
			}
			window["filesWin"].show(ds,record.get('insid'), record.get('title'));
		}
	} else {
		Ext.example.msg('提示', '请先选择一条数据！');
	}
}

function formatDate(value){
    return value ? value.dateFormat('Y-m-d') : '';
}

function fireFlow(){
	parent.showFlow();
}