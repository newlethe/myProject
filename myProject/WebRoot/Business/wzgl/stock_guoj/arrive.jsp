<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.base.service.BaseMgmFacade"%>
<%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade"%>
<%@ page import="com.sgepit.pmis.wzgl.service.StockMgmFacade"%>

<%@page import="com.sgepit.frame.util.JSONUtil"%>
<%
	SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
	BaseMgmFacade baseMgm = (BaseMgmFacade)Constant.wact.getBean("baseMgm");
	StockMgmFacade stockMgm = (StockMgmFacade)Constant.wact.getBean("StockMgm");
	

	String supplier =  JSONUtil.formObjectsToJSONStr(baseMgm.findAll("com.sgepit.pmis.wzgl.hbm.WzCsb"));
	String keeper =  JSONUtil.formObjectsToJSONStr(stockMgm.getWzUser("userrole='1'"));
	String userInfo = JSONUtil.formObjectsToJSONStr(systemMgm.getUserByWhere(""));
	String uuid = UUID.randomUUID().toString();
%>
<html>
	<head>
		<title>采购计划</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
   	   <base href="<%=basePath%>">		
   	   
   	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>	
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script>
			
		<!-- PAGE -->
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView") %>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask") %>;		
			var userInfoObj = <%=userInfo%>
			var userInfoSt = objectToArray(userInfoObj,"userid","realname");	
			
			var supplierObj = <%=supplier%>
			var supplierSt = objectToArray(supplierObj,"csdm","csmc");	
			
			var keeperObj = <%=keeper%>
			var keeperSt = objectToArray(keeperObj,"userid","username");
			
			var Flowuids = "<%=request.getParameter("bh")==null?"":request.getParameter("bh") %>";
			var uuid = "<%=uuid%>";
			uuid = uuid.replace(/-/g, "");
			if (isFlwTask == true || isFlwView == true){
				DWREngine.setAsync(false);
				var sql = "insert into wz_cdjin_pb (uids,pid,bh,dhrq,rq,jhr,bill_state) values('"+uuid+"','"+CURRENTAPPID+"','"+Flowuids+"',sysdate,sysdate,'"+USERID+"','0')";
				gantDwr.execute(sql,function(b){
				})
				DWREngine.setAsync(true);
			}
		</script>	

		 
		<script type="text/javascript" src="Business/wzgl/stock_guoj/arriveMain.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock_guoj/arriveMat.js"></script>
		<script type="text/javascript" src="Business/wzgl/stock_guoj/arrive.js"></script>
	</head>
	<body>
		<span></span>
	</body>
</html>
