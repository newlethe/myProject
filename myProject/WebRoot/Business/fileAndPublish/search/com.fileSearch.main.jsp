<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.fileAndPublish.dao.ComFileSortDAO"%>
<%@page import="com.sgepit.fileAndPublish.hbm.ComFileSort"%>
<%
//是否禁用在线编辑
String disableOlEdit = request.getParameter("disableOlEdit") == null ? "0"
		: request.getParameter("disableOlEdit");


//是否具有查看上报文件功能
String canReport = request.getParameter("canReport") == null ? "0"
		: request.getParameter("canReport");
%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>文件查询</title>
		<base href="<%=basePath%>">
		<!-- 拓全局变量设置 -->
		<script type="text/javascript">
		//是否具有上报功能
var g_canReport = <%=canReport%>;
//是否屏蔽在线编辑功能
		  		var disableOlEdit = <%=disableOlEdit %>;
		</script>
		<!-- 拓展的Ext -->
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileSortDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>		
		<!-- 功能JS -->		
		<script type='text/javascript'
			src='<%=path%>/Business/fileAndPublish/search/com.fileSearch.main.js'></script>		
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
	<script>
	
		Ext.onReady(function(){
			var tabs = new Ext.TabPanel({
			    region: 'center',
				border: false,
				enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
				animScroll:true,//出现滚动条时,有动画效果
			    activeTab: 0,
			    items: [{
			        title: '部门文件查询',
			        xtype:"panel",
			        html:'<iframe name="content1" src="'+CONTEXT_PATH+'/Business/fileAndPublish/fileManage/com.fileManage.query.jsp?rootId=<%=request.getParameter("rootId") == null ? "0" : request.getParameter("rootId") %>&canReport=' + g_canReport +'" frameborder=0 style="width:100%;height:100%;"></iframe>'
			    },{
			        title: '文件发布查询',
			        xtype:"panel",
			        html:'<iframe name="content2" src="'+CONTEXT_PATH+'/Business/fileAndPublish/search/com.fileSearch.publish.query.jsp?rootId=<%=request.getParameter("rootId") == null ? "0" : request.getParameter("rootId") %>&disableOlEdit='+ disableOlEdit +'" frameborder=0 style="width:100%;height:100%;"></iframe>'
			    }]
			});	
			var viewport = new Ext.Viewport({
				layout:'border',
				items:[tabs]
			});		
		})
	</script>
</html>
