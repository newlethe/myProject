<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>    
		<title>合同基本信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>dwr/interface/systemMgm.js'></script>
		<!-- PAGE -->
		
		<script type="text/javascript">
			var mainPanel;
		</script>
		<script type="text/javascript" src="Business/equipment/equ.main.frame.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%" frameborder=no src=""></iframe>
		</div>
	</body>
</html>