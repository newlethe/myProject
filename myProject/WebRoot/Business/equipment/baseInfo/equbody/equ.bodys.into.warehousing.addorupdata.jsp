<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>设备管理———设备入库新增或修改</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <%@ include file="/jsp/common/golobalJs.jsp" %>
	<base href="<%=basePath%>">

    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
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
        <link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		
  </head>
      <script type="text/javascript">
    		var edit_uids = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
    		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
            var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
            var banFlag = "<%=request.getParameter("banFlag")==null?"":request.getParameter("banFlag")%>";
            var edit_mark = "<%=request.getParameter("mark")==null?"":request.getParameter("mark")%>";
            var getWhereSql = "<%=request.getParameter("whereSql")==null?"":request.getParameter("whereSql")%>";
            var dataType = "<%=request.getParameter("dataType")==null?"":request.getParameter("dataType")%>";
			//入库单稽核管理传入的参数
			var view = "<%=request.getParameter("view")==null?"":request.getParameter("view")%>";
      </script>
  <body>
  		<!-- 支持翻页选择的js -->
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
  		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.common.do.column.js"></script>
        <script type="text/javascript" src="Business/equipment/baseInfo/equ.stock.tree.js"></script>
        <script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.check.list.js"></script>
        <script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.open.checkpackage.list.js"></script> 
        <script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.into.warehousing.abnormal.rk.js"></script>       
        <script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.into.warehousing.addorupdata.js"></script>
  </body>
</html>
