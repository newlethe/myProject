<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>分摊定义</title>
		<base href="<%=basePath%>">

	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
		<!-- PAGE -->
		<style type="text/css">
			.numberCell{
				text-align: right;
			}
		</style>
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var beanName = '<%=FAGcType.class.getName() %>';
		</script>
		<script type="text/javascript"
			src="Business/finalAccounts/finance/fa.finance.outcomeApp.js"></script>
				<script type="text/javascript"
			src="Business/finalAccounts/finance/fa.finance.outcomeApp.form.js"></script>
		

	</head>
	<body>
		
	</body>
</html>
