//web virture path
var ContextPath = "http://" + location.hostname + ":" + location.port
var sgccPath = "/frame"
var cellPath = "/cell"
var gridPath = "/dbnetgrid"
var editPath = "/dbnetedit"

/*
	如果/sgcc不是在根目录下面，需要拼凑根目录路径
*/
if(window.location.pathname.indexOf("/frame") > 0 ){
	var pathName = window.location.pathname
	var preName = pathName.substr(0,pathName.indexOf("/frame"))
	if(pathName.substr(0,1) != "/"){
		preName = "/" + preName 
	}
	sgccPath = preName + sgccPath
	cellPath = preName + cellPath
	gridPath = preName + gridPath
	editPath = preName + editPath
}

function Application() {
	this.sgccPath = sgccPath;
}
var _app = new Application();

//web http host uri
function getReqURL() {
	/*var url
	var str = window.location.href
	if (str.indexOf("//") > -1) {
		var tmp1 = str.substring(0, str.indexOf("//")+2)
		var tmp2 = str.substr(str.indexOf("//")+2)
		if (tmp2.indexOf("/") > -1) {
			tmp2 = tmp2.substring(0, tmp2.indexOf("/"))
			url = tmp1 + tmp2
		} else {
			url = tmp1 + tmp2
		}
	} else {
		if (str.indexOf("/") > -1) {
			var tmp1 = str.substring(0, str.indexOf("/"))
			url = tmp1
		} else {
			url = str
		}
	}
	return url*/
	var url = window.location.protocol + "//" + window.location.hostname + ":" +window.location.port
	if (window.location.pathname.indexOf("/frame") > 0) {
		var pathName = window.location.pathname
		var preName = pathName.substr(0,pathName.indexOf("/frame"))
		if(pathName.substr(0,1) != "/"){
			preName = "/" + preName 
		}
		url =window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + preName	
	}
	return url
}

var dbnetgridUrl = "/dbnetgrid/htc/dbnetgrid.htc";
var dbneteditUrl = "/dbnetedit/dbnetedit.htc";
//var localurl=getReqURL()
var cellUrl = "/cell/control/cell.htc"

function grid_init() {
	//dbnetgridUrl = localurl + dbnetgridUrl;
	//dbneteditUrl = localurl + dbneteditUrl;
	dbnetgridUrl = getReqURL() + dbnetgridUrl;
	dbneteditUrl = getReqURL() + dbneteditUrl;
	var grid = document.getElementsByTagName("DIV");
    for(var i=0;i<grid.length;i++)
    {
        if (grid(i).id != "undefined")
        {
            if (grid(i).id.substr(0,9)=='dbnetgrid')
            {
                grid(i).addBehavior(dbnetgridUrl);
            }
            if (grid(i).id.substr(0,9)=='dbnetedit')
            {
                grid(i).addBehavior(dbneteditUrl);
            }
        }
    }
}
function grid_init_old() {
	//dbnetgridUrl = localurl + "/dbnetgrid/htc/dbnetgrid1.htc";
	//dbneteditUrl = localurl + dbneteditUrl;
	dbnetgridUrl = getReqURL() + dbnetgridUrl;
	dbneteditUrl = getReqURL() + dbneteditUrl;
	var grid = document.getElementsByTagName("DIV");
    for(var i=0;i<grid.length;i++)
    {
        if (grid(i).id != "undefined")
        {
            if (grid(i).id.substr(0,9)=='dbnetgrid')
            {
                grid(i).addBehavior(dbnetgridUrl);
            }
            if (grid(i).id.substr(0,9)=='dbnetedit')
            {
                grid(i).addBehavior(dbneteditUrl);
            }
        }
    }
}
//hhl新增，for 华中门户集成
function cell_init() {
	var cell = document.getElementsByTagName("DIV");
    for(var i=0;i<cell.length;i++)
    {
        if (cell(i).id != "undefined")
        {
            if (cell(i).id.substr(0,9)=='dbnetcell')
            {
                cell(i).addBehavior(getReqURL() + cellUrl);
            }
        }
    }
}

