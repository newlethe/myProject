<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>会话过期页面</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body>
   <b>您好，由于您长时间未进行任何操作，安全起见，系统已经断开了您的连接。<br /><br /> 要访问系统，请重新登录系统 <u style='cursor:hand;' title='刷新页面重新登录' onclick='reLogin()' ><font color=blue>重新登录</font>
   </a> </b>
    
  </body>
  <script>	
  		function reLogin(){
  			top.location.href = "<%=basePath%>"
  		}
  </script>
</html>
