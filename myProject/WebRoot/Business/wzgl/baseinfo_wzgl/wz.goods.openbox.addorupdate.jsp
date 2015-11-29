 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备开箱 - 新增开箱检验单</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var edit_uids = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>

		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
	
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.common.do.column.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.select.contree.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.goods.openbox.addorupdate.js"></script>
	</head>
	<body>
	</body>
</html>