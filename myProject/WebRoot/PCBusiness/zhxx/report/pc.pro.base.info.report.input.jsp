<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>项目基本情况表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
			var dydaView = "<%=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false")%>";
		</script>
		<!-- DWR -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<!-- EXTEND -->
		<script type="text/javascript" src="extExtend/monthPick.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/zhxx/report/pc.pro.base.info.report.input.js"></script>
	</head>
	<body >
	</body>
</html>