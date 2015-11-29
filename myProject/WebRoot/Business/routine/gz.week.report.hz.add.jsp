<%@ page language="java" pageEncoding="UTF-8" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<%@ include file="/jsp/common/golobalJs.jsp" %>
    <base href="<%=basePath%>">
    <title>部门周工作汇总</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<!-- DWR -->
	<script type='text/javascript' src='dwr/util.js'></script>
	<script type='text/javascript' src='dwr/engine.js'></script>	
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>    
    <script type='text/javascript' src='dwr/interface/appMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
    <script type='text/javascript' src='dwr/interface/gzJhMgm.js'></script>
    	
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	
	<script type="text/javascript">
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用:来自addorupdate */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 流程任务调用所提供的参数 */
		var bh_flow = "<%=(String)request.getParameter("flowid")==null?"": (String)request.getParameter("flowid")%>";
		
		if (isFlwView) {
			var url = BASE_PATH + "Business/routine/gz.week.report.hz.jsp?&flowid="
					+ bh_flow + "&isView=true";
			window.location.href = url;
		}

		//流程中查出周报汇总是否存在，存在则直接显示出来
		DWREngine.setAsync(false);
		if (isFlwTask){
			baseMgm.getData("select * from gz_week_report where flowid='"+bh_flow+"'",function(list){
				if(list.length>0){
					var url = BASE_PATH 
						+ "Business/routine/gz.week.report.hz.jsp?flowid=" + bh_flow
						+ "&isTask=true";
					window.location.href = url;
				}
			})
		}
		DWREngine.setAsync(true);
	</script>
	
	<script type="text/javascript" src="Business/routine/gz.week.report.hz.add.js"></script>
	<script type="text/javascript" src="Business/budget/moneyMange/query.js"></script>
  </head>
  
  <body>
  </body>
</html>

