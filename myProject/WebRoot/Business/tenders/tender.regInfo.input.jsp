<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>标段划分信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
/*		var selectedConId = "<%=request.getParameter("conid")%>";
		var selectedConName = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>";
		var selectedConNo = "<%=request.getParameter("conno")%>";*/
		var selectedConId = "99";
		var selectedConName = "华电科技基建人才库信息";
		var selectedConNo = "CON-004";
		var baseUrl = "<%=basePath%>";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/contractMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<script type='text/javascript' src='dwr/interface/tendersMgm.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/tenders/tender.regInfo.input.js"></script>
		<script type="text/javascript" src="Business/contract/expressWin.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<span></span>
	</body>
</html>
