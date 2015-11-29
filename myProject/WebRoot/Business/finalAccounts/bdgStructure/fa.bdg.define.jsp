<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>工程项目定义</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
	
		
		<!-- EXT -->
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/ColumnTree.js"></script>
		
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/finalAccounts/bdgStructure/fa.bdg.define.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/bdgStructure/fa.bdg.define.selectTree.js" ></script>
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>
	</body>
</html>
