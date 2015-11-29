<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>      
		<title>设备领用信息维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
		<script type="text/javascript">
		  var recsubid = "<%=request.getParameter("recsubid")%>";
		  var conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid").replaceAll("'","")%>";
		  var recid = "<%=request.getParameter("recid")==null?"":request.getParameter("recid")%>";
		  var storenum = "<%=request.getParameter("storenum")%>";
		</script>

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE 
		<script type="text/javascript" src="Business/equipment/equ.recipients.addorupdate.js"></script>
		-->
		<script type="text/javascript" src="Business/equipment/equ.recipients.addorupdate.erc.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>