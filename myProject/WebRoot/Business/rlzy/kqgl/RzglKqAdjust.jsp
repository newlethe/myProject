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
	<script type="text/javascript">
		var MODID ="<%=request.getParameter("modid")%>";
		//新流程参数
		var bpmMode ="<%=request.getParameter("bpmMode")%>"==null?"":"<%=request.getParameter("bpmMode")%>";
		var isFlwView=false;
		var isFlwTask=false;
		if(bpmMode==1){
			var bpmparamObj=parent.getGlobalParamObj();
			if(bpmparamObj!=null){
				stepType=bpmparamObj.stepType==null?"":bpmparamObj.stepType;
			}
			if(accessType=="view"){
				isFlwView=true;
			}else if(accessType=="new"||accessType=="edit"){
				isFlwTask=true;
			}
		}
	</script> 
	<script src="<%=dhx_path %>/codebase/dhtmlx.js" type="text/javascript" charset="utf-8"></script>
	<script src="dhtmlx/js/componentsUtil.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx.css" type="text/css" charset="utf-8">
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx_custom.css" type="text/css" charset="utf-8">
	<script type="text/javascript">
		dhtmlx.image_path='<%=dhx_path %>/codebase/imgs/';
	</script>
	<script type='text/javascript' src='dwr/interface/rzglMainMgm.js'></script>
	<script type="text/javascript" src="Business/rlzy/kqgl/RzglKqAdjust.js"></script>
  </head>
  <body>
  </body>
</html>
