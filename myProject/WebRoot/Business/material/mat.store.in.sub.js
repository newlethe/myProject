var beanB = "com.sgepit.pmis.material.hbm.MatStoreInsub"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "inType";

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',  
			hideLabel : true
		},'inId' : {
			name : 'inId',
			fieldLabel : '入库单'
		},'appId' : {
			name : 'appId',
			fieldLabel : '申请计划'
		},'formId' : {
			name : 'formId',
			fieldLabel : '采购单'
		},'goodsIn' : {
			name : 'goodsIn',
			fieldLabel : '到货单'
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
		},'factory' : {
			name : 'factory',
			fieldLabel : '生产厂家',
			anchor : '95%'
		},'material' : {
			name : 'material',
			fieldLabel : '材质',
			anchor : '95%'
		},'unit' : {  
			name : 'unit',
			fieldLabel : '单位',  
			anchor : '95%'
		},'price' : {  
			name : 'price',
			fieldLabel : '单价',  
			anchor : '95%'
		},'warehouse' : {  
			name : 'warehouse',
			fieldLabel : '仓库号',
			anchor : '95%'
		},'wareno' : {  
			name : 'wareno',
			fieldLabel : '货位号',  
			anchor : '95%'
		},
		'htcgsl' : {
			name : 'htcgsl',
			fieldLabel : '采购数量',
			anchor : '95%'
		},
		'inNum' : {  
			name : 'inNum',
			fieldLabel : '入库数量',  
			selectOnFocus: true,
			anchor : '95%'
		},'subSum' : {  
			name : 'subSum',
			fieldLabel : '总价',  
			anchor : '95%'
		},'report' : {  
			name : 'report',
			fieldLabel : '报告',  
			anchor : '95%'
		},'inType' : { 
			name : 'inType',
			fieldLabel : '入库类型',
			anchor : '95%'
		},'pid' : { 
			name : 'pid',
			fieldLabel : 'PID',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'inId', type: 'string'}, 
    	{name: 'appId', type: 'string'}, 
    	{name: 'formId', type: 'string'}, 
    	{name: 'goodsIn', type: 'string'}, 
    	{name: 'matId', type: 'string'},   
    	{name: 'catNo', type: 'string'},
    	{name: 'catName', type: 'string'},   
		{name: 'spec', type: 'string'},
		{name: 'material', type: 'string'},
		{name: 'factory', type: 'string'},
		{name: 'warehouse', type: 'string'},
		{name: 'wareno', type: 'string'},
		{name: 'material', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'htcgsl', type: 'float'},//合同采购数量。不属于合同则显示采购计划数量。都不属于则为0
		{name: 'inNum', type: 'float'},
		{name: 'subSum', type: 'float'},
		{name: 'report', type: 'string'},
		{name: 'inType', type: 'string'},
		{name: 'pid', type: 'string'}
		];
		
	var PlantB = Ext.data.Record.create(ColumnsB);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantIntB = {
		uuid : null,
		inId:'',
		appId:'',
		formId:'',
		goodsIn:'',
		matId:'',
		catNo : '',
		catName : '',
		spec : '',
		material:'',
		factory:'',
		unit:'',
		price:'',
		warehouse:'',
		wareno:'',
		htcgsl:'',
		inNum:null,
		subSum:null,
		report:'',
		inType: '',
		pid: CURRENTAPPID
	}

	var dsB = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : pidWhereString
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
	smB, 
	{
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name,
		hidden : true
	},{
		id : 'inId',
		header : fcB['inId'].fieldLabel,
		dataIndex : fcB['inId'].name,
		hidden : true
	}, {
		id : 'appId',
		header : fcB['appId'].fieldLabel,
		dataIndex : fcB['appId'].name,
		hidden : true
	}, {
		id : 'formId',
		header : fcB['formId'].fieldLabel,
		dataIndex : fcB['formId'].name,
		hidden : true
	}, {
		id : 'goodsIn',
		header : fcB['goodsIn'].fieldLabel,
		dataIndex : fcB['goodsIn'].name,
		hidden : true
	}, {
		id : 'matId',
		header : fcB['matId'].fieldLabel,
		dataIndex : fcB['matId'].name,
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
		width : 100
	}, {
		id : 'spec',
		header : fcB['spec'].fieldLabel,
		dataIndex : fcB['spec'].name,
		width : 50
	}, {
		id : 'material',
		header : fcB['material'].fieldLabel,
		dataIndex : fcB['material'].name,
		renderer : function(value){
			var cz="";
			DWREngine.setAsync(false);
		 	appMgm.getCodeValue('wz_property',function(list){         //参数:type_name
				for(i = 0; i < list.length; i++) {
					if(list[i].propertyCode == value){
						cz = list[i].propertyName;
						break;
					}
				}
		    });
		 	DWREngine.setAsync(true);
		 	return cz;
		},
		width : 40
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		align:'center',
		width : 40
	},{
		id : 'factory',
		header : fcB['factory'].fieldLabel,
		dataIndex : fcB['factory'].name,
		width : 60,
		editor : new fm.TextField(fcB['factory']),
		hidden : true
	},{
		id : 'warehouse',
		header : fcB['warehouse'].fieldLabel,
		dataIndex : fcB['warehouse'].name,
		width : 60,
		editor : new fm.TextField(fcB['warehouse'])
	},{
		id : 'wareno',
		header : fcB['wareno'].fieldLabel,
		dataIndex : fcB['wareno'].name,
		width : 60,
		editor : new fm.TextField(fcB['wareno'])
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		editor : new fm.NumberField(fcB['price']),
		align:'right',
		width : 40,
		renderer : function(v){
			return v.toFixed(4);
		}
	},{
		id : 'htcgsl',
		header : fcB['htcgsl'].fieldLabel,
		dataIndex : fcB['htcgsl'].name,
		align:'right',
		width : 60,
		renderer : function(value,cell,record){
			var conid = sm.getSelected().get('conid');
			var cgjhbh = record.get('formId')
			var num = 0;
			if(record.get('inType')=='采购计划'){
				DWREngine.setAsync(false);
				baseMgm.getData("select bm,ygsl from wz_cjhxb where bh='"+cgjhbh+"'",function(obj){
					for(var i=0;i<obj.length;i++){
						if(obj[i][0]==record.get('catNo')){
							num = obj[i][1];
							break;
						}
					}
				})
				DWREngine.setAsync(true);
			}else if(record.get('inType')=='采购合同'){
				DWREngine.setAsync(false);
				baseMgm.getData("select bm,sl from con_mat where hth='"+conid+"'",function(obj){
					for(var i=0;i<obj.length;i++){
						if(obj[i][0]==record.get('matId')){
							num = obj[i][1];
							break;
						}
					}
				})
				DWREngine.setAsync(true);
			}
			return num;
		}
	},
	{
		id : 'inNum',
		header : fcB['inNum'].fieldLabel,
		dataIndex : fcB['inNum'].name,
		align:'right',
		width : 60,
		editor : new fm.NumberField(fcB['inNum'])
	}, {
		id : 'subSum',
		header : fcB['subSum'].fieldLabel,
		dataIndex : fcB['subSum'].name,
		align:'right',
		width : 60,
		renderer : function(v){
			return v.toFixed(4);
		}
	},{
		id : 'report',
		header : fcB['report'].fieldLabel,
		dataIndex : fcB['report'].name,
		width : 60,
		editor : new fm.TextField(fcB['report']),
		hidden : true
	},{
		id : 'inType',
		header : fcB['inType'].fieldLabel,
		dataIndex : fcB['inType'].name,
		width : 60
	}, {
		id : 'formId',
		header : '采购计划编号',
		dataIndex : fcB['formId'].name,
		renderer:function(value, cellmeta, record, rowIndex, columnIndex, store){ 
			if(record.get('inType')=='采购计划'){
				return value;
			}else if(record.get('inType')=='采购合同'){
				return value;
			}
		},
		width : 70
	}, {
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
	
	]);