<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>设备出库稽核_单独稽核</title>
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
var param = window.dialogArguments;
var basicData = param.basicData;
Ext.onReady(function(){
	 //构建历史数据范围Grid
	var rs = Ext.data.Record.create([
		{name: 'equId', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'outno', type: 'string'},
		{name: 'equCode', type: 'string'},
       	{name: 'equName', type: 'string'},
       	{name: 'equSupplyunit', type: 'string'},
       	{name: 'equSpec', type: 'string'},
       	{name: 'equUnit', type: 'string'},
       	{name: 'equNum', type: 'float'},
       	{name: 'equAmount', type: 'float'},
       	{name: 'equMainAmount', type: 'float'},
       	{name: 'equBaseAmount', type: 'float'},
       	{name: 'equInstallAmount', type: 'float'},
       	{name: 'equOtherAmount', type: 'float'}
	]);
	var reader = new Ext.data.JsonReader({},rs);
	var nm = new Ext.grid.RowNumberer();
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		nm,
		{header: '设备主键', width: 120, hidden: true, dataIndex: 'equId'},
		{header: '设备概算编号', width: 120, hidden: true, dataIndex: 'bdgid'},
		{header: '出库单', width: 120, sortable: true, dataIndex: 'outno'},
		{header: '设备编码', width: 80, hidden: true, dataIndex: 'equCode'},
        {header: '设备名称', width: 160, dataIndex: 'equName'},
        {header: '生产厂商', width: 130, dataIndex: 'equSupplyunit',
        	editor : new Ext.form.TextField({
				id:'equSupplyunit', 
				name: 'equSupplyunit',
				fieldLabel: '生产厂商',
				anchor:'95%'})
        },
        {header: '规格型号', width: 70, dataIndex: 'equSpec',
        	editor : new Ext.form.TextField({
				id:'equSpec', 
				name: 'equSpec',
				fieldLabel: '规格型号',
				anchor:'95%'})
        },
        {header: '单位', width: 50, dataIndex: 'equUnit',
        	editor : new Ext.form.TextField({
				id:'equUnit', 
				name: 'equUnit',
				fieldLabel: '单位',
				anchor:'95%'})
        },
        {header: '数量', width: 50, dataIndex: 'equNum',
        	editor : new Ext.form.NumberField({
				id:'equNum', 
				name: 'equNum',
				fieldLabel: '数量',
				anchor:'95%'})
        },
        {header: '总金额', width: 80, hidden: true, dataIndex: 'equAmount'},
        {header: '设备购置总价', width: 80, dataIndex: 'equMainAmount',
        	editor : new Ext.form.NumberField({
				id:'equMainAmount', 
				name: 'equMainAmount',
				fieldLabel: '设备购置总价',
				anchor:'95%'})
		},
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
		}
	]);
  	var ds = new Ext.data.Store({
		reader: reader
   	});
   	
   	var saveBtn = new Ext.Button({
		text: '确定稽核设置',
		iconCls: 'save',
		handler: saveFun 
	});
	    
	var grid = new Ext.grid.EditorGridPanel({
		store: ds,
		cm: cm,
		clicksToEdit: 2,
		tbar: ['->', saveBtn],
	    width:600,
	    height:300,
	    region: 'center',
        title:'合并稽核数据'
	});
  	ds.loadData(eval(basicData),false)
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [grid]
    });
    
    function saveFun(){
    	var recArr = grid.getStore().getRange();
    	var dataArr = new Array();
    	for(i=0; i<recArr.length; i++) {
    		dataArr[i] = recArr[i].data;
    		dataArr[i].equAmount = recArr[i].data["equMainAmount"];
    	}
    	var json = Ext.encode(dataArr);
   		window.returnValue = json;
		window.close();
    }
});
</script>
