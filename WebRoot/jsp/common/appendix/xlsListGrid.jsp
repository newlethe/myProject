<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="com.sgepit.frame.base.Constant" %>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String userid = (String)session.getAttribute(Constant.USERID);
	String unitID = (String)session.getAttribute(Constant.USERUNITID);
%>
<html>
	<head>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title></title>
		<style>	
			tr.dbnetgrid { white-space: nowrap; text-align: center; }
		</style>
		<script type="text/javascript" src="<%=basePath%>jsp/common/util.js"></script>
		<script language="javascript" src="<%=basePath%>jsp/common/common.js"></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto><div id=debug></div>
		<div id="dbnetgrid1" style="behavior:url(/dbnetgrid/htc/dbnetgrid.htc);"></div>
	</body>
</html>

<script>
var userid = '<%=userid%>'
var unitID = '<%=unitID%>'

window.onload = init
function init() {
	with (document.all.dbnetgrid1) {
		fromPart = "sgcc_plan_appendix"
		primaryKeyColumn = "appendixid"
		orderColumn = "sj_type"
		orderSequence = "desc"

		selectPart = ["sj_type","appendix_type","file_lsh"]
		headings = ["年度","附表类型","excel报表"]
		
		editFields = ["appendixid","unit_id","file_type","appendix_type","sj_type"]
		editLabels = ["主键","单位","附表所属","附表类型","年度"]
		
		editSections = [[" ",20,"98%"]]
		editSectionsFields = [["appendixid","file_type","appendix_type","unit_id","sj_type"]]
			
		dataOnlyColumns = ["file_lsh","file_name","unit_id","sj_type","file_type","appendixid"]
		
		setColumnProperty("file_lsh","transform:transUpload")	

		setColumnLookup("unit_id","unitid","unitname","sgcc_ini_unit")
		setColumnLookup("appendix_type","property_code","property_name","property_code",true,"type_name='附表类型'")
		
		setEditColumnProperty("file_type","initialValue:0")
		setEditColumnProperty("unit_id","initialValue:" +unitID)
		setEditColumnProperty("sj_type","lookup:select val , val || '年' txt  from (select distinct sj_type val from  prj_plan where record_state = '1' union select to_char(to_char(sysdate,'yyyy') + 1) val from dual) order by val")
		setEditColumnProperty("appendix_type","lookup:select property_code,property_name from property_code where type_name = '附表类型'")
	
		setEditColumnProperty("appendix_type","required:true")
		setEditColumnProperty("appendixid","display:none")
		setEditColumnProperty("file_type","display:none")
		setEditColumnProperty("unit_id","display:none")
		deleteValidation = 'checkDelete'

		pageSize=15
		updateRow = true
		editRowInitialisation = "rowInit1" 
		
		
		
		loadData()
	}
	masterGrid = document.all.dbnetgrid1
}
function checkDelete(grid)
{
	var sql = "delete from app_blob where fileid1='" + grid.currentRow.file_lsh + "'";
	 if (grid.selectData(sql))
	 {   
	 	sql="delete from app_fileinfo where fileid1  = '" + grid.currentRow.file_lsh + "'";
	 	if(grid.selectData(sql))
	 	{
	 		return true
	 	} else{
	 		return false
	 	}	  
	 } else
	 {
	 	return false
	}
	
}
function rowInit1(editControl){

	if (editControl.mode == "insert")
	{
		editControl.inputControl('appendixid').value = getSN()
		
	}	
	
}


function transUpload(cell) {
	var row = cell.parentElement
	var vl  = cell.innerText
	if (vl != ""){
		cell.innerHTML ="<a href='javascript: viewTemplate()' title='浏览'>"+row.file_name+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript: uploadTemplate(true)' title='重新上传'>上传</a>"
		
	} else {
		cell.innerHTML = "<a href='javascript: uploadTemplate(false)' title='上传'>上传</a>"
	}
}

function uploadTemplate(flag){
	parent.uploadTemplate(flag)
}


function viewTemplate(){
	parent.viewTemplate()
	
}


function openExcel( obj ) {
	var row = obj.parentElement.parentElement
	row.fileType =row.file_type
	window.showModelessDialog("xlsSheet.jsp", row, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes")
}

function ftype(cell) {
	var row = cell.parentElement
	if(cell.innerText==0)
		cell.innerHTML = "本单位编制"
	else
		cell.innerHTML = "下属单位上报"
		
}
</script>