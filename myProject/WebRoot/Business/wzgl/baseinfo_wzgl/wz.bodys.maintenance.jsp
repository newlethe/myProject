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
		   var   edit_flagLayout = "WZBODY";
		   var   edit_flag = "<%=request.getParameter("flag")==null?"":request.getParameter("flag")%>";
		</script>
		
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equBaseInfo.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>

		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.cont.tree.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.bodys.maintenance.js"></script>
	</head>
	<body >
		<div id="equBodysWin1" style='display:none'>
			<div id="equBodysWin2">
				<iframe id="equBodysWin" name="equBodysWin1" style="width:100%; height:100%" src=""></iframe>
			</div>
		</div>
	</body>
</html>
