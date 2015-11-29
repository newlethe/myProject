<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>

<%
String dhx_path = "/dhx";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>DHTMLX</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	
	<script src="<%=dhx_path %>/codebase/dhtmlx.js" type="text/javascript" charset="utf-8"></script>
	<script src="dhtmlx/js/componentsUtil.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx.css" type="text/css" charset="utf-8">
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx_custom.css" type="text/css" charset="utf-8">
	<script type='text/javascript' src='dwr/interface/rzglMainMgm.js'></script>
	<script type="text/javascript">
       var powerLevel = "<%=request.getParameter("powerLevel") %>"=='geren'?"<%=request.getParameter("powerLevel") %>":"";
		dhtmlx.image_path='<%=dhx_path %>/codebase/imgs/';
		var userId = "<%=request.getParameter("userid") %>"==null?"":"<%=request.getParameter("userid")%>";
		var kqtype = "<%=request.getParameter("type") %>"==null?"":"<%=request.getParameter("type") %>";
	</script> 
	<script type="text/javascript" src="Business/rlzy/kqgl/RzglKqhzQuery.js"></script>
  </head>
  <body>
  </body>
</html>
