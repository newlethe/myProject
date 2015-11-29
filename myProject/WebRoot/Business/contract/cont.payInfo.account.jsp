<%@ page language="java" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>合同基本信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- EXTEND -->
		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		<script type="text/javascript" src="Business/contract/cont.payInfo.account.js"></script>
		<!-- PAGE -->
		<style type="text/css">
			.x-grid-record-red table {
				color: #FF0000;
			}
			#loading-mask {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 20000;
				background-color: black;
				filter: alpha(opacity = 20);
			}
			#loading {
				background: white;
				position: absolute;
				left: 40%;
				top: 40%;
				padding: 2px;
				z-index: 20001;
				height: auto;
				border: 1px solid #99bbe8;
			}
			#loading img {
				margin-bottom: 5px;
			}
			#loading .loading-indicator {
				background: white;
				color: #555;
				font: bold 13px tahoma, arial, helvetica;
				padding: 3px;
				margin: 0;
				text-align: center;
				border: 1px solid #99bbe8;
				height: auto;
			}
		</style>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
</html>