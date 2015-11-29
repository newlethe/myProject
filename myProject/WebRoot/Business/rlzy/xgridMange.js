/**
 * ǰ̨jsʵ�ֵ�excel����(�ο�excel����ģ��˼·)
 * �ṩsheets--sheet--rang(merge)�Ķ�����ɶ������
 * ��vba����excelʵ��д����
 * �ṩ�򵥶�����ݸ�ʽ�ķ�ʽ
 * v1.0  20090927
 * �˰汾ֻ�ṩ������ݹ��ܣ���ʽ���ƺ���)չ
 */


function convertStringToBoolean(inputString) {
	if(typeof (inputString)=="string") inputString=inputString.toLowerCase();
	switch(inputString) {
		case "1":
		case "true":
		case "yes":
		case "y":
		case 1:
		case true:
			return true;
			break;
		default:return false
	}
};

//�������(�Ӵ�,��б����С)
function font(Bold,Italic,Size)  {
	this.bold = Bold ;
	this.italic = Italic ;
	this.size = Size ;
}

//��ʽ����(��ֱ���뷽ʽ��ˮƽ���뷽ʽ������)
function styles(font)  {
	this.horizontalAlignment = -4108 ; //����
	this.verticalAlignment = -4108 ; //����
	this.font = font ;
	this.setVerticalAlignment = function(data) {
		this.verticalAlignment = data ;
	}
	this.setHorizontalAlignment = function(data) {
		this.horizontalAlignment = data ;
	}
}

//�������(���������������������������������������Ƿ�ϲ���Ԫ��)
function range(beginRowIndex,beginColIndex,endRowIndex,endColIndex,isMerge)  {
	this.beginRowIndex = beginRowIndex ;
	this.beginColIndex = beginColIndex ;
	this.endRowIndex = endRowIndex ;
	this.endColIndex = endColIndex ;
	this.isMerge = convertStringToBoolean(isMerge) ;
	this.text = null ;  //�ö�ά���������ݣ����У�
	this.height = null ;   //��)չ�����Զ������飩
	this.styles = null ;   
	this.borders  = null ;  //��)չ���Զ���
	this.setText = function(data){
		this.text = data ;
	}
	this.setStyles = function(styles){
		this.styles = styles ;
	}
	this.setFonts = function(fonts){
		this.fonts = fonts;
	}
}

//sheetҳ����
function sheet(sheetName,widths)  {
	this.sheetName = sheetName ;
	this.ranges = null ;
	this.widths = widths ;  //�п�����
	this.setRanges = function(data){
		this.ranges = data ;
	}
}

