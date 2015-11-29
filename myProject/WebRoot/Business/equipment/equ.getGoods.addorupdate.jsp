<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>设备到货维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equGetGoodsMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		

		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;	
		//流程编号
		var ggno = "<%=request.getParameter("ggno") == null?"":request.getParameter("ggno")%>";
		
		
		
		  var ggid = "<%=request.getParameter("ggid")%>";
		  var conid = "<%=request.getParameter("conid")%>";
		  var conname = "";
		  conname = "<%=request.getParameter("conname")%>";
		  var conmoney = "<%=request.getParameter("conmoney")%>"
		  var conno = "<%=request.getParameter("conno")%>"
		  var partB = "<%=request.getParameter("partB")%>";
		  DWREngine.setAsync(false);
		  baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+conid+"'" , function(conList){
			 conname = conList[0].conname;
		 });
		 DWREngine.setAsync(true);
		</script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>		
		<script type="text/javascript" src="Business/equipment/equ.getGoods.addorupdate.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>