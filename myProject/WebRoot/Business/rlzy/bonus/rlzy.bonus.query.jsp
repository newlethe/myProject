<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<%
String flagRole=request.getParameter("person")==null?"":request.getParameter("person");
 %>  
<html>
	<head>
		<title>奖金查询</title>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<link rel="stylesheet" type="text/css" href="extExtend\comboBoxMultiSelect.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyKqglMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/FormulaUtil.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/XgridBean.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		<script type="text/javascript">
		var defaultOrgRootId = '<%= aPPOrgRootID %>';
		var defaultOrgRootName = '<%=aPPOrgRootName %>';
		var flagRole='<%=flagRole%>';
		</script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />    
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- PAGE -->
		<script type="text/javascript" src="Business/rlzy/bonus/rlzy.bonus.query.js"></script>
	</head>
	 <body>
	</body>
</html>
