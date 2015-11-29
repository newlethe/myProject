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
	<script type="text/javascript">
		dhtmlx.image_path='<%=dhx_path %>/codebase/imgs/';
	</script>
	<script type="text/javascript" src="Business/rlzy/kqgl/RzglKqTongjiQuery.js"></script>
  </head>
 <body>
 		<div id="toolbar">
	    	<input type="button" value="刷  新" onclick="loadXgrid()"/>
	   		<input type="button" value="导  出" onclick="tranToExcel()"/>
	   </div>
	  <div id="gridbox"></div>
</body>
<script>
var filter;
var str = '';
function loadXgrid(){
	if(str !=''){
		mygrid.clearAndLoad(CONTEXT_PATH +"/kgglController/getKqtj?filter="+filter+str);
	}else{
		mygrid.clearAndLoad(CONTEXT_PATH +"/kgglController/getKqtj?filter="+filter);
	}
}
function tranToExcel(){
	mygrid.toExcel(basePath+"/servlet/DhtmlxExcelGeneratorServlet");
}
</script>
</html>
