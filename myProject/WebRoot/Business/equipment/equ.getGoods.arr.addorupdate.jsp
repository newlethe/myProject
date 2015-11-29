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
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equGetGoodsArrMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		
		<script type="text/javascript">
		
		  var ggid = "<%=request.getParameter("ggid")%>";
		  var conid = "<%=request.getParameter("conid")%>";
		  var conname = conname = "<%=request.getParameter("conname")%>";
		  var conno = "<%=request.getParameter("conno")%>";
		 
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;	
			//流程编号
			var ggno = "<%=request.getParameter("ggno") == null?"":request.getParameter("ggno")%>";
			DWREngine.setAsync(false);
		  
		  //新增编号获取
			maxStockBhPrefix = USERNAME + new Date().format('ym');
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"gg_no","equ_get_goods_arr",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			if(ggno==null || ggno=="null" || ggno==""){
				ggno = maxStockBh;
			}
		  
		  baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+conid+"'", function(conList){
			 conname = conList[0].conname;
		 });
		 DWREngine.setAsync(true);
		</script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/equ.getGoods.arr.addorupdate.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>