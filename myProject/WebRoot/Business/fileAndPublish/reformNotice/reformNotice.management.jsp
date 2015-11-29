<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@ page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
	String rootId = request.getParameter("rootId") == null ? "0" : request.getParameter("rootId").toString();
	ComFileSortDAO dao = ComFileSortDAO.getInstance();
	ComFileSort hbm = (ComFileSort) dao.findById(rootId);
	String rootName = "";
	String rootBh = "";
	if (hbm != null){
		rootName = hbm.getSortName();
		rootBh = hbm.getSortBh();
	}

	String filterPid = request.getParameter("filterPid") == null ? currentAppid
			: request.getParameter("filterPid");

	//是否具有发布功能
	String canPublish = request.getParameter("canPublish") == null ? "0"
			: request.getParameter("canPublish");

	//发布文件时是否要进行数据交换
	String exchangeOnPublish = request.getParameter("exchangeOnPublish") == null ? "0" :
		 request.getParameter("exchangeOnPublish");

	//是否有“下载分类模板”按钮
	String hasTemplateBtn = request.getParameter("hasTemplateBtn") == null ? "0" :
		request.getParameter("hasTemplateBtn");
%>

<html>
	<head>
		<title>消息中心</title>
		<style>
		.icon-expand-all {
			background-image: url("<%=path%>/jsp/res/images/index/expand-all.gif")
				!important;
		}
		
		.icon-collapse-all {
			background-image: url("<%=path%>/jsp/res/images/index/collapse-all.gif")
				!important;
		}
		</style>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<base href="<%=basePath%>">

		<!-- 拓全局变量设置 -->
		<script language="JavaScript">
	  		var g_rootId = "<%=rootId%>"
	  		var g_rootName = "<%=rootName%>"
	  		var g_rootBh = "<%=rootBh%>"
	  		//是否具有发布功能
	  		var g_canPublish="<%=canPublish%>";
	  		//是否有“下载分类模板”按钮
	  		var g_templateBtn = <%=hasTemplateBtn%>;		  		
	  		var filterPid = "<%=filterPid %>";
	  		if (filterPid == 'null')
	  			filterPid = null;

	  		var action = "<%= request.getParameter("action") == null ? "" : request.getParameter("action")%>";
	  		//是否在发布文件时进行数据交换
	  		var exchangeOnPublish = <%=exchangeOnPublish %>;
		</script>
		<style type="text/css">
		.downloadLink {
			color: blue;
			cursor: hand;
		}
		</style>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css" href="<%=path%>/jsp/messageCenter/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript' src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<!-- 功能JS -->
		<script type='text/javascript' src='<%=path%>/jsp/common/fileBlob/fileBlobUpload.js'></script>
		<script type='text/javascript' src='<%=path%>/jsp/messageCenter/search/searchField.js'></script>
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/reformNotice/reformNotice.management.left.js'></script>
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/reformNotice/reformNotice.management.js'></script>
	</head>
	<body>
	</body>
</html>
