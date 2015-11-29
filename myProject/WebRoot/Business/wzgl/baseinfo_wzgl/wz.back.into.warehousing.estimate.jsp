<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>材料管理———材料冲回入库</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <%@ include file="/jsp/common/golobalJs.jsp" %>
	<base href="<%=basePath%>">

    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
    <script type="text/javascript">
    		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
            var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
            var edit_flag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
            var edit_flagLayout = "<%=request.getParameter("flagLayout")==null?"":request.getParameter("flagLayout")%>";
    </script>
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>

		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.back.into.warehousing.estimate.js"></script>
  </head>
  
  <body>
  </body>
</html>
