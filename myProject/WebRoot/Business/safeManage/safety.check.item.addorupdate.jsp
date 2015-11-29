<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
  	<head>  
    	<title>安监项目表</title>
    	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/safeManageMgmImpl.js'></script>
		
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Datetime/datetime.css"></link>
		<script type="text/javascript">var baseUrl = "<%=basePath%>";</script>
		<script type="text/javascript" src="Business/safeManage/safety.check.item.addorupdate.js"></script>
		<script type="text/javascript" src="extExtend/Datetime/Datetime.js"></script>
		<script type='text/javascript'>
			var uuid_edit = "<%=request.getParameter("uuid")==null?"":request.getParameter("uuid")%>";
		</script>
		
	
		<!-- PAGE -->
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			/* 流程任务调用所提供的参数 */
			var bh_flow = "<%=(String)request.getParameter("bh_flow") %>";
		</script>
		
	</head>
	<body>

	</body>
</html>
