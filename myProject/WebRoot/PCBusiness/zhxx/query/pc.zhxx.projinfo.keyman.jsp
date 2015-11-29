<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>项目主要人员信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript">
			var edit_pid = CURRENTAPPID;
			var EDIT="<%=request.getParameter("edit")%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/util.js"></script>
		<script type="text/javascript" src="PCBusiness/zhxx/query/pc.zhxx.projinfo.keyman.js"></script>
	</head>
	<body >
	</body>
</html>