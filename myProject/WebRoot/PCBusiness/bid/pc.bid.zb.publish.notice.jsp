<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>招标申请</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>		
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>	
		<script type="text/javascript">
			var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
			var editable = '<%=request.getParameter("edit") == null ? "1" : request.getParameter("edit") %>';
			//项目类型，主要用于处理项目的特殊需求  CHANGZHI 长治欣隆
			var projectType = '<%=request.getParameter("projectType") == null ? "" : request.getParameter("projectType") %>';
		</script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zb.publish.notice.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
	
		<style type="text/css">
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
