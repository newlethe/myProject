var beanB = "com.hdkj.webpmis.domain.material.MatStoreOutsub"
var beanBdg = "com.hdkj.webpmis.domain.budget.BdgInfo"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "subNo";

	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',  
			hideLabel : true
		},'outId' : {
			name : 'outId',
			fieldLabel : '出库主键',
			hideLabel : true
		},'appId' : {
			name : 'appId',
			fieldLabel : '申请计划',
			hideLabel : true
		},'goodsId' : {
			name : 'goodsId',
			fieldLabel : '到货主键',
			hideLabel : true
		},'inId' : {
			name : 'inId',
			fieldLabel : '入库主键',
			hideLabel : true
		},'subNo' : {
			name : 'subNo',
			fieldLabel : '序号',
			anchor : '95%'
		},'matId' : {  
			name : 'matId',
			fieldLabel : '物资主键',  
			anchor : '95%'
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
		},'appNum' : {  
			name : 'appNum',
			fieldLabel : '申请数量',
			anchor : '95%'
		},'realNum' : {  
			name : 'realNum',
			fieldLabel : '出库数量',  
			selectOnFocus: true,
			anchor : '95%'
		},'money' : {  
			name : 'money',
			fieldLabel : '金额',  
			anchor : '95%'
		},'bdgid' : {  
			name : 'bdgid',
			fieldLabel : '概算名称',  
			anchor : '95%'
		},'bdgno' : {  
			name : 'bdgno',
			fieldLabel : '概算编号',  
			hideLabel : true
		},'bdgname' : { 
			name : 'bdgname',
			fieldLabel : '概算名称',
			hideLabel : true
		},'useMan' : { 
			name : 'useMan',
			fieldLabel : '使用人',
			anchor : '95%'
		},'outType' : { 
			name : 'outType',
			fieldLabel : '出库类型',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'outId', type: 'string'}, 
    	{name: 'appId', type: 'string'}, 
    	{name: 'inId', type: 'string'}, 
    	{name: 'goodsId', type: 'string'}, 
    	{name: 'subNo', type: 'string'}, 
    	{name: 'matId', type: 'string'},   
    	{name: 'catNo', type: 'string'},
    	{name: 'catName', type: 'string'},  
		{name: 'spec', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'appNum', type: 'float'},
		{name: 'realNum', type: 'float'},
		{name: 'money', type: 'float'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'useMan', type: 'string'},
		{name: 'outType', type: 'float'}
		];
		
	var PlantB = Ext.data.Record.create(ColumnsB);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantIntB = {
		uuid : null,
		outId:'',
		appId:'',
		inId:'',
		goodsId:'',
		subNo:'',
		matId:'',
		catNo : '',
		catName : '',
		spec : '',
		unit:'',
		price:null,
		appNum:null,
		realNum:null,
		money:null,
		bdgid:'',
		bdgno:'',
		bdgname:'',
		useMan:'',
		outType: null
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
	
	
