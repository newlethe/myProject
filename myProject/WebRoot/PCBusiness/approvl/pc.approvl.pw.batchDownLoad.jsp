<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>批文附件批量下载</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<%
			String appstatus = (request.getParameter("appStatus")==null||request.getParameter("appStatus")=="")?"%":
																					request.getParameter("appStatus");
			String pid = (request.getParameter("pid")==null)?"":request.getParameter("pid");
		 %>
		<script type="text/javascript">
			var pid = '<%=pid%>';
			if(pid==''||pid=="")
			{
				pid = CURRENTAPPID;
			}
			var appstatus = '<%=appstatus%>';
			if(appstatus=='all'){
				appstatus='%';
			}
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/approvlMgm.js'></script>
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		<!-- PAGE -->
		<!--  
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.common.js"></script>
		-->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.batchDownLoad.js"></script>
	</head>
	
	<body >
		<span></span>
		<form action="" id="formAc" method="post" name="formAc"></form>
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