<%@ page language="java" pageEncoding="UTF-8" %>
<%
	String dataView=request.getParameter("dataView")==null?"false":request.getParameter("dataView");
 %>
 <html>
	<head>
		<title>月度资金计划录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type='text/javascript' src='dwr/interface/fundMonthPlanService.js'></script>
		<script type="text/javascript">
		var dataView = "<%=dataView%>";
		dataView=dataView=="false"?false:true;
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<script type="text/javascript" src="Business/planMgm/fundplan/select.contract.win.js"></script>
		<script type="text/javascript" src="Business/planMgm/fundplan/fund.month.plan.form.js"></script>
		<script type="text/javascript" src="Business/planMgm/fundplan/fund.month.plan.input.js"></script>
	</head>
	<body >
	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" >
    </form>
	<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>