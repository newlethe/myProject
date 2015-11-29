<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<html>
	<head>
		<title>人力资源-人事工作提醒</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/file-upload.css"/>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/rlzyMgm.js'></script>
		<script type="text/javascript" src="Business/rlzy/lunarCalculator.js"></script>
		<script type="text/javascript" src="Business/rlzy/rlzy.user.remind.manager.js"></script>
		<style>
			#user-grid-panel {border-left:1px solid #99bbe8;}
			#user-grid-panel {border-right:1px solid #99bbe8;}
			#main-panel {border-left:1px solid #99bbe8;}
			#posi-grid-panel {border-bottom:1px solid #99bbe8;}
			#role-grid-panel {border-top:1px solid #99bbe8;}
		</style>
		
  </head>
  
  <body>
    <div>
		<input id='lunarCal' type='text' value='2011年1月1日' size=75 style='border: 0; background-color: transparent; text-align: left' readonly="readonly"/>
	</div>
  </body>
</html>
