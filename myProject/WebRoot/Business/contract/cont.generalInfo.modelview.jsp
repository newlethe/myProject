<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>查看合同详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var g_conid = "<%=request.getParameter("conid") %>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpayMgm.js'></script>		
		<script type='text/javascript' src='dwr/interface/conexpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>

		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/cont.generalInfo.modelview.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <table width="100%" border=0 cellpadding=3 cellspacing=1>
		 	<tr>
				<td class="viewLabel">合同编号</td>
				<td class="viewData">{conno}</td>	
				<td class="viewLabel">已付金额</td>
				<td class="viewData">{alreadyMoney}</td>		
				<td class="viewLabel">中标价</td>
				<td class="viewData">{bidprice}</td>									 		
		 	</tr>

		 	<tr>
				<td class="viewLabel">合同名称</td>
				<td class="viewData">{conname}</td>	
				<td class="viewLabel">处理中金额</td>
				<td class="viewData">{processMoney}</td>		
				<td class="viewLabel">评审价</td>
				<td class="viewData">{judgeprice}</td>									 		
		 	</tr>
		 	
		 	<tr>
				<td class="viewLabel">合同签订金额</td>
				<td class="viewData">{conmoney}</td>	
				<td class="viewLabel">付款比例</td>
				<td class="viewData">{actualPercent}</td>		
				<td class="viewLabel">截标日期</td>
				<td class="viewData">{biddate}</td>									 		
		 	</tr>		 			 
		 
		 	<tr>
				<td class="viewLabel">变更总金额</td>
				<td class="viewData">{changemoney}</td>	
				<td class="viewLabel">签订日期</td>
				<td class="viewData">{signdate}</td>		
				<td class="viewLabel">招标方式</td>
				<td class="viewData">{bidtype}</td>									 		
		 	</tr>
		 	
		 	<tr>
				<td class="viewLabel">合同总金额</td>
				<td class="viewData">{convalue}</td>	
				<td class="viewLabel">登记日期</td>
				<td class="viewData">{startdate}</td>		
				<td class="viewLabel">招标备注</td>
				<td class="viewData">{bidno}</td>									 		
		 	</tr>		 			 
		 
		 	<tr>
				<td class="viewLabel">概算金额</td>
				<td class="viewData">{bdgmoney}</td>	
				<td class="viewLabel">合同分类一</td>
				<td class="viewData">{condivno}</td>		
				<td class="viewLabel">合同管理员</td>
				<td class="viewData">{conadmin}</td>									 		
		 	</tr>		
		 	
		 	<tr>
				<td class="viewLabel">乙方</td>
				<td class="viewData">{partyb}</td>	
				<td class="viewLabel">合同分类二</td>
				<td class="viewData">{sort}</td>					
		 	</tr>		
		 		 
		 	<tr>
				<td class="viewLabel">甲方</td>
				<td class="viewData">{partya}</td>	
				<td class="viewLabel">甲方经办人</td>
				<td class="viewData">{actionpartya}</td>		
		 	</tr>			 			 
		 
			<tr height="50">
				<td class="viewLabel" >合同摘要</td>
				<td class="viewData" colspan="5">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=95% >
					  <tr>
						  <td valign="top" height="45">{context}<br></td>
					  </tr>
					</table>
				</td>
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