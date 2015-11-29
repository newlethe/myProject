<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>

<%
String dhx_path = "/dhx";
%>

<html>
  <head>
    <base href="<%=basePath%>">
    <title>加班管理</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script src="<%=dhx_path %>/codebase/dhtmlx.js" type="text/javascript" charset="utf-8"></script>
	<script src="dhtmlx/js/componentsUtil.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx.css" type="text/css" charset="utf-8">
	<link rel="stylesheet" href="<%=dhx_path %>/codebase/dhtmlx_custom.css" type="text/css" charset="utf-8">
	<script type="text/javascript">
	   //1表示管理员  0表示普通员工
	    var powerLevel ="<%=request.getParameter("powerLevel")==null?"0":request.getParameter("powerLevel")%>";
	    if(powerLevel=='1'&&ModuleLVL=='3'){
	    	powerLevel='2';//只查询
	    }
	    //var powerLevel =ModuleLVL=='3'?"0":"1";
		dhtmlx.image_path='<%=dhx_path %>/codebase/imgs/';
		var MODID ="<%=request.getParameter("modid")%>";
		//新流程参数
		var bpmMode ="<%=request.getParameter("bpmMode")%>"==null?"":"<%=request.getParameter("bpmMode")%>";
		var accessType ="<%=request.getParameter("accessType")%>"==null?"":"<%=request.getParameter("accessType")%>";
		//自定义参数，报表主键
		var masterid ="<%=request.getParameter("masterid")%>"==null?"":"<%=request.getParameter("masterid")%>";
		var stepType ="";//类型  1 填写出差单基本信息和预计出差信息   2 填写实际出差信息
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
	<script type='text/javascript' src="<%=path%>/dwr/engine.js"></script>
    <script type='text/javascript' src="<%=path%>/dwr/util.js"></script>
	<script type='text/javascript' src='<%=path%>/dwr/interface/rzglMainMgm.js'></script>
	<script type="text/javascript" src="Business/rlzy/kqgl/RzglKqOvertimeIndex.js"></script>
  </head>
  <body>
  </body>
</html>
