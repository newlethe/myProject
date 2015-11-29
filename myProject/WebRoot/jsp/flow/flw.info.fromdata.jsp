 <%@ page contentType="text/html;charset=UTF-8" %>
 <html>
	<head>
		<title>流程信息查看-数据角度</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		var _insid = '<%=(String)request.getParameter("insid")%>';
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/tangerocx.js"></script>
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.info.fromdata.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<div id="ocxDiv" style="display: none;">
			<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
				codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="0">
		        <param name="BorderStyle" value="0">
			 	<param name="BorderColor" value="14402205">   
			 	<param name="Menubar" value="false">     
			 	<param name="TitleBar" value=false>
			 	<param name="FileNew" value="false">
			 	<param name="FileOpen" value="false">
			 	<%=Constant.NTKOCOPYRIGHT%>
				<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
			</object>		
		</div>
		<span></span>
	</body>
</html>