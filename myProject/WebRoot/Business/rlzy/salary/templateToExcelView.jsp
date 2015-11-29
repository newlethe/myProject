<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/dhtmlxGridCommon/xgridCommon/baseCommon.jsp" %>
<!-- @author:lizp  -->
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>excel导出</title>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/xgridCommon.js'></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<div id="ocxDiv">
			<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
				codebase="<%=basePath%><%=Constant.NTKOCAB%>" width="100%" height="100%">
				<param name="BorderStyle" value="0">
			 	<param name="BorderColor" value="14402205">   
			 	<param name="Menubar" value="false">     
			 	<param name="TitleBar" value="false">
			 	<param name="FileNew" value="false">
			 	<param name="FileOpen" value="false">
				<%=Constant.NTKOCOPYRIGHT%>
				<SPAN STYLE="color:red"><br>不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
			</object>
		</div>
		<IFRAME ID="loadingFrm"
			style="POSITION: absolute; center: 0px; TOP: 0px; WIDTH: 100%; HEIGHT: 100%;"
			src="<%=basePath%>/jsp/common/appendix/loading.html" frameBorder="0" scrolling="no">
		</IFRAME></body>
</html>

<script type="text/javascript">
var xlsOcx
var param = window.dialogArguments;
var url = param.url;   //文件url
var fileLsh = param.fileLsh;

var fileUrl = url+ "&fileid=" + fileLsh;
window.onload = init
function init() {
	xlsOcx = document.all('TANGER_OCX')
	if(url&&url!=null) {
		try {
			xlsOcx.OpenFromURL(fileUrl, false, "Excel.Sheet") ;
		}  catch(ex) {
			createWorkbook()
		}
	} else {
		createWorkbook()
	}
	loadingImg = window.frames["loadingFrm"].frameElement
	loadingImg.style.display = "none"
}

function createWorkbook()  {
	try {
		xlsOcx.CreateNew("Excel.Sheet")
	} catch(ex) {
		try {
			xlsOcx.CreateNew("Kingsoft Sheet")
		} catch(ex) {
		}
	}
}
</script>

<SCRIPT language="JScript" for="TANGER_OCX" event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		xlsOcx.CancelLastCommand = true
		xlsOcx.SaveToURL(MAIN_SERVLET+"?ac=upload","filename1","fileid1="+param.fileLsh+"&businessid="+param.businessId,"template["+param.businessId+"].xls",0)
		//xlsOcx.SaveAsOtherFormatToURL(4, MAIN_SERVLET+"?ac=upload","filename1","fileid1="+param.fileLsh+"&businessid="+param.businessId,"template["+param.businessId+"].xls",0)
		alert("保存完毕")
	}
</SCRIPT>