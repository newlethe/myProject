<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>新兴能源公司首页</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<%@ include file="/jsp/common/golobalJs.jsp" %>
	<base href="<%=basePath%>">
	<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	<style type="text/css">
		#proInfo{
			background: #fff;
		}
		#proInfo td{
			font-size:13px;
			line-height: 26px;
			font-family:"宋体";
			
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
		input{
			border: 1px solid #FFD700;
			color:#F00;
			text-align:right;
			width:100%;
			height:22px;
		}
		#remindInfo{
			width : 359px;
			height : 160px;
			margin:0 0 0 0xp;
		}
		#remindInfo #show_remind{
			margin-top:130px;
			font-size:14px;
			cursor:pointer;
			line-height:30px;
			font-weight:100;
			height:30px;
			width:160px;
			color:#fff;
			background:#D00F14;
			font-family:"宋体";
			text-align:center;
		}
		#remindInfo #close_remind{
			float:right;
			font-weight:100;
			font-size:14px;
			font-family:"宋体";
			cursor:pointer;
			line-height:15px;
			height:15px;
			width:13px;
			color:#8A8A8A;
			border:1px solid #8A8A8A;
			text-align:center;
		}
		#remindInfo #table_remind{
			margin-left : 50px;
			width : 290px;
			border : 1px solid #8A8A8A;
		}
		#remindInfo ul li{
		}
		#remindInfo ul li a{
			display:block;
			font-size:14px;
			color:#333;
			height:30px;
			line-height:30px;
			text-decoration:none;
			margin : 5px 20px;
			padding : 0 30px;
			background: url(jsp/res/images/icons/button-b02.png) 0 8px no-repeat;
		}
		#remindInfo ul li a:hover{
			color:#FF0000;
			font-weight:100;
			text-decoration:underline;
		}
		#remindInfo ul li a span{
			font-size:14px;
			color:#FF0000;
			text-decoration:underline;
		}
		
	#right{
		width:100%;
		background:#fff;
		float:left;
		margin:0;
		display:block;
		overflow-y:auto;
	}
	#right #mapFrame{
		width:290px;
		background:#fff;
		float:left;
		text-align:center;
		display:block;
		position: relative;
	}
	#right #mapFrame #mapPng{
		
	}
	
	#right #itemListPart {
		width:246px;
	}
	#right #itemListPart #itemListTitle {
		height:34px;
		width:100%;
		line-height:34px;
		/*background: #D00F14;*/
		background: #fff;
		float:left;
		font-size:14px;
		margin:0;
		text-align: center; 
		color: #FFF; 
		font-weight: bold;
	}
	#right #itemListPart #itemListTitle span{
		float:left;
		width:49%;
		cursor:pointer;
	}
	#right #itemListPart #itemList {	
		background:#FFF;
		float:left;
		width:100%;
		margin:0;
	}
	#right #itemListPart #itemList ul{list-style:none; padding:0; margin:0;}
	#right #itemListPart #itemList ul li{}
	#right #itemListPart #itemList ul li a.ilist{
		height:34px;
		padding-left:10px;
		line-height:34px;
		display:block;
		font-size:14px;
		color:#666;
		text-decoration:none;
		background:#fff;
		border-bottom: 1px #0099CC dotted;
	}
	#right #itemListPart #itemList ul li a.ilist:hover{
		font-size:14px;
		background:#f4f4f4;
	}
	.unitPoint{
		position: absolute;
		width:20px;
		height:20px;
		display:block;
		cursor:pointer;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/pp.png) no-repeat ;
	}
	.unitPointInfo{
		width:149px;
		position: absolute;
	}
	.mapInfoTop{
		width:149px;
		height:10px;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info.png) no-repeat 0 0px ;
	}
	.mapInfoBody{
		width:149px;
		text-align:center;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info_m.png) repeat-y;
	}
	.mapInfoFoot{
		width:149px;
		height:30px;
		cursor:pointer;
		background:url(<%=basePath%>PCBusiness/zhxx/index/images/info.png) no-repeat 0 -36px ;
	}
	a.infoUnit{
		color : #fff;
		font-size:12px;
		line-height:16px;
		text-decoration:none;
	}
	a.infoUnit:hover{
		color : #fff;
		font-size:12px;
		line-height:16px;
		text-decoration:underline;
	}
	</style>
	<!-- DWR -->
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
	<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
	<script type='text/javascript' src='dwr/interface/ComFileManageDWR.js'></script>
	<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
	<script type='text/javascript' src='dwr/interface/pcPrjService.js'></script>
	<script type="text/javascript">
		var indexUnitId = "<%=request.getParameter("unitid")==null?"":request.getParameter("unitid")%>";
		if(indexUnitId == "") indexUnitId = USERBELONGUNITID;
		var sjType = "<%=request.getParameter("sjType")==null?"":request.getParameter("sjType")%>";
	</script>
	<!-- PAGE -->
	<script type="text/javascript" src="PCBusiness/zhxx/index/pc.zhxx.pro.index.js"></script>
  </head>
  
  <body>
  
  </body>
</html>
