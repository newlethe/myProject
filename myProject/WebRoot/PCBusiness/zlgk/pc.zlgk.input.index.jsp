<%@ page language="java" pageEncoding="UTF-8" %>

 <html>
	<head>
		<title>质量信息信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/zlgkMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		
		<!-- EXTEND -->
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<script type="text/javascript" src="PCBusiness/zlgk/pc.zlgk.input.index.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
	</head>
	<body >
	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"></form>
	<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>
	</body>
</html>