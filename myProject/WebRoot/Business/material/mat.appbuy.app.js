var bean = "com.sgepit.pmis.material.hbm.MatAppbuyApply"
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var beanBdg = "com.sgepit.pmis.budget.hbm.BdgInfo"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "appNo";
var userDept = USERORG.split(",")[0]
var materialUse = new Array()
var applyUse = new Array()
var currentPage = 0
var currentRowIndex = 0
var selectWin;
Ext.onReady(function() {
	
	//判断当前页 当前 记录是否设置了值；如果设置了则取出来并清空cookie
	var cookprovider = new Ext.state.CookieProvider()
	Ext.state.Manager.setProvider(cookprovider)
	if(Ext.state.Manager.get("materialPage")||Ext.state.Manager.get("materialRow")){
		currentPage = Ext.state.Manager.get("materialPage")
		currentRowIndex = Ext.state.Manager.get("materialRow")
		cookprovider.clearCookie("materialRow")
		cookprovider.clearCookie("materialPage")		
//		alert(currentPage+'\n'+currentRowIndex)
	}
	
	//DWREngine.setAsync(false)          
	//获得材料用途的数据
	
	//appMgm.getCodeValue('材料用途',function(list){
		for(i = 0;i<appList.length;i++){
			var temp = new Array()
			temp.push(appList[i].propertyCode);
			temp.push(appList[i].propertyName)
			materialUse.push(temp)
		}
	//})
	
	//获得材料申请类型的数据
	//appMgm.getCodeValue('材料申请用途',function(list){
		for(i = 0;i<appUse.length;i++){
			var temp2 = new Array()
			temp2.push(appUse[i].propertyCode)
			temp2.push(appUse[i].propertyName)
			applyUse.push(temp2)
		}
	//})
	//DWREngine.setAsync(true)
    
	var dsMaterialUse = new Ext.data.SimpleStore({
		fields:['index','value'],
		data:materialUse
	})
	
	var dsApplyUse = new Ext.data.SimpleStore({
		fields:['key','value'],
		data:applyUse
	})
	
    var btnConMat = new Ext.Button({
		text: '从合同材料选',
		iconCls: 'add',
		hidden:true,
		handler: function(){
			if (sm.hasSelection()){
				var conid = sm.getSelected().get('conid');
				if (conid){
					var appid = sm.getSelected().get('uuid');
					window.location.href = BASE_PATH + "Business/material/mat.tree.con.select.jsp?conid=" 
						+ conid+ "&appid="+ appid +"&type=apply";	
				}else{
					Ext.Msg.show({
						title: '提示',
			            msg: '请选择一个合同',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					})
				}
			}else{
				Ext.Msg.show({
						title: '提示',
			            msg: '请选择一条主记录',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					})
			}
		}
	});
	
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
			readOnly:true,
			anchor : '95%'
		},'appDate' : { 
			name : 'appDate',
			fieldLabel : '申请日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'conid' : {
			name : 'conid',
			fieldLabel : '合同名称',
			readOnly:true,
			triggerClass : 'x-form-date-trigger',
//			listeners:{'triggerClick':function(){alert(111)}},
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
		},'action' : {  
			name : 'action',
			fieldLabel : '用途',  
			valueField:'index',
			displayField:'value',
			mode:'local',
			typeAhead:true,
			triggerAction:'all',
			store:dsMaterialUse,
			lazyRender:true,
			listClass:'x-combo-list-small',
			anchor : '95%'
		},'appType' : {  
			name : 'appType',
			fieldLabel : '申请类型',
			valueField:'key',
			displayField:'value',
			mode:'local',
			typeAhead:true,
			triggerAction:'all',
			store:dsApplyUse,
			lazyRender:true,
			listClass:'x-combo-list-small',
			anchor : '95%'
		},'appMan' : {  
			name : 'appMan',
			fieldLabel : '申请人',  
			readOnly:true,
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
		{name: 'appMan', type: 'string'},
		{name: 'action', type: 'string'},
		{name: 'appType', type: 'string'},
		{name: 'billSate', type: 'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		appNo : appNo,
		appDept : userDept,
		appDate:'',
		conid:'',
		bdgid : '',
		appMoney: null,
		proveMoney : null,
		appType:'1',
		appMan:REALNAME,
		action: '1',
		billSate: ''
	}
	
	var conField = new Ext.form.TriggerField(fc['conid']); 
    conField.onTriggerClick = function (){newWin()}
    
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
		renderer: conName,
		editor : conField
	}, {
		id : 'bdgid',
		header : fc['bdgid'].fieldLabel,
		dataIndex : fc['bdgid'].name,
		width : 90,
		editor: comboxWithTree,
	    renderer: bdgName
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
		id : 'action',  
		header : fc['action'].fieldLabel,
		dataIndex : fc['action'].name,
		editor : new fm.ComboBox(fc['action']),
		width : 40,
		renderer:materialUseName
	},{
		id : 'appType',
		header : fc['appType'].fieldLabel,
		dataIndex : fc['appType'].name,
		width : 40,
		editor : new fm.ComboBox(fc['appType']),
		renderer:applyUseName
	},  {
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
			params : "appMan = '"+REALNAME +"'"
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
//		collapsible : true, // 是否可折叠
//		split: true,
//		model: 'mini',
		tbar : ['<font color=#15428b><b>申请计划</b></font>','-'],
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
			params:{start: currentPage, limit: 5 },
			callback:function(){
				//gridPanel.getSelectionModel().selectRow(currentRowIndex)
			}
	});

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
	},{
		id : 'buyId',
		header : fcB['buyId'].fieldLabel,
		dataIndex : fcB['buyId'].name,
		hidden : true
	},{
		id : 'buyNo',
		header : fcB['buyNo'].fieldLabel,
		dataIndex : fcB['buyNo'].name,
		hidden : true
	},{
		id : 'buyNum',
		header : fcB['buyNum'].fieldLabel,
		dataIndex : fcB['buyNum'].name,
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
		id : 'buyWay',
		header : fcB['buyWay'].fieldLabel,
		dataIndex : fcB['buyWay'].name,
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
		tbar : [btnConMat, '-'],
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
		crudText: {add:'从材料清单选'}, 
		insertHandler: getAppMat,
		saveHandler: beforeSave,
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean:beanB,
		business : businessB,
		primaryKey : primaryKeyB
	});
	
	dsB.on('load',function(){
		if(sm.getSelected()){
			var appid = sm.getSelected().get('uuid')
			if(sm.getSelected().get('appMoney') != dsB.sum('sum')&&appid != null){
				sm.getSelected().set('appMoney',dsB.sum('sum'))
				sm.getSelected().commit()
				//appBuyMgm.updateSumPrice(appid)
			}
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
	
	//-------------------------------------------function ------------------------------
	
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var appid = record.get('uuid');
   		dsB.baseParams.params = " appid ='" + appid + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   		Ext.state.Manager.set("materialPage",gridPanel.getBottomToolbar().cursor)
   		Ext.state.Manager.set("materialRow",rowIndex)
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
   	
   	function getAppMat(){
   		if (sm.hasSelection()){
   			var appid = sm.getSelected().get('uuid');
//   			window.location.href = BASE_PATH+"jsp/material/mat.appbuy.app.tree.jsp?appid="
//   					+appid + "&type=apply";
   			if (!selectWin){
	   			selectWin = new Ext.Window({
					title: '选择',
					closeAction: 'hide',
					width: 800, height: 450,
					modal: true, plain: true, border: false, resizable: false,
					
					autoLoad: {
						url: BASE_PATH + 'Business/material/viewDispatcher.jsp',
						params: 'page=tree&appid='+appid+'&type=apply',
						text: 'Loading...'
					},
					listeners: {
						hide: function(){
							dsB.reload();
							if (isFlwTask == true){
								Ext.Msg.show({
									title: '您成功维护了申请计划信息！',
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
		            msg: '请选择一条申请计划',
		            icon: Ext.Msg.WARNING, 
		            width:200,
		            buttons: Ext.MessageBox.OK
			})
   		}
   	}
   	
   	function beforeSave(){
   		var records = dsB.getModifiedRecords();
   		for (var i=0; i<records.length; i++){
   			records[i].set('sum', parseFloat(records[i].get('price'))*parseFloat(records[i].get('appNum')));
   		}
   		gridPanelB.defaultSaveHandler();
   	}
   	
   	function newWin(){
		if(!conWindow){
	         conWindow = new Ext.Window({	               
	             title: '合同列表',
	             layout: 'fit',
	             width: 800,
	             height: 450,
	             modal: true,
	             closeAction: 'hide',
	             constrain:true,
	             maximizable: true,
	             plain: true,	                
	             items: gridCon
             });
    	}
    	dsCon.load({params:{start: 0,limit:  PAGE_SIZE}});
    	conWindow.show();
   	}
   	
   	function conName(value){
   		var conname = '';
   		if(value == ''||value == null)
   			return ''
   		DWREngine.setAsync(false);  
   			baseMgm.findById(beanCon, value, function(obj){
   				conname = obj.conname;
   			});
   		DWREngine.setAsync(true); 
   		return conname;
   	}
   	
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
	
	function materialUseName(value){
		if(value != ''){
			for(i = 0;i<materialUse.length;i++){
				if(value == materialUse[i][0]){
					return materialUse[i][1]
				}
			}
		}
		return ''
	}
	
	function applyUseName(value){
		if(value != ''){
			for(i = 0;i<applyUse.length;i++){
				if(value == applyUse[i][0]){
					return applyUse[i][1]
				}
			}
		}
		return ''
	}
});

