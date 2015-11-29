<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>新增工资单</title>
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type="text/javascript" src="<%=path%>/dwr/interface/db2Json.js"></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/FormulaUtil.js'></script>	
	<link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/comboBoxMultiSelect.css" />		
	<script type="text/javascript" src="<%=path%>/extExtend/MultiSelect.js"></script>	
	<script type='text/javascript' src='dwr/interface/FormulaUtil.js'></script>
	
	<!-- EXT -->
	<script type="text/javascript" src="Business/rlzy/salary/rlzy.salary.input.master.form.js"></script>
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	
	<script type='text/javascript'>
		var sjType = "<%=request.getParameter("sjType")==null?"":request.getParameter("sjType")%>";
		var unitId = "<%=request.getParameter("unitId")==null?"":request.getParameter("unitId")%>";
	</script>
  </head>
	<body>
		<div id="dbnetcell0" style="behavior:url('/cell/control/cell.htc');"></div>
	</body>
</html>
