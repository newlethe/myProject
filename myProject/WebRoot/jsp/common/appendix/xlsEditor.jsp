<%@ page language="java" pageEncoding="utf-8"%>
<!-- @author:guox  -->

<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title>报表</title>
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<script type='text/javascript' src='<%=path%>/dwr/engine.js'></script>
		<script type='text/javascript' src='<%=path%>/dwr/interface/xlsUtil.js'></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=no>
		<!-- 自动激活控件 -->	
		<object id="TANGER_OCX1" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
				codebase="<%=Constant.NTKOCAB%>" width="100%" height="100%">
				<param name="Menubar" value="-1">
				<param name="Titlebar" value="0">
				<param name="IsShowToolMenu" value="-1">
				<param name="IsHiddenOpenURL" value="0">
				<param name="IsUseUTF8URL" value="-1">
				<%=Constant.NTKOCOPYRIGHT%>
				<SPAN STYLE="color:red"><br>不能自动装载文档控件，进行安装请在检查浏览器的选项中检查浏览器的安全设置。
					<br>
					<a href="<%=basePath%>jsp/setup.exe">请手动下载安装控件软件</a>
				</SPAN>
		</object>
		<object id="TANGER_OCX2" classid="clsid:C9BC4DFF-4248-4a3c-8A49-63A7D317F404"
				codebase="<%=Constant.NTKOCAB%>" width="0" height="0" >
				<param name="Menubar" value="-1">
				<param name="Titlebar" value="0">
				<param name="IsShowToolMenu" value="-1">
				<param name="IsHiddenOpenURL" value="0">
				<param name="IsUseUTF8URL" value="-1">
				<%=Constant.NTKOCOPYRIGHT%>
		</object>
		<IFRAME ID="loadingFrm" style="POSITION:absolute;LEFT:0px;TOP:0px;WIDTH:100%;HEIGHT:100%;"
				src="loading.html" 
				frameBorder="0" scrolling="no"></IFRAME>
				
	</body>
</html>

<script type="text/javascript">
var param = window.dialogArguments
window.onload = init
window.onbeforeunload = closeWin

var xlsName = ""
var sheetStr = ""
var templetID = ""
var loadingImg

function init() {
	try{
		loadingImg = window.frames["loadingFrm"].frameElement
		xlsOcx = document.all('TANGER_OCX1')
		tmpOcx = document.all('TANGER_OCX2')
		loadingImg.style.display = ""	

		xlsOcx.FileSave = param.savable
		//查找今年的模板
		DWREngine.setAsync(false);			
		xlsUtil.xlsTemplateType( param.sj_type, param.unit_id,param.templateType ,function(tmpID){
			if(tmpID!="") {
				templetID = tmpID
				//添加菜单
		
				xlsOcx.AddCustomMenu2(1, "附表菜单(A)")
				xlsOcx.AddCustomMenuItem2(1, 1, -1, false, "  全表校验(W)        ", false)
				xlsOcx.AddCustomMenuItem2(1, 2, -1, false, "  单表校验(S)        ", false)
				xlsOcx.AddCustomMenuItem2(1, 3, -1, false, "  清除全表校验信息(C)        ", false)
				xlsOcx.AddCustomMenuItem2(1, 4, -1, false, "  清除单表校验信息(F)        ", false)
				xlsOcx.AddCustomMenuItem2(1, 5, -1, false, "  重新读取模版(T)        ", false)
				tmpOcx.OpenFromURL(MAIN_SERVLET + "?ac=downloadFile&fileid="+tmpID)
			}
			if(param.file_lsh && param.file_lsh!="") {	
				xlsOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&fileid="+param.file_lsh)
				loadingImg.style.display = "none"
			}else if(tmpID!="") {
				if(confirm("还未填写报表，是否打开模板填报？")) {
					xlsOcx.OpenFromURL(MAIN_SERVLET + "?ac=downloadFile&fileid="+templetID)
					loadingImg.style.display = "none"
				}
				else {

					loadingImg.style.display = "none"
				}
			}else {
				alert("未定义填报的模板")	
				loadingImg.style.display = "none"
			}
		})
		DWREngine.setAsync(true);	
	}  catch (e){
	
		loadingImg.style.display = "none"	
	}
}

function closeWin() {
	try{
		xlsOcx.Activate(false)
		if( param.savable && xlsOcx.ActiveDocument && !xlsOcx.ActiveDocument.Saved && confirm("是否保存对文件的更改？")) {
			saveXls()
			//return true
		}
	} catch (e){
		
	}
	
}

