var bean = "com.sgepit.pmis.safeManage.hbm.SafetyCheckItem"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var gridPanel,gridPanelCont
var primaryKey = 'uuid'
var orderColumn = "uuid";

var beanCont = "com.sgepit.pmis.safeManage.hbm.SafetyCheckContent"
var primaryKeyCont = 'uuid'
var orderColumnCont = "uuid";
var selectedData
var selectObj

//安全监察部ID
var deptId = '04'

Ext.onReady(function(){
	
	Ext.QuickTips.init();
	
	var proState = new Array();
	var proImportant = new Array();
	var checkuser = new Array();
	var responuser = new Array();
	var dept = new Array();
 	DWREngine.setAsync(false);
 	//获取问题状态
    appMgm.getCodeValue('问题状态',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			proState.push(temp);
		}
    });
    //获取重要程度
    appMgm.getCodeValue('重要程度',function(list){         
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			proImportant.push(temp);
		}
    });
    //查询出安全监察部人员
    baseMgm.getData("select userid,realname from rock_user where posid='"+deptId+"'",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			checkuser.push(temp);
			responuser.push(temp)
		}
	})
	//查询出所有部门
 	baseMgm.getData("select * from sgcc_ini_unit where unitid <> 10000000000000 order by view_order_num",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			dept.push(temp);
		}
    });
    
    
 	DWREngine.setAsync(true);	
  	var proStateDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:proState
 	})
 	var proImportantDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:proImportant
 	})
 	var checkuserDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:checkuser
 	})
 	var responuserDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:responuser
 	})
	var deptDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:dept
 	})
	
	
	
	//----------------------------检查项目-------------------------
	var Columns = [
	  	{name: 'uuid', type: 'string'},
	  	{name: 'itembh', type: 'string'},    		
		{name: 'itemname', type: 'string'},
		{name: 'checkresult',type: 'string'},
		{name: 'checktime',  type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'responsibleuser',type: 'string'},
		{name: 'pid',type: 'string'}
	];


	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		uuid:'',
		itembh:'',
		itemname:'',
		checkresult:'',
		checktime:'',
		responsibleuser:'',
		pid:CURRENTAPPID
	}

	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	
	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uuid',header:'UUID',width:0,dataIndex:'uuid',hidden:true},
		{id:'itembh',header:'项目备用ID',width:0,dataIndex:'itembh',hidden:true},
		{id:'itemname',type:'string',header:'检查项目',width:160,dataIndex:'itemname'},
		{id:'checkresult',type:'string',header:'检查结果',width:400,dataIndex:'checkresult'},
		{id:'checktime',type:'date',header:'检查时间',width:100,dataIndex:'checktime',renderer:formatDate},
		{id:'responsibleuser',header:'责任人',width:80,dataIndex:'responsibleuser',
			type:'combo',
			store:responuserDs,
			renderer:function(value){
				for(var i = 0;i<responuser.length;i++){
					if(value == responuser[i][0]){
						return responuser[i][1]
					}
				}
			}
		},
		{id:'pid',header:'PID',dataIndex:'pid',hidden:true}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : "pid = '"+CURRENTAPPID+"' "
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
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	
	var addBtn = new Ext.Button({
    	text:'新增',
    	tooltip: '新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    var editBtn = new Ext.Button({
    	text:'修改',
    	tooltip: '修改',
    	iconCls:'btn',
    	handler:editHandler
    })
    
    var delBtn = new Ext.Button({
    	text:'删除',
    	tooltip: '删除',
    	iconCls:'remove',
    	handler:DelFun
    })
    
	function insertFun(){
		var url = BASE_PATH+"Business/safeManage/safety.check.item.addorupdate.jsp";
		window.location.href = url;
	}
	function editHandler(){
		var record = sm.getSelected();
		if(record==null){
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择需要修改的检查项目！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}else{
			//var record = gridPanel.getSelectionModel().getSelected();
			var uuid = record.data.uuid;
			var url = BASE_PATH+"Business/safeManage/safety.check.item.addorupdate.jsp?uuid="+uuid;
			window.location.href = url;
		}
	}
	function DelFun(){
		var record = sm.getSelected();
		if(record==null){
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择需要删除的检查项目！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}else{
			Ext.MessageBox.confirm('确认', '删除该项目将同时删除该项目的检查记录，并且操作将不可恢复，请谨慎操作！<br><br>确认要删除吗？',function(btn,text) {
				if (btn == "yes") {
					var uuid = record.data.uuid;
					DWREngine.setAsync(false);
					safeManageMgmImpl.deleteSafetyCheckItem(bean,beanCont,uuid,function(data){
						Ext.example.msg('删除成功！', '您成功删除了一条合同信息！');
						ds.remove(selectObj);
						ds.reload();
						dsCont.reload();
					});
				    DWREngine.setAsync(true);
				}
			}, this);
		}
	}
	
	
	//gridPanel = new Ext.grid.GridPanel({
	gridPanel = new Ext.grid.QueryExcelGridPanel({
	//gridPanel = new Ext.grid.EditorGridTbarPanel({
		store:ds,
		cm:cm,
		sm:sm,
		border:false,
		region:'center',
		tbar:['<font color=#15428b><b>检查项目</b></font>','-',addBtn,'-',editBtn,'-',delBtn,'-'],
		header:false,
		autoScroll:true, // 自动出现滚动条
		collapsible:false, // 是否可折叠
		animCollapse:false, // 折叠时显示动画
		loadMask:true, // 加载时是否显示进度
		stripeRows:true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar:new Ext.PagingToolbar({   
            pageSize: PAGE_SIZE,   
            store: ds,   
            displayInfo: true,   
            displayMsg : ' {0} - {1} / {2}',     
            emptyMsg : "无记录。"   
        })
        /*,
        // expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
		*/
	});
	ds.load({
		params:{start:0,limit:PAGE_SIZE}
	});
	
	//--------------------------------检查内容--------------------------------
	var fmCont = Ext.form;
	
	var fcCont = {
		'uuid':{
			name:'uuid',
			fieldLabel:'UUID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
			},
		'itemuuid':{
			name:'itemuuid',
			fieldLabel:'检查项目UUID',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
			},
		'checkuser':{
			name:'checkuser',
			fieldLabel:'检查人',
			readOnly :true,
			allowBlank: false,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: checkuserDs,              
	        lazyRender:true,
	        listClass: 'x-combo-list-small',
			anchor:'95%'
			},
		'resolvetime':{
			name:'resolvetime',
			fieldLabel:'解决时间',
			readOnly :true,
			anchor:'95%'
			},
		'problem':{
			name:'problem',
			fieldLabel:'问题',
			anchor:'95%'
			},
		'dept':{
			name:'dept',
			fieldLabel:'责任部门',
			valueField:'k',
			displayField: 'v',
			readOnly :true,
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: deptDs,              
	        lazyRender:true,
	        listClass: 'x-combo-list-small',
	        readOnly :true,
			anchor:'95%'
			},
		'problemstate':{
			name:'problemstate',
			fieldLabel:'问题状态',
			valueField:'k',
			displayField: 'v',
			readOnly :true,
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: proStateDs,              
	        lazyRender:true,
	        listClass: 'x-combo-list-small',
	        readOnly :true,
			anchor:'95%'
			},
		'problemimportant':{
			name:'problemimportant',
			fieldLabel:'重要程度',
			valueField:'k',
			displayField: 'v',
			readOnly :true,
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: proImportantDs,              
	        lazyRender:true,
	        listClass: 'x-combo-list-small',
			anchor:'95%'
			}
	}
	
	ColumnsCont = [
		{name: 'uuid', type: 'string'},
	  	{name: 'itemuuid', type: 'string'},    		
		{name: 'checkuser', type: 'string'},
		{name: 'resolvetime',  type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'problem',  type: 'string'},
		{name: 'dept',  type: 'string'},
		{name: 'problemstate', type: 'string'},
		{name: 'problemimportant', type: 'string'}
	]
	
	var PlantCont = Ext.data.Record.create(ColumnsCont);
	PlantIntCont = {
		uuid:'',
		itemuuid:'',
		checkuser:'',
		resolvetime:'',
		problem:'',
		dept:'',
		problemstate:'',
		problemimportant:''
	}
	
	var smCont =  new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var cmCont = new Ext.grid.ColumnModel([
		smCont,
		{	id:'uuid',
			header:fcCont['uuid'].fieldLabel,
			dataIndex:fcCont['uuid'].name,
			hidden: true
		},
		{	id:'itemuuid',
			header:fcCont['itemuuid'].fieldLabel,
			dataIndex:fcCont['itemuuid'].name,
			hidden: true
		},
		{	id:'checkuser',
			header:fcCont['checkuser'].fieldLabel,
			dataIndex:fcCont['checkuser'].name,
			align:"center",
			width :100,
			renderer:function(value){
				for(var i = 0;i<checkuser.length;i++){
					if(value == checkuser[i][0]){
						return checkuser[i][1]
					}
				}
			},
			editor:new fmCont.ComboBox(fcCont['checkuser'])
		},
		{	id:'problem',
			header:fcCont['problem'].fieldLabel,
			dataIndex:fcCont['problem'].name,
			align:"center",
			width:400,
			editor:new Ext.form.TextField()
		},
		{	id:'dept',
			header:fcCont['dept'].fieldLabel,
			dataIndex:fcCont['dept'].name,
			align:"center",
			width :120,
			renderer:function(value){
				for(var i = 0;i<dept.length;i++){
					if(value == dept[i][0]){
						return dept[i][1]
					}
				}
			},
			editor:new fmCont.ComboBox(fcCont['dept'])
		},
		{	id:'resolvetime',
			header:fcCont['resolvetime'].fieldLabel,
			dataIndex:fcCont['resolvetime'].name,
			align:"center",
			width :120,
			renderer: formatDate,
			editor:new Ext.form.DateField({
					format:'Y-m-d H:i:s',
					menu:new DatetimeMenu(fcCont['resolvetime'])
				})
			
		},
		{	id:'problemstate',
			header:fcCont['problemstate'].fieldLabel,
			dataIndex:fcCont['problemstate'].name,
			align:"center",
			width :80,
			renderer:function(value){
				for(var i = 0;i<proState.length;i++){
					if(value == proState[i][0]){
						return proState[i][1]
					}
				}
			},
			editor:new fmCont.ComboBox(fcCont['problemstate'])
		},
		{	id:'problemimportant',
			header:fcCont['problemimportant'].fieldLabel,
			dataIndex:fcCont['problemimportant'].name,
			align:"center",
			width :80,
			renderer:function(value){
				for(var i = 0;i<proImportant.length;i++){
					if(value == proImportant[i][0]){
						return proImportant[i][1]
					}
				}
			},
			editor:new fmCont.ComboBox(fcCont['problemimportant'])
		}
	]);
	
	//cmCont.defaultSortable = true;//可排序
	
	var dsCont = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanCont,
			business : business,
			method : listMethod,
			params : "1=2"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyCont
		}, ColumnsCont),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsCont.setDefaultSort(orderColumnCont, 'desc'); // 设置默认排序列
	

	gridPanelCont = new Ext.grid.EditorGridTbarPanel({
	//gridPanelCont = new Ext.grid.GridPanel({
		ds:dsCont,
		cm:cmCont,
		sm:smCont,
		border : false,
		region:'south',
		height: 273, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>检查记录<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsCont,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		insertHandler:insertCont,
		saveHandler:saveCont,
		plant : PlantCont,
		plantInt : PlantIntCont,
		servletUrl : MAIN_SERVLET,
		bean : beanCont,
		business : business,
		primaryKey : primaryKeyCont
	});
	
	
	//----------------------------------关联----------------------------------
	sm.on('rowselect',function(sm,rowIndex,record){
		cmCont.defaultSortable = true;//可排序
		selectObj = record;
		var itemuuid = record.get('uuid');
		dsCont.baseParams.params = " itemuuid='"+itemuuid+"'";
		dsCont.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('uuid');
	})
	

	var viewport = new Ext.Viewport({
		layout:'border',
		items:[gridPanel,gridPanelCont]
	})
	
	
	 gridPanel.on('cellclick', function(grid, rowIndex, columnIndex, e){
	 	var fieldName = grid.getColumnModel().getDataIndex(columnIndex); //
		if ("4" == columnIndex){
			if(notesTip.findById('uuid')) notesTip.remove('uuid');
			notesTip.add({
				id: 'uuid', 
				html: grid.getStore().getAt(rowIndex).get(fieldName)
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});
	
	gridPanelCont.on('cellclick',function(grid, rowIndex, columnIndex, e){
		var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
		var fieldText = grid.getStore().getAt(rowIndex).get(fieldName);
		if ("4" == columnIndex && fieldText!=""){
			if(notesTip.findById('uuid')) notesTip.remove('uuid');
			notesTip.add({
				id: 'uuid', 
				html: fieldText
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	})

   var notesTip = new Ext.ToolTip({
	    autoHeight : true, 
	    autowidth : true,
	    target: gridPanel.getEl()
	});
	
	
	function insertCont(){
		if(selectedData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的检查项目！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		PlantIntCont.itemuuid = selectedData;
    		gridPanelCont.defaultInsertHandler()
    	}
	}
	
	function saveCont(){
		var records = this.getStore().getModifiedRecords();
		var userUuid = true;
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			var user = record.get('checkuser');
			if(user==''||user==null){
				userUuid = false;
				break;
			}
		}
		if(userUuid){
			gridPanelCont.defaultSaveHandler();
		}else{
			Ext.Msg.show({
				title : '提示',
				msg : '检查人必须选择！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		}
	}
	
		
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d H:i'):'';
    }; 
})