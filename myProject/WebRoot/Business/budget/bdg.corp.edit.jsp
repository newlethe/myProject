<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">     
        <base href="<%=basePath%>">
		
		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
	    <script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgCorpMgm.js'></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<script type="text/javascript">
		var g_corpbasicid = "<%=request.getParameter("corpbasicid")%>";
		</script>
		<script type="text/javascript" src="Business/budget/bdg.corp.edit.js"></script>
	</head>
	<body>
	   <span></span>
	</body>
</html>
