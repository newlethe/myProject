<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>   
		<title>设备催交</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type="text/javascript">
			var conid = "<%=request.getParameter("conid")%>";
			var conname = "";
			conname = "<%=request.getParameter("conname")%>";
		</script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/equ.urge.input.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
