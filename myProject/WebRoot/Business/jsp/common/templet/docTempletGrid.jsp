<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.sgepit.frame.base.Constant;"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String unitID = (String)session.getAttribute(Constant.USERUNITID);
%>
<html>
	<head>
		<base href="<%=basePath%>">
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<title></title>
		<style>	
			tr.dbnetgrid { white-space: nowrap; text-align: center; }
		</style>
		<script type="text/javascript" src="Business/jsp/common/util.js"></script>
	</head>
	<body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto><div id=debug></div>
		<div id="dbnetgrid1" style="behavior:url(/dbnetgrid/htc/dbnetgrid.htc);"></div>
	</body>
</html>
<script>
window.onload = init
var unitID = "<%=unitID%>"
function init() {
	with (document.all.dbnetgrid1) {
		fromPart = "SGCC_ANALYSE_REPORT_TEMPLATE"
		primaryKeyColumn = "TEMPLATE_ID"
		orderColumn = "FUN_CODE,TEMPLATE_DATE desc"
		dateFormat = "y-m-d h:mi"
		
		selectPart = ["FUN_CODE","TEMPLATE_NAME","NVL(DEPT_ID,UNITID)","TEMPLATE_DATE","(0)"]
		headings = ["所属模块","模板名称","使用部门","创建时间","查看"]
		
		editFields = ["TEMPLATE_ID","UNITID","FUN_CODE","TEMPLATE_NAME","SHAREFLAG","DEPT_ID"]
		editLabels = ["ID","单位ID","所属模块","模板名称","共享","使用部门"]

		dataOnlyColumns = ["file_lsh","template_name"]
		
		setHeadingProperty("textAlign:center");
		setColumnProperty("(0)","textAlign:center")
		setColumnProperty("(0)","transform:transLink")
		setColumnLookup("NVL(DEPT_ID,UNITID)","UNITID","UNITNAME","SGCC_INI_UNIT")
		setColumnLookup("FUN_CODE","property_code","property_name","property_code")
		
		setEditColumnProperty("TEMPLATE_ID","display:none")
		setEditColumnProperty("UNITID","display:none")
		setEditColumnProperty("UNITID","initialValue:" + unitID)
		setEditColumnProperty("FUN_CODE","lookup:select property_code,property_name from property_code where type_name='DOC_TYPE'  order by item_id")
		setEditColumnProperty("SHAREFLAG","initialValue:1")
		setEditColumnProperty("SHAREFLAG","display:none")
		setEditColumnProperty("DEPT_ID","lookup:select unitid,unitname from sgcc_ini_unit where upunit='" + unitID + "'")
		
		addRowIndex = true
		//rowDblClick = false
		editRowInitialisation = "editInit"
		
		fixedFilterPart = "UNITID='" + unitID + "'"
		
		editSections = [ ["",6,"100%"] ]
		editSectionsFields = [ ["TEMPLATE_ID","UNITID","TEMPLATE_NAME","FUN_CODE","SHAREFLAG","DEPT_ID"] ]
		loadData()
	}
}

function editInit(editControl) {
	if(editControl.mode=="insert") {
		editControl.inputControl("TEMPLATE_ID").value = getSN()
	}
}

function transLink(cell) {
	var row = cell.parentElement
	cell.innerHTML = "<u onclick=openDoc(this)>查看</u>"
}

function openDoc(obj) {
	var row = obj.parentElement.parentElement
	var param = new Object()
	param.file_id = row.file_lsh
	param.templet_id = row.id
	param.template_name = row.cells(2).innerText
	var b = window.showModalDialog( "<%=path%>/Business/jsp/common/templet/docEdit.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
	if(b) {
		document.all.dbnetgrid1.loadData()
	}
}

function openDoc1(obj) {
	var row = obj.parentElement.parentElement
	var param = new Object()
	param.file_id = row.file_lsh
	param.date = '201001'
	param.templet_id = row.id
	window.showModalDialog( "<%=path%>/Business/jsp/common/templet/docView.jsp", param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;" )
}
</script>