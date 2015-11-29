<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String unitID = (String)session.getAttribute(Constant.USERUNITID);
%>
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>sgepit</title>
		<style>
			html, body {
				BACKGROUND-COLOR: transparent;
		        font:normal 12px verdana;
		        margin:0;
		        padding:0;
		        border:0 none;
		        overflow:hidden;
		        height:100%;
		    }
		    td, select {
		    	font:normal 12px verdana;
		    }
			input.fileUpload {
				border: 1px solid Gray;
				width: 260px;
				font-size: 12px;
			}
		</style>	
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
	</head>
	<body>
		<form name="fileForm" method="post" enctype="multipart/form-data">
			<table style="width:100%;height:100%" border=0 cellpadding=0 cellspacing=0>
				<tr align=center><td id="dept"></td></tr>
				<tr align=center><td>
					<input type="file" name="filename1" class='fileUpload'>
					<center>附件说明:</center>
					<textarea name= "TextArea" cols= "45" rows= "8" id= "TextArea " ></textarea>
				</td></tr>
					
			</table>
		</form>
	</body>
</html>
<script>
function doSubmit() {
	if(fileForm.filename1.value=="") {
		alert("请选择需要上传的文档!")
	}
	else {
	    var memo_t=document.getElementById("TextArea")
	    var memo=memo_t.value
		var s = ""
		if(fileForm.deptID) {
			s = fileForm.deptID.value
		}
		var memo=fileForm.TextArea.value
		fileForm.action = "<%=path%>/fileupload?type=" + parent._fileType 
						+ "&pk=" + parent._filePK 
						+ "&dept=" + parent._fileDept 
						+ "&upper=" + s +"&memo=" + memo			
		fileForm.submit()
	}
}
</script>