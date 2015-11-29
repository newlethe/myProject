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
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>		
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_CHART")%>/script/carton.js"></script>
        <script type="text/javascript">
			var itemType = "";
			var sql = "select PRJ_TYPE from pc_zhxx_prj_info where pid = '"+CURRENTAPPID+"'";
			DWREngine.setAsync(false);
			baseDao.getData(sql,function(rtn){
				itemType = rtn;
			});
			DWREngine.setAsync(true);
		</script>
        <link rel="stylesheet" type="text/css" href="PCBusiness/zhxx/index/item.index.style.css" />
        <style type="text/css">
        .buttons1 td input{
			width:138px;
			height:30px;
			color:#DAA520;
			font-size:12px;
			border:0;
		}
		
			.bq{
				width:250px;
				height:120px;
				padding:10px 0 0 40px;
				margin:0;
			}
			.bq a{
				display:block;
				font:12px/35px Arial, Helvetica, sans-serif;
				color:#333;
				padding:0 0 0 30px;
				text-decoration:none;
			}
			.bq a.tb01{
				background:url(jsp/res/images/icons/button-b01.png) 0 10px no-repeat;
			}
			.bq a.tb02{
				background:url(jsp/res/images/icons/button-b02.png) 0 10px no-repeat;
			}
			.bq a.score{
				background:url(jsp/res/images/icons/sum.png) 0 10px no-repeat;
			}
			.bq a:hover{
				color:#FF0000;
				text-decoration:none;
			}
			.bq a span{
				font:12px/24px Arial, Helvetica, sans-serif;
				color:#FF0000;
				text-decoration:underline;
				padding:0 4px;
			}
			#liTable TD{
				font-size:14px;
			}
			#liTable #myChart{
				height:250px;
			}
        </style>
  </head>
  
  <body>
    <script type="text/javascript" src="PCBusiness/zhxx/index/pc.zhxx.pro.item.index.guofeng.js"></script>
  </body>
</html>
