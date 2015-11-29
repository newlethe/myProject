<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/jsp/common/golobalJs.jsp"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<HTML>
 <HEAD>
 	 <base href="<%=basePath%>">
	<TITLE>质量验评统计报表</TITLE>
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
	<script type="text/javascript" src="dwr/interface/zlypMgmDwr.js" ></script>
	<script type="text/javascript">
	/* 流程查看调用 */
			var isFlwView = "<%=request.getParameter("isView") %>"=="true"?true:false;
			/* 流程任务调用 */
	  		var isFlwTask = "<%=request.getParameter("isTask") %>"=="true"?true:false;
	
		/* 普通模块调用 */
		var editable = "<%=request.getParameter("editable") %>"=="true"?true:false;
	
		var statId = "<%=request.getParameter("statid")==null?"":request.getParameter("statid")%>";

	</script>
 </HEAD>
 <BODY>
	<div id="gridbox" width="100%" height="100%"></div>
 </BODY>
 <script>
	var mygrid = new dhtmlXGridObject('gridbox');
	mygrid.setImagePath(basePath + "dhtmlxGridCommon/dhtmlxgrid/codebase/imgs/");
	mygrid.setSkin("xp");
	var myDataProcessor = new dataProcessor("");
	myDataProcessor.setUpdateMode("off");
	myDataProcessor.init(mygrid);
	mygrid.enableMathEditing(true);
	mygrid.setEditable(editable);
	
	
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
	
	function saveXgrid(){
		mygrid.editStop();
		
		if(myDataProcessor.updatedRows.length<1) {
			return ;
		}
		var dragflag = 0 ;
		var xmlstr='<?xml version="1.0" encoding="UTF-8"?>';
		xmlstr +='<rows>';
		//alert(myDataProcessor.updatedRows.length)
		for(var i=myDataProcessor.updatedRows.length-1;i>=0;i--){
			var colmap = new Object() ;
			var type = "" ;
			var cells = "" ;
			var pkid = myDataProcessor.updatedRows[i];
			if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'deleted'){
				type = 'delete';
			}else{
				if(mygrid.getUserData(myDataProcessor.updatedRows[i], "!nativeeditor_status") == 'inserted') {
					type = 'insert';
				} else {
					type = 'update';
				}
			    for(var j=0;j<mygrid.getColumnsNum();j++) {
					var celllabel = mygrid.getColumnId(j) ;				
					var cellType = mygrid.getColType(j);
					
					var cellvalue = mygrid.cells2(mygrid.getRowIndex(pkid),j).getValue();

						cells +="<cell colname='"+celllabel+"' type='"+cellType+"'>" ;
					
					cells +="<![CDATA["+cellvalue+"]]>" ;
					cells +="</cell>" ;
				}
			}
			xmlstr +="<row id='"+pkid+"' type='"+type+"'>";
			xmlstr += cells;
			xmlstr +="</row>";
			
		
		}
		xmlstr +='</rows>';
		//alert(xmlstr);
		zlypMgmDwr.updateYpStatDetailData(statId, xmlstr, function(retVal){
			if ( retVal == 'success' ){
			myDataProcessor.updatedRows=[];
			doReload();
				if ( isFlwTask ){
					//Ext.MessageBox.alert("保存提示","报表保存成功！已可以发送流程到下一步操作");
					Ext.Msg.show({
					   title: '保存成功！',
					   msg: '报表保存成功！<br />可以发送流程到下一步操作！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
					   			var flwFrame = parent.parent.parent;
					   			//alert(flwFrame);
					   			if ( flwFrame ){
					   			flwFrame.IS_FINISHED_TASK = true;
								flwFrame.mainTabPanel.setActiveTab('common');
					   			}
					   			
					   		}
					   }
					});
					parent.IS_FINISHED_TASK = true;	
				}
				else{
				Ext.MessageBox.alert("保存提示","保存成功！");
				
				
				}
				
				
				
			}
			else{
				Ext.MessageBox.alert("保存提示","保存失败！")
			}
		});
		
		
	}
	
	function deleteFun() {
		var sID = mygrid.getSelectedId();
		mygrid.deleteRow(sID);
	}
	
	
	
	function doReload() {
		mygrid.clearAll();
//		investmentPlanService.getOtherCostPlanXml(businessType, unitId, sjType, function(dataXml) {
//			mygrid.loadXMLString(dataXml);
//		});
		zlypMgmDwr.getGczlYpDetailXml(statId, function(dataXml){
			mygrid.loadXMLString(dataXml);

		}); 

	}
	
	doReload();
	
	
	mygrid.attachEvent("onEditCell",cellEditHandle);
 </script>
</HTML>