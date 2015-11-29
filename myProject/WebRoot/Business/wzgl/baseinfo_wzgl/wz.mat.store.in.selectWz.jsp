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
%>
<html>
	<head>
		<title>从物资中选择</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type="text/javascript">
  			var type = "<%=request.getParameter("type") %>";
  			var appid = "<%=request.getParameter("appid") %>";   
  			var checkId = "<%=request.getParameter("checkId") %>";  
  			var inId = "<%=request.getParameter("inId") %>";  
		</script>
		
		<script type="text/javascript">
  			var inId = "<%=request.getParameter("inId") %>";
  			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView") %>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask") %>;
  			var bh = '<%=request.getParameter("bh")==null?"":request.getParameter("bh") %>';
			
			var buyMethodObj = <%=buyMethod%>
			var buyMethodSt = objectToArray(buyMethodObj);	
			
			//if(isFlwTask){
			//	if(bh!=""){
			//		DWREngine.setAsync(false);
			//		var sql = "insert into wz_cjhpb (uids,bh,jhr,bill_state) values('"+bh+"','"+bh+"','"+USERID+"',0)";
			//		gantDwr.execute(sql,function(b){
			//		})
			//		DWREngine.setAsync(true);
			//	}
			//}
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.mat.store.in.selectWz.js"></script>
		<style type="text/css">
			#loading-mask{
				position:absolute;
				left:0;
				top:0;
			    width:100%;
			    height:100%;
			    z-index:20000;
			    background-color: black;
			    filter:alpha(opacity=20);
			}
			#loading{
				background:white;
				position:absolute;
				left:40%;
				top:40%;
				padding:2px;
				z-index:20001;
			    height:auto;
			    border:1px solid #99bbe8;
			}
			#loading img {
			    margin-bottom:5px;
			}
			#loading .loading-indicator{
				background:white;
				color:#555;
				font:bold 13px tahoma,arial,helvetica;
				padding:3px;
				margin:0;
			    text-align:center;
			    border:1px solid #99bbe8;
			    height:auto;
			}
		
		</style>
	</head>
	<body >
		<span></span>
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
