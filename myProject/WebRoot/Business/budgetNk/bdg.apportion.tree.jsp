<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>树</title>
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
			var returnUrl = "<%=request.getHeader("REFERER")%>";
			var typeName = "<%=request.getParameter("type")%>";
			var conid = "<%=request.getParameter("conid")%>";
			var conname = "<%=request.getParameter("conname") == null ? ""
					: request.getParameter("conname")%>";
			var typeId;
			var treeTitle;
			var selectedConName;
			var chaName;
			
			if (typeName == 'change'){
				typeId = "<%=request.getParameter("chaid")%>";
				treeTitle = '合同变更分摊' ;
			}else if ( typeName == 'pay' ){
				typeId = "<%=request.getParameter("payappno")%>";
				treeTitle = '付款分摊';
			}else if ( typeName == 'cla' ){
				typeId = "<%=request.getParameter("claid")%>";
				treeTitle = '索赔分摊'
			}else if ( typeName == 'break' ){
				typeId = "<%=request.getParameter("breid")%>";
				treeTitle = '违约分摊';
			}
		</script>
		<script type="text/javascript"
			src="Business/budgetNk/bdg.apportion.tree.js"></script>
		<script type="text/javascript" src="Business/budgetNk/ColumnTree.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
