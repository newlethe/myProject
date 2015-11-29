<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>合同违约分摊</title>
  	<base href="<%=basePath%>">
  	
  	<script type="text/javascript">
		
	</script>
	<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgBreachMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>			
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript">
			var baseUrl = "<%=basePath%>";
			var g_conid = "<%=request.getParameter("conid") %>";
			var g_breno ="<%=request.getParameter("breno") %>";
			var g_conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";
			var g_breid = "<%=request.getParameter("breid") %>";
			var g_conno = "<%=request.getParameter("conno") %>";
							//动态数据
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		
		</script>
		<script type="text/javascript" src="Business/budget/bdg.breach.form.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.breach.apportion.js"></script>
		<style type="text/css">
		</style>
		
  </head>
  <body >
  	<span></span>
  </body>
</html>
