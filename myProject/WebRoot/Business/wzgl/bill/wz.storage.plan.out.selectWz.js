var beanB = "com.sgepit.pmis.wzgl.hbm.WzCjsxb"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";

//申请计划主表WzCjspb
//申请计划子表WzCjsxb

var gridPanelB,dsB
var buyMethodSt = new Array();

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function(){

	var dsBuyMethod = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
    	data: buyMethodSt
	});

	var btnConfirm = new Ext.Button({
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
		fieldLabel : '物资编码',  
		hideLabel : true
	},'bh' : {
		name : 'bh',
		fieldLabel : '申请编号',  
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
		fieldLabel : '计划单价',
		anchor : '95%'
	},'sqsl' : {  
		name : 'sqsl',
		fieldLabel : '申请数量',
		anchor : '95%'
	},
	'ftsl':{name:'ftsl',fieldLabel:'分摊数量',anchor:'95%'},
	'tdTotalNum':{name:'tdTotalNum',fieldLabel:'替代总数量',anchor:'95%'},
	'sqsl_dj':{name:'sqsl_dj',fieldLabel:'申请总金额',anchor:'95%'},
	'xqrq':{name:'xqrq',fieldLabel:'需求日期',format: 'Y-m-d',anchor:'95%'},
	'pid':{name:'pid',fieldLabel:'PID',hidden:true}
	//'kc_price':{name:'kc_price',fieldLabel:'库存单价',anchor:'95%'}
}

   var ColumnsB = [
   	{name: 'uids', type: 'string'},
   	{name: 'bm', type: 'string'},
   	{name: 'bh', type: 'string'},    		
	{name: 'pm', type: 'string'},
	{name: 'gg', type: 'string' },
	{name: 'dw', type: 'string'},
	{name: 'dj', type: 'float'},
	{name: 'sqsl', type: 'float'},
	{name: 'ftsl', type: 'float'},
	{name: 'tdTotalNum', type: 'float'},
	{name: 'sqsl_dj', type: 'float'},
	{name: 'xqrq',type:'date',dateFormat:'Y-m-d H:i:s'},
	{name: 'pid', type: 'string'}
//	/{name:'kc_price',type:'float'}
	];

dsB = new Ext.data.GroupingStore({ // 分组
	baseParams : {
		ac : 'list',
		bean : beanB,
		business : businessB,
		method : listMethodB,
		params : pidWhereString
		//selectUuid
		//parame : "sl - ffsl > 0 and bh in (select bh from com.sgepit.pmis.wzgl.hbm.WzCjspb where billState='1' and sqr='"+USERID+"' "
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
dsB.load({ params:{start: 0, limit: 20 }});

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
        type:'string',
		align:"center"
	}, {
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name,
		hidden : true
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
        type:'string',
		align:"center"
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
        type:'string',
		align:"center"
	}, {
		id : 'dw',
		header : fcB['dw'].fieldLabel,
		dataIndex : fcB['dw'].name,
		align:"center"
	}, {
		id : 'dj',
		header : fcB['dj'].fieldLabel,
		dataIndex : fcB['dj'].name,
		align:"center"
	},{
		id : 'sqsl',
		header : fcB['sqsl'].fieldLabel,
		dataIndex : fcB['sqsl'].name,
		align:"center"
	},{
		id : 'ftsl',
		header : fcB['ftsl'].fieldLabel,
		dataIndex : fcB['ftsl'].name,
		align:"center"
	},{
		id : 'tdTotalNum',
		header : fcB['tdTotalNum'].fieldLabel,
		dataIndex : fcB['tdTotalNum'].name,
		align:"center"
	},{
		id : 'sqsl_dj',
		header : fcB['sqsl_dj'].fieldLabel,
		dataIndex : fcB['sqsl_dj'].name,
		align:"center",
		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sqsl*record.data.dj;
		}
	},{
		id : 'xqrq',
		header : fcB['xqrq'].fieldLabel,
		dataIndex : fcB['xqrq'].name,
		align:"center",
		renderer:formatDate
	},{
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
	/*,{
		id:'kc_price',
		header:fcB['kc_price'].fieldLabel,
		dataIndex:fcB['kc_price'].name,
		align:"center",
		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
			DWREngine.setAsync(false);
			var avg_price;
			var sql="select nvl(price_avg,0) from wz_bm where bm='"+record.data.bm+"'";
			baseMgm.getData(sql,function(value){
				record.data.kc_price=value
			})
			return record.data.kc_price;
			DWREngine.setAsync(true);
		}
	}*/
])
cmB.defaultSortable = true;	
	


	//-----------------------------------------从grid begin-------------------------
	gridPanelB = new Ext.grid.GridPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar:['<font color=#15428b><b>&nbsp;从申请计划选择物资</b></font>','->',{
                    text : '查询',
                    iconCls : 'option',
                    handler : function(){
                        showWindow(gridPanelB);
                    }
                },'-',btnConfirm],
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
			pageSize : 20,
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
	storeSelects(dsB,smB);
	
	
	//var viewport = new Ext.Viewport({
	//	layout : 'border',
	//	items : [gridPanelB]
	//});
	selectWin = new Ext.Window({
		title:'选择物资',
		buttonAlign:'center',
		layout:'border',
		width: document.body.clientWidth*.9,
	    height: document.body.clientHeight*.9,
	    modal: true,
	    constrain:true,
	    maximizable: true,
	    closeAction: 'hide',
	    plain: true,
		items:[gridPanelB],
		buttons:[{id:'btnSavfe',text:'确定选择' ,handler:confirmChoose},{text:'取消',handler:function(){selectWin.hide()}}]
	});
		
	
	function confirmChoose(){
		var recArr = collectionToRecords();
		var selectRows = gridPanelB.getSelectionModel().getSelected();
		var chooseArr = new Array();
		if(recArr.length >0){
			for(var i=0;i<recArr.length;i++){
				//chooseMatArr.push(recArr[i].data.bm);
				//chooseUidsArr.push(recArr[i].data.uids);
				var obj = new Object();
				obj.outId = selectUuid;
				obj.appId = recArr[i].data.bh;
				obj.matId = recArr[i].data.uids;
				obj.catNo = recArr[i].data.bm;
				obj.catName = recArr[i].data.pm;
				obj.spec = recArr[i].data.gg;
				obj.unit = recArr[i].data.dw;
				obj.appNum = recArr[i].data.sqsl;
				obj.price = recArr[i].data.dj;
				obj.money = '';
				obj.outType = '4';
				obj.pid = CURRENTAPPID
				chooseArr.push(obj)
			}
			matStoreMgm.saveMatStoreOutSub(chooseArr,function(state){
	  			Ext.example.msg('提示！', '选择成功！');
	  			selectWin.hide();
	  			smB.clearSelections();
	  			dsOut.load({params:{start:0,limit:PAGE_SIZE_OUT}});
	  		})
		}else{
			Ext.Msg.alert("提示","请选择物资")
		} 
	}
	
	function formatDate(value){ 
     return value ? value.dateFormat('Y-m-d') : '';
 };
})