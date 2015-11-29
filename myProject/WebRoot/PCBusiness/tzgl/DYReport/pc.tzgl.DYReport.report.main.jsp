<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dyreportType = request.getParameter("dyreportType")==null?"":request.getParameter("dyreportType");
	String timeShow = request.getParameter("timeShow")==null? "0":request.getParameter("timeShow");
 %>
 <html>
	<head>
		<title id='dTitle'></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var edit_dyreportType = "<%=dyreportType%>";
			var edit_timeShow = "<%=timeShow%>";
			var  obj = document.getElementById("dTitle");
			if(edit_dyreportType==1){
				obj.text="电源固定资产投资完成情况月报";
			}else if(edit_dyreportType==2){
				obj.text="电源项目建设规模和新增生产能力月报";
			}else if(edit_dyreportType==3){
				obj.text="电源固定资产投资本年资金到位情况";
			}
		</script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/tzgl/DYReport/pc.tzgl.DYReport.report.main.js"></script>
	</head>
	<body >
	</body>
</html>