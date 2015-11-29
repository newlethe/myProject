<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>动态数据首页</title>
    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/pcDynamicDataService.js'></script>
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type="text/javascript" src="PCBusiness/dynamicdata/dynamic.data.index.js"></script>
   <script type="text/javascript">
   		/*项目单位通过审核评分链接跳转到该页面*/
   		var VIEW = eval("<%=request.getParameter("view")==null ? false : true%>"); 
   		/*集团用户查看单个项目单位的审核评分*/
   		var pid = "<%=request.getParameter("pid")==null ? "0" : request.getParameter("pid")%>"
   		 /*集团登录用户读写权限判断*/
   		var EDIT = (ModuleLVL>3) ? false : true;
   </script>
  </head>
  <body>
  <div id='grid' style:"display: none;"></div>
  <div id="bb" style="display:none;width:200px;left:0px;top:0px;background-color:orange;position:absolute;z-index:100; "></div>
  <div id="auditCombo" onmouseout="setTimeout('hideCombo()',3000)" style="display:none; left:0px; top:0px; position:absolute;z-index:100; "></div>
  </body>
</html>
