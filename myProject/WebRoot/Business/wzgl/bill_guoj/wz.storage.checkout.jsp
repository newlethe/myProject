<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmImpl"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String uuid = UUID.randomUUID().toString();
%>
<html>
	<head>
		<title>出库管理计划外领用</title>
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
		var conname = "";
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		/* 流程任务调用所提供的参数 */
		var Flowuids = "<%=request.getParameter("bh")==null?"":request.getParameter("bh") %>";

		var uuid = "<%=uuid%>";
		uuid = uuid.replace(/-/g,"");
		
		if (isFlwTask == true){
			DWREngine.setAsync(false);
			var sql = "insert into wz_output (uids,bh,jhbh,billname,bill_state,zdrq,sqbm,lyr,pid) values('"+
				uuid+"','"+Flowuids+"','计划外','领料出库单','N',sysdate,'"+USERDEPTID+"','"+USERID+"','"+CURRENTAPPID+"')";
			//var sql ="update wz_output set zdrq='sysdate' and sqbm='"+USERDEPTID+"' and lyr='"+USERID+"' 
					//	where uids ='"+Flowuids+"'";
			gantDwr.execute(sql,function(b){
			})
			DWREngine.setAsync(true);
			
		}
		</script>	
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/bill_guoj/wz.storage.checkout.js"></script>
		<script type="text/javascript" src="Business/wzgl/bill_guoj/wz.storage.checkout.selectWz.js"></script>
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
