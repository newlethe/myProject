<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>概算结构维护</title>
		<base href="<%=basePath%>">

		<script type="text/javascript">
		  	
		</script>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />

		<!-- PAGE -->

		<style type="text/css">
</style>
		<script type="text/javascript">
			Ext.onReady(function(){
				var tabs = new Ext.TabPanel({
					region:'center',
				    activeTab: 0,
				    items:[
				        {html:'<iframe src="Business/budget/bdg.frame.edit.default.jsp" style="width:100%; height:100%" frameborder="0"></iframe>', title:'执行概算结构维护'},
				        {html:'<iframe src="Business/budgetNk/bdg.frame.estimation.jsp" style="width:100%; height:100%" frameborder="0"></iframe>', title:'内控概算结构维护'}
					]
				});
				
				var panel = new Ext.Panel({
					layout:'fit',
					region:'center',
					border:false,
					items:[
						{html:'<iframe src="Business/budget/bdg.frame.edit.default.jsp" style="width:100%; height:100%" frameborder="0"></iframe>'}
						]
				})
				
				new Ext.Viewport({
				layout:"border",
				items:[
					panel
				],
				renderTo:'subDiv'
				});
				
	
	
				});
		</script>
	</head>
	<body>
		<div id="subDiv"></div>
	</body>
</html>
