<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>工资帐套维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/FormulaUtil.js"></script>
		<script type="text/javascript">
		var uids = "<%=request.getParameter("uids") %>"==null?"":"<%=request.getParameter("uids") %>";
		var flag = "<%=request.getParameter("flag") %>"=="true"?true:false;
		var formula = "<%=request.getParameter("formula") %>"==null?"":"<%=request.getParameter("formula") %>";
		var state = "<%=request.getParameter("state") %>"==null?"":"<%=request.getParameter("state") %>";
		var remark = "<%=request.getParameter("remark") %>"==null?"":"<%=request.getParameter("remark") %>";
		var code = "<%=request.getParameter("code") %>"==null?"":"<%=request.getParameter("code") %>";
		var name = "<%=request.getParameter("name") %>"==null?"":"<%=request.getParameter("name") %>";
		var deptid = "<%=request.getParameter("deptid") %>"==null?"":"<%=request.getParameter("deptid") %>";
		var items = "<%=request.getParameter("items") %>"==null?"":"<%=request.getParameter("items") %>";
		</script>

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/comboBoxMultiSelect.css" />		
		<script type="text/javascript" src="<%=path%>/extExtend/MultiSelect.js"></script>	
		<script type="text/javascript" src="Business/rlzy/salary/rlzy.hr.salary.tz.addorupdate.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
