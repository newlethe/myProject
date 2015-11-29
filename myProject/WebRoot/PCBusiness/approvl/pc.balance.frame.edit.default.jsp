<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>概算结构维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<% 
			String pageLvl = request.getParameter("pageLvl")==null?"0":request.getParameter("pageLvl");
		%>
		<script type="text/javascript">
			var lvl = '<%=pageLvl%>';
			if(lvl=='0')
			{
				//do nothing 不死从结算首页跳转过来的, 使用页面自动加载的页面权限
			}
			else
			{
				ModuleLVL = lvl;   //接收结算首页传递的页面权限参数
			}
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
	    <script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/balanceMgm.js'></script>
		
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%><script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/balance/pc.balance.frame.edit.form.js"></script>
		<script type="text/javascript" src="PCBusiness/balance/pc.balance.frame.edit.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
</html>
