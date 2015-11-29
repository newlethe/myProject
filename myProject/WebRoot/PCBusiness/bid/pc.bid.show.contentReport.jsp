<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>上报的标的选择</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type="text/javascript">
			var edit_pid = "<%=request.getParameter("edit_pid")==null?"":request.getParameter("edit_pid")%>";
			var edit_sjType = "<%=request.getParameter("edit_sjType")==null?"":request.getParameter("edit_sjType")%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.show.contentReport.js"></script>
	</head>
	<body >
	</body>
</html>