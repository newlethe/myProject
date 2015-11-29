<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>年度投资计划汇总查询(单项目)</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<%
			String sj = request.getParameter("sj")==null?"":request.getParameter("sj");
		%>
		<script>
			var sj = '<%=sj%>'
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseDao.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/tzgl/query/pc.tzgl.yearInvest.report.js"></script>
	</head>
	<body>
	</body>
</html>