<%@ page language="java" pageEncoding="UTF-8"%>

<html>
	<head>
		<title>查看合同付款详细信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var g_conid = "<%=request.getParameter("conid") %>";
		var g_conno = "<%=request.getParameter("conno") %>";
		var g_conname = "<%=request.getParameter("conname")==null?"":(String)request.getParameter("conname") %>";
		var g_payid = "<%=request.getParameter("payid") %>";
		var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conAccinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/contract/cont.payInfo.view.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
		if((g_conno==null||g_conname=="")&&g_conid){
			DWREngine.setAsync(false);
			baseDao.findByWhere("com.sgepit.pmis.contract.hbm.ConOveView","conid='"+g_conid+"'",function(list){
			if(list[0]){
				g_conname=list[0].conname;  
				g_conno=list[0].conno;				
			}	
		});
		DWREngine.setAsync(true);		
		}			
		</script>
	</head>
	<body >
		<div id="viewFormDiv" style="display:none">
		 <!-- <table width="100%" border=0 cellpadding=3 cellspacing=1> -->
			
			<tr>
				<td class="viewLabel">付款编号</td>
				<td class="viewData">{payno}</td>
				<td class="viewLabel">付款类型</td>
				<td class="viewData">{paytype}</td>
				<td class="viewLabel">应扣款</td>
				<td class="viewData">{demoney}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">申请付款</td>
				<td class="viewData">{appmoney}</td>
				<td class="viewLabel">批准付款</td>
				<td class="viewData">{passmoney}</td>
				<td class="viewLabel">实际付款</td>
				<td class="viewData">{paymoney}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">申请付款日期</td>
				<td class="viewData">{applydate}</td>
				<td class="viewLabel">批准付款日期</td>
				<td class="viewData">{approvedate}</td>
				<td class="viewLabel">实际付款日期</td>
				<td class="viewData">{paydate}</td>
			</tr>
			
			<tr>
				<td class="viewLabel">申请付款部门</td>
				<td class="viewData">{applydept}</td>
				<td class="viewLabel">批准人</td>
				<td class="viewData">{approveuser}</td>
				<td class="viewLabel">实际支付人</td>
				<td class="viewData">{actualuser}</td>				
			</tr>
			
			<tr>
				<td class="viewLabel">申请人</td>
				<td class="viewData">{applyuser}</td>
				<td class="viewLabel">发票金额</td>
				<td class="viewData">{invoicemoney}</td>
				<td class="viewLabel">付款方式</td>
				<td class="viewData">{paytype}</td>				
			</tr>
			<tr>
				<td class="viewLabel">收据金额</td>
				<td class="viewData">{invoiceno}</td>
				<td class="viewLabel">付款备注</td>
				<td class="viewData">{remark}</td>
				<td class="viewLabel">发票入账凭证号</td>
				<td class="viewData">{invoicerecord}</td>				
			</tr>
			<tr height="50">
				<td class="viewLabel" >付款说明</td>
				<td class="viewData" colspan="5">
					<table cellspacing="0" cellpadding="0" border="1" bordercolor="#EEEEEE" width=98% >
					  <tr>
						  <td valign="top" height="45">{payins}<br></td>
					  </tr>
					</table>
				</td>
			</tr>
	<!--  </table> -->
		</div>
	</body>
</html>
