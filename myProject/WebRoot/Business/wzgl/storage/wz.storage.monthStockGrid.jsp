<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>月结算Grid</title>

  </head>
  
  <body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto>
 	 <div id="dbnetgrid1" style="behavior:url('/dbnetgrid/htc/dbnetgrid.htc');"></div>
  </body>
</html>

<script type="text/javascript">
window.onload = initialise

var sj_var=""
function initialise() {
	with (document.all.dbnetgrid1) {
		var data = selectData("select max(tabname) tabname from WZ_STOCK_TAB")
		fromPart = data.tabname
		sj_var=data.tabname
		dateFormat = "y-m-d"
		primaryKeyColumn = "BM"
		orderColumn = "BM"

		selectPart = ["BM","PM","GG","DW","JHDJ","CKH","FLBM","STAGE","STCOUNT","STCOUNT*JHDJ","INCOUNT","INCOUNT*JHDJ","OUTCOUNT","OUTCOUNT*JHDJ","EDCOUNT","EDCOUNT*JHDJ"]
		headings = ["编码","品名","规格","单位","计划单价","仓库","FLBM","工程期","期初数量","期初金额","收入数量","收入金额","支出数量","支出金额","期末数量","期末金额"]
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart){
			setColumnProperty(selectPart[c],"textAlign:center")
			setColumnProperty(selectPart[c],"noWrap:true")
		}

		copy = "false"
		help = "false"
		print = "true"
		save = "true"
		sort = "true"
		search = "true"
		insertRow = "false"
		deleteRow = "false"
		updateRow = "false"
		
		setColumnProperty("STCOUNT","decimalPlaces:3")
		setColumnProperty("STCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("INCOUNT","decimalPlaces:3")
		setColumnProperty("INCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("OUTCOUNT","decimalPlaces:3")
		setColumnProperty("OUTCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("EDCOUNT","decimalPlaces:3")
		setColumnProperty("EDCOUNT*JHDJ","decimalPlaces:2")
		
		setColumnProperty("FLBM","display:none")
		setColumnProperty("BM","transform:transBM")
		setColumnProperty("PM","width:100")
		setColumnProperty("GG","width:120")
		setColumnLookup("CKH","CKH","CKMC","WZ_CKH")
		
		integration = "true"
		rowDblClick = "false"
		displayToolbar = "false"
		filter = "false"
		editSections = [ [" ",1,"98%"] ]
		editSectionsFields = [ [""] ]
		
		
		loadData()
	}
}

function filterGrid(sj,ckh){
	if(sj==""){
		sj=sj_var
	}
	with (document.all.dbnetgrid1) {
		fromPart = sj
		selectPart = ["BM","PM","GG","DW","JHDJ","CKH","FLBM","STAGE","STCOUNT","STCOUNT*JHDJ","INCOUNT","INCOUNT*JHDJ","OUTCOUNT","OUTCOUNT*JHDJ","EDCOUNT","EDCOUNT*JHDJ"]
		headings = ["编码","品名","规格","单位","计划单价","仓库","FLBM","工程期","期初数量","期初金额","收入数量","收入金额","支出数量","支出金额","期末数量","期末金额"]

		if(ckh!="") {
			fixedFilterPart = "CKH='" + ckh + "'"
		}
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart){
			setColumnProperty(selectPart[c],"noWrap:true")
		}

		copy = "false"
		help = "false"
		print = "true"
		save = "true"
		sort = "true"
		search = "true"
		insertRow = "false"
		deleteRow = "false"
		updateRow = "false"
		
		setColumnProperty("STCOUNT","decimalPlaces:3")
		setColumnProperty("STCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("INCOUNT","decimalPlaces:3")
		setColumnProperty("INCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("OUTCOUNT","decimalPlaces:3")
		setColumnProperty("OUTCOUNT*JHDJ","decimalPlaces:2")
		setColumnProperty("EDCOUNT","decimalPlaces:3")
		setColumnProperty("EDCOUNT*JHDJ","decimalPlaces:2")
		
		setColumnProperty("FLBM","display:none")
		setColumnProperty("PM","width:100")
		setColumnProperty("GG","width:120")
		setColumnLookup("CKH","CKH","CKMC","WZ_CKH")
		
		loadData()
	}
}

</script>


