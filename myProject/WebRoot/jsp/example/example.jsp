<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="java.io.File" %>

<html>
	<head>
		<title>系统框架功能示例</title>
		<%@ include file="/jsp/flow/handle/flow.start.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="jsp/example/example.flow.js"></script> 
		<script type="text/javascript" src="jsp/example/example.child.grid.js"></script>
		<script type="text/javascript" src="jsp/example/example.parent.grid.js"></script>
		<script type="text/javascript" src="jsp/example/example.js"></script>
		<script type="text/javascript" src="jsp/common/attachFile/attachfile.js"></script>
  </head>
  
  <body>
    <div></div>
    <div id = 'win'></div>
  </body>
</html>