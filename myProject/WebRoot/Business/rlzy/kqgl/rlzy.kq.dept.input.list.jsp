<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<html>
	<head>
		<title>人力资源-部门（公司）领导考勤审批</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyKqglMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/cellConfigExt.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/cellXML.js'></script>
		<script type="text/javascript" src="jsp/index/MD5.js"></script>
		<script type="text/javascript" src="Business/rlzy/kqgl/rlzy.kq.dept.input.list.js"></script>
		<%
		String roleApproval=request.getParameter("role")==null?"":request.getParameter("role");
		%>
		
		<script type="text/javascript">
			var show = "<%=request.getParameter("show") %>"=="true"?true:false;
			var scptRole="<%=roleApproval%>";
		</script>	

  </head>
  
  <body>
    <div id='toolbar'>
		<div>
			<div id="toolbarStatus"></div>
			<div id="toolbarSpStatus"></div>
		</div>
  	</div>
    <div id='center'></div>
  </body>
</html>
