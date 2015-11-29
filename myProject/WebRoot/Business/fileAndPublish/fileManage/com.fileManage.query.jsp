<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%	
	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
	String pid=request.getParameter("pid")==null?"":(request.getParameter("pid"));
	String sjType=request.getParameter("sjType")==null?"":(request.getParameter("sjType"));
	
	String rootId = request.getParameter("rootId") == null ? "0" : request.getParameter("rootId").toString();
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
	
	//是否具有查看上报文件功能
	String canReport = request.getParameter("canReport") == null ? "0" : request.getParameter("canReport");
%>
<html>
	<head>
		<title>文档分类树维护</title>
		<style>
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
			var g_rootId = "<%=rootId%>"
			var g_rootName = "<%=rootName%>"
			var g_rootBh = "<%=rootBh%>"
			//是否具有上报功能
			var g_canReport = <%=canReport%>;
			//动态数据展示
			var dydaView=eval("<%=dydaView%>");
			var pid="<%=pid%>";
			if(pid==""){
				pid=CURRENTAPPID;
			}
			var sjType="<%=sjType%>";
			 var flag = "<%=request.getParameter("flag")==null?"":request.getParameter("flag")%>";
		</script>
		<!-- 拓展的Ext -->
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/Business/fileAndPublish/fileManage/mycss.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/TreeGrid/css/TreeGrid.css" />
		<script type='text/javascript' src='<%=path%>/extExtend/TreeGrid/TreeGrid.js'></script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>

		<!-- 功能JS -->
		<script type='text/javascript' src='<%=path%>/Business/jsp/common/fileBlob/fileBlobUpload.js'></script>
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/fileManage/left.js'></script>
		<script type='text/javascript' src='<%=path%>/Business/fileAndPublish/fileManage/com.fileManage.query.js'></script>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm"></form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0;display:none" scrolling="auto" ></iframe>
	</body>
</html>
