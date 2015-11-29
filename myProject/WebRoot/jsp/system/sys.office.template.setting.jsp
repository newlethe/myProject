<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>系统OFFICE文档模板</title>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
		var defaultParentId = '<%= Constant.APPModuleRootID %>';
		
		</script>
		<script type="text/javascript" src="jsp/system/sys.office.template.setting.js"></script>
		<style>
			#main-panel {border-left:1px solid #99bbe8;}
			#posi-grid-panel {border-bottom:1px solid #99bbe8;}
			#template-grid-panel {border-top:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
