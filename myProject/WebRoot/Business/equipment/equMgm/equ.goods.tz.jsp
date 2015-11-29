 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>物资设备台帐</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript">
		var init = "<%=request.getParameter("init")==null?"":request.getParameter("init")%>";
		</script>
		<style type="text/css">
		#begin1,#begin2,#in1,#in2,#out1,#out2,#end1,#end2{
			color : red;
			font : 12px '宋体';
			font-weight: 700;
			margin-right:20px;
		}
		</style>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.goods.tz.js"></script>
	</head>
	<body>
	<form action="" id="formAc" method="post" name="formAc" TARGET="frm" >
    </form>
	<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>