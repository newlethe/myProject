<%@ page language="java" pageEncoding="UTF-8" %>

 <html>
	<head>
		<title>批文办理查询</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<%
			String pageLvl = request.getParameter("pageLvl")==null?"0":request.getParameter("pageLvl");
			
			String appstatus = (request.getParameter("appStatus")==null||request.getParameter("appStatus")=="")?"%":request.getParameter("appStatus");
			
			//批文首页点击项目链接传递的项目编号和项目名称
			String tpid = (request.getParameter("tpid")==null||request.getParameter("spid")=="")?"":
																					request.getParameter("tpid");
			String projectName = (request.getParameter("projectName")==null||request.getParameter("spid")=="")?"":
																					request.getParameter("projectName");																		
																					
		%>
		
		<script type="text/javascript">
			var pid = '<%=tpid%>';
			var projectName = '<%=projectName%>';
			var lvl = '<%=pageLvl%>';
			var projectName = '';
			if(pid=='%'||pid=='')
			{
				pid = CURRENTAPPID;
				projectName = CURRENTAPPNAME;
			}
			var appstatus = '<%=appstatus%>';
			if(appstatus=='all'){
				appstatus='%';
			}
			if(lvl=='0'){
				//do nothing 不是从批文首页跳转到该页面, 页面加载自动获取ModuleLVL
			}
			else
			{
				ModuleLVL = lvl;
			}
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/approvlMgm.js'></script>
		<!-- EXTEND -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/Spinner.js"></script>
		<script type="text/javascript" src="extExtend/SpinnerStrategy.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.common.js"></script>
		<script type="text/javascript" src="PCBusiness/approvl/pc.approvl.pw.query.main.js"></script>
	</head>
	<body >
	</body>
</html>