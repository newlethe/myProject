<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.planMgm.PlanMgmConstant"%>
<%
	String businessType = request.getParameter("businessType")==null?PlanMgmConstant.QUANTITIES_PLAN_YEAR:request.getParameter("businessType").toString();
	String editMode = request.getParameter("editMode")==null?"insert":request.getParameter("editMode").toString().toLowerCase();
	String editEnable = request.getParameter("editEnable")==null?"false":request.getParameter("editEnable").toString().toLowerCase();
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>工程量投资计划</title>
		<style>
		</style>
		<base href="<%=basePath%>">
		
		<!-- 拓全局变量设置 -->
		<script language="JavaScript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			var flowbh = "";
			if(isFlwView || isFlwTask){
				flowbh = "<%=request.getParameter("flowbh") %>"
			}			
			var businessType = "<%=businessType%>"
			var editMode = "<%=editMode %>";
			var editEnable = "<%=editEnable %>"=="true"?true:false;
			var uids = "";
			if(editMode == "update"){
				uids = "<%=request.getParameter("uids") %>"
			}
			conid = "<%=request.getParameter("conid") %>"
			conno = "<%=request.getParameter("conno") %>"
			conname = "<%=request.getParameter("conname") %>"
			unitId = "<%=request.getParameter("unitId") %>"
			unitName = "<%=request.getParameter("unitName") %>"
			var sjType = "<%=request.getParameter("sjType") %>"
			var sjTypeDesc= "";
			if(sjType != null && sjType != ""){
				if(sjType.length == 4){
					sjTypeDesc = sjType+"年";
				}else if(sjType.length == 5){
					sjTypeDesc = sjType.substr(0,4)+"年"+sjType.substr(4,5)+"季度"
				}else if(sjType.length == 6){
					sjTypeDesc = sjType.substr(0,4)+"年"+sjType.substr(4,6)+"月";
				}
			}
			fileEditFlag = editEnable
			if(editMode == "insert"){
				fileEditFlag = false;
				if(	conid == "ALL"){
					conid = "";
					conno = "";
					conname = "";
				}
			}
		</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<link rel="stylesheet" type="text/css" href="<%=path %>/extExtend/FileUploadField.css" />
		<script type="text/javascript" src="<%=path %>/extExtend/FileUploadField.js"></script>		

		<!-- DWR -->
		<script type='text/javascript' src='<%=path%>/dwr/util.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/appMgm.js'></script>  
		<script type='text/javascript' src='<%=path%>/dwr/interface/investmentPlanService.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/baseMgm.js"></script>		
		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/planMgm/qantitiesPlan/plan.gcl.addInfo.js'></script>		
			
		
	</head>
	<body>
	</body>
</html>
