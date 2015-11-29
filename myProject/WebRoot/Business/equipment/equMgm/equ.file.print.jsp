<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String fileid = (String)request.getParameter("fileid");
String filetype = (String)request.getParameter("filetype");
String uids = (String)request.getParameter("uids");
String finished = (String)request.getParameter("finished");
String modetype = (String)request.getParameter("modetype");
String fileName = (String)request.getParameter("fileName");
//附件需要保存时，需要同步更新主表中的fileid，beanname为主表对应的hbm
String beanname = (String)request.getParameter("beanname");
//是否开放保存功能
String save = (String)request.getParameter("save");
//是否已经存在附件，对应fileid是否有值，有值则表示已经保存过，直接打开，没有，则打开模板
String hasfile = (String)request.getParameter("hasfile");
//设备退库中有2个文档字段需要保存，添加这个字段传递字段名 pengy 2014-11-20
String fileField = request.getParameter("fileField") != null ? (String)request.getParameter("fileField") : "";
%>
<html>
	<head>
		<title>设备文档打印数据</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var _basePath = "<%=basePath%>";
			var _fileid = "<%=fileid%>";
			var _filetype = "<%=filetype%>";
			var _uids = "<%=uids%>";
			var _finished = "<%=finished%>";
			var _modetype = "<%=modetype%>";
			var _beanname = "<%=beanname%>";
			var _fileName = "<%=fileName%>";
			var _save = "<%=save%>" != "false" ? true : false; 
			var _hasfile = "<%=hasfile%>" == "true" ? true : false; 
			var _fileField = "<%=fileField%>"; 
		</script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/appMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/baseDao.js'> </script>
		<script type="text/javascript" src='dwr/interface/flwFileMgm.js'></script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="<%=basePath%>/jsp/flow/tangerocx.js"></script>
		<script type="text/javascript" src="<%=basePath%>jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="Business/equipment/equMgm/equ.file.print.js"></script>
	</head>
	<body>
		<div id="ocxDic">
			<table id="ocxTab" width=100% height=100% border=0 cellpadding=0
				cellspacing=0 style="overflow-y: hidden;">
				<tr width=100%>
					<td width=100% valign="top">
						<object id="TANGER_OCX" style=" display: none;"
							classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
							codebase="<%=basePath%><%=Constant.NTKOCAB%>"
							background-color='red' width="100%" height="100%">
							<param name="BorderStyle" value="0">
							<param name="BorderColor" value="14402205">
							<param name="Menubar" value="false">
							<param name="TitleBar" value=false>
							<param name="FileNew" value="false">
							<param name="FileOpen" value="false">
							<%=Constant.NTKOCOPYRIGHT%>
							<SPAN STYLE="color: red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
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
	</body>
</html>