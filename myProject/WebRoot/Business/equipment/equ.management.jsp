<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>


<html>
	<head>
		<title>设备到货信息登记管理</title>
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
%>
<script type="text/javascript">
	var dyView=<%=dyView%>;
</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/jsp/messageCenter/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript'
			src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>
        <link rel="stylesheet" type="text/css" href="extExtend/Datetime/datetime.css" />
        <script type="text/javascript" src="extExtend/Datetime/Datetime.js"></script>	
 		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		       
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
			src='Business/equipment/equ.management.js'></script>

	</head>
	<body>
		<div>
		</div>
		
	</body>
</html>
