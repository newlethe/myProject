<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
	
<html>
	<head>
		<title>报表模板设置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
		var defaultParentId = '<%= Constant.DefaultOrgRootID %>';
		var defaultParentName = '<%= Constant.DefaultOrgRootNAME %>';
		var basePath = '<%= basePath %>';
		
		</script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/interface/systemTemplateService.js'></script>
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="jsp/common/tree/unit.tree.js"></script>
		<script type="text/javascript" src="jsp/system/sys.template.setting.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/systemTemplateService.js"></script>
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#detail-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
