var beanB = "com.hdkj.webpmis.domain.material.MatStoreoutView"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "catNo";

	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '入库主键',  
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
		},'innum' : {
			name : 'innum',
			fieldLabel : '入库数量',
			anchor : '95%'
		},'inType' : {  
			name : 'inType',
			fieldLabel : '入库类型',  
			anchor : '95%'
		},'remain' : {  
			name : 'remain',
			fieldLabel : '库存数',  
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'matId', type: 'string'}, 
    	{name: 'catNo', type: 'string'},    		
		{name: 'catName', type: 'string'},
		{name: 'spec', type: 'string' },
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'innum', type: 'float'},
		{name: 'inType', type: 'string'},
		{name: 'remain', type: 'float'}
		];
		

	var dsB = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyB
		}, ColumnsB),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsB.setDefaultSort(orderColumnB, 'asc');
	
	
var cmB = new Ext.grid.ColumnModel([
	smB,{
		id : 'matId',
		header : fcB['matId'].fieldLabel,
		dataIndex : fcB['matId'].name,
		hidden : true
	},{
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name, 
		hidden : true
	}, {
		id : 'catNo',
		header : fcB['catNo'].fieldLabel,
		dataIndex : fcB['catNo'].name,
		width : 60
	}, {
		id : 'catName',
		header : fcB['catName'].fieldLabel,
		dataIndex : fcB['catName'].name,
		width : 60
	}, {
		id : 'spec',
		header : fcB['spec'].fieldLabel,
		dataIndex : fcB['spec'].name,
		width : 60
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		width : 30
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		width : 30
	}, {
		id : 'innum',
		header : fcB['innum'].fieldLabel,
		dataIndex : fcB['innum'].name,
		width : 30
	}, {
		id : 'inType',
		header : fcB['inType'].fieldLabel,
		dataIndex : fcB['inType'].name,
		width : 30
	}, {
		id : 'remain',
		header : fcB['remain'].fieldLabel,
		dataIndex : fcB['remain'].name,
		width : 30
	}])
	cmB.defaultSortable = true;

