<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>工资套帐维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src='dwr/interface/rlzyXcglMgm.js'>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript">
			var code = "<%=request.getParameter("code") %>"==null?"":"<%=request.getParameter("code") %>";
			var name = "<%=request.getParameter("name") %>"==null?"":"<%=request.getParameter("name") %>";
			var sendtype = "<%=request.getParameter("sendType") %>"==null?"":"<%=request.getParameter("sendType") %>";
			var flag = "<%=request.getParameter("flag") %>"=="true"?true:false;
			var uids =  "<%=request.getParameter("uids") %>"==null?"":"<%=request.getParameter("uids") %>";
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/rlzy/salary/rlzy.hr.salary.type.addorupdate.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
