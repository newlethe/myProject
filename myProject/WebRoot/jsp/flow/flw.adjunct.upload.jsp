<%@ page language="java" pageEncoding="UTF-8" %>
<html>
	<HEAD>
		<title>流程附件上传</title>
		<meta http-equiv="content-type" content="text/html;charset=UTF-8">
		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src='dwr/interface/fileServiceImpl.js'></script>
		<!-- EXT -->
		
		<!-- PAGE -->
		<!-- Files needed for SwfUploaderPanel -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/js/SwfUpload.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/js/SwfUploadPanel.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.adjunct.upload.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/common/fileUploadMulti/css/SwfUploadPanel.css" />
	</HEAD>

	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"> </form>
   		<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe> 
	</body>
</html>