<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>招标详细信息</title>
  	<base href="<%=basePath%>">
  	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src="<%=path%>/dwr/interface/db2Json.js"></script>
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- treegrid -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>		
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script> 
		<!-- PAGE -->
		<script type="text/javascript">
			var currentPid = '<%=request.getParameter("pid") == null ? currentAppid : request.getParameter("pid") %>';
			var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		</script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zb.info.treegrid.js"></script>
  </head>
  <body>
  </body>
</html>