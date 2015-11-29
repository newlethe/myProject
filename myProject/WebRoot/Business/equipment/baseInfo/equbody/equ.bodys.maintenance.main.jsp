<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备入库主设备维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		    var edit_partUids =  "<%=request.getParameter("partUids")==null?"":request.getParameter("partUids")%>";
		    var edit_equName = "<%=request.getParameter("equName")==null?"":request.getParameter("equName")%>";
		    var edit_treeUids = "<%=request.getParameter("treeUids")==null?"":request.getParameter("treeUids")%>";
		    var arriveFlag = "uncontrol";
		    var DATA_TYPE="EQUBODY";
		</script>
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equBaseInfo.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/faFixedAssetService.js'></script>

		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>	

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- 支持翻页选择的js -->
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.stock.tree.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.cont.tree.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.cont.tree.js"></script>

		<!-- 入库管理 -->
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.maintenance.main.into.formal.js"></script>

		<!-- 出库管理 -->
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bdg.project.apportion.grid.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.maintenance.main.out.formal.js"></script>

		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.maintenance.main.js"></script>
	</head>
	<body >
	</body>
</html>
