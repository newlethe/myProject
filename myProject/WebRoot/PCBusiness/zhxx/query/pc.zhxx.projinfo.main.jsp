<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<% 
	String vpid  = request.getParameter("vpid")==null?"":request.getParameter("vpid");	
%>
<html>
	<head>
		<title></title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="extExtend/TreeCombo.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type="text/javascript">
			var select_pid = "<%=request.getParameter("select_pid")==null?"":request.getParameter("select_pid")%>";
		</script>
		<script type="text/javascript" src="PCBusiness/zhxx/query/pc.zhxx.projinfo.main.js"></script>		
		<style>
			#org-grid-panel {border-right:1px solid #99bbe8;}
			#posi-grid-panel {border-left:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div></div>
  </body>
</html>
