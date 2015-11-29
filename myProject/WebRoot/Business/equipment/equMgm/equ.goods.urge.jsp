 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备催交</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var remind = "<%=request.getParameter("remind")==null?"false":request.getParameter("remind")%>";
		</script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.urge.remind.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/queryGrid.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.urge.js"></script>
	</head>
	<body>
	</body>
</html>