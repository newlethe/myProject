var beanB = "com.sgepit.pmis.material.hbm.MatGoodsChecksub"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "catNo";
var isIn = [[1,'是'], [2,'否']]

	var dsIsIn = new Ext.data.SimpleStore({
	        fields: ['k', 'v'],   
	        data: isIn
	});

	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',  
			hideLabel : true
		},'checkId' : {
			name : 'checkId',
			fieldLabel : '到货验收单号',  
			hideLabel : true
		},'formId' : {
			name : 'formId',
			fieldLabel : '采购单主键',  
			hideLabel : true
		},'subNo' : {
			name : 'subNo',
			fieldLabel : '序号'
		},'matid' : {  
			name : 'matid',
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
		},'material' : {
			name : 'material',
			fieldLabel : '材质',
			anchor : '95%'
		},'acceptNum' : {  
			name : 'acceptNum',
			fieldLabel : '应收数量',  
			anchor : '95%'
		},'realNum' : {  
			name : 'realNum',
			fieldLabel : '实收数量',  
			anchor : '95%'
		},'factory' : {  
			name : 'factory',
			fieldLabel : '生产厂家',
			anchor : '95%'
		},'reportNo' : {  
			name : 'reportNo',
			fieldLabel : '出厂报告编号',  
			anchor : '95%'
		},'report' : {  
			name : 'report',
			fieldLabel : '出厂报告',  
			anchor : '95%'
		},'duplicateNo' : {  
			name : 'duplicateNo',
			fieldLabel : '复检报告编号',  
			anchor : '95%'
		},'duplicate' : {  
			name : 'duplicate',
			fieldLabel : '复检报告',  
			anchor : '95%'
		},'record' : { 
			name : 'record',
			fieldLabel : '验货记录',
			format: 'Y-m-d',
			anchor : '95%'
		},'remark' : {  
			name : 'remark',
			fieldLabel : '备注',  
			anchor : '95%'
		},'isIn' : {  
			name : 'isIn',
			fieldLabel : '是否入库', 
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsIsIn,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'}, 
    	{name: 'subNo', type: 'string'}, 
    	{name: 'matid', type: 'string'},   
    	{name: 'catNo', type: 'string'},
    	{name: 'catName', type: 'string'},   
		{name: 'spec', type: 'string'},
		{name: 'material', type: 'string'},
		{name: 'acceptNum', type: 'float'},
		{name: 'realNum', type: 'float'},
		{name: 'factory', type: 'string'},
		{name: 'reportNo', type: 'string'},
		{name: 'report', type: 'string'},
		{name: 'duplicateNo', type: 'string'},
		{name: 'duplicate', type: 'string'},
		{name: 'record', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'isIn', type: 'string'},
		{name: 'checkId', type: 'string'} ,
		{name: 'formId', type: 'string'}
		];
		
	var PlantB = Ext.data.Record.create(ColumnsB);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantIntB = {
		uuid : null,
		subNo:appNo,
		matid:'',
		catNo : '',
		catName : '',
		spec : '',
		material:'',
		acceptNum:null,
		realNum:null,
		factory:'',
		reportNo:'',
		report:'',
		duplicateNo:'',
		duplicate: '',
		record: '',
		remark:'',
		isIn: 2,
		formId:'',
		checkId:''
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
	},{
		id : 'matid',
		header : fcB['matid'].fieldLabel,
		dataIndex : fcB['matid'].name,
		hidden : true
	},{
		id : 'formId',
		header : fcB['formId'].fieldLabel,
		dataIndex : fcB['formId'].name,
		hidden : true
	}, {
		id : 'checkId',
		header : fcB['checkId'].fieldLabel,
		dataIndex : fcB['checkId'].name,
		hidden : true
	}, {
		id : 'subNo',
		header : fcB['subNo'].fieldLabel,
		dataIndex : fcB['subNo'].name,
		width : 40,
		editor : new fm.TextField(fcB['subNo'])
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
		id : 'material',
		header : fcB['material'].fieldLabel,
		dataIndex : fcB['material'].name,
		width : 40
	}, {
		id : 'acceptNum',
		header : fcB['acceptNum'].fieldLabel,
		dataIndex : fcB['acceptNum'].name,
		width : 60,
		editor : new fm.NumberField(fcB['acceptNum'])
	}, {
		id : 'realNum',
		header : fcB['realNum'].fieldLabel,
		dataIndex : fcB['realNum'].name,
		width : 60,
		editor : new fm.NumberField(fcB['realNum'])
	},{
		id : 'factory',
		header : fcB['factory'].fieldLabel,
		dataIndex : fcB['factory'].name,
		width : 60,
		editor : new fm.TextField(fcB['factory'])
	},{
		id : 'reportNo',
		header : fcB['reportNo'].fieldLabel,
		dataIndex : fcB['reportNo'].name,
		width : 60,
		editor : new fm.TextField(fcB['reportNo'])
	},{
		id : 'report',
		header : fcB['report'].fieldLabel,
		dataIndex : fcB['report'].name,
		width : 60,
		editor : new fm.TextField(fcB['report'])
	},{
		id : 'duplicateNo',
		header : fcB['duplicateNo'].fieldLabel,
		dataIndex : fcB['duplicateNo'].name,
		width : 60,
		editor : new fm.TextField(fcB['duplicateNo'])
	},{
		id : 'duplicate',
		header : fcB['duplicate'].fieldLabel,
		dataIndex : fcB['duplicate'].name,
		width : 60,
		editor : new fm.TextField(fcB['duplicate'])
	},{
		id : 'record',
		header : fcB['record'].fieldLabel,
		dataIndex : fcB['record'].name,
		width : 60,
		editor : new fm.TextField(fcB['record'])
	},{
		id : 'remark',
		header : fcB['remark'].fieldLabel,
		dataIndex : fcB['remark'].name,
		hidden : true
	},{
		id : 'isIn',
		header : fcB['isIn'].fieldLabel,
		dataIndex : fcB['isIn'].name,
		hidden : true
	}])
	cmB.defaultSortable = true;
