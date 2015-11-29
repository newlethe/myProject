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
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_CHART")%>/script/carton.js"></script>
        <script type="text/javascript">
        	var itemType = "";
			var sql = "select PRJ_TYPE from pc_zhxx_prj_info where pid = '"+CURRENTAPPID+"'";
			DWREngine.setAsync(false);
			baseDao.getData(sql,function(rtn){
				itemType = rtn;
				if(itemType == 'GF')
					window.location.href = BASE_PATH+"PCBusiness/zhxx/index/pc.zhxx.pro.item.index.gf.jsp";
			});
			DWREngine.setAsync(true);
		</script>
        <style type="text/css">
			* {
				margin-left: auto;
				margin-right: auto;
				font-family:"宋体";
			}
			#liTable{
				text-align : center;
			}
			#liTable #myChart{
				height : 300px;
			}
			
			#liTable td{
				font-size:13px;
			}
			#proInfo{
				background: #ffffff;
			}
			#proInfo td{
				font-size:13px;
				line-height: 26px;
			}
			#proInfo td span{
				border: 1px solid #8A8A8A;
				padding-right : 4px;
				margin:4px;
				color:#CC0F13;
				text-align:right;
				font-size:12px;
				width:100%;
				height:24px;
				line-height: 22px;
				display: block;
				background:#fff;
				overflow: hidden;
			}
			.countdown{
				background:url(PCBusiness/zhxx/index/images/countdown_jt.png) 0 0 no-repeat;
				width:170px;
				height:115px;
				margin:auto;
			}
			.countdown-time{
				text-align:center;
				line-height:115px;
				font-size:52px;
				color:#6C80D9;
				font-weight:700;
				font-family:'黑体','华文细黑';
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
			.buttons{
				
			}
			.buttons td input{
				background:url(PCBusiness/zhxx/index/images/button.jpg) 0 0 no-repeat;
				width:188px;
				height:34px;
				color:#DAA520;
				font-size:14px;
				border:0;
			}
			
		</style>
  </head>
  
  <body>
    <script type="text/javascript" src="PCBusiness/zhxx/index/pc.zhxx.pro.item.index.js"></script>
  </body>
</html>
