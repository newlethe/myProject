<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>未完工工程管理</title>
		<base href="<%=basePath%>">
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript">
			var pid = CURRENTAPPID;
		</script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.uncomplete.prj.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.uncomplete.prj.columnTree.js"></script>
	</head>
	<body>
	</body>
</html>
