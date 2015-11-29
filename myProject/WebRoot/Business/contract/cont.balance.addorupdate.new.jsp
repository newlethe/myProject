<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>结算修改页面</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conbalMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conexpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conAccinfoMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		var g_conid = "<%=request.getParameter("conid")==null?"": request.getParameter("conid")%>";
		var g_balid = "<%=request.getParameter("uids")==null?"":request.getParameter("uids") %>";
		var g_totalMoney = "<%=request.getParameter("totalMoney")%>";
		if (g_totalMoney == null) g_totalMoney = 0;
		/* 流程任务调用所提供的参数 */
		var g_conno = "<%=(String)request.getParameter("conno")==null?"": (String)request.getParameter("conno")%>";
		var g_faceid = "<%=request.getParameter("faceid") ==null?"":request.getParameter("faceid")%>";
		if (isFlwTask == true || isFlwView == true){
			DWREngine.setAsync(false); 
			baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOveView", "conno='"+g_conno+"'", function(list1){
				g_conid = list1[0].conid;
				baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConBal", "conid='"+g_conid+"'", function(list2){
					if (list2) g_balid = list[0].balid;
				});
			});
			DWREngine.setAsync(true); 
		}
		</script>
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="Business/contract/cont.balance.addorupdate.new.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>
	</body>
</html>
