<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>概算平衡检查</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%><script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/budget/bdg.frame.checkBal.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body>
		
	</body>
</html>
