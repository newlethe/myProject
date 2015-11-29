<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:guox  -->
<!-- 父页面需要有3个参数 -->
<!-- 1)_fileType:文件类型, 对应attachlist表中的transaction_Type-->
<!-- 2)_filePK:业务ID-->
<html>
	<head>
		<title>文件上传</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
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
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/engine.js'></script>
	</head>
	<body>
		<form name="fileForm" method="post" enctype="multipart/form-data">
			<table style="width:100%;height:100%" border=0 cellpadding=0 cellspacing=0>
				<tr align=center><td>
					<input id='t' type="file" accept="application/msexcel" name="filename1" class='fileUpload'/>
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
		var s = ""
		if(fileForm.deptID) {
		}
		fileForm.action = "<%=path%>/xlsUtil?type=" + parent._fileType 
						+ "&pk=" + parent._filePK ;
					//prompt('',fileForm.action)
		fileForm.submit()
	}
}
</script>