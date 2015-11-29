<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>出库管理计划内领用</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/storageMgmImpl.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/bill/wz.storage.storageOut.js"></script>
	    <style type="text/css">
	    .btn1_mouseout {
 			BORDER-RIGHT: #7EBF4F 1px solid; PADDING-RIGHT: 2px; BORDER-TOP: #7EBF4F 1px solid; PADDING-LEFT: 2px; FONT-SIZE: 12px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#ffffff, EndColorStr=#B3D997); BORDER-LEFT: #7EBF4F 1px solid; CURSOR: hand; COLOR: black; PADDING-TOP: 2px; BORDER-BOTTOM: #7EBF4F 1px solid
		}
		</style>
		<%
			String flwbh=request.getParameter("bh") ==null?"":request.getParameter("bh");
		 %>
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			var flwbh = "<%=flwbh %>";
		</script>
	</head>
	<body>
		<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc');"></div>
	</body>
</html>
