<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
 <HEAD>
 	 <base href="<%=basePath%>">
	<TITLE>部门其他费用投资计划</TITLE>
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
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlxgrid_drag.js"></script><!--拖拽-->	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/ext/dhtmlx_extdrag.js"></script><!--拖拽额外-->	
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxcalendar.js "></script>
	<script type='text/javascript' src="dhtmlxGridCommon/dhtmlxgrid/codebase/dhtmlxmenu.js "></script>
	
	<script language="JavaScript" src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXProtobar.js"></script>
    <script language="JavaScript" src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar.js"></script>
	<script language="JavaScript" src="dhtmlxGridCommon/dhtmlxgrid/menu/js/dhtmlXMenuBar_cp.js"></script>
	
	
	<script type='text/javascript' src='dwr/engine.js'></script>
	<script type='text/javascript' src='dwr/interface/investmentPlanService.js'></script>
	<script type="text/javascript">
		var businessType = "<%=request.getParameter("businessType")==null?"":request.getParameter("businessType")%>";
		var sjType = "<%=request.getParameter("sjType")==null?"":request.getParameter("sjType")%>";
		var unitId = "<%=request.getParameter("unitId")==null?"":request.getParameter("unitId")%>";
	</script>
 </HEAD>
 <BODY>
	<div id="gridbox" width="100%" height="100%"></div>
 </BODY>
 <script>
	mygrid = new dhtmlXGridObject('gridbox');
	mygrid.setImagePath(basePath + "dhtmlxGridCommon/dhtmlxgrid/codebase/imgs/");
	mygrid.setSkin("xp");
	myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableMathEditing(true);
	
	doReload();
	
	mygrid.attachEvent("onEditCell",cellEditHandle);
	
	function cellEditHandle(stage,rId,cInd,nValue,oValue){//设置单元格编辑事件
		//stage - stage of editing (0-before start[can be canceled if returns false],1- the editor is opened,2- the editor is closed);
		//rId - id of the row;
		//cInd - index of the cell;
		//nValue - new value (only for the stage 2);
		//oValue - old value (only for the stage 2).
		var dt = rId.split("`")[1]
		var celllabel = mygrid.getColumnId(cInd) ;
		var cellType = mygrid.getColType(cInd);
		var cellValue = mygrid.cells(rId,cInd).getValue();
		if(dt=='false' || cellType=="tree" || parent.editable==false){		
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
	function setParentNodeUpdated(thisRowId) {
		var nodeIdArr = thisRowId.split("`");
		var parentBdgId = nodeIdArr[2];
		investmentPlanService.getBdgInfoById(parentBdgId, function(d){
			if(d && d!=null && d!='null') {
				var parentRowId = parentBdgId + "`false`" + d.parent;
				var row = mygrid.getRowById(parentRowId);
				if(row) {
					myDataProcessor.setUpdated(parentRowId, true);
					setParentNodeUpdated(parentRowId);
				}
			}
		});
	}
	
	function saveXgrid(){	
		mygrid.editStop()
		if(myDataProcessor.updatedRows.length<1) {
			return ;
		}
		var dragflag = 0 ;
		var xmlstr='<?xml version="1.0" encoding="GBK"?>';
		xmlstr +='<rows>';
		for(var i=myDataProcessor.updatedRows.length-1;i>=0;i--){
			var colmap = new Object() ;
			var type = "" ;
			var cells = "" ;
			var pkid = myDataProcessor.updatedRows[i];
			if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'deleted'){
				type = 'delete'
			}else{
				if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'inserted') {
					type = 'insert'
				} else {
					type = 'update'
				}
			    for(var j=0;j<mygrid.getColumnsNum();j++) {
					var celllabel = mygrid.getColumnId(j) ;				
					var cellType = mygrid.getColType(j);
					var cellvalue = mygrid.cells2(mygrid.getRowIndex(pkid),j).getValue();
					if(cellType=="dhxCalendar"||cellType=="dhxCalendarA"){
						cells +="<cell id='"+celllabel+"' type='"+cellType+"' dtmask='"+mygrid._dtmask+"'>" ;
					}else{
						cells +="<cell id='"+celllabel+"' type='"+cellType+"'>" ;
					}
					cells +="<![CDATA["+cellvalue+"]]>" ;
					cells +="</cell>" ;
				}
			}
			xmlstr +="<row id='"+pkid+"' type='"+type+"'>"
			xmlstr += cells
			xmlstr +="</row>"
		}
		xmlstr +='</rows>'
		
		investmentPlanService.updateInvestmentData(businessType, unitId, sjType, xmlstr, function (data) {
		    if(data=="true") {
		    	myDataProcessor.updatedRows=[]
				Ext.MessageBox.alert("保存提示","保存成功！")
				refreshFrame()
			} else if(data=="false"){
				myDataProcessor.updatedRows=[]
			    Ext.MessageBox.alert("保存提示","读取xml出错！")
		    } else {
		    	var size = myDataProcessor.updatedRows.length ;
				for(var i=size-1;i>=0;i--){
					myDataProcessor.setUpdated(myDataProcessor.updatedRows[i],false)
				}
				myDataProcessor.updatedRows=[]
		    	var projects = data.split(";")
		    	for(var i=0;i<projects.length-1;i++) {
		    		var id = projects[i] ;
		    		myDataProcessor.setUpdated(id,true);
		    		var style = 'color:red;' ;
		    		mygrid.setRowTextStyle(id,style)
		    	}
		    	investmentPlanService.calCollectData(businessType, unitId, sjType, function(d) {
					doReload();
				});
		    	if(myDataProcessor.updatedRows.length==0) {
			    	Ext.MessageBox.alert("保存提示","保存成功！")
		    	} else {
			    	Ext.MessageBox.alert("保存提示","有"+myDataProcessor.updatedRows.length+"行保存失败！")
		    	}
			}
		});
	}
	
	function deleteFun() {
		var sID = mygrid.getSelectedId();
		mygrid.deleteRow(sID);
	}
	
	function addFun() {
		var sID = mygrid.getSelectedId();
		if(sID && sID.length>0) {
			var parentItemId = sID.split("`")[0];
			
			var style = "dialogWidth:850px;dialogHeight:350px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
			var url = CONTEXT_PATH+"/Business/planMgm/investmentPlan/dept/otherCost.item.add.jsp?parentItemId="+parentItemId + "&businessType=" + businessType + "&sjType=" + sjType + "&unitId=" + unitId;
			var rtn = window.showModalDialog(encodeURI(url), null, style);
			if(rtn!=null && rtn.length>0){
				var itemObj = rtn.split("`");
				var itemId = itemObj[0];
				var parentId = itemObj[1];
				var itemName = itemObj[2];
				
				var valueArr = new Array();
				valueArr[0] = itemName;
				valueArr[1] = "";
				valueArr[2] = parent.masterId;
				mygrid.addRow(itemId+"`true`"+parentId, valueArr, "", sID);
			}
		} else {
			Ext.Msg.alert("提示", "请选择添加项目的父项！");
		}
	}
	
	function doReload() {
		mygrid.clearAll();
		investmentPlanService.getOtherCostPlanXml(businessType, unitId, sjType, function(dataXml) {
			mygrid.loadXMLString(dataXml);
		});
	}
 </script>
</HTML>