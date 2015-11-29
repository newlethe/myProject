<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>平衡检查</title>
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/examples.css" />
		<link rel="stylesheet" type="text/css"
			href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-green.css" />
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-lang-zh_CN.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>extExtend/examples.js"></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/storageMgmImpl.js'></script>
	</head>

	<body>
	</body>
</html>

<script>
Ext.onReady(function(){
	var container = new Ext.Panel({
		region: 'center',
		title:'库存物资',
		border: false,
		html: '<iframe name=content1 src=Business/wzgl/storage/wz.storage.balanceCheck.kcwzGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	var inputPanel = new Ext.Panel({
		renderTo: document.body,
		border: false,
		title:'入库单据',
		header : false,
		html: '<iframe name=content2 src=Business/wzgl/storage/wz.storage.balanceCheck.inputGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	var outputPanel = new Ext.Panel({
		renderTo: document.body,
		border: false,
		title:'出库单据',
		header : false,
		html: '<iframe name=content3 src=Business/wzgl/storage/wz.storage.balanceCheck.outputGrid.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 300,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[inputPanel,outputPanel]
    });	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[container,tabs]
	});
});
</script>
