
var bean = "com.hdkj.webpmis.domain.material.MatStoreOut"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "outNo";
var outTypes = [[1,'领料单'],[2,'非计划出库'],[3,'退料单']];

Ext.onReady(function() {

	var btnList = new Ext.Button({
		text: '从清单中选',
		iconCls: 'add',
		handler: selectList
	});
	
	var btnGoods = new Ext.Button({
		text: '从入库中选',
		iconCls: 'add',
		handler: selectGoods
	});
	
    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true})
    
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true
		},'outName' : {
			name : 'outName',
			fieldLabel : '出库序号',
			anchor : '95%'
		},'outNo' : {
			name : 'outNo',
			fieldLabel : '出库单名称',
			anchor : '95%'
		},'dept' : {
			name : 'dept',
			fieldLabel : '部门名称',
			anchor : '95%'
		},'outDate' : { 
			name : 'outDate',
			fieldLabel : '出库日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'sendWare' : { 
			name : 'sendWare',
			fieldLabel : '发货仓库',
			anchor : '95%'
		},'matType' : { 
			name : 'matType',
			fieldLabel : '物资类型',
			anchor : '95%'
		},'useWay' : { 
			name : 'useWay',
			fieldLabel : '使用方式',
			anchor : '95%'
		},'bdgid' : {
			name : 'bdgid',
			fieldLabel : '概算名称',
			anchor : '95%'
		},'bdgno' : {
			name : 'bdgno',
			fieldLabel : '概算编号',
			anchor : '95%'
		},'bdgname' : {
			name : 'bdgname',
			fieldLabel : '概算名称',
			anchor : '95%'
		},'volumeId' : {
			name : 'volumeId',
			fieldLabel : '卷册主键',
			anchor : '95%'
		},'volumeNo' : {
			name : 'volumeNo',
			fieldLabel : '卷册编号',
			anchor : '95%'
		},'volumeName' : {
			name : 'volumeName',
			fieldLabel : '卷册名称',
			anchor : '95%'
		},'dealMan' : {
			name : 'dealMan',
			fieldLabel : '经手人',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		},'outType' : {
			name : 'outType',
			fieldLabel : '出库类型',
			hidden: true,
			hideLabel : true,
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'outNo', type: 'string'},    		
		{name: 'outName', type: 'string'},
		{name: 'dept', type: 'string'},
		{name: 'outDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'sendWare', type: 'string' },
		{name: 'matType', type: 'string'},
		{name: 'useWay', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgno', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'volumeId', type: 'string'},
		{name: 'volumeNo', type: 'string'},
		{name: 'volumeName', type: 'string'},
		{name: 'dealMan', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'outType', type: 'float'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		outNo : appNo,
		outName : '',
		dept:'',
		outDate:'',
		sendWare:'',
		matType:'',
		useWay:'',
		bdgid:'',
		bdgno:'',
		bdgname:'',
		volumeId:'',
		volumeNo: '',
		volumeName:'',
		dealMan:'',
		remark:'',
		outType:1
	}

	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'outNo',
		header : fc['outNo'].fieldLabel,
		dataIndex : fc['outNo'].name,
		width : 60,
		editor : new fm.TextField(fc['outNo'])
	}, {
		id : 'outName',
		header : fc['outName'].fieldLabel,
		dataIndex : fc['outName'].name,
		width : 80,
		editor : new fm.TextField(fc['outName'])
	}, {
		id : 'dept',
		header : fc['dept'].fieldLabel,
		dataIndex : fc['dept'].name,
		width : 80,
		editor : new fm.TextField(fc['dept'])
	}, {
		id : 'outDate',
		header : fc['outDate'].fieldLabel,
		dataIndex : fc['outDate'].name,
		width : 80,
		editor : new fm.DateField(fc['outDate']),
		renderer: formatDate
	}, {
		id : 'sendWare',
		header : fc['sendWare'].fieldLabel,
		dataIndex : fc['sendWare'].name,
		width : 60,
		editor : new fm.TextField(fc['sendWare'])
	}, {
		id : 'matType',
		header : fc['matType'].fieldLabel,
		dataIndex : fc['matType'].name,
		width : 60,
		editor : new fm.TextField(fc['matType'])
	}, {
		id : 'useWay',
		header : fc['useWay'].fieldLabel,
		dataIndex : fc['useWay'].name,
		width : 40,
		editor : new fm.TextField(fc['useWay'])
	}, {
		id : 'bdgid',
		header : fc['bdgid'].fieldLabel,
		dataIndex : fc['bdgid'].name,
		width : 90,
		editor: comboxWithTree,
	    renderer: bdgName
	}, {
		id : 'bdgno',
		header : fc['bdgno'].fieldLabel,
		dataIndex : fc['bdgno'].name,
		hidden : true
	}, {
		id : 'bdgname',
		header : fc['bdgname'].fieldLabel,
		dataIndex : fc['bdgname'].name,
		hidden : true
	}, {
		id : 'volumeId',
		header : fc['volumeId'].fieldLabel,
		dataIndex : fc['volumeId'].name,
		hidden: true
	}, {
		id : 'volumeNo',  
		header : fc['volumeNo'].fieldLabel,
		dataIndex : fc['volumeNo'].name,
		width : 60,
		editor : new fm.TextField(fc['volumeNo'])
	}, {
		id : 'volumeName',  
		header : fc['volumeName'].fieldLabel,
		dataIndex : fc['volumeName'].name,
		width : 60,
		editor : new fm.TextField(fc['volumeName'])
	}, {
		id : 'dealMan',  
		header : fc['dealMan'].fieldLabel,
		dataIndex : fc['dealMan'].name,
		width : 60,
		editor : new fm.TextField(fc['dealMan'])
	}, {
		id : 'remark',  
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
		hidden : true
	}, {
		id : 'outType',  
		header : fc['outType'].fieldLabel,
		dataIndex : fc['outType'].name,
		renderer: outTypesRender,
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

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><b>领料单</b></font>','-'],
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
	
	//---------------------------------------------------
		var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'uuid',
		header : fcB['uuid'].fieldLabel,
		dataIndex : fcB['uuid'].name,
		hidden : true
	},{
		id : 'outId',
		header : fcB['outId'].fieldLabel,
		dataIndex : fcB['outId'].name,
		hidden : true
	},{
		id : 'inId',
		header : fcB['inId'].fieldLabel,
		dataIndex : fcB['inId'].name,
		hidden : true
	}, {
		id : 'appId',
		header : fcB['appId'].fieldLabel,
		dataIndex : fcB['appId'].name,
		hidden : true
	}, {
		id : 'goodsId',
		header : fcB['goodsId'].fieldLabel,
		dataIndex : fcB['goodsId'].name,
		hidden : true
	}, {
		id : 'matId',
		header : fcB['matId'].fieldLabel,
		dataIndex : fcB['matId'].name,
		hidden : true
	}, {  
		id : 'subNo',
		header : fcB['subNo'].fieldLabel,
		dataIndex : fcB['subNo'].name,
		width : 60
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
		id : 'spec',
		header : fcB['spec'].fieldLabel,
		dataIndex : fcB['spec'].name,
		width : 40
	}, {
		id : 'unit',
		header : fcB['unit'].fieldLabel,
		dataIndex : fcB['unit'].name,
		width : 40
	}, {
		id : 'price',
		header : fcB['price'].fieldLabel,
		dataIndex : fcB['price'].name,
		width : 40
	},{
		id : 'appNum',
		header : fcB['appNum'].fieldLabel,
		dataIndex : fcB['appNum'].name,
		width : 60,
		editor : new fm.NumberField(fcB['appNum'])
	},{
		id : 'realNum',
		header : fcB['realNum'].fieldLabel,
		dataIndex : fcB['realNum'].name,
		width : 60,
		editor : new fm.NumberField(fcB['realNum'])
	},{
		id : 'money',
		header : fcB['money'].fieldLabel,
		dataIndex : fcB['money'].name,
		width : 60,
		editor : new fm.NumberField(fcB['money'])
	}, {
		id : 'bdgid',
		header : fcB['bdgid'].fieldLabel,
		dataIndex : fcB['bdgid'].name,
		width : 90,
		editor: comboxWithTree,
	    renderer: bdgName
	}, {
		id : 'bdgno',
		header : fcB['bdgno'].fieldLabel,
		dataIndex : fcB['bdgno'].name,
		hidden : true
	},{
		id : 'bdgname',
		header : fcB['bdgname'].fieldLabel,
		dataIndex : fcB['bdgname'].name,
		hidden : true
	},{
		id : 'useMan',
		header : fcB['useMan'].fieldLabel,
		dataIndex : fcB['useMan'].name,
		width : 60,
		editor : new fm.TextField(fcB['bdgname'])
	},{
		id : 'outType',
		header : fcB['outType'].fieldLabel,
		dataIndex : fcB['outType'].name,
		hidden : true,
		width : 60
	}])
	cmB.defaultSortable = true;

	
	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-ss-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [btnList,'-',btnGoods],
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
		}),
		// expend properties
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean:beanB,
		business : businessB,
		primaryKey : primaryKeyB
	});
	
	//----------------------------------------------------

	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		items: [gridPanel, gridPanelB]
		
	}) 

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	
	gridPanelB.getTopToolbar().items.get('add').setVisible(false);
	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var outId = record.get('uuid');
   		dsB.baseParams.params = " outId ='" + outId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	


    // 物资清单  
   	function selectList(){
   		if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp?inId="
   					+inId + "&type=storeIn";
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条入库记录',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	// 到货单  
   	function selectGoods(){
   		if (sm.hasSelection()){
   			var outId = sm.getSelected().get('uuid');
   			window.location.href = BASE_PATH+"jsp/material/mat.store.out.select.jsp?outId=" + outId;
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条出库记录',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	// 选购单(grid)
   	function getGoodsMat(){ 
    	if (sm.hasSelection()){
   			var inId = sm.getSelected().get('uuid');
   			window.location.href = BASE_PATH+"jsp/material/mat.goods.check.select.jsp?inId="
   					+inId + "&type=storeIn";
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条出库记录',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };outTypes
    
   	function outTypesRender(value){
   		var str = '';
   		for(var i=0; i<outTypes.length; i++) {
   			if (outTypes[i][0] == value) {
   				str = outTypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
});

	function bdgName(value){
	   	var bdgName = '';
		if (value != ''){
			DWREngine.setAsync(false);
	       		baseMgm.findById(beanBdg, value, function(obj){
	       			bdgName =  obj.bdgname;
	       		})
	   		DWREngine.setAsync(true);	
	   	}
	   	return bdgName;
	}

