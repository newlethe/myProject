<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>合同违约分摊</title>
		<base href="<%=basePath%>">

		<script type="text/javascript">
		
	</script>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css"
			href="jsp/res/css/column-tree.css" />
		<style type="text/css">
.numberCell {
	text-align: right;
}
</style>
		<script type="text/javascript">
			var conid = "<%=request.getParameter("conid")%>";
			var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
			var conno = "<%=request.getParameter("conno")%>";
			var claid = "<%=request.getParameter("claid")%>";
			var clano = "<%=request.getParameter("clano")%>";
		</script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.compensate.form.js"></script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.compensate.apportion.js"></script>
		<style type="text/css">
</style>



	</head>
	<body>
		<span></span>

	</body>
</html>
