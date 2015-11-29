<%@ page language="java" pageEncoding="UTF-8" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    
    <title>车辆使用管理</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/vehicleMgm.js'></script>
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
    <link rel="stylesheet" type="text/css" href="extExtend/Datetime/datetime.css"></link>
	<script type="text/javascript">
	 var  useAction = "<%=request.getParameter("useAction")==null?"":request.getParameter("useAction")%>";
	</script>
    <script type="text/javascript" src="extExtend/Datetime/Datetime.js"></script>
    <script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
	<script type="text/javascript" src="Business/vehicle/vehicle.use.management.js"></script>
	<script type="text/javascript" src="Business/vehicle/query.js"></script>
	
  </head>
  
  <body>
  </body>
</html>
