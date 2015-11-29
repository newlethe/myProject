<%@ page language="java" pageEncoding="UTF-8" %>

 <html>
	<head>
		<title>批文综合查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/approvlMgm.js'></script>
		
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.query.index.js"></script>
		
		<script type="text/javascript">
		//是否可以编辑
		var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
		if(lvl != null && lvl != "") ModuleLVL = lvl
		var isEditPlan = ModuleLVL=="1"?true:false;
		</script>
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