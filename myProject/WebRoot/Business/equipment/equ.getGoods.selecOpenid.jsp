<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp" %>
<html>
	<head>
		<title>选择设备开箱单号</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        
        <base href="<%=basePath%>">

		<!-- DWR -->	
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script> 
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equGetGoodsArrMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'></script>
		<script type="text/javascript">
		   var obj = window.dialogArguments;
		   var conid = obj.conid;
		   var conname="";conno="";
		   var bean = "com.sgepit.pmis.contract.hbm.ConOve";
			DWREngine.setAsync(false);
			baseDao.findByWhere2(bean, "conid='"+conid+"'", function(conList){
				conname = conList[0].conname;
				conno = conList[0].conno;
			});
			DWREngine.setAsync(true);
		</script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/equipment/equ.getGoods.selecOpenid.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	    <link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>


	</body>
</html>