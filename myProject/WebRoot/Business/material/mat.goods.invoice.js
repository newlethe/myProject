var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var bean = "com.sgepit.pmis.material.hbm.MatGoodsInvoice"
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uuid";
var orderColumn = "invNo";

Ext.onReady(function() {

    var btnConMat = new Ext.Button({
		text: '从合同材料选',
		iconCls: 'add',
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
		},'sequ' : {
			name : 'sequ',
			fieldLabel : '序号',
			anchor : '95%'
		},'invNo' : {
			name : 'invNo',
			fieldLabel : '发票编号',
			anchor : '95%'
		},'conid' : {
			name : 'conid',
			triggerClass : 'x-form-date-trigger',
			fieldLabel : '合同名称',
			readOnly:true,
			anchor : '95%'
		},'partyb' : { 
			name : 'partyb',
			fieldLabel : '乙方单位',
			anchor : '95%'
		},'invDate' : { 
			name : 'invDate',
			fieldLabel : '发票日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'buyFare' : { 
			name : 'buyFare',
			fieldLabel : '购买原价',
			anchor : '95%'
		},'transFare' : {
			name : 'transFare',
			fieldLabel : '运输费',
			anchor : '95%'
		},'otherFare' : {
			name : 'otherFare',
			fieldLabel : '其他费用',
			anchor : '95%'
		},'sum' : {
			name : 'sum',
			fieldLabel : '总价',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'sequ', type: 'string'},    		
		{name: 'invNo', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'partyb', type: 'string'},
		{name: 'invDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'buyFare',   type: 'float'}, 
		{name: 'transFare', type: 'float' },
		{name: 'otherFare', type: 'float'},
		{name: 'sum', type: 'float'},
		{name: 'remark', type: 'string'}
		];

	var Plant = Ext.data.Record.create(Columns);
	var appNo = USERNAME + new Date().format('ynjhi');
	var PlantInt = {
		uuid : null,
		sequ : appNo,
		invDate:'',
		invNo:'',
		partyb:'',
		conid:'',
		buyFare:0,
		transFare: 0,
		otherFare:0,
		sum:0,
		remark: ''
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
		id : 'sequ',
		header : fc['sequ'].fieldLabel,
		dataIndex : fc['sequ'].name,
		width : 60,
		editor : new fm.TextField(fc['sequ'])
	}, {
		id : 'invNo',
		header : fc['invNo'].fieldLabel,
		dataIndex : fc['invNo'].name,
		width : 80,
		editor : new fm.TextField(fc['invNo'])
	}, {
		id : 'partyb',
		header : fc['partyb'].fieldLabel,
		dataIndex : fc['partyb'].name,
		width : 60,
		editor : new fm.TextField(fc['partyb'])
	}, {
		id : 'conid',
		header : fc['conid'].fieldLabel,
		dataIndex : fc['conid'].name,
		width : 80,
		renderer: conName,
		editor : conField
	}, {
		id : 'invDate',
		header : fc['invDate'].fieldLabel,
		dataIndex : fc['invDate'].name,
		width : 40,
		editor : new fm.DateField(fc['invDate']),
		renderer: formatDate
	}, {
		id : 'buyFare',
		header : fc['buyFare'].fieldLabel,
		dataIndex : fc['buyFare'].name,
		width : 40,
		editor : new fm.NumberField(fc['realDate'])
	}, {
		id : 'transFare',
		header : fc['transFare'].fieldLabel,
		dataIndex : fc['transFare'].name,
		width : 60,
		editor : new fm.NumberField(fc['transFare'])
	}, {
		id : 'otherFare',  
		header : fc['otherFare'].fieldLabel,
		dataIndex : fc['otherFare'].name,
		editor : new fm.NumberField(fc['otherFare'])
	}, {
		id : 'sum',  
		header : fc['sum'].fieldLabel,
		dataIndex : fc['sum'].name,
		editor : new fm.NumberField(fc['othersumFare'])
	} ,{
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
		tbar : ['<font color=#15428b><b>到货发票管理</b></font>','-'],
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
	var gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-ss-panel',
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
		crudText: {add:'从入库中选择物资'},
		insertHandler: selectMat,
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
		items: [gridPanelB, gridPanel]
		
	}) 

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});

	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var invoiceId = record.get('uuid');
   		dsB.baseParams.params = " invoiceId ='" + invoiceId + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	

   	function formatDate(value){ 
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
    // 入库单
   	function selectMat(){
   		if (sm.hasSelection()){
   			var invoiceId = sm.getSelected().get('uuid');
   			window.location.href = BASE_PATH+"Business/material/mat.goods.invoice.select.jsp?invoiceId=" + invoiceId;
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
});



