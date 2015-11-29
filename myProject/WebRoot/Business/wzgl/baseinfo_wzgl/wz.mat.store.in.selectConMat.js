//合同物资清单
var beanB = "com.sgepit.pmis.wzgl.hbm.ConMat"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";
var gridPanelMat
var smB = new Ext.grid.CheckboxSelectionModel()	
var matGridSaveBtn	
var dsB

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function(){
	
	btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	})
   btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	var fcB = { 
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',  
			hideLabel : true
		},'hth' : {
			name : 'hth',
			fieldLabel : '采购合同',  
			hideLabel : true
		},'pid' : {
			name : 'pid',
			fieldLabel : 'pid',  
			hideLabel : true
		},'cgjhbh' : {
			name : 'cgjhbh',
			fieldLabel : '采购计划',  
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
		},'jhdj' : {
			name : 'jhdj',
			fieldLabel : '采购计划单价',
			anchor : '95%'
		},'dj' : {
			name : 'dj',
			fieldLabel : '合同价格',
			anchor : '95%'
		},'sl' : {
			name : 'sl',
			fieldLabel : '合同数量',
			anchor : '95%'
		},'dhsl' : {
			name : 'dhsl',
			fieldLabel : '到货数量',
			anchor : '95%'
		},'zj' : {
			name : 'zj',
			fieldLabel : '总价',
			anchor : '95%'
		},'dhrq' : {
			name : 'dhrq',
			fieldLabel : '到货日期',
			anchor : '95%'
		},'bz' : {  
			name : 'bz',
			fieldLabel : '备注',
			anchor : '95%'
		},'zzcs' : {  
			name : 'zzcs',
			fieldLabel : '制造厂商',
			anchor : '95%'
		},'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			hidden : true
		}
		
	}
	
	
	var ColumnsB = [
	  	{name: 'uids', type: 'string'},
	  	{name: 'hth', type: 'string'},
	  	{name: 'pid', type: 'string'},
	  	{name: 'cgjhbh', type: 'string'},
	  	{name: 'bm', type: 'string'},    		
		{name: 'pm', type: 'string'},
		{name: 'gg', type: 'string' },
		{name: 'dw', type: 'string'},
		{name: 'jhdj', type: 'float'},
		{name: 'dj', type: 'float'},	
		{name: 'sl', type: 'float'},
		{name: 'dhsl', type: 'float'},
		{name: 'zj', type: 'float'},
		{name: 'dhrq', type: 'date'},
		{name: 'zzcs', type: 'string'},
		{name: 'bz', type: 'string'},
		{name: 'pid', type: 'string'}
	];
	
	dsB = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanB,
			business : businessB,
			method : listMethodB,
			params : "hth = '"+conid+"' and bm not in(select matId from com.sgepit.pmis.material.hbm.MatStoreInsub where inId ='"+appid+"' and inType='采购合同' and "+pidWhereString+" ) and "+pidWhereString+
			           " and uids not in (select conmatuids from com.sgepit.pmis.wzgl.hbm.WzGoodsArrivalSub where arrivalId='"+appid+"')"
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
	new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}), {
		id : 'uids',
		header : fcB['uids'].fieldLabel,
		dataIndex : fcB['uids'].name,
		hidden : true
	}, {
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	},{
		id : 'hth',
		header : fcB['hth'].fieldLabel,
		dataIndex : fcB['hth'].name,
		hidden : true
	},{
		id : 'bm',
		header : fcB['bm'].fieldLabel,
		dataIndex : fcB['bm'].name,
		hidden : true,
		width :100
	}, {
		id : 'pm',
		header : fcB['pm'].fieldLabel,
		dataIndex : fcB['pm'].name,
		align:"center",
		width :100
		
	}, {
		id : 'gg',
		header : fcB['gg'].fieldLabel,
		dataIndex : fcB['gg'].name,
		align:"center",
		width :100
	}, {
		id : 'dw',
		header : fcB['dw'].fieldLabel,
		dataIndex : fcB['dw'].name,
		align:"center",
		width :40
	}, {
		id : 'jhdj',
		header : fcB['jhdj'].fieldLabel,
		dataIndex : fcB['jhdj'].name,
		
		align:"center",
		//hidden:true,
		width :80
	}, {
		id : 'dj',
		header : fcB['dj'].fieldLabel,
		dataIndex : fcB['dj'].name,
		align:"center",
		hidden:true,
		width :80
		//editor : new Ext.form.NumberField(fcB['dj']),
		//renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
	}, {
		id : 'sl',
		header : fcB['sl'].fieldLabel,
		dataIndex : fcB['sl'].name,
		align:"center",
		width :60,
		editor : new Ext.form.NumberField(fcB['sl']),
		renderer:function(value,cell){ cell.attr = "style=background-color:#FBF8BF";return value}
	}, {
		id : 'dhsl',
		header : fcB['dhsl'].fieldLabel,
		dataIndex : fcB['dhsl'].name,
		width :80,
		hidden:true,
		align:"center"
	}, {
		id : 'zj',
		header : fcB['zj'].fieldLabel,
		dataIndex : fcB['zj'].name,
		align:"center",
		width :100,
		
		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
			return record.data.sl*record.data.jhdj;
		}
	}, {
		id : 'dhrq',
		header : fcB['dhrq'].fieldLabel,
		dataIndex : fcB['dhrq'].name,
		hidden:true,
		align:"center"
	}, {
		id : 'cgjhbh',
		header : fcB['cgjhbh'].fieldLabel,
		dataIndex : fcB['cgjhbh'].name,
		hidden:true,
		width :80
	},{
		id : 'zzcs',
		header : fcB['zzcs'].fieldLabel,
		dataIndex : fcB['zzcs'].name,
		hidden: true,
		hidden:true,
		align:"center"
	}, {
		id : 'bz',
		header : fcB['bz'].fieldLabel,
		dataIndex : fcB['bz'].name,
		editor : new Ext.form.TextField(fcB['bz'])
	}, {
		id : 'pid',
		header : fcB['pid'].fieldLabel,
		dataIndex : fcB['pid'].name,
		hidden : true
	}
	])
	gridPanelMat = new Ext.grid.EditorGridTbarPanel({
		id : 'matPanel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		clicksToEdit : 1,
		loadMask: true,		
		region: 'center',
		title:'合同物资清单',
		tbar:['<font color=#15428b><b>&nbsp;从采购合同选择物资</b></font>','->',btnConfirm],
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		saveBtn: false,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		addBtn : false,
		delBtn : false,
		business : businessB,		
		primaryKey : primaryKeyB ,		

		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: dsB,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
		
	});
	var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanelMat]
    }); 
    dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
})

function confirmChoose(){
	var recArr = smB.getSelections();
	var chooseUids = new Array();
	if(recArr.length >0){
		for(var i=0;i<recArr.length;i++){
			chooseUids.push(recArr[i].data.uids);
		}
		wzbaseinfoMgm.saveStoreWzInByCon(appid,chooseUids,dhNo,function(dat){
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