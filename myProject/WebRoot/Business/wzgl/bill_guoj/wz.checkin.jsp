<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>物资入库：入库验收</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script src='dwr/interface/stockMgm.js'></script>
		
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView")%>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask")%>;
			
			var isFlwUids = '<%=request.getParameter("bh")%>';//传过来的bh
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/bill_guoj/wz.checkin.js"></script>
	</head>
	<body>
	</body>
</html>
