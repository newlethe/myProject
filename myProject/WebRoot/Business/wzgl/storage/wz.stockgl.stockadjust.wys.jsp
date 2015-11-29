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
		fromPart = "WZ_INPUT"

		orderColumn = "BH"
		editRow = "false"
		copy = "false"
		help = "false"
		print = "false"
		save = "false"
		search = "false"
		sort = "true"
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart) {
			setColumnProperty(selectPart[c],"noWrap:true")
		}
		
		selectPart = ["BH","GHDW","SQSL","DW"]
		headings = ["验收单号","供货厂商","待验收数量","单位"]

		setColumnProperty("SQSL","decimalPlaces:3")
		
		setColumnLookup("GHDW","DWBM","DWMC","unit_info")
		
		integration = "true"
		rowDblClick = "false"
		displayToolbar = "false"
		filter = "false"
		//addRowIndex = "true"
		editSections = [ [" ",1,"98%"] ]
		editSectionsFields = [ [""] ]
		
		fixedFilterPart = "1=0"
		loadData()
	}
}
</script>