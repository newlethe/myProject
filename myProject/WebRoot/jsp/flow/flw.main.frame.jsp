 <%@ page language="java" pageEncoding="UTF-8" %>
  <%
 	String flowInstantId = request.getParameter("flowInstantId")==null?"":request.getParameter("flowInstantId").toString();
  %>
 <html>
	<head>
		<title>流程框架</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _flowInstantId = "<%=flowInstantId%>";
		</script>
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwLogMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwFileMgm.js'></script>
		
		<!-- EXT -->
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/examples/portal/Portal.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/examples/portal/PortalColumn.js"></script>
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/examples/portal/Portlet.js"></script>
		
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/tangerocx.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.main.frame.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.common.wins.js"></script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="ext2/examples/portal/portal.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />
	</head>
	<body>
			<object id="TANGER_OCX" style="display: none;" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
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
			<script language="JScript" for=TANGER_OCX event="OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)">
				TANGER_OCX_OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj);
			</script>
	</body>
</html>