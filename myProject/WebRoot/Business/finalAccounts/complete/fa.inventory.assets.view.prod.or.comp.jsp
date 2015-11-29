<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>生产准备出库资产管理</title>
    <base href="<%=basePath%>">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<script type="text/javascript">
		var PID = CURRENTAPPID;
		var edit_flag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
	 </script>
	 
	<!-- STYLE -->
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
	<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
	<!-- DWR -->
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>	
	<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>	

	<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
	<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
	<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
	<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
	
	<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/faFixedAssetService.js'></script>
	<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
	<!-- JS -->
	<!-- PAGE -->
	<script type='text/javascript' src='Business/finalAccounts/complete/fa.inventory.assets.view.tree.js'></script>
	<script type='text/javascript' src='Business/finalAccounts/complete/fa.invertory.assets.view.prod.or.comp.tree.js'></script>
	<script type='text/javascript' src='Business/finalAccounts/complete/fa.inventory.assets.view.prod.or.comp.js'></script>
  </head>
  
  <body>
       <div id="tree" style="height:800px;"></div> 
  </body>
</html>