//判断附表密码保护是否存在
function isSheetProtect() {
	var flag = true
	tmpOcx.focus()
	if(!tmpOcx.ActiveDocument) {
		tmpOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&fid="+templetID)
	}
	var worksheets
	var sheets = new Array()
	worksheets = tmpOcx.ActiveDocument.Worksheets
	for(var s=1;s<=worksheets.count;s++) {
		var comments = worksheets(s).Comments
		if(comments.Count>0) {
			sheets.push(worksheets(s).Name)
		}
	}
	xlsOcx.focus()
	worksheets = xlsOcx.ActiveDocument.Worksheets
	for(var s=0;s<sheets.length;s++) {
		if( worksheets(sheets[s]) && worksheets(sheets[s]).ProtectContents==true 
			&& worksheets(sheets[s]).Protection.AllowInsertingColumns==false && worksheets(sheets[s]).Protection.AllowDeletingColumns==false
			&& worksheets(sheets[s]).Protection.AllowInsertingRows==true && worksheets(sheets[s]).Protection.AllowDeletingRows==true ) {
			
		}
		else {
			flag = false
		}
	}
	return flag
}

function getSheetMap(sheetName) {
	var map = new Object()
	tmpOcx.focus()
	if(!tmpOcx.ActiveDocument) {
		tmpOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&fid="+templetID)
	}
	var worksheet = tmpOcx.ActiveDocument.Worksheets(sheetName)
	var comments = worksheet.Comments
	for(var i=1;i<=comments.count;i++) {
		if(comments(i).Text() == "locked") {
			var cell = comments(i).Parent
			map[sheetName + "/" + cell.Row+ "/" + cell.Column] = cell.Value
		}
	}
	return map
}

function getWorkbookMap() {
	var map = new Object()
	tmpOcx.focus()
	if(!tmpOcx.ActiveDocument) {
		tmpOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&fid="+templetID)
	}
	var worksheets = tmpOcx.ActiveDocument.Worksheets
	for(var s=1;s<=worksheets.count;s++) {
		var worksheet = tmpOcx.ActiveDocument.Worksheets(s)
		if(sheetStr!="" && sheetStr.indexOf("/"+worksheet.Name+"*")==-1) continue
		var comments = worksheet.Comments
		for(var i=1;i<=comments.count;i++) {
			if(comments(i).Text() == "locked") {
				var cell = comments(i).Parent
				map[worksheet.Name + "/" + cell.Row+ "/" + cell.Column] = cell.Value
			}
		}
	}
	return map
}

function test( map ) {
	xlsOcx.focus()
	var flag = ""
	var err = new Object()
	for(var c in map) {
		var s = c.split("/")
		try {
			var cell = xlsOcx.ActiveDocument.Worksheets(s[0]).Cells(s[1]-0,s[2]-0)
			if(cell.Value != map[c]) {
				err[s[0]] = "校验失败"
				cell.Font.Strikethrough = true
				cell.Font.ColorIndex = 3
				if(cell.Comment) {
					cell.Comment.text(map[c])
				}
				else {
					cell.AddComment(map[c])
				}
			}
		}
		catch(ex) {
			err[s[0]] = "缺失"
		}
	}
	for(var s in err) {
		flag += "\"" + s + "\"" + err[s] + ";"
	}
	xlsOcx.Activate(true)
	return flag
}

function clearStrike(sheetName) {
	var comments = xlsOcx.ActiveDocument.Worksheets(sheetName).Comments
	for(var c=1; c<=comments.count; c++) {
		var col = comments(c).Parent.Column
		var row = comments(c).Parent.Row
		var val = comments(c).Parent.Value
		var cell = xlsOcx.ActiveDocument.Worksheets(sheetName).Cells( row, col )
		if(cell.Font.Strikethrough == true) {
			cell.Font.Strikethrough = false
			cell.Font.ColorIndex = 1
			//cell.Comment.Delete()
		}
	}
	xlsOcx.ActiveDocument.Worksheets(sheetName).Cells.ClearComments()
}

