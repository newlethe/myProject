var backlogWin = backlogWin || {}; 

(function(){
	
	var bean = "com.imfav.business.customer.hbm.CustBacklog";
	var PAGE_SIZE = 10;
	
	//TODO:回访日志表单
	var saveBtn = new Ext.Button({
		id:'save',
		text:'保存',
		minWidth :80,
		handler:formSave
	});
	
	var resetBtn = new Ext.Button({
		id : 'reset',
		text : '重置',
		minWidth : 80,
		handler : resetForm
	});
	
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭',
		minWidth:80,
		handler:function(){
			resetForm();
			backlogWin.hide();
		}
	});
	
	function formSave(){
		var form = formPanel.getForm();
    	var logContent = form.findField("logContent").getValue();
    	if(logContent == null || logContent == ""){
    		Ext.example.msg("提示","请填写回访日志后再保存！")
    		return false;
    	}
		saveBtn.setDisabled(true)
    	var obj = new Object();
    	for (var i=0; i<Columns.length; i++){
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
		Ext.getBody().mask("数据保存中，请稍等！");
   		stockMgm.addOrUpdateStockBacklog(obj, function(uids){
   			if(uids == null || uids == ""){
   				Ext.example.msg("提示","回访日志保存失败！")
   			}else{
   				Ext.example.msg("提示","回访日志保存成功！")
   				form.findField('uids').setValue(uids);
   				ds.reload();
   				resetForm();
   			}
   			Ext.getBody().unmask();
   			saveBtn.setDisabled(false);
   		})
	}
	
	function resetForm(){
		var form = formPanel.getForm();
		form.findField("logContent").reset();
		form.findField("uids").reset();
	}
	
	var formPanel = new Ext.form.FormPanel({
		header:false,
		border:false,
		split: true,
		bodyStyle:'padding:10px;',
		labelAlign:'left',
		region: 'north',
        labelWidth: 60,
        height:127,
		items : [{
			layout : 'column',
			border : false,
			items : [{
				layout : 'form',
				columnWidth : .95,
				border : false,
				items : [new Ext.form.TextArea({id:'logContent',name:'logContent',fieldLabel:'回访日志',width:560,allowBlank:false}),
				new Ext.form.Label({html:'<div style="color:red;float:right;">* 请核对信息无误后再保存！</div>'})]
			}]
		},{
			layout : 'column',
			hidden: true,
            hideLabel:true,
            items : [
            	new Ext.form.TextField({name:'uids',fieldLabel:'主键'})
            	,new Ext.form.TextField({name:'custUids',fieldLabel:'客户'})
            	,new Ext.form.TextField({name:'addUser',fieldLabel:'添加人'})
            	]
		}],
		buttonAlign:'center',
		buttons:[saveBtn,closeBtn]
	});
	
	
	//TODO:回访日志列表
	var Columns = [
		{name: 'uids', type: 'string'}
		,{name: 'custUids', type: 'string'}
		,{name: 'addUser', type: 'string'}
		,{name: 'addTime', type: 'date', dateFormat: 'Y-m-d H:i:s'}
		,{name: 'logContent', type: 'string'}
	];
	var Plant = Ext.data.Record.create(Columns);	
    var PlantInt = {
    	uids:''
    	,custUids: ''
    	,addUser: USERID
    	,addTime: SYS_DATE_DATE
    	,logContent: ''
    }	
    
	var fc={
		 'uids':{name:'uids',fieldLabel:'主键'}
		,'custUids':{name:'custUids',fieldLabel:'客户'}
		,'addUser':{name:'addUser',fieldLabel:'添加人'}
		,'addTime':{name:'addTime',fieldLabel:'添加时间',format:'Y-m-d'}
		,'logContent':{name:'logContent',fieldLabel:'回访日志'}
	};
	
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true})
	var rowNum = new Ext.grid.RowNumberer({header:'',width:25});
	var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm
		rowNum
    	, {id:'uids',header: fc['uids'].fieldLabel,dataIndex: fc['uids'].name,hideable:false,hidden:true}
    	, {id:'custUids',header: fc['custUids'].fieldLabel,dataIndex: fc['custUids'].name,hideable:false,hidden:true}
    	, {id:'logContent',header: fc['logContent'].fieldLabel,dataIndex: fc['logContent'].name,width:85}
    	, {id:'addUser',header: fc['addUser'].fieldLabel,dataIndex: fc['addUser'].name,hideable:false,hidden:true,
    		align:"center",renderer:function(value){return formatCombo(value,userArr)}}
    	, {id:'addTime',header: fc['addTime'].fieldLabel,dataIndex: fc['addTime'].name,width:15,
    		align:"center",renderer : formatDate}
	]);
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds.setDefaultSort("addTime", 'desc');
	
	var gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		border: false,
		region: 'center',
		title:'回访日志列表',
		height: 290,
		autoScroll: true,
		collapsible: false,
		animCollapse: false,
		loadMask: true,
		bbar: new Ext.PagingToolbar({
		    pageSize: PAGE_SIZE,
		    store: ds,
		    displayInfo: true,
		    displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		}),
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	
	var panel = new Ext.Panel({
		items:[formPanel,gridPanel]
	})
	
	backlogWin = new Ext.Window({
		width: 700,
		height: 450,
		modal: true, 
		plain: true, 
		border: false,
		title: '编辑回访日志',
		resizable: false,
		layout: 'fit',
		closeAction : 'hide',
		items: [panel]
		,showBacklogWin: showBacklogWin
		,closeBacklogWin: closeBacklogWin
	});
	
	var closeBtn = new Ext.Button({
		id:'close',
		text:'关闭窗口',
		iconCls: 'remove',
		handler:function(){
			backlogWin.hide();
		}
	});
	
	function showBacklogWin(custUids,editable){
		backlogWin.show();
		var form = formPanel.getForm();
		form.findField("custUids").setValue(custUids);
		form.findField("addUser").setValue(USERID);
		ds.baseParams.params = " 1=1 and custUids = '"+custUids+"' and addUser = '"+USERID+"' ";
		ds.load({params:{start:0,limit: PAGE_SIZE}});
	}
	
	function closeBacklogWin(custDs){
		//custDs.reload();
	}
	
})();