<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>管理退库</title>
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
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script>	
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView")%>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask")%>;
			
			var isFlwUids = '<%=request.getParameter("bh")%>';//传过来的bh
			/*if (isFlwTask == true){
			DWREngine.setAsync(false);
			var sql = "insert into wz_tk (uids,bh,bill_state,billname,zdrq) values('"+
						isFlwUids+"','"+isFlwUids+"','退库单','N',sysdate)";
			
			gantDwr.execute(sql,function(b){
			})
			DWREngine.setAsync(true);
			
		}*/
		</script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/bill_guoj/wz.storage.tkout.js"></script>
		<script type="text/javascript" src="Business/wzgl/bill_guoj/wz.storage.tk.selectWz.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	    <style type="text/css">
	    .btn1_mouseout {
	    	cursor:hand
		}
		</style>
	</head>
	<body>
		<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc');"></div>
	</body>
</html>
