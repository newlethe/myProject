<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>工程量投资完成概算汇总表</title>
   	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>  
	<script type='text/javascript' src='dwr/interface/proAcmMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
   
   
    <script>
    	/* 非流程模块的参数 */
		var masterId ="<%=request.getParameter("masterId")==null ? "" : request.getParameter("masterId") %>";
		var sjType ="<%=request.getParameter("sjType")==null ? "" : request.getParameter("sjType") %>";
		var conid ="<%=request.getParameter("conid")==null ? "" : request.getParameter("conid") %>";
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
	</script>
	<!-- TreeGrid -->
	<link rel="stylesheet" type="text/css" href="extExtend/treegridtest/css/TreeGrid.css"/>
	<script type="text/javascript" src="extExtend/treegridtest/TreeGrid.js"></script>
	<!-- EXT -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
	<script type="text/javascript" src="Business/planMgm/qantitiesComp/gcl.tz.comp.bdg.tree.js"></script>
  </head>
  <body></body>
</html>
