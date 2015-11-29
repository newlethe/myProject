<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>物资入库单</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equGetGoodsMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/matStoreMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgMoneyMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type="text/javascript" src="dwr/interface/stockMgm.js"></script>

		<script type="text/javascript">
		   /* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
			var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
			var rkdbh = USERNAME + new Date().format('-Ymd-His');
			var uuid = "<%=request.getParameter("uuid")==null?"":request.getParameter("uuid")%>"
			if (isFlwTask == true || isFlwView == true){		
				rkdbh = "<%=request.getParameter("rkdbh")%>";
				if(rkdbh==null || rkdbh=="" || rkdbh=="null"){
					rkdbh = "<%=request.getParameter("in_no")%>";
				}		
				if(isFlwView){
				}
				DWREngine.setAsync(true);			
			}
			var hasFlow="<%=request.getParameter("hasFlow") %>"=="false"?false:true;
		</script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>		
		<script type="text/javascript" src="Business/material/mat.store.in.addorupdate.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>