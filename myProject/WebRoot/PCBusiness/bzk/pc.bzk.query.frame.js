if (parent.CT_TOOL_DISPLAY) {
	parent.CT_TOOL_DISPLAY(false);
}
if (parent.wanyuan) {
	parent.wanyuan.setText('');
}

var _reg = /,/g // 正则表达式
var sqlPid = USERPIDS.replace(_reg, "','");
sqlPid = "('" + sqlPid + "')";

Ext.onReady(function() {

	var toolbar = new Ext.Toolbar({
		items : [{
			id : 'bzkfl',
			text : '标准库分类',
			handler : function(){
				openUrl("bzkfl");
			}
		},{
			id : 'bzkfb',
			text : '标准库发布',
			handler : function(){
				openUrl("bzkfb");
			}
		}]
	});

	var panel = new Ext.Panel({
		layout : 'fit',
		region : 'center',
		border : false,
		header : false,
		contentEl : 'mainDiv',
		tbar : toolbar
	});

	new Ext.Viewport({
		layout : 'fit',
		items : [panel]
	});

	window.frames[0].location.href = CONTEXT_PATH + "/Business/fileAndPublish/search/com.fileSearch.main.jsp?rootId=bzk";
	function openUrl(p){
		var powername = p == "bzkfl" ? "标准库分类" : "标准库发布";
	
		parent.lt.expand();
		parent.proTreeCombo.show();
		parent.proTreeCombo.setValue(CURRENTAPPID);
		parent.backToSubSystemBtn.show();
		parent.pathButton.setText("<b>当前位置:"+parent.selectedSubSystemName+"/"+powername+"</b>")
		var url = "/Business/fileAndPublish/sort/com.fileSort.jsp?rootId=bzk&isSortIssue=1";
		if (p == "bzkfb"){
			url = "/Business/fileAndPublish/fileManage/com.fileManage.jsp?rootId=bzk&disableOlEdit=1&exchangeOnPublish=1&hasTemplateBtn=1";
		}
		parent.frames["contentFrame"].location.href = CONTEXT_PATH + url;
	}
})