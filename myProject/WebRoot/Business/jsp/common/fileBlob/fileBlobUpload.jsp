<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:guox  -->
<%
	String unitId = request.getParameter("unitId")==null?"":request.getParameter("unitId");
	String fileId = request.getParameter("fileId")==null?"":request.getParameter("fileId");	
	String pk = request.getParameter("pk")==null?"":request.getParameter("pk");
	//是否需要压缩  -- 默认不压缩
	String compress = request.getParameter("compress")==null?"0":request.getParameter("compress");
	String filesource = request.getParameter("filesource")==null?"blob":request.getParameter("filesource");
	String transType = request.getParameter("transType")==null?"other":request.getParameter("transType");	
	String tableName = request.getParameter("tableName")==null?"sgcc_atach_blob":request.getParameter("tableName");
	if(filesource.equals("ftp")){
		tableName ="";
	}
	
	
 %>
<script type="text/javascript">
<!--
	var unitId = '<%=unitId%>';
	var fileId = '<%=fileId%>';
	var filesource = '<%=filesource%>';
	var transType = '<%=transType%>';
	var compress = '<%=compress%>';
	var pk = '<%=pk%>';
	var tableName = '<%=tableName%>';
	
//-->
</script>
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
				width: 360px;
				font-size: 12px;
			}
		</style>	
	</head>
	<body>
		<form name="fileForm" method="post" enctype="multipart/form-data">
			<table style="width:100%;height:100%" border=0 cellpadding=0 cellspacing=0>
				<tr align=center><td>
					<b>选择文件：</b><input id='t' type="file" accept="application/msexcel" name="filename1" class='fileUpload' onchange="fileTypeValidator(this.value);return false;"/>
					<div id='fileTypeError' style="font-style:italic;color:red;"></div>
				</td></tr>
			</table>
		</form>
	</body>
</html>
<script>

//added by Ivy 2010-04-09 上传文件的格式检查
function fileTypeValidator(val){
	if (parent.allowableFileType!="") {
	   	var fileName = val.toLowerCase();
	   	var fileSuffix = fileName.substring(fileName.lastIndexOf("."), fileName.length);
	   	
		var allowableFileTypeStr = "`" + parent.allowableFileType + "`";
		if (allowableFileTypeStr.indexOf("`"+fileSuffix+"`")==-1) {
			var errorInfo = "请上传" + parent.allowableFileType.replace(/`/g, " ") + "类型的文件！"; 
	   		document.getElementById("fileTypeError").innerHTML = errorInfo;
	   		parent.Ext.getCmp("uploadBtn").disable();
		} else {
			document.getElementById("fileTypeError").innerHTML = "";
			parent.Ext.getCmp("uploadBtn").enable();
		}
	} else {
		document.getElementById("fileTypeError").innerHTML = "";
		parent.Ext.getCmp("uploadBtn").enable();
	}
}
   
function doSubmit() {
	if(fileForm.filename1.value=="") {
		alert("请选择需要上传的文档!")
	}
	else {
		url = "<%=path%>/fileupload?method=fileBlobUpload"
		if(unitId!='')
			url+= "&unitId="+unitId;
		if(fileId!='')
			url+= "&fileid="+fileId;
		url += "&pk=" + pk
		url += "&filesource=" + filesource
		url += "&type=" + transType;
		url += "&compress=" + compress;
		url += "&tableName=" + tableName;
		fileForm.action = url;
		fileForm.submit()
	}
}
</script>