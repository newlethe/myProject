 <%@ page contentType="text/html;charset=UTF-8" %>
 <html>
	<head>
		<title>流程书签配置</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language="javascript" src="tangerocx.js"></script>
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		</script>

		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwDefinitionMgm.js'></script>
		
		<!-- EXT -->

		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.bookmark.config.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<form id="myForm" method="post" enctype="multipart/form-data" action="<%=basePath%>/servlet/FlwServlet?ac=uploadDoc">
			<div id="ocxDic" style="display: none;">
				<table id="ocxTab" width=100% border=0 cellpadding=0 cellspacing=0 style="display: none; overflow-y: hidden;">
					<tr width=100%>
						<td width=100% valign="top">		
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
							<!-- 以下函数相应控件的两个事件:OnDocumentClosed,和OnDocumentOpened -->
							<script language="JScript" for=TANGER_OCX event="OnDocumentClosed()">
								TANGER_OCX_OnDocumentClosed();
							</script>
							<script language="JScript" for=TANGER_OCX event="OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj)">
								TANGER_OCX_OnDocumentOpened(TANGER_OCX_str,TANGER_OCX_obj);
								//TANGER_OCX_SetDocUser(_realname);
								//TANGER_OCX_SetMarkModify(true);
								//TANGER_OCX_ShowRevisions(true);
							</script>
						</td>
					</tr>
				</table>
			</div>
		</form>
	</body>
</html>