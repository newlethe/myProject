<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
		<script type="text/javascript">
		var g_conid = <%=request.getParameter("subid") %>;
		var g_chaid = <%=request.getParameter("tid") %>;
		</script>

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/tendersMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/tenders/tender.tensubInfo.edit.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body>
	</body>
</html>
