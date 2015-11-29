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
			String selectedConName = request.getParameter("conname")==null?"":(String)request.getParameter("conname");
			String selectedConNo = request.getParameter("conno");
			
		%>
		
		<!-- PAGE -->
		<script type="text/javascript">
		    var selectedConId ="<%=request.getParameter("select")%>";
		    var selectedConName = "<%=selectedConName%>"
		     DWREngine.setAsync(false);
			  baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conid='"+selectedConId+"'" , function(conList){
				 selectedConName = conList[0].conname;
			 });
			 DWREngine.setAsync(true);
			var selectedConNo = "<%=selectedConNo%>";
		 	var username = "<%=(String)session.getAttribute(Constant.USERNAME)%>";
	        var checkOut ="<%=request.getParameter("checkout")%>";
		</script>
		
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="jsp/zlgl/zl.select.tree.js"></script>
		<script type="text/javascript" src="Business/contract/cont.files.view.js"></script>
		
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