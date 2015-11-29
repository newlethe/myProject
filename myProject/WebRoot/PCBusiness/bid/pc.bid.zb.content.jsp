<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>招标申请</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script src='dwr/engine.js'></script>
			<script type="text/javascript">
		var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
		</script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zb.content.js"></script>
			<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
	
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
