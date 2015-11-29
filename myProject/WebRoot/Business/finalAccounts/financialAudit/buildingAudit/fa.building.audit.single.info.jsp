<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>房屋及建筑物稽核【单独稽核-数据确定】</title>
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
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'},
       	{name: 'bdgname', type: 'string'},
       	{name: 'bdgmoney', type: 'float'},
       	{name: 'contmoney', type: 'float'},
       	{name: 'buildingSpec', type: 'string'},
       	{name: 'buildingLocation', type: 'string'},
       	{name: 'buildingUnit', type: 'string'},
       	{name: 'buildingNum', type: 'float'},
       	{name: 'buildingAmount', type: 'float'},
       	{name: 'buildingSelfAmount', type: 'float'},
       	{name: 'apportionAmount', type: 'float'}
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
		{header: '数量', width: 80, dataIndex: 'buildingNum',
			editor : new Ext.form.NumberField({
							id:'buildingNum', 
							name: 'buildingNum',
							fieldLabel: '数量',
							anchor:'95%'})
		},
		{header: '建筑费用', hidden:true, dataIndex: 'buildingAmount'},
		{header: '建筑费用', width: 80, dataIndex: 'buildingSelfAmount',
			editor : new Ext.form.NumberField({
							id:'buildingSelfAmount', 
							name: 'buildingSelfAmount',
							fieldLabel: '建筑费用',
							anchor:'95%'})
		},
		{header: '摊入费用', width: 80, dataIndex: 'apportionAmount',
			editor : new Ext.form.NumberField({
							id:'apportionAmount', 
							name: 'apportionAmount',
							fieldLabel: '摊入费用',
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
	    
	var grid = new Ext.grid.EditorGridPanel({
		store: ds,
		cm: cm,
		clicksToEdit: 2,
		tbar: ['->', saveBtn],
	    width:600,
	    height:300,
	    region: 'center',
        title:'稽核数据'
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
    	}
    	var json = Ext.encode(dataArr);
   		window.returnValue = json;
		window.close();
    }
});
</script>
