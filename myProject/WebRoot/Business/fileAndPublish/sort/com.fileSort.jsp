<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
	String rootId = request.getParameter("rootId") == null ? "0"
			: request.getParameter("rootId").toString() ;
	ComFileSortDAO dao = ComFileSortDAO.getInstance();
	ComFileSort hbm = (ComFileSort) dao.findById(rootId);
	String rootName = "";
	String rootBh = "";
	if ( hbm != null ){
		rootName = hbm.getSortName();
		rootBh = hbm.getSortBh();
	}
	
	String isAdmin = request.getParameter("isAdmin") == null ? "0"
			: request.getParameter("isAdmin");
	String isSortIssue = request.getParameter("isSortIssue") == null ? "0"
			: request.getParameter("isSortIssue");
%>

<html>
	<head>
		<title>文档分类树维护</title>
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
		<base href="<%=basePath%>">

		<!-- 拓全局变量设置 -->
		<script type="text/javascript">
		  		var g_rootId = "<%=rootId%>"
		  		var g_rootName = "<%=rootName%>"
		  		var g_rootBh = "<%=rootBh%>"
		  		//管理员维护模式，开放所有节点
		  		var isAdmin = "<%=isAdmin %>";
		  		//是否具有分类下放功能
		  		var isSortIssue = "<%=isSortIssue %>";
		</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<style type="text/css">
			.syncLabel{
				color : red;
			}
		</style>
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
			src='<%=path%>/Business/fileAndPublish/sort/left.js'></script>
		<script type='text/javascript'
			src='<%=path%>/Business/fileAndPublish/sort/center.js'></script>
		<script type='text/javascript'
			src='<%=path%>/Business/fileAndPublish/sort/layout.js'></script>
	</head>
	<body>
	</body>
</html>
