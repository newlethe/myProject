<%@ page language="java" pageEncoding="utf-8" %>
<%
	String safeType = request.getParameter("type")==null?"":request.getParameter("type").toString();
 %>
<!DOCTYPE html>
 <html lang="zh">
	<head>
		<title>安全隐患整改</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.css" />
		<link rel="stylesheet" type="text/css" href="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx_custom.css" />
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_DHX")%>/codebase/dhtmlx.js"></script>
		<script type="text/javascript">
			var safeType = "<%=safeType%>";
		</script>
		<style type="text/css">
			*{
				font-size:12px !important;
				font-family:'宋体' !important;
			}
			DIV.gridbox TABLE.row20px TR TD{
				height:22px !important;
			}
			.dhx_skyblue_list.dhx_combo_list{}
		</style>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script src="dwr/interface/db2Json.js"></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcAqgkService.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="dhtmlx/js/componentsUtil.js"></script>
		<script type="text/javascript" src="PCBusiness/aqgk/pc.aqgk.safety.change.js"></script>
	</head>
	<body>
	</body>
</html>

