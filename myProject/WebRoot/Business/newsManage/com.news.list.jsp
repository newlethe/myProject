<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>


<html>
	<head>
		<title>新闻管理</title>
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
	</script>
		<style type="text/css">
.downloadLink {
	color: blue;
	cursor: hand;
}
</style>
<%

String dyView = request.getParameter("dyView") == null ?"false"
		: request.getParameter("dyView");
//新增新闻类型读取页面配置参数，格式01,02
String newsType = request.getParameter("newsType") == null ?"false"
		: request.getParameter("newsType");

%>
<script type="text/javascript">
	var dyView = <%=dyView%>;
	var newsType = '<%=newsType%>';
</script>
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
		<script type='text/javascript' src='dwr/interface/appNewsMgm.js'></script>		
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<!-- 功能JS -->
		<script type='text/javascript'
			src='Business/newsManage/searchField.js'></script>		
		<script type='text/javascript'
			src='Business/newsManage/com.news.list.js'></script>

	</head>
	<body>
		<div>
		</div>
		
	</body>
</html>
