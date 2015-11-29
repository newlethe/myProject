<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>物资编码批准编辑</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <base href="<%=basePath%>">
        <script type="text/javascript">
			var appId = '<%=request.getParameter("appId") %>';
		</script>

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/maAppMgm.js'></script>

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="Business/material/mat.frame.affirmCode.update.js"></script>
		<script type="text/javascript" src="Business/material/mat.frame.affirmCode.sort.js"></script>
	</head>
	<body >
		<span></span>
	</body>
</html>