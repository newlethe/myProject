<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>树</title>
  	<base href="<%=basePath%>">
  	
  		<script type="text/javascript">
		var conid = "<%=request.getParameter("conid")%>";
		var type = "<%=request.getParameter("type")%>";
		var appid = "<%=request.getParameter("appid")%>";
		var inId = "<%=request.getParameter("inId")%>";
		var checkId = "<%=request.getParameter("checkId") %>";  
		var invoId = "<%=request.getParameter("invoId") %>";  
		</script>
	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matFrameMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/appBuyMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matGoodsMgm.js'></script>   
		<script type='text/javascript' src='dwr/interface/matGoodsMgm.js'></script> 
		
		<!-- PAGE -->
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<script type="text/javascript" src="Business/material/mat.tree.con.select.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
