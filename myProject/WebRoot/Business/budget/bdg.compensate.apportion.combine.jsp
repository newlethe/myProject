<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>合同付款分摊</title>
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
				        {html:'<iframe src="Business/budget/bdg.compensate.apportion.jsp?<%=request.getQueryString()%>" style="width:100%; height:100%" frameborder="0"></iframe>', title:'索赔分摊'},
				       {html:'<iframe src="Business/budgetNk/bdg.compensate.apportion.jsp?<%=request.getQueryString()%>" style="width:100%; height:100%" frameborder="0"></iframe>', title:'内控索赔分摊'}
				        				    ]
				
				
				});
				
				new Ext.Viewport({
	layout:"border",
	items:[
		tabs
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
