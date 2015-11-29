<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>   
  <head>
    <title>树</title>
  	<base href="<%=basePath%>">
  	
  		<script type="text/javascript">
		var conid = "<%=request.getParameter("conid")%>"; 
		var conname = "<%=request.getParameter("conname")%>";
		var conno = "<%=request.getParameter("conno")%>"; 
		var kxuuid="<%=request.getParameter("kxuuid")%>";
		var ggid = "<%=request.getParameter("ggid")%>";
		var kxsbid = "<%=request.getParameter("kxsbid")==null?"":request.getParameter("kxsbid")%>";
		var argments = "<%=request.getParameter("argments")%>";
		</script>
	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		        <link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<script type="text/javascript" src="Business/equipment/equ.list.KxTree.addorupdate.js"></script>
		<script type="text/javascript" src="Business/equipment/equ.list.selectkxTree.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
