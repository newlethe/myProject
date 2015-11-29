<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同概算分摊动态展示</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var mainPanel;
			var PID='<%=request.getParameter("pid")%>';
			var TIME='<%=request.getParameter("time")%>';
			var UIDS="<%=request.getParameter("uids")%>";
			var TYPE='<%=request.getParameter("type")%>';
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/bdg/bdg.con.main.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
	</head>
	<body>
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%" frameborder=no src=""></iframe>
		</div>
	</body>
</html>