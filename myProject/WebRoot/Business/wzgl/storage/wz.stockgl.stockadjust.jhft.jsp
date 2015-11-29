<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>计划分摊领用数量Grid</title>

  </head>
  
  <body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto>
 	 <div id="dbnetgrid1" style="behavior:url('/dbnetgrid/htc/dbnetgrid.htc');"></div>
  </body>
</html>
<script>
window.onload = init;
function init() {
	with (document.all.dbnetgrid1) {
		fromPart = "WZ_CJSPB,WZ_CJSXB"
		joinPart = "WZ_CJSPB.BH=WZ_CJSXB.BH"
		
		orderColumn = "WZ_CJSXB.BH"
		editRow = "false"
		copy = "false"
		help = "false"
		print = "false"
		save = "false"
		search = "false"
		sort = "true"
		
		selectPart = ["WZ_CJSPB.STAGE","WZ_CJSXB.BH","WZ_CJSPB.BMMC","WZ_CJSXB.BM","WZ_CJSXB.SL","WZ_CJSXB.FTSL","WZ_CJSXB.FFSL","(0)","WZ_CJSXB.ISVALID"]
		headings = ["工程期","申请计划","部门","编码","审批数量","分摊数量","已领用数量","","是否有效"]

		dataOnlyColumns = ["WZ_CJSXB.bm"]
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart) {
			setColumnProperty(selectPart[c],"noWrap:true")
		}
		
		setColumnProperty("WZ_CJSXB.SL","decimalPlaces:3")
		setColumnProperty("WZ_CJSXB.FTSL","decimalPlaces:3")
		setColumnProperty("WZ_CJSXB.FFSL","decimalPlaces:3")
		setColumnProperty("WZ_CJSXB.BM","transform:transBM")
		setColumnProperty("WZ_CJSXB.ISVALID","transform:transCheck")
		setColumnProperty("WZ_CJSXB.ISVALID","textAlign:center")
		setColumnLookup("WZ_CJSPB.BMMC","groupid","notes","group_list")
		//setColumnProperty("(0)","transform:transBtn")
		setColumnProperty("(0)","modify:<button onclick='editNum(this)' class='pageBtn'>修改</button>")
		
		integration = "true"
		rowDblClick = "false"
		displayToolbar = "false"
		filter = "false"
		addRowIndex = "true"
		editSections = [ [" ",1,"98%"] ]
		editSectionsFields = [ [""] ]
		
		fixedFilterPart = "1=0"
		loadData()
	}
}
function transCheck(cell) {
	var grid1 = document.all.dbnetgrid1
	var row = cell.parentElement
	var pk = row.id+ "-" + row.bm
	cell.innerHTML = "<input value='"+ pk +"' type='checkbox' onclick='disableApply(this)' checked>"
}

function disableApply(obj) {
	var grid1 = document.all.dbnetgrid1
	if(confirm("是否确定不再执行该物资申请计划！")) {
		alert(obj.value)
		grid1.selectData("update wz_cjsxb set ISVALID='0' where bh||'-'||bm='"+obj.value+"'")
		//alert("update wz_cjsxb set ISVALID='0' where bh||'-'||bm='"+obj.value+"'")
		grid1.loadData()
	}
}

function editNum(obj) {
	var grid1 = document.all.dbnetgrid1
	var row = obj.parentElement.parentElement
	if(obj.innerText == '修改') {
		obj.innerText = '保存'
		row.cells[grid1.columnIndex('WZ_CJSXB.FTSL')].innerHTML = "<input style='border:0;text-align:right;width:60' name='num' value='"+row.cells[grid1.columnIndex('WZ_CJSXB.FTSL')].innerText+"'>"
	}
	else {
		var n = row.all.num.value
		var bh = row.cells[grid1.columnIndex('WZ_CJSXB.BH')].innerText
		var bm = row.bm
		//alert()
		grid1.selectData("update WZ_CJSXB set FTSL='" + n + "' where bh='" + bh + "' and bm='" + bm + "'")
		grid1.loadData()
	}
}	
</script>