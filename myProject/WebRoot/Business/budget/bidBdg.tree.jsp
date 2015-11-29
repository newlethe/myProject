<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>概算选择树</title>
  	<base href="<%=basePath%>">
  		<script type="text/javascript">
	  		//招标内容id
			var conid = "<%=request.getParameter("conid")%>";
			conid = (null == conid) ? "" : conid;
			//招标申请主键
			var zbUids = "<%=request.getParameter("zbUids")%>";
			zbUids = (null == zbUids) ? "" : zbUids;
		</script>
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css"/>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/bidBdgApportionMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="extExtend/ColumnTree.js"></script>
		<script type="text/javascript" src="Business/budget/bidBdg.tree.js"></script>
  </head>
  <body>
  	<span></span>
  	<div id="tree"></div>
  </body>
</html>
