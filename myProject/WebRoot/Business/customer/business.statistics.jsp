<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<!DOCTYPE html>
<html lang="zh">
<head>
    <title>客户回款查询</title>
	<meta charset="utf-8">
	<base href="<%=basePath%>">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<script type="text/javascript" src="dwr/util.js"></script>
	<script type="text/javascript" src="dwr/engine.js"></script>
	<script type="text/javascript" src="dwr/interface/db2Json.js"></script>
	<script type="text/javascript" src="dwr/interface/baseMgm.js"></script>
	<script type="text/javascript" src="dwr/interface/appMgm.js"></script>
	<script type="text/javascript" src="dwr/interface/stockMgm.js"></script>
	<script type="text/javascript" src="dwr/interface/baseDao.js"></script>
	<script type="text/javascript" src="common/common.js"></script>
	<script type="text/javascript">
		var viewUser = "<%=request.getParameter("viewUser")==null?"":request.getParameter("viewUser")%>";
		console.log("viewUser>>>"+viewUser);
		USERID = viewUser || USERID;
		console.log("USERID>>>"+USERID);
	</script>
	<script type="text/javascript" src="Business/customer/business.statistics.js"></script>
  </head>
  <body>
  </body>
</html>
