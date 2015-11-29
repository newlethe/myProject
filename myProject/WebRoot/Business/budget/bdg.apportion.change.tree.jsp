<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>树</title>
  	<base href="<%=basePath%>">
  	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgChangeMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgPayMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgBalMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgBreachMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgCompensateMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript">
			var conid = "<%=request.getParameter("conid") %>";
			var childid;
			var treeTitle = '合同变更分摊';
			var selectedConName;
			var chaName;
			childid = "<%=request.getParameter("chaid")%>";
				
		//动态数据
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		//动态数据
		</script>
		<script type="text/javascript" src="Business/budget/bdg.apportion.change.tree.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script> 
  </head>
  <body>
  	<span></span>
  </body>
</html>
