<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>房屋及建筑物稽核【合并到稽核-数据确定】</title>
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

<script type="text/javascript">
var AUDIT_TYPE_BUILDING = "BUILDING";
var param = window.dialogArguments;
var basicData = param.basicData;
var mainObjectId = "";
var grid;
var auditedGrid, subAuditedGrid, panel;
Ext.onReady(function(){
	var rs = Ext.data.Record.create([
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'},
       	{name: 'bdgname', type: 'string'},
       	{name: 'bdgmoney', type: 'float'},
       	{name: 'contmoney', type: 'float'},
       	{name: 'buildingSpec', type: 'string'},
       	{name: 'buildingLocation', type: 'string'},
       	{name: 'buildingUnit', type: 'string'},
       	{name: 'buildingNum', type: 'float'},
       	{name: 'buildingSelfAmount', type: 'float'}
	]);
	var reader = new Ext.data.JsonReader({},rs);
	var nm = new Ext.grid.RowNumberer();
	var cm = new Ext.grid.ColumnModel([
		nm,
		{header: '概算主键', width: 80, sortable: true, hidden:true, dataIndex: 'bdgid'},
        {header: '概算名称', width: 130, dataIndex: 'bdgname'},
        {header: '概算编码', width: 80, dataIndex: 'bdgno'},
		{header: '概算金额', width: 80, dataIndex: 'bdgmoney'},
		{header: '分摊总金额', width: 80, dataIndex: 'contmoney'},
		{header: '规格型号', width: 80, dataIndex: 'buildingSpec',
			editor : new Ext.form.TextField({
				id:'buildingSpec', 
				name: 'buildingSpec',
				fieldLabel: '规格型号',
				anchor:'95%'})
		},
		{header: '所处位置', width: 100, dataIndex: 'buildingLocation',
			editor : new Ext.form.TextField({
				id:'buildingLocation', 
				name: 'buildingLocation',
				fieldLabel: '所处位置',
				anchor:'95%'})
		},
		{header: '计量单位', width: 80, dataIndex: 'buildingUnit',
			editor : new Ext.form.TextField({
				id:'buildingUnit', 
				name: 'buildingUnit',
				fieldLabel: '计量单位',
				anchor:'95%'})
		},
		{header: '数量', width: 60, dataIndex: 'buildingNum',
			editor : new Ext.form.NumberField({
							id:'buildingNum', 
							name: 'buildingNum',
							fieldLabel: '数量',
							anchor:'95%'})
		},
		{header: '建筑费用', width: 80, dataIndex: 'buildingSelfAmount',
			editor : new Ext.form.NumberField({
							id:'buildingSelfAmount', 
							name: 'buildingSelfAmount',
							fieldLabel: '建筑费用',
							anchor:'95%'})
		}
	]);
  	var ds = new Ext.data.Store({
		reader: reader
   	});
   	
   	var saveBtn = new Ext.Button({
		text: '保存稽核设置',
		iconCls: 'save',
		handler: saveFun 
	});
	    
	grid = new Ext.grid.EditorGridPanel({
		store: ds,
		cm: cm,
		region: 'north',
		clicksToEdit: 2,
		tbar: ["<font color=#15428b><b>&nbsp;稽核数据</b></font>", '-', saveBtn],
	    width:600,
	    height:300
	});
  	ds.loadData(eval(basicData),false)
  	
//------------------------------------------------------------已稽核的房屋建筑物数据信息
	var bean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport"
	var business = "financialAuditService"
	var listMethod = "getAuditReportInfo"
	
	var Columns = [
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
       	{name: 'amount', type: 'float'},
       	{name: 'mainFlag', type: 'string'}
	];
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var auditedNm = new Ext.grid.RowNumberer();
	var auditedCm = new Ext.grid.ColumnModel([
		auditedNm, sm,
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
		{header: '资产合计', width: 70, dataIndex: 'amount'},
        {header: '附属建筑', width: 80, dataIndex: 'mainFlag', 
        	renderer: function (value, m, rec) {
        		return "<u style='cursor:hand;'><a onclick=\"showSub('" + rec.data.auditId+ "');return false;\"><font color=blue>附属建筑</font></a></u>";
        	}
        }
	]);
  	var auditedDs = new Ext.data.Store({
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
	    pruneModifiedRecords: true	
	});
  	
  	auditedGrid = new Ext.grid.EditorGridPanel({
		store: auditedDs,
		cm: auditedCm,
		sm: sm,
        title:'请选择要合并到的稽核',
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	           pageSize: PAGE_SIZE,
	           store: auditedDs,
	           displayInfo: true,
	           displayMsg: ' {0} - {1} / {2}',
	           emptyMsg: "无记录。"
		})
	});
	auditedDs.on('beforeload', function(d){
		auditedDs.baseParams.params = "businessType`" + AUDIT_TYPE_BUILDING+";mainFlag`1";
	});
	auditedDs.load({params:{start: 0,limit: PAGE_SIZE}});
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
        title:'附属建筑物',
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
	           pageSize: PAGE_SIZE,
	           store: subAuditedDs,
	           displayInfo: true,
	           displayMsg: ' {0} - {1} / {2}',
	           emptyMsg: "无记录。"
		})
	});
	
	panel = new Ext.Panel({
		id: 'centerPanel',
		layout: 'accordion',
		region: 'center',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		items: [auditedGrid, subAuditedGrid]
	});
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid, panel]
    });
    
    function saveFun(){
    	var selRec = auditedGrid.getSelectionModel().getSelected();
    	if(selRec==null || selRec.length==0) {
    		Ext.Msg.alert("提示", "请选择要稽核到的稽核记录！");
    		return;
    	}
    	var recArr = grid.getStore().getRange();
    	var dataArr = new Array();
    	for(i=0; i<recArr.length; i++) {
    		dataArr[i] = recArr[i].data;
    	}
    	var json = Ext.encode(dataArr);
    	var obj = new Object();
    	obj.data = json;
    	obj.mainAuditId = selRec.data["auditId"];
   		window.returnValue = obj;
		window.close();
    }
});

	 function showSub(mainAuditId) {
    	subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_BUILDING + ";mainFlag`0;mainAuditId`" + mainAuditId;
		subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
    	subAuditedGrid.expand(true);
    }

</script>
