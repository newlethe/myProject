 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备暂估出库列表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<script type="text/javascript">
	     var uidsStr = "<%=request.getParameter("uidsStr")==null?"":request.getParameter("uidsStr")%>";
	     var conidStr = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
	     var treeuidsStr = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
	     var editFlag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
	     var edit_flagLayout = "<%=request.getParameter("flagLayout")==null?"":request.getParameter("flagLayout")%>";
	     </script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		
		<!-- PAGE -->
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.estimate.list.js"></script>
	</head>
	<body>
	</body>
</html>