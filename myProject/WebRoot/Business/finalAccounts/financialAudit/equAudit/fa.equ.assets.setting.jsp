<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备出库稽核_已稽核的设备信息</title>
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
var AUDIT_TYPE_EQU = "EQU";
var PID = CURRENTAPPID;
var bean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport"
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

var cm = new Ext.grid.ColumnModel([		// 创建列模型
   	sm, {
          id:'uids',
          header: "稽核主键",
          dataIndex: 'uids',
          hidden: true
       },{
          id:'auditId',
          header: '稽核主记录主键',
          dataIndex: 'auditId',
          hidden: true
       },{
          header: '固定资产编码',
          dataIndex: 'assetsNo',
          width: 120  
       },{
       header : '固定资产名称',
		dataIndex : 'assetsName',
		width: 180  
	   },{
          header: '稽核流水号',
          dataIndex: 'auditNo',
          width: 120  
       },{
          header: '出库单号',
          dataIndex: 'sourceNo',
          width: 120  
       },{
          id:'equId',
          header: '设备主键',
          dataIndex: 'equId',
          hidden:true,
          width: 90
       },{
          id:'equName',
          header:'设备名称',
          dataIndex: 'equName',
          width: 90
       },
        {header: '生产厂商', width: 180, dataIndex: 'equSupplyunit'},
        {header: '规格型号', width: 100, dataIndex: 'equSpec'},
        {header: '单位', width: 80, dataIndex: 'unit'},
        {header: '数量', width: 60, dataIndex: 'num'},
        {header: '设备购置总价', width: 80, dataIndex: 'equAmount'},
        {header: '其中成套附属设备', width: 80, dataIndex: 'equSubAmount'},
        {header: '设备基座价值', width: 80, dataIndex: 'equBaseAmount'},
        {header: '安装费', width: 80, dataIndex: 'equInstallAmount'},
        {header: '其他费用', width: 80, dataIndex: 'equOtherAmount'},
        {header: '移交资产价值', width: 80, dataIndex: 'amount'},
        {header: '备注', width: 80, dataIndex: 'remark'},
        {header: '附属设备', width: 80, dataIndex: 'mainFlag',
        	renderer: function (value, m, rec) {
        		return "<u style='cursor:hand;'><a onclick=\"showSub('" + rec.data.auditId+ "');return false;\"><font color=blue>附属设备</font></a></u>";
        	}
        }
]);
cm.defaultSortable = true;						//设置是否可排序

    // 3. 定义记录集
var Columns = [
	{name: 'uids', type: 'string'},    	
	{name: 'auditId', type: 'string'},    	
	{name: 'assetsNo', type: 'string'},
	{name: 'assetsName', type: 'string'},     	
	{name: 'auditNo', type: 'string'},    	
	{name: 'sourceNo', type: 'string'},    	
	{name: 'equId', type: 'string' },
	{name: 'equName', type: 'string' },
	{name: 'equSupplyunit', type: 'string'},
    {name: 'equSpec', type: 'string'},
    {name: 'unit', type: 'string'},
    {name: 'num', type: 'float'},
    {name: 'equAmount', type: 'float'},
    {name: 'equSubAmount', type: 'float'},
    {name: 'equBaseAmount', type: 'float'},
    {name: 'equInstallAmount', type: 'float'},
    {name: 'equOtherAmount', type: 'float'},
    {name: 'amount', type: 'float'},
    {name: 'remark', type: 'string'},
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
	ds.baseParams.params = "businessType`" + AUDIT_TYPE_EQU+";mainFlag`1;pid`" + CURRENTAPPID;
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

// 5. 创建可编辑的grid: grid-panel
var grid = new Ext.grid.GridPanel({
   	id: 'grid-panel',			//id,可选
	ds: ds,						//数据源
	cm: cm,						//列模型
    sm: sm,						//行选择模式
    tbar: [],
	//tbar: [assetsSettingBtn, '-', assetsRemoveBtn],					//顶部工具栏，可选
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
			subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_EQU + ";mainFlag`0;mainAuditId`" + auditId;
			subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
		}
	})

//------------------------------------------------------------附属设备信息
	var subBean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport"
	var subBusiness = "financialAuditService"
	var subListMethod = "getAuditReportInfo"
	
	var subColumns = [
		{name: 'auditId', type: 'string'},
		{name: 'sourceNo', type: 'string'},
		{name: 'equId', type: 'string'},
       	{name: 'equName', type: 'string'},
       	{name: 'equSupplyunit', type: 'string'},
       	{name: 'equSpec', type: 'string'},
       	{name: 'unit', type: 'string'},
       	{name: 'num', type: 'float'},
       	{name: 'equMainAmount', type: 'float'}
	];
	
	var subAuditedNm = new Ext.grid.RowNumberer();
	var subAuditedCm = new Ext.grid.ColumnModel([
		subAuditedNm, 
		{header: '稽核主键', width: 80, hidden: true, dataIndex: 'auditId'},
		{header: '出库单', width: 80, sortable: true, dataIndex: 'sourceNo'},
		{header: '设备编码', width: 80, hidden: true, dataIndex: 'equId'},
        {header: '设备名称', width: 180, dataIndex: 'equName'},
        {header: '生产厂商', width: 180, dataIndex: 'equSupplyunit'},
        {header: '规格型号', width: 100, dataIndex: 'equSpec'},
        {header: '单位', width: 80, dataIndex: 'unit'},
        {header: '数量', width: 60, dataIndex: 'num'},
        {header: '设备购置总价', width: 80, dataIndex: 'equMainAmount'}
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
	    }, subColumns),
	    remoteSort: true,
	    pruneModifiedRecords: true	
	});
  	
  	subAuditedGrid = new Ext.grid.EditorGridPanel({
  		id: 'subGrid',
		store: subAuditedDs,
		cm: subAuditedCm,
		region: 'south',
		height: 300,
		collapsed: true,
		collapsible: true,
		border: false,
		title: '附属设备信息',
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
	var ids = "";
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
		objectIds += "`" + rec.data["equId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	if(objectIds.length>0) {
		objectIds = objectIds.substring(1);
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
		financialAuditService.setAssetsNo(PID, ids, objectIds, AUDIT_TYPE_EQU, rtn, function(d) {
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
	var ids = "";
	var objectIds = "";
	var recArr = grid.getSelectionModel().getSelections();
	if(recArr==null || recArr.length==0) {
		Ext.Msg.alert("提示", "请选择设备！");
		return;
	}
				
	for (i=0; i<recArr.length; i++) {
		var rec = recArr[i];
		ids += "`" + rec.data["uids"];
		objectIds += "`" + rec.data["equId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	if(objectIds.length>0) {
		objectIds = objectIds.substring(1);
	}
	
	Ext.Msg.confirm("提示", "确认要取消选中设备的资产设置？", function(btn){
		if(btn=="yes") {
			financialAuditService.setAssetsNo(PID, ids, objectIds, AUDIT_TYPE_EQU, "", function(d) {
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

});
	function showSub(mainAuditId) {
    	subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_EQU + ";mainFlag`0;mainAuditId`" + mainAuditId;
		subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
    	subAuditedGrid.expand(true);
    }
</script>