<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>年度投资数据录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var PID="<%=request.getParameter("pid")%>";
		    var UIDS="<%=request.getParameter("uids")%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/dynamicdata/tzgl/yearInvest_view.js"></script>
	</head>
	<body >
	</body>
</html>