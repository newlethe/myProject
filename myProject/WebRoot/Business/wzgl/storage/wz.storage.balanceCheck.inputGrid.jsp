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
function initialise(bm,StartDate) {
	with (document.all.dbnetgrid1) {
		fromPart = "WZ_INPUT"
		selectPart = ["BH","BILLNAME","QRRQ","BM","PM","GG","DW","SL"]
		headings = ["编号","单据名称","确认日期","编码","品名","规格","单位","数量"]
		
		pageSize = 10
		
		setHeadingProperty("textAlign:center")
		for (c in selectPart){
			setColumnProperty(selectPart[c],"noWrap:true")
			setColumnProperty(selectPart[c],"textAlign:center")
		}
		updateRow = "false"
		insertRow = "false"
		deleteRow = "false"
		
		integration = "true"
		displayToolbar = "false"
		filter = "false"
		addRowIndex = "true"
		rowDblClick = "false"
		editSections = [ [" ",1,"98%"] ]
		editSectionsFields = [ [""] ]
		
		fixedFilterPart = "BM='"+bm+"' and (bill_state='Y' or bill_state='S') and (QRRQ>=to_date('"+StartDate+"','YYYY-MM-DD')+1)"
		
		loadData()
	}
}


</script>


