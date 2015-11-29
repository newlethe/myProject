
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
  <head>
    <title>合同概算金额分摊页面</title>
  	<base href="<%=basePath%>">
  	
  	<script type="text/javascript">
		var conname =  "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>";
		var conid = "<%=request.getParameter("conid")%>";
		var changeid = "<%=request.getParameter("changeid")%>";
	</script>
	<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src='dwr/interface/bdgProjectMgm'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.project.apportion.change.js"></script>
		<style type="text/css">
		</style>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
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
}			
		</style>
		
  </head>
  <body>
  	<span></span>
		<div id="loading-mask" style="display:none"></div>
		<div id="loading" style="display:none">
			<div class="loading-indicator">
				&nbsp;&nbsp;&nbsp; <img src="jsp/res/images/index/extanim32.gif" width="32" height="32"
					style="margin-right: 8px;" align="absmiddle" />
				Loading...&nbsp;&nbsp;&nbsp;&nbsp;
			</div>
		</div>
		<select name="unit" id="unit" style="display: none;">
			<option value="吨">吨</option>
			<option value="千克">千克</option>
			<option value="克">克</option>
			<option value="m³">m³</option>
			<option value="升">升</option>
	   </select>
  </body>
</html>
