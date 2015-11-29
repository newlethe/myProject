<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>查看合同结算详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var g_balid = "<%=request.getParameter("balid") %>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conAccinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/dynamicdata/conove/conbal_detail.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			
		</script>
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		<!-- <table width="100%" border=0 cellpadding=3 cellspacing=1> -->			
			<tr>
				<td class="viewLabel">合同名称</td>
				<td class="viewData">{conname}</td>
				<td class="viewLabel">合同编号</td>
				<td class="viewData">{conno}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">合同金额</td>
				<td class="viewData">{convalue}</td>
				<td class="viewLabel">结算日期</td>
				<td class="viewData">{baldate}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">结算审定金额</td>
				<td class="viewData">{balappmoney}</td>
				<td class="viewLabel">实际支付金额</td>
				<td class="viewData">{actpaymoney}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">单据状态</td>
				<td class="viewData">{billstate}</td>
				<td class="viewLabel">经办人</td>
				<td class="viewData">{actman}</td>
			</tr>

			<tr height="50">
				<td class="viewLabel" >备注</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{remark}<br></td>
					  </tr>
					</table>
				</td>
			</tr>
	<!--  </table> -->
		</div>
	</body>
</html>
