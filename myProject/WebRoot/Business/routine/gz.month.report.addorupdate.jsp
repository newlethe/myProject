<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>月工作计划增加或修改</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/gzJhMgm.js'></script>
    
    <!-- 只显示年月 -->
	<script type="text/javascript" src="extExtend/monthPick.js"></script>
	<script type="text/javascript" src="Business/routine/gz.month.report.addorupdate.js"></script>
	
	
	
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<link rel="stylesheet" type="text/css" href="extExtend/Datetime/datetime.css" />
	<script type="text/javascript" src="extExtend/Datetime/Datetime.js"></script>
	
	<script type='text/javascript'>
		var uuid_edit = "<%=request.getParameter("uuid")==null?"":request.getParameter("uuid")%>";
	</script>
	
	<!-- PAGE -->
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var bh_flow = "<%=(String)request.getParameter("flowid")==null?"": (String)request.getParameter("flowid")%>";
		
		if (isFlwView) {
			var url = BASE_PATH 
					+ "Business/routine/gz.month.report.jsp?uuid="
					+ uuid_edit + "&flowid=" + bh_flow + "&isView=true";
			window.location.href = url;
		}
		
		//流程中查出月报是否存在，存在则直接显示出来
		DWREngine.setAsync(false);
		if (isFlwTask){
			baseMgm.getData("select * from gz_month_report where flowid='"+bh_flow+"'",function(list){
				if(list.length>0){
					var url = BASE_PATH 
						+ "Business/routine/gz.month.report.jsp?uuid="
						+ uuid_edit + "&flowid=" + bh_flow + "&isTask=true";
					window.location.href = url;
				}
			})
		}
		DWREngine.setAsync(true);
		
	</script>	
	
	
  </head>
  
  <body>
  </body>
</html>
