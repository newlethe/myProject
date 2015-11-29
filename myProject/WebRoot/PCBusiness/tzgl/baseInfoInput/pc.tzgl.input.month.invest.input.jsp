<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
 %>
 <html>
	<head>
		<title>投资完成情况录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
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
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.month.invest.input.js"></script>
	</head>
	<body >
	</body>
</html>