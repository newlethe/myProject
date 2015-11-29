<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>物资编码添加更新</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>

		<script type="text/javascript">
			var bm_id = "<%=request.getParameter("bm")==null?"":request.getParameter("bm")%>";
			var flbm = "<%=request.getParameter("flbm")==null?"":request.getParameter("flbm")%>";
			var flmc = "<%=request.getParameter("flmc")==null?"":request.getParameter("flmc")%>";
			var uids_edit = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
			var bm = "<%=request.getParameter("bm")==null?"":request.getParameter("bm")%>";
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/baseinfo_guoj/wz.baseinfo.wzbm.addorupdate.js"></script>
	    <style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
