<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>选择采购计划</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<style>
			.x-grid3-cell-inner,.x-grid3-hd-inner{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;padding:3px 3px 3px 5px;white-space:normal;} 
		</style>
		<script type="text/javascript">
  			var obj = window.dialogArguments;
  			var g_conId = obj.conId;  			
  			var g_conNo = obj.conNo;
  			var g_type = (obj.funType==null ? "Con" : obj.funType);
  			var g_filter = "";

  			if(g_type == "Con"){
  				g_filter = " bm not in(select bm from  ConMat where hth ='"+g_conId+"')"
  			} 
  			if(g_type == "Arrive"){
  				g_filter = " bm not in(select bm from  WzCjhxb where bh ='"+g_conId+"')"
  			} 
  			
  			
  			
  			
		</script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>  
		<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock/stockConSelectStorage.js"></script>	
	</head>
	<body >
		<span></span>
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	</body>
</html>
