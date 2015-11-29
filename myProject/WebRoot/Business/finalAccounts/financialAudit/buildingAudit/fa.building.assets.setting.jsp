<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>房屋及建筑物稽核_已稽核的房建信息</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/financialAuditService.js'></script>  
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
	</head>
</html>

<script>
var PID = CURRENTAPPID;
var AUDIT_TYPE_BUILDING = "BUILDING";
var bean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport"
var business = "financialAuditService"
var listMethod = "getAuditReportInfo"

var orderColumn = "audit_id";
var sm;
var subAuditedGrid;

var userArray = new Array();
DWREngine.setAsync(false);
baseMgm.getData("select userid,realname from rock_user ",function(list){
	for(var i = 0;i<list.length;i++){
		var temp = new Array();
		temp.push(list[i][0]);
		temp.push(list[i][1]);
		userArray.push(temp);
	}
})
DWREngine.setAsync(true);

Ext.onReady(function(){
var singleSelectFlag = false;
var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:false})   //  创建选择模式	
var fm = Ext.form;			// 包名简写（缩写）

var fc = {	// 创建编辑域配置
	'uids': {
		name: 'uids',
		fieldLabel: '稽核主键' ,
		hidden:true,
		hideLabel:true
	},'auditId': {
		name: 'auditId',
		fieldLabel: '稽核主记录主键' ,
		hidden:true,
		hideLabel:true
	},'assetsNo': {
		name: 'assetsNo',
		fieldLabel: '固定资产编码' ,
		anchor:'95%'
	},'assetsName' : {
		name : 'assetsName',
		fieldLabel : '固定资产名称',
		anchor:'95%'
	},'auditNo': {
		name: 'auditNo',
		fieldLabel: '稽核流水号' ,
		anchor:'95%'
	},'budgetId': {
		name: 'budgetId',
		fieldLabel: '概算项目编号',
		anchor:'95%'
	},'buildingName': {
		name: 'buildingName',
		fieldLabel: '房屋、建筑物名称',
		anchor:'95%'
	},'buildingSpec': {
		name: 'buildingSpec',
		fieldLabel: '结构及层次',
		anchor:'95%'
	},'buildingLocation': {
		name: 'buildingLocation',
		fieldLabel: '所处位置',
		anchor:'95%'
	},'unit': {
		name: 'unit',
		fieldLabel: '单位',
		anchor:'95%'
	},'num': {
		name: 'num',
		fieldLabel: '数量',
		anchor:'95%'
	},'buildingAmount': {
		name: 'buildingAmount',
		fieldLabel: '建筑费用',
		anchor:'95%'
	},'apportionAmount': {
		name: 'apportionAmount',
		fieldLabel: '摊入费用',
		anchor:'95%'
	},'amount': {
		name: 'amount',
		fieldLabel: '资产合计',
		anchor:'95%'
	},'mainFlag': {
		name: 'mainFlag',
		fieldLabel: '附属建筑',
		anchor:'95%'
	}
};

var cm = new Ext.grid.ColumnModel([		// 创建列模型
   	sm, {
          id:'uids',
          header: fc['uids'].fieldLabel,
          dataIndex: fc['uids'].name,
          hidden: true
       },{
          id:'auditId',
          header: fc['auditId'].fieldLabel,
          dataIndex: fc['auditId'].name,
          hidden: true
       },{
          header: fc['assetsNo'].fieldLabel,
          dataIndex: fc['assetsNo'].name,
          width: 120  
       },{
		  header : fc['assetsName'].fieldLabel,
		  dataIndex : fc['assetsName'].name,
		  width : 120	
       },{
          header: fc['auditNo'].fieldLabel,
          dataIndex: fc['auditNo'].name,
          width: 120  
       },{
          id:'budgetId',
          header: fc['budgetId'].fieldLabel,
          dataIndex: fc['budgetId'].name,
          hidden:true,
          width: 90
       },{
          id:'buildingName',
          header: fc['buildingName'].fieldLabel,
          dataIndex: fc['buildingName'].name,
          width: 90
       },{
          id:'buildingSpec',
          header: fc['buildingSpec'].fieldLabel,
          dataIndex: fc['buildingSpec'].name,
          width: 90
       },{
          id:'buildingLocation',
          header: fc['buildingLocation'].fieldLabel,
          dataIndex: fc['buildingLocation'].name,
          width: 90
       },{
          id:'unit',
          header: fc['unit'].fieldLabel,
          dataIndex: fc['unit'].name,
          width: 90
       },{
          id:'num',
          header: fc['num'].fieldLabel,
          dataIndex: fc['num'].name,
          width: 90
       },{
          id:'buildingAmount',
          header: fc['buildingAmount'].fieldLabel,
          dataIndex: fc['buildingAmount'].name,
          width: 90
       },{
          id:'apportionAmount',
          header: fc['apportionAmount'].fieldLabel,
          dataIndex: fc['apportionAmount'].name,
          width: 90
       },{
          id:'amount',
          header: fc['amount'].fieldLabel,
          dataIndex: fc['amount'].name,
          width: 90
       },{
          id:'mainFlag',
          header: fc['mainFlag'].fieldLabel,
          dataIndex: fc['mainFlag'].name,
          width: 90,
          renderer: function (value, m, rec) {
        		return "<u style='cursor:hand;'><a onclick=\"showSub('" + rec.data.auditId+ "');return false;\"><font color=blue>附属建筑</font></a></u>";
        	}
       }
]);
cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
var Columns = [
	{name: 'uids', type: 'string'},    	
	{name: 'auditId', type: 'string'},    	
	{name: 'assetsNo', type: 'string'},    	
	{name: 'auditNo', type: 'string'},
	{name: 'assetsName', type: 'string'},     	
	{name: 'budgetId', type: 'string' },
	{name: 'buildingName', type: 'string' },
	{name: 'buildingSpec', type: 'string'},
	{name: 'buildingLocation', type: 'string'},
    {name: 'unit', type: 'string'},
    {name: 'num', type: 'float'},
    {name: 'buildingAmount', type: 'float'},
    {name: 'apportionAmount', type: 'float'},
    {name: 'amount', type: 'float'},
    {name: 'mainFlag', type: 'string'}
];
 
	// 4. 创建数据源
