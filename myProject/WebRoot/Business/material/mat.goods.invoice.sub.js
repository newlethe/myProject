var beanB = "com.sgepit.pmis.material.hbm.MatGoodsInvoicesub"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "catNo";


	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',  
			hideLabel : true
		},'storeInId' : {
			name : 'storeInId',
			fieldLabel : '入库主键',
			hideLabel : true
		},'matId' : {
			name : 'matId',
			fieldLabel : '物资主键',
			hideLabel : true
		},'invoiceId' : {
			name : 'invoiceId',
			fieldLabel : '发票主键',
			hideLabel : true
		},'sequ' : {
			name : 'sequ',
			fieldLabel : '序号' 
		},'catNo' : {
			name : 'catNo',
			fieldLabel : '物资编码'
		},'catName' : {  
			name : 'catName',
			fieldLabel : '品名',  
			anchor : '95%'
		},'price' : {  
			name : 'price',
			fieldLabel : '单价',  
			anchor : '95%'
		},'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},'spec' : {
			name : 'spec',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'buyFare' : {
			name : 'buyFare',
			fieldLabel : '购买原价',
			anchor : '95%'
		},'appFare' : {  
			name : 'appFare',
			fieldLabel : '分摊费用',  
			anchor : '95%'
		},'sum' : {  
			name : 'sum',
			fieldLabel : '总价',  
			anchor : '95%'
		},'factory' : {  
			name : 'factory',
			fieldLabel : '生产厂家',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'sequ', type: 'string'}, 
    	{name: 'storeInId', type: 'string'},   
    	{name: 'matId', type: 'string'},
    	{name: 'catNo', type: 'string'},
    	{name: 'catName', type: 'string'},   
		{name: 'spec', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'unit', type: 'string'},
		{name: 'buyFare', type: 'float'},
		{name: 'appFare', type: 'float'},
		{name: 'sum', type: 'float'},
		{name: 'factory', type: 'string'},
		{name: 'invoiceId', type: 'string'}
		];
		
	var PlantB = Ext.data.Record.create(ColumnsB);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantIntB = {
		uuid : null,
		sequ:appNo,
		storeInId:'',
		matId:'',
		catNo : '',
		catName : '',
		spec : '',
		price:null,
		unit:'',
		buyFare:null,
		appFare:null,
		sum:null,
		factory:'',
		invoiceId:''
	}

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
	
	
		//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name,
		hidden : true
	}, {
		id : 'storeInId',
		header : fcB['storeInId'].fieldLabel,
		dataIndex : fcB['storeInId'].name,
		hidden : true
	}, {
		id : 'invoiceId',
		header : fcB['invoiceId'].fieldLabel,
		dataIndex : fcB['invoiceId'].name,
		hidden : true
	},{
		id : 'matId',
		header : fcB['matId'].fieldLabel,
		dataIndex : fcB['matId'].name,
		hidden : true
	}, {
		id : 'sequ',
		header : fcB['sequ'].fieldLabel,
		dataIndex : fcB['sequ'].name,
		width : 40,
		editor : new fm.TextField(fcB['sequ'])
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
		width : 40
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		width : 40
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		width : 40
	}, {
		id : 'buyFare',
		header : fcB['buyFare'].fieldLabel,
		dataIndex : fcB['buyFare'].name,
		width : 60,
		editor : new fm.NumberField(fcB['buyFare'])
	}, {
		id : 'appFare',
		header : fcB['appFare'].fieldLabel,
		dataIndex : fcB['appFare'].name,
		width : 60,
		editor : new fm.NumberField(fcB['appFare'])
	}, {
		id : 'sum',
		header : fcB['sum'].fieldLabel,
		dataIndex : fcB['sum'].name,
		width : 60,
		editor : new fm.NumberField(fcB['sum'])
	},{
		id : 'factory',
		header : fcB['factory'].fieldLabel,
		dataIndex : fcB['factory'].name,
		width : 60,
		editor : new fm.TextField(fcB['factory'])
	}])
	cmB.defaultSortable = true;
