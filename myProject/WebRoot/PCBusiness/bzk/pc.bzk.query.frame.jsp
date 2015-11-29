<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.util.JSONUtil"%>
<%@page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>标准库功能首页</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<!-- EXTEND -->
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/bzk/pc.bzk.query.frame.js"></script>
	</head>
	<body>
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%;overflow:scroll;;overflow-y:auto;" frameborder=no src=""></iframe>
		</div>
	</body>
</html>
