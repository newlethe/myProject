<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

 <% 
 	String dydaView=request.getParameter("dydaView")==null?"false":(request.getParameter("dydaView").equals("true")?"true":"false");
 %>
<html>
	<head>
		<title>概算结构维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type="text/javascript">
		   var PID ='<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>';
		   var PRONAME ='<%=request.getParameter("proname")==null?"":request.getParameter("proname")%>';
		   var TIME ='<%=request.getParameter("time") %>';
		   var dydaView=eval("<%=dydaView%>");
		   if(dydaView){
		   	  document.title = '更新信息查询--概算金额';
		   }
		</script>
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
	    <script type='text/javascript' src='dwr/interface/baseDao.js'></script>	
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/bdgInfoMgm.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
		<script type="text/javascript" src="PCBusiness/dynamicdata/bdg/bdginfo_view.js"></script>
		<style type="text/css">
		</style>
		
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc"></form>
	</body>
</html>
