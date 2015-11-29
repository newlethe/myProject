 <%@ page language="java" pageEncoding="UTF-8" %>
 <%@ page import="com.sgepit.frame.sysman.service.SystemMgmFacade" %>
 <%@ page import="com.sgepit.frame.sysman.hbm.SgccIniUnit" %>
 <html>
	<head>
		<title>发起流程</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var AppOrgRootId = '<%= Constant.APPOrgRootID %>';
		var treeData = new Array();<%
		SystemMgmFacade systemMgm = (SystemMgmFacade)Constant.wact.getBean("systemMgm");
		List<SgccIniUnit> orgs = systemMgm.getListedOrgs("0", true);
		for(int i=0; i<orgs.size(); i++){
			SgccIniUnit org = (SgccIniUnit)orgs.get(i);
			String first = org.getUpunit().equals("0") ? "1" : "0";
			String outStr = "treeData["+i+"] = [\"" + org.getUnitid() 
							+ "\", \"" + org.getUnitname() 
							+ "\", \"" + org.getLeaf().toString() 
							+ "\", \"" + org.getUpunit() 
							+ "\", \"" + first + "\", \"\"];";
			out.println(outStr);
		}%>
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/flw.user.choose.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.new.action.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<span></span>
	</body>
</html>