<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>投资完成情况报表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseDao.js'></script>
		<script type='text/javascript'>
			var sj = '<%=null == request.getParameter("sj") ? "" : request.getParameter("sj")%>';
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/tzgl/query/pc.tzgl.comp.report.js"></script>
	</head>
	<body>
	</body>
</html>