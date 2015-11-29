<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>检验项目维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/gczlJyxmImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/flwZlypMgm.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		<link rel="stylesheet" type="text/css" href="extExtend/FileUploadField.css" />
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		
		<script type="text/javascript" src="Business/gczl/zlyp/zlypManage/gczl.jyxm.frame.edit.js"></script>
		<script type="text/javascript" src="Business/gczl/zlyp/zlypManage/gczl.jyxm.frame.edit.form.js"></script>
		<script type="text/javascript">
		 var query = "<%=request.getParameter("query") %>"=="true"?true:false;
		</script>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"> </form>
   		<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>
	</body>
</html>
