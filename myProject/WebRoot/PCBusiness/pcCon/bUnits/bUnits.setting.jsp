<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
	 <%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>乙方单位维护</title>
    <% String PID=request.getParameter("PID"); %>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<script type="text/javascript">
	 var  PID = '<%=PID%>';
	 var  PNAME = '<%=request.getParameter("pname")%>';
	</script>
		<script src='dwr/engine.js'></script>
		<script src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src="PCBusiness/budget/bdgEntry/JsonReader.js"></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<script type="text/javascript" src="PCBusiness/pcCon/bUnits/bUnits.setting.js"></script>
  </head>
  <body>
  </body>
</html>
