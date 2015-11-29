<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String fileid = (String)request.getParameter("fileid");
String filetype = (String)request.getParameter("filetype");
String ModuleLVL = (String)request.getParameter("ModuleLVL");
//String uids = (String)request.getParameter("uids");
//String modetype = (String)request.getParameter("modetype");
//String fileName = (String)request.getParameter("fileName");
//附件需要保存时，需要同步更新主表中的fileid，beanname为主表对应的hbm
//String beanname = (String)request.getParameter("beanname");
//是否开放保存功能
//String save = (String)request.getParameter("save");
//System.out.println(">>>>"+save);
//是否已经存在附件，对应fileid是否有值，有值则表示已经保存过，直接打开，没有，则打开模板
//String hasfile = (String)request.getParameter("hasfile");
%>
 <html>
	<head>
		<title>Office文件在线查看</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<script type="text/javascript">
			var _fileid = "<%=fileid%>";
			var _filetype = "<%=filetype%>";
			var _ModuleLVL = "<%=ModuleLVL%>";
		</script>
		<!-- CSS -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<script type="text/javascript" src="<%=basePath%>/jsp/flow/tangerocx.js"></script>
		<script type="text/javascript" src="<%=basePath%>jsp/flow/Constants.js"></script>
		<script type="text/javascript" src="jsp/common/open.file.online.js"></script>
	</head>
	<body>
	
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
					<SCRIPT language="JScript" for="TANGER_OCX" event="OnFileCommand(cmd,cancel)">
						document.all("TANGER_OCX").CancelLastCommand = true;
					</SCRIPT>
				</td>
			</tr>
		</table>
	</div>
		<form action="" id="formAc" method="post" name="formAc" TARGET="frm">
		</form>
		<iframe name="frm" frameborder="1" style="width: 0; height: 0;display:none"
			scrolling="auto" ></iframe>
	</body>
</html>