<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>仓库设备</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equBaseInfo.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		
		<!-- treeGrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<script type="text/javascript">
			var username = REALNAME;
		    var uploaded = false;
		    var uploadFileInfo;
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.stock.tree.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.stock.form.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.stock.treegrid.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
	</body>
</html>

