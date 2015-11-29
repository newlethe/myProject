<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>概算信息展示页面</title>
    <% String PID=request.getParameter("PID"); %>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<script type="text/javascript">
	 var  PID = '<%=PID%>';
	 var  PNAME = '<%=request.getParameter("pname")%>';
	</script>
			<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
	<script type="text/javascript" src="PCBusiness/budget/bdgInfSummary/pcbdg.info.setting.js"></script>
  </head>
<body>
</body>
</html>
