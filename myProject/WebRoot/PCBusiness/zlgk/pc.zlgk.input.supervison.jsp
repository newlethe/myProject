<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
 %>
 <html>
	<head>
		<title>监理报告信息查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			var pid = "<%=(String)request.getParameter("pid")==null?"": (String)request.getParameter("pid")%>";
			var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
			var dydaView=eval("<%=dydaView%>");
			if(dydaView){
				lvl=6;
			}
			var outFilter = "<%=outFilterStr%>";
			var type = "<%=(String)request.getParameter("type")==null?"0": (String)request.getParameter("type")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/zlgkMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/zlgk/pc.zlgk.input.supervison.js"></script>
	</head>
	<body >
	</body>
</html>