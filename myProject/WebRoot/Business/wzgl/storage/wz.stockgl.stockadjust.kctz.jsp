<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>库存调整Grid</title>

  </head>
  
  <body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto>
 	 <div id="dbnetgrid1" style="behavior:url('/dbnetgrid/htc/dbnetgrid.htc');"></div>
  </body>
</html>

<script>
window.onload = loadDataGrid;
function loadDataGrid(bm) {
	with (document.all.dbnetgrid1) {
		fromPart = "view_wz_stocks"
		orderColumn = "BM"
		//editRow = "false"
		updateRow = "false"
		insertRow = "false"
		deleteRow = "false"
		
		copy = "false"
		help = "false"
		print = "false"
		save = "false"
		search = "true"
		sort = "false"
		
		pageSize = 15
		
		selectPart = ["BM","PM","GG","DW","SL","(SL-FTSL+FFSL+SQSL)","FTSL","FFSL","(FTSL-FFSL)","SQSL"]
		headings = ["编码","品名","规格","单位","实际库存","可用库存","分摊数量","已领数量","未领数量","未入库数量"]
		
		dataOnlyColumns = ["bm"]

		searchFields = ["BM","PM"]
		searchLabels = ["编码","品名"]

		setHeadingProperty("textAlign:center")
		for (c in selectPart) {
			setColumnProperty(selectPart[c],"noWrap:true")
		}
		setColumnProperty("DW","textAlign:center")
		setColumnProperty("BM","transform:transBM")
		setColumnProperty("SL","decimalPlaces:3")
		setColumnProperty("(SL-FTSL+FFSL+SQSL)","decimalPlaces:3")
		setColumnProperty("FTSL","decimalPlaces:3")
		setColumnProperty("FFSL","decimalPlaces:3")
		setColumnProperty("(FTSL-FFSL)","decimalPlaces:3")
		setColumnProperty("SQSL","decimalPlaces:3")
		
		onRowSelected = gridRowSelected
		if(bm){
			fixedFilterPart = "FLBM like '" + bm + "%'"
		}
		
		integration = "true"
		rowDblClick = "false"
		displayToolbar = "false"
		filter = "false"
		//addRowIndex = "true"
		editSections = [ [" ",1,"98%"] ]
		editSectionsFields = [ [""] ]
		
		loadData()
	}
}

function gridRowSelected() {
	var grid1 = document.all.dbnetgrid1
	var row = grid1.currentRow
	var bm = row.bm
	var gridA = parent.window.frames["content2"].document.all.dbnetgrid1
	var gridB = parent.window.frames["content3"].document.all.dbnetgrid1
	gridA.fixedFilterPart = "WZ_CJSXB.BM='"+bm+"' and nvl(WZ_CJSXB.FTSL,0)>nvl(WZ_CJSXB.FFSL,0) and WZ_CJSPB.bill_state='1' and WZ_CJSXB.ISVALID='1'"
	gridB.fixedFilterPart = "BM='"+bm+"' and BILL_STATE='N'"
	gridA.loadData()
	gridB.loadData()
}
</script>
