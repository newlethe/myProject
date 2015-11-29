<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>安全事故录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/pcAqgkService.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var haveReport = "<%=request.getParameter("haveReport") %>"=="false"?false:true;
			var edit_pid = "<%=request.getParameter("edit_pid")==null?"":request.getParameter("edit_pid")%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/util.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.safetymonth.js"></script>
	</head>
	<body >
	</body>
</html>