<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>合同概算金额分摊页面</title>
  	<base href="<%=basePath%>">
  	
	  	<script type="text/javascript">
			var conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";
			var conid = "<%=request.getParameter("conid")%>";
			var conmoney = "<%=request.getParameter("conmoney")%>";
			var g_conno = "<%=(String)request.getParameter("conno") %>";
			var TIME="<%=request.getParameter("time")%>";
			var PID="<%=request.getParameter("pid")%>";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- PAGE --> 
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/bdg/bdg.con.app.js"></script>
		<style type="text/css">
		</style>
  </head>
  <body>
  </body>
</html>
