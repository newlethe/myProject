<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
 %>
 <html>
	<head>
		<title>安全培训查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/pcAqgkService.js'></script>
		<script type="text/javascript">
			var edit_pid = "<%=request.getParameter("edit_pid")==null?"":request.getParameter("edit_pid")%>";
			if(edit_pid==null||edit_pid==""){
				edit_pid=CURRENTAPPID;
			}
			var dydaView=eval("<%=dydaView%>");
			if(dydaView){
				edit_pid="<%=pid%>";
				ModuleLVL=6;
			}
			var outFilter = "<%=outFilterStr%>";
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/util.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/aqgk/baseInfoInput/pc.aqgk.safetyTrain.query.js"></script>
	</head>
	<body >
	</body>
</html>