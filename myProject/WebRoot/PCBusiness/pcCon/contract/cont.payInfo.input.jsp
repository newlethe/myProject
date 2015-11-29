<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>合同付款信息输入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var selectedConId = "<%=request.getParameter("conid")%>";
		var selectedConName = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>";
		var selectedConNo = "<%=request.getParameter("conno")%>";
		var selectconmoney = "<%=request.getParameter("convalue")%>";
		var MODID ="<%=request.getParameter("modid")%>";
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
      	var pid="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
      	var sj="<%=request.getParameter("sj")==null?"":request.getParameter("sj")%>";		
      	var payBillState="<%=request.getParameter("payBillState")==null?"":request.getParameter("payBillState")%>";	
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conexpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpayMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		<style type="text/css">.shawsar {text-align: right;}</style>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/pcCon/contract/cont.payInfo.input.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
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
