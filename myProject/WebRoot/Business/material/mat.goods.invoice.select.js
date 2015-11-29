
var bean = "com.sgepit.pmis.material.hbm.MatStoreIn"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "inNo";

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
		},'inNo' : {
			name : 'inNo',
			fieldLabel : '入库序号',
			anchor : '95%'
		},'dept' : {
			name : 'dept',
			fieldLabel : '部门名称',
			anchor : '95%'
		},'name' : {
			name : 'name',
			fieldLabel : '姓名',
			anchor : '95%'
		},'inDate' : { 
			name : 'inDate',
			fieldLabel : '日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'conid' : { 
			name : 'conid',
			fieldLabel : '合同名称',
			anchor : '95%'
		},'sum' : { 
			name : 'sum',
			fieldLabel : '总价',
			anchor : '95%'
		},'fareType' : { 
			name : 'fareType',
			fieldLabel : '费用类型',
			anchor : '95%'
		},'offerDept' : {
			name : 'offerDept',
			fieldLabel : '供货单位',
			anchor : '95%'
		},'matType' : {
			name : 'matType',
			fieldLabel : '物品类别',
			anchor : '95%'
		},'arrivDate' : {
			name : 'arrivDate',
			fieldLabel : '到达日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'userWay' : {
			name : 'userWay',
			fieldLabel : '用途',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'inNo', type: 'string'},    		
		{name: 'dept', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'inDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'arrivDate',   type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'sum', type: 'float' },
		{name: 'fareType', type: 'string'},
		{name: 'offerDept', type: 'string'},
		{name: 'matType', type: 'string'},
		{name: 'userWay', type: 'string'},
		{name: 'remark', type: 'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		inNo : '',
		dept : '',
		name:'',
		inDate:'',
		conid:'',
		sum:null,
		fareType:'',
		offerDept:'',
		matType:'',
		arrivDate:'',
		userWay:'',
		remark: ''
	}

	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'inNo',
		header : fc['inNo'].fieldLabel,
		dataIndex : fc['inNo'].name,
		width : 60,
		editor : new fm.TextField(fc['inNo'])
	}, {
		id : 'dept',
		header : fc['dept'].fieldLabel,
		dataIndex : fc['dept'].name,
		width : 80,
		editor : new fm.TextField(fc['dept'])
	}, {
		id : 'name',
		header : fc['name'].fieldLabel,
		dataIndex : fc['name'].name,
		width : 80,
		editor : new fm.TextField(fc['name'])
	}, {
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		width : 80,
		editor : new fm.TextField(fc['conid'])
	}, {
		id : 'inDate',
		header : fc['inDate'].fieldLabel,
		dataIndex : fc['inDate'].name,
		width : 40,
		editor : new fm.DateField(fc['inDate']),
		renderer: formatDate
	}, {
		id : 'arrivDate',
		header : fc['arrivDate'].fieldLabel,
		dataIndex : fc['arrivDate'].name,
		width : 40,
		editor : new fm.DateField(fc['arrivDate']),
		renderer: formatDate
	}, {
		id : 'sum',
		header : fc['sum'].fieldLabel,
		dataIndex : fc['sum'].name,
		width : 40,
		editor : new fm.NumberField(fc['sum'])
	}, {
		id : 'fareType',
		header : fc['fareType'].fieldLabel,
		dataIndex : fc['fareType'].name,
		width : 60,
		editor : new fm.TextField(fc['fareType'])
	}, {
		id : 'offerDept',
		header : fc['offerDept'].fieldLabel,
		dataIndex : fc['offerDept'].name,
		width : 60,
		editor : new fm.TextField(fc['offerDept'])
	}, {
		id : 'matType',
		header : fc['matType'].fieldLabel,
		dataIndex : fc['matType'].name,
		width : 60,
		editor : new fm.TextField(fc['matType'])
	}, {
		id : 'userWay',
		header : fc['userWay'].fieldLabel,
		dataIndex : fc['userWay'].name,
		width : 60,
		editor : new fm.TextField(fc['userWay'])
	}, {
		id : 'remark',  
		header : fc['remark'].fieldLabel,
		dataIndex : fc['remark'].name,
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
		tbar : ['<font color=#15428b><b>发票管理-(入库单)</b></font>','->', btnReturn],
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
	
	//---------------------------------------------------
	var gridPanelB = new Ext.grid.GridPanel({
		id : 'ff-ss-panel',
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

	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var inId = record.get('uuid');
   		dsB.baseParams.params = " inId ='" + inId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	

   	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    // 选择要形成入库的物资
 	function select(){
 		if (sm.hasSelection()){
   			Ext.get('loading-mask').show();
   			var records = smB.getSelections()
   			var matIds = new Array();
   			for (var i=0; i<records.length; i++){
   				matIds.push(records[i].get('uuid'))
   			}
   			var inId = sm.getSelected().get('uuid');
	 		DWREngine.setAsync(false);  
	 			matGoodsMgm.selectStoreMat(invoiceId, matIds, inId, function(){
	 				Ext.get('loading-mask').hide();
			    	history.back();
	 			});
		    DWREngine.setAsync(true);   
   		}else{
   			Ext.Msg.show({
					title: '提示',
		            msg: '请选择一条到货单',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
 	}
 	
 	// 选择所有形成入库的物资
 	function selectAll(){
 	
 	}
 	
 	// 列出所有物资
 	function listAll(){
 		dsB.baseParams.params = " appid is not null"
 		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
 	}
});



