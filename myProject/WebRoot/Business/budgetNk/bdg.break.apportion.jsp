<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>合同违约分摊</title>
		<base href="<%=basePath%>">
		<style type="text/css">
.numberCell {
	text-align: right;
}
</style>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css"
			href="jsp/res/css/column-tree.css" />

		<script type="text/javascript">
			
			var conid = "<%=request.getParameter("conid")%>";
			var breno ="<%=request.getParameter("breno")%>";
			var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
					var breid = "<%=request.getParameter("breid")%>";
			var conno = "<%=request.getParameter("conno")%>";
		</script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.break.form.js"></script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.break.apportion.js"></script>
		<style type="text/css">
</style>

	</head>
	<body>
		<span></span>
	</body>
</html>
