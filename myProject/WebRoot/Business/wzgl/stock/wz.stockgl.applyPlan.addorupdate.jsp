
<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    
    <title>采购需用计划申请增加或修改</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
    <script src='dwr/interface/stockMgm.js'></script>
    
	<script type="text/javascript" src="Business/wzgl/stock/wz.stockgl.applyPlan.addorupdate.js"></script>
	<script type="text/javascript" src="Business/wzgl/stock/wz.stock.applyPlan.budgetTree.js"></script>
	
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type='text/javascript'>
		var bh_id = "<%=request.getParameter("bh") == null?"":request.getParameter("bh")%>";
		var uids_edit = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
	</script>
	

	<!-- PAGE -->
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var bh_flow = "<%=(String)request.getParameter("bhflow")==null?"": (String)request.getParameter("bhflow")%>";
		if(bh_flow==null || bh_flow==""){
			bh_flow = "<%=(String)request.getParameter("bh")==null?"": (String)request.getParameter("bh")%>";
		}
		var MODID="<%=request.getParameter("modid")%>";
	</script>	
	
	
  </head>
  
  <body>
  </body>
</html>
