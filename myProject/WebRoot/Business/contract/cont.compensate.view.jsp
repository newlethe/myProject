<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>查看索赔详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		
		<script type="text/javascript">
			var g_conid = "<%=request.getParameter("conid") %>";
			var g_claid = "<%=request.getParameter("claid") %>";
			var g_conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname")%>";
			var g_conno = "<%=request.getParameter("conno")==null?"":(String)request.getParameter("conno")%>";
						//动态数据参数
		var UIDS ="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE ="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS ="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView ="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
				//动态数据参数
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/cont.compensate.view.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
			<tr>
				<td class="viewLabel">索赔编号</td>
				<td class="viewData">{clano}</td>
				<td class="viewLabel">索赔金额</td>
				<td class="viewData">{clamoney}</td>
			</tr>
			<tr>
				<td class="viewLabel">索赔日期</td>
				<td class="viewData">{cladate}</td>
				<td class="viewLabel">索赔类型</td>
				<td class="viewData">{clatype}</td>

			</tr>
			
			<tr height="50">
				<td class="viewLabel" >索赔情况</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{clatext}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >索赔处理</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{clawork}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
		 </table>
		</div>
	</body>
</html>
