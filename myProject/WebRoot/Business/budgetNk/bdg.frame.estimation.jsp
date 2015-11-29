<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>内控概算结构维护</title>
	
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<style type="text/css">
			.numberCell{
				text-align: right;
			}
		</style>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- 表单 -->
		<script type="text/javascript" src="Business/budgetNk/bdg.frame.estimation.form.js"></script>
		<!-- 主界面 -->  
		<script type="text/javascript" src="Business/budgetNk/bdg.frame.estimation.js"></script>
		<script type="text/javascript" src="Business/budgetNk/bdg.frame.estimation.querybdg.js"></script>
		
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
</html>
