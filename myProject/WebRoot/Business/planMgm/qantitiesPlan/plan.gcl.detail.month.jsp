<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>
<%
	String masterId = request.getParameter("masterId")==null?"":request.getParameter("masterId").toString();
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>工程量投资计划</title>
		<style>

		</style>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- 拓全局变量设置 -->
		<script language="JavaScript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		</script>
		<!-- 拓展的Ext -->
		
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
		<!-- 功能JS -->
		
		<script type='text/javascript'
			src='<%=path%>/Business/planMgm/qantitiesPlan/plan.gcl.detail.gstree.js'></script>	
		<script type='text/javascript'
			src='<%=path%>/Business/planMgm/qantitiesPlan/plan.gcl.detail.month.js'></script>
		
	</head>
	<body>
		<div>
			<input id='conInfo' type='text' value='' size=75
				style='border: 0; background-color: transparent; text-align: right'
				READONLY>
			</input>
		</div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>
