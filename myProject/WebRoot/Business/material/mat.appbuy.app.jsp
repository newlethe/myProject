<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.sysman.service.ApplicationMgmFacade"%>
<%	
	ApplicationMgmFacade appMgm = (ApplicationMgmFacade)Constant.wact.getBean("applicationMgm");
	String appList = JSONUtil.formObjectsToJSONStr(appMgm.getCodeValue("材料用途"));
    String appUse = JSONUtil.formObjectsToJSONStr(appMgm.getCodeValue("材料申请用途"));
%>
<html>
	<head>
		<title>物资申请计划</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/appBuyMgm.js'></script>  
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type="text/javascript" src="dwr/interface/appMgm.js"></script>
		
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = <%=request.getParameter("isView") %>;
		/* 流程任务调用 */
		var isFlwTask = <%=request.getParameter("isTask") %>;
		
		var appList = <%= appList%>
		var appUse = <%=appUse%>
		</script>
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/material/mat.bdg.select.js"></script>
		<script type="text/javascript" src="Business/material/mat.contract.select.js"></script>  
		<script type="text/javascript" src="Business/material/mat.appbuy.material.js"></script>  
		<script type="text/javascript" src="Business/material/mat.appbuy.app.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
