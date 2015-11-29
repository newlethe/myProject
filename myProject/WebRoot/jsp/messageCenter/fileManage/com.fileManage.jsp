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
	if ( hbm != null ){
		rootName = hbm.getSortName();
		rootBh = hbm.getSortBh();
	}
	if (rootId.equals("0")) {
	}
	
	//是否具有在线编辑功能
	String canOnlineEdit = "1";
	if (request.getParameter("disableOlEdit") != null){
		if (request.getParameter("disableOlEdit").equals("1") || request.getParameter("disableOlEdit").equals("true") ){
			canOnlineEdit = "0";
		}
	}
	
	String filterPid = request.getParameter("filterPid") == null ? currentAppid
			: request.getParameter("filterPid");
	//是否具有发布功能
	String canPublish = request.getParameter("canPublish") == null ? "0"
			: request.getParameter("canPublish");
	
	//是否具有上报功能
	String canReport = request.getParameter("canReport") == null ? "0"
			: request.getParameter("canReport");
	
	
	//默认收起“文件分类”面板
	String collapseSortPnl =  request.getParameter("collapseSortPnl") == null ? "0" :
		request.getParameter("collapseSortPnl");
	
	//发布文件时是否要进行数据交换
	String exchangeOnPublish = request.getParameter("exchangeOnPublish") == null ? "0" :
		 request.getParameter("exchangeOnPublish");
	
	//是否有“下载分类模板”按钮
	String hasTemplateBtn = request.getParameter("hasTemplateBtn") == null ? "0" :
		request.getParameter("hasTemplateBtn");
	
	//是否具有移交资料室功能
	String canTrans = request.getParameter("canTrans") == null ? "0"
			: request.getParameter("canTrans");
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
		  		//是否具有上报功能
		  		var g_canReport="<%=canReport%>";
		  		//是否有“下载分类模板”按钮
		  		var g_templateBtn = <%=hasTemplateBtn%>;		  		
		  		var filterPid = "<%=filterPid %>";
		  		if ( filterPid == 'null' )
		  			filterPid = null;

		  		//是否收起“文件分类”面板
		  		var collapseSortPnl = <%=collapseSortPnl%>;
		  		//是否在发布文件时进行数据交换
		  		var exchangeOnPublish = <%=exchangeOnPublish %>;
		  		//是否有移交资料室功能
		  		var g_canTrans = <%=canTrans%>;		  	
		</script>
		<style type="text/css">
.downloadLink {
	color: blue;
	cursor: hand;
}
</style>

		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/jsp/messageCenter/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript'
			src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/jsp/common/fileBlob/fileBlobUpload.js'></script>
			<script type='text/javascript'
			src='<%=path%>/jsp/messageCenter/search/searchField.js'></script>
		<script type='text/javascript'
			src='<%=path%>/jsp/messageCenter/fileManage/left.js'></script>
		<script type='text/javascript'
			src='<%=path%>/jsp/messageCenter/fileManage/com.fileManage.js'></script>

	</head>
	<body>
		<div>
		</div>
		
	</body>
</html>
