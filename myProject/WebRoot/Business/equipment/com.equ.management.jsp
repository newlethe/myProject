<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.util.db.SnUtil"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<meta http-equiv="Pragma" content= "no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<title>设备到货信息管理</title>

		<base href="<%=basePath%>">
<%
	//为添加模式生成的新ID
	String newFilePk = SnUtil.getNewID();
    


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
document.title = (editMode == 'insert' ? '起草设备到货信息' : '详细设备到货信息');
window.returnValue = 'unchanged';
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

		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/equipment/com.equ.management.js'>
</script>
	</head>
	<body>
	</body>
</html>
