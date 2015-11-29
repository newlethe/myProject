<%@ page language="java" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>excel报表展示</title>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/faReportDWR.js'></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<object id="TANGER_OCX" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
			codebase="<%=Constant.NTKOCAB%>" width="100%" height="100%">
	        <param name="BorderStyle" value="0">
		 	<param name="BorderColor" value="14402205">   
		 	<param name="Menubar" value="false">     
		 	<param name="TitleBar" value="false">
		 	<param name="FileNew" value="false">
		 	<param name="FileOpen" value="false">
		 	<%=Constant.NTKOCOPYRIGHT%>
			<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
		</object>
		<IFRAME ID="loadingFrm"
			style="POSITION: absolute; center: 0px; TOP: 0px; WIDTH: 100%; HEIGHT: 100%;"
			src="<%=path%>/jsp/common/appendix/loading.html" frameBorder="0" scrolling="no">
		</IFRAME></body>
</html>

<script type="text/javascript">
var xlsOcx
var param = window.dialogArguments;
var url = param.url;   //文件url
var sqlParam = param.sqlParam==undefined ? "" : param.sqlParam;
var sqlParamNameArr = new Array();
var sqlParamValueArr = new Array();
if(sqlParam.length>0) {
	var sqlParamArr = sqlParam.split(";");
	for(i=0; i<sqlParamArr.length; i++) {
		var paramTemp = sqlParamArr[i].split("`");
		sqlParamNameArr[i] = paramTemp[0];
		sqlParamValueArr[i] = paramTemp[1];
	}
}
window.onload = init
function init() {
	xlsOcx = document.all('TANGER_OCX')
	if(url&&url!=null) {
		try {
			xlsOcx.OpenFromURL(url) ;
		}  catch(ex) {
			createWorkbook()
		}
	} else {
		createWorkbook()
	}
	loadData()
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

function loadData()  {
	var sheets = xlsOcx.ActiveDocument.Sheets ;
	for(var s=1;s<=sheets.count;s++) {   //sheet页循环
		var sheet = sheets.item(s) ;
		sheet.Activate()   //激活当前sheet
		var comments = sheet.Comments   //获得当前页的批注对象
		var commentsArray = new Array() ;
		var colRowNnmArray = new Array() ;
		for(var i=1;i<=comments.count;i++)  {
			var comment = comments.item(i) ;
			var crange = comment.Parent ;
			if(crange.Address.split(":").length<2) {
				var colnum = crange.Address.split("$")[1].charCodeAt(0)-"A".charCodeAt(0)+1 ;
				var rownum = crange.Address.split("$")[2];
				colRowNnmArray.push(colnum + ";" + rownum)
				var sql = comment.Text();
				for (k=0; k<sqlParamNameArr.length; k++) {
					sql = sql.replace(new RegExp("#" + sqlParamNameArr[k],'g'), "'" + sqlParamValueArr[k] + "'");
				}
				
				commentsArray.push(sql) ;
			}
		}
		
		DWREngine.setAsync(false);
		faReportDWR.getTempletExcelData(commentsArray, colRowNnmArray, function(data){
			if(data) {
				setValuesToExcel(sheet, data);
			}
		})
	}
}

//写入值
function setValuesToExcel(sheet, xml)  {
	var xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
	xmlDoc.setProperty("SelectionLanguage", "XPath")
	xmlDoc.async = false
	xmlDoc.loadXML(xml) ;
	
	var datas = xmlDoc.getElementsByTagName("datas/data") ;
	for(var r=0;r<datas.length;r++)  {
		var data = datas[r] ;
		var col = data.getAttribute("index");
		var row = data.getAttribute("row");
		var cell = sheet.Cells(parseInt(row, 10), parseInt(col, 10));
		cell.Value  = data.text;
		cell.Comment.Delete();
	}
}

</script>