//BLOB 
//as_where  dbnetgrid dbnetedit 
//type 'ftp' to ftp server; 'blob' to blob column
function of_electric_file(adbnetgrid,as_colfilelsh,as_write,as_compressed,as_colfilename,as_where, type)
{
	if (type == undefined || type == null) {
          		type = 'blob'
          		as_compressed = '0'
          	}
          	if (type == 'ftp') {
          		type = 'blob'
          		as_compressed = '0'
          	}
	  var f = "dialogHeight: 80px; dialogWidth:350px; status:no";
	  var url
	  var editcontrol
	  var colfilelsh
      if (as_where=='dbnetgrid')
         {
            editcontrol=adbnetgrid.editControl
         }else 
       {
            editcontrol=adbnetgrid
       }  
	  if (as_write>"0")
	  {
		  colfilelsh=editcontrol.inputControl(as_colfilelsh.toUpperCase()).value
          if (as_write=='1')
          {
	          var data = adbnetgrid.selectData("select trim(substr(to_char(systimestamp,'yyyymmddhh24missff'),1,17)) as id from dual")  
			  colfilelsh=data.id
	       }
              var params = 'colfilelsh='+colfilelsh+'&write='+as_write+'&compressed='+as_compressed+'&filelsh='+as_colfilelsh+'&filename='+ as_colfilename+'&type='+type;

	          var obj=window.showModalDialog(sgccPath+'/app/bfile/uploadFile.htm',params,'dialogHeight:180px;help=no;status=no')

	          if(obj != null && obj != "")
	            {
                  if (as_colfilename.length>0) {
                	  editcontrol.inputControl(as_colfilename.toUpperCase()).value= obj
                  }
	              editcontrol.inputControl(as_colfilelsh.toUpperCase()).value= colfilelsh
	              if(as_where=='dbnetgrid') 
	              {
	                editcontrol.apply() 
	              }else{
	                editcontrol.applyChanges()
	             }	
		      }         
     } else if (as_write=="0")
     {   
         var pk='';
       	 if (as_where=='dbnetgrid')
       	 {
          }  
         else 
            pk=editcontrol.inputControl(as_colfilelsh.toUpperCase()).value
	     window.open(sgccPath+"/file/attach.do?pk="+pk,'_parent','toolbars=no,top=100,left=100,dialogHide=yes')
     }
  
}

function of_electric_file_read(as_bh)
{
   window.open(sgccPath+"/file/attach.do?pk="+as_bh,'_parent','toolbars=no,top=100,left=100,dialogHide=yes')
}

function of_electric_file_delete(as_bh)
{
    var url=sgccPath+"/file/attach.do?pk="+as_bh+"&type=2";
    of_electric_file_core(url)
}

function of_electric_file_core(url)
{
	var xmlHttp=null
	try {
    	xmlHttp=new ActiveXObject("Msxml2.XMLHTTP")
	} catch(e) {
    	try {
        	xmlHttp=new ActiveXObject("Microsoft.XMLHTTP")
	    } catch(oc) {
    	    xmlHttp=null
	    }
	}
	if (!xmlHttp && typeof XMLHttpRequest!="undefined") {
    	xmlHttp = new XMLHttpRequest()
	}
    xmlHttp.Open( "POST", url, false )
    xmlHttp.Send()
}

function of_doc_on_edit(docid)
{
	var width = screen.width
	var height = screen.height
	window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?pk="+docid,null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
}

function of_doc_on_edit_withsetting(docid, str)
{
	var width = screen.width
	var height = screen.height
	window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?pk="+docid,str,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
}
function of_doc_on_edit_new(ftype)
{
	var width = screen.width
	var height = screen.height
	var filelsh
	if (ftype == undefined || ftype == '' || ftype == 'word') {
		filelsh=window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?operate=1",null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
	} else if (ftype == 'excel') {
		filelsh=window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?ftype=excel&operate=1",null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
	}
	return filelsh
	
}
function of_doc_on_edit_new_temp(templetid)
{
	var width = screen.width
	var height = screen.height
	var filelsh=window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?operate=2&templetid="+templetid,null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
	return filelsh
}

