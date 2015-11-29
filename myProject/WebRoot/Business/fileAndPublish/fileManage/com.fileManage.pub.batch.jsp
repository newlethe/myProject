<%@ page language="java" pageEncoding="UTF-8"%>
<%
	String rootId = request.getParameter("rootId") == null ? "" : request.getParameter("rootId");
	//String pubid = request.getParameter("pubId");
	//发布文件时是否要进行数据交换
	String exchangeOnPublish = request
			.getParameter("exchangeOnPublish") == null ? "0" : request
			.getParameter("exchangeOnPublish");
%>
<html>
	<head>
		<title>发布处理</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<script type="text/javascript"
			src="<%=path%>/extExtend/columnNodeUI.js">
</script>
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/columnTree.css" />
		<script>
		var tabPan, container, viewport;
		var ids = window.dialogArguments;
		var pubId = ids[0];
		var rootId = '<%=rootId%>';
		var exchangeOnPublish= <%=exchangeOnPublish%>;
		
		Ext.onReady(function(){
			tabPan = new Ext.TabPanel({
				region: 'center',
				border: false,
				enableTabScroll:true,//允许面板的tab项宽度超过可用时,自动出现滚动条
				animScroll:true,//出现滚动条时,有动画效果
				activeTab:0,
				items:[ {xtype:"panel",
			        id:"bdw",
			        title:"发布到部门",
			        html:'<iframe name="content1" src="<%=path%>/Business/fileAndPublish/fileManage/unit_list.batch.jsp?pubId='+pubId+'&exchangeOnPublish='+exchangeOnPublish+'&rootId='+rootId+'" frameborder=0 style="width:100%;height:100%;"></iframe>',
			        extra : ids
				},{
					xtype:"panel",
				    id:'bdwyh',
				    title:"发布到用户",
				    html:'<iframe name="content2" src="<%=path%>/Business/fileAndPublish/fileManage/user_list.batch.jsp?pubId='+pubId+'&exchangeOnPublish='+exchangeOnPublish+'&rootId='+rootId+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
				}]	        
			});
			container = new Ext.Panel({
		    	region: 'center',    	
				margins:'0 0 0 0',
				layout:'fit',
				items: tabPan
			});
			
			viewport = new Ext.Viewport({
				layout:'border',
				items:[container]
			});
			
			
		});
		
		</script>
	</head>

	<body>
	</body>
</html>

