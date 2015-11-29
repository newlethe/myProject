<%@ page language="java" pageEncoding="GBK"%>
<!-- @author:guox  -->
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<html>
	<head>
		<base href="<%=basePath%>">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>WORD模板文件</title>
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css"/>
	 	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
	    <script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		
	    <style type="text/css">
			html, body {
		        font:normal 12px verdana;
		        margin:0;
		        padding:0;
		        border:0 none;
		        overflow:hidden;
		        height:100%;
		    }
		</style>
	</head>
	<body onunload="gc()"></body>
</html>

<script type="text/javascript">
function gc() {
	var frm = window.frames["grid1"]
	frm.location.href = "about:blank"
	frm = null
}

Ext.onReady(function(){
	var tbar = new Ext.Toolbar({height:25})
	var container = new Ext.Panel({
		region: 'center',
		renderTo: document.body,
		border: false,
		tbar: tbar,
		html: '<iframe name="grid1" src="Business/jsp/common/templet/docTempletGrid.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container]
	});
	
	var addBtn = new Ext.Toolbar.Button({
			id: 'add',
			text: '新增',
			cls: 'x-btn-text-icon',
			icon: '<%=path%>/images/icons/toolbar_item_add.png',
			handler: onItemClick
	});
	
	var editBtn = new Ext.Toolbar.Button({
			id: 'edit',
			text: '编辑',
			cls: 'x-btn-text-icon',
			icon: '<%=path%>/images/icons/toolbar_item_edit.png',
			handler: onItemClick
	});
	
	var delBtn = new Ext.Toolbar.Button({
			id: 'del',
			text: '删除',
			cls: 'x-btn-text-icon',
			icon: '<%=path%>/images/icons/toolbar_item_del.png',
			handler: onItemClick
	});
	tbar.add(addBtn,editBtn,delBtn)
});

function onItemClick(item) {
	var gridfrm = window.frames["grid1"]
	switch(item.id) {
		case 'add':
			gridfrm.dbnetgrid1.actionTable.all.insertBtn.click()
			break;
		case 'del':
			gridfrm.dbnetgrid1.toolbar.all.deleteBtn.click()
			break;
		case 'edit':
			gridfrm.dbnetgrid1.toolbar.all.updateBtn.click()
			break;
	}
}
</script>