function of_doc_on_edit_read(docid)
{
	var width = screen.width
	var height = screen.height
	window.showModalDialog(sgccPath+"/app/bfile/docOnLineEdit.jsp?operate=-1&pk="+docid,null,'dialogWidth:' + width + 'px;dialogHeight:' + height + 'px;status=no;help=no;')
}

function privilege_control(write)
{
	if (write=='0')
	{  
	  readonly_control()
	}
}

function readonly_control()
{
    var aReturn= window.document.body.getElementsByTagName("INPUT");
	for (i = 0; i < aReturn.length; i++) 
	{
		aReturn[i].disabled =true;
	}
	var xReturn=window.document.body.getElementsByTagName("DIV");
	
		//alert(xReturn.length);
		
	for (i = 0; i < xReturn.length; i++) 
	{
      var grid=xReturn[i];

     	//alert(grid.id)
	  if (grid.id != "undefined")
	  {
		  if (grid.id.substr(0,9)=='dbnetedit') 
		  {
		
		  		grid.apply = "false"
				grid.insert = "false"
				grid.deleteRow = "false"
				grid.cancel = "false"

		  }
		  if (grid.id.substr(0,9)=='dbnetgrid') 
		  {
		  	grid.editRow=false;
		  }
	  }
	}
	
}
function treeFrameRefresh()
{
	var html = window.parent.frames(0).location.href
	window.parent.frames(0).location.href = html
}

function clicktreeleaf() {
  if ((window.event.srcElement.tagName =="A" ))
   {
      //??????????
      var aReturn=document.getElementsByTagName("TD") 
      for (i = 0; i < aReturn.length; i++) {
	     var atd=aReturn[i];
	     if (atd.className=="tis")
	       {  atd.className="ti" }
	  }
      //????td???   class?tis 
     window.event.srcElement.parentElement.className="tis";
   
     }
}

		
//与grid集成的模式，打开报表的方法
//@url		cell.jsp及参数
//@gridId	grid的id
//@param	参数初始值
//@historyURL	可选参数，打开历史记录选择框的地址
//使用属性值grid.editRow即grid是否可编辑来判断报表是否只读
function openReportInGrid(url, gridId, param)
{
	var features = "dialogHeight:640;dialogWidth:480;"
	features += "dialogLeft:0;dialogTop:0;"
	features += "center:yes;dialogHide:yes;"
	features += "resizable:no;"
	features += "scroll:no;"
	features += "status:no;"
	var historyURL = ""
	if (arguments.length==4)
		historyURL = arguments[3]
	
	var obj = event.srcElement
	var oldValue = obj.lsh
	while (obj.tagName != "TR")
	{
		obj = obj.parentElement
	}
	url += "&historyURL=" + historyURL
	var grid = eval("document.all." + gridId)
	var args = new Object()
	args.rq = obj.cells[ grid.columnIndex(param.toLowerCase()) ].innerText
	if (eval(grid.editRow))
	{
		var cellWin = showModalDialog(url+"&readOnly=no", args, features);
		if (typeof(cellWin) != "undefined" && oldValue != cellWin)
		{
			var sql = "update " + grid.fromPart + " set AFFIX_CONTENT = '" + cellWin + "' "
			var where = "where " + grid.primaryKeyColumn + " = '" + obj.id + "'"
			grid.selectData(sql + where)
			grid.loadData();
		}
	}
	else
	{
		var cellWin = showModalDialog(url+"&readOnly=yes", args, features);
	}
}

