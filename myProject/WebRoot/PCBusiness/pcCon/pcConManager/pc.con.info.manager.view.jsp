<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>合同信息展示页面</title>
    <% String PID=request.getParameter("PID"); %>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<script type="text/javascript">
	 var  PID = '<%=PID%>';
	 var  PNAME = '<%=request.getParameter("pname")%>';
	</script>
	<script type="text/javascript" src="PCBusiness/pcCon/pcConManager/pc.con.info.manager.view.js"></script>
  </head>
<body>
</body>
</html>
