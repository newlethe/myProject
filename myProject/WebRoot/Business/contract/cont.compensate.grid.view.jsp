 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同索赔信息查看</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript'>
			var g_conid = "<%=request.getParameter("conid") %>";
		</script>
		<script type="text/javascript" src="Business/contract/cont.compensate.grid.view.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<span></span>

	</body>
</html>