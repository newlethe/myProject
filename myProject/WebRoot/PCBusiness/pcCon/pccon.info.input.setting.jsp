<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>合同信息录入</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/baseDao.js'></script>
			<script type="text/javascript">
	 var  PID = '<%=request.getParameter("PID")%>';
	 var  PNAME = '<%=request.getParameter("pname")%>';
	</script>
	<script type="text/javascript" src="PCBusiness/pcCon/pccon.info.input.setting.js"></script>
  </head>
  <body>
  </body>
</html>
