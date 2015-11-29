<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>  
		<title>查看违约详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		
		<script type="text/javascript">
			var uuid = "<%=request.getParameter("uuid") %>";
			var ggNo =  "<%=request.getParameter("ggNo") %>";
			var conname = "<%=request.getParameter("conname")%>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/equ.openBox.view.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
			<tr>
				<td class="viewLabel">开箱日期</td>
				<td class="viewData">{opendate}</td>
				<td class="viewLabel">建设单位</td>
				<td class="viewData">{buildPart}</td>
			<tr>
				<td class="viewLabel">验签日期</td>
				<td class="viewData">{checkdate}</td>
				<td class="viewLabel">箱件号</td>
				<td class="viewData">{boxno}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">安装单位</td>
				<td class="viewData">{fixPart}</td>
				<td class="viewLabel">开箱地点</td>
				<td class="viewData">{openAddress}</td>
			</tr>
			
			<tr height="50">
			<td class="viewLabel" >开箱检查记录</td>
			<td class="viewData" colspan="3">
				<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
				  <tr>
					  <td valign="top" height="45">{appearance}<br> </td>
				  </tr>
				</table>
			</td>
			</tr>
			
			
			<tr height="50">
				<td class="viewLabel" >开箱检查异常情况处理意见</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{problems}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >设备及附件外观质量情况，数量是否齐全</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{equipment}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >质量证明文件， 技术资料 等名称和数量</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{filedetail}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
			<tr height="50">
				<td class="viewLabel" >开箱检验评定</td>
				<td class="viewData" colspan="3">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{comments}<br> </td>
					  </tr>
					</table>
				</td>
			</tr>
			
		 </table>
		 
		</div>
		
		
	
		
	</body>
</html>
