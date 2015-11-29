<%@ page language="java" pageEncoding="utf-8" %>
<%
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"":(request.getParameter("pid"));
	String dyUids = request.getParameter("dyUids")==null?"":request.getParameter("dyUids").toString();
 %>
 <html>
	<head>
		<title>车辆年度综合统计</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var outFilter = "1=1";
			edit_pid = "<%=pid%>";
			var dydaView = eval("<%=dydaView%>");
			
			if(edit_pid==null||edit_pid==""){
				edit_pid=CURRENTAPPID;
			}
			
			if(dydaView){
			    dyUids = "<%=dyUids%>"
			    if(dyUids!=''){
			    	outFilter = "uids in" + ("('" + dyUids +"')").replace(",","','");
			    }
			    var temp = ("('"+dyUids+"')").replace(",","','");
				ModuleLVL=6;
			}
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="Business/vehicle/Vehicle.Statics.Management.js"></script>
	</head>
	<body >
	</body>
</html>