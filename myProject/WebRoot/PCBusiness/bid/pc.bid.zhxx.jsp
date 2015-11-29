<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>招标综合信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %><script type="text/javascript">
			var zbUids = '<%=request.getParameter("zbUids") == null ? "" : request.getParameter("zbUids") %>';
		</script>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- PAGE -->
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zhxx.js"></script>
	</head>
	<body >
	</body>
</html>