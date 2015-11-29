<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<base href="<%=basePath%>">
		<title>考勤统计查询</title>


		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
			<link rel="stylesheet" type="text/css"
			href="extExtend\comboBoxMultiSelect.css" />
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>	
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/rlzy/kqgl/rlzy.kq.statistic.js"></script>
<script type="text/javascript" src="extExtend/MultiSelect.js"></script>

	</head>
	<body>
	
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
	
</html>
