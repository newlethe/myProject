<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%
//是否具有在线编辑功能
String canOnlineEdit = "1";
if (request.getParameter("disableOlEdit") != null){
	if (request.getParameter("disableOlEdit").equals("1") || request.getParameter("disableOlEdit").equals("true") ){
		canOnlineEdit = "0";
	}
}
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>信息发布查询</title>
		<style type="text/css">
		.downloadLink {
	color: blue;
	cursor: hand;
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
	//是否具有在线编辑功能
		  		var g_canOlEdit = <%=canOnlineEdit %>;
			</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/Business/fileAndPublish/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript'
			src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<!-- 功能JS -->		
		<script type='text/javascript'
			src='<%=path%>/jsp/messageCenter/search/com.fileSearch.publish.js'></script>
			<script type='text/javascript'
			src='<%=path%>/Business/fileAndPublish/search/searchField.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>	
	
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>
