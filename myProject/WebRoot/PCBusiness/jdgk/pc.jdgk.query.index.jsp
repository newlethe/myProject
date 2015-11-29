<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>进度信息汇总查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcJdgkMgm.js'></script>
		<!-- EXTEND -->
		<script src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/ProjStatisGrid.js"></script>
		<!-- PAGE -->
		
		<script type="text/javascript">
			//是否可以编辑计划
			var isEditPlan = ModuleLVL=="1"?true:false;
		</script>
		
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.query.index.js"></script>
	</head>
	<body>
	</body>
</html>