function clearAllStrike() {
	var worksheets = xlsOcx.ActiveDocument.Worksheets
	for(var s=1;s<=worksheets.count;s++) {
		var comments = worksheets(s).Comments
		for(var c=1; c<=comments.count; c++) {
			var col = comments(c).Parent.Column
			var row = comments(c).Parent.Row
			var val = comments(c).Parent.Value
			var cell = worksheets(s).Cells( row, col )
			if(cell.Font.Strikethrough == true) {
				cell.Font.Strikethrough = false
				cell.Font.ColorIndex = 1
				//cell.Comment.Delete()
			}
		}
		worksheets(s).Cells.ClearComments()
	}
}

function copySheet(str) {
	var array = str.split("/")
	for(var i=1;i<array.length;i++) {
		var s = array[i].split("*")
		var sheetLock = false
		tmpOcx.focus()
		var tmpSheet = tmpOcx.ActiveDocument.Sheets(s[0])
		if(tmpSheet.ProtectContents) {
			sheetLock = true
			tmpSheet.Unprotect("sgerprddss")
		}
		if(s[1]=="") {
			xlsOcx.focus()
			xlsOcx.ActiveDocument.Sheets(s[0]).UsedRange.Copy()
			tmpOcx.focus()
			tmpSheet.Select()
			//tmpSheet.UsedRange.Select()速度慢、废弃
			tmpSheet.Paste(tmpSheet.UsedRange)
			//tmpOcx.ActiveDocument.Sheets(s[0]).Cells.PasteSpecial(-4163)
			tmpSheet.Range("A1").Select()
		}
		else if(s[1]!="0"){
			var rows = s[1].split(",")
			for(var r=0;r<rows.length;r++) {
				xlsOcx.focus()
				xlsOcx.ActiveDocument.Sheets(s[0]).Range(rows[r]).Copy()
				tmpOcx.focus()
				tmpSheet.Select()
				//tmpSheet.Range(rows[r]).Select()速度慢、废弃
				tmpSheet.Paste(tmpSheet.Range(rows[r]))
				tmpSheet.Range("A1").Select()
			}
		}
		if(sheetLock) {
			tmpSheet.Protect("sgerprddss",false,true,true,   true,true,true,true,   false,true,true,false,   true,true,true,true )
		}
	}
}

function showSheet(str) {
	//alert(str)
	if(str=="") {
		alert("未定义附表！")
	}
	else {
		var worksheets = xlsOcx.ActiveDocument.Worksheets
		var firstSheet
		for(var s=1;s<=worksheets.count;s++) {
			if(str.indexOf("/" + worksheets(s).Name + "*")>-1) {
				worksheets(s).Visible = true
				
				if(!firstSheet) {
					firstSheet = worksheets(s)
				}
			}
			else {
				worksheets(s).Visible = false
			}
		}
		firstSheet.Select()
		var array = str.split("/")
		for(var i=1;i<array.length;i++) {
			var s = array[i].split("*")
			if(s[1]!="") {
				worksheets(s[0]).Cells.Font.ColorIndex = 15
				if(s[1]!="0") {
					worksheets(s[0]).Range(s[1]).Font.ColorIndex = 1
				}
			}
		}
		xlsOcx.ActiveDocument.Saved = true
	}
}

