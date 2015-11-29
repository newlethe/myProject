<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>概算结构维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<!-- PAGE --> 
		<script type="text/javascript" src="Business/budget/bdg.frame.edit.querybdg.js"></script>
		<style type="text/css">
		</style>
	</head>
	<body>
	<script type="text/javascript">
	   var queryBdgid =  "<%=request.getParameter("queryBdgid")%>";
	</script>
	</body>
</html>
