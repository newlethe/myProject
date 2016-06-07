<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant"%>
<%@page import="java.io.File"%>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>系统资源-图标</title>
    <style>
    	td {
    		padding:8px;
    	}
    </style>
	<script type="text/javascript">

		function selectIcon(obj){
			parent.iconSelected = obj.title
			parent.iconsWin.hide();
		}	
	</script>
	
  </head>
  
  <body style="margin:0px;">
	<div style="width:100%; height:100%">
	<% 
		String resourceIconsFolder = Constant.AppRootDir.concat( 
					java.io.File.separator).concat("jsp").concat( 
					java.io.File.separator).concat("res").concat( 
					java.io.File.separator).concat("images").concat( 
					java.io.File.separator).concat("icons"); 
		java.io.File file = new java.io.File(resourceIconsFolder); 
		out.println("<table>"); 
		if (file.exists()){ 
			File[] icons = file.listFiles(); 
			for(int i=0; i<icons.length; i++){ 
				if (i % 20 == 0) 
					out.println("<tr>"); 
				out.println("<td><img title='");
				out.println(icons[i].getName());
				out.println("' src='jsp/res/images/icons/"); 
				out.println(icons[i].getName()); 
				out.println("' align=absmiddle onclick=selectIcon(this)></td>"); 
			} 
		} 
		out.println("</table>");
	%>
	<br></div>  
  </body>
</html>
