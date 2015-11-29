<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>凭证基本信息</title>
		<base href="<%=basePath%>">
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/faBaseInfoService.js'></script>

		<!-- PAGE -->
		<script type="text/javascript">
			var pid = CURRENTAPPID;
		</script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.proof.info.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.proof.info.investtab.js"></script>
	</head>
	<body>
	</body>
</html>
