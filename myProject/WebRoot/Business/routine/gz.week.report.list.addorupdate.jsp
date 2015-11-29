<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>周工作计划内容增加或修改</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/gzJhMgm.js'></script>

	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type='text/javascript'>
		var report_uuid = "<%=request.getParameter("uuid")==null?"":request.getParameter("uuid")%>";
		var report_Cont_uuid = "<%=request.getParameter("contuuid")==null?"":request.getParameter("contuuid")%>";
	</script>
	
	<script type="text/javascript" src="Business/routine/gz.week.report.list.addorupdate.js"></script>
	
	
	<!-- PAGE -->
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var bh_flow = "<%=(String)request.getParameter("flowid") %>";
	</script>	
	
	
  </head>
  
  <body>
  </body>
</html>
