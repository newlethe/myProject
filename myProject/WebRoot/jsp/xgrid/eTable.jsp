<%@ page language="java" pageEncoding="UTF-8"%>
<!-- @author:lizp  -->

<html>
	<head>
		<%@ include file="/jsp/common/golobalJs.jsp" %>		
		<title>Xgrid模板配置【EXT】</title>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/db2Json.js'></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<object id="TANGER_OCX1" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404" 
			codebase="<%=basePath%><%=Constant.NTKOCAB%>" background-color='red' width="100%" 
			height="100%">
	        <param name="Menubar" value="-1">
			<param name="Titlebar" value="0">
			<param name="IsShowToolMenu" value="-1">
			<param name="IsHiddenOpenURL" value="0">
			<param name="IsUseUTF8URL" value="-1">
		 	<%=Constant.NTKOCOPYRIGHT%>
			<SPAN STYLE="color:red">不能装载文档控件。请在检查浏览器的选项中检查浏览器的安全设置。</SPAN>
		</object>
	</body>
</html>
<SCRIPT LANGUAGE="JavaScript">
<!--
window.onload = init;
window.onunload = reoladParent;
var param = window.dialogArguments
var xlsOcx
var templet_type = param.templet_type ;
function init() {
	xlsOcx = document.all('TANGER_OCX1')
	xlsOcx.AddCustomMenu2(1, "数据项配置(&V)")
	xlsOcx.AddCustomMenuItem2(1, 1, -1, false, "  列配置(&C)...        ", false)

	if(param.fileId) {
		try {
			xlsOcx.OpenFromURL(MAIN_SERVLET+"?ac=downloadFile&fileid="+param.fileId)
		} catch(ex) {
			xlsOcx.CreateNew("Excel.Sheet");
		}
	} else {
		xlsOcx.CreateNew("Excel.Sheet");
	}
}

function reoladParent(){
	param.window.location.href = basePath+"jsp/xgrid/templetList.jsp?checkFlag=true&start="+param.start+"&rowIndex="+param.rowIndex;
}

function getGridXml() {
	var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
	xmlDoc.setProperty("SelectionLanguage", "XPath");
	xmlDoc.async = false;
	
	var activeSheet = xlsOcx.ActiveDocument.ActiveSheet
	var comments = activeSheet.Comments	
	var colObjs = new Array()
	var minRow = 100
	var maxRow = 0
	if(xlsOcx.docType =="2"){
		//判断sheet是否数据表格
		if(comments.count==0) {
			updateFileIdFun(xmlDoc, "");
			return ;
		}
		if(xmlDoc.hasChildNodes()) {
			xmlDoc.removeChild(xmlDoc.firstChild)
		}
		var root = xmlDoc.createElement("rows") 
		xmlDoc.appendChild(root);
		var hr = xmlDoc.createElement("head")
		root.appendChild(hr);	
		//获得表头的行列范围
		for(var c=1; c<=comments.count; c++) {
			if(comments(c).Text().indexOf("/")<0) continue
			var mergeCell = comments(c).parent
			minRow = Math.min(mergeCell.row, minRow)
			maxRow = Math.max(mergeCell.row+mergeCell.Rows.Count-1, maxRow)
			colObjs.push(mergeCell.column+"&"+comments(c).Text())
		}
	}
	if(xlsOcx.docType =="7"){
		//判断sheet是否数据表格
		if(comments.Count==0){
			updateFileIdFun(xmlDoc, "");
			return ;
		}
		if(xmlDoc.hasChildNodes()) {
			xmlDoc.removeChild(xmlDoc.firstChild)
		}
		var root = xmlDoc.createElement("rows") 
		xmlDoc.appendChild(root);
		var hr = xmlDoc.createElement("head")
		root.appendChild(hr);		
		//获得表头的行列范围
		for(var c=1; c<=comments.Count; c++) {

			if(comments(c).Text.indexOf("/")<0) continue
			var mergeCell = comments(c).Range			
			minRow = Math.min(mergeCell.Row, minRow)
			maxRow = Math.max(mergeCell.Row+mergeCell.Rows.Count-1, maxRow)
			colObjs.push(mergeCell.Column+"&"+comments(c).Text)
		}
	}

	colObjs.sort(function(a,b){return a.split("&")[0]-b.split("&")[0]})
	//构建表头XML(数据项/时间/列类型/排序类型/对齐方式/列格式/只读)
	for(var c=0;c<colObjs.length; c++) {
		var colArr = colObjs[c].split("&")
		var cols = colArr[1].split("/")
		var colCell = xmlDoc.createElement("column")
		colCell.setAttribute("width",(activeSheet.Columns(colArr[0]-0).ColumnWidth/0.1188).toFixed(2))
		colCell.setAttribute("id",cols[0])
		colCell.setAttribute("sj",cols[1])
		if(cols[2].indexOf("DIV")>-1) {
			cols[2] = cols[2].replace("DIV","/");
		}
		colCell.setAttribute("type",cols[2])
		colCell.setAttribute("sort",cols[3])
		colCell.setAttribute("align",cols[4])
		if(cols[5]!="")  colCell.setAttribute("format",cols[5])
		if( colArr[0]-0 != activeSheet.Cells(minRow,colArr[0]-0).MergeArea.Column) {
			colCell.text = "#cspan"
		}
		else {
			colCell.text = activeSheet.Cells(minRow,colArr[0]-0).MergeArea.Cells(1,1).Value 
		}
		//判断是否下拉选择start
		try {
			var valid = activeSheet.Cells(maxRow-0+1, colArr[0]-0).Validation
			if(valid.Type==3) {
				colCell.setAttribute("type", "coro")
				var opCells = activeSheet.Range(valid.Formula1.substring(1)).Cells
				for(var l=1; l<=opCells.Count; l++) {
					var opt = xmlDoc.createElement("option")
					opt.setAttribute("value",opCells(l).Value);
					opt.text = opCells(l).Value
					colCell.appendChild(opt)
				}
			}
		}
		catch(ex) {}
		//判断是否下拉选择end
		hr.appendChild(colCell);
	}
	
	var initNode = xmlDoc.createElement("afterInit")
	hr.appendChild(initNode);
	//多行表头
	if(maxRow>minRow) {
		for(var r=minRow+1; r<=maxRow; r++) {
			var callNode = xmlDoc.createElement("call")
			callNode.setAttribute("command","attachHeader")
			initNode.appendChild(callNode);
			var paramNode = xmlDoc.createElement("param")
			callNode.appendChild(paramNode);
			var colArr = new Array()
			for(var c=0; c<colObjs.length; c++) {
				var cola = colObjs[c].split("&")
				var ma = activeSheet.Cells(r,cola[0]-0).MergeArea
				if(cola[0]!=ma.Column) {
					colArr.push("#cspan")
				}
				else if(r==ma.row) {
					colArr.push(ma.Cells(1,1).Value)
				}
				else {
					colArr.push("#rspan")
				}
			}
			paramNode.text = colArr.join(",")
		}
	}
	//开始单元格
	var begancell = String.fromCharCode(64+parseInt(colObjs[0].split("&")[0]))+""+parseInt(maxRow+2)	
	//过滤行表头end
	updateFileIdFun(xmlDoc, begancell);
}

