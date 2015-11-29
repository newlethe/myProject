 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备库存(专用工具及备品备件)</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type="text/javascript" src="Business/equipment/equMgm/equ.cont.tree.single.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/queryGrid.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.stock.single.js"></script>
	</head>
	<body>
	</body>
</html>