//提交数据
function save(xlsObj) {
	try{
		var xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
		var xmlRoot = xmlDoc.createElement("Workbook")
		xmlDoc.appendChild(xmlRoot)	
		xlsObj.focus()
		var wbData= ""
		var worksheets = xlsObj.ActiveDocument.Worksheets
		for(var s=1;s<=worksheets.count;s++) {
			var worksheet = worksheets(s)
			var usedRange = worksheet.UsedRange
			worksheet.Unprotect("sgerprddss")
			
			var cell = usedRange.find("TAB:")
			if(cell) {
				var xmlTable = xmlDoc.createElement("worksheet")
				xmlTable.setAttribute("sheetName", worksheet.Name)
				xmlTable.setAttribute("tabName", cell.Value.substring(4))
				xmlTable.setAttribute("sheetType",cell.Value.substring(0,4))
				xmlTable.setAttribute("templateType", param.templateType)
				
				xmlRoot.appendChild(xmlTable)		
				var maxCol = usedRange.Columns(usedRange.Columns.Count).Column
				if(maxCol>52) maxCol = 52
				var maxRow = usedRange.Rows(usedRange.Rows.Count).Row
				var minCol = usedRange.Columns(1).Column
				
		
				var cellCol = cell.Column - minCol
				
				var minRow = cell.Row
				var rangeStr = String.fromCharCode(minCol+64) + "" + minRow + ":" 
				//alert(worksheet.Name + "-" + cell.Value.substring(4))
				rangeStr += (maxCol<26?String.fromCharCode(maxCol+64):"A"+String.fromCharCode(maxCol-26+64)) + "" + maxRow	
				//alert(rangeStr)		
				//取消隐藏//excel cpoy不包含隐藏单元格
				var hideCols = new Array()
				var hideRows = new Array()
				var columns = worksheet.Columns
				var rows = worksheet.Rows
				for( var c=minCol; c<=maxCol; c++ ) {
					if(columns(c).Hidden == true) {
						hideCols.push(columns(c))
					}
				}
				for( var r=minRow; r<=maxRow; r++ ) {
					if(rows(r).Hidden == true) {
						hideRows.push(rows(r))
					}
				}
				rows.Hidden = false
				columns.Hidden = false
				//复制数据
				var copyRange = worksheet.Range(rangeStr)
				//替换回车符
				if(copyRange.Find("\r")) {
					copyRange.Replace("\r","")
				}
				//替换指标符
				if(copyRange.Find("\t")) {
					copyRange.Replace("\t","")
				}
				//复制数据
				copyRange.Copy()
				var sheetData = window.clipboardData.getData("text")
				//恢复隐藏
				for( var c=0; c<hideCols.length; c++ ) {
					//columns(hideCols[c]).Hidden = true
					hideCols[c].Hidden = true
				}
				for( var r=0; r<hideRows.length; r++ ) {
					//rows(hideRows[r]).Hidden = true
					hideRows[r].Hidden = true
				}
				
				//worksheet.Range("A1").Select()
				//\r \ n 换行符  \ t 制表符
				var rows = sheetData.split("\r\n")
				var cols = rows[0].split("\t")
				var xmlCol = xmlDoc.createElement("Column")
				xmlTable.appendChild(xmlCol)
				var clist = new Array()
				var colSize = cols.length
				for( var c=0; c<colSize; c++ ) {
					if(cols[c]=="" || cols[c].indexOf(":")==-1) continue
					var xmlData = xmlDoc.createElement("Data")
					xmlData.setAttribute("Value", (c==cellCol?"INX:PROJECT_NAME":cols[c]) )
					xmlCol.appendChild(xmlData)
					clist.push(c)
				}
				for( var r=1; r<rows.length-1; r++ ) {
					var dats = rows[r].split("\t")
					if(!dats[cellCol] || dats[cellCol]=="") continue
					var xmlRow = xmlDoc.createElement("Row")
					xmlRow.setAttribute("Index", r+minRow)
					xmlTable.appendChild(xmlRow)
					for( var c=0; c<clist.length; c++ ) {
						var xmlData = xmlDoc.createElement("Data")
						xmlData.setAttribute("Value", dats[clist[c]] )
						//xmlData.setAttribute("Index", clist[c] )
						xmlRow.appendChild(xmlData)
					}
				}
			}		
		}	
		/*expression.Protect(Password, DrawingObjects, Contents, Scenarios, 
		UserInterfaceOnly, AllowFormattingCells, AllowFormattingColumns, 
		AllowFormattingRows, AllowInsertingColumns, AllowInsertingRows, 
		AllowInsertingHyperlinks, AllowDeletingColumns, AllowDeletingRows, 
		AllowSorting, AllowFiltering, AllowUsingPivotTables)*/
		worksheet.Protect("sgerprddss", true, true, true, 
		true, true, true, 
		true, false, true, 
		false, false, false, 
		false, false, false)
		//worksheet.protect("sgerprddss",true,true)
		xlsUtil.saveData( param.sj_type, param.org_id,param.unit_id,param.recordType, xmlDoc.xml, function(sheetName){
			if(sheetName!="") {
				sheetName += "数据提交失败!"
			}
	
			var rtnVal  = xlsObj.SaveToURL(basePath + "xlsUtil?type=upload&pk="+param.reportId+"&fileid="+param.file_lsh+"&colname="+param.colname,"xlsTemplet", "", param.file_name ,"docFrm")
			var rtnVals = rtnVal.split("`");
			var fileid = rtnVals[1];
			if(rtnVals[0]!="false") {
				alert(sheetName+" 文件保存成功！")
				param.file_lsh = fileid
				if(param.colname=="file_lsh"){	
					param.win.reloadGrid();		
					if(param.win.curFileLsh!= null && param.win.curFileLsh==""){
						param.win.curFileLsh=fileid
						
					}
				} else{
					if(param.win.curFileLsh1!= null && param.win.curFileLsh1==""){
						param.win.curFileLsh1=fileid
					}
				}
				
				
	
				xlsOcx.ActiveDocument.Saved = true
			}
			else {
				alert("网络中断,请稍候再传！")
			}
			if(xlsObj==tmpOcx) {
				tmpOcx.close()
			}
			xlsOcx.focus()
			xlsOcx.Activate(true)
			loadingImg.style.display = "none"
		})
	}
	catch(e){
		alert("保存失败！");
	}
}