//更新模板表中的模板ID字段；
function updateFileIdFun(xmlDoc, begancell){
	var updateSql = "update SGPRJ_TEMPLET_CONFIG set templet_header=TRIM('" + xmlDoc.xml + "'),templet_begancell='"+begancell+"',templet_file='"+param.fileId+"' where templet_sn='" + param.id + "'";
	db2Json.execute(updateSql);
}

//-->
</SCRIPT>

<SCRIPT language="JavaScript" for="TANGER_OCX1" event="OnCustomMenuCmd2(menuPos, submenuPos, subsubmenuPos, menuCaption, myMenuID)">
switch(submenuPos) {
	case 1:
		if(xlsOcx.ActiveDocument && xlsOcx.ActiveDocument.ActiveSheet) {
			var cell
			var cellcommit = "" ;
			//Excel
			if(xlsOcx.docType =="2"){
				cell = xlsOcx.ActiveDocument.Application.Selection.Areas(1).Cells(1);				
				if(cell.Comment) {
					cellcommit = cell.Comment.text() ;
				}
			} 
			//Wps电子表格
			if(xlsOcx.docType =="7"){
				cell = xlsOcx.ActiveDocument.Application.Selection
				if(cell.Commented) {
					var adress = cell.Address;
					if(adress.split(":").length ==2){
						adress = adress.split(":")[0]
					}
					cellcommit= xlsOcx.ActiveDocument.Application.Range(adress).Comment.Text
				}
			}
			
			var param = new Object();
			param.xlsOcx = xlsOcx ;
			param.value = cellcommit ;
			param.templet_type = templet_type ;
			window.showModalDialog("<%=basePath%>jsp/xgrid/colList.jsp", param, "dialogWidth:345px;dialogHeight:300px;center:yes;resizable:no;Minimize=yes;Maximize=yes")
		}
		break;
}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX1" event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		var businessid = "xgridExcel-" + param.id;
		xlsOcx.CancelLastCommand = true
		var rtn = xlsOcx.SaveToURL(MAIN_SERVLET+"?ac=upload","filename","fileid="+param.fileId+"&businessid="+businessid,"newexcel.xls",0)
		var rtnObj = Ext.decode(rtn)
		param.fileId = rtnObj.msg[0].fileid;
		var xml = getGridXml();
		alert("保存完毕")
	}
</SCRIPT>
