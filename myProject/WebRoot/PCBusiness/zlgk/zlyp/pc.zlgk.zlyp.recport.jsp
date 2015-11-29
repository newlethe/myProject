<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
  <head>
    <title>上报页面</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
  </head>
     <script type="text/javascript">
		var edit_pid = "<%=request.getParameter("edit_pid")==null?"":request.getParameter("edit_pid")%>";
		var edit_uids = "<%=request.getParameter("edit_uids")==null?"":request.getParameter("edit_uids")%>";
		var edit_flag = "<%=request.getParameter("edit_flag")==null?"":request.getParameter("edit_flag")%>";
	    var edit_msg =  "<%=request.getParameter("edit_msg")==null?"":request.getParameter("edit_msg")%>";
	 </script>
  <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="dwr/interface/equMgm.js"></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/zlgkMgm.js'></script>
  <!-- EXTEND -->	
  
  <!--PAGE -->
        <script type='text/javascript' src='PCBusiness/zlgk/zlyp/pc.zlgk.zlyp.recport.js'></script>
  <body>
  </body>
</html>
