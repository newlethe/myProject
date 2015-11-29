<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
	
<html>
	<head>
		<title>指标信息管理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<script src='dwr/interface/guidelineService.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		
		<script type="text/javascript" src="Business/jsp/common/tree/guidelineTree.js"></script>
		<script type="text/javascript" src="jsp/guideline/guideline.formula.setting.js"></script>
		<script type="text/javascript" src="jsp/guideline/guideline.setting.js"></script>
		<script>
		var defaultParentId = '<%= Constant.APPOrgRootID %>';
		var defaultParentName = '<%= Constant.APPOrgRootNAME %>';
		
		</script>
		<style>
			#west-panel {border-right:1px solid #99bbe8;}
			#guideline-grid-panel {border-left:1px solid #99bbe8;}
			.x-fieldset-free{
				border:0px;
			}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
