<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>选择采购物资</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
  			var buyId = "<%=request.getParameter("buyId") %>";
		</script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script src='dwr/interface/stockMgm.js'></script>
		<script src='dwr/interface/baseMgm.js'></script>
		<script src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock/stockPlanApplyHz.js"></script>
	</head>
	<body >

	</body>
</html>
