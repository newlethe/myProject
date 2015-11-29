var beanB = "com.sgepit.pmis.wzgl.hbm.WzCjhxb"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";

var gridPanelB

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function(){

	var dsBuyMethod = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
    	data: buyMethodSt
	});

	btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	})
       

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
			hidden : true
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
	{name: 'bh', type: 'string'},
		{name: 'pid', type: 'string'}
	];

    var where = 
            " bh in (select bh from com.sgepit.pmis.wzgl.hbm.WzCjhpb where 1=1 and "+pidWhereString+" ) " +
            //" bh in (select bh from com.sgepit.pmis.wzgl.hbm.WzCjhpb where billState='1' and "+pidWhereString+" ) " +
            " and uids not in (select matId from com.sgepit.pmis.material.hbm.MatStoreInsub where 1=1 and "+pidWhereString+" ) " +
            " and bm not in (select bm from com.sgepit.pmis.wzgl.hbm.ConMat where bh=cgjhbh and "+pidWhereString+" ) " +
            " and bm not in (select catNo from com.sgepit.pmis.material.hbm.MatStoreInsub where inId='"+inId+"' and "+pidWhereString+" ) " +
            " and "+pidWhereString+" "
var dsB = new Ext.data.GroupingStore({ // 分组
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : where
		//params : " bh in (select bh from com.sgepit.pmis.wzgl.hbm.WzCjhpb where billState='1') and uids not in (select matId from com.sgepit.pmis.material.hbm.MatStoreInsub) and bm not in (select bm from com.sgepit.pmis.wzgl.hbm.ConMat where bh=cgjhbh)"
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
	sortInfo: {field: 'bh', direction: "ASC"},	// 分组
	groupField: 'bh'	// 分组
});

dsB.setDefaultSort(orderColumnB, 'asc');
dsB.load({ params:{start: 0, limit: PAGE_SIZE }});

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
		id : 'hzsl',
		header : fcB['hzsl'].fieldLabel,
		dataIndex : fcB['hzsl'].name,
		align:"center"
	},{
		id : 'ygsl',
		header : fcB['ygsl'].fieldLabel,
		dataIndex : fcB['ygsl'].name,		
		align:"center"
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
        align:"center"
	},{
		id : 'csdm',
		header : fcB['csdm'].fieldLabel,
		dataIndex : fcB['csdm'].name,
		hidden: true
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
		id : 'bz',
		header : fcB['bz'].fieldLabel,
		dataIndex : fcB['bz'].name
	}, {
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
])
cmB.defaultSortable = true;	
	


	//-----------------------------------------从grid begin-------------------------
	var gridPanelB = new Ext.grid.GridPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar:['<font color=#15428b><b>&nbsp;从采购计划选择物资</b></font>','->',btnConfirm],
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
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
		view: new Ext.grid.GroupingView({	// 分组
            forceFit: true,
            groupTextTpl: '{text}(共{[values.rs.length]}项)'
        })
	});
	
	
	
	
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false, 
		items: [gridPanelB]
		
	}) 
	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanelB]
	});	
	
	function confirmChoose(){
		var recArr = smB.getSelections();
		var chooseMatArr = new Array();
		var chooseUidsArr = new Array();
		if(recArr.length >0){
			for(var i=0;i<recArr.length;i++){
				chooseMatArr.push(recArr[i].data.bm);
				chooseUidsArr.push(recArr[i].data.uids);
			}
			matStoreMgm.saveStoreInByPlan(inId,chooseUidsArr,chooseMatArr, function(dat){
				if(dat){  
					parent.selectWin.hide();
				}else{
					Ext.Msg.alert("提示","操作错误")
				}
				
			});
		}else{
			Ext.Msg.alert("提示","请选择物资")
		} 
	}
	
	function formatDate(value){ 
     return value ? value.dateFormat('Y-m-d') : '';
 };
})