<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>合同违约</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		  /*一般程序调用参数*/
		  var g_conid = "<%=request.getParameter("conid")%>";
		  var g_breid = "<%=request.getParameter("breid")%>";
		/*任务调用参数*/
		var g_conno = "<%=(String)request.getParameter("conno")==null?"":(String)request.getParameter("conno")%>";
		var g_breno = "<%=request.getParameter("breno")==null?"":request.getParameter("breno") %>";
		var g_faceid = "<%=request.getParameter("faceid") ==null?"":request.getParameter("faceid")%>";
		</script>

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/conbreMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
        <script type='text/javascript' src='dwr/interface/baseDao.js'></script>
        <script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/cont.breach.input.addorupdate.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>