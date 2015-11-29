<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>概算结构维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
	    <script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<script type="text/javascript">
			var indexView = "<%=(String)request.getParameter("indexView")==null?"":(String)request.getParameter("indexView")%>";
			var getPid = "<%=request.getParameter("getPid")==null?"":request.getParameter("getPid")%>";
		</script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%><script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/budget/bdg.frame.edit.form.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.frame.edit.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm"></form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0;display:none" scrolling="auto" ></iframe>
	</body>
</html>
