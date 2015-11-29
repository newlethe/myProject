 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同基本信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		
		var winParm = window.dialogArguments;
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		//var g_conid = (winParm == null? "":winParm.conid);
		var g_conid = "<%=request.getParameter("conid") %>";
		/* 流程任务调用所提供的参数 */
		//var g_conno = (winParm == null? "":winParm.conno);
		var g_conno = "<%=request.getParameter("conno") %>";
		var g_faceid = "<%=request.getParameter("faceid") %>";
		//var g_signdate = "request.getParameter("signdate") ";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/equlistMgm.js'></script> 
		

		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/contPartbOrg/partbOrg.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock/stockCon.addorupdate.js"></script>  
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<span></span>

	</body>
	

</html>