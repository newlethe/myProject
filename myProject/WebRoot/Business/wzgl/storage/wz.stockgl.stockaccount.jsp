<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>库存管理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		
		<script type='text/javascript' src='dwr/util.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="Business/wzgl/storage/wz.stockgl.stockaccount.js"></script>
		<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<div id="dbnetgrid1" style="behavior:url('/dbnetgrid/htc/dbnetgrid.htc');"></div>
		<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc');"></div>
	</body>
</html>
