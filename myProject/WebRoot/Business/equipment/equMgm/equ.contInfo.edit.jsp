 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备合同信息维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var jz_view = "<%=request.getParameter("view")==null?"0":request.getParameter("view")%>";
		</script>
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
		<script type="text/javascript" src="Business/equipment/equMgm/equ.contInfo.edit.js"></script>
	</head>
	<body>
	</body>
</html>