<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String editMode = request.getParameter("editMode")==null?"insert":request.getParameter("editMode").toString().toLowerCase();
	String editEnable = request.getParameter("editEnable")==null?"false":request.getParameter("editEnable").toString().toLowerCase();
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>工程量投资计划</title>
		<base href="<%=basePath%>">

		<!-- DWR -->
		<script type='text/javascript' src='<%=path%>/dwr/util.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/proAcmMgm.js'></script>  
		<script type='text/javascript' src='<%=path%>/dwr/interface/investmentPlanService.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/baseDao.js"></script>		
		<script type="text/javascript" src="<%=path%>/dwr/interface/baseMgm.js"></script>		
			
		<script language="JavaScript">
			var editMode = "<%=editMode %>";
			var editEnable = "<%=editEnable %>"=="true"?true:false;
			var uids = "<%=request.getParameter("uids")==null?"": request.getParameter("uids")%>"
			var conid = "<%=request.getParameter("conid")==null?"": request.getParameter("conid") %>"
			var unitId = "<%=request.getParameter("unitId")==null?"": request.getParameter("unitId")%>"
			var monId = ""
			if(conid=="ALL"){
				conid = "";
			}
			/********流程参数--begin*/
			var monid_flow = "<%=request.getParameter("mon_id")==null?"":request.getParameter("mon_id")%>";
			var conno_flow = "<%=request.getParameter("conno")==null?"":request.getParameter("conno")%>";
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			/* 流程接口模块名称 */
			var funname_flow = "<%=request.getParameter("funname")==null?"":(String)request.getParameter("funname") %>";
			/********流程参数--end*/
			
			if(monid_flow && monid_flow!=""){
				monId = monid_flow;
			}
		
			var sjType = ""
			var conno = "";
			var conname = "";
			var unitName = "";
			var sjTypeDesc= "";
			
			var conBean = "com.sgepit.pmis.contract.hbm.ConOve";
			var unitBean = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
			var acmMonthBean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
			var showAllCon = true;
			var editData = null;
			
			DWREngine.setAsync(false);
			if(uids && uids!=""){
				baseDao.findByWhere2(acmMonthBean, "uids='"+uids+"'", function(list){
					if(list.length>0){
						editData = list[0];
						sjType = editData.month;
						unitId = editData.unitId;
					}
				});
			}
			
			baseDao.findByWhere2(conBean, "conid='"+conid+"'", function(conList){
				if(conList.length>0){
					conno = conList[0].conno;
					conname = conList[0].conname;
				}
			});
			
			baseDao.findByWhere2(unitBean, "unitid='"+USERDEPTID+"'", function(unitList){
				if(unitList.length>0 && unitList[0].unitTypeId=="2"){
					//参建单位
					showAllCon = false;
					unitName = unitList[0].unitname;
				}
			});
			DWREngine.setAsync(true);
			
			if(sjType != null && sjType != ""){
				if(sjType.length == 4){
					sjTypeDesc = sjType+"年";
				}else if(sjType.length == 5){
					sjTypeDesc = sjType.substr(0,4)+"年"+sjType.substr(4,5)+"季度"
				}else if(sjType.length == 6){
					sjTypeDesc = sjType.substr(0,4)+"年"+sjType.substr(4,6)+"月";
				}
			}
		</script>
		
			<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/planMgm/qantitiesComp/comp.gcl.addInfo.js'></script>	
	</head>
	<body>
	</body>
</html>
