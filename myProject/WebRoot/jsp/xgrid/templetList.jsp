<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<% 
     String startStr = request.getParameter("start");
     String rowIndexStr = request.getParameter("rowIndex");
     String checkFlag = request.getParameter("checkFlag")==null? "false" : request.getParameter("checkFlag").toString();
     int start = 0;
     int rowIndex = 0;
     if(startStr!=null&&!startStr.equals("")) start = Integer.parseInt(startStr);
     if(rowIndexStr!=null&&!rowIndexStr.equals("")) rowIndex = Integer.parseInt(rowIndexStr);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	    <title>Xgrid模板维护</title>
	    <%@ include file="/jsp/common/golobalJs.jsp" %>		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript">
		var start = <%=start%>;
		var rowIndex = <%=rowIndex%>;
		var checkFlag = '<%=checkFlag%>';
		</script>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>		
		<script type="text/javascript" src="<%=basePath%>extExtend/columnTreeNodeUI.js"></script>		
		<script type='text/javascript' src='<%=path%>/dwr/interface/systemMgm.js'></script>
		<script type="text/javascript" src="<%=path%>/dwr/interface/sgprjTempletConfigService.js"></script>
        <script type="text/javascript" src="<%=path%>/jsp/xgrid/templetList.js"></script>
  </head>
	<body>
	</body>
</html>