//单独打开报表的方法
//@code			报表对应的fun_list.code
//@report_no	报表编号
//@obj			报表参数组成的结构化对象Object，打开Cell窗口时作为参数传递进来
//例：initValue.rq = '2006-07-12', 表示报表参数rq, 初始值 '2006-07-12'
//@lsh			报表历史数据对应的流水号
//@readOnly		可选参数，权限控制，readOnly='1'readOnly='yes'为只读
//@historyURL		可选参数，打开历史记录选择框的地址
function openReportAlone(code, report_no, obj, lsh)
{
	var features = "dialogHeight:640;dialogWidth:480;"
	features += "dialogLeft:0;dialogTop:0;"
	features += "center:yes;dialogHide:yes;"
	features += "resizable:no;"
	features += "scroll:no;"
	features += "status:no;"
	
	var readOnly = "no"
	if (arguments.length==5)
		readOnly = arguments[4]
	var historyURL = ""
	if (arguments.length==6)
		historyURL = arguments[5]
	
	
	var url = cellPath + "/cell.jsp?code=" + code + "&report_no=" + report_no + "&lsh=" + lsh + "&readOnly=" + readOnly + "&historyURL=" + historyURL
	var rtn = showModalDialog(url, obj, features);
	if (rtn != null && typeof(rtn) != "undefined" && rtn!="undefined" && rtn.length==17)
	{
		return rtn
	}
	else
	{
		return lsh
	}
}
//选择系统报告的模版（funcode ,部门编号）
function of_select_template(funcode,deptid)
{
	var sFeatures;
	  sFeatures = "dialogHeight:450px;dialogWidth:670px;";
	  sFeatures = sFeatures + "center:yes;edge:raised;help:no;scroll:no;status:no;unadorned:yes;resizable:no";
	  var url = sgccPath + "/jsp/document/SelectTemplate.jsp?funCode=" + funcode + "&deptId=" + deptid + "&now=" + new Date().getTime();
	 //返回templateId,fileLsh,templateName
  	  var sReturn = window.showModalDialog(url,null,sFeatures);
  	  return sReturn
}

//生成报告(模版大对象流水号，模版编号，单位ID,年度，月份或季度（可以为null）),生成方式（field:域合并；replace:简单替换）
function of_create_report(a_iframe,modelid,templateid,unitId,year,month,replaceType)
{
	
	if (templateid == "")
	{
		alert("请选择模版！")
		return 
	}
	if (year == "")
	{
		alert("请选择报告时间！")
		return 
	}
	if (month.length == 1)
	{
		month = "0" + month;
	}	
	if(replaceType == null || replaceType=="")
	{
		//简单替换
		replaceType="replace"
	}

	var parm = "ftype=word&operate=2&templetid="+ templateid + "&unitid=" + unitId +"&year=" + year + "&month=" + month
			+"&modelid=" + modelid + "&replaceType=" +replaceType
	a_iframe.style.display = ""
	a_iframe.src =sgccPath + "/app/bfile/docOnLineEdit_replace.jsp?" + parm
}

