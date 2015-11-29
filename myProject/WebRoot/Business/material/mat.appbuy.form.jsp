<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>采购单</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appBuyMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = <%=request.getParameter("isView") %>;
		/* 流程任务调用 */
		var isFlwTask = <%=request.getParameter("isTask") %>;
		</script>
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/material/mat.appbuy.material.js"></script>
		<script type="text/javascript" src="Business/material/mat.appbuy.form.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
