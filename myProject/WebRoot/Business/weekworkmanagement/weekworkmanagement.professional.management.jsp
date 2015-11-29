<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> 
<%@ page language="java" pageEncoding="utf-8" %>
 <html>
	<head>
		<title>周工作事项管理-专业分类维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.css" />
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx_custom.css" />
		<style>
html, body {
 height: 100%;
}
</style>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/weekWorkManagementService.js'></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="dhtmlx/js/componentsUtil.js"></script>
		<script type="text/javascript" src="dhtmlx/js/dhxTreeGridUtil.js"></script>
		<script type="text/javascript" src="Business/weekworkmanagement/weekworkmanagement.professional.management.js"></script>
	</head>
	<body onload="pageOnload()">
	</body>
</html>