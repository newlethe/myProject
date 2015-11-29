var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
var business = "baseMgm";
var listMethod = "findwhereorderby"; 
var primaryKey = "uids";
var orderColumn = "month"
var selectConId = "";
var selectConIdOld = "";
var selectMasterId = ""; 
var selectSjType = "";
var detailUrl = "";
var conComboxSelect = "ALL";
var editEnalbe = true;

var selectedInd = "";

//页面布局描述
/*
   north部分展示投资计划的期别，主要显示流程编号，期别，状态，备注，概要文件，附件等信息,根据期别分组显示不同合同的计划
   center 的west显示该合同分摊的概算树，center显示合同分摊的工程量，并可以结合概算树进行过滤
*/
var masterUrl = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/acm.project.month.jsp?isTask=" + isFlwTask + "&isView=" + isFlwView + "&mon_id=" + monid_flow + "&conno=" + conno_flow;
var detailUrl = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/acm.project.edit.jsp?isTask=" + isFlwTask + "&isView=" + isFlwView + "&step=" + step_flow ;
Ext.onReady(function(){
	var masterPnael = new Ext.Panel({
        region: "north",
        height: 200,
        split: true,
        border: false,
        html: "<iframe name='masterFrame' src='" + masterUrl + "' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
	
	detailPanel = new Ext.Panel({
         region: "center",
         split: true,
         border: false,
         html: "<iframe name='detailFrame' src='" + detailUrl + "' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [masterPnael,detailPanel]
	});
});

function masterRecordSelFun(rowInx, rec){
	selectedInd = rowInx;
	window.frames["detailFrame"].location = detailUrl + "&conid=" + rec.data["conid"] + "&masterId=" + rec.data["uids"] + "&sjType=" + rec.data["month"];
}

function reloadMasterFun(){
	window.frames["masterFrame"].location.reload(true);
}
