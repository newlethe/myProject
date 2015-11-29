<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>合同付款分摊</title>
  	<base href="<%=basePath%>">
  	
  	<script type="text/javascript">
		
	</script>
	<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgPayMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			/* 一般程序调用所提供的参数 */
			var g_conid = "<%=request.getParameter("conid") %>";
			var g_conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";
			var g_payid = "<%=request.getParameter("payid") %>";
			var g_payno = "<%=request.getParameter("payno") %>";
			var g_conno = "<%=request.getParameter("conno") %>";
			/* 流程任务调用所提供的参数 */
			var f_payno = "<%=(String)request.getParameter("payno") %>";
			
			if (isFlwTask == true || isFlwView == true){
				var bean = "com.sgepit.pmis.contract.hbm.ConOve";
				var payBean = "com.sgepit.pmis.contract.hbm.ConPay";
				DWREngine.setAsync(false); 
				baseDao.findByWhere2(payBean, "payno='"+f_payno+"'", function(payList){
					g_payid = payList[0].payid;
					g_payno = payList[0].payno;
					g_conid = payList[0].conid;
					baseMgm.findById(bean, g_conid, function(obj){
						g_conname = obj.conname;
					});
				});
				DWREngine.setAsync(true); 
			}
			
		//动态数据
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		//动态数据
		</script>
		<script type="text/javascript" src="Business/budget/bdg.pay.form.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.pay.apportion.js"></script>
		<style type="text/css">
		</style>
		
  </head>
  <body >
  	<span></span>
  </body>
</html>
