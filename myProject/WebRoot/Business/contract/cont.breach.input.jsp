<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>合同违约</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
		<script type="text/javascript">
		var conid = "<%=request.getParameter("conid")%>";
		var conname ="<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>";
		var conno = "<%=request.getParameter("conno")%>";
		var MODID="<%=request.getParameter("modid")%>";
		//动态数据参数
		var UIDS ="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var CONIDS ="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var OPTYPE ="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var dyView ="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		var page="<%=request.getParameter("page")==null?"":request.getParameter("page")%>";
		</script>

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/conbreMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/cont.breach.input.js"></script>
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