//按模板合并报告
//
function of_create_report_join(existDocid,a_iframe,modelid,templateid,unitId,year,month,replaceType)
{
	
	if (templateid == "")
	{
		alert("请选择模版！")
		return 
	}
	if (year == "")
	{
		alert("请选择报告时间！")
		return 
	}
	if (month.length == 1)
	{
		month = "0" + month;
	}	
	if(replaceType == null || replaceType=="")
	{
		//简单替换
		replaceType="replace"
	}
	var parm = "existDocid="+existDocid+"&ftype=word&operate=2&templetid="+ templateid + "&unitid=" + unitId +"&year=" + year + "&month=" + month
			+"&modelid=" + modelid + "&replaceType=" +replaceType
	a_iframe.style.display = ""
	a_iframe.src =sgccPath + "/app/bfile/docOnLine_join.jsp?" + parm
	//var ret = window.showModalDialog("/sgcc/app/bfile/docOnLine_join.jsp?"+parm,null,'dialogWidth:' + screen.availWidth + 'px;dialogHeight:' + screen.availHeight + 'px;status=no;help=no;')
	//return ret
}
function getSN() {
	var date = new Date()
	var s = date.getYear()
		+ (date.getMonth()+101+"").substring(1)
		+ (date.getDate()+100+"").substring(1)
		+ (date.getHours()+100+"").substring(1)
		+ (date.getMinutes()+100+"").substring(1)
		+ (date.getSeconds()+100+"").substring(1)
		+ (date.getMilliseconds()+1000+"").substring(1)
		+ (Math.random()*1000+1000).toFixed(0).substring(1)
	return s
}
function isHaveModel(model_type,unitid,sj_type,grid){
	try{
		var sql = "select RESPORT_NO from SGCC_GUIDELINE_MODEL_MASTER where MODEL_TYPE='"+model_type+"'"
			  + " and DEPT_ID='" + unitid + "' and SJLX<='" + sj_type + "' "
			  + "and RESPORT_NO is not null order by SJLX desc"
		var dat = eval('document.all.' + grid + '.selectData("'+sql+'",null,true)')
		if(dat.length>0)
			return true
		else
			return false	
	}catch(e){
		return false
	}
}
///////////////////////////////////////////////////////
//cell报表必填检测
function check(param){
	var flag = true
	if(dbnetgrid1.currentRow){
		if(document.getElementById("dbnetcell0")==null){
			var dbcell =  document.createElement("div");
			dbcell.id = "dbnetcell0"
			dbcell.style.display = "none"	
			document.body.appendChild(dbcell)
		}
		if(document.getElementById("CellWeb1")==null){
			var obj = document.createElement("OBJECT");
			obj.id="CellWeb1";
			obj.codeBase="control/CellWeb5.CAB#version=5,3,8,0122";
			obj.classid="clsid:3F166327-8030-4881-8BD2-EA25350E574A";
			document.getElementById("dbnetcell0").appendChild(obj)
		}
		var p_corp = param.p_corp?param.p_corp:""
		var s = p_corp.split("/")
		
		DWREngine.setAsync(false);   
		cellBean.getCellCtx( param.p_type, s[s.length-1],param.p_date, function(ctx) {
			CellWeb1.ReadFromBase64Str(ctx);
			cellCheckXML.checkCell(CellWeb1.SaveToXML(""), param.p_type, s[s.length-1], 
				param.p_date, s[0],function(dat){
				if(dat!="OK"){
					flag = false
					if(confirm("共"+dat+"项数据未填报，不能发送，是否打开报表？")){
						openValidateCell(param)
					}
				}
			})
		})	
		DWREngine.setAsync(true);   
	}else{
		alert("没有选择相关数据，无法进行流程发送")
		flag =  false
	}
	return flag
}
function openValidateCell(param){
	param.onCellOpened = onValidateCellOpened
	window.showModalDialog(sgccPath+"/cell/eReport.jsp", param , "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
	
}

function onValidateCellOpened(CellWeb1,win) {
    CellWeb1.CalculateAll()//加载cell页面时会重新计算全表公式
    CellWeb1.CalculateAll()//加载cell页面时会重新计算全表公式
    try{
		dbnetgrid1.selectRow()
	}catch(e){}
	var row = dbnetgrid1.currentRow
	//参数说明：cellToXML/报表类型/报表使用单位/时间/报表数据使用单位
	cellCheckXML.markCell(CellWeb1.SaveToXML(""),win.p_type, win.p_dept, win.p_date, win.p_corp,
		function(xml){
			CellWeb1.ShowCellTip  = true
			CellWeb1.CalculateAll()
			var xmlDoc = new ActiveXObject('Microsoft.XMLDOM')
			xmlDoc.setProperty("SelectionLanguage", "XPath")
			xmlDoc.async = false
			xmlDoc.loadXML(xml)
			var sheet = 0;//定位有填报完整的sheet页面
			var color = CellWeb1.FindColorIndex(2552550,1)
			for(var i=CellWeb1.GetTotalSheets()-1;i>=0;i--){
				var wsNode = xmlDoc.selectSingleNode("/Workbook/Worksheet[@Name='" + CellWeb1.GetSheetLabel(i) + "']")
				if(wsNode!=null){
					var cNodes = wsNode.childNodes
					for(var j=0;j<cNodes.length;j++){
						var col = parseInt(cNodes[j].getAttribute("colIndex"))
						var row = parseInt(cNodes[j].getAttribute("rowIndex"))
						if(CellWeb1.GetCellString(col,row,i)==""){
							CellWeb1.SetCellTip(col,row,i,'必填项')
							CellWeb1.SetCellBackColor(col,row,i,color)
						}
					}
					sheet = i
				}
			}
			CellWeb1.SetCurSheet(sheet)
		}
	)
    
}
/////////////////////////////////////////////
//////////////////////////////////////////////