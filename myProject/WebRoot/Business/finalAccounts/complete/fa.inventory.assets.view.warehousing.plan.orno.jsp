<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>计划外出库稽核</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<script type="text/javascript">
			var PID = CURRENTAPPID;
			var edit_flag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>

        <!-- PAGE -->
        <script type='text/javascript' src='Business/finalAccounts/complete/fa.inventory.assets.view.tree.js'></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/fa.inventory.assets.view.warehousing.plan.orno.js"></script>
	</head>
	
	<body>
	</body>
</html>
