<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同概算</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		       
		<script type="text/javascript">
		//动态数据参数
		var PID = "<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
		var PRONAME = "<%=request.getParameter("proName")==null?"":request.getParameter("proName")%>";
		var CONIDS = "<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var UIDS = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE = "<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var dyView = "<%=request.getParameter("dydaView")==null?"":request.getParameter("dydaView")%>";
		/*
		if(dyView){
			if(OPTYPE=='MONEYAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同分摊数据';
			}
			else if(OPTYPE=='PAYAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同付款分摊信息';
			}
			else if(OPTYPE=='CHANGEAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同变更分摊信息';
			}
			else if(OPTYPE=='BREAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同违约分摊信息';
			}
			else if(OPTYPE=='CLAAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同索赔分摊信息';
			}
			else if(OPTYPE=='BALAPP')
			{
				document.title = PRONAME+'--更新信息查询--合同结算分摊信息';
			}
			else
			{
				document.title = PRONAME+'--更新信息查询--合同工程量分摊信息';
			}
		}
		*/
		//动态数据参数
			var mainPanel;
			var hasNk = '<%=request.getParameter("hasNk") == null ? "0" : request.getParameter("hasNk")  %>';
		</script>
		<script type="text/javascript" src="Business/budget/bdg.main.frame.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%" frameborder=no src=""></iframe>
		</div>
	</body>
</html>