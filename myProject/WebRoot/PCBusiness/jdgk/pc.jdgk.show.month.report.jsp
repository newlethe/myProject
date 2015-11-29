<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dyreportType = request.getParameter("dyreportType")==null?"":request.getParameter("dyreportType");
 %>
 <html>
	<head>
		<title>投资完成月报查询页面</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
		</script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.show.month.report.js"></script>
	</head>
	<body >
	</body>
</html>