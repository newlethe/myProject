<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
	
 %>
 <html>
	<head>
		<title>主要合作单位</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript">
			var edit_pid = CURRENTAPPID;
			var dydaView=eval("<%=dydaView%>");
			if(dydaView){
				edit_pid="<%=pid%>";
				ModuleLVL = 6;
			}
			var outFilter = "<%=outFilterStr%>";
			var EDIT ="<%=request.getParameter("edit")%>";
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/zhxx/query/pc.zhxx.projinfo.coUnit.js"></script>
	</head>
	<body >
	</body>
</html>