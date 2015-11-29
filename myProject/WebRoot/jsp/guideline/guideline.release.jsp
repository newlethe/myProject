<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
	
<html>
	<head>
		<title>指标下达管理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<script src='dwr/interface/guidelineService.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		
		<script type="text/javascript" src="<%=basePath %>extExtend/columnNodeUI.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type="text/javascript" src="jsp/common/tree/guidelineColumnTree.js"></script>
		<script type="text/javascript" src="jsp/common/tree/unit.tree.js"></script>
		<script type="text/javascript" src="jsp/guideline/guideline.release.js"></script>
		<script>
		var defaultParentId = '<%= Constant.APPOrgRootID %>';
		var defaultParentName = '<%= Constant.APPOrgRootNAME %>';
		
		</script>
		<style>
			#west-panel {border-right:1px solid #99bbe8;}
			#guideline-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
    <div id="tree-ct"></div>
  </body>
</html>
