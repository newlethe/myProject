<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>概算选择树</title>
		<base href="<%=basePath%>">
		<style type="text/css">
			.numberCell{
				text-align:right;
			}
		</style>
		<script type="text/javascript">
  		var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
			var conid = "<%=request.getParameter("conid")%>";
			var conmoney = "<%=request.getParameter("conmoney")%>";
		</script>

		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
			<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />


		<!-- PAGE -->

		<script type="text/javascript"
			src="Business/budgetNk/bdg.selectTree.js"></script>
			<script type="text/javascript"
			src="Business/budgetNk/ColumnTree.js"></script>
	</head>
	<body>
		<span></span>
		<div id="tree"></div>
	</body>
</html>
