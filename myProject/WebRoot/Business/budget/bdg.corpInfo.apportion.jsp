<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>建设法人管理费页面</title>
  	<base href="<%=basePath%>">
  	
  	<script type="text/javascript">
	    var corpbasicid = "<%=request.getParameter("corpbasicid")%>";
	</script>
	<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgCorpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.corpInfo.apportion.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.corp.form.js"></script>
		<style type="text/css">
		</style>
		
		<style>
			#grid-panel {border-left:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#modules-tree-panel {border-left:1px solid #99bbe8;}
			#role-grid-panel {border-right:1px solid #99bbe8;}
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
				left:45%;
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
			.trueImg {
				width: 16;
				height: 16;
				background:url(jsp/res/images/icon-complete.gif)
			}
			.falseImg {
				width: 16;
				height: 16;
				background:url(jsp/res/images/delete.gif)
			}			
		</style>
		
  </head>
  <body >
		<span></span>
	</body>
</html>
