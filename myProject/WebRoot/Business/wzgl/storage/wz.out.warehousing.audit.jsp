<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>主体设备出库单稽核，主体材料出库单稽核</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript">
			//区别合同树的一级节点
			var treeFlag = '<%= request.getParameter("treeFlag")%>';
			var tree_flag = treeFlag.substring(0,treeFlag.length - 3);
		</script>
		<script type="text/javascript" src="Business/wzgl/storage/wz.stock.intoAndOut.tree.js"></script>
		<script type="text/javascript" src="Business/wzgl/storage/wz.out.warehousing.audit.js"></script>
	</head>
	<body >
	</body>
</html>
