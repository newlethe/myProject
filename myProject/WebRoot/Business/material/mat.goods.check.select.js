var bean = "com.sgepit.pmis.material.hbm.MatAppbuyForm"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "no";

Ext.onReady(function() {

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		    history.back();
		}
	});
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'save',
		handler: select
	});
	var btnSelectAll = new Ext.Button({
		text: '选择所有',
		iconCls: 'save',
		handler: selectAll
	});
	var btnListAll = new Ext.Button({
		text: '列出所有',
		iconCls: 'save',
		handler: listAll
	});
	
    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true})
    
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true
		},'no' : {
			name : 'no',
			fieldLabel : '采购单号',
			anchor : '95%'
		},'formDate' : {
			name : 'formDate',
			fieldLabel : '采购单日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'appMan' : {
			name : 'appMan',
			fieldLabel : '申请人',
			anchor : '95%'
		},'buyMan' : {
			name : 'buyMan',
			fieldLabel : '购买人',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'no', type: 'string'},    		
		{name: 'appMan', type: 'string'},
		{name: 'buyMan', type: 'string'},    	
		{name: 'remark', type: 'string' },
		{name: 'formDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'} 
		];
		
	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		no : appNo,
		appMan : '',
		buyMan:'',
		remark : '',
		formDate: ''
	}

	var cm = new Ext.grid.ColumnModel([
	sm, {
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'no',
		header : fc['no'].fieldLabel,
		dataIndex : fc['no'].name,
		width : 60,
		editor : new fm.TextField(fc['no'])
	}, {
		id : 'appMan',
		header : fc['appMan'].fieldLabel,
		dataIndex : fc['appMan'].name,
		width : 100,
		editor : new fm.TextField(fc['appMan'])
	}, {
		id : 'buyMan',
		header : fc['buyMan'].fieldLabel,
		dataIndex : fc['buyMan'].name,
		width : 100,
		editor : new fm.TextField(fc['buyMan'])
	}, {
		id : 'remark',
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		width : 60,
		editor : new fm.TextField(fc['remark'])
	}, {
		id : 'formDate',  
		header : fc['formDate'].fieldLabel,
		dataIndex : fc['formDate'].name,
		editor : new fm.DateField(fc['formDate']),
		renderer: formatDate,
		width : 40
	}])
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : null
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.GridPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
//		tbar : ['<font color=#15428b><b>选择入库物资-(采购单)</b></font>','-','->', btnReturn],
		border : false,
		region : 'center',
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
			pageSize : 5,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	});
	
	ds.load({ params:{start: 0, limit: 5 }});
	
		//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name,
		hidden : true
	},{
		id : 'matId',
		header : fcB['matId'].fieldLabel,
		dataIndex : fcB['matId'].name,
		hidden : true
	}, {
		id : 'formId',
		header : fcB['formId'].fieldLabel,
		dataIndex : fcB['formId'].name,
		hidden : true
	}, {
		id : 'formNo',
		header : fcB['formNo'].fieldLabel,
		dataIndex : fcB['formNo'].name,
		width : 40,
		editor : new fm.TextField(fcB['formNo'])
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
		id : 'enName',
		header : fcB['enName'].fieldLabel,
		dataIndex : fcB['enName'].name,
		width : 60
	}, {
		id : 'spec',
		header : fcB['spec'].fieldLabel,
		dataIndex : fcB['spec'].name,
		width : 60
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		width : 30
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		width : 30
	}, {
		id : 'material',
		header : fcB['material'].fieldLabel,
		dataIndex : fcB['material'].name,
		width : 30
	}, {
		id : 'warehouse',
		header : fcB['warehouse'].fieldLabel,
		dataIndex : fcB['warehouse'].name,
		width : 30
	}, {
		id : 'wareNo',
		header : fcB['wareNo'].fieldLabel,
		dataIndex : fcB['wareNo'].name,
		width : 30
	}, {
		id : 'remark',
		header : fcB['remark'].fieldLabel,
		dataIndex : fcB['remark'].name,
		width : 30
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
	
	

	var gridPanelB = new Ext.grid.GridPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [btnSelect, '-', btnListAll],
		border : false,
		region : 'south',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 260, 
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
		})
	});
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		tbar:[],
		border: false,
		header: false,
		items: [gridPanel,gridPanelB]
		
	}) 

	//-----------------------------------------从grid end---------------------------
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});

//--------------------------------------function-----------
	
	sm.on('rowselect', function(sm, rowIndex, record){
   		var formId = record.get('uuid');
   		dsB.baseParams.params = " formId ='" + formId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })
   
   function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
   	
   	// 选择要形成采购计划的物资
 	function select(){
 		if (sm.hasSelection()){
   			Ext.get('loading-mask').show();
   			var records = smB.getSelections()
   			var matIds = new Array();
   			for (var i=0; i<records.length; i++){
   				matIds.push(records[i].get('uuid'))
   			}
   			var formId = sm.getSelected().get('uuid');
	 		DWREngine.setAsync(false);  
	 		if (type == 'goods'){
	 			matGoodsMgm.selectGoodsMat(checkId, matIds, formId, function(){
			    	Ext.get('loading-mask').hide();
			    	history.back();
		    	})
	 		}
	 		if (type == 'storeIn'){
	 			matStoreMgm.selectInMatBuy(inId, matIds, formId, function(){
	 				Ext.get('loading-mask').hide();
			    	//history.back();
	 				parent.selectWin.hide();
	 			});
	 		}
		    DWREngine.setAsync(true);   
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条采购计划',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
 	}
 	
 	// 选择所有形成采购计划的物资
 	function selectAll(){
 	
 	}
 	
 	// 列出所有物资
 	function listAll(){
 		dsB.baseParams.params = " appid is not null"
 		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
 	}
   	
});

