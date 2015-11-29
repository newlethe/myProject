<%@ page language="java" pageEncoding="UTF-8"%>
<% 
	String fileLsh = request.getParameter("fileLsh")==null?"":request.getParameter("fileLsh");
%>
<!-- @author:guox  -->
<!-- 父页面需要有3个参数 -->
<!-- 1)_fileType:文件类型, 对应attachlist表中的transaction_Type-->
<!-- 2)_filePK:业务ID-->
<!-- 3)_fileDept:部门岗位编号(如果没有这个参数，就不用选择报告类型) -->
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
	<body onload=init()>
		<form name="fileForm" method="post" enctype="multipart/form-data">
			<table style="width:100%;height:100%" border=0 cellpadding=0 cellspacing=0>
				<tr align=center><td id="dept"></td></tr>
				<tr align=center><td>
					<input type="file" name="filename1" class='fileUpload'>
				</td></tr>
			</table>
		</form>
	</body>
</html>
<script>
var  fileLsh = "<%=fileLsh%>"

function init() {
	if(parent._fileDept!=null && parent._fileDept!="") {
		DWREngine.setAsync(false);	
		report = "报告类型";
		if(parent._reportType=="PRJ_RESULT"){
			report = "研究成果报告类型"
		}else if(parent._reportType=="帮助手册类型"){
			report = "帮助手册类型"
		}
		systemMgm.getCodeValue(report, function(dat){
			var str = ""
			var arr = eval(dat)
			if(arr!=null){
				for(var i=0;i<arr.length;i++) {
					str += "<option value='"+arr[i].propertyCode+"'>"+arr[i].propertyName+"</option>"
				}
				dept.innerHTML = "报告类型:&nbsp;&nbsp;<select id='deptID'>" + str + "</select>"
			}
		});	
	    DWREngine.setAsync(true);
	}
}

function doSubmit() {
	if(fileForm.filename1.value=="") {
		alert("请选择需要上传的文档!")
	}
	else {
		var s = ""
		if(fileForm.deptID) {
			s = fileForm.deptID.value
		}

		url = "<%=path%>/fileupload?method=fileUpload&type=" + parent._fileType 
						+ "&upper=" + s						
						+ "&pk=" + parent._filePK
						+ "&fileid=" +fileLsh
		if(parent._fileDept && parent._fileDept!=null){
			url += "&dept=" + parent._fileDept
		} else {
			url += "&dept=" + USERDEPTID
		}
		if(parent._compress && parent._compress!=null){
			url += "&compress=" + parent._compress
		} else {
			url += "&compress=1"
		}
		if(parent._filesource && parent._filesource!=null && parent._filesource == "ftp"){
			url += "&fileSource="+parent._filesource
		}else{
			url += "&fileSource=blob"
		}
		fileForm.action = url;

	fileForm.submit()
	}
}
</script>