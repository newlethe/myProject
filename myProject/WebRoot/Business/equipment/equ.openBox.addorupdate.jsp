<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>  
		<title>设备开箱记录</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">
        <!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/openBoxMgm.js'></script>
		<script type="text/javascript">
		  var uuid = "<%=request.getParameter("uuid")%>";
		  var conid = "<%=request.getParameter("conid")%>";
		  var conno = "<%=request.getParameter("conno")%>";
		  var conname = "<%=request.getParameter("conname")%>";
		  var partB = "<%=request.getParameter("partB")==null?"":request.getParameter("partB")%>";
		  var uuids = "<%=request.getParameter("uuids")%>";
		  var partId = "<%=request.getParameter("partId")%>";
		  
		  /* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		
		//流程编号
		var boxno = "<%=request.getParameter("boxno") == null?"":request.getParameter("boxno")%>";
		//新增编号获取
		DWREngine.setAsync(false);
			maxStockBhPrefix = USERNAME + new Date().format('ym');
			stockMgm.getStockPlanNewBh(maxStockBhPrefix,"boxno","equ_open_box",null,function(dat){
				if(dat != "")	{
					maxStockBh = dat;
					incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
				}	
			})
			if(boxno==null || boxno=="null" || boxno==""){
				boxno = maxStockBh;
			}
		DWREngine.setAsync(true);
		
		</script>

		

		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/equ.openBox.addorupdate.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>