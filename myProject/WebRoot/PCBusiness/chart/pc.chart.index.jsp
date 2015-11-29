<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
 		<%
 			String IP = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
 		%>
 		<script type="text/javascript">
 			var IP = '<%=IP%>'
 		</script>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService'></script>
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_CHART")%>/script/carton.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_CHART")%>/script/util.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/chart/pc.chart.index.js"></script>
	</head>
	<body >
	</body>
</html>