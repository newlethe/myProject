
<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>费用计划汇总</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/bdgMoneyMonthPlan.js'></script>
	<script src="<%=path%>/dwr/interface/db2Json.js"></script>    
    
	<script type="text/javascript" src="Business/budget/moneyMange_guoj/hz/money.month.plan.js"></script>
	<script type="text/javascript" src="Business/budget/moneyMange_guoj/query.js"></script>
	
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用:来自addorupdate */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var hzbh_flow = "<%=(String)request.getParameter("HZBH")==null?"": (String)request.getParameter("HZBH")%>";
	</script>	
	
  </head>
  
  <body>
  </body>
</html>
