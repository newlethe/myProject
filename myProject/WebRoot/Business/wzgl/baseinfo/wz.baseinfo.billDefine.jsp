<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    
    <title>物资单据(单据类型)</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    
	<script type="text/javascript" src="Business/wzgl/baseinfo/wz.baseinfo.billDefine.js"></script>
	
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
  </head>
  
  <body>
  	<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc');"></div>
  </body>
</html>
