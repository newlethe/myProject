<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.sysman.hbm.SgccIniUnit"%>
<html>
	<head>
		<title>人力资源-部门考勤</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<script>
		var defaultOrgRootId = '<%= aPPOrgRootID %>';
		var defaultOrgRootName = '<%=aPPOrgRootName %>';

		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script src='dwr/interface/systemMgm.js'></script>
		<script src='dwr/interface/rlzyMgm.js'></script>
		<script src='dwr/interface/cellConfigExt.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/cellXML.js'></script>
		<script type="text/javascript" src="jsp/index/MD5.js"></script>
		<script type="text/javascript" src="Business/rlzy/rlzy.kq.dept.input.js"></script>
		<style>
			#user-grid-panel {border-left:1px solid #99bbe8;}
			#user-grid-panel {border-right:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#posi-grid-panel {border-bottom:1px solid #99bbe8;}
			#role-grid-panel {border-top:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div id='toolbar'>
		<div>
			<input id='toolbarStatus' type='text' value='状态：' size=30 style='border:0;background-color:transparent;text-align:left' READONLY>
			</input>
		</div>
  	</div>
    <div id='center'></div>
  </body>
</html>
