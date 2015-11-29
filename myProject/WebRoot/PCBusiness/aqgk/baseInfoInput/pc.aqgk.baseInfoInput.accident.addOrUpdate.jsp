<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<%
	String edit_pid = request.getParameter("edit_pid")==null?"":request.getParameter("edit_pid");
	String re_edit = request.getParameter("re_edit")==null?"":request.getParameter("re_edit");
	String edit_uids = request.getParameter("edit_uids")==null?"":request.getParameter("edit_uids");
	String edit = request.getParameter("edit")==null?"true":(request.getParameter("edit").equals("true")?"true":"false");
	String hiddRest = request.getParameter("hiddRest")==null?"false":(request.getParameter("hiddRest").equals("true")?"true":"false");
%>
<html>
	<head>
		<title>项目基本信息添加或更新</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">
	   <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
			#form-panel .x-panel-btns{
				width:600;
			}
		</style>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>

		<script type="text/javascript">
			var edit_pid = "<%=edit_pid%>";
			var re_edit = "<%=re_edit%>";
			var edit_uids = "<%=edit_uids%>";
			var editAble = eval("<%=edit%>");
			var hiddRest = eval("<%=hiddRest%>");
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/aqgk/baseInfoInput/pc.aqgk.baseInfoInput.accident.addOrUpdate.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
