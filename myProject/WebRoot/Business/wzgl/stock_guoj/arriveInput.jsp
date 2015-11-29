<%@ page pageEncoding="utf-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%
	SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
%>
<html>
	<head>
	    <title>项目基本信息编辑</title>
	    <%@ include file="/jsp/common/golobalJs.jsp" %>
	    <base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script>
			var args = window.dialogArguments
			var uids = args.uids
			var cgbh = args.cgbh
			var bm = args.bm
			var arriveBh = args.arriveBh
			var billState = args.billState
			var billType = args.billType
			var flag = args.flag;
			var hth = args.hth;
			var isFlwTask = args.isFlwTask;
		</script>
	
	
		<script type="text/javascript" src="<%=basePath%>Business/wzgl/stock_guoj/arriveInput.js"></script>
		<style>
		.icon-success {
		    background:url(jsp/res/images/icons/tick.png) no-repeat;
		}
		.icon-failure {
		    background-image:url(jsp/res/images/icons/error.png) no-repeat;
		}
   		.myTextarea {height:118px;}
		.x-grid3-cell-inner,.x-grid3-hd-inner{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;padding:3px 3px 3px 5px;white-space:normal;} 
		</style>
	</head>
	
	
	<body scroll="auto" >
	</body>
</html>
<script type="text/javascript">
	/*
	function unload(){
		window.returnValue = uids;   
	}
  */
</script>
