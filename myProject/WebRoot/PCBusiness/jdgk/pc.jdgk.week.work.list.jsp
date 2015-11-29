<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>周工作情况分析</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<!-- STYLE -->
		<link rel="stylesheet" type="text/css" href="extExtend/treegridtest/css/TreeGrid.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
		<!-- DWR -->
		<script src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<script type='text/javascript' src='dwr/interface/pcJdgkMgm.js'></script>
		<!-- EXTEND -->
		<script type="text/javascript" src="extExtend/columnTreeNodeUI.js"></script>
		<script type="text/javascript" src="extExtend/monthPick.js"></script>
		<script type="text/javascript" src="extExtend/treegridtest/TreeGrid.js"></script>
		<!-- PAGE -->
		<script type="text/javascript">
			var editAbleFlag = "<%=request.getParameter("editAbleFlag")==null?"false":(request.getParameter("editAbleFlag").equals("true")?"true":"false")%>";
		</script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.week.work.list.js"></script>
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0"
			scrolling="auto" display:none></iframe>
	</body>
</html>