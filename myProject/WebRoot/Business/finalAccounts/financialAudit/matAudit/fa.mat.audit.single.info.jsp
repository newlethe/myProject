<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>   
		<title>物资出库稽核稽核【单独稽核-数据确定】</title>
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
	 //构建Record
	var rs = Ext.data.Record.create([
		{name: 'outNo', type:'string'},
		{name: 'matId', type: 'string'},
		{name: 'matName', type: 'string'},
       	{name: 'matSpec', type: 'string'},
       	{name: 'matSupplyunit', type: 'string'},
       	{name: 'usingUser', type: 'string'},
       	{name: 'matUnit', type: 'string'},
       	{name: 'num', type: 'int'},
       	{name: 'finOAmount', type : 'float'},
       	{name: 'finDepAmount', type : 'float'},
       	{name: 'finFixedAmount', type : 'float'},
       	{name: 'finCurrentAmount', type : 'float'},
       	{name:'remark', type:  'string'}
	]);
	var reader = new Ext.data.JsonReader({},rs);
	var nm = new Ext.grid.RowNumberer();
	var cm = new Ext.grid.ColumnModel([
		nm,
		{header: '物资主键', width: 80, sortable: true, hidden:true, dataIndex: 'matId'},
        {header: '物资名称', width: 130, dataIndex: 'matName'},
        {header: '规格型号', width: 80, dataIndex: 'matSpec'},
		{header: '供应单位、制造厂', width: 80, dataIndex: 'matSupplyunit'},
		{header: '使用部门或责任者', width: 80, dataIndex: 'usingUser',
			editor : new Ext.form.TextField({
				id : 'usingUser',
				name : 'usingUser',
				fieldLabel : '使用部门或责任者'
			})
		},
		{header: '单位', width: 60, dataIndex: 'matUnit',
			editor : new Ext.form.TextField(
				{
					id : 'matUnit',
					name : 'matUnit',
					fieldLabel : '计量单位'
				}
			)
		},
		{header: '数量', width: 50, dataIndex: 'num',
			editor : new Ext.form.NumberField({
							id:'num', 
							name: 'num',
							fieldLabel: '数量',
							anchor:'95%'})
		},
		{header: '交付使用资产价值(原值)', width: 100, dataIndex: 'finOAmount',
			editor : new Ext.form.NumberField({
							id:'finOAmount', 
							name: 'finOAmount',
							fieldLabel: '交付使用资产价值(原值)',
							anchor:'95%'})
		},
		{header: '交付使用资产价值(折旧或摊销)', width: 100, dataIndex: 'finDepAmount',
			editor : new Ext.form.NumberField({
							id:'finDepAmount', 
							name: 'finDepAmount',
							fieldLabel: '交付使用资产价值(折旧或摊销)',
							anchor:'95%'})
		},
		{header: '属固定资产', width: 100, dataIndex: 'finFixedAmount',
			editor : new Ext.form.NumberField({
							id:'finFixedAmount', 
							name: 'finFixedAmount',
							fieldLabel: '属固定资产',
							anchor:'95%'})
		},
		{header : '属流动资产', width : 100, dataIndex : 'finCurrentAmount',
			editor : new Ext.form.NumberField({
							id:'finCurrentAmount', 
							name: 'finCurrentAmount',
							fieldLabel: '属流动资产',
							anchor:'95%'})
		},
		{ header : '备注', width : 80, dataIndex : 'remark',
			editor : new Ext.form.TextField({
				id : 'remark',
				name : 'remark',
				fieldLabel : '备注'
			})
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