function copySave() {
	xlsUtil.getXlsID( param.report_id, function(fid){
		if(fid=="") {
			tmpOcx.focus()
			//清除注释
			var sheets = tmpOcx.ActiveDocument.Application.ActiveWorkbook.Worksheets
			for(var s=1; s<=sheets.count; s++) {
				sheets(s).Cells.ClearComments()
			}
			param.file_lsh = ""
		}
		else {
			tmpOcx.OpenFromURL("<%=path%>/xlsUtil?type=download&fid="+fid)
			param.file_lsh = fid
		}
		copySheet(sheetStr)
		save(tmpOcx)
	})
}

function saveXls() {

	loadingImg.style.display = ""
	if(templetID=="" || isSheetProtect()) {
		if(param.dept_id && param.dept_id!="") {
			copySave()
		}
		else {
			save(xlsOcx)
		}
	}
	else{
		var map = getWorkbookMap()
		var str = test(map)
		if(str=="") {
			if(param.dept_id && param.dept_id!="") {
				copySave()
			}
			else {
				save(xlsOcx)
			}
		}
		else {

			loadingImg.style.display = "none"
		}
	}
}

function uploadXls() {
	var h = xlsOcx.SaveToURL("<%=path%>/xlsUtil?type=upload&appid="+param.report_id+"&fileid="+param.file_lsh+"&dt="+param.sj_type+"&corp="+param.unit_id,"xlsTemplet", "", param.file_name ,"docFrm")
	if(h=="false") {
		alert("保存失败！")
	}
	else {
		alert("保存成功！")
		param.file_lsh = h
		xlsOcx.ActiveDocument.Saved = true
	}
}

function reloadTemplet() {
	if(templetID && confirm("重新加载模板将丢失当前数据，是否确定？")) {
		//xlsOcx.OpenFromURL("/xlsUtil?type=download&fid="+templetID)
		xlsOcx.OpenFromURL(MAIN_SERVLET + "?ac=downloadFile&fileid="+templetID)
	}
}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX1" event="OnCustomMenuCmd2(menuPos, submenuPos, subsubmenuPos, menuCaption, myMenuID)">
	switch(submenuPos) {
		case 1:
			var map = getWorkbookMap()
			var str = test(map)
			if(str=="") {
				alert("校验成功！")
			}
			else {
				alert(str)
			}
			break
		case 2:
			var map = getSheetMap(xlsOcx.ActiveDocument.ActiveSheet.Name)
			var str = test(map)
			if(str=="") {
				alert("校验成功！")
			}
			else {
				alert(str)
			}
			break
		case 3:
			clearAllStrike()
			break
		case 4:
			clearStrike(xlsOcx.ActiveDocument.ActiveSheet.Name)
			break
		case 5:
			reloadTemplet()
			break
	}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX1" event="OnFileCommand(cmd,cancel)">
	if(cmd==3) {
		xlsOcx.CancelLastCommand = true
		saveXls()
	}
</SCRIPT>

<SCRIPT language="JScript" for="TANGER_OCX1" event="OnDocumentOpened(file,dispath)">
	if(file.indexOf("xlsUtil")>-1) {
		xlsName = param.file_name
	}
	else {
		xlsName = file
	}
	//清除注释
	var sheets = xlsOcx.ActiveDocument.Application.ActiveWorkbook.Worksheets
	for(var s=1; s<=sheets.count; s++) {
		sheets(s).Cells.ClearComments()
	}
	//如果是部门、则隐藏不相关表页
	if(param.dept_id && param.dept_id!="") {
		xlsUtil.getDeptSheetType(param.sj_type, param.dept_id ,fileType,templetID, function(str) {
			if(str=="") {
				alert("无查看权限")
				window.close()
			}
			else {
				sheetStr = str
				showSheet(str)
			}
		})
	}
	loadingImg.style.display = "none"
	xlsOcx.ActiveDocument.Saved = true
</script>