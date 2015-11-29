<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjParams"%>
<%@page import="com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjEqu"%>
<%@page import="com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoProgress"%>
<%@page import="com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInvesment"%>
<%@page import="com.sgepit.pmis.finalAccounts.prjGeneralInfo.hbm.FAPrjInfoOve"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<html>
	<head>
		<title>工程基本信息</title>
		<base href="<%=basePath%>">

	
		<!-- EXT -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />


		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/prjGeneralInfoDWR.js'></script>
			

		<!-- PAGE -->
		<script type="text/javascript">
			var beanName = '<%=FAPrjInfoOve.class.getName() %>';
			var paramBeanName = '<%=FAPrjParams.class.getName() %>';
			var equBeanName = '<%=FAPrjEqu.class.getName() %>';
			var progressBeanName = '<%=FAPrjInfoProgress.class.getName() %>';
			var invesmentBeanName = '<%=FAPrjInvesment.class.getName() %>';
			var pid = CURRENTAPPID;
		</script>
		<script type="text/javascript"
			src="Business/finalAccounts/prjGeneralInfo/fa.prj.info.ove.js"></script>
		

	</head>
	<body>
		
	</body>
</html>
