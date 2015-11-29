<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>招标概算金额分摊页面</title>
  	<base href="<%=basePath%>">
  	
	  	<script type="text/javascript">
			/* 一般程序调用所提供的参数 */
			var conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";  //招标内容名称
			var conid = "<%=request.getParameter("conid")%>";  //招标内容id
			var conmoney = "<%=request.getParameter("conmoney")%>"; //概算金额
			var zbUids = "<%=request.getParameter("zbUids")%>"; //招标申请主键
			var mPageNo = "<%=request.getParameter("mPageNo")%>";
			var cPageNo = "<%=request.getParameter("cPageNo")%>";
			var mIndex = "<%=request.getParameter("mIndex")%>";
			var cIndex = "<%=request.getParameter("cIndex")%>";
			
			/* 判断返回到合同查询还是合同录入页面 */
			var isQuery = "<%=(String)request.getParameter("isquery") %>" == "1";
		    //动态数据参数
   			var CONIDS = "<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
			var UIDS = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
			var OPTYPE = "<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
			var dyView = "<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
			//概算管理中合同概算分摊信息点击查看时带过来的参数，该参数是控制按钮，只运行查看，不运行进行业务操作 yanglh 2014-02-10
			var viewButton = "<%=request.getParameter("viewButton")==null?"":request.getParameter("viewButton")%>";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bidBdgApportionMgm.js'></script>
		<!-- EXT -->
		
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<!-- 加载此样式，treegrid按层级蓝色由浅到深展现 -->
		<%--<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGridLevels.css" />
		--%>
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>
		<!-- PAGE --> 
		<script type="text/javascript" src="Business/budget/bidbdg.apportion.form.js"></script>
		<script type="text/javascript" src="PCBusiness/bid/pc.bid.zb.gsft.js"></script>
		<style type="text/css">
		</style>
  </head>
  <body>
  	<span></span>
  </body>
</html>
