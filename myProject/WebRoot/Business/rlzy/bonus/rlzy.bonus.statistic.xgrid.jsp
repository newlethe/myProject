<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
 <head>
 	 <base href="<%=basePath%>">
	<title>奖金统计</title> 
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar_skins.css"></link>
	<link rel="stylesheet" type="text/css" href="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxmenu_dhx_blue.css">
    <!--XGRID-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcommon.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgrid.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxgridcell.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxtreegrid.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_math.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxdataprocessor.js"></script><!--记录编辑-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_filter.js"></script><!--一般过滤-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxtreegrid_filter.js"></script><!--树过滤-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_srnd.js"></script><!--异步加载-->
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_selection.js"></script><!--区域选择-->
	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_splt.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/excells/dhtmlxgrid_excell_dhxcalendar.js "></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.js "></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxmenu.js "></script>
	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXProtobar.js"></script>
    <script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar.js"></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar_cp.js"></script>
	
	<script type='text/javascript' src="Business\rlzy\xgridMange.js"></script>
		
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/rlzyMgm.js'></script>
	  <script type='text/javascript' src='dwr/interface/xgridCommon.js'></script>
	
	
<%
String depts=request.getParameter("unitIds")==null?null:request.getParameter("unitIds");
String startSj=request.getParameter("startSj")==null?null:request.getParameter("startSj");
String endSj=request.getParameter("endSj")==null?null:request.getParameter("endSj");
String users=request.getParameter("userIds")==null?null:request.getParameter("userIds");
String m_uids=request.getParameter("m_uids")==null?null:request.getParameter("m_uids");
 %>
 </head>
 <body>
	<div id="gridbox" width="100%" height="100%"></div>
 </body>
<script type="text/javascript">
var mygrid = new dhtmlXGridObject('gridbox');
	mygrid.setImagePath(basePath + "dhtmlxGridCommon/dhtmlxgrid/codebase/imgs/");
	mygrid.setSkin("xp");
	var myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableMathEditing(true);
	mygrid.setEditable(false);
	
	
	function cellEditHandle(stage,rId,cInd,nValue,oValue){//设置单元格编辑事件
		//stage - stage of editing (0-before start[can be canceled if returns false],1- the editor is opened,2- the editor is closed);
		//rId - id of the row;
		//cInd - index of the cell;
		//nValue - new value (only for the stage 2);
		//oValue - old value (only for the stage 2).
		//var dt = rId.split("`")[1]
		var celllabel = mygrid.getColumnId(cInd) ;
		var cellType = mygrid.getColType(cInd);
	
		var cellValue = mygrid.cells(rId,cInd).getValue();
		if ( mygrid.hasChildren(rId) && cellType != "edtxt" ){
			return false;
		}
		
		if(stage==0){
			if(cellType=="math" && (cellValue=="" ||cellValue=="0")){
				mygrid.cells(rId,cInd).setValue("")
			}
		}else{
			if(stage == 2){
				if(mygrid.cells(rId,cInd).wasChanged()){
					setParentNodeUpdated(rId);
				}
				if(cellType=="math" || cellType=="edn"){
					if(!isNaN(nValue)){		
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}else {
				return true;
			}
		}
	}
	
	//如果此行编辑了，设置此行的父节点也是变更状态；
	function setParentNodeUpdated(rowId) {
		var parentId = mygrid.getParentId(rowId);
		if ( parentId ){
		myDataProcessor.setUpdated(parentId, true);
					setParentNodeUpdated(parentId);
		}
		
	}
	
	
	
	loadHeader();
	doReload();
	function doReload() {
		mygrid.clearAll();
		var startSj =<%=startSj%>;
		var endSj =<%=endSj%>;
		var depts ='<%=depts%>';
		var users =<%=users%>;  
		var m_uids='<%=m_uids%>';
		//alert(m_uids);
		rlzyMgm.getBonusStatXml(startSj, endSj, depts, users,m_uids, function(dataXml){
			mygrid.loadXMLString(dataXml);
		}); 

	}
	
	function loadHeader(){
	rlzyMgm.getBonusStatXml(null, null, null, null,null, function(dataXml){
			mygrid.loadXMLString(dataXml);
		}); 
	}
	
	function exportExcel(){
		saveToPOIExcel(mygrid, '奖金统计');
		
	}
	

</script>
</html>