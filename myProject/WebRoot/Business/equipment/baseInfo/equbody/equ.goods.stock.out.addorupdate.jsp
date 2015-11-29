 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备出库</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
			var edit_uids = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
			var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
			//判断是新增还是修改
			var editFlag = "<%=request.getParameter("flag")==null?"":request.getParameter("flag")%>";
			var edit_mark = "<%=request.getParameter("mark")==null?"":request.getParameter("mark")%>";
			var editBody  =  "<%=request.getParameter("editBody")==null?"":request.getParameter("editBody")%>";
			//出库单稽核管理传入的参数
			var view = "<%=request.getParameter("view")==null?"":request.getParameter("view")%>";
			//用于处理非主体设备冲回显示控制
			var showFlag = "<%=request.getParameter("showFlag")==null?"":request.getParameter("showFlag")%>";
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="extExtend/columnNodeUI.js"></script>
		<!-- PAGE -->
		<script type="text/javascript" src="Business/wzgl/common/nextSelects.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<script type="text/javascript" src="Business/equipment/baseInfo/equ.bdg.project.apportion.grid.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.common.do.column.js"></script>
		<script type="text/javascript" src="Business/equipment/baseInfo/equbody/equ.goods.stock.out.addorupdate.js"></script>
	</head>
	<body>
	</body>
</html>