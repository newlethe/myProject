<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<html>
	<head>
		<title>系统组织机构设置</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
		var defaultParentId = '<%= aPPOrgRootID %>';
		var defaultParentName = '<%= aPPOrgRootName %>';
		var userBelongUnitType = '<%=Constant.propsMap.get("USERBELONGUNITTYPE")%>';
		</script>
		<script src='dwr/interface/pcPrjService.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		<script type="text/javascript" src="jsp/system/sys.orgs.setting.js"></script>
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
