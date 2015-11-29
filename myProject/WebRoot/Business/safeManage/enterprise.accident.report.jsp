<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>电力建设企业伤亡事故报表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script> 
		<script type="text/javascript" src="dwr/interface/appMgm.js"></script>
		<script type='text/javascript' src='dwr/interface/safeManageMgmImpl.js'></script>	
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/safeManage/enterprise.accident.report.js"></script>
		<script type="text/javascript" src="Business/safeManage/enterprise.accident.detail.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
