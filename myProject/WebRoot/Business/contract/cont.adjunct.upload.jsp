<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<HEAD>
		<title>合同附件上传</title>
		<meta http-equiv="content-type" content="text/html;charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/zlMgm.js'></script>
		<!-- EXT -->
		
		<% 
			String selectedConId = request.getParameter("select");
			if ( selectedConId == null ){
				selectedConId = request.getParameter("conid");
			}
			String selectedConName = request.getParameter("conname")==null?"":(String)request.getParameter("conname");
			String selectedConNo = request.getParameter("conno");
			String flag = "";
			if(selectedConNo == null||selectedConName == "")
				flag = "flow";
			
		%>
		
		<!-- PAGE -->
		<script type="text/javascript">
				/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			
			var _isflowView = "<%=flag%>";
		    var selectedConId ="<%=selectedConId%>";
		    //var selectedConName = _isflowView == "flow"?parent.CONOVE.conname:"<%=selectedConName%>";
			//var selectedConNo = _isflowView == "flow"?parent.CONOVE.conno:"<%=selectedConNo%>";
			var selectedConNo = "<%=selectedConNo%>";
			var page="<%=request.getParameter("page")==null?"":request.getParameter("page")%>";
			//if(selectedConNo=="null"){selectedConNo=parent.CONOVE.conno}
			var CONOVE; var CONVENAME;
			DWREngine.setAsync(false);
			var whereStr = "conno='"+selectedConNo+"'";
			if ( selectedConNo == '' || selectedConNo == 'null'){
				whereStr = "conid='" + selectedConId + "'";
			}
			baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", whereStr, function(list){
				if ( list.length > 0 ){
					CONOVE = list[0];
				CONVENAME = CONOVE.conname;
				if(selectedConId=="null"){selectedConId=CONOVE.conid}
				if(selectedConNo=="null"){selectedConNo=CONOVE.conno}
				}
				
			});
			DWREngine.setAsync(true);
		    var selectedConName = "<%=selectedConName%>"==""?CONVENAME:"<%=selectedConName%>";
		 	var username = REALNAME;
		</script>		
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<script type="text/javascript" src="Business/document/zl.select.tree.js"></script>
		<script type="text/javascript" src="Business/contract/cont.adjunct.upload.js"></script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
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
	</HEAD>

	<body>
		<span></span>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"> </form>
   		<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>
   		
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