var bean = "com.sgepit.pmis.safeManage.hbm.SafeStaffAccident";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "sgbh";//主表主健
var orderColumn = "sgbh";//从表排序字段
var selectedData;
var gridPanelB;

Ext.onReady(function() {

	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'bblb' : {
			name : 'bblb',
			fieldLabel : '报表类型',
			hideLabel : true
		},'sgbh' : {
			name : 'sgbh',
			fieldLabel : '事故编号',
			hideLabel : true
		},'bbsjd' : {
			name : 'bbsjd',
			fieldLabel : '报表时间',
			format: 'Y-m-d',
			anchor : '95%'
		},'tbdw' : {
			name : 'tbdw',
			fieldLabel : '填报单位',
			anchor : '95%'
		},'bh' : {
			name : 'bh',
			fieldLabel : '序号',
			anchor : '95%'
		},'bcsj' : { 
			name : 'bcsj',
			fieldLabel : '报出时间',
			format: 'Y-m-d',
			anchor : '95%'
		},'sgbh' : {
			name : 'sgbh',
			fieldLabel : '事故编号',
			anchor : '95%'
		},'gcmcjgm' : {
			name : 'gcmcjgm',
			fieldLabel : '工程名称及工程规模',
			anchor : '95%'
		},'gcsgpjzrs' : {
			name : 'gcsgpjzrs',
			fieldLabel : '工程施工平均总人数',
			anchor : '95%'
		},'dwfzr' : {
			name : 'dwfzr',
			fieldLabel : '单位负责人',
			anchor : '95%'
		},'ckfzr' : {
			name : 'ckfzr',
			fieldLabel : '处（科）负责人',
			anchor : '95%'
		},'zbr' : {
			name : 'zbr',
			fieldLabel : '填表人姓名',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'bblb', type: 'string'},
    	{name: 'bbsjd',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
    	{name: 'tbdw', type: 'string'},
    	{name: 'bh', type: 'string'}, 
    	{name: 'sgbh', type: 'string'},
		{name: 'gcmcjgm', type: 'string'},
		{name: 'gcsgpjzrs', type: 'float'}, 
		{name: 'dwfzr', type: 'string'},
		{name: 'ckfzr', type: 'string'},
		{name: 'zbr', type: 'string'},
		{name: 'bcsj',  type: 'date', dateFormat: 'Y-m-d H:i:s'}
		];

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		bblb : '',
		bbsjd : '',
		tbdw : '',
		bh:'',
		sgbh:'',
		gcmcjgm:'',
		gcsgpjzrs : null,
		dwfzr:'',
		ckfzr: '',
		zbr: '',
		bcsj:''
	}
	
	var sm =  new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'sgbh',
		header : fc['sgbh'].fieldLabel,
		dataIndex : fc['sgbh'].name,
		hidden : true
	},{
		id : 'bblb',
		header : fc['bblb'].fieldLabel,
		dataIndex : fc['bblb'].name,
		hidden : true
	}, {
		id : 'bbsjd',
		header : fc['bbsjd'].fieldLabel,
		dataIndex : fc['bbsjd'].name,
		width : 100,
		renderer: formatDate,
		editor : new fm.DateField(fc['bbsjd'])
	}, {
		id : 'tbdw',
		header : fc['tbdw'].fieldLabel,
		dataIndex : fc['tbdw'].name,
		width : 120,
		editor : new fm.TextField(fc['tbdw'])
	}, {
		id : 'bh',
		header : fc['bh'].fieldLabel,
		dataIndex : fc['bh'].name,
		width : 80,
		editor : new fm.TextField(fc['bh'])
	}, {
		id : 'gcmcjgm',
		header : fc['gcmcjgm'].fieldLabel,
		dataIndex : fc['gcmcjgm'].name,
		width : 120,
		editor : new fm.TextField(fc['gcmcjgm'])
	}, {
		id : 'gcsgpjzrs',
		header : fc['gcsgpjzrs'].fieldLabel,
		dataIndex : fc['gcsgpjzrs'].name,
		width : 120,
		editor : new fm.NumberField(fc['gcsgpjzrs'])
	}, {
		id : 'dwfzr',
		header : fc['dwfzr'].fieldLabel,
		dataIndex : fc['dwfzr'].name,
		width : 100,
		editor : new fm.TextField(fc['dwfzr'])
	}, {
		id : 'ckfzr',
		header : fc['ckfzr'].fieldLabel,
		dataIndex : fc['ckfzr'].name,
		width : 100,
		editor : new fm.TextField(fc['ckfzr'])
	},{
		id : 'zbr',
		header : fc['zbr'].fieldLabel,
		dataIndex : fc['zbr'].name,
		width : 100,
		editor : new fm.TextField(fc['zbr'])
	},{
		id : 'bcsj',
		header : fc['bcsj'].fieldLabel,
		dataIndex : fc['bcsj'].name,
		width : 100,
		renderer: formatDate,
		editor : new fm.DateField(fc['bcsj'])
	}])
	
	cm.defaultSortable = true;
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod
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
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : [],
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
	
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});


	//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name,
		hidden : true
	},{
		id : 'sgbh',
		header : fcB['sgbh'].fieldLabel,
		dataIndex : fcB['sgbh'].name,
		hidden : true
	}, {
		id : 'xm',
		header : fcB['xm'].fieldLabel,
		dataIndex : fcB['xm'].name,
		width : 40
	}, {
		id : 'xb',
		header : fcB['xb'].fieldLabel,
		dataIndex : fcB['xb'].name,
		width : 40,
		renderer: sexComboBoxRenderer
	}, {
		id : 'nl',
		header : fcB['nl'].fieldLabel,
		dataIndex : fcB['nl'].name,
		width : 40
	}, {
		id : 'zw',
		header : fcB['zw'].fieldLabel,
		dataIndex : fcB['zw'].name,
		width : 40,
		hidden : true
	}, {
		id : 'zb',
		header : fcB['zb'].fieldLabel,
		dataIndex : fcB['zb'].name,
		width : 40,
		hidden : true
	}, {
		id : 'gz',
		header : fcB['gz'].fieldLabel,
		dataIndex : fcB['gz'].name,
		width : 60,
		hidden : true
	}, {
		id : 'gl',
		header : fcB['gl'].fieldLabel,
		dataIndex : fcB['gl'].name,
		width : 60,
		hidden : true
	}, {
		id : 'whcd',
		header : fcB['whcd'].fieldLabel,
		dataIndex : fcB['whcd'].name,
		width : 60,
		hidden : true
	}, {
		id : 'bgzgl',
		header : fcB['bgzgl'].fieldLabel,
		dataIndex : fcB['bgzgl'].name,
		width : 60,
		hidden : true
	}, {
		id : 'shcd',
		header : fcB['shcd'].fieldLabel,
		dataIndex : fcB['shcd'].name,
		width : 30
	}, {
		id : 'zrhf',
		header : fcB['zrhf'].fieldLabel,
		dataIndex : fcB['zrhf'].name,
		width : 30
	}, {
		id : 'jyqk',
		header : fcB['jyqk'].fieldLabel,
		dataIndex : fcB['jyqk'].name,
		width : 30
	}, {
		id : 'jaqk',
		header : fcB['jaqk'].fieldLabel,
		dataIndex : fcB['jaqk'].name,
		width : 30
	}, {
		id : 'jawh',
		header : fcB['jawh'].fieldLabel,
		dataIndex : fcB['jawh'].name,
		width : 30,
		hidden : true
	}, {
		id : 'jasj',
		header : fcB['jasj'].fieldLabel,
		dataIndex : fcB['jasj'].name,
		width : 30,
		renderer: formatDate,
		hidden : true
	}, {
		id : 'sgclyj',
		header : fcB['sgclyj'].fieldLabel,
		dataIndex : fcB['sgclyj'].name,
		width : 30
	},{
		id : 'tbdw',
		header : fcB['tbdw'].fieldLabel,
		dataIndex : fcB['tbdw'].name,
		width : 30,
		hidden : true
	},{
		id : 'tbrxm',
		header : fcB['tbrxm'].fieldLabel,
		dataIndex : fcB['tbrxm'].name,
		width : 30,
		hidden : true
	},{
		id : 'tbrq',
		header : fcB['tbrq'].fieldLabel,
		dataIndex : fcB['tbrq'].name,
		renderer: formatDate,
		width : 30
	},{
		id : 'sgclyj',
		header : fcB['sgclyj'].fieldLabel,
		dataIndex : fcB['sgclyj'].name,
		width : 30
	}
	])
	cmB.defaultSortable = true;
	

	gridPanelB = new Ext.grid.EditorGridTbarPanel({
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
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean:beanB,
		business : businessB,
		primaryKey : primaryKeyB,
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun,
		saveHandler : saveFun
	});
	
	
	dsB.on('load',function(){
		if(sm.getSelected()){
			var sgbh = sm.getSelected().get('sgbh')
//			if(sm.getSelected().get('appMoney') != dsB.sum('sum')&&appid != null){
//				sm.getSelected().set('appMoney',dsB.sum('sum'))
//				sm.getSelected().commit()
//				//appBuyMgm.updateSumPrice(appid)
//			}
		}
	})

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
	
	gridPanelB.showHideTopToolbarItems("save", false);
    var gridTopBar = gridPanelB.getTopToolbar()
	with (gridTopBar) {
		add(update);
	}
	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var sgbh = record.get('sgbh');
   		selectedData = record.get('sgbh');
   		dsB.baseParams.params = " sgbh ='" + sgbh + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	


   function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
	
});

