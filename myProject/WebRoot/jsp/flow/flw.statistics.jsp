 <%@ page contentType="text/html;charset=UTF-8" %>
 <%@ page import="com.sgepit.frame.flow.hbm.VFlowStatistics"%>
 <im>
 <html>
	<head>
		<title>流程统计</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<style type="text/css">
			.boldFont {font-weight: bold}
		</style>
		
		<script type="text/javascript">
		var overHour = '<%= VFlowStatistics.getOverHour() %>';
		var curDate = '<%=thisTimeStr%>';
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwStatisticsMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwBizMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwDefinitionMgm.js'></script>		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript"
			src="<%=path%>/extExtend/columnNodeUI.js"></script>
		<link rel="stylesheet" type="text/css"
			href="<%=path%>/extExtend/columnTree.css" />
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.statistics.unittree.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.statistics.js"></script>

		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<span></span>
		<form action="" id="formAc" method="post" name="formAc"></form>
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
	</body>
</html>