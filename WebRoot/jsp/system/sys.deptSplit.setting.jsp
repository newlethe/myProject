<%@ page language="java"  pageEncoding="UTF-8"%>
<%
	String unitName = (String)session.getAttribute(Constant.USERUNITNAME);
%>
<html>
	<head>
		<title>系统岗位定义</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script>
			var unitId = '<%=userunitid%>'
			var unitName = '<%=unitName%>'
		</script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/infoPubService.js'></script>
		<script src="dwr/interface/db2Json.js"></script>
		<script type="text/javascript" src="jsp/system/sys.deptSplit.setting.js"></script>
  </head>
  
  <body>
    <div></div>
  </body>
</html>
