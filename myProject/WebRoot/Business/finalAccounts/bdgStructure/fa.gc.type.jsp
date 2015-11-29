<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FAGcType"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>工程类型维护</title>
		<base href="<%=basePath%>">

	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
		<!-- PAGE -->
		<script type="text/javascript">
			var pid = CURRENTAPPPID;
			var beanName = '<%=FAGcType.class.getName() %>';
		</script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/fa.gc.type.js"></script>
				<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/fa.gc.type.form.js"></script>
		

	</head>
	<body>
		
	</body>
</html>
