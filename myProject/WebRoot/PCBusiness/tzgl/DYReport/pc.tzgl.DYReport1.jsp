<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dyreportType = request.getParameter("dyreportType")==null?"":request.getParameter("dyreportType");
 %>
 <html>
	<head>
		<title>电源固定资产投资完成情况月报</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var dyreportType = "<%=dyreportType%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.js"></script>
	</head>
	<body >
	</body>
</html>