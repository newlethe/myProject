<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>质量验评统计</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<script type="text/javascript">
		  	/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
	  		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		
			/* 流程任务调用所提供的参数 */
			var statNo = "<%=(String)request.getParameter("stat_no") %>";
		
		
		</script>

		
		<script type="text/javascript">
			//当前主表行
			var curRecord;
			//编制单位和专业，生成报表标题
			var specRec;
			var unitRec;
			
			var mainPanelHeight = 240;
			if ( isFlwView || isFlwTask ){
				mainPanelHeight = 200;
			}
			
			Ext.onReady(function(){
				
				//主面板
				var masterUrl = 'Business/gczl/gczl.zlyp.statistics.jsp?isTask='+isFlwTask+'&isView='+isFlwView+'&stat_no='+statNo;
				var masterPanel = new Ext.Panel({
					region : 'north',
					layout : 'fit',
					height : mainPanelHeight,
					border:false,
					split : true,
					collapsed: false,
		        	collapsible: true,
		        	loadMask: true,
					viewConfig:{
						forceFit: true,
						ignoreAdd: true
					},
					html: '<iframe id="masterFrame" name="masterFrame" src="' + masterUrl + '" frameborder=0 style="width:100%;height:100%;"></iframe>'
			
				});
				
				//报表面板
				var dataPanel = new Ext.Panel({
				region: 'center',
				layout: 'fit',
				border:false,
				collapsible: true,
				html: '<iframe id="detailFrame" name="detailFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
			});	
			
		    var viewport = new Ext.Viewport({
		        layout:'border',
		        items:[masterPanel, dataPanel]
		    });
				
			});
			
			function loadDetailData(editable){
				if ( curRecord ){
					var detailUrl = 'Business/gczl/gczl.zlyp.detail.main.jsp';
					
					detailUrl += '?statid=' + curRecord.data['uids']+'&isTask='+isFlwTask+'&isView='+isFlwView+'&editable='+editable;
					document.getElementById('detailFrame').src = detailUrl;
				}
			
				
			}
			
		</script>

	</head>

	<body>
	</body>
</html>
