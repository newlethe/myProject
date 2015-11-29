<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%><%
SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
%>
<html>
	<head>
		<title>Portlets设置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
		var defaultParentId = '<%= Constant.APPModuleRootID %>';
		</script>
		<script type="text/javascript" src="jsp/system/sys.portlets.config.js"></script>
		<style>
		.drop-target {padding: 10 10 10 10; font-size:14px; border: 1px solid blue; height:100%};
		.drop-target-hover{border: 1px solid red}
		</style>
  </head>
  
  <body>
    <div></div><br><br></body>
</html>
