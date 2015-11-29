<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<title>工资模板维护</title>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/FormulaUtil.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/XgridBean.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript">
		var defaultOrgRootId = '<%= aPPOrgRootID %>';
		var defaultOrgRootName = '<%=aPPOrgRootName %>';
		</script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />    
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- PAGE -->
		<script type="text/javascript" src="Business/rlzy/salary/rlzy.hr.salary.template.js"></script>
	</head>
	<body>
	<div id="dbnetgrid1" style="behavior:url(/dbnetgrid/htc/dbnetgrid.htc);"></div>
	<script type="text/javascript">

	</script>
	</body>
</html>
