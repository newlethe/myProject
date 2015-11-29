<%@ page language="java" pageEncoding="UTF-8" %>
 <html>
	<head>
		<title>合同基本信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpartybMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'> </script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
    	<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<!-- PAGE -->
		
		<script type="text/javascript">
		    //动态数据展示参数
		    var OPTYPE="<%=request.getParameter("optype")==null?"":request.getParameter("optype")%>";
		    var PID ="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
		    var PRONAME="<%=request.getParameter("proName")==null?"":request.getParameter("proName")%>";
		    var CONIDS="<%=request.getParameter("conids")==null?"":request.getParameter("conids")%>";
		    var UIDS="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		    var dyView="<%=request.getParameter("dyView")==null?"":request.getParameter("dyView")%>";
		    //动态数据展示参数
			var mainPanel;
			var hasNk = '<%=request.getParameter("hasNk") == null ? "0" : request.getParameter("hasNk")  %>';
			var conMainSerachStr="";
			var comboCat2="";
			var comboBillstate="";
			var conTitle="";
		</script>
		<script type="text/javascript" src="Business/contract/cont.main.frame.js"></script>
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<style type="text/css">
		</style>
		
	</head>
	<body >
		<span></span>
		<div id="mainDiv">
		    <iframe id="mainFrame" style="width:100%; height:100%;overflow:scroll;;overflow-y:auto;" frameborder=no src=""></iframe>
		</div>
	</body>
</html>