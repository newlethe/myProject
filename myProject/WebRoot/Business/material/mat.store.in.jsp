<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>物资入库</title> 
		 
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<%
			String storetype = "storein";
			String storetitle = "物资入库单";
		 %>
		
		<script type="text/javascript">
			var storetype = '<%=storetype%>'
			var storetitle = '<%=storetitle%>'
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matGoodsMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type="text/javascript" src="dwr/interface/appMgm.js"></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = <%=request.getParameter("isView") %>;
		/* 流程任务调用 */
		var isFlwTask = <%=request.getParameter("isTask") %>;
		
		if (isFlwTask == true || isFlwView == true){		
			rkdbh = "<%=request.getParameter("rkdbh")%>";	
			if(rkdbh==null || rkdbh=="" || rkdbh=="null"){
				rkdbh = "<%=request.getParameter("in_no")%>";
			}	
		}
		var MODID ="<%=request.getParameter("modid")%>";
		</script>
				
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="Business/material/mat.store.in.sub.js"></script>
		<script type="text/javascript" src="Business/material/mat.contract.select.js"></script> 
		<script type="text/javascript" src="Business/material/mat.store.in.js"></script>
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
