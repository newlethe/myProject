<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
	String rootId = request.getParameter("rootId") == null ? "0"
			: request.getParameter("rootId").toString();
	ComFileSortDAO dao = ComFileSortDAO.getInstance();
	ComFileSort hbm = (ComFileSort) dao.findById(rootId);
	String rootName = "";
	String rootBh = "";
	if (hbm != null) {
		rootName = hbm.getSortName();
		rootBh = hbm.getSortBh();
	}
	if (rootId.equals("0")) {
	}
%>

<html>
	<head>
		<meta http-equiv="Pragma" content= "no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<title>文档属性维护</title>

		<base href="<%=basePath%>">

		<!-- 拓全局变量设置 -->
		<script type="text/javascript">
var g_rootId = "<%=rootId%>";
var g_rootName = "<%=rootName%>";
var g_rootBh = "<%=rootBh%>";
var obj = window.dialogArguments;
var selectedRecord = obj.rec;
var editMode = obj.editMode;
var selectedNode = obj.selectedNode;
var treeInfo = obj.treeInfo;
var editEnable = obj.editEnable;
var gridStore = obj.gridStore;
var billtype = obj.billtype;
var filterPid = obj.filterPid;
//项目结算
var SETTLEMENT="<%=request.getParameter("settlement")==null?"":request.getParameter("settlement")%>";
</script>
		<!-- 拓展的Ext -->

		<script type="text/javascript"
			src="<%=path%>/extExtend/FileUploadField.js">
</script>
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/FileUploadField.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'>
</script>
		<script type='text/javascript' src='dwr/engine.js'>
</script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'>
</script>
		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/fileAndPublish/fileManage/com.fileManage.property.js'>
</script>
	</head>
	<body>
	</body>
</html>
