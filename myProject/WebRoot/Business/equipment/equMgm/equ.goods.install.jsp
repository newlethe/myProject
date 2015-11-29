 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备安装</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		/* 流程任务调用所提供的参数 */
		var flowid = "<%=request.getParameter("flowid")==null?"":request.getParameter("flowid") %>";
		var flowconno = "<%=request.getParameter("conno")==null?"":request.getParameter("conno") %>";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.install.js"></script>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
</html>