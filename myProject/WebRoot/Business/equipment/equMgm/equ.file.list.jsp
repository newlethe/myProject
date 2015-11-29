 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备到货</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_uids = "<%=request.getParameter("edit_uids")==null?"":request.getParameter("edit_uids")%>";
		var selectUuid = "<%=request.getParameter("uuid")==null?"":request.getParameter("uuid")%>";
		var selectConid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var fileEdit = "<%=request.getParameter("edit").equals("true")?true:false%>";
		var type = "<%=request.getParameter("type")==null?"":request.getParameter("type")%>";
		var edit_uids = "";
		if(parent.formPanel)
			if(parent.formPanel.getForm().findField("uids")){
				edit_uids = parent.formPanel.getForm().findField("uids").getValue();
			}
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
		
		<script type="text/javascript" src="Business/equipment/equMgm/equ.file.list.js"></script>
	</head>
	<body>
	</body>
</html>