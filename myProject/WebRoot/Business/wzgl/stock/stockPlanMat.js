var beanB = "com.sgepit.pmis.wzgl.hbm.WzCjhxb"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
var dsBuyMethod = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: buyMethodSt
});

var smB = new Ext.grid.CheckboxSelectionModel()
var fcB = { 
	'uids' : {
		name : 'uids',
		fieldLabel : '主键',  
		hideLabel : true
	},'bm' : {
		name : 'bm',
		fieldLabel : '编码',  
		hideLabel : true
	},'pm' : {
		name : 'pm',
		fieldLabel : '品名',
		anchor : '95%'
	},'gg' : {
		name : 'gg',
		fieldLabel : '规格型号',
		anchor : '95%'
	},'dw' : {
		name : 'dw',
		fieldLabel : '单位',
		anchor : '95%'
	},'dj' : {
		name : 'dj',
		fieldLabel : '单价',
		decimalPrecision : 4,
		anchor : '95%'
	},'bz' : {  
		name : 'bz',
		fieldLabel : '备注',
		anchor : '95%'
	},'hzsl' : {  
		name : 'hzsl',
		fieldLabel : '申请数量',  
		anchor : '95%'
	},'kcsl' : {  
		name : 'kcsl',
		fieldLabel : '可用库存',  
		anchor : '95%'
	},'ygsl' : {  
		name : 'ygsl',
		fieldLabel : '<font color="red">采购数量</font>',  
		anchor : '95%'
	},'csdm' : {  
		name : 'ygsl',
		fieldLabel : '供货商',  
		anchor : '95%'
	},'sjdj' : {  
		name : 'sjdj',
		fieldLabel : '采购单价',
		decimalPrecision : 4,
		anchor : '95%'
	},'yjdhrq' : {  
		name : 'yjdhrq',
		fieldLabel : '预计到货日期',  
		anchor : '95%'
	},		
	'xqrq' : { 
		name : 'xqrq',
		fieldLabel : '需求日期',
		format: 'Y-m-d',
		anchor : '95%'
	},'sqr' : {  
		name : 'sqr',
		fieldLabel : '申请人',  
		anchor : '95%'
	},'bh' : {  
		name : 'bh',
		fieldLabel : '采购计划编号',  
		anchor : '95%'
	},'xz' : {  
		name : 'xz',
		hiddenName :'xz',
		fieldLabel : '<font color="red">采购方式</font>',  
		valueField:'k',
		displayField: 'v',
		mode: 'local',
        typeAhead: true,
        allowBlank: false,
        triggerAction: 'all',
        store: dsBuyMethod,              
        lazyRender:true,
        listClass: 'x-combo-list-small',
		anchor : '95%'
	}		
}

   var ColumnsB = [
   	{name: 'uids', type: 'string'},
   	{name: 'bm', type: 'string'},    		
	{name: 'pm', type: 'string'},
	{name: 'gg', type: 'string' },
	{name: 'dw', type: 'string'},
	{name: 'dj', type: 'float'},
	{name: 'hzsl', type: 'float'},
	{name: 'kcsl', type: 'float'},
	{name: 'ygsl', type: 'float'},
	{name: 'xz', type: 'string'},
	{name: 'sjdj', type: 'float'},
	{name: 'csdm', type: 'float'},
	{name: 'yjdhrq', type: 'date',dateFormat: 'Y-m-d'},		
	{name: 'sqr', type: 'string'},
	{name: 'xqrq', type: 'date',dateFormat: 'Y-m-d'},
	{name: 'bz', type: 'string'},
	{name: 'bh', type: 'string'}
	];
	
var PlantB = Ext.data.Record.create(ColumnsB);
var PlantIntB = {
	uids : '',
	bm:'',
	pm : '',
	gg : '',
	dw:'',
	dj : null,
	hzsl: null,
	kcsl : null,
	ygsl:null,
	xz:'',
	sjdj:null,		
	csdm:'',
	yjdhrq: '',
	sqr: '',
	xqrq: '',
	bz: '',		
	bh:''
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
var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uids',
		header : fcB['uids'].fieldLabel,
		dataIndex : fcB['uids'].name,
		hidden : true
	},{
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		dataIndex : fcB['bm'].name,
		hidden : true
	}, {
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name,
		hidden : true
	}, {
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		align:"center",
		dataIndex : fcB['bm'].name
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
		align:"center",
		width :200
		
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
		align:"center",
		width :200
	}, {
		id : 'dw',
		header : fcB['dw'].fieldLabel,
		dataIndex : fcB['dw'].name,
		align:"center",
		width :40
	}, {
		id : 'dj',
		header : fcB['dj'].fieldLabel,
		dataIndex : fcB['dj'].name,
		align:"center",
		width :80,
		editor : new fm.NumberField(fcB['dj']),
		renderer : function(value,cell){
			cell.attr = "style=background-color:#FBF8BF";
			return value;
		}
		
	}, {
		id : 'kcsl',
		header : fcB['kcsl'].fieldLabel,
		dataIndex : fcB['kcsl'].name,
		align:"center"
	},{
		id : 'hzsl',
		header : fcB['hzsl'].fieldLabel,
		dataIndex : fcB['hzsl'].name,
		align:"center"
	},{
		id : 'ygsl',
		header : fcB['ygsl'].fieldLabel,
		dataIndex : fcB['ygsl'].name,		
		align:"center",
		renderer:function(value,cell,record){
			if(value>record.get('hzsl')){
				Ext.Msg.show({
					title: '提示',
			        msg: '采购数量不能大于申请数量',
			        icon: Ext.Msg.WARNING, 
			        width:200,
			        buttons: Ext.MessageBox.OK
				})
			}
			return value;
		},
		editor : new fm.NumberField(fcB['ygsl'])
	}, {
		id : 'xz',
		header : fcB['xz'].fieldLabel,
		dataIndex : fcB['xz'].name,
		renderer: function(value,cell) {
			cell.attr = "style=background-color:#FBF8BF";
        	for(var i=0; i<buyMethodSt.length; i++){
           	 	if (value == buyMethodSt[i][0])
           	 		return buyMethodSt[i][1]
           	 }
        },
        align:"center",
		editor : new fm.ComboBox(fcB['xz'])
	},{
		id : 'csdm',
		header : fcB['csdm'].fieldLabel,
		dataIndex : fcB['csdm'].name,
		hidden: true
	},{
		id : 'sjdj',
		header : fcB['sjdj'].fieldLabel,
		dataIndex : fcB['sjdj'].name,
		renderer: function(value,cell){
			return parseFloat(value.toFixed(4));
		},
		hidden: true
	},{
		id : 'yjdhrq',
		header : fcB['yjdhrq'].fieldLabel,
		dataIndex : fcB['yjdhrq'].name,
		hidden: true
	},{
		id : 'xqrq',
		header : fcB['xqrq'].fieldLabel,
		dataIndex : fcB['xqrq'].name,
		hidden: true
	},{
		id : 'sqr',
		header : fcB['sqr'].fieldLabel,
		dataIndex : fcB['sqr'].name,
		hidden: true
	}, {
		id : 'bz',
		header : fcB['bz'].fieldLabel,
		dataIndex : fcB['bz'].name
	}
])
cmB.defaultSortable = true;	
	

