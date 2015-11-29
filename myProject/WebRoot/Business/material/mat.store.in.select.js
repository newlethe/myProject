
var bean = "com.sgepit.pmis.material.hbm.MatGoodsCheck"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "checkNo";

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
		},'checkNo' : {
			name : 'checkNo',
			fieldLabel : '验收单号',
			anchor : '95%'
		},'formid' : {
			name : 'formid',
			fieldLabel : '采购单号',
			anchor : '95%'
		},'conid' : {
			name : 'conid',
			fieldLabel : '合同名称',
			anchor : '95%'
		},'offerDept' : { 
			name : 'offerDept',
			fieldLabel : '供货单位',
			anchor : '95%'
		},'arriDate' : { 
			name : 'arriDate',
			fieldLabel : '预计到达',
			format: 'Y-m-d',
			anchor : '95%'
		},'realDate' : { 
			name : 'realDate',
			fieldLabel : '实际到达',
			format: 'Y-m-d',
			anchor : '95%'
		},'transDept' : {
			name : 'transDept',
			fieldLabel : '运输单位',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'checkNo', type: 'string'},    		
		{name: 'formid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'offerDept', type: 'string'},
		{name: 'arriDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'realDate',   type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'transDept', type: 'string' },
		{name: 'remark', type: 'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		checkNo : appNo,
		formid : '',
		conid:'',
		offerDept:'',
		transDept: '',
		remark: ''
	}

	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'checkNo',
		header : fc['checkNo'].fieldLabel,
		dataIndex : fc['checkNo'].name,
		width : 60,
		editor : new fm.TextField(fc['checkNo'])
	}, {
		id : 'formid',
		header : fc['formid'].fieldLabel,
		dataIndex : fc['formid'].name,
		width : 80,
		editor : new fm.TextField(fc['formid'])
	}, {
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		width : 80,
		editor : new fm.TextField(fc['conid'])
	}, {
		id : 'offerDept',
		header : fc['offerDept'].fieldLabel,
		dataIndex : fc['offerDept'].name,
		width : 60,
		editor : new fm.TextField(fc['offerDept'])
	}, {
		id : 'arriDate',
		header : fc['arriDate'].fieldLabel,
		dataIndex : fc['arriDate'].name,
		width : 40,
		editor : new fm.DateField(fc['arriDate']),
		renderer: formatDate
	}, {
		id : 'realDate',
		header : fc['realDate'].fieldLabel,
		dataIndex : fc['realDate'].name,
		width : 40,
		editor : new fm.DateField(fc['realDate']),
		renderer: formatDate
	}, {
		id : 'transDept',
		header : fc['transDept'].fieldLabel,
		dataIndex : fc['transDept'].name,
		width : 60,
		editor : new fm.TextField(fc['transDept'])
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
//		tbar : ['<font color=#15428b><b>选择入库物资-(到货单)</b></font>','->', btnReturn],
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
   		var checkId = record.get('uuid');
   		dsB.baseParams.params = " checkId ='" + checkId + "'";
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
   			var goodsId = sm.getSelected().get('uuid');
	 		DWREngine.setAsync(false);  
	 			matStoreMgm.selectInMatGoods(inId, matIds, goodsId, function(){
	 				Ext.get('loading-mask').hide();
			    	//history.back();
	 				parent.selectWin.hide();
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



