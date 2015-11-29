 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>已处理流程</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.query.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.worked.info.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<span></span>
	</body>
</html>