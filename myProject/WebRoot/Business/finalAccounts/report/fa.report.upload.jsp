<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>财务竣工报表</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	   <base href="<%=basePath%>">

		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/faReportDWR.js'></script>


		<script type="text/javascript">
			var username = "<%=(String)session.getAttribute(Constant.USERNAME)%>";
		    var uploaded = false;
		    var uploadFileInfo
		</script>
		<!-- PAGE -->
		<style type="text/css">
		.inactiveLink{
			color : gray;
			
		}
		
.downloadLink {
	color: blue;
	cursor: hand;
}
</style>
		
		<script type='text/javascript'
			src='<%=path%>/jsp/common/fileBlob/fileBlobUpload.js'></script>
        <script type="text/javascript" src="Business/finalAccounts/report/fa.report.upload.js"></script>
        
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
			<div>
		</div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0;display:none"
			scrolling="auto" ></iframe>
	</body>
</html>
