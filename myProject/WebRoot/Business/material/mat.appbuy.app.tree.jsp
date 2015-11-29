<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>选择申请计划物资</title>
  	<base href="<%=basePath%>">
  	<script type="text/javascript">
  		var type = "<%=request.getParameter("type") %>";
  		var appid = "<%=request.getParameter("appid") %>";   
  		var checkId = "<%=request.getParameter("checkId") %>";  
  		var inId = "<%=request.getParameter("inId") %>";  
	</script>
  	
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/appBuyMgm.js'></script> 
	<script type='text/javascript' src='dwr/interface/matGoodsMgm.js'></script>  
	<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
	
	<!-- PAGE -->
	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
	<script type="text/javascript" src="Business/material/mat.appbuy.app.tree.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
