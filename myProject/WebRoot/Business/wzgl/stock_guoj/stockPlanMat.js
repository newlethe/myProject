var beanB = "com.sgepit.pmis.wzgl.hbm.WzCjhxb"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";
var csdmWindow,gridCsdm
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
		anchor : '95%'
	},'bz' : {  
		name : 'bz',
		fieldLabel : '备注',
		anchor : '95%'
	},'dhsl' : {  
		name : 'dhsl',
		fieldLabel : '到货数量',  
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
		name : 'csdm',
		fieldLabel : '供货商',  
		anchor : '95%'
	},'sjdj' : {  
		name : 'sjdj',
		fieldLabel : '采购单价',  
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
        triggerAction: 'all',
        store: dsBuyMethod,              
        lazyRender:true,
        listClass: 'x-combo-list-small',
		anchor : '95%'
	},'pid' : {
		name : 'pid',
		fieldLabel : 'PID',
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
	{name: 'dhsl', type: 'float'},
	{name: 'kcsl', type: 'float'},
	{name: 'ygsl', type: 'float'},
	{name: 'xz', type: 'string'},
	{name: 'sjdj', type: 'float'},
	{name: 'csdm', type: 'string'},
	{name: 'yjdhrq', type: 'date',dateFormat: 'Y-m-d'},		
	{name: 'sqr', type: 'string'},
	{name: 'xqrq', type: 'date',dateFormat: 'Y-m-d'},
	{name: 'bz', type: 'string'},
	{name: 'bh', type: 'string'},
	{name: 'pid', type: 'string'}
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
	dhsl:'',
	kcsl : null,
	ygsl:null,
	xz:'',
	sjdj:null,		
	csdm:'',
	yjdhrq: '',
	sqr: '',
	xqrq: '',
	bz: '',		
	bh:'',
	pid:CURRENTAPPID
}

var dsB = new Ext.data.Store({
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : " 1=1 and pid='"+CURRENTAPPID+"' "
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
		width :80
	}, {
		id : 'kcsl',
		header : fcB['kcsl'].fieldLabel,
		dataIndex : fcB['kcsl'].name,
		align:"center"
	},{
		id : 'dhsl',
		header : fcB['dhsl'].fieldLabel,
		dataIndex : fcB['dhsl'].name,
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
		editor : new fm.NumberField(fcB['ygsl'])
	}, {
		id : 'xz',
		header : fcB['xz'].fieldLabel,
		dataIndex : fcB['xz'].name,
		renderer: function(value) {
        	for(var i=0; i<buyMethodSt.length; i++){
           	 	if (value == buyMethodSt[i][0])
           	 		return buyMethodSt[i][1]
           	 }
        },
        align:"center",hidden:true,
		editor : new fm.ComboBox(fcB['xz'])
	},{
		id : 'csdm',
		header : fcB['csdm'].fieldLabel,
		dataIndex : fcB['csdm'].name,
		renderer: function(value){
			return value+ "<U style='cursor:hand' onclick=selectCsdm() ><font color=red>选择</font></U>"
		}
	},{
		id : 'sjdj',
		header : fcB['sjdj'].fieldLabel,
		dataIndex : fcB['sjdj'].name,
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
		id : 'bz',hidden:true,
		header : fcB['bz'].fieldLabel,
		dataIndex : fcB['bz'].name
	},{
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
])
cmB.defaultSortable = true;	
//------------------选则供货商
	var dsCsdm = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: 'com.sgepit.pmis.wzgl.hbm.WzCsb',
			business: 'baseMgm',
			method: 'findWhereOrderBy'
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'uids'
		}, [
		{name:'uids',type:'string'},
		{name:'csdm',type:'string'},
		{name:'isused',type:'string'},
		{name:'csmc',type:'string'},
		{name:'gb',type:'string'},
		{name:'tel',type:'string'},
		{name:'post',type:'string'},
		{name:'addr',type:'string'},
		{name:'fax',type:'string'},
		{name:'fr',type:'string'},
		{name:'lxr',type:'string'},
		{name:'email',type:'string'},
		{name:'mobil',type:'string'},
		{name:'bank',type:'string'},
		{name:'accountNumber',type:'string'},
		{name:'taxNumber',type:'string'},
		{name:'flbm',type:'string'},
		{name:'bz',type:'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	gridCsdm = new Ext.grid.GridPanel({
		ds: dsCsdm,
		cm: new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer({
				width: 20
			}), 
		{id:'uids',header:'流水号',dataIndex:'uids',hidden:true},
    	{id:'isused',header:'是否启用',dataIndex:'isused',width:50,hidden:true },
    	{id:'csdm',header:'厂商代码',dataIndex:'csdm',width:50,hidden:true},
    	{id:'csmc',header:'厂商名称',dataIndex:'csmc',width:50},
    	{id:'gb',header:'国家',dataIndex:'gb',width:50,hidden:true},
    	{id:'tel',header:'电话',dataIndex:'tel',width:50},
    	{id:'post',header:'邮编',dataIndex:'post',width:50,hidden:true},
    	{id:'addr',header:'地址',dataIndex:'addr',width:50},
    	{id:'fax',header:'传真',dataIndex:'fax',width:50,hidden:true},
    	{id:'fr',header:'法人',dataIndex:'fr',width:50,hidden:true},
    	{id:'lxr',header:'联系人',dataIndex:'lxr',width:50,hidden:true},
    	{id:'email',header:'邮箱',dataIndex:'email',width:50,hidden:true},
    	{id:'mobil',header:'手机',dataIndex:'mobil',width:50,hidden:true},
    	{id:'bank',header:'开户行',dataIndex:'bank',width:50},
    	{id:'accountNumber',header:'银行帐号',dataIndex:'accountNumber',width:50},
    	{id:'taxNumber',header:'税号',dataIndex:'taxNumber',width:50,hidden:true},
    	{id:'flbm',header:'分类编码',dataIndex:'flbm',width:50,hidden:true},
    	{id:'bz',header:'备注',dataIndex:'bz',width:50,hidden:true}
		]),
		region: 'center',
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsCsdm,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
       
     
	});
	dsCsdm.baseParams.params="isused=1 and pid='"+CURRENTAPPID+"'";
	dsCsdm.load({ params:{start: 0, limit: PAGE_SIZE }});
function selectCsdm(){
if (!csdmWindow) {
		csdmWindow = new Ext.Window({
			title: '供货商列表',
			iconCls: 'form', layout: 'border',
			closeAction: 'hide',
			width: 592, height: 280,
			modal: true, resizable: false,
			closable: true, border: false,
			maximizable: false, plain: true,
			tbar: [
				{text: '选择', iconCls: 'save', handler: function(){
						var sm = gridCsdm.getSelectionModel()
						//var smB =gridPanelB.getSelectionModel()
						//alert(smB.getSelected().get('csdm'))
						if (sm.getSelected()){
							var record = gridPanelB.getSelectionModel().getSelected();
							var num_h = gridPanelB.getStore().indexOf(record);
							//alert(gridPanelB.getStore().getAt(num_h).get('pm'))
							gridPanelB.getStore().getAt(num_h).set("csdm",sm.getSelected().get('csmc'));  
							csdmWindow.hide();
						} else {
							Ext.example.msg('提示', '请选择数据！');
						}
					}
				}
			],
			items: [gridCsdm]
		});
	}
	csdmWindow.show();
	gridCsdm.on('rowselect', function(grid, rowIndex, e){
		cmp.setValue(grid.getStore().getAt(rowIndex).get('csmc'));
		csdmWindow.hide();
	});
	gridCsdm.getStore().load();
}
	

