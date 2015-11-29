<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>物资出库稽核_已稽核的物资信息</title>
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
var AUDIT_TYPE_MAT = "MAT";
var bean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaMatAuditReport"
var business = "financialAuditService"
var listMethod = "getAuditReportInfo"

var orderColumn = "audit_id";
var sm;

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
var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:singleSelectFlag})   //  创建选择模式	
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
	},'sourceNo': {
		name: 'sourceNo',
		fieldLabel: '出库单编号',
		anchor:'95%'
	},'matId': {
		name: 'matId',
		fieldLabel: '物资编号',
		anchor:'95%'
	},'matCode': {
		name: 'matCode',
		fieldLabel: '物资编码',
		anchor:'95%'
	},'matName': {
		name: 'matName',
		fieldLabel: '物资名称',
		anchor:'95%'
	},'matSpec': {
		name: 'matSpec',
		fieldLabel: '规格型号',
		anchor:'95%'
	},'matSupplyunit': {
		name: 'matSupplyunit',
		fieldLabel: '供应单位、制造厂',
		anchor:'95%'
	},'usingUser': {
		name: 'usingUser',
		fieldLabel: '使用单位或责任人',
		anchor:'95%'
	},'matUnit': {
		name: 'matUnit',
		fieldLabel: '计量单位',
		anchor:'95%'
	},'numF': {
		name: 'numF',
		fieldLabel: '数量',
		anchor:'95%'
	},'finOAmount': {
		name: 'finOAmount',
		fieldLabel: '交付使用资产价值(原值)',
		anchor:'95%'
	},'finDepAmount': {
		name: 'finDepAmount',
		fieldLabel: '交付使用资产价值(折旧或摊销)',
		anchor:'95%'
	},'finFixedAmount': {
		name: 'finFixedAmount',
		fieldLabel: '属固定资产',
		anchor:'95%'
	},'finCurrentAmount': {
		name: 'finCurrentAmount',
		fieldLabel: '属流动资产',
		anchor:'95%'
	},'remark': {
		name: 'remark',
		fieldLabel: '备注',
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
          header: fc['sourceNo'].fieldLabel,
          dataIndex: fc['sourceNo'].name,
          width: 120  
       },{
          id:'matId',
          header: fc['matId'].fieldLabel,
          dataIndex: fc['matId'].name,
          hidden:true,
          width: 90
       },{
          id:'matCode',
          header: fc['matCode'].fieldLabel,
          dataIndex: fc['matCode'].name,
          hidden:true,
          width: 90
       },{
          id:'matName',
          header: fc['matName'].fieldLabel,
          dataIndex: fc['matName'].name,
          width: 90
       },{
          id:'matSpec',
          header: fc['matSpec'].fieldLabel,
          dataIndex: fc['matSpec'].name,
          width: 90
       },{
          id:'matSupplyunit',
          header: fc['matSupplyunit'].fieldLabel,
          dataIndex: fc['matSupplyunit'].name,
          width: 90
       },{
          id:'usingUser',
          header: fc['usingUser'].fieldLabel,
          dataIndex: fc['usingUser'].name,
          width: 90
       },{
          id:'matUnit',
          header: fc['matUnit'].fieldLabel,
          dataIndex: fc['matUnit'].name,
          width: 90
       },{
          id:'numF',
          header: fc['numF'].fieldLabel,
          dataIndex: fc['numF'].name,
          width: 90
       },{
          id:'finOAmount',
          header: fc['finOAmount'].fieldLabel,
          dataIndex: fc['finOAmount'].name,
          width: 90
       },{
          id:'finDepAmount',
          header: fc['finDepAmount'].fieldLabel,
          dataIndex: fc['finDepAmount'].name,
          width: 90
       },{
          id:'finFixedAmount',
          header: fc['finFixedAmount'].fieldLabel,
          dataIndex: fc['finFixedAmount'].name,
          width: 90
       },{
          id:'finCurrentAmount',
          header: fc['finCurrentAmount'].fieldLabel,
          dataIndex: fc['finCurrentAmount'].name,
          width: 90
       },{
          id:'remark',
          header: fc['remark'].fieldLabel,
          dataIndex: fc['remark'].name,
          width: 90
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
	{name: 'matId', type: 'string' },
	{name: 'matCode', type: 'string' },
	{name: 'matName', type: 'string'},
    {name: 'matSpec', type: 'string'},
    {name: 'matSupplyunit', type: 'string'},
    {name: 'usingUser', type: 'string'},
    {name: 'matUnit', type: 'string'},
    {name: 'numF', type: 'int'},
    {name: 'finOAmount', type : 'float'},
    {name: 'finDepAmount', type : 'float'},
    {name: 'finFixedAmount', type : 'float'},
    {name: 'finCurrentAmount', type : 'float'},
    {name:'remark', type:  'string'}
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
	ds.baseParams.params = "businessType`" + AUDIT_TYPE_MAT+";mainFlag`1;pid`"+CURRENTAPPID;
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
    tbar:[],
//	tbar: [assetsSettingBtn, '-', assetsRemoveBtn],					//顶部工具栏，可选
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


var viewport = new Ext.Viewport({
	layout: 'border',
    items: [grid]
});

if (ModuleLVL < 3) {
	grid.getTopToolbar().add(assetsSettingBtn, '-', assetsRemoveBtn);
}

ds.load({params:{start: 0,limit: PAGE_SIZE}});

//设置资产分类
function assetsSettingFun(){
	var checkFlag = false;
	var ids="";
	var objectIds="";
	var recArr = grid.getSelectionModel().getSelections();
	if(recArr==null || recArr.length==0) {
		Ext.Msg.alert("提示", "请选择物资！");
		return;
	}
				
	for (i=0; i<recArr.length; i++) {
		var rec = recArr[i];
		if(rec.data["assetsNo"]!=null && rec.data["assetsNo"].length>0) {
			checkFlag = checkFlag && true;
		}
		ids += "`" + rec.data["uids"];
		objectIds += "`" + rec.data["matId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	if(objectIds.length>0) {
		objectIds = objectIds.substring(1);
	}
	
	if(checkFlag) {
		Ext.Msg.confirm("提示", "你选择的物资有部分已经设置了资产分类，确认要变更吗？", function(btn){
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
		financialAuditService.setAssetsNo(CURRENTAPPID, ids, objectIds, AUDIT_TYPE_MAT, rtn, function(d) {
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
	var objectIds="";
	var recArr = grid.getSelectionModel().getSelections();
	if(recArr==null || recArr.length==0) {
		Ext.Msg.alert("提示", "请选择物资！");
		return;
	}
				
	for (i=0; i<recArr.length; i++) {
		var rec = recArr[i];
		ids += "`" + rec.data["uids"];
		objectIds += "`" + rec.data["matId"];
	}
	
	if(ids.length>0) {
		ids = ids.substring(1);
	}
	if(objectIds.length>0) {
		objectIds = objectIds.substring(1);
	}
	
	Ext.Msg.confirm("提示", "确认要取消选中物资的资产设置？", function(btn){
		if(btn=="yes") {
			financialAuditService.setAssetsNo(CURRENTAPPID, ids, objectIds, AUDIT_TYPE_MAT, "", function(d) {
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
</script>