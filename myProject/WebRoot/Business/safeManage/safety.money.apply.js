var bean = "com.sgepit.pmis.safeManage.hbm.SafetyMoneyApply"
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uuid';
var orderColumn = 'uuid';

var maxStockBh = ""
var filterStr = " applyuser='"+USERID+"' and pid='"+CURRENTAPPID+"' ";
//filterStr = " 1=1 ";

var selectRecord = "";

var billstate = new Array();
billstate = [['0','新增'],['-1','申请中'],['1','申请完成']];

Ext.onReady(function(){

	if(isFlwTask || isFlwView){
		filterStr +=" and flowid='"+bh_flow+"'";
	}
	
	//新增编号获取
	maxStockBhPrefix = USERNAME + new Date().format('ym');
	DWREngine.setAsync(false);	
	stockMgm.getStockPlanNewBh(maxStockBhPrefix,"FLOWID","SAFETY_MONEY_APPLY",null,function(dat){
		if(dat != "")	{
			maxStockBh = dat;
			incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
		}	
	});
	DWREngine.setAsync(true);	
	
	var fm = Ext.form;
	var fc = {
		'uuid':{name:'uuid',fieldLabel:'UUID',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'流程编号',anchor:'95%'},
		'applytime':{name:'applytime',fieldLabel:'申请时间',allowBlank:false,anchor:'95%',format:'Y-m-d'},
		'applydept':{name:'applydept',fieldLabel:'申请部门',anchor:'95%'},
		'applyuser':{name:'applyuser',fieldLabel:'申请人',anchor:'95%'},
		'applymoney':{name:'applymoney',fieldLabel:'计划申请费用',allowBlank:false,anchor:'95%'},
		'using':{name:'using',fieldLabel:'用途',allowBlank:false,anchor:'95%'},
		'billstate':{name:'billstate',fieldLabel:'审批状态',anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'PID',anchor:'95%'}
	} 
	
	var Columns = [
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
	
	var Plant = Ext.data.Record.create(Columns);
	var bill = "0";
	if(isFlwTask){
		bill = "-1"
	}
	
	PlantInt = {
		uuid:'',
		flowid:bh_flow,
		applytime:'',
		applydept:UNITID,
		applyuser:USERID,
		applymoney:'',
		using:'',
		billstate:bill,
		pid:CURRENTAPPID
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uuid',header:fc['uuid'].fieldLabel,dataIndex:fc['uuid'].name,hidden:true,
			renderer:function(){ 
				//sm.selectFirstRow();
			}
		},
		{id:'flowid',header:fc['flowid'].fieldLabel,dataIndex:fc['flowid'].name,align:'center',width:60},
		{id:'applytime',header:fc['applytime'].fieldLabel,dataIndex:fc['applytime'].name,align:'center',
			width:50,
			renderer:formatDate,
			editor : new fm.DateField(fc['applytime'])
		},
		{id:'applydept',header:fc['applydept'].fieldLabel,dataIndex:fc['applydept'].name,align:'center',
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
		{id:'applyuser',header:fc['applyuser'].fieldLabel,dataIndex:fc['applyuser'].name,align:'center',
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
		{id:'applymoney',header:fc['applymoney'].fieldLabel,dataIndex:fc['applymoney'].name,align:'center',
			width:50,
			renderer: function(value){ return "<div align='right'>"+cnMoney(value)+"</div>"},
			editor : new fm.NumberField(fc['using'])
		},
		{id:'using',header:fc['using'].fieldLabel,dataIndex:fc['using'].name,align:'center',
			width:150,
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
	if(isFlwTask){
		ds.baseParams.params=" flowid='"+bh_flow+"' and pid='"+CURRENTAPPID+"' ";
	}
	if(!isFlwTask)ds.load({params:{start:0,limit:PAGE_SIZE}});
	if(!isFlwTask)cm.defaultSortable = true;//可排序
	
	
	var gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds:ds,
		sm:sm,
		cm:cm,
		tbar : ['<font color=#15428b><b>安全专款申请</b></font>','-'],
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
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey,
		saveHandler : saveApplyFun
		//deleteHandler: deleteStockFun
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
		
		if(isFlwTask){
			selectRecord = rec;
		}
	})
	
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[gridPanel]	
	})
	
	
	if(isFlwTask){		
		//查询此编号流程是否存在，存在则直接读出
		DWREngine.setAsync(false);
		safeManageMgmImpl.findBeanByProperty(bean,'flowid',bh_flow,function(obj){
			if(obj==null){
				gridPanel.defaultInsertHandler();
			}else{
				ds.load({params:{start:0,limit:PAGE_SIZE}});				
			}
		});
		DWREngine.setAsync(true);
		
		with(gridPanel.getTopToolbar().items){
			get('del').disable();
			get('add').disable();
		}
	}
	if(isFlwView){
		gridPanel.getTopToolbar().disable();
	}
	
	
	sm.on('rowselect', function(sm, rowIndex, record){
   		selectRecord = record;
   		var bill = record.get('billstate');
   		if(isFlwTask){
   			with(gridPanel.getTopToolbar().items){
   				get('save').enable();
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
					get('save').disable();
					get('del').disable();
				}else{
					get('save').enable();
					get('del').enable();
				}
			}
   		}
   })
   
   
	
	//---完整性验证
	function saveApplyFun(){
		//alert(selectRecord.get('flowid'))
		if(selectRecord==null || selectRecord==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择要保存的内容！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		}
		var time = selectRecord.get('applytime');
		var money = selectRecord.get('applymoney');
		var using = selectRecord.get('using');
		if (time==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '申请时间不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else if (money==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '计划申请费用不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else if (using==""){
    		Ext.Msg.show({
				title : '提示',
				msg : '用途不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
			gridPanel.defaultSaveHandler();
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
		}
	}
	
	
	gridPanel.on('cellclick',function(grid, rowIndex, columnIndex, e){
		var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
		var fieldText = grid.getStore().getAt(rowIndex).get(fieldName);
		if (columnIndex == "7" && fieldText!=""){
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