var ds = new Ext.data.GroupingStore({
	baseParams: {
    	ac: 'list',				//表示取列表
    	bean: bean,				
    	business: business,
    	method: listMethod
	},
    proxy: new Ext.data.HttpProxy({
        method: 'GET',
        url: MAIN_SERVLET
    }),
    reader: new Ext.data.JsonReader({
        root: 'topics',
        totalProperty: 'totalCount'
    }, Columns),
    remoteSort: true,
    pruneModifiedRecords: true,
    groupField : 'assetsNo'	
});
ds.setDefaultSort(orderColumn, 'asc');	

ds.on('beforeload', function(d){
	ds.baseParams.params = "businessType`" + AUDIT_TYPE_BUILDING+";mainFlag`1;pid`"+CURRENTAPPID;
});

var assetsSettingBtn = new Ext.Button({
	text: '设置资产编码',
	iconCls: 'btn',
	handler: assetsSettingFun 
});

var assetsRemoveBtn = new Ext.Button({
	text: '取消设置',
	iconCls: 'remove',
	handler: assetsRemoveFun 
});

var saveBtn = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: saveFun 
});

// 5. 创建可编辑的grid: grid-panel
var grid = new Ext.grid.GridPanel({
   	id: 'grid-panel',			//id,可选
	ds: ds,						//数据源
	cm: cm,						//列模型
    sm: sm,						//行选择模式
	tbar: [],					//顶部工具栏，可选
    border: false,				// 
    width : 600,				//宽
	height: 410,	
    region: 'center',
    header: false,				//
    frame: false,				//是否显示圆角边框
    autoScroll: true,			//自动出现滚动条
    split:true,
    animCollapse: false,		//折叠时显示动画
    autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
    loadMask: true,				//加载时是否显示进度
    stripeRows: true,
    view: new Ext.grid.GroupingView({
            forceFit:true,
            groupTextTpl: '{text}'
        }),
	viewConfig:{
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
           pageSize: PAGE_SIZE,
           store: ds,
           displayInfo: true,
           displayMsg: ' {0} - {1} / {2}',
           emptyMsg: "无记录。"
	})
});

sm.on('rowselect', function(){
	if (sm.hasSelection()){
		var auditId = sm.getSelected().get('auditId');
		subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_BUILDING + ";mainFlag`0;mainAuditId`" + auditId;
		subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
	}
})

