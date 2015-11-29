<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>平衡检查库存物资Grid</title>

  </head>
  
  <body topmargin=0 leftmargin=0 rightmargin=0 scroll=auto>
 	 <div id="dbnetgrid1" style="behavior:url('/dbnetgrid/htc/dbnetgrid.htc');"></div>
  </body>
</html>

<script type="text/javascript">
window.onload = initialise
function initialise() {
	with (document.all.dbnetgrid1) {
		var data = selectData("select max(tabname) tabname,to_char(max(edtime),'YYYY-MM-DD') edtime from WZ_STOCK_TAB")
		var dt = data.tabname.substring(8)
		StartDate = data.edtime
		var tab1 = data.tabname
		var tab2 = "(select bm,sum(sl) insl from WZ_INPUT where (bill_state='Y' or bill_state='S') and (QRRQ>=to_date('"+StartDate+"','YYYY-MM-DD')+1) group by bm)"
		var tab3 = "(select bm,sum(sl) outsl from WZ_OUTPUT where (bill_state='Y' or bill_state='S') and (QRRQ>=to_date('"+StartDate+"','YYYY-MM-DD')+1) group by bm)"
		
		primaryKeyColumn = "WZ_BM.BM"
		orderColumn = "BM"
		
		fromPart = "WZ_BM,"+tab1+" tab1,"+tab2+" tab2,"+tab3+" tab3"
		joinPart = "WZ_BM.BM=tab1.BM(+) and WZ_BM.BM=tab2.BM(+) and WZ_BM.BM=tab3.BM(+)"
		
		pageSize = 10
		
		selectPart = ["WZ_BM.BM","WZ_BM.PM","WZ_BM.GG","WZ_BM.DW","WZ_BM.CKH","nvl(tab1.EDCOUNT,0)","nvl(tab2.insl,0)","nvl(tab3.outsl,0)","nvl(tab1.EDCOUNT,0)+nvl(tab2.insl,0)-nvl(tab3.outsl,0)","nvl(WZ_BM.sl,0)","nvl(WZ_BM.sl,0)-(nvl(tab1.EDCOUNT,0)+nvl(tab2.insl,0)-nvl(tab3.outsl,0))"]
		headings = ["编码","品名","规格","单位","仓库",dt+"期末数量","收入数量","支出数量","期末数量","库存数量","<font color=red>差额</font>"]
		
		editFields = ["WZ_BM.BM","WZ_BM.PM","WZ_BM.GG","WZ_BM.DW","WZ_BM.CKH","WZ_BM.SL"]
		editLabels = ["编码","品名","规格","单位","仓库","库存数量"]
		
		fixedFilterPart = "nvl(WZ_BM.sl,0)-(nvl(tab1.EDCOUNT,0)+nvl(tab2.insl,0)-nvl(tab3.outsl,0))<>0"
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart) {
			setColumnProperty(selectPart[c],"noWrap:true")
			setColumnProperty(selectPart[c],"textAlign:center")
		}
		
		setColumnProperty("WZ_BM.BM","transform:transBM")
		setColumnLookup("WZ_BM.CKH","CKH","CKMC","WZ_CKH")
		setEditColumnProperty("WZ_BM.CKH","lookup:select CKH,CKMC from WZ_CKH order by CKH")
		setEditColumnProperty("WZ_BM.BM","editReadOnly:true")
		setEditColumnProperty("WZ_BM.PM","editReadOnly:true")
		setEditColumnProperty("WZ_BM.GG","editReadOnly:true")
		setEditColumnProperty("WZ_BM.DW","editReadOnly:true")
		setEditColumnProperty("WZ_BM.CKH","editReadOnly:true")
		setEditColumnProperty("WZ_BM.CKH","required:true")
		
		
		integration = "true"
		displayToolbar = "false"
		filter = "false"
		addRowIndex = "true"
		editSections = [ [" ",3,"98%"] ]
		editSectionsFields = [ ["WZ_BM.BM","WZ_BM.PM","WZ_BM.GG","WZ_BM.DW","WZ_BM.CKH","WZ_BM.SL"] ]
		
		onRowSelected = filterSonGrid;
		
		loadData()
	}
}

function filterSonGrid(){
	try{
		document.all.dbnetgrid1.selectRow();
	}catch(e){}
	
	var currentRow = document.all.dbnetgrid1.currentRow;
	parent.frames["content2"].initialise(currentRow.id,StartDate);
	parent.frames["content3"].initialise(currentRow.id,StartDate);
}
</script>


