var xgridUrl = CONTEXT_PATH
		+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
var queryStr = "?";
queryStr += 'sj_type=2011'; // 时间
queryStr += '&unit_id=' + defaultOrgRootID; // 取表头用
queryStr += '&keycol=uids';
queryStr += '&headtype=PC_TZGL_MONTH_INVEST_VIEW'; // 类型
queryStr += '&hasSaveBtn=false'; // 是否显示保存按钮，如果支持新增、编辑、删除的操作，此参数设置为true;
queryStr += '&hasInsertBtn=false'; // grid是否可新增；
queryStr += '&hasDelBtn=false'; // grid是否可删除；
queryStr += '&hasFooter=false'; // grid下面的汇总行是否显示
queryStr += '&searchFlag=false'; // 是否显示表头检索框

Ext.onReady(function() {
	var mainPanel = new Ext.Panel({
		id : 'main-panel',
		title : '投资完成情况报表',
		html : '<iframe name="reportFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [mainPanel]
	});

	showReport(CURRENTAPPID, sj);

	function showReport(pid, sjType) {
		var curQueryStr = "&filter= and " + (sjType ? "sj_type='" + sj : "pid='" + pid) + "'";
		window.frames['reportFrame'].location = xgridUrl + queryStr + curQueryStr;
	}

});