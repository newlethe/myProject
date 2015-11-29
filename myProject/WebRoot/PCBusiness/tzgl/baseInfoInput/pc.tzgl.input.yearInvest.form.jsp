<%@ page language="java" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>年度投资计划报表</title>
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<style type="text/css">
			td{
				height:25px !important;
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
				 vertical-align:middle ;
				 font-size:12px ;
			}
			.td_b{
				border-top:none;
				border-left:none;
				border-right:1px solid #333333;
				border-bottom:none;
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
				width:99%;
				height:20px;
				background:transparent;
				border:1px solid #ffffff;
				text-align:center;
			}
		</style>
		<script type="text/javascript" src="PCBusiness/tzgl/baseInfoInput/pc.tzgl.input.yearInvest.form.js"></script>
	</head>
	<body>
		<div id="main"></div>
	</body>
</html>