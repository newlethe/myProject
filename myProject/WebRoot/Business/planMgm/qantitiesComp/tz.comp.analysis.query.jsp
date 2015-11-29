<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
	<head>
		<title>投资完成综合分析</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		
		<style type="text/css">
		#proTable{
			margin:10px;
		}
		#proTable .proTitle{
			font-size: 20px;
			font-weight: bold;
			text-align: center;
		}
		#proTable .part{
			width:32%;
			margin-right: 1px;
		}
		#proTable td{
			padding:5px;
			font-size: 14px;
			font-family:'宋体';
		}
		a.tz{
			font-size:14px;
			font-family:'宋体';
			color:blue;
			height:40px;
			line-height:40px;
			display: block;
		}
		</style>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_CHART")%>/script/carton.js"></script>
		<script type="text/javascript" src="Business/planMgm/qantitiesComp/tz.comp.analysis.query.js"></script>
	</head>

	<body>
	</body>
</html>
