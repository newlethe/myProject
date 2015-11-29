<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>投资计划分类树</title>
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<style>
			.icon-expand-all {
				background-image: url("<%=path%>/jsp/res/images/index/expand-all.gif") !important;
			}
			
			.icon-collapse-all {
				background-image: url("<%=path%>/jsp/res/images/index/collapse-all.gif") !important;
			}
		</style>
		<base href="<%=basePath%>"> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<script>
			var readOnly_Tree = true
		</script>
		<script type="text/javascript" src="<%=path%>/Business/zlaq/tree/Layout.js"></script>
		<!-- <script type='text/javascript' src='<%//=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%//=path%>/dwr/interface/projectCommonDWR.js'></script> -->
  </head>
  
  <body>
    <div></div>
    <div id="pop-win" class="x-hidden">
    <div id="content"></div>
	</div>
  </body>
</html>
