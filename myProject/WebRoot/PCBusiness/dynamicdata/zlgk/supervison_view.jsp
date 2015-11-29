<%@ page language="java" pageEncoding="UTF-8" %>

 <html>
	<head>
		<title>监理报告信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			var PID="<%=request.getParameter("pid")%>";
		    var UIDS="<%=request.getParameter("uids")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/zlgkMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/zlgk/supervison_view.js"></script>
	</head>
	<body >
	</body>
</html>