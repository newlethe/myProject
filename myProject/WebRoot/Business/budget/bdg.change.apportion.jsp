<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>合同变更分摊</title>
		<base href="<%=basePath%>">
		
		<script type="text/javascript">
		
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgChangeMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- treegrid -->
		<link rel="stylesheet" type="text/css" href="<%=basePath %>extExtend/treegridtest/css/TreeGrid.css" />
		<script type="text/javascript" src="<%=basePath %>extExtend/treegridtest/TreeGrid.js"></script>		
		<!-- PAGE -->
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			/* 一般程序调用所提供的参数 */
			var g_conid = "<%=request.getParameter("conid") %>";
			var g_conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";
			var g_conno = "<%=request.getParameter("conno") %>";
			var g_chaid = "<%=request.getParameter("chaid") %>";
			var g_chano = "<%=request.getParameter("chano") %>";
			/* 流程任务调用所提供的参数 */
			var f_chano = "<%=(String)request.getParameter("chano") %>";
			
			if (isFlwTask == true || isFlwView == true){
				var bean = "com.sgepit.pmis.contract.hbm.ConOve";
				var chaBean = "com.sgepit.pmis.contract.hbm.ConCha";
				DWREngine.setAsync(false);
				baseDao.findByWhere2(chaBean, "chano="+f_chano, function(chaList){
					g_chaid = chaList[0].chaid;
					g_chano = chaList[0].chano;
					g_conid = chaList[0].conid;
					baseMgm.findById(bean, g_conid, function(obj){
						g_conname = obj.conname;
					});
				});
				DWREngine.setAsync(true); 
			}
					//动态数据
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		</script>
		<script type="text/javascript" src="Business/budget/bdg.change.form.js"></script>
		<script type="text/javascript" src="Business/budget/bdg.change.apportion.js"></script>
		<style type="text/css">
		</style>
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
	<body>
		<span></span>
		<span></span>
		<div id="test"></div>
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
