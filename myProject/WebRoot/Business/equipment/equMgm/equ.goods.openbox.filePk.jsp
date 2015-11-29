
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%
	String fileId = request.getParameter("fileId")==null?"": request.getParameter("fileId").toString();
	String fileType = request.getParameter("fileType")==null?"":request.getParameter("fileType").toString();
	String filter = request.getParameter("filter")==null?"1=1":request.getParameter("filter").toString();
	String type = request.getParameter("type")==null?"1=1":request.getParameter("type").toString();
    String conid = request.getParameter("conid") == null?"":request.getParameter("conid");
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>设备文件移交</title>
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
		<script language="JavaScript">
			var obj = window.dialogArguments;
			var fileId = "<%=fileId%>"
			var fileType = "<%=fileType%>"
			var filter = "<%=filter%>"
			if(obj){
				fileId = obj.fileId;
				fileType = obj.fileType;
				filter = obj.filter;
			}
			var type = "<%=type%>"
			var conid = "<%=conid%>"
		</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
				
		<!-- 功能JS -->
		<script type='text/javascript'
			src='<%=path%>/Business/equipment/equMgm/equ.goods.openbox.filePk.js'></script>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0 display:none"
			scrolling="auto" ></iframe>
	</body>
</html>
