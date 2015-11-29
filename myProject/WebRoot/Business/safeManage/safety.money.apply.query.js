var bean = "com.sgepit.pmis.safeManage.hbm.SafetyMoneyApply"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uuid'
var orderColumn = "uuid";

var gridPanel,gridPanelPG
var filterStr = " applyuser='"+USERID+"'";
filterStr = " 1=1 ";
var filterStrPG = " pguser='"+USERID+"'";
filterStrPG = " 1=1 ";

var beanPG  = "com.sgepit.pmis.safeManage.hbm.SafetyMoneyApplyPg"
var businessPG = "baseMgm"
var listMethodPG = "findwhereorderby"
var primaryKeyPG = 'uuid'
var orderColumnPG = "uuid";

var PAGE_SIZE = 10;
var PAGE_SIZE_CONT = 20

var selectedData
var selectObj
var billstate = new Array();
var billstatePG = new Array();
//billstate = [['0','新增'],['-1','审批中'],['1','已审批']];
billstate = [['0','新增'],['-1','申请中'],['1','申请完成']];
billstatePG = [['0','新增'],['-1','评估中'],['1','评估完成']];
Ext.onReady(function(){
	
	Ext.QuickTips.init();
	
	
	var queryBtn = new Ext.Button({
    	text:'查询',
    	iconCls:'option',
    	handler:showWindow
    })
	

	var dept = new Array();
 	DWREngine.setAsync(false);
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
	var deptDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:dept
 	})
 	var billDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:billstate
 	})
	
	
	
	//----------------------------专款申请-------------------------
	var fm = Ext.form;
	var fc = {
		'uuid':{name:'uuid',fieldLabel:'UUID',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'流程编号',anchor:'95%'},
		'applytime':{name:'applytime',fieldLabel:'申请时间',allowBlank:false,anchor:'95%',format:'Y-m-d'},
		'applydept':{name:'applydept',fieldLabel:'申请部门',anchor:'95%'},
		'applyuser':{name:'applyuser',fieldLabel:'申请人',anchor:'95%'},
		'applymoney':{name:'applymoney',fieldLabel:'计划申请费用',allowBlank:false,anchor:'95%'},
		'using':{name:'using',fieldLabel:'用途',allowBlank:false,anchor:'95%'},
		'billstate':{name:'billstate',fieldLabel:'审批状态',anchor:'95%'}
	} 
	
	var Columns = [
		{name:'uuid',type:'string'},
		{name:'flowid',type:'string'},
		{name:'applytime',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'applydept',type:'string'},
		{name:'applyuser',type:'string'},
		{name:'applymoney',type:'float'},
		{name:'using',type:'string'},
		{name:'billstate',type:'string'}
	]
	
	var Plant = Ext.data.Record.create(Columns);
	PlantInt = {
		uuid:'',
		flowid:'',
		applytime:'',
		applydept:UNITID,
		applyuser:USERID,
		applymoney:'',
		using:'',
		billstate:'0'
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uuid',header:fc['uuid'].fieldLabel,dataIndex:fc['uuid'].name,hidden:true},
		{id:'flowid',header:fc['flowid'].fieldLabel,dataIndex:fc['flowid'].name,align:'center',width:60,type:'string'},
		{id:'applytime',header:fc['applytime'].fieldLabel,dataIndex:fc['applytime'].name,align:'center',
			width:50,
			renderer:formatDate,
			type:'date'
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
			},
			store:deptDs,
			type:'combo'
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
			editor : new fm.NumberField(fc['applymoney']),
			type:'float'
		},
		{id:'using',header:fc['using'].fieldLabel,dataIndex:fc['using'].name,align:'center',
			width:150,
			editor : new fm.TextField(fc['using']),
			type:'string'
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
			},
			store:billDs,
			type:'combo'
		}
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
	cm.defaultSortable = true;//可排序
	
	
	gridPanel = new Ext.grid.GridPanel({
		ds:ds,
		cm:cm,
		sm:sm,
		border:false,
		region:'north',
		height:286,
		tbar:['<font color=#15428b><b>安全专款申请</b></font>','-',queryBtn],
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
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	
	//--------------------------------检查内容--------------------------------
	var fmPG = Ext.form;
	var fcPG = {
		'uuid':{name:'uuid',fieldLabel:'UUID',hidden:true,hideLabel:true},
		'applyuuid':{name:'applyuuid',fieldLabel:'安全专款UUID',hidden:true,hideLabel:true},
		'flowid':{name:'flowid',fieldLabel:'流程编号',anchor:'95%'},		
		'pgtime':{name:'pgtime',fieldLabel:'评估时间',allowBlank:false,anchor:'95%',format:'Y-m-d'},
		'pguser':{name:'pguser',fieldLabel:'评估人',anchor:'95%'},
		'using':{name:'using',fieldLabel:'专款使用情况',allowBlank:false,anchor:'95%'},
		'billstate':{name:'billstate',fieldLabel:'审批状态',anchor:'95%',hidden:true,hideLabel:true}
	} 
	
	var ColumnsPG = [
		{name:'uuid',type:'string'},
		{name:'applyuuid',type:'string'},
		{name:'flowid',type:'string'},
		{name:'pgtime',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'pguser',type:'string'},
		{name:'using',type:'string'},
		{name:'billstate',type:'string'}
	]
	
	
	var smPG = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cmPG = new Ext.grid.ColumnModel([
		smPG,
		{id:'uuid',header:fcPG['uuid'].fieldLabel,dataIndex:fcPG['uuid'].name,hidden:true},
		{id:'applyuuid',header:fcPG['applyuuid'].fieldLabel,dataIndex:fcPG['applyuuid'].name,hidden:true},
		{id:'flowid',header:fcPG['flowid'].fieldLabel,dataIndex:fcPG['flowid'].name,align:'center',width:30},
		{id:'pgtime',header:fcPG['pgtime'].fieldLabel,dataIndex:fcPG['pgtime'].name,align:'center',
			width:30,
			renderer:formatDate
		},
		{id:'pguser',header:fcPG['pguser'].fieldLabel,dataIndex:fcPG['pguser'].name,align:'center',
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
		{id:'using',header:fcPG['using'].fieldLabel,dataIndex:fcPG['using'].name,align:'center',
			width:200,
			editor : new fm.TextField(fcPG['using'])
		},
		{id:'billstate',header:fcPG['billstate'].fieldLabel,dataIndex:fcPG['billstate'].name,align:'center',
			width:30,
			renderer:function(value){
				var bill="";
				for(var i=0;i<billstatePG.length;i++){
					if(billstatePG[i][0]==value){
						bill=billstatePG[i][1];
						break;
					}
				}
				return bill;
			}
		}
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

	gridPanelPG = new Ext.grid.GridPanel({
		ds:dsPG,
		sm:smPG,
		cm:cmPG,
		tbar : ['<font color=#15428b><b>安全专款执行情况评估</b></font>'],
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
			pageSize : PAGE_SIZE_CONT,
			store : dsPG,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	
	
	//----------------------------------关联----------------------------------
	sm.on('rowselect',function(sm,rowIndex,record){
		cmPG.defaultSortable = true;//可排序
		selectObj = record;
		var itemuuid = record.get('uuid');
		dsPG.baseParams.params = " applyuuid='"+itemuuid+"'";
		dsPG.load({params:{start:0,limit:PAGE_SIZE_CONT}});
		selectedData = record.get('uuid');
	})
	

	var viewport = new Ext.Viewport({
		layout:'border',
		items:[gridPanel,gridPanelPG]
	})
	
	
	 gridPanel.on('cellclick', function(grid, rowIndex, columnIndex, e){
	 	var fieldName = grid.getColumnModel().getDataIndex(columnIndex); //
		if ("7" == columnIndex){
			if(notesTip.findById('uuid')) notesTip.remove('uuid');
			notesTip.add({
				id: 'uuid', 
				html: grid.getStore().getAt(rowIndex).get(fieldName)
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});
	
	gridPanelPG.on('cellclick',function(grid, rowIndex, columnIndex, e){
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