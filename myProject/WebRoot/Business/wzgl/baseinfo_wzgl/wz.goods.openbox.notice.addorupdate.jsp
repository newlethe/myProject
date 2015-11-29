 <%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>  
		<title>设备到货 - 新增到货单</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var edit_conid = "<%=request.getParameter("conid")==null?"":request.getParameter("conid")%>";
		var edit_uids = "<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		var edit_treeuids = "<%=request.getParameter("treeuids")==null?"":request.getParameter("treeuids")%>";
		/* 流程查看调用 */
		var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
		/* 流程任务调用 */
		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
		/* 一般程序调用所提供的参数 */
		/* 流程任务调用所提供的参数 */
		var flowid = "<%=request.getParameter("flowid")==null?"":request.getParameter("flowid") %>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/wzbaseinfoMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/util.js'></script>
		
		<script type="text/javascript" src="<%=path%>/extExtend/QueryExcelGridPanel.js"></script>
		<script type="text/javascript" src="<%=path%>/extExtend/columnLock.js"></script>
   	    <link rel="stylesheet" type="text/css" href="<%=path%>/extExtend/columnLock.css" />		
		<link rel="stylesheet" type="text/css" href="extExtend/comboBoxMultiSelect.css" />
		<script type="text/javascript" src="extExtend/MultiSelect.js"></script>
				
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="Business/wzgl/baseinfo_wzgl/wz.goods.openbox.notice.addorupdate.js"></script>
	</head>
	<body>
	</body>
</html>