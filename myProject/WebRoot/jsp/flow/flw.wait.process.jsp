 
 <%@ page contentType="text/html;charset=UTF-8" %>
 <html>
	<head>
<%
String params = java.net.URLDecoder.decode(request.getQueryString(), "UTF-8");
String _title = params.substring(params.indexOf("title=")+"title=".length(), params.indexOf("&", params.indexOf("title=")));
%>
		<title>待办事项处理</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<script language="javascript" src="tangerocx.js"></script>
		<style type="text/css">
			.div_lc{
				margin:0;
				padding:9px;
				width:262px;
			}
			.div_inside{
				margin:0;
				padding:8px;
				width:100%;
				border:1px #ccc solid;
				word-wrap:break-word;
				word-break:break-all;
			}
			.STYLE1 {
			    font:12px/15px "宋体";
				font-weight: bold;
				color: #000000;
			}
			
			.STYLE2 {
				color: #666666;
				font: 12px/25px "宋体";
				font-weight:lighter;
			}
		
		</style>
 		<%@ include file="../common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
		var _basePath = '<%=basePath%>';
		var _userid = '<%=session.getAttribute(Constant.USERID)%>';
		var _username = '<%=session.getAttribute(Constant.USERACCOUNT) %>';
		var _realname = '<%=session.getAttribute(Constant.USERNAME)%>';
		var _logid = '<%=(String)request.getParameter("logid")%>';
		var _flowid = '<%=(String)request.getParameter("flowid")%>';
		var _title = '<%=_title%>';
		var _insid = '<%=(String)request.getParameter("insid")%>';
		var _ftype = '<%=(String)request.getParameter("ftype")%>';
		var _fromnode = '<%=(String)request.getParameter("fromnode")%>';
		var _currentDocNode = '<%=(String)request.getParameter("currentDocNode")%>';
		</script>
		<!-- DWR -->
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'></script>
		<script type='text/javascript' src='dwr/interface/systemMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwLogMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwFileMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwFrameMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/flwInstanceMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='dwr/interface/conexpMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conpayMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conchaMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equRecMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/stockMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equGetGoodsMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/equMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/conoveMgm.js'></script>
		<!-- EXT -->
		<!-- PAGE -->
		<script type="text/javascript" src="jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.wait.process.printdata.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.wait.process.ux.face.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.wait.process.widgets.js"></script>
		<script type="text/javascript" src="jsp/flow/flw.wait.process.js"></script>
		
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
	<body>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm" style="display:none"> </form>
   		<iframe name="frm" frameborder="1" style="width: 0; height: 0" scrolling="auto" style="display:none"></iframe>
		<form id="myForm" method="post" enctype="multipart/form-data" action="<%=basePath%>/servlet/FlwServlet?ac=uploadDoc">
			<div id="ocxDic">
				<table id="ocxTab" width=100% height=100% border=0 cellpadding=0 cellspacing=0 style="overflow-y: hidden;">
					<tr width=100%>
						<td width=100% valign="top">
							<object id="TANGER_OCX" style="display:none;" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
								codebase="<%=basePath%><%=Constant.NTKOCAB%>" background-color='red' width="100%" 
								height="100%">
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
								TANGER_OCX_SetMarkModify(false);
								TANGER_OCX_ShowRevisions(true);
								TANGER_OCX_EnableReviewBar(true);
							</script>
						</td>
					</tr>
				</table>
			</div>
		</form>
	</body>
</html>