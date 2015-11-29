<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
  <head>
    <title>质量验评记录管理</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
  </head>
     <script type="text/javascript">
		var PID = CURRENTAPPID;
		var edit_flag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
	 	var whereSql = '';
	 	if(edit_flag == 'addOrupdate'){
	         whereSql = " 1=1 ";
    	}else if(edit_flag == 'approval'){
	         whereSql	 = " billstatesp in ('0','1','2','3')";
	    }else if(edit_flag == 'query'){
	         whereSql	 = " billstatecx in ('0','1')";
	    }
	 </script>
  <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="dwr/interface/equMgm.js"></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/zlgkMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type="text/javascript" src="Business/equipment/equMgm/queryGrid.js"></script>
  <!-- EXTEND --><!--	
       	
		<script type="text/javascript"   src="<%=path%>/extExtend/FileUploadField.js">-->
  <!-- treegrid -->
        <link rel="stylesheet" type="text/css"	href="<%=path%>/extExtend/FileUploadField.css" />
    	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
  		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
  
 <!--PAGE -->
        <script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
        <script type='text/javascript' src='PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.common.tree.js'></script>
        <script type='text/javascript' src='PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.record.js'></script>
  <body>
  </body>
</html>
