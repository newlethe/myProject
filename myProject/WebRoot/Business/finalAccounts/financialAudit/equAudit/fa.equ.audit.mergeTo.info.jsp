<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备安装出库稽核【合并到稽核-数据确定】</title>
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
var AUDIT_TYPE_EQU = "EQU";
var param = window.dialogArguments;
var basicData = param.basicData;
var mainObjectId = "";
var grid;
var auditedGrid, subAuditedGrid, panel;
Ext.onReady(function(){
	var rs = Ext.data.Record.create([
		{name: 'outno', type: 'string'},
		{name: 'equCode', type: 'string'},
       	{name: 'equName', type: 'string'},
       	{name: 'equSupplyunit', type: 'string'},
       	{name: 'equSpec', type: 'string'},
       	{name: 'equUnit', type: 'string'},
       	{name: 'equNum', type: 'float'},
       	{name: 'equMainAmount', type: 'float'}
       	/*,
       	{name: 'equBaseAmount', type: 'float'},
       	{name: 'equInstallAmount', type: 'float'},
       	{name: 'equOtherAmount', type: 'float'}
       	*/
	]);
	var reader = new Ext.data.JsonReader({},rs);
	var nm = new Ext.grid.RowNumberer();
	var cm = new Ext.grid.ColumnModel([
		nm,
		{header: '出库单', width: 80, sortable: true, dataIndex: 'outno'},
		{header: '设备编码', width: 80, sortable: true, dataIndex: 'equCode'},
        {header: '设备名称', width: 180, dataIndex: 'equName'},
        {header: '生产厂商', width: 180, dataIndex: 'equSupplyunit',
        	editor : new Ext.form.TextField({
				id:'equSupplyunit', 
				name: 'equSupplyunit',
				fieldLabel: '生产厂商',
				anchor:'95%'})
        },
        {header: '规格型号', width: 100, dataIndex: 'equSpec',
        	editor : new Ext.form.TextField({
				id:'equSpec', 
				name: 'equSpec',
				fieldLabel: '规格型号',
				anchor:'95%'})
        },
        {header: '单位', width: 80, dataIndex: 'equUnit',
        	editor : new Ext.form.TextField({
				id:'equUnit', 
				name: 'equUnit',
				fieldLabel: '单位',
				anchor:'95%'})
        },
        {header: '数量', width: 60, dataIndex: 'equNum',
        	editor : new Ext.form.NumberField({
				id:'equNum', 
				name: 'equNum',
				fieldLabel: '数量',
				anchor:'95%'})
        },
        {header: '设备购置总价', width: 80, dataIndex: 'equMainAmount',
        	editor : new Ext.form.NumberField({
				id:'equMainAmount', 
				name: 'equMainAmount',
				fieldLabel: '设备购置总价',
				anchor:'95%'})
		}
		/*,
		{header: '设备基座价值', width: 80, dataIndex: 'equBaseAmount',
        	editor : new Ext.form.NumberField({
				id:'equBaseAmount', 
				name: 'equBaseAmount',
				fieldLabel: '设备基座价值',
				anchor:'95%'})
		},
        {header: '安装费', width: 80, dataIndex: 'equInstallAmount',
        	editor : new Ext.form.NumberField({
				id:'equInstallAmount', 
				name: 'equInstallAmount',
				fieldLabel: '安装费',
				anchor:'95%'})
		},
        {header: '其他费用', width: 80, dataIndex: 'equOtherAmount',
        	editor : new Ext.form.NumberField({
				id:'equOtherAmount', 
				name: 'equOtherAmount',
				fieldLabel: '其他费用',
				anchor:'95%'})
		}*/
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
	var bean = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport"
	var business = "financialAuditService"
	var listMethod = "getAuditReportInfo"
	
	var Columns = [
		{name: 'auditId', type: 'string'},
		{name: 'sourceNo', type: 'string'},
		{name: 'equId', type: 'string'},
       	{name: 'equName', type: 'string'},
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
       	{name: 'mainFlag', type: 'string'}
	];
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var auditedNm = new Ext.grid.RowNumberer();
	var auditedCm = new Ext.grid.ColumnModel([
		auditedNm, sm,
		{header: '稽核主键', width: 80, hidden: true, dataIndex: 'auditId'},
		{header: '出库单', width: 80, sortable: true, dataIndex: 'sourceNo'},
		{header: '设备编码', width: 20, hidden: true, dataIndex: 'equId'},
        {header: '设备名称', width: 150, dataIndex: 'equName'},
        {header: '生产厂商', width: 180, dataIndex: 'equSupplyunit'},
        {header: '规格型号', width: 100, dataIndex: 'equSpec'},
        {header: '单位', width: 80, dataIndex: 'unit'},
        {header: '数量', width: 60, dataIndex: 'num'},
        {header: '设备购置总价', width: 80, dataIndex: 'equAmount'},
        {header: '其中附属设备价值', width: 80, dataIndex: 'equSubAmount'},
        {header: '设备基座价值', width: 80, dataIndex: 'equBaseAmount'},
        {header: '安装费', width: 80, dataIndex: 'equInstallAmount'},
        {header: '其他费用', width: 80, dataIndex: 'equOtherAmount'},
        {header: '移交资产价值', width: 80, dataIndex: 'amount'},
        {header: '附属设备', width: 80, dataIndex: 'mainFlag', 
        	renderer: function (value, m, rec) {
        		return "<u style='cursor:hand;'><a onclick=\"showSub('" + rec.data.auditId+ "');return false;\"><font color=blue>附属设备</font></a></u>";
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
  		id: 'mainGrid',
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
		auditedDs.baseParams.params = "businessType`" + AUDIT_TYPE_EQU + ";mainFlag`1";
	});
	auditedDs.load({params:{start: 0,limit: PAGE_SIZE}});
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
		title: '附属设备信息',
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
    	subAuditedGrid.getStore().baseParams.params = "businessType`" + AUDIT_TYPE_EQU + ";mainFlag`0;mainAuditId`" + mainAuditId;
		subAuditedGrid.getStore().load({params:{start: 0,limit: PAGE_SIZE}});
    	subAuditedGrid.expand(true);
    }
</script>
