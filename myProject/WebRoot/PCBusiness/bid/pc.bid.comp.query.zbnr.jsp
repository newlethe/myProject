<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
       <%@ include file="/jsp/common/golobalJs.jsp" %>
    <title>招标内容综合信息</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
		<script type="text/javascript">
			var zbuids = "<%=request.getParameter("zbUids")==null?"":request.getParameter("zbUids")%>";
	     	var chart = "<%=request.getParameter("chart") %>"=="true"?true:false;
	     	var bidtypeid = "<%=request.getParameter("bidtypeid")==null?"6":request.getParameter("bidtypeid")%>";
		</script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/PCBidDWR.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>	
		<script type='text/javascript' src='<%=path%>/dwr/interface/baseDao.js'></script>	    
	    <script type="text/javascript" src="<%=path%>/PCBusiness/bid/pc.bid.comp.query.zbnr.js"></script>
  <link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
  </head>
  <body>
  </body>
</html>
