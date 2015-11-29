<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String costType=request.getParameter("costType")==null?"":request.getParameter("costType");
 %>
<html>
	<head>
		<title>其他费用管理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/faCostManageService.js'></script>
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>
		<script type="text/javascript">
			var costType=eval("<%=costType%>");
			if(costType=='1'){
				costType='0001'
			}else if(costType=='2'){
				costType='0002'
			}
		</script>
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<script type="text/javascript" src="Business/finalAccounts/complete/fa.other.cost.manage.js"></script>
  </head>
  
  <body>
    <div></div>
  </body>
</html>
