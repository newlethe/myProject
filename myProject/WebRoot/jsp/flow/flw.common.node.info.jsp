 <%@ page contentType="text/html;charset=UTF-8" %>
 <html>
	<head>
		<title>流程普通节点信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.common.node.info.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<span></span>
	</body>
</html>