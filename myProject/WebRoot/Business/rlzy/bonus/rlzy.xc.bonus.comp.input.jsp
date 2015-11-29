<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<html>
	<head>
		<title>人力资源-公司奖金汇总</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="<%=basePath%>extExtend/columnTreeNodeUI.js"></script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyKqglMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyXcglMgm.js'></script>
		<script type="text/javascript" src="Business/rlzy/bonus/rlzy.xc.bonus.comp.input.js"></script>
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
			<input id='toolbarStatus' type='text' value='' size=20 style='border:0;background-color:transparent;text-align:left' READONLY>
			<input id='toolbarDeptName' type='text' value='' size=25 style='border:0;background-color:transparent;text-align:left' READONLY>
			<input id='toolbarUserName' type='text' value='' size=20 style='border:0;background-color:transparent;text-align:left' READONLY>
			</input> 
		</div>
  	</div>  
    <div id='center'>
        <div id='treegrid'></div>    
    </div>
  </body>
</html>
