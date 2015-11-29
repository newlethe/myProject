var bean = "com.hdkj.webpmis.domain.material.MatAppbuyApply"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "appNo";
var appMatWin;

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
		},'appNo' : {
			name : 'appNo',
			fieldLabel : '申请编号',
			anchor : '95%'
		},'appDept' : {
			name : 'appDept',
			fieldLabel : '申请部门',
			anchor : '95%'
		},'appDate' : { 
			name : 'appDate',
			fieldLabel : '申请日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'conid' : {
			name : 'conid',
			fieldLabel : '合同名称',
			anchor : '95%'
		},'bdgid' : {
			name : 'bdgid',
			fieldLabel : '概算项目',
			anchor : '95%'
		},'appMoney' : {
			name : 'appMoney',
			fieldLabel : '申请金额',
			anchor : '95%'
		},'proveMoney' : {
			name : 'proveMoney',
			fieldLabel : '批准金额',
			anchor : '95%'
		},'appType' : {  
			name : 'appType',
			fieldLabel : '申请类型',
			anchor : '95%'
		},'action' : {  
			name : 'action',
			fieldLabel : '用途',  
			anchor : '95%'
		},'appMan' : {  
			name : 'appMan',
			fieldLabel : '申请人',  
			anchor : '95%'
		},'billSate' : {
			name : 'billSate',
			fieldLabel : '申请状态',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
//            store: dsAppStates,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'appNo', type: 'string'},    		
		{name: 'appDept', type: 'string'},
		{name: 'appDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'conid', type: 'string'},    	
		{name: 'bdgid', type: 'string' },
		{name: 'appMoney', type: 'float'}, 
		{name: 'proveMoney', type: 'float'}, 
		{name: 'appType', type: 'string'},
		{name: 'appMan', type: 'string'},
		{name: 'action', type: 'string'},
		{name: 'billSate', type: 'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		appNo : appNo,
		appDept : '',
		appDate:'',
		conid:'',
		bdgid : '',
		appMoney: null,
		proveMoney : null,
		appType:'',
		appMan:USERNAME,
		action: '',
		billSate: ''
	}

	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'appNo',
		header : fc['appNo'].fieldLabel,
		dataIndex : fc['appNo'].name,
		width : 60,
		editor : new fm.TextField(fc['appNo'])
	}, {
		id : 'appDept',
		header : fc['appDept'].fieldLabel,
		dataIndex : fc['appDept'].name,
		width : 60,
		editor : new fm.TextField(fc['appDept'])
	}, {
		id : 'appDate',
		header : fc['appDate'].fieldLabel,
		dataIndex : fc['appDate'].name,
		width : 40,
		editor : new fm.DateField(fc['appDate']),
		renderer: formatDate
	}, {
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		width : 60,
		editor : new fm.TextField(fc['conid'])
	}, {
		id : 'bdgid',
		header : fc['bdgid'].fieldLabel,
		dataIndex : fc['bdgid'].name,
		width : 60,
		editor : new fm.TextField(fc['bdgid'])
	}, {
		id : 'appMoney',
		header : fc['appMoney'].fieldLabel,
		dataIndex : fc['appMoney'].name,
		width : 30,
		editor : new fm.NumberField(fc['appMoney'])
	},{
		id : 'proveMoney',
		header : fc['proveMoney'].fieldLabel,
		dataIndex : fc['proveMoney'].name,
		width : 60,
		editor : new fm.NumberField(fc['proveMoney'])
	}, {
		id : 'appType',
		header : fc['appType'].fieldLabel,
		dataIndex : fc['appType'].name,
		width : 40,
		editor : new fm.TextField(fc['appType'])
	}, {
		id : 'action',  
		header : fc['action'].fieldLabel,
		dataIndex : fc['action'].name,
		editor : new fm.TextField(fc['action']),
		width : 40
	}, {
		id : 'appMan',  
		header : fc['appMan'].fieldLabel,
		dataIndex : fc['appMan'].name,
		editor : new fm.TextField(fc['appMan']),
		width : 40
	}, {
		id : 'billSate',  
		header : fc['billSate'].fieldLabel,
		dataIndex : fc['billSate'].name,
//		renderer: appStateRender,
		hidden : true
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
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><b>选择采购物资</b></font>','->',btnReturn],
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
		height: 400, 
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
		border: false,
		header: false,
		items: [gridPanel,gridPanelB]
		
	}) 

	//-----------------------------------------从grid end---------------------------
	
	//-----------------------------------------弹出啊窗口 begin-------------------------
	var gridPanelC = new Ext.grid.GridPanel({
		id : 'ff-gridB-panel',
		ds : dsC,
		cm : cmC,
		sm : smC,
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
		height: 400, 
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsC,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	});
	
	//-----------------------------------------弹出窗口 end---------------------------
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		items: [gridPanel,gridPanelB]
		
	}) 

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	
//-------------------------------------------function ------------------------------
	
 
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	
//-------------------------------------------function ------------------------------	
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var appid = record.get('uuid');
   		var matIds;
   		DWREngine.setAsync(false);   
   			matStoreMgm.getAppMat(appid, function(list){
		   		matIds = "(";
				for (var i = 0; i < list.length; i ++){
					if (i == list.length-1){
						matIds += " '"+list[i].MAT_ID + "'";
					}else{
						matIds += " '"+list[i].MAT_ID+"',";
					} 
				}
				matIds += ")";
				dsB.baseParams.params = " matId in " + matIds + " and remain > 0";
   				dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   			})
   		DWREngine.setAsync(true);   
   })	
   
    gridPanel.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(grid, rowIndex, e){
		e.preventDefault();
		e.stopEvent();
		sm.selectRow(rowIndex);
		var record = sm.getSelected();
		var appid = record.get('uuid');
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
                    	id: 'menu_edit',
		                text: '查看申请的物资',
		                value: appid,
		                iconCls: 'refresh',   
		                handler : function(){
							dsC.baseParams.params = " appid ='" + this.value + "'";
					   		dsC.load({ params:{start: 0, limit: PAGE_SIZE }});
							if(!appMatWin){
						         appMatWin = new Ext.Window({	               
						             header: false,
						             layout:'fit',
						             width:800,
						             height:400,
						             constrain: true,
						             modal : true,
						             maximizable:true,
						             closeAction:'hide',
						             plain: true,	                 
						             items: [gridPanelC]
					             });
							}
							appMatWin.show();
		                }
                    }]
	    });
	    gridMenu.showAt(e.getXY());
	}

   function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    function isBuyRender(value){
   		var str = '';
   		for(var i=0; i<isBuy.length; i++) {
   			if (isBuy[i][0] == value) {
   				if (value == '1'){
   					str = '<font color=#0000ff>'+isBuy[i][1]+'</font>';
   				}else{
   					str = isBuy[i][1] ;
   				}
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	// 选择要形成出库的物资
 	function select(){
 		if (sm.hasSelection()){
   			Ext.get('loading-mask').show();
   			var appid = sm.getSelected().get('uuid');
   			var records = smB.getSelections()
   			var matIds = new Array();
   			for (var i=0; i<records.length; i++){
   				matIds.push(records[i].get('uuid'))
   			}
	 		DWREngine.setAsync(false);   
		    matStoreMgm.selectOutMaApp(outId, matIds,appid, function(){
		    	Ext.get('loading-mask').hide();
		    	history.back();
		    })
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条申请计划',
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

