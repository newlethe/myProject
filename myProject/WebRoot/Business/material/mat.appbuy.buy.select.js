var bean = "com.sgepit.pmis.material.hbm.MatAppbuyApply"
var beanBdg = "com.sgepit.pmis.budget.hbm.BdgInfo"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "appNo";

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
		renderer: bdgName,
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
		tbar : ['<font color=#15428b><b>选择采购物资</b></font>'],
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
		id : 'appid',
		header : fcB['appid'].fieldLabel,
		dataIndex : fcB['appid'].name,
		hidden : true
	}, {
		id : 'appNo',
		header : fcB['appNo'].fieldLabel,
		dataIndex : fcB['appNo'].name,
		width : 40,
		editor : new fm.TextField(fcB['appNo'])
	}, {
		id : 'appNum',
		header : fcB['appNum'].fieldLabel,
		dataIndex : fcB['appNum'].name,
		width : 40,
		editor : new fm.NumberField(fcB['appNum'])
	}, {
		id : 'sum',
		header : fcB['sum'].fieldLabel,
		dataIndex : fcB['sum'].name,
		width : 40
	}, {
		id : 'appDate',
		header : fcB['appDate'].fieldLabel,
		dataIndex : fcB['appDate'].name,
		width : 40,
		renderer: formatDate,
		editor : new fm.DateField(fcB['remark'])
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
		id : 'isBuy',
		header : fcB['isBuy'].fieldLabel,
		dataIndex : fcB['isBuy'].name,
		renderer: isBuyRender,
		width : 30
	}, {
		id : 'storage',
		header : fcB['storage'].fieldLabel,
		dataIndex : fcB['storage'].name,
		hidden : true
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
		height: 240, 
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
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	
//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var appid = record.get('uuid');
   		dsB.baseParams.params = " appid ='" + appid + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	

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
   	
   	// 选择要形成采购计划的物资
 	function select(){
 		if (sm.hasSelection()){
   			Ext.get('loading-mask').show();
   			var records = smB.getSelections()
   			var matIds = new Array();
   			for (var i=0; i<records.length; i++){
   				matIds.push(records[i].get('uuid'))
   			}
	 		DWREngine.setAsync(false);   
		    appBuyMgm.selectBuyMat(buyId, matIds, function(){
		    	Ext.get('loading-mask').hide();
//		    	history.back();
		    	parent.selectWin.hide();
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
 	
 	function bdgName(value){
		   	var bdgName1 = '';
			if (value != ''){
				DWREngine.setAsync(false);
		       		baseMgm.findById(beanBdg, value, function(obj){
		       			if(obj!=null){
		       				bdgName1 =  obj.bdgname;
		       			}
		       		})
		   		DWREngine.setAsync(true);	
		   	}
		   	return bdgName1;
	}
});

