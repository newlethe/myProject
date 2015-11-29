<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"false":(request.getParameter("pid"));
	String outFilterStr = request.getParameter("outFilter")==null?"1=1":request.getParameter("outFilter").toString();
 %>
 <html>
	<head>
		<title>质量验评信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
			var dydaView=eval("<%=dydaView%>");
			if(dydaView){
				pid="<%=pid%>";
				lvl=6;
			}
			var outFilter = "<%=outFilterStr%>";
		</script>
		<!-- DWR -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/zlgkMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<!-- EXTEND -->
		<script type="text/javascript" src="extExtend/monthPick.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/zlgk/pc.zlgk.input.assessment.multi.js"></script>
	</head>
	<body >
	</body>
</html>