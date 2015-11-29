<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>库存资产信息</title>
    <base href="<%=basePath%>">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!-- STYLE -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
	<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
	<!-- DWR -->
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/faFixedAssetService.js'></script>
	<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
	<!-- JS -->
	<!-- PAGE -->
	<script type='text/javascript' src='Business/finalAccounts/complete/fa.inventory.assets.view.js'></script>
	<script type='text/javascript' src='Business/finalAccounts/complete/fa.inventory.assets.view.tree.js'></script>
  </head>
  
  <body>
       <div id="tree" style="height:800px;"></div> 
  </body>
</html>
