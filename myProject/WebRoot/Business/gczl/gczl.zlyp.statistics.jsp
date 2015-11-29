<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>质量验评统计</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<script type="text/javascript">
		  	/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
	  		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		
			/* 流程任务调用所提供的参数 */
			var statNo = "<%=(String)request.getParameter("stat_no") %>";
			
		
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>

		<!-- PAGE -->

		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript"
			src="Business/gczl/gczl.zlyp.statistics.input.js"></script>

	</head>

	<body>
	</body>
</html>
