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
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
		<script type="text/javascript">
			var sql = "select PRJ_TYPE from pc_zhxx_prj_info where pid = '"+CURRENTAPPID+"'";
			DWREngine.setAsync(false);
			baseDao.getData(sql,function(rtn){
				if(rtn != 'GF')
					window.location.href = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.jsp";
			});
			DWREngine.setAsync(true);
		</script>
		</script>
		  </head>
  <style type="text/css">
			* {
				margin-left: auto;
				margin-right: auto;
				font-family:Arial, Helvetica, sans-serif;
			}
			#proInfo{
				background: #ffffff;
			}
			#proInfo td{
				font-size:14px;
				line-height: 26px;
			}
			#proInfo td span{
				border: 1px solid #FFD700;
				padding-right : 4px;
				margin-right : 4px;
				margin-bottom : 4px;
				color:#F00;
				text-align:right;
				font-size:14px;
				width:100%;
				height:26px;
				line-height: 26px;
				display: block;
				background:#fff;
				overflow: hidden;
			}
			.countdown{
				background:url(PCBusiness/zhxx/index/images/countdown.png) 0 0 no-repeat;
				width:170px;
				height:115px;
				margin:auto;
			}
			.countdown-time{
				text-align:center;
				margin-top:50px;
				margin-left:-10px;
				font-size:45px;
				color:red;
			}
			.projTitle{
				color:#DAA520;
				font-weight: bold;
				font-size:18px;
			}
			.kaohe {
				color:#DAA520;
				font-weight: bold;
				font-size:18px;
			}
		</style>
    <body>
    <script type="text/javascript" src="PCBusiness/zhxx/index/pc.zhxx.pro.item.index.gf.js"></script>
  </body>
</html>