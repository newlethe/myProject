 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同变更信息查看</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript'>
			var g_chaid = "<%=request.getParameter("chaid") %>";
		</script>
		<script type="text/javascript" src="PCBusiness/dynamicdata/conove/concha_detail.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
			<tr>
				<td class="viewLabel">变更编号</td>
				<td class="viewData">{chano}</td>
				<td class="viewLabel">变更类型</td>
				<td class="viewData">{chatype}</td>
				
			</tr>
			
			<tr>
				<td class="viewLabel">变更金额</td>
				<td class="viewData">{chamoney}</td>
				<td class="viewLabel">变更日期</td>
				<td class="viewData">{chadate}</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >变更原因</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=80% >
					  <tr>
						  <td valign="top" height="45">{chareason}<br></td>
					  </tr>
					</table>
				</td>
			</tr>
			<tr height="50">
				<td class="viewLabel" >备注</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=80% >
					  <tr>
						  <td valign="top" height="45">{remark}<br></td>
					  </tr>
					</table>
				</td>
			</tr>
		 </table>
		</div>
	</body>
</html>
