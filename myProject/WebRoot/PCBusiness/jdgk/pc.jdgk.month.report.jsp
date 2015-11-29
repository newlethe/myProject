<%@ page language="java" pageEncoding="UTF-8" %>
<% 
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
%>
 <html>
	<head>
		<title>进度情况月报上报查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var dydaView=eval("<%=dydaView%>");
			if(dydaView)
			{
				ModuleLVL = 6;
			}
		
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcJdgkMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/pcDataExchangeService.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.month.report.js"></script>
	</head>
	<body>
	</body>
</html>