<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="../golobalJs.jsp"%>

<html>
  <head>
    <title>树</title>
  	<base href="<%=basePath%>">  	
  		
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<!--script type='text/javascript' src='dwr/interface/matFrameMgm.js'></script-->
		
		<!-- PAGE -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=basePath %>extExtend/columnTreeNodeUI.js"></script>
		<script type="text/javascript" src="jsp/common/tree/unit.column.tree.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
