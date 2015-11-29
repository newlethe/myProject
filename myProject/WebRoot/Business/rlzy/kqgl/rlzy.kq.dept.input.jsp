<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
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
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyKqglMgm.js'></script>
		<script type='text/javascript' src='/<%=Constant.propsMap.get("ROOT_CELL")%>/dwr/interface/cellConfigExt.js'></script>
		<script type='text/javascript' src='/<%=Constant.propsMap.get("ROOT_CELL")%>/dwr/interface/cellXML.js'></script>
		<script type='text/javascript' src='/<%=Constant.propsMap.get("ROOT_CELL")%>/dwr/interface/cellBean.js'></script>
		<script type="text/javascript" src="jsp/index/MD5.js"></script> 
		<script type="text/javascript" src="Business/rlzy/kqgl/rlzy.kq.dept.input.js"></script>
		<style>   
			#user-grid-panel {border-left:1px solid #99bbe8;}
			#user-grid-panel {border-right:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#posi-grid-panel {border-bottom:1px solid #99bbe8;}
			#role-grid-panel {border-top:1px solid #99bbe8;}
			#usercount{font: bold 14px arial,sans-serif;color:red}
		</style>
  </head>     
                         
  <body>
    <div id='toolbar'>
		<div>
		    <div id="usercount"></div>
			<div id="toolbarStatus"></div>
			<div id="toolbarSpStatus"></div>
		</div>  
  	</div>
    <div id='center'></div>
  </body>
</html>
