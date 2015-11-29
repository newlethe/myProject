<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String pid = request.getParameter("pid")==null ? "" : (request.getParameter("pid"));
	String time = request.getParameter("time")==null ? "" : (request.getParameter("time"));
%>
 <html>
	<head>
		<title>月度报表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var pid = "<%=pid%>";
			var time = "<%=time%>"
			ModuleLVL = 6;    //限定为只读页面
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/pc.all.monthly.report.query.js"></script>
	</head>
	<body >
	</body>
</html>