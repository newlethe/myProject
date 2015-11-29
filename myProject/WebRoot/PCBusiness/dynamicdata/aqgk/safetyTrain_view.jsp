<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>安全月报查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/pcAqgkService.js'></script>
		<script type="text/javascript">
			var PID="<%=request.getParameter("pid")%>";
		    var UIDS="<%=request.getParameter("uids")%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/util.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/aqgk/safetyTrain_view.js"></script>
	</head>
	<body >
	</body>
</html>