<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>专用工具借用管理</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="extExtend/Spinner.css" />
		<link rel="stylesheet" type="text/css" href="PCBusiness/bid/progressForm.css" />
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/PCBidDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='extExtend/Spinner.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>	
		<script type='text/javascript' src='extExtend/SpinnerStrategy.js'></script>
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script src="<%=path%>/dwr/interface/db2Json.js"></script>			
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/queryGrid.js"></script>
		<script type="text/javascript">
			var masteruids;
		</script>
		<script type="text/javascript">
			/* 流程查看调用 */
			var isFlwView = <%=request.getParameter("isView") %>;
			/* 流程任务调用 */
			var isFlwTask = <%=request.getParameter("isTask") %>;
			var bh = '<%=request.getParameter("bh")==null?"":request.getParameter("bh") %>';
			
			//isFlwView = true;
			//isFlwTask = true;
			//bh = "yilin11010008"
		</script>			
		<script type="text/javascript" src="Business/equipment/equMgm/equ.special.tools.js"></script>
		
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
  </body>
</html>
