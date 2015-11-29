<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
	
		<title>批文分类维护</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/approvlMgm.js'></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.sorttree.center.js"></script>
		<!--  
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.sorttree.layout.js"></script>
		-->
  </head>
  	
  <body>
   	 <div id="tree"></div>   
  </body>
</html>
