<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>查看违约详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		
		<script type="text/javascript">
			var g_breid = "<%=request.getParameter("breid") %>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/dynamicdata/conove/conbre_detail.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
			<tr>
				<td class="viewLabel">违约编号</td>
				<td class="viewData">{breno}</td>
				<td class="viewLabel">违约日期</td>
				<td class="viewData">{bredate}</td>
			</tr>
			<tr>
				<td class="viewLabel">扣款金额</td>
				<td class="viewData">{dedmoney}</td>
				<td class="viewLabel">违约类型</td>
				<td class="viewData">{bretype}</td>

			</tr>
			
				<tr height="50">
				<td class="viewLabel" >违约原因</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{brereason}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
				<tr height="50">
				<td class="viewLabel" >违约处理</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{brework}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >备注</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{remark}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
		 </table>
		</div>
	</body>
</html>
