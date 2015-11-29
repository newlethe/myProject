<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>非计划出库</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	    <base href="<%=basePath%>">
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/gantDwr.js'></script>		
		<script type="text/javascript">
		var conname = "";
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		/* 流程任务调用所提供的参数 */
		var flowbh = "<%=request.getParameter("out_no")==null?"":request.getParameter("out_no") %>";
		var MODID ="<%=request.getParameter("modid")%>";
		/*
		if (isFlwTask == true || isFlwView == true){
			DWREngine.setAsync(false);
			var sql = "insert into wz_output (uids,bh,jhbh,billname,bill_state,zdrq,sqbm,lyr) values('"+
						flowbh+"','"+flowbh+"','计划外','领料出库单','N',sysdate,'"+USERDEPTID+"','"+USERID+"')";
			gantDwr.execute(sql,function(b){
			})
			DWREngine.setAsync(true);
			
		}
		*/
		</script>	
		
		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<script type="text/javascript" src="Business/wzgl/common/queryGrid2.js"></script>
		<script type="text/javascript" src="Business/wzgl/bill/wz.storage.noplan.out.js"></script>
		<script type="text/javascript" src="Business/wzgl/bill/wz.storage.noplan.out.selectWz.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />

	</head>
	<body>

	</body>
</html>
