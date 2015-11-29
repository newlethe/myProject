 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
 	<%
 	String title="合同基本信息";
 	String tpe=request.getParameter("type");
 	if(null!=request.getParameter("sj")){
 		if(null!=tpe&&"con".equals(tpe)){
 	 		title="本月新签订合同信息查询"; 			
 		}
 		else if(null!=tpe&&"conPay".equals(tpe)){
 			title="本月发生付款合同信息查询";
 		}

 	}
 	else if(null==request.getParameter("sj")){
 		if(null!=tpe&&"con".equals(tpe)){
 	 		title="累计已签合同信息查询";	
 		}
 		else if(null!=tpe&&"conPay".equals(tpe)){
 	 		title="累计发生付款合同信息查询";	 			
 		}
 	}
 	%>
	<head>
		<title><%=title%></title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
       <script type="text/javascript">
       var pid="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
       var sj="<%=request.getParameter("sj")==null?"":request.getParameter("sj")%>";
       var type="<%=request.getParameter("type")==null?"":request.getParameter("type")%>";
       </script>
		<!-- DWR -->
		<script type="text/javascript" src="PCBusiness/pcCon/contract/cont.frame.js"></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body >
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%;overflow:scroll;;overflow-y:auto;" frameborder=no src=""></iframe>
		</div>
	</body>
</html>