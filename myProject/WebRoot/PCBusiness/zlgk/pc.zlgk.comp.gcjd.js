var xgridUrl = CONTEXT_PATH
		+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";

var queryStr = "?";
queryStr += 'sj_type=2011'; // 时间
queryStr += '&unit_id='+CURRENTAPPID; // 取表头用
queryStr += '&company_id='+CURRENTAPPID; // 取数据用（为空是全部单位）
queryStr += '&keycol=uids';
queryStr += '&headtype=PC_ZLGK_ZLYP_COMP';	//类型编号
queryStr += '&ordercol=sj_type desc';
queryStr += '&hasSaveBtn=false';	//是否显示保存按钮，如果支持新增、编辑、删除的操作，此参数设置为true;
queryStr += '&hasInsertBtn=false';	//grid是否可新增；
queryStr += '&hasDelBtn=false';		//grid是否可删除；

Ext.onReady(function(){
	var mainPanel = new Ext.Panel({
		id : 'main-panel',
		title : '质量验评汇总查询',
		html : '<iframe name="reportFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [mainPanel]
	});
	
	window.frames['reportFrame'].location = xgridUrl+queryStr;
	mainPanel.setTitle(CURRENTAPPNAME + ' - 质量验评汇总查询');
});