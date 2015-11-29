<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>供应商添加或更新</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equsbcsop.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>

		<script type="text/javascript">
			var bm_id = "<%=request.getParameter("bm")==null?"":request.getParameter("bm")%>";
			var flbm = "<%=request.getParameter("flbm")==null?"":request.getParameter("flbm")%>";
			var flmc = "<%=request.getParameter("flmc")==null?"":request.getParameter("flmc")%>";
			var uids_edit = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";

		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.baseinfo.addorupdate.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
