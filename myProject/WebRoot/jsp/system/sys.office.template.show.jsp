<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String templateCode = request.getParameter("templateCode");
if (templateCode == null){
	out.println("templateCode is null.");
	out.close();
}
String readOnly = request.getParameter("readOnly")!=null?request.getParameter("readOnly"):"true";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>模板</title>
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script>
	var MAIN_SERVLET = "<%=basePath%>/servlet/MainServlet";
	var templateCode = "<%=templateCode%>";
	</script>
	<script type="text/javascript">

		function init(){
			openTemplate();
		}
		
		function openTemplate(){
			var tanger = document.all('TANGER_OCX');
			var ServletUrl = MAIN_SERVLET + "?ac=getTemplate&templateCode="+templateCode
			tanger.OpenFromURL(ServletUrl)
		}		
	</script>
	
  </head>
  
  <body style="margin:0px;" scroll=no onload="init()">
	<div style="width:100%; height:100%">
				<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
					codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="100%">
					<param name="Menubar" value="-1">
					<param name="Titlebar" value="0">
					<param name="IsShowToolMenu" value="-1">
					<param name="IsHiddenOpenURL" value="0">
					<param name="IsUseUTF8URL" value="-1">
					<%=Constant.NTKOCOPYRIGHT%>
					<SPAN STYLE="color:red"><br>不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
				</object>
	</div>  
  </body>
</html>
