<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
     <title>设备管理———设备入库新增或修改</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <%@ include file="/jsp/common/golobalJs.jsp" %>
	<base href="<%=basePath%>">
	<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var edit_uids = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		/* 流程任务调用所提供的参数 */
		var flowid = "<%=request.getParameter("flowid")==null?"":request.getParameter("flowid") %>";
		var flowconno = "<%=request.getParameter("conno")==null?"":request.getParameter("conno") %>";
		var moduleFlowType = "<%=request.getParameter("moduleFlowType")%>";
       var banFlag = "<%=request.getParameter("banFlag")==null?"":request.getParameter("banFlag")%>";
    </script>
	</script>
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		
  </head>
  <body>
        <script type="text/javascript" src="Business/equipment/equMgm/equ.storage.tree.js"></script>
        <script type="text/javascript" src="Business/equipment/equMgm/equ.open.checkpackage.list.js"></script> 
        <script type="text/javascript" src="Business/equipment/equMgm/equ.into.warehousing.abnormal.rk.js"></script>       
        <script type="text/javascript" src="Business/equipment/equMgm/equ.into.warehousing.addorupdata.js"></script>
  </body>
</html>
