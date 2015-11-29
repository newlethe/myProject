var beanB = "com.sgepit.pmis.material.hbm.MatAppbuyMaterial"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uuid";
var orderColumnB = "catNo";
var isBuy = [[1,'是'], [2,'否']]

	var dsIsBuy = new Ext.data.SimpleStore({
	        fields: ['k', 'v'],   
	        data: isBuy
	    });

	var smB = new Ext.grid.CheckboxSelectionModel()
	
	var fm = Ext.form;			
	var fcB = { 
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',  
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
		},'enName' : {
			name : 'enName',
			fieldLabel : '英文名',
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
		},'material' : {
			name : 'material',
			fieldLabel : '材质',
			anchor : '95%'
		},'warehouse' : {  
			name : 'warehouse',
			fieldLabel : '仓库名',  
			anchor : '95%'
		},'wareNo' : {  
			name : 'wareNo',
			fieldLabel : '货位号',  
			anchor : '95%'
		},'remark' : {  
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		},'appid' : {  
			name : 'appid',
			fieldLabel : '申请计划主键',  
			anchor : '95%'
		},'appNo' : {  
			name : 'appNo',
			fieldLabel : '编号',  
			readOnly:true,
			selectOnFocus: true,
			anchor : '95%'
		},'appNum' : {  
			name : 'appNum',
			fieldLabel : '申请数量',  
			selectOnFocus: true,
			anchor : '95%'
		},'sum' : {  
			name : 'sum',
			fieldLabel : '总价',  
			anchor : '95%'
		},'appDate' : { 
			name : 'appDate',
			fieldLabel : '需求日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'buyId' : {  
			name : 'buyId',
			fieldLabel : '采购计划主键',  
			anchor : '95%'
		},'buyNo' : {  
			name : 'buyNo',
			fieldLabel : '采购计划编号',  
			anchor : '95%'
		},'buyNum' : {  
			name : 'buyNum',
			fieldLabel : '采购数量',  
			selectOnFocus: true,
			anchor : '95%'
		},'buyWay' : {  
			name : 'buyWay',
			fieldLabel : '采购方式',  
			anchor : '95%'
		},'formId' : {  
			name : 'formId',
			fieldLabel : '采购单主键',  
			anchor : '95%'
		},'formNo' : { 
			name : 'formNo',
			fieldLabel : '采购单编号',  
			selectOnFocus: true,
			anchor : '95%'
		},'storage' : {  
			name : 'storage',
			fieldLabel : '库存',  
			anchor : '95%'
		},'isBuy' : {  
			name : 'isBuy',
			fieldLabel : '是否采购',  
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsIsBuy,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},'isIn' : {  
			name : 'isIn',
			fieldLabel : '是否入库', 
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsIsBuy,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		}
	}

    var ColumnsB = [
    	{name: 'uuid', type: 'string'},
    	{name: 'matId', type: 'string'}, 
    	{name: 'catNo', type: 'string'},    		
		{name: 'catName', type: 'string'},
		{name: 'enName', type: 'string'},  	
		{name: 'spec', type: 'string' },
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'material', type: 'string'},
		{name: 'warehouse', type: 'string'},
		{name: 'wareNo', type: 'string'},
		{name: 'remark', type: 'string'},
		
		{name: 'appid', type: 'string'},
		{name: 'appNo', type: 'string'},
		{name: 'appNum', type: 'float'},
		{name: 'sum', type: 'float'},
		{name: 'appDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'},  
		
		{name: 'buyId', type: 'string'},
		{name: 'buyNo', type: 'string'},
		{name: 'buyNum', type: 'float'}, 
		{name: 'buyWay', type: 'string'},
		
		{name: 'formId', type: 'string'},
		{name: 'formNo', type: 'string'},
		
		{name: 'storage', type: 'float'},
		{name: 'isBuy', type: 'string'},
		{name: 'isIn', type: 'string'}
		];
		
	var PlantB = Ext.data.Record.create(ColumnsB);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantIntB = {
		uuid : '',
		matId:'',
		catNo : '',
		catName : '',
		enName:'',
		spec : '',
		unit: '',
		price : null,
		warehouse:'',
		wareNo:'',
		remark:'',
		material:'',
		
		appid:'',
		appNo: '',
		appNum: null,
		sum: null,
		appDate: '',
		
		buyId:'',
		buyNo: '',
		buyNum:null,
		buyWay:'',
		
		formId:'',
		formNo:'',
		
		storage:null,
		isBuy:2,
		isIn:2
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
	
	
	/*
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name,
		hidden : true
	}, {
		id : 'catNo',
		header : fcB['catNo'].fieldLabel,
		dataIndex : fcB['catNo'].name,
		width : 60,
		editor : new fm.TextField(fcB['catNo'])
	}, {
		id : 'catName',
		header : fcB['catName'].fieldLabel,
		dataIndex : fcB['catName'].name,
		width : 100,
		editor : new fm.TextField(fcB['catName'])
	}, {
		id : 'enName',
		header : fcB['enName'].fieldLabel,
		dataIndex : fcB['enName'].name,
		width : 100,
		editor : new fm.TextField(fcB['enName'])
	}, {
		id : 'spec',
		header : fcB['spec'].fieldLabel,
		dataIndex : fcB['spec'].name,
		width : 60,
		editor : new fm.TextField(fcB['spec'])
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		width : 30,
		editor : new fm.TextField(fcB['unit'])
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		width : 30,
		editor : new fm.NumberField(fcB['price'])
	}, {
		id : 'material',
		header : fcB['material'].fieldLabel,
		dataIndex : fcB['material'].name,
		width : 30,
		editor : new fm.TextField(fcB['material'])
	}, {
		id : 'warehouse',
		header : fcB['warehouse'].fieldLabel,
		dataIndex : fcB['warehouse'].name,
		width : 30,
		editor : new fm.TextField(fcB['warehouse'])
	}, {
		id : 'wareNo',
		header : fcB['wareNo'].fieldLabel,
		dataIndex : fcB['wareNo'].name,
		width : 30,
		editor : new fm.TextField(fcB['wareNo'])
	}, {
		id : 'remark',
		header : fcB['remark'].fieldLabel,
		dataIndex : fcB['remark'].name,
		width : 30,
		editor : new fm.TextField(fcB['remark'])
	}, {
		id : 'storage',
		header : fcB['storage'].fieldLabel,
		dataIndex : fcB['storage'].name,
		width : 30,
		editor : new fm.NumberField(fcB['storage'])
	}, {
		id : 'appNum',
		header : fcB['appNum'].fieldLabel,
		dataIndex : fcB['appNum'].name,
		hidden : true
	}, {
		id : 'appNum',
		header : fcB['appNum'].fieldLabel,
		dataIndex : fcB['appNum'].name,
		hidden : true
	}])
	cmB.defaultSortable = true;
	
	

	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [],
		border : false,
		region : 'south',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		crudText:{add:'批准编码'},
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		businessB : beanB,
		business : businessB,
		primaryKey : primaryKeyB
	});

*/

