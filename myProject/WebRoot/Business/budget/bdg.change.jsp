<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>合同变更记录</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var selectedConId = "<%=request.getParameter("conid")%>";
		var g_conno = "<%=request.getParameter("conno")%>"
		var selectedConName = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>"  
		var conmoney = "<%=request.getParameter("conmoney")%>"
		//有无内控概算模块
		var hasNk = '<%=request.getParameter("hasNk") == null ? "0" : request.getParameter("hasNk")  %>';
		//动态数据
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/bdgChangeMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/budget/bdg.change.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<span></span>
	</body>
</html>
