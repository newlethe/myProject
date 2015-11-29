var bean = "com.sgepit.pmis.material.hbm.MatAppbuyBuy"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "buyNo";
var selectWin;

Ext.onReady(function() {
	
    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true})
    
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true
		},'buyNo' : {
			name : 'buyNo',
			fieldLabel : '采购编号',
			anchor : '95%'
		},'buyMan' : {
			name : 'buyMan',
			fieldLabel : '采购人',
			anchor : '95%'
		},'buyDate' : { 
			name : 'buyDate',
			fieldLabel : '定制日期',
			format: 'Y-m-d',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'buyNo', type: 'string'},    		
		{name: 'buyMan', type: 'string'},
		{name: 'buyDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}
		];
		
	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		buyNo : appNo,
		buyMan : '',
		buyDate:''
	}

	var cm = new Ext.grid.ColumnModel([
	sm, {
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'buyNo',
		header : fc['buyNo'].fieldLabel,
		dataIndex : fc['buyNo'].name,
		width : 60,
		editor : new fm.TextField(fc['buyNo'])
	}, {
		id : 'buyMan',
		header : fc['buyMan'].fieldLabel,
		dataIndex : fc['buyMan'].name,
		width : 100,
		editor : new fm.TextField(fc['buyMan'])
	}, {
		id : 'buyDate',
		header : fc['buyDate'].fieldLabel,
		dataIndex : fc['buyDate'].name,
		width : 100,
		renderer: formatDate,
		editor : new fm.DateField(fc['buyDate'])
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

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : ['<font color=#15428b><b>采购计划</b></font>','-'],
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
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
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
		id : 'buyId',
		header : fcB['buyId'].fieldLabel,
		dataIndex : fcB['buyId'].name,
		hidden : true
	}, {
		id : 'buyNo',
		header : fcB['buyNo'].fieldLabel,
		dataIndex : fcB['buyNo'].name,
		width : 60,
		editor : new fm.TextField(fcB['buyNo'])
	}, {
		id : 'buyNum',
		header : fcB['buyNum'].fieldLabel,   
		dataIndex : fcB['buyNum'].name,
		width : 40,
		editor : new fm.NumberField(fcB['buyNum'])
	}, {
		id : 'appNum',
		header : fcB['appNum'].fieldLabel,   
		dataIndex : fcB['appNum'].name,
		width : 40
	}, {
		id : 'buyWay',
		header : fcB['buyWay'].fieldLabel,
		dataIndex : fcB['buyWay'].name,
		width : 60,
		editor : new fm.TextField(fcB['buyWay'])
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
		hidden : true
	}, {
		id : 'storage',
		header : fcB['storage'].fieldLabel,
		dataIndex : fcB['storage'].name,
		hidden : true
	},{
		id : 'appid',
		header : fcB['appid'].fieldLabel,
		dataIndex : fcB['appid'].name,
		hidden : true
	},{
		id : 'appNo',
		header : fcB['appNo'].fieldLabel,
		dataIndex : fcB['appNo'].name,
		hidden : true
	},{
		id : 'sum',
		header : fcB['sum'].fieldLabel,
		dataIndex : fcB['sum'].name,
		hidden : true
	},{
		id : 'appDate',
		header : fcB['appDate'].fieldLabel,
		dataIndex : fcB['appDate'].name,
		hidden : true
	},{
		id : 'formId',
		header : fcB['formId'].fieldLabel,
		dataIndex : fcB['formId'].name,
		hidden : true
	},{
		id : 'formNo',
		header : fcB['formNo'].fieldLabel,
		dataIndex : fcB['formNo'].name,
		hidden : true
	},{
		id : 'isBuy',
		header : fcB['isBuy'].fieldLabel,
		dataIndex : fcB['isBuy'].name,
		hidden : true
	},{
		id : 'isIn',
		header : fcB['isIn'].fieldLabel,
		dataIndex : fcB['isIn'].name,
		hidden : true
	}
	])
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
		// expend properties
		crudText: {add:'选择采购材料'},
		insertHandler: getBuyMat,
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean : beanB,
		business : 'appBuyMgm',
		saveMethod:  'updateBuy',
		deleteMethod: 'deleteBuy',
		insertMethod: 'insertBuy',
		primaryKey : primaryKeyB 
	});
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false, 
		items: [gridPanel,gridPanelB]
		
	}) 

	//-----------------------------------------从grid end---------------------------
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel],
		listeners: {
			afterlayout: function(){
				if (isFlwView == true){
					gridPanel.getTopToolbar().disable();
					gridPanelB.getTopToolbar().disable();
			    }
			}
		}
	});

	//-----------------------------------------function --------------------------------
	
	sm.on('rowselect', function(sm, rowIndex, record){
   		var buyId = record.get('uuid');
   		dsB.baseParams.params = " buyId ='" + buyId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })
	
   function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function appStateRender(value){
   		var str = '';
   		for(var i=0; i<appStates.length; i++) {
   			if (appStates[i][0] == value) {
   				if (value == 2){
   					str = '<font color=#0000ff>'+appStates[i][1]+'</font>';
   				}
   				if (value == 3){
   					str = '<font color=#00ff00>'+appStates[i][1]+'</font>';
   				}
   				break; 
   			}
   		}
   		return str;
   	}
   	
   function getBuyMat(){
   		if (sm.hasSelection()){
   			var buyId = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.buy.select.jsp?buyId="
//   					+buyId 
   			if (!selectWin){
	   			selectWin = new Ext.Window({
					title: '选择',
					closeAction: 'hide',
					width: 800, height: 450,
					modal: true, plain: true, border: false, resizable: false,
					autoLoad: {
						url: BASE_PATH + 'Business/material/viewDispatcher.jsp',
						params: 'page=buy&buyId='+buyId,
						text: 'Loading...'
					},
					listeners: {
						hide: function(){
							dsB.reload();
							if (isFlwTask == true){
								Ext.Msg.show({
									title: '您成功维护了采购计划信息！',
									msg: '您是否进行发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
									buttons: Ext.Msg.YESNO,
									icon: Ext.MessageBox.INFO,
									fn: function(value){
								   		if ('yes' == value){
								   			parent.IS_FINISHED_TASK = true;
											parent.mainTabPanel.setActiveTab('common');
								   		}
									}
								});
							}
						}
					}
				});
   			}
			selectWin.show();
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
   	
});
