<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>   
		<title>开箱记录</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <base href="<%=basePath%>">
		
		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/openBoxMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		
		<!-- PAGE -->
		<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = <%=request.getParameter("isView") %>
		/* 流程任务调用 */
		var isFlwTask = <%=request.getParameter("isTask") %>
		//流程编号
		var boxno = "<%=request.getParameter("boxno") == null?"":request.getParameter("boxno")%>";
		
		/* 一般程序调用所提供的参数 */
		var conid = "<%=request.getParameter("conid")%>"; 
		var conname = "<%=request.getParameter("conname")%>";
		var conno = "<%=request.getParameter("conno")%>"; 
		var partB = "<%=request.getParameter("partyb")%>";
		
		/* 流程任务调用所提供的参数 */
		var g_conno = "<%=(String)request.getParameter("conno") %>";
		var g_boxno = "<%=(String)request.getParameter("boxno") %>";
		var g_faceid = "<%=request.getParameter("faceid") %>";
		var g_funname = "<%=request.getParameter("funname") %>";
		
		var uuids = "<%=request.getParameter("uuids") %>";
		if (isFlwTask == true || isFlwView == true){
			var bean = "com.sgepit.pmis.contract.hbm.ConOve";
			DWREngine.setAsync(false);
			baseDao.findByWhere2(bean, "conno='"+g_conno+"'", function(conList){
				conid = conList[0].conid;
				conname = conList[0].conname;
				partyb = conList[0].partybno;
			});
			g_boxno = "<%=(String)request.getParameter("boxno") %>";
			DWREngine.setAsync(true);
			
		}
		</script>
		<script type="text/javascript" src="Business/equipment/equ.openBox.input.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
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