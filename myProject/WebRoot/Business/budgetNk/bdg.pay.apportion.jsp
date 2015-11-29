<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>合同付款分摊</title>
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

			/* 一般程序调用所提供的参数 */
			var conid = "<%=request.getParameter("conid")%>";
			var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
			var payappno = "<%=request.getParameter("payid")%>";
			var payno = "<%=request.getParameter("payno")%>";
			var conno = "<%=request.getParameter("conno")%>";
		
			
		</script>
		<script type="text/javascript" src="Business/budgetNk/bdg.pay.form.js"></script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.pay.apportion.js"></script>


	</head>
	<body>
		<span></span>
	</body>
</html>
