<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>变更新增修改页面</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <%@ include file="/jsp/common/golobalJs.jsp" %>
        <base href="<%=basePath%>">

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conchaMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<style type="text/css">.shawsar {text-align: right;}</style>

		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		var g_conid = "<%=request.getParameter("conid")==null?"": request.getParameter("conid")%>";
		var g_chaid = "<%=request.getParameter("chaid")==null?"": request.getParameter("chaid")%>";
		/* 流程任务调用所提供的参数 */
		var g_conno = "<%=(String)request.getParameter("conno")==null?"":(String)request.getParameter("conno")%>";
		var g_chano = "<%=request.getParameter("chano")==null?"":request.getParameter("chano") %>";
		var g_faceid = "<%=request.getParameter("faceid") ==null?"":request.getParameter("faceid")%>";
		var MODID ="<%=request.getParameter("modid")%>";
		</script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="Business/contract/cont.change.addorupd.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<span></span>
	</body>
</html>
