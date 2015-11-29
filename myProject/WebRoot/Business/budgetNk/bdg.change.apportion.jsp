<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>合同内控概算金额分摊</title>
		<base href="<%=basePath%>">

		<script type="text/javascript">
		  	
			/* 一般程序调用所提供的参数 */
			var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
			var conid = "<%=request.getParameter("conid")%>";
			var conmoney = "<%=request.getParameter("conmoney")%>";
			var chaid = "<%=request.getParameter("chaid")%>";
			var chano = "<%=request.getParameter("chano")%>";	
	</script>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css"
			href="jsp/res/css/column-tree.css" />

		<script type="text/javascript"
			src="Business/budgetNk/bdg.change.apportion.js"></script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.change.form.js"></script>

		<style type="text/css">
.numberCell {
	text-align: right;
}
</style>
	</head>
	<body>
		<span></span>
	</body>
</html>
