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
	//是否具有在线编辑功能
	String canOnlineEdit = "1";
	if (request.getParameter("disableOlEdit") != null) {
		if (request.getParameter("disableOlEdit").equals("1")
				|| request.getParameter("disableOlEdit").equals("true")) {
			canOnlineEdit = "0";
		}
	}
%>
<html>
	<head>
		<title>信息发布查询</title>
		<style>
.downloadLink {
	color: blue;
	cursor: hand;
}

.downloadLink img {
	height: 16px;
}

.deactivateLink{
	color : grey;
}

.icon-expand-all {
	background-image: url("<%=path%>/jsp/res/images/index/expand-all.gif")
		!important;
}

.icon-collapse-all {
	background-image: url("<%=path%>/jsp/res/images/index/collapse-all.gif")
		!important;
}
</style>
		<base href="<%=basePath%>">

		<!-- 拓全局变量设置 -->
		<script language="JavaScript">
			var g_rootId = "<%=rootId%>"
			var g_rootName = "<%=rootName%>"
			var g_rootBh = "<%=rootBh%>"
		</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css" href="<%=path%>/jsp/messageCenter/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript' src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>

		<!-- 功能JS -->
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/reformNotice/reformNotice.management.left.js'></script>
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/reformNotice/reformNotice.query.js'></script>
		<script type='text/javascript' src='<%=path%>/jsp/messageCenter/search/searchField.js'></script>
	</head>
	<body>
		<div>
		</div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1"
			style="width: 0; height: 0; display: none" scrolling="auto"></iframe>
	</body>
</html>
