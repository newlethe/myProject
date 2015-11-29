<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>材料投资完成详情</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
		
		<script type="text/javascript">
		var acmid = "<%=request.getParameter("acmid")%>";
		var bdgid = "<%=request.getParameter("bdgid")%>";
		</script>
		
		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matCompletionMgmImpl.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/budget/acm.material.detail.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body >
		<span></span>
	</body>
</html>