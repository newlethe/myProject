<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>生成凭证</title>
		<base href="<%=basePath%>">
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>

		<!-- PAGE -->
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var uids = '<%= request.getParameter("uids") == null ? "" : request.getParameter("uids")%>';
			var conid = '<%= request.getParameter("conid") == null ? "" : request.getParameter("conid")%>';
			var conno = '<%= request.getParameter("conno") == null ? "" : request.getParameter("conno")%>';
			var time = '<%= request.getParameter("time") == null ? "" : request.getParameter("time")%>';
			var money = '<%= request.getParameter("money") == null ? "" : request.getParameter("money")%>';
			var relateuids = '<%= request.getParameter("relateuids") == null ? "" : request.getParameter("relateuids")%>';
		</script>
		<script type="text/javascript" src="Business/finalAccounts/complete/facomp.proof.form.js"></script>
	</head>
	<body>
	</body>
</html>