//------------------------------------------------------------已稽核的附属房屋建筑物数据信息
	var subBean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport"
	var subBusiness = "financialAuditService"
	var subListMethod = "getAuditReportInfo"
	
	var subColumns = [
		{name: 'bdgId', type: 'string'},
		{name: 'auditId', type: 'string'},
		{name: 'budgetId', type: 'string'},
       	{name: 'buildingName', type: 'string'},
       	{name: 'buildingSpec', type: 'string'},
       	{name: 'buildingLocation', type: 'string'},
       	{name: 'unit', type: 'string'},
       	{name: 'num', type: 'float'},
       	{name: 'buildingAmount', type: 'float'},
       	{name: 'apportionAmount', type: 'float'},
       	{name: 'amount', type: 'float'}
	];
	
	var subAuditedNm = new Ext.grid.RowNumberer();
	var subAuditedCm = new Ext.grid.ColumnModel([
		subAuditedNm,
		{header: '稽核主键', width: 80, sortable: true, hidden:true, dataIndex: 'auditId'},
		{header: '概算主键', width: 80, sortable: true, hidden:true, dataIndex: 'bdgId'},
        {header: '概算名称', width: 130, dataIndex: 'buildingName'},
        {header: '概算编码', width: 80, dataIndex: 'budgetId'},
		{header: '规格型号', width: 80, dataIndex: 'buildingSpec'},
		{header: '所处位置', width: 100, dataIndex: 'buildingLocation'},
		{header: '计量单位', width: 80, dataIndex: 'unit'},
		{header: '数量', width: 60, dataIndex: 'num'},
		{header: '建筑费用', width: 70, dataIndex: 'buildingAmount'},
		{header: '摊入费用', width: 70, dataIndex: 'apportionAmount'},
		{header: '资产合计', width: 70, dataIndex: 'amount'}
	]);
  	var subAuditedDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: subBean,				
	    	business: subBusiness,
	    	method: subListMethod
		},
	    proxy: new Ext.data.HttpProxy({
	        method: 'GET',
	        url: MAIN_SERVLET
	    }),
	    reader: new Ext.data.JsonReader({
	        root: 'topics',
	        totalProperty: 'totalCount'
	    }, Columns),
	    remoteSort: true,
	    pruneModifiedRecords: true	
	});
  	
  	subAuditedGrid = new Ext.grid.EditorGridPanel({
		store: subAuditedDs,
		cm: subAuditedCm,
		region: 'south',
		height: 300,
		collapsed: true,
		collapsible: true,
		border: false,
        title:'附属建筑物',
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	           pageSize: PAGE_SIZE,
	           store: subAuditedDs,
	           displayInfo: true,
	           displayMsg: ' {0} - {1} / {2}',
	           emptyMsg: "无记录。"
		})
	});

var viewport = new Ext.Viewport({
	layout: 'border',
    items: [grid, subAuditedGrid]
});

if (ModuleLVL < 3) {
	grid.getTopToolbar().add(assetsSettingBtn, '-', assetsRemoveBtn);
}

ds.load({params:{start: 0,limit: PAGE_SIZE}});

//设置资产分类
function assetsSettingFun(){
	var checkFlag = false;
	var ids="";
	var objectIds = "";
	var recArr = grid.getSelectionModel().getSelections();
	if(recArr==null || recArr.length==0) {
		Ext.Msg.alert("提示", "请选择设备！");
		return;
	}
				
	for (i=0; i<recArr.length; i++) {
		var rec = recArr[i];
		if(rec.data["assetsNo"]!=null && rec.data["assetsNo"].length>0) {
			checkFlag = checkFlag && true;
		}
		ids += "`" + rec.data["uids"];
		objectIds += "`" + rec.data["budgetId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	
	if(objectIds.length>0) {
		objectIds = ids.substring(1);
	}
	
	if(checkFlag) {
		Ext.Msg.confirm("提示", "你选择的设备有部分已经设置了资产分类，确认要变更吗？", function(btn){
			if(btn=="yes") {
				assetsSetting(ids, objectIds);
			} else {
				return;
			}
		});
	} else {
		assetsSetting(ids, objectIds);
	}
}

function assetsSetting(ids, objectIds){
	var selectAssetsUrl = CONTEXT_PATH + "/Business/finalAccounts/basicData/fa.assets.sort.select.jsp"
	var param = new Object();
	var rtn = showModalDialog(selectAssetsUrl, param);
	if(rtn) {
		financialAuditService.setAssetsNo(PID, ids, objectIds, AUDIT_TYPE_BUILDING, rtn, function(d) {
			if(d=="OK") {
				Ext.Msg.alert("提示", "资产设置成功！");
				ds.load({params:{start: 0,limit: PAGE_SIZE}});
			}
		});
	}
}

//取消资产设置
function assetsRemoveFun(){
	var checkFlag = false;
	var ids="";
	var objectIds = "";
	var recArr = grid.getSelectionModel().getSelections();
	if(recArr==null || recArr.length==0) {
		Ext.Msg.alert("提示", "请选择设备！");
		return;
	}
				
	for (i=0; i<recArr.length; i++) {
		var rec = recArr[i];
		ids += "`" + rec.data["uids"];
		objectIds += "`" + rec.data["budgetId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	
	if(objectIds.length>0) {
		objectIds = objectIds.substring(1);
	}
	
	Ext.Msg.confirm("提示", "确认要取消选中设备的资产设置？", function(btn){
		if(btn=="yes") {
			financialAuditService.setAssetsNo(PID, ids, objectIds, AUDIT_TYPE_BUILDING, "", function(d) {
				if(d=="OK") {
					Ext.Msg.alert("提示", "取消资产分类设置成功！");
					ds.load({params:{start: 0,limit: PAGE_SIZE}});
				}
			});
		} else {
			return;
		}
	});
}

function saveFun(){
   	var rec = grid.getSelectionModel().getSelected();
   	if (rec==null) {
   		Ext.Msg.alert("提示", "请选择要合并到哪个稽核？");
   	} else {
		window.returnValue = rec.data["auditId"];
		window.close();   
   	}
}


});

function showSub(mainAuditId) {
	subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_BUILDING + ";mainFlag`0;mainAuditId`" + mainAuditId;
	subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
  	subAuditedGrid.expand(true);
}
</script>