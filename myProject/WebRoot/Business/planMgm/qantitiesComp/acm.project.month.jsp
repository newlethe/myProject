<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>投资完成月份主记录</title>
	
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
	<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
	<script>
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

		var showAllCon = true;
		var conOveArr = new Array();
		var bean = "com.sgepit.pmis.contract.hbm.ConOve";
		var unitBean = "com.sgepit.frame.sysman.hbm.SgccIniUnit";
		var conId = "";
		
		DWREngine.setAsync(false);
		baseDao.findByWhere2(bean, "conno='"+conno_flow+"'", function(conList){
			if(conList.length>0){
				conId = conList[0].conid;
			}
		});
		
		baseDao.findByWhere2(unitBean, "unitid='"+USERDEPTID+"'", function(unitList){
			if(unitList.length>0 && unitList[0].unitTypeId=="2"){
				//参建单位
				showAllCon = false;
			}
		});

		investmentPlanService.getConOveInfo("", function(list){
			for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].conid);			
				temp.push(list[i].conname);		
				conOveArr.push(temp);			
			}
	    });
		DWREngine.setAsync(true);
	</script>
	
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<script type="text/javascript" src="Business/planMgm/qantitiesComp/acm.project.month.js"></script>
	<script type="text/javascript" src="Business/document/dateFun.js"></script>
  </head>
  
  <body>
  	<span></span>
	<select name="billState" id=""billState"" style="display: none;">
		<option value="状态一">状态一</option>
		<option value="状态二">状态二</option>
		<option value="状态二">状态三</option>
		<option value="状态二">状态四</option>
	</select>
  </body>
</html>
