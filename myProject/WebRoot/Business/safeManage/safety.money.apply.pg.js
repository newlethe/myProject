var bean = "com.sgepit.pmis.safeManage.hbm.SafetyMoneyApplyPg"
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uuid';
var orderColumn = 'uuid';

var maxStockBh = ""
var filterStr = " pguser='"+USERID+"'";
filterStr = " 1=1 and pid='"+CURRENTAPPID+"' ";
var filterStrPG = " applyuser='"+USERID+"' and billstate='0'";
filterStrPG = "billstate='1' and pid='"+CURRENTAPPID+"' ";

var beanPG = "com.sgepit.pmis.safeManage.hbm.SafetyMoneyApply"
var businessPG = "baseMgm";
var listMethodPG = "findwhereorderby";
var primaryKeyPG = 'uuid';
var orderColumnPG = 'uuid';


var selectRecord = "";
var checkUuidPG = "";
var uuid_edit = "";

var formWin;
var formWinAddPg;
var gridPanel;

var loadFormRecord = null;
var formRecord;

var billstate = new Array();
billstate = [['0','新增'],['-1','评估中'],['1','评估完成']];

Ext.onReady(function(){

	if(isFlwTask || isFlwView){
		filterStr +=" and flowid='"+bh_flow+"' and pid='"+CURRENTAPPID+"' ";
	}
	
	DWREngine.setAsync(false);
 	//-----------------评估人
 	var pgUser = new Array();
 	baseMgm.getData("select userid,realname from rock_user where userid = '"+USERID+"'",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			pgUser.push(temp);
		}
    });
 	DWREngine.setAsync(true);
  	var pgUserDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:pgUser
 	})
	
	
	var fm = Ext.form;
	var fc = {
		'uuid':{name:'uuid',fieldLabel:'UUID',hidden:true,hideLabel:true},
		'applyuuid':{name:'applyuuid',fieldLabel:'安全专款UUID',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'流程编号',readOnly:true,anchor:'95%'},		
		'pgtime':{name:'pgtime',fieldLabel:'评估时间',allowBlank:false,anchor:'95%',format:'Y-m-d'},
		'pguser':{name:'pguser',fieldLabel:'评估人',anchor:'95%'},
		'using':{name:'using',fieldLabel:'专款使用情况',allowBlank:false,anchor:'95%'},
		'billstate':{name:'billstate',fieldLabel:'审批状态',anchor:'95%',hidden:true,hideLabel:true},
		'pid':{name:'pid',fieldLabel:'PID',anchor:'95%',hidden:true,hideLabel:true}
	} 
	
	var Columns = [
		{name:'uuid',type:'string'},
		{name:'applyuuid',type:'string'},
		{name:'flowid',type:'string'},
		{name:'pgtime',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'pguser',type:'string'},
		{name:'using',type:'string'},
		{name:'billstate',type:'string'},
		{name:'pid',type:'string'}
	]
	
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uuid',header:fc['uuid'].fieldLabel,dataIndex:fc['uuid'].name,hidden:true},
		{id:'applyuuid',header:fc['applyuuid'].fieldLabel,dataIndex:fc['applyuuid'].name,hidden:true},
		{id:'flowid',header:fc['flowid'].fieldLabel,dataIndex:fc['flowid'].name,align:'center',width:30},
		{id:'pgtime',header:fc['pgtime'].fieldLabel,dataIndex:fc['pgtime'].name,align:'center',
			width:30,
			renderer:formatDate
		},
		{id:'pguser',header:fc['pguser'].fieldLabel,dataIndex:fc['pguser'].name,align:'center',
			width:30,
			renderer:function(value){
				DWREngine.setAsync(false);
				var user="";
				baseMgm.getData("select userid,realname from rock_user where userid = '"+value+"'",function(list){
				 	if(list.length>0){
				 		user = list[0][1];
				 	}
				});
				DWREngine.setAsync(true);
				return user;
			}
		},
		{id:'using',header:fc['using'].fieldLabel,dataIndex:fc['using'].name,align:'center',
			width:200,
			editor : new fm.TextField(fc['using'])
		},
		{id:'billstate',header:fc['billstate'].fieldLabel,dataIndex:fc['billstate'].name,align:'center',
			width:30,
			renderer:function(value){
				var bill="";
				for(var i=0;i<billstate.length;i++){
					if(billstate[i][0]==value){
						bill=billstate[i][1];
						break;
					}
				}
				return bill;
			}
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true}
	])
	
	
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : filterStr
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
	ds.setDefaultSort(orderColumn, 'desc');	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	cm.defaultSortable = true;//可排序
	
	var addBtn = new Ext.Button({
		id:'add',
		text:'新增',
    	tooltip: '新增',
    	iconCls:'add',
    	handler:insertApplyPgFun
	})
	var editBtn = new Ext.Button({
		id:'edit',
		text:'修改',
		tooltip:'修改',
		iconCls:'btn',
		handler:editApplyPgFun
	})
	 var delBtn = new Ext.Button({
	 	id:'del',
    	text:'删除',
    	tooltip: '删除',
    	iconCls:'remove',
    	handler:delFun
    })
	
	gridPanel = new Ext.grid.GridPanel({
		ds:ds,
		sm:sm,
		cm:cm,
		tbar : ['<font color=#15428b><b>安全专款执行情况评估</b></font>','-',addBtn,editBtn,delBtn],
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, 				// 自动出现滚动条
		collapsible : false, 			// 是否可折叠
		animCollapse : false, 			// 折叠时显示动画
		loadMask : true, 				// 加载时是否显示进度
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
		})
	})
	
	
	gridPanel.on("afterinsert",function(){
		if(bh_flow!=null && bh_flow!=""){
			maxStockBh = bh_flow;
		}
		var rec = sm.getSelected();
		if(maxStockBh!= null){
			rec.set("flowid",maxStockBh);
		} else{
			incrementLsh = incrementLsh +1
			rec.set("flowid",maxStockBhPrefix + String.leftPad(incrementLsh,4,"0"))
		}
		maxStockBh = null;
	})
	
	
	sm.on('rowselect', function(sm, rowIndex, record){
   		selectRecord = record;
   		uuid_edit = record.get('uuid');
   		var bill = record.get('billstate');
   		if(isFlwTask){
   			with(gridPanel.getTopToolbar().items){
   				get('edit').enable();
				if(bill=='-1' || bill=="0"){
					get('add').disable();
					get('del').disable();
				}else{
					get('add').enable();
					get('del').enable();
				}
			}
   		}else if(isFlwView){
   			gridPanel.getTopToolbar().disable();
   		}else{
   			with(gridPanel.getTopToolbar().items){
   				get('add').enable();
				if(bill=='-1' || bill=="1"){
					get('edit').disable();
					get('del').disable();
				}else{
					get('edit').enable();
					get('del').enable();
				}
			}
   		}
   })
   
   
   //-------------------------查询出安全专款------------------------------
	var fcPG = {
		'uuid':{name:'uuid',fieldLabel:'UUID',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'流程编号',anchor:'95%'},
		'applytime':{name:'applytime',fieldLabel:'申请时间',allowBlank:false,anchor:'95%',format:'Y-m-d'},
		'applydept':{name:'applydept',fieldLabel:'申请部门',anchor:'95%'},
		'applyuser':{name:'applyuser',fieldLabel:'申请人',anchor:'95%'},
		'applymoney':{name:'applymoney',fieldLabel:'计划申请费用',allowBlank:false,anchor:'95%'},
		'using':{name:'using',fieldLabel:'用途',allowBlank:false,anchor:'95%'},
		'billstate':{name:'billstate',fieldLabel:'审批状态',anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'PID',anchor:'95%',hidden:true,hideLabel:true}
	} 
	
	var ColumnsPG = [
		{name:'uuid',type:'string'},
		{name:'flowid',type:'string'},
		{name:'applytime',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'applydept',type:'string'},
		{name:'applyuser',type:'string'},
		{name:'applymoney',type:'float'},
		{name:'using',type:'string'},
		{name:'billstate',type:'string'},
		{name:'pid',type:'string'}
	]
	
	var checkSafetyApply = new Ext.Button({
    	text:'选择',
    	tooltip: '选择',
    	iconCls:'btn',
    	handler:checkApplyFun
    })

   	var smPG = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cmPG = new Ext.grid.ColumnModel([
		smPG,
		{id:'uuid',header:fcPG['uuid'].fieldLabel,dataIndex:fcPG['uuid'].name,hidden:true},
		{id:'flowid',header:fcPG['flowid'].fieldLabel,dataIndex:fcPG['flowid'].name,align:'center',width:60},
		{id:'applytime',header:fcPG['applytime'].fieldLabel,dataIndex:fcPG['applytime'].name,align:'center',
			width:50,
			renderer:formatDate
		},
		{id:'applydept',header:fcPG['applydept'].fieldLabel,dataIndex:fcPG['applydept'].name,align:'center',
			width:50,
			renderer:function(value){
				DWREngine.setAsync(false);
				var dept="";
				baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"+value+"'order by unitid",function(list){  
				 	if(list.length>0){
				 		dept = list[0][1];
				 	}
				});
				DWREngine.setAsync(true);
				return dept;
			}
		},
		{id:'applyuser',header:fcPG['applyuser'].fieldLabel,dataIndex:fcPG['applyuser'].name,align:'center',
			width:50,
			renderer:function(value){
				DWREngine.setAsync(false);
				var user="";
				baseMgm.getData("select userid,realname from rock_user where userid = '"+value+"'",function(list){
				 	if(list.length>0){
				 		user = list[0][1];
				 	}
				});
				DWREngine.setAsync(true);
				return user;
			}
		},
		{id:'applymoney',header:fcPG['applymoney'].fieldLabel,dataIndex:fcPG['applymoney'].name,align:'center',
			width:50,
			renderer: function(value){ return "<div align='right'>"+cnMoney(value)+"</div>"}
		},
		{id:'using',header:fcPG['using'].fieldLabel,dataIndex:fcPG['using'].name,align:'center',width:150},
		{id:'billstate',header:fcPG['billstate'].fieldLabel,dataIndex:fcPG['billstate'].name,align:'center',
			width:30,
			renderer:function(value){
				var bill="";
				for(var i=0;i<billstate.length;i++){
					if(billstate[i][0]==value){
						bill=billstate[i][1];
						break;
					}
				}
				return bill;
			}
		},
		{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true}
	])
	
	
	var dsPG = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanPG,
			business : businessPG,
			method : listMethodPG,
			params : filterStrPG
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyPG
		}, ColumnsPG),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsPG.setDefaultSort(orderColumnPG, 'desc');	
	dsPG.load({params:{start:0,limit:PAGE_SIZE}});
	cmPG.defaultSortable = true;//可排序
   
   
   var safetyApplyPanel = new Ext.grid.GridPanel({
		ds: dsPG,
		cm: cmPG,
		sm: smPG,
		border : false,
		region:'center',
		split:true,
		height: 286,
		model: 'mini',
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar:['选择安全专款','->',checkSafetyApply],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsPG,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	dsPG.load({params:{start:0,limit:PAGE_SIZE}});
	smPG.on('rowselect',function(sm,rowIndex,record){
		checkUuidPG = record.get('uuid');
	})
   

   	
   	//------------------添加安全专款执行情况评估---------------
   	
   	function showAddOrUpdate(uuid_edit){
   			//新增编号获取
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		DWREngine.setAsync(false);	
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","SAFETY_MONEY_APPLY_PG",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		});
		DWREngine.setAsync(true);
		if(bh_flow==null || bh_flow==""){
			bh_flow = maxStockBh;
		}
	
	   	formRecord = Ext.data.Record.create(Columns);
		if(uuid_edit == null || uuid_edit==""){
			var bill = 0;
			if(isFlwTask){
				bill = -1;
			}
			loadFormRecord = new formRecord({
				uuid:'',
				applyuuid:checkUuidPG,
				flowid:bh_flow,
				pgtims:'',
				pguser:'',
				using:'',
				billstate:bill,
				pid:CURRENTAPPID
			});
		}else{
		    DWREngine.setAsync(false);
			baseMgm.findById(bean, uuid_edit,function(obj){
				loadFormRecord = new formRecord(obj);
			});
			DWREngine.setAsync(true);
		}
		formPanel.getForm().loadRecord(loadFormRecord);
	}	

	
   	var BUTTON_CONFIG = {
    	'SAVE': {
			id: 'save',
	        text: '保存',
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        handler: function(){
	        	formWinAddPg.hide();
	        }
	    }
    };
    var pgTimeField = new Ext.form.DateField({
		name: 'pgtime',
		fieldLabel: '评估时间',
		allowBlank:false,
		format:'Y-m-d',
		readOnly:true
	})
	
	var pgUserField = new fm.ComboBox({
		name:'pguser',
		fieldLabel:'评估人',
		allowBlank:false,
		valueField:'k',
		displayField: 'v',
		mode: 'local',
	    triggerAction: 'all',
	    store: pgUserDs,
	    readOnly:true
	}) 
	
	var usingFiled = new fm.TextArea({
		name:'using',
		fieldLabel:'专款使用详情',
		allowBlank:false,
		width:300,
		height:100
	})
   	
   	
   	var formPanel = new Ext.FormPanel({
		id: 'form-panel',
		header: false,
		border: false,
		autoScroll:true,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
    	items:[
	    	new Ext.form.FieldSet({
				title: '基本信息',
				autoWidth:true,
				border: true,
				layout: 'column',
				items:[
					new fm.TextField(fc['uuid']),
					new fm.TextField(fc['applyuuid']),
					new fm.TextField(fc['billstate']),
					new fm.Hidden(fc['pid']),
		    		{
		    			layout: 'form',
		    			columnWidth:.80,
			   			bodyStyle: 'border:0px;',
			   			items:[   				
			  				new fm.TextField(fc['flowid']),
							pgTimeField,
							pgUserField,
			   				usingFiled
			   			]
	    			}
	    			
				]
			})	
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	});
	
	
	var addSafetyApplyPgPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	items: [formPanel]
    });
   	
	
	
	function insertApplyPgFun(){
		if(!formWin){
			formWin = new Ext.Window({	               
				title: '请先选择需要评估的安全专款',
				closable: false,
				closeAction: 'hide',
				width: 780, minWidth: 560, height: 400,
				layout: 'fit', iconCls: 'form',
				border: false, constrain: true, maximizable: true, modal: true,
				items: [safetyApplyPanel]
			});   
	     }
	     formWin.show();
	}	
	
	function editApplyPgFun(){
		if(uuid_edit==null || uuid_edit==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择执行情况评估内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}else{
			if(!formWinAddPg){
				formWinAddPg = new Ext.Window({	               
					title: '修改安全专款执行情况评估',
					width: 600, minWidth: 560, height: 400,
					layout: 'fit', iconCls: 'form', closeAction: 'hide',
					border: false, constrain: true, maximizable: true, modal: true,
					items: [addSafetyApplyPgPanel]
				}); 
			}
			formWinAddPg.show();
			showAddOrUpdate(uuid_edit);
		}	
	}
	
	function checkApplyFun(){
   		if(checkUuidPG!="" && checkUuidPG!=""){
   			formWin.hide();
   			if(!formWinAddPg){
   				formWinAddPg = new Ext.Window({	               
					title: '新增安全专款执行情况评估',
					width: 600, minWidth: 560, height: 400,
					layout: 'fit', iconCls: 'form', closeAction: 'hide',
					border: false, constrain: true, maximizable: true, modal: true,
					items: [addSafetyApplyPgPanel]
				}); 
   			}
			formWinAddPg.show();
			showAddOrUpdate('');
			formPanel.getForm().findField('pguser').setValue(pgUser[0][0]);
			formPanel.getForm().findField('pgtime').setValue('');
			//var form = formPanel.getForm();
			//form.findField('applyuuid').setValue(checkUuidPG);		
		}
   	}
   	
   	var viewport = new Ext.Viewport({
		layout:'border',
		items:[gridPanel],
		listeners: {
			afterlayout: function(){
				if(isFlwTask){
					with(gridPanel.getTopToolbar().items){
						get('del').disable();
						get('add').disable();
					}
					//查询此编号流程是否存在，存在则直接读出
					DWREngine.setAsync(false);
					safeManageMgmImpl.findBeanByProperty(bean,'flowid',bh_flow,function(obj){
						if(obj==null){
							insertApplyPgFun();
						}
					});
					DWREngine.setAsync(true);
				}
				if(isFlwView){
					gridPanel.getTopToolbar().disable();
				}		
			}
		}
	})
   	
   	
   	function formSave(){
   		var form = formPanel.getForm();
		var time = form.findField('pgtime').getValue();
		var using = form.findField('using').getValue();
		if (time==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '评估时间不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else if (using==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '专款使用情况不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
		if (form.isValid()){
	    	doFormSave();
		}	
	}
	
	
	function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.uuid == '' || obj.uuid == null){
	   		safeManageMgmImpl.insertSafetyMoneyApplyPg(obj, function(state){
	   			Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   		});
	   		if(isFlwTask){
				Ext.Msg.show({
				   title: '保存成功！',
				   msg: '您成功新增了一条安全专款申请信息！　　　<br>可以发送流程到下一步操作！',
				   buttons: Ext.Msg.OK,
				   icon: Ext.MessageBox.INFO,
				   fn: function(value){
				   		if ('ok' == value){
				   			parent.IS_FINISHED_TASK = true;
							parent.mainTabPanel.setActiveTab('common');
				   		}
				   }
				});
			}
   		}else{
   			safeManageMgmImpl.updateSafetyMoneyApplyPg(obj, function(state){
	   			Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   		});
   		}
   		DWREngine.setAsync(true);
   		if(isFlwTask){
   			//Ext.get('add').disable();
   			ds.baseParams.params=filterStr;
   		}else{
   			bh_flow="";
   		}
   		formWinAddPg.hide();
		ds.load({params:{start:0,limit:PAGE_SIZE}});
    }
    
    function delFun(){
		if(uuid_edit==null || uuid_edit==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择需要删除的评估内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}else{
			Ext.MessageBox.confirm('确认', '删除该评估信息将不可恢复，请谨慎操作！<br><br>确认要删除吗？',function(btn,text) {
				if (btn == "yes") {
					DWREngine.setAsync(false);
					safeManageMgmImpl.deleteSafetyMoneyApplyPg(bean,uuid_edit,function(data){
						Ext.example.msg('删除成功！', '您成功删除了一条评估信息！');
						cmPG.defaultSortable = false;//可排序
						ds.reload();
					});
				    DWREngine.setAsync(true);
				}
			}, this);			
		}
	}
    
	
	gridPanel.on('cellclick',function(grid, rowIndex, columnIndex, e){
		var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
		var fieldText = grid.getStore().getAt(rowIndex).get(fieldName);
		if (columnIndex == "6" && fieldText!=""){
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
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d'):'';
    }; 
})




