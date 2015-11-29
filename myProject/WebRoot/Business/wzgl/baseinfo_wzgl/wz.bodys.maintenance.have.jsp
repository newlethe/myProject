<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备部件维护</title>
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
		    var edit_flagLayout = "<%=request.getParameter("edit_flagLayout")==null?"":request.getParameter("edit_flagLayout")%>";
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

		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>

		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
				
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.cont.tree.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.bodys.maintenance.have.js"></script>
	</head>
	<body >
	</body>
</html>
