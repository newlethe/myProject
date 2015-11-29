<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备出库稽核_已稽核的设备信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/financialAuditService.js'></script>  
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
</html>

<script type="text/javascript">
Ext.onReady(function(){
	var tab1 = new Ext.Panel({
		title: '设置设备资产分类',
		html: '<iframe name="tab1" src="Business/finalAccounts/financialAudit/equAudit/fa.equ.assets.setting.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});
	
	var tab2 = new Ext.Panel({
		title: '设备资产表',
		html: '<iframe name="tab2" src="Business/finalAccounts/financialAudit/equAudit/fa.equ.assets.list.jsp" frameborder=0 style="width:100%;height:100%;"></iframe>'
	});

	var tabs = new Ext.TabPanel({
		region: 'center',
		forceFit: true,
	    activeTab: 0,
	    items: [tab1]
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
    	items: [tabs]
	});
});
</script>
