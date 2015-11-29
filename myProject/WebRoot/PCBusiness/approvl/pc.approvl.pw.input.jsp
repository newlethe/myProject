<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>批文办理录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<%
			String appstatus = (request.getParameter("appStatus")==null||request.getParameter("appStatus")=="")?"%":
																					request.getParameter("appStatus");
			String spid = (request.getParameter("spid")==null||request.getParameter("spid")=="")?"":
																					request.getParameter("spid");																		
		 %>
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var projectName = CURRENTAPPNAME;
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/approvlMgm.js'></script>
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.common.js"></script>
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.input.js"></script>
		
	</head>
	<body >
	</body>
</html>