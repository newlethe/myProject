<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String isView=request.getParameter("isView")==null?"false":(request.getParameter("isView").equals("true")?"true":"false");
%>
<html>
	<head>
		<title>单项目计划进度查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link href="gantt/scripts/edo/res/css/edo-all.css" rel="stylesheet" type="text/css" />    
		<link href="gantt/scripts/edo/res/product/project/css/project.css" rel="stylesheet" type="text/css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcJdgkMgm.js'></script>
		<!-- GANTT -->
		<script src="gantt/scripts/edo/edo.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/edoproject.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/weekDay.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/ProjectSelectWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/ProjectWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/TaskWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/CalendarWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/ConstraintWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/PredecessorWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/ResourceWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/edo/windows/CalendarWindow.js" type="text/javascript"></script>
		<script src="gantt/scripts/thirdlib/excanvas/excanvas.js" type="text/javascript"></script>
		<script src="gantt/ProjectService.js" type="text/javascript"></script>
		<script type="text/javascript">
		var dydaView = eval("<%=dydaView%>");
		var isView = "<%=isView%>";
		
		//区分里程碑计划（li）和一级网络计划（yi）
		var plan = "<%=(String)request.getParameter("plan")%>";
		plan = plan=="yi"?"yi":"li";
		
		if(dydaView){
			ModuleLVL = 6;
		}
		//项目编号
		var ProjectUID = "<%=(String)request.getParameter("projectid")==null?"": (String)request.getParameter("projectid")%>";

		//动态数据参数
		var PID="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
		var PRONAME="<%=request.getParameter("proName")==null?"":request.getParameter("proName")%>";
		
		//是否可以编辑计划
		var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
		if(lvl != null && lvl != "") ModuleLVL = lvl
		var isEditPlan = ModuleLVL=="1"?true:false;
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.project.js"></script>
	</head>
	<body>
	</body>
</html>