//workbook����
function workBook() {
	this.sheets = null ;
	this.setSheets = function(data){
		this.sheets = data ;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////

/**
 * ����
 * �ɶ�ά�������range����
 */
function arrayToRange(data)  {
	var ranges = new Array() ;
	var usedCellMap = new Object() ;
	var rowlength = data.length ;
	for(var i=0;i<rowlength;i++)  {   //��ѭ��
		var collength = data[i].length
		for(var j=0;j<collength;j++)  {  //��ѭ��
			if(usedCellMap[i+"-"+j]) continue ;
			var cdata = new Array()
			var cvalue = new Array(data[i][j])   
			cdata.push(cvalue) ;   //��ǰ��Ԫ������
			var beganRowIndex = i ;
			var beganColIndex = j ;
			var beganRowSpanIndex = i ;
			var beganColSpanIndex = j ;
			var mergeFlag = false ;
			if(i<rowlength)   {   //�������һ�У�����������
				for(var r=i+1;r<rowlength;r++)  {
					if(data[r][j]=="#rspan") {
						beganRowSpanIndex = r ;
					} else {
						break ;
					}
				}
			}
			if(j<collength)   {  //�������һ�У�����������
				for(var c=j+1;c<collength;c++)  {
					if(data[i][c]=="#cspan") {
						beganColSpanIndex = c ;
					} else {
						break ;
					}
				}
			}
			if(beganRowIndex<beganRowSpanIndex||j<beganColSpanIndex)  {
				mergeFlag = true ;
			}
			var cellRange = new range(i+1,j+1,beganRowSpanIndex+1,beganColSpanIndex+1,mergeFlag) ;
			cellRange.setText(cdata) ;
			for(var m=i;m<=beganRowSpanIndex;m++)  {
				for(var n=j;n<=beganColSpanIndex;n++)   {
					usedCellMap[m+"-"+n] = true ;
				}
			}
			ranges.push(cellRange) ;
		}
	}
	return ranges ;
}

/**
 * ����
 * �����ݲ��֣��޺ϲ���Ԫ�����
 * dataΪ��ά�������
 */
function SimpleArrayToRange(data)  {
	var ranges = new Array() ;
	var maxCollength = -1 ;
	for(var i=0;i<data.length;i++)  {   //��ѭ��
		if(data[i].length > maxCollength) {
			maxCollength = data[i].length
		}
	}
	var cellRange = new range(1,1,data.length,maxCollength,false) ;
	cellRange.setText(data) ;
	ranges.push(cellRange) ;
	return ranges ;
}


/**
 * ����
 * ���sheetҳ����
 * sheetname sheetҳ��ơ�widths������顢data��ݶ���
 */

function getSheetFromData(sheetname,widths,data)  {
	var wbsheet = new sheet(sheetname,widths) ;
	wbsheet.setRanges(arrayToRange(data))
	return wbsheet ;
}

/**
 * ������sheetҳ����
 */
function getSheetFromHeadData(sheetname,widths,header,data)  {
	var wbsheet = new sheet(sheetname,widths) ;
	var rangesH = setStylesToRange(arrayToRange(header))
	var rangesD = setStylesToDataRange(SimpleArrayToRange(data))
	//var rangesD = SimpleArrayToRange(data)
	var rowsHead = 0 ;
	for(var i=0;i<rangesH.length;i++)  {
		if(rangesH[i].endRowIndex>rowsHead) {
			rowsHead = rangesH[i].endRowIndex
		}
	}
	for(var i=0;i<rangesD.length;i++)  {
		var crange = rangesD[i] ;
		crange.beginRowIndex = crange.beginRowIndex+rowsHead ;
		crange.endRowIndex = crange.endRowIndex+rowsHead ;
		rangesH.push(crange) ;
	}
	wbsheet.setRanges(rangesH)
	return wbsheet ;
}

/**
 * ���ͷ����ʽ
 */
function setStylesToRange(ranges)  {
	var rFont = new font(false,false,9) ;
	var rStyles = new styles(rFont) ;
	for(var i=0;i<ranges.length;i++)  {
		var range = ranges[i] ;
		if(i==0){
			var rFont1 = new font(true,false,16) ;
			var rStyles1 = new styles(rFont1) ;
			range.setStyles(rStyles1) ;
		}else{
			range.setStyles(rStyles) ;
		}
		
		
	}
	return ranges ;
}
/**
 * �����ļ���ʽ
 */
function setStylesToDataRange(ranges)  {
	var rFont = new font(false,false,9) ;
	for(var i=0;i<ranges.length;i++)  {
		var range = ranges[i] ;
		range.setFonts(rFont) ;
	}
	return ranges ;
}

/**
 * �ṩ��෽ʽ������
 * ͨ���ά�������excel��ݣ���ά����ֻ���excel�ϵ����
 * sheetname��sheetҳ���,widtds��sheetҳ�п�,data��ά�������
 */
function simpleArrayToExcel(sheetname,widtds,data) {
	var wb = new workBook() ;
	var sheets = new Array() ;
	var wbsheet = getSheetFromData(sheetname,widtds,data) ;
	sheets.push(wbsheet) ;
	wb.setSheets(sheets) ;
	var param = new Object()
	param.workbook = wb
	window.showModelessDialog(basePath+"dhtmlxGridCommon/excel/DataToExcelView.jsp", param , "dialogWidth:"+screen.availWidth+";dialogHeight:"+screen.availHeight+";center:yes;resizable:yes;")	
}

/**
 * ͨ��head��data}�������excel��ݣ�head�������кϲ���Ԫ��ģ�
 * sheetname��sheetҳ���,widtds��sheetҳ�п�,header��ά�����ͷ,data��ά�������
 */

function HeaderArrayToExcel(sheetname,widths,header,data)  {
	var wb = new workBook() ;
	var sheets = new Array() ;
	var wbsheet = getSheetFromHeadData(sheetname,widths,header,data) ;
	sheets.push(wbsheet) ;
	wb.setSheets(sheets) ;
	var param = new Object()
	param.workbook = wb
	window.showModelessDialog(g_path+"/tzjh/plan/excelView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");	
}

/**
 * ��sheetҳ�����ݷ���
 * ͨ�����鴫�ݵ�sheetҳ����
 * sheets �����顢����ǰ����Ϊsheetname,widtds,data
 */
function ArrayToSheetExcel(sheets) {
	var wb = new workBook() ;
	var sheets = new Array() ;
	for(var i=0 ;i<sheets.length;i++)  {
		var wbsheet = getSheetFromData(sheets[0],sheets[1],sheets[2]) ;
		sheets.push(wbsheet) ;
	}
	wb.setSheets(sheets) ;
	var param = new Object()
	param.workbook = wb
	param.file_lsh = "xmjh"
	window.showModelessDialog(g_path+"/tzjh/plan/excelView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");	
}


/**
 * xgridҳ���Ӧ��excel�����
 * url    ģ��url
 * datas  ��ά�������ݼ�
 */
function XgridToSheetExcel(data) {
	var wb = new workBook() ;
	var sheets = new Array() ;
	var wbsheet = new sheet(null,null) ;
	var ranges = new Array() ;
	var maxCollength = -1 ;
	for(var i=0;i<data.length;i++)  {   //��ѭ��
		if(data[i].length > maxCollength) {
			maxCollength = data[i].length
		}
	}
	var rowL = data.length*1+3*1
	var cellRange = new range(4,1,rowL,maxCollength,false) ;
	cellRange.setText(data) ;
	ranges.push(cellRange) ;
	wbsheet.setRanges(ranges)
	sheets.push(wbsheet) ;
	wb.setSheets(sheets) ;
	var param = new Object()
	param.workbook = wb
	param.file_lsh = "xmjh"
	window.showModelessDialog(g_path+"/tzjh/plan/excelView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");	
}

//��ñ�ͷ
function getHeadData(grid) {
	var _headobj = grid.hdr.firstChild ;
	var _clength = grid.getColumnsNum() ;
	//�����ͷ��ά����
	var _head = new Array() ;
	for(var i=0;i<_headobj.childNodes.length-1;i++) {
		var _tmpArray = new Array(_clength)
		_head.push(_tmpArray);
	}
	//��xgridҳ���ȡ��ͷд������
	for(var h=1;h<_headobj.childNodes.length;h++) {  //��һ���������ʽ��Ϣ
		var _childN = _headobj.childNodes[h] ;
		for(var td=0;td<_childN.childNodes.length;td++) {
			var _childNod = _childN.childNodes[td]
			var _nodevalue = _childNod.innerText    //�ڵ�ֵ
			var _att = _childNod.attributes
			var _cellIndex = _att.getNamedItem("_cellIndexS").nodeValue ;
			var _cspan = _att.getNamedItem("colSpan").nodeValue
			var _rspan = _att.getNamedItem("rowSpan").nodeValue
			_head[h-1][_cellIndex] = _nodevalue ; //��ֵд������
			if(_cspan>1) {
				for(var _c=1;_c<_cspan;_c++) {
					_head[h-1][_cellIndex+_c] = "#cspan" ; //�ϲ��е�Ԫ��ʱ
				}
			}
			if(_rspan>1) {
				for(var _r=1;_r<_rspan;_r++) {
					_head[h-1+_r][_cellIndex] = "#rspan" ; //�ϲ��е�Ԫ��ʱ
				}
			}
		}
	}
	return _head ;
}

//���grid����е�ȫ�����
function getGridData(grid)  {
	var rData = new Array() ;
	for (var i = 0; i < grid.rowsBuffer.length; i++)  {
		var cData = new Array() ;
		var rowid = grid.getRowId(i) ;
		var blank = "" ;
		if(grid.isTreeGrid())  {
			for(var b=0;b<grid.getLevel(rowid);b++)  {
				blank += "  " ;
			}
		}
		for(var j=0;j<grid.getColumnsNum();j++)  {
			var cell = null ;
			if(grid.getColType(j)=='coro'||grid.getColType(j)=='co')  {
				cell = grid.cells(rowid,j).getTitle()
			} else if(grid.getColType(j)=='tree'){
				cell = blank+grid.cells(rowid,j).getValue()
			} else{
				cell = grid.cells(rowid,j).getValue()
			}
			cData.push(cell) ;
		}
		rData.push(cData)
	}
	return rData ;
}
//����п�
function getWidthsData(grid)  {
	var widths = new Array() ; 
	for(var i=0;i<grid.cellWidthPX.length;i++)  {
		var width = parseFloat(grid.cellWidthPX[i])*0.1188
		widths.push(width) ;
	}
	return widths ;
}

///////////////////////////////////////////////////////////////////////////////
//����excel(poi)
//�����õ����ʺ�
function saveToPOIExcel(_mygrid,sheetname,fileid) {  
	var grid = _mygrid ;
	var excelXML = new ActiveXObject('Microsoft.XMLDOM');
	excelXML.setProperty("SelectionLanguage", "XPath");
	excelXML.async = false;
	var workbooks = excelXML.createElement("workbooks")   ;
	excelXML.appendChild(workbooks) ;
	var workbook = excelXML.createElement("workbook")   ;
	workbooks.appendChild(workbook) ;
	//sheetҳ
	var sheet = excelXML.createElement("sheet") ;
	//�п?��
	var colwidth = "" ;
	var coltype = "" ;
	var colAlign = "" ;
	for(var i=0;i<grid.cellWidthPX.length;i++)  {
		var width = parseFloat(grid.cellWidthPX[i])*0.1188
		colwidth +=","+ width ;
		if(grid.getColType(i)=="math") {
			coltype +=",number" ;
			colAlign +=",right" ;
		} else if(grid.getColType(i)=="calendar") {
			coltype +=",date" ;
			colAlign +=",center" ;
		} else {
			coltype +=",string" ;
			colAlign +=",left" ;
		}
	}
	sheet.setAttribute("colWidths",colwidth.substring(1,colwidth.length)) ;
	sheet.setAttribute("colTypes",coltype.substring(1,coltype.length)) ;
	sheet.setAttribute("colAlign",colAlign.substring(1,coltype.length)) ;
	if(sheetname!=null) {
		sheet.setAttribute("name",sheetname) ;
	}
	workbook.appendChild(sheet) ;
	var data = getGridData(grid) ;
	var Data = data ;
	if(fileid==null||fileid=="")  {   //û��ģ���ž���Ҫд���ͷ
		//head����
		var headData = getHeadData(grid);
		Data = headData.concat(data) ;
	} else {
		workbook.setAttribute("template",fileid) ;
		sheet.setAttribute("template",0) ;
	}
	
	for(var i=0;i<Data.length;i++)  {
		var Hrow = excelXML.createElement("row")   ;
		for(var j=0;j<Data[i].length;j++)  {
			var Hcell = excelXML.createElement("cell")   ;	
			Hcell.text = Data[i][j] ;
			
			
			Hrow.appendChild(Hcell) ;
		}
		sheet.appendChild(Hrow) ;
	}
	
	xgridCommon.xgridToExcel(excelXML.xml,function(file_lsh){
		if(file_lsh&&file_lsh!="") {
			var param = new Object() ;
			param.file_lsh = file_lsh ;
//
//			alert(BASE_PATH+ "/servlet/MainServlet?ac=downloadFile&fileid="+file_lsh)
//			window.open(BASE_PATH+ "servlet/MainServlet?ac=downloadFile&fileid="+file_lsh);
			window.parent.downloadFile(file_lsh);
	
		
		} else {
			alert("导出失败����ʧ�ܣ�")
		}
	})
}