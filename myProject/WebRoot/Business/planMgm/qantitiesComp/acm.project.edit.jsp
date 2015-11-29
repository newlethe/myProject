<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>工程量投资完成编辑页</title>
   	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>  
	<script type='text/javascript' src='dwr/interface/proAcmMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
   
    <script>
    	/* 非流程模块的参数 */
		var masterId ="<%=request.getParameter("masterId")==null ? "" : request.getParameter("masterId") %>";
		var sjType ="<%=request.getParameter("sjType")==null ? "" : request.getParameter("sjType") %>";
		
		/********流程参数--begin*/
		var monid_flow = "<%=request.getParameter("mon_id")==null?"":request.getParameter("mon_id")%>";
		var conno_flow = "<%=request.getParameter("conno")==null?"":request.getParameter("conno")%>";
		var step_flow = "<%=request.getParameter("step")==null?"":request.getParameter("step")%>";
		
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程接口模块名称 */
		var funname_flow = "<%=request.getParameter("funname")==null?"":(String)request.getParameter("funname") %>";
		/********流程参数--end*/
		
    	var monId = "";
		var conid = "";
		var conno = "";
		var conname = "";
		if(isFlwTask||isFlwView){
			monId = monid_flow;
		}
		var conBean = "com.sgepit.pmis.contract.hbm.ConOve";
		var acmMonthBean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
		DWREngine.setAsync(false);
		if(masterId!="") {
			baseDao.findByWhere2(acmMonthBean, "uids='"+masterId+"'", function(list){
				if(list.length>0){
					monId = list[0].monId;
					conid = list[0].conid;
				}
			});
		} else {
			monId = monid_flow;
			baseDao.findByWhere2(acmMonthBean, "mon_id='"+monId+"'", function(list){
				if(list.length>0){
					masterId = list[0].uids;
					conid = list[0].conid;
				}
			});
		}
		
		baseDao.findByWhere2(conBean, "conid='"+conid+"'", function(conList){
			if(conList.length>0){
				conno = conList[0].conno;
				conname = conList[0].conname;
			}
		});
		
		DWREngine.setAsync(true);
	</script>
	
	
	
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
	<script type="text/javascript" src="Business/planMgm/qantitiesComp/acm.project.edit.js"></script>
  </head>
  <body>
  	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" >
    </form>
	<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
  </body>
</html>
