<%@ page language="java" pageEncoding="UTF-8" %>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String dyreportType = request.getParameter("dyreportType")==null?"":request.getParameter("dyreportType");
	String ppid  = request.getParameter("pid")==null?"":request.getParameter("pid");
	String projectName  = request.getParameter("prjName")==null?"":request.getParameter("prjName");	
%>
	<script type="text/javascript">
		var pid = '<%=ppid%>';
		var projectName = '<%=projectName%>';
		if(pid==''||projectName=='')
		{
			var _reg=/,/g    //正则表达式
			pid=USERPIDS.replace(_reg,"','");
			projectName = CURRENTAPPNAME;
		}
	</script>
 <html>
	<head>
		<title>招标月报查询页面</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var edit_dyreportType = "<%=dyreportType%>";
		</script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.show.superviseReport.js"></script>
	</head>
	<body >
	</body>
</html>