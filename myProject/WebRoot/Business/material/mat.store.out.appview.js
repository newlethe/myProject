var beanC = "com.hdkj.webpmis.domain.material.MatAppView"
var businessC = "baseMgm";
var listMethodC = "findWhereOrderby";
var primaryKeyC = "uuid";
var orderColumnC = "catNo";

	var smC = new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	
	var fm = Ext.form;			
	var fcC = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '入库主键',  
			hideLabel : true
		},'appid' : {
			name : 'appid',
			fieldLabel : '申请主键',  
			hideLabel : true
		},'matId' : {
			name : 'matId',
			fieldLabel : '编码结构主键',  
			hideLabel : true
		},'catNo' : {  
			name : 'catNo',
			fieldLabel : '物资编码',  
			anchor : '95%'
		},'catName' : {
			name : 'catName',
			fieldLabel : '品名',
			anchor : '95%'
		},'spec' : {
			name : 'spec',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},'price' : {
			name : 'price',
			fieldLabel : '单价',
			anchor : '95%'
		},'takenum' : {
			name : 'takenum',
			fieldLabel : '入库数量',
			anchor : '95%'
		},'remain' : {  
			name : 'remain',
			fieldLabel : '总库存数',  
			anchor : '95%'
		}
	}

    var ColumnsC = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'appid', type: 'string'}, 
    	{name: 'matId', type: 'string'}, 
    	{name: 'catNo', type: 'string'},    		
		{name: 'catName', type: 'string'},
		{name: 'spec', type: 'string' },
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'takenum', type: 'float'},
		{name: 'remain', type: 'float'}
		];
		

	var dsC = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanC,
			business : businessC,
			method : listMethodC,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyC
		}, ColumnsC),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsC.setDefaultSort(orderColumnC, 'asc');
	
	
var cmC = new Ext.grid.ColumnModel([
	smC,{
		id : 'matId',
		header : fcC['matId'].fieldLabel,
		dataIndex : fcC['matId'].name,
		hidden : true
	},{
		id : 'uuid',
		header : fcC['uuid'].fieldLabel,
		dataIndex : fcC['uuid'].name, 
		hidden : true
	},{
		id : 'appid',
		header : fcC['appid'].fieldLabel,
		dataIndex : fcC['appid'].name, 
		hidden : true
	}, {
		id : 'catNo',
		header : fcC['catNo'].fieldLabel,
		dataIndex : fcC['catNo'].name,
		width : 60
	}, {
		id : 'catName',
		header : fcC['catName'].fieldLabel,
		dataIndex : fcC['catName'].name,
		width : 60
	}, {
		id : 'spec',
		header : fcC['spec'].fieldLabel,
		dataIndex : fcC['spec'].name,
		width : 60
	}, {
		id : 'unit',
		header : fcC['unit'].fieldLabel,
		dataIndex : fcC['unit'].name,
		width : 30
	}, {
		id : 'price',
		header : fcC['price'].fieldLabel,
		dataIndex : fcC['price'].name,
		width : 30
	}, {
		id : 'takenum',
		header : fcC['takenum'].fieldLabel,
		dataIndex : fcC['takenum'].name,
		width : 30
	}, {
		id : 'remain',
		header : fcC['remain'].fieldLabel,
		dataIndex : fcC['remain'].name,
		width : 30
	}])
	cmC.defaultSortable = true;

