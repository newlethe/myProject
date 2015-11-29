<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>查看合同详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var g_conid = "<%=request.getParameter("conid") %>";
			//是否禁用“返回”，“修改按钮”(使用窗口显示合同信息时使用)
			var windowMode = "<%=request.getParameter("windowMode") == null ? "0" : request.getParameter("windowMode") %>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpayMgm.js'></script>		
		<script type='text/javascript' src='dwr/interface/conexpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/dynamicdata/conove/con_ove.detail.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
		 	<tr>
				<td class="viewLabel">合同编号</td>
				<td class="viewData">{conno}</td>
				<td class="viewLabel">甲方</td>
				<td class="viewData">{partya}</td>
				<td class="viewLabel">乙方</td>
				<td class="viewData">{partyb}</td>											
		 	</tr>

		 	<tr>
				<td class="viewLabel">合同名称</td>
				<td class="viewData">{conname}</td>	
				<td class="viewLabel">项目名称</td>
				<td class="viewData">{projectname}</td>
				<td class="viewLabel">合同总金额</td>
				<td class="viewData">{convalue}</td>									
		 	</tr>
            <tr>
				<td class="viewLabel">招标内容</td>
				<td class="viewData">{bidtype}</td>	
				<td class="viewLabel">承办部门</td>
				<td class="viewData">{contractordept}</td>
				<td class="viewLabel">承办人</td>
				<td class="viewData">{contractors}</td>									
		 	</tr>
            <tr>
				<td class="viewLabel">签订人</td>
				<td class="viewData">{actionpartya}</td>
				<td class="viewLabel">签订日期</td>
				<td class="viewData">{signdate}</td>
				<td class="viewLabel">履约保函到期日</td>
				<td class="viewData">{performancedate}</td>										
		 	</tr>		 			 	

			<tr height="50">
				<td class="viewLabel" >合同内容</td>
				<td class="viewData" colspan="5">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=95% >
					  <tr>
						  <td valign="top" height="45">{context}<br></td>
					  </tr>
					</table>
				</td>
			</tr>
			
			
		 	<tr>
				<td class="viewLabel">合同签订金额</td>
				<td class="viewData">{conmoney}</td>	
				<td class="viewLabel">付款比例</td>
				<td class="viewData">{payper}</td>	
				<td class="viewLabel">合同分类一</td>
				<td class="viewData">{condivno}</td>		
		 	</tr>		 			 
		 
		 	<tr>
				<td class="viewLabel">变更总金额</td>
				<td class="viewData">{changemoney}</td>	
				<td class="viewLabel">已付比例</td>
				<td class="viewData">{actualPercent}</td>
				<td class="viewLabel">合同分类二</td>
				<td class="viewData">{sort}</td>	
		 	</tr>
		 	
		 	<tr>
	
				<td class="viewLabel">登记日期</td>
				<td class="viewData">{startdate}</td>
				<td class="viewLabel">已付金额</td>
				<td class="viewData">{alreadyMoney}</td>		
				<td class="viewLabel">处理中金额</td>
				<td class="viewData">{processMoney}</td>													 		
		 	</tr>		 			 
		 
		 	<tr>
				<td class="viewLabel">概算金额</td>
				<td class="viewData">{bdgmoney}</td>
				<td class="viewLabel">合同管理员</td>
				<td class="viewData">{conadmin}</td>
				<td class="viewLabel">发票金额</td>
				<td class="viewData">{invoicemoney}</td>
		 	</tr>		
			<tr height="50">
				<td class="viewLabel" >备注</td>
				<td class="viewData" colspan="5">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=95% >
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
