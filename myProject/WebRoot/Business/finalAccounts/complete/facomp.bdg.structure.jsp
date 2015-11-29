<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>竣工决算概算管理</title>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
	
		<!-- EXT -->
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/interface/faBaseInfoService.js'></script>
		<!-- PAGE -->
		<script type="text/javascript">
			var pid = CURRENTAPPID;
		</script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.bdg.selectTree.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.bdg.structure.form.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.bdg.structure.js"></script>
	</head>
	<body>
	</body>
</html>
