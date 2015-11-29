<%@ page language="java" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>投资完成填报</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<style type="text/css">
		td{
			height:25px;
		}
		.tNormal{
			border-top:none;
			border-left:none;
			border-right:1px solid #333333;
			border-bottom:1px solid #333333;
			text-align:center ;
			vertical-align:middle ;
			font-size:12px ;
		}
		.td_r_b{
			 border-top:none;
			 border-left:none;
			 border-right:none;
			 border-bottom:none;
			 text-align:center ;
			 font-size:12px ;
		}
		.td_b{
			border-top:none !important;
			border-left:none !important;
			border-right:1px solid #333333 !important;
			border-bottom:none !important;
			text-align:center ;
			vertical-align:middle ;
			font-size:12px ;
		}
		.td_r{
			border-top:none;
			border-left:none;
			border-right:none;
			border-bottom:1px solid #333333;
			text-align:center ;
			vertical-align:middle ;
			font-size:12px ;
		}
		.td_l{
			border-top:none !important;
			border-left:none !important;
			border-right:1px solid #333333;
			border-bottom:1px solid #333333;
			text-align:center ;
			vertical-align:middle ;
			font-size:12px ;
		}
		.div_t{
			background-color:#E1E1E1; 
			padding:2px 5px;
			border-bottom:1px solid;
			border-top:1px solid;
			cursor:pointer;
			font-weight:bold;
			font-size:14px;
		}
		input{
				width:100%;
				height:20px;
				background:transparent;
				border:0px solid #ffffff;
				text-align:center;
			}
		.td_disable{
			background-color:#E1E1E1;
		}
		</style>
		<script type="text/javascript" src="PCBusiness/tzgl/DYReport/pc.tzgl.DYReport1.report.js"></script>
	</head>
	<body>
	</body>
</html>
