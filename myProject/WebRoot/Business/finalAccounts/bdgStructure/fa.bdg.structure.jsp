<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.finalAccounts.bdgStructure.hbm.FABdgInfo"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>竣建概算结构对照</title>
		<base href="<%=basePath%>">

	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
		<!-- PAGE -->
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var beanName = '<%=FABdgInfo.class.getName() %>';
		</script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/ColumnTree.js"></script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/fa.bdg.structure.js"></script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/fa.bdg.structure.form.js"></script>
		<script type="text/javascript"
			src="Business/finalAccounts/bdgStructure/fa.bdg.selectTree.js"></script>
		
			
				
		

	</head>
	<body>
		
	</body>
</html>
