<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    
    <title>申请计划汇总</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/stockMgm.js'></script>

	<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var flowid = "<%=(String)request.getParameter("flowid")==null?"": (String)request.getParameter("flowid")%>";

		//isFlwView = true;
		//isFlwTask = true;
		//flowid = "yilin11010025"
	</script>	
	<script type="text/javascript" src="Business/wzgl/stock/wz.stockgl.applyPlan.hz.js"></script>
  </head>
  
  <body>
  </body>
</html>
