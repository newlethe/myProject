<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@ page import="com.sgepit.pmis.wzgl.service.StockMgmFacade"%>
<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%
	SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
	StockMgmFacade stockMgm = (StockMgmFacade)Constant.wact.getBean("StockMgm");
	String flowState = JSONUtil.formObjectsToJSONStr(systemMgm.getCodeValue("流程状态"));
	String buyMethod = JSONUtil.formObjectsToJSONStr(systemMgm.getCodeValue("采购方式"));
	String userInfo = JSONUtil.formObjectsToJSONStr(systemMgm.getUserByWhere(""));
	String cgr =  JSONUtil.formObjectsToJSONStr(stockMgm.getWzUser("userrole='3'"));
	String uuid = UUID.randomUUID().toString();
%>
<html>
	<head>
		<title>采购计划</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
   	   <base href="<%=basePath%>">		
		<!-- PAGE -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script src='dwr/interface/stockMgm.js'></script>	
		<script src='dwr/interface/baseDao.js'></script>	
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script>
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView") %>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask") %>;
			var bh = '<%=request.getParameter("bh")==null?"":request.getParameter("bh") %>';
			
			var flowStateObj = <%=flowState%>
			var flowStateSt = objectToArray(flowStateObj);	
			
			var buyMethodObj = <%=buyMethod%>
			var buyMethodSt = objectToArray(buyMethodObj);	
			
			var cgrObj = <%=cgr%>
			var cgrSt = objectToArray(cgrObj,"userid","username");	
			
			var userInfoObj = <%=userInfo%>
			var userInfoSt = objectToArray(userInfoObj,"userid","realname");
			
			var uuid = "<%=uuid%>";
			uuid = uuid.replace(/-/g, "");	
			
			if(isFlwTask){
				if(bh!=""){
					DWREngine.setAsync(false);
					var sql = "insert into wz_cjhpb (uids,pid,bh,jhr,bill_state) values('"+uuid+"','"+CURRENTAPPID+"','"+bh+"','"+USERID+"',0)";
					gantDwr.execute(sql,function(b){
					})
					DWREngine.setAsync(true);
				}
			}
		</script>	
		
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" /> 
		<script type="text/javascript" src="Business/wzgl/stock_guoj/stockPlanMain.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock_guoj/stockPlanMat.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock_guoj/stockPlan.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
