<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<meta http-equiv="Pragma" content= "no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<title>详细信息</title>

		<base href="<%=basePath%>">
<%
	//为添加模式生成的新ID
	String newFilePk = SnUtil.getNewID();
    //新增新闻类型读取页面配置参数，格式01,02
	String newsType = request.getParameter("newsType") == null ?"false"
		: request.getParameter("newsType");

%>
<script type="text/javascript">
var obj = window.dialogArguments;
var selectedRecord = obj.rec;
var editMode = obj.editMode;
var editEnable = obj.editEnable;
var gridStore = obj.gridStore;
var billtype = obj.billtype;
var newFilePk = '<%=newFilePk%>';
//根据新增/编辑改变窗口标题
document.title = (editMode == 'insert' ? '起草新闻' : '详细新闻');
window.returnValue = 'unchanged';
var newsType = '<%=newsType%>';
</script>

		<!-- 拓全局变量设置 -->
		<script type="text/javascript">
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
<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
<script type='text/javascript' src='dwr/interface/appNewsMgm.js'></script>
<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>

		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/newsManage/com.news.view.js'>
</script>
	</head>
	<body>
	</body>
</html>
