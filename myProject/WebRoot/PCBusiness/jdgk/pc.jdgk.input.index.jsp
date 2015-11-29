<%@ page language="java" pageEncoding="UTF-8" %>

 <html>
	<head>
		<title>进度管控信息录入</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript">
			var pid = CURRENTAPPID;
			var lvl = "<%=(String)request.getParameter("lvl")==null?"": (String)request.getParameter("lvl")%>";
			var reportname = "<%=(String)request.getParameter("reportname")==null?"": (String)request.getParameter("reportname")%>";
			  //动态数据参数
		    var PID="<%=request.getParameter("pid")==null?"":request.getParameter("pid")%>";
		    var PRONAME="<%=request.getParameter("proName")==null?"":request.getParameter("proName")%>";
		    var  UIDS ="<%=request.getParameter("uids")==null?"":request.getParameter("uids")%>";
		    
		    //如果项目单位编号是动态数据页面传递过来的参数
		    if(PID!=''){
		    	pid = PID;
		    }
		    
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/fileServiceImpl.js'></script>
		<script type='text/javascript' src='dwr/interface/pcJdgkMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/pcTzglService.js'></script>
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/common/fileUploadMulti/fileUploadMulti.js"></script>
		<script type="text/javascript" src="PCBusiness/common/js/common.js"></script>
		<script type="text/javascript" src="PCBusiness/jdgk/pc.jdgk.input.index.js"></script>
	</head>
	<body >
	</body>
</html>