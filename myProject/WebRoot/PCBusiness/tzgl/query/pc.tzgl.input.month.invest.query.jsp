<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>投资月报上报查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			//confirm  表示显示所有单位的已审核数据
			var pageType = "<%=request.getParameter("pageType")==null?"":request.getParameter("pageType")%>";
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/tzgl/query/pc.tzgl.input.month.invest.query.js"></script>
	</head>
	<body>
	</body>
</html>