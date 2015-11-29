<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sgepit.frame.base.Constant"%>
<%
	String path     = request.getContextPath();	
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>页面建设中......</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_EXT")%>/resources/css/xtheme-green.css" /> 
    <!-- GC -->
 	<!-- LIBS -->
 	<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/adapter/ext/ext-base.js"></script>
 	<!-- ENDLIBS -->

    <script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/ext-all.js"></script>
    <style type="text/css">
    .x-panel-body p {
        margin:10px;
    }
    #container {
        padding:10px;
        margin: 10,10,10,10;
    }
    </style>
    <script>

	Ext.onReady(function(){
	    var p = new Ext.Panel({
	        title: '此模块尚在开发中！',
	        collapsible:true,
	        renderTo: 'container',
	        width:480,
	        height:320,
	        html: '<img src="<%=basePath%>/jsp/res/images/todo.jpg" width=180 height=200 align="absmiddle"><br>'
	    });
	});	
	</script>
  </head>
  
  <body>
  	
    <div id="container">
    
	</div>
  </body>
</html>
