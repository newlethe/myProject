<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String edit = request.getParameter("edit")==null?"false":(request.getParameter("edit").equals("true")?"true":"false");
	String currAppid = (String)session.getAttribute(Constant.CURRENTAPPPID);
	String add=request.getParameter("add")==null?"false":(request.getParameter("add").equals("true")?"true":"false");
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	String prePid=request.getParameter("prePid")==null?"":(request.getParameter("prePid"));
	if(pid.equals("false")){}else{currAppid=pid;};
%>
<html>
	<head>
		<title>前期项目基本信息添加或更新</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>

		<script type="text/javascript">
			var edit_pid = "<%=currAppid%>";
			var add=eval("<%=add%>");
			var edit = "<%=edit%>";
			var dydaView=eval("<%=dydaView%>");
			var prePid = "<%=prePid%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/zhxx/baseInfoInput/pc.zhxx.pre.projMgm.baseinfo.addOrUpdate.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
