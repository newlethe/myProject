<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<% 
	String vpid  = request.getParameter("vpid")==null?"":request.getParameter("vpid");	
%>
<html>
	<head>
		<title>招投标一览表</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.statis.js"></script>
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
