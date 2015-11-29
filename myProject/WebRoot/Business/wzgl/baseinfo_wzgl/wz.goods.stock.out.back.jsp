 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备出库</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		    var edit_partUids =  "<%=request.getParameter("partUids")==null?"":request.getParameter("partUids")%>";
		    var edit_equName = "<%=request.getParameter("equName")==null?"":request.getParameter("equName")%>";
		    var edit_treeUids = "<%=request.getParameter("treeUids")==null?"":request.getParameter("treeUids")%>";
		    var edit_flagLayout = "<%=request.getParameter("flagLayout")==null?"":request.getParameter("flagLayout")%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>

		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
					
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.cont.tree.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.back.js"></script>
	</head>
	<body>
	</body>
</html>