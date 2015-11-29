<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">

		<title>项目信息详细页面</title>

		<meta http-equiv="pragma" content="no-cache">
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript"
			src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript"
			src="PCBusiness/zhxx/query/pc.zhxx.search.detail.js"></script>
			<script type="text/javascript">
			   var flag = "<%=request.getParameter("flag")==null?"":request.getParameter("flag")%>";
			</script>
		<style type="text/css">
body {
	margin: 0;
	padding: 0;
}

#Main {
	width: 100%;
	font: 12px Arial, Helvetica, sans-serif;
	color: #000;
}

#Main span {
	font: 12px Arial, Helvetica, sans-serif;
	color: #000;
	text-decoration: underline;
	padding: 0 15px;
}

#Main a {
	font: 12px Arial, Helvetica, sans-serif;
	color: #FF6600;
	text-decoration: none;
}
</style>
	</head>

	<body>
		<div id="Main">
			<table width="100%" border="0" cellpadding="0" cellspacing="1"
				bgcolor="#CCCCCC">
				<tr>
					<td height="28" colspan="4" align="left" valign="middle"
						bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
							  <td width="21" height="28" align="left" valign="middle" bgcolor="#EBEBEB">&nbsp;							  </td>
								<td width="96" align="left" valign="middle" bgcolor="#EBEBEB">
									<strong>项目名称：</strong>								</td>
								<td width="393" align="left" valign="middle" bgcolor="#EBEBEB">
									{prjName}								</td>
								<td width="106" align="left" valign="middle" bgcolor="#EBEBEB">
									<strong>所属单位：</strong>								</td>
								<td width="240" align="left" valign="middle" bgcolor="#EBEBEB">
									{unitName}								</td>
								<td width="106" align="left" valign="middle" bgcolor="#EBEBEB">
									<strong>项目地址：</strong>								</td>
								<td width="360" align="left" valign="middle" bgcolor="#EBEBEB">
									{address}								</td>
							  <td width="13" align="left" valign="middle" bgcolor="#EBEBEB">&nbsp;							  </td>
							</tr>
					  </table>
					</td>
				</tr>
				<tr>
					<td width="21%" height="28" align="left" valign="middle"
						bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;								</td>
								<td width="88" align="left" valign="middle">
									<strong>项目编码：</strong>								</td>
								<td align="left" valign="middle">
									{pid}								</td>
							</tr>
						</table>
				  </td>
					<td width="25%" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="100" align="left" valign="middle">
									<strong>投资规模(元)：</strong>								</td>
								<td align="left" valign="middle">
									{investScale}								</td>
							</tr>
						</table>
				  </td>
					<td width="24%" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="39%" align="left" valign="middle">
									<strong>开建日期：</strong>
								</td>
								<td width="53%" align="left" valign="middle">
									{startDate}
								</td>
							</tr>
						</table>
					</td>
					<td width="30%" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
							  </td>
								<td width="130" align="left" valign="middle">
									<strong>是否核准：</strong>								</td>
								<td align="left" valign="middle">
									{isapproved}								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="28" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;								</td>
								<td width="88" align="left" valign="middle">
									<strong>产业类型：</strong>								</td>
								<td align="left" valign="middle">
									{chayeleixing}								</td>
							</tr>
					  </table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="100" align="left" valign="middle">
									<strong>项目负责人：</strong>								</td>
								<td align="left" valign="middle">
									{prjRespond}								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="39%" align="left" valign="middle">
									<strong>结束日期：</strong>
								</td>
								<td width="53%" align="left" valign="middle">
									{endDate}
								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
							  </td>
								<td width="130" align="left" valign="middle">
									<strong>总投资(核准)(元)：</strong>								</td>
								<td align="left" valign="middle">
									{totalinvestment}								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="28" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;								</td>
								<td width="88" align="left" valign="middle">
									<strong>项目类型：</strong>								</td>
								<td align="left" valign="middle">
									{xiangmuleixing}								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="100" align="left" valign="middle">
									<strong>项目阶段：</strong>								</td>
								<td align="left" valign="middle">
									{xiangmujieduan}								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="39%" align="left" valign="middle">
									<strong>建设规模：</strong>
								</td>
								<td width="53%" align="left" valign="middle">
									{jiansheguimo}
								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
							  </td>
								<td width="130" align="left" valign="middle">
									<strong>接入系统是否批复：</strong>								</td>
								<td align="left" valign="middle">
									{jiruxitongsfpf}								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="28" align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;								</td>
								<td width="88" align="left" valign="middle">
									<strong>建设性质：</strong>								</td>
								<td align="left" valign="middle">
									{jianshe}								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="100" align="left" valign="middle">
									<strong>项目年限：</strong>								</td>
								<td align="left" valign="middle">
									{buildLimit}								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
								</td>
								<td width="39%" align="left" valign="middle">
									<strong>项目简介：</strong>
								</td>
								<td width="53%" align="left" valign="middle">
									<a href="javascript:uploadfile()">附件</a>
								</td>
							</tr>
						</table>
					</td>
					<td align="left" valign="middle" bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="8%" height="28" align="left" valign="middle">&nbsp;
									
							  </td>
								<td width="48%" align="left" valign="middle">
									<strong></strong>								</td>
								<td width="44%" align="left" valign="middle">
									<a href="javascript:uploadfile()"></a>								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="28" colspan="4" align="left" valign="middle"
						bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;							  </td>
								<td width="88" align="left" valign="middle">
									<strong>项目概述：</strong>								</td>
								<td align="left" valign="middle">
									{prjSummary}&nbsp;</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td height="28" colspan="4" align="left" valign="middle"
						bgcolor="#FFFFFF">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td width="15" height="28" align="left" valign="middle">&nbsp;							  </td>
								<td width="88" align="left" valign="middle">
									<strong>备 注：</strong>								</td>
								<td align="left" valign="middle">
									{memo}&nbsp;</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>
