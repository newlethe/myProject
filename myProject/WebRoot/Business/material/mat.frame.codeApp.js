var bean = "com.sgepit.pmis.material.hbm.MatCodeApply"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "catname";
var appStates = [[1,'未发出'],[2,'申请中'],[3,'批准'],[4,'未批准']];

Ext.onReady(function() {
	
	var dsAppStates = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: appStates
    });
    
    var sm = new Ext.grid.CheckboxSelectionModel()
    
    var btnApply = new Ext.Button({
		text: '发出申请',
		iconCls: 'btn',
		handler: applyMatno
	});
    
	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true
		},'applyNo' : {
			name : 'applyNo',
			fieldLabel : '申请编号',
			anchor : '95%'
		},'catname' : {
			name : 'catname',
			fieldLabel : '品名',
			anchor : '95%'
		},'enName' : {
			name : 'enName',
			fieldLabel : '英文名',
			anchor : '95%'
		},'spec' : {
			name : 'spec',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},'price' : {
			name : 'price',
			fieldLabel : '单价',
			anchor : '95%'
		},'appDept' : {
			name : 'appDept',
			fieldLabel : '申请部门',
			anchor : '95%'
		},'appMan' : {  
			name : 'appMan',
			fieldLabel : '申请人',
			anchor : '95%'
		},'appDate' : { 
			name : 'appDate',
			fieldLabel : '申请日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'acceptMan' : {  
			name : 'acceptMan',
			fieldLabel : '接受人',  
			anchor : '95%'
		},'approveOpin' : {  
			name : 'approveOpin',
			fieldLabel : '处理意见',  
			anchor : '95%'
		},'approveExplain' : {  
			name : 'approveExplain',
			fieldLabel : '处理说明',  
			anchor : '95%'
		},'remark' : {  
			name : 'remark',
			fieldLabel : '备注',  
			anchor : '95%'
		},'appState' : {
			name : 'appState',
			fieldLabel : '申请状态',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsAppStates,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},'frameId' : {  
			name : 'frameId',
			fieldLabel : '所在分类',  
			anchor : '95%'
		},'catNo' : {  
			name : 'catNo',
			fieldLabel : '物资编码',  
			anchor : '95%'
		},'warehouse' : {  
			name : 'warehouse',
			fieldLabel : '仓库名',  
			anchor : '95%'
		},'wareNo' : {  
			name : 'wareNo',
			fieldLabel : '货位号',  
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'applyNo', type: 'string'},    		
		{name: 'catname', type: 'string'},
		{name: 'enName', type: 'string'},    	
		{name: 'spec', type: 'string' },
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'appDept', type: 'string'},
		{name: 'appMan', type: 'string'},
		{name: 'appDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'},  
		{name: 'appState', type: 'string'},
		{name: 'acceptMan', type: 'string'}/*,
		{name: 'approveOpin', type: 'string'}
		,{name: 'approveExplain', type: 'string'},
		{name: 'remark', type: 'string'},
		
		{name: 'frameId', type: 'string'},
		{name: 'catNo', type: 'string'},
		{name: 'warehouse', type: 'string'},
		{name: 'wareNo', type: 'string'}*/
		];
		
	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : '',
		applyNo : appNo,
		catname : '',
		enName:'',
		spec : '',
		unit: '',
		price : null,
		appDept:'',
		appMan:USERNAME,
		appDate: '',
		appState: '1',
		acceptMan: ''
		/*approveOpin: ''
		approveExplain:'',
		remark: '',
		
		frameId:'',
		catNo:'',
		warehouse:'',
		wareNo:''*/
	}

	var cm = new Ext.grid.ColumnModel([
	sm, {
		id : 'uuid',
		header : fc['uuid'].fieldLabel,
		dataIndex : fc['uuid'].name,
		hidden : true
	}, {
		id : 'applyNo',
		header : fc['applyNo'].fieldLabel,
		dataIndex : fc['applyNo'].name,
		width : 60,
		editor : new fm.TextField(fc['applyNo'])
	}, {
		id : 'catname',
		header : fc['catname'].fieldLabel,
		dataIndex : fc['catname'].name,
		width : 100,
		editor : new fm.TextField(fc['catname'])
	}, {
		id : 'enName',
		header : fc['enName'].fieldLabel,
		dataIndex : fc['enName'].name,
		width : 100,
		editor : new fm.TextField(fc['enName'])
	}, {
		id : 'spec',
		header : fc['spec'].fieldLabel,
		dataIndex : fc['spec'].name,
		width : 60,
		editor : new fm.TextField(fc['spec'])
	}, {
		id : 'unit',
		header : fc['unit'].fieldLabel,
		dataIndex : fc['unit'].name,
		width : 30,
		editor : new fm.TextField(fc['unit'])
	}, {
		id : 'price',
		header : fc['price'].fieldLabel,
		dataIndex : fc['price'].name,
		width : 30,
		editor : new fm.NumberField(fc['price'])
	},{
		id : 'appDept',
		header : fc['appDept'].fieldLabel,
		dataIndex : fc['appDept'].name,
		width : 90,
		editor : new fm.TextField(fc['appDept'])
	}, {
		id : 'appMan',
		header : fc['appMan'].fieldLabel,
		dataIndex : fc['appMan'].name,
		width : 40,
		editor : new fm.TextField(fc['appMan'])
	}, {
		id : 'acceptMan',  
		header : fc['acceptMan'].fieldLabel,
		dataIndex : fc['acceptMan'].name,
		editor : new fm.TextField(fc['acceptMan']),
		width : 40
	}, {
		id : 'appDate',  
		header : fc['appDate'].fieldLabel,
		dataIndex : fc['appDate'].name,
		editor : new fm.DateField(fc['appDate']),
		renderer: formatDate,
		width : 40
	}, {
		id : 'appState',  
		header : fc['appState'].fieldLabel,
		dataIndex : fc['appState'].name,
		renderer: appStateRender,
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

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [btnApply, '-'],
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
			pageSize : PAGE_SIZE,
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
	
	gridPanel.on('rowcontextmenu', contextmenu, this); 
	function contextmenu(grid, rowIndex, e){
		e.stopEvent();
		grid.getSelectionModel().selectRow(rowIndex);
		var record = grid.getStore().getAt(rowIndex);
		var appId = record.get('uuid');
	    var gridMenu = new Ext.menu.Menu({
	        id: 'gridMenu',
	        items: [{
        			id: 'menu_modify',
	                text: '修改',
	                iconCls: 'add', 
	                handler : function(){
	                	window.location.href = BASE_PATH+"Business/material/mat.frame.codeApp.update.jsp?appId="+appId;
	                }
                    }]
	    });
	    gridMenu.showAt(e.getXY());
	}
	
	ds.load({ params:{start: 0, limit: PAGE_SIZE }});
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});

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
   				if (value == 1){
   					str = appStates[i][1];
   				}
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	function applyMatno(){
			if (sm.hasSelection()){
				Ext.get('loading-mask').show();
			    var appIds = new Array();
			    var records = sm.getSelections();
			    for (var i=0; i<records.length; i++){
			    	appIds.push(records[i].get('uuid'))
			    }
			    maAppMgm.applyMatno(appIds, function(flag){
			    ds.reload();
			    Ext.get('loading-mask').hide();
			    if (flag==1){
			    	Ext.example.msg('已经申请!','');
			    }else{
			    	Ext.example.msg('申请成功!','');
			    }
			    
			     
			    })
			   
			}else{
				Ext.Msg.show({
					title: '提示',
		            msg: '请选择材料',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
			}
		    
		}
   
});

