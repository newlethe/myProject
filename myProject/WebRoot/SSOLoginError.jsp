<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String errorMsg = new String(request.getParameter("errorMsg"));
 %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<head>
	<title><%=Constant.DefaultModuleRootName%></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

<body>

<script language="JavaScript" type="text/JavaScript">	
	document.write("<%=errorMsg%>")
</script>