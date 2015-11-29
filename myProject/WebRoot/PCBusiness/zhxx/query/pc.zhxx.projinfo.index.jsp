<%@ page language="java" pageEncoding="UTF-8" %>
<meta http-equiv="Refresh" content="0;URL=/frame/PCBusiness/zhxx/index/pc.zhxx.pro.item.index.jsp" />
 <html>
	<head>
		<title>项目基本信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style rel="stylesheet" type="text/css">
			.bq{
				width:250px;
				height:220px;
				padding:20px 0 0 20px;
				margin:0;
			}
			.bq a{
				display:block;
				font:12px/35px Arial, Helvetica, sans-serif;
				color:#333;
				padding:0 0 0 30px;
				text-decoration:none;
			}
			.bq a.tb01{
				background:url(jsp/res/images/icons/button-b01.png) 0 10px no-repeat;
			}
			.bq a.tb02{
				background:url(jsp/res/images/icons/button-b02.png) 0 10px no-repeat;
			}
			.bq a:hover{
				color:#FF0000;
				text-decoration:none;
			}
			.bq a span{
				font:12px/24px Arial, Helvetica, sans-serif;
				color:#FF0000;
				text-decoration:underline;
				padding:0 4px;
			}
		</style>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type="text/javascript">
			var edit_unitid = "<%=request.getParameter("unitid")==null?"":request.getParameter("unitid")%>";
			var edit_unitname = "<%=request.getParameter("unitname")==null?"":request.getParameter("unitname")%>";
		</script>
		<!-- EXTEND -->
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="/XCarton/script/carton.js"></script>
		<script type="text/javascript" src="/XCarton/script/util.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<!-- PAGE -->
		<!-- 
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/zhxx/query/pc.zhxx.projinfo.index.js"></script>
		 -->
	</head>
	<body >
	</body>
</html>