<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>主设备台账管理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<%@ include file="/jsp/common/golobalJs.jsp"%>
		<base href="<%=basePath%>">
        <!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equBaseInfo.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>

		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/FileUploadField.js"></script>
		
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.cont.tree.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.bodys.maintenance.tzgl.js"></script>
	</head>
	<body >
	
		<div id="equBodysWin1" style='display:none'>
			<div id="equBodysWin2">
				<iframe id="equBodysWinck" name="equBodysWinck" style="width:100%; height:100%" src=""></iframe>
			</div>
			<div id="equBodysWin3">
				<iframe id="equBodysWinrk" name="equBodysWinrk" style="width:100%; height:100%" src=""></iframe>
			</div>
			<div id="equBodysWin4">
				<iframe id="equBodysWinkc" name="equBodysWinkc" style="width:100%; height:100%" src=""></iframe>
			</div>
		</div>
	</body>
</html>

<%----%>
<%----%>
<%--select t.uids,--%>
<%--       t.warehouse_no rkdh,--%>
<%--       t.warehouse_date rkrq,--%>
<%--       t.conid,--%>
<%--       t.supplyunit ghdw,--%>
<%--       t.invoiceno fph,--%>
<%--       ( select round(nvl(sum(tsub.amount_money + tsub.amount_tax), 0), 2)--%>
<%--          from equ_goods_storein_sub tsub--%>
<%--         where tsub.sbrk_uids = t.uids--%>
<%--        ) as zje,--%>
<%--       t.equid ckh,--%>
<%--       t.special zylp,--%>
<%--       t.type--%>
<%--  from equ_goods_storein t--%>
<%-- where conid = '297edff8454ff10a014554f95d381a47'--%>
<%--   and treeuids = '297edff845acac790145acb699a81701'--%>
<%--   and data_type = 'EQUBODY'--%>
<%--   --%>
<%--   select tab.*--%>
<%--  from (select (select warehouse_no--%>
<%--                  from equ_goods_storein--%>
<%--                 where uids = t.sbrk_uids) as rkno,--%>
<%--               t.sbrk_uids,--%>
<%--               t.warehouse_type,--%>
<%--               t.warehouse_name,--%>
<%--               t.ggxh,--%>
<%--               t.jz_no,--%>
<%--               t.unit,--%>
<%--               t.in_warehouse_no,--%>
<%--               nvl(t.unit_price, 0) as rkprice ,--%>
<%--               nvl(t.amount_money, 0) as rkmoney,--%>
<%--               nvl(t.freight_money, 0) as rkyf,--%>
<%--               nvl(t.insurance_money, 0) as rkbxf,--%>
<%--               nvl(t.anther_money, 0) as ruqt,--%>
<%--               nvl(t.into_money, 0) rkdj,--%>
<%--               nvl((t.into_money * t.in_warehouse_no), 0) as rkje,--%>
<%--              nvl( (t.amount_tax / (t.into_money * t.in_warehouse_no)--%>
<%--               --%>
<%--               ),0) as taxs,--%>
<%--               nvl(t.amount_tax, 0) as jrsj,--%>
<%--               nvl(t.freight_tax, 0) yfsj,--%>
<%--               t.uids--%>
<%--          from equ_goods_storein_sub t) tab;--%>
