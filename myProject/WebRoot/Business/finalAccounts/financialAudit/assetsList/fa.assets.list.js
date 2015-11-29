var bean="com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaAssetsView"
var bean_bd="com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaBuildingAuditReport"
var bean_mat="com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaMatAuditReport";
var bean_equ = "com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaEquAuditReport";
var business = "baseMgm";
var primaryKey = "uids";
var listMethod = "findwhereorderby";
var ds,ds_mat,ds_equ,ds_bd
var sm;
var zc_arr= new Array();
//var orderColumn="assets_id"
var gridPanel,gridPanel_bd,girdPanel_mat,gridPanel_equ,sortTreeGrid;

Ext.onReady(function(){
		//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getuserSt = new Ext.data.SimpleStore({
 		fields:['userid','realname'],
 		data:userArray
 	})
 	var bmbzArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bmbzArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
 	DWREngine.setAsync(false);
 	baseMgm.getData("select assets_no,assets_name from fa_assets_sort",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			zc_arr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	
 	//////////////////////////////////主表信息///////////////////////////////////////////////
 	treeGridStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
 		autoLoad : true,
		leaf_field_name: 'isleaf',
		parent_id_field_name: 'parentId',
		url: CONTEXT_PATH + "/servlet/FAAssetsServlet",
		//url:MAIN_SERVLET,
   		isWorkMaterialType : true,    	
   		rowId_field_name :'uids',
		reader: new Ext.data.JsonReader({
			id: 'uids',
			root: 'topics',
			totalProperty: 'totalCount',
			fields:["uids", "pid", "assetsNo", "parentId", "assetsName", "buildingAmount", "depreciationRate", "isleaf","equAmount","installAmount","otherApportionAmount","otherDirectAmount","otherAmount","amount"]
		})
 	})
 	treeGridStore.on('beforeload',function(ds1){
   		Ext.apply(ds1.baseParams ,{ 
			method: "buileMainTree"
		})
   	});
 	treeGridStore.on("load", function(ds1, recs){
 		ds1.expandNode(recs[0])
 	})
 	
    sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
 	var cm = new Ext.grid.ColumnModel([
 		sm,
		{id: 'uids', header:"系统编号",dataIndex:"uids",width:50,hidden:true},
		{id: 'assetsName', header:"资产分类名称",dataIndex:"assetsName",width:50},
		{id: 'assetsNo', header:"资产分类编码",dataIndex:"assetsNo",width:50},
		{id: 'isleaf', header:"是否叶子节点",dataIndex:"isleaf",width:50,hidden:true},
		{id: 'buildingAmount', header:"建筑工程费",dataIndex:"buildingAmount",width:50},
		{id: 'equAmount', header:"设备购置费",dataIndex:"equAmount",width:50},
		{id: 'installAmount', header:"设备安装费",dataIndex:"installAmount",width:50},
		{id: 'otherApportionAmount', header:"摊入费用",dataIndex:"otherApportionAmount",width:50},
		{id: 'otherDirectAmount', header:"直接形成固定资产",dataIndex:"otherDirectAmount",width:50},
		{id: 'otherAmount', header:"其他费用合计",dataIndex:"otherAmount",width:50},
		{id: 'amount', header:"移交资产合计",dataIndex:"amount",width:50}
		//{header:"是否叶子节点",dataIndex:"leaf",align:"center",width:50,hidden:true},
		//{header:"允许查看",dataIndex:"read",width:100, align:"center", renderer: editorColForReadRenderFun},
    	//{header:"允许编辑",dataIndex:"write",align:"center",width:100, renderer: editorColForWriteRenderFun}
	]);
	sortTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'gridTree',
		title: '资产分类',
		region: 'center',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		frame: false,
		collapsible : false,
		animCollapse : false,
		width:400,
		border: true,
		//tbar: [menuButton, addNewFromTemplateBtn, addBtn, addNewFromTemplateBtn, uploadFileBtn, '-', createSubDocBtn, '-', editBtn, delBtn, '-', otherOperateCombo, '->', yearSearchCombo,monthSearchCombo,statusSearchCombo,versionTypeSearchCombo],
		store: treeGridStore,
		master_column_id : 'assetsName',
		cm:cm,
		sm:sm,
		//Plant:Plant,
		stripeRows: true,
		autoExpandColumn: 'assetsName'
	});
	
	////////////////////////////////////////////////////////////建筑类资产//////////////////////////////////////////////////////////
	
	var fm_bd=Ext.form;
	var sm_bd =  new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	
	var fc_bd={
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLable:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'项目编号',hidden:true,hideLable:true,anchor:'95%'},
		'assetsNo':{name:'assetsNo',fieldLabel:'资产分类',anchor:'95%'},
		'budgetId':{name:'budgetId',fieldLabel:'概算项目编号',anchor:'95%'},
		'auditId':{name:'auditId',fieldLabel:'稽核系统编号',anchor:'95%'},
		'buildingName':{name:'buildingName',fieldLabel:'建筑名称',anchor:'95%'},
		'buildingSpec':{name:'building_spec',fieldLabel:'结构层次',anchor:'90%'},	
		'buildingLocation':{name:'buildingLocation',fieldLabel:'所处位置',anchor:'95%'},
		'unit':{name:'unit',fieldLabel:'计量单位',anchor:'95%'},
		'num':{name:'num',fieldLabel:'数量',anchor:'95%'},
		'buildingAmount':{name:'buildingAmount',fieldLabel:'建筑费用',anchor:'95%'},
		'apportionAmount':{name:'apportionAmount',fieldLabel:'摊入费用',anchor:'95%'},
		'amount':{name:'amount',fieldLabel:'资产合计',anchor:'95%'},
		'remark':{name:'remark',fieldLabel:'备注',anchor:'95%'},
		'mainflag':{name:'mainflag',fieldLabel:'稽核状态',anchor:'95%'}
		
	}
	
	var Columns_bd=[
		{name:'uids',type:'string'},{name:'pid',type:'string'},{name:'assetsNo',type:'string'},{name:'budgetId',type:'string'},{name:'auditId',type:'string'},
		{name:'buildingName',type:'string'},{name:'buildingSpec',type:'string'},{name:'buildingLocation',type:'string'},{name:'unit',type:'string'},{name:'num',type:'float'},
		{name:'apportionAmount',type:'float'},{name:'buildingAmount',type:'float'},{name:'amount',type:'float'},{name:'remark',type:'string'},
		{name:'mainflag',type:'string'}
	]
	
	var Plant_bd = Ext.data.Record.create(Columns_bd)
	
		PlantInt_bd = {
		uids:'', pid:'',   assets_no:'',    budgetId:'',   auditId:'',
		buildingName:'',  buildingSpec:'',    buildingLocation:'',    unit:'', num:'',
	    apportionAmount:'',	   buildingAmount:'',  amount:'',   remark:'',
		mainflag:''
	}
	
	var cm_bd = new Ext.grid.ColumnModel([
		sm_bd,
		{id:'uids',header:fc_bd['uids'].fieldLabel,dataIndex:fc_bd['uids'].name,hidden:true},
		{id:'pid',header:fc_bd['pid'].fieldLabel,dataIndex:fc_bd['pid'].name,hidden:true},
		{id:'assetsNo',header:fc_bd['assetsNo'].fieldLabel,dataIndex:fc_bd['assetsNo'].name,
		renderer:function(value){
			var val;
			for(var i= 0;i<zc_arr.length;i++){
				if(value==zc_arr[i][0]){
					val= zc_arr[i][1];
				}
			}
			return val
		}},
		{id:'budgetId',header:fc_bd['budgetId'].fieldLabel,dataIndex:fc_bd['budgetId'].name},
		{id:'auditId',header:fc_bd['auditId'].fieldLabel,dataIndex:fc_bd['auditId'].name},
		{id:'buildingName',header:fc_bd['buildingName'].fieldLabel,dataIndex:fc_bd['buildingName'].name},
		{id:'buildingSpec',header:fc_bd['buildingSpec'].fieldLabel,dataIndex:fc_bd['buildingSpec'].name},
		{id:'buildingLocation',header:fc_bd['buildingLocation'].fieldLabel,dataIndex:fc_bd['buildingLocation'].name},
		{id:'unit',header:fc_bd['unit'].fieldLabel,dataIndex:fc_bd['unit'].name},
		{id:'num',header:fc_bd['num'].fieldLabel,dataIndex:fc_bd['num'].name},
		{id:'buildingAmount',header:fc_bd['buildingAmount'].fieldLabel,dataIndex:fc_bd['buildingAmount'].name},
		{id:'apportionAmount',header:fc_bd['apportionAmount'].fieldLabel,dataIndex:fc_bd['apportionAmount'].name},
		{id:'amount',header:fc_bd['amount'].fieldLabel,dataIndex:fc_bd['amount'].name},
		{id:'remark',header:fc_bd['remark'].fieldLabel,dataIndex:fc_bd['remark'].name},
		{id:'mainflag',header:fc_bd['mainflag'].fieldLabel,dataIndex:fc_bd['mainflag'].name}
	])  
	
	cm_bd.defaultSortable = true;//可排序
	
    ds_bd = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_bd,
			business:business,
			method: listMethod,
			params: " mainflag='1' and assets_no is not null and budget_id is not null"
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns_bd),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	
    
	gridPanel_bd = new Ext.grid.EditorGridTbarPanel({
		id: 'bd',
		ds : ds_bd,
		cm : cm_bd,
		sm: sm_bd,
		border : false,
		title:'建筑资产',
		height: 300, 
		width:3000,
		//clicksToEdit : 1,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>建筑资产<B></font>'],
		loadMask : true, // 加载时是否显示进度
		//enableDragDrop: true,
		stripeRows: true,
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_bd,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_bd,
		plantInt : PlantInt_bd,
		servletUrl : MAIN_SERVLET,
		bean : bean_bd,
		business : business,
		primaryKey : primaryKey
	});
	
	//////////////////////////////////////////////////物资类资产/////////////////////////////////////////////////
	var fm_mat = Ext.form;
	
	var sm_mat =  new Ext.grid.CheckboxSelectionModel({singleSelect:true, header : ''});
	
	var fc_mat = {
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLable:true,anchor:'90%'},
		'pid':{	name:'pid',fieldLabel:'项目编号',hidden:true,hideLable:true,anchor:'90%'},
		'budgetId':{name:'budgetId',fieldLabel:'概算项目编号',anchor:'90%'},
		'assetsNo':{name:'assetsNo',fieldLabel:'资产分类',anchor:'90%'},
		'matId':{name:'matId',fieldLabel:'稽核物资编码',anchor:'90%'},
		'auditId':{name:'auditId',fieldLabel:'稽核系统编号',anchor:'90%'},
		'matName':{name:'matName',fieldLabel:'物资名称',anchor:'90%'},
		'matSpec':{name:'matSpec',fieldLabel:'规格',anchor:'90%'},
		'matSupplyunit':{name:'matSupplyunit',fieldLabel:'供应单位',anchor:'90%'},
		'amountA':{name:'amountA',fieldLabel:'稽核总额',anchor:'90%'},
		'matUser':{name:'matUser',fieldLabel:'责任人',anchor:'90%'},
		'numA':{name:'numA',fieldLabel:'稽核数量',anchor:'90%'},
		'numF':{name:'numF',fieldLabel:'财务数量',anchor:'90%'},
		'amountF':{name:'amountF',fieldLabel:'财务总额',anchor:'90%'},
		'finOAmount':{name:'finOAmount',fieldLabel:'交付资产使用价值_原值',anchor:'90%'},
		'finDepAmount':{name:'finDepAmount',fieldLabel:'交付资产使用价值_折旧',anchor:'90%'},
		'finFixedAmount':{name:'finFixedAmount',fieldLabel:'固定资产',anchor:'90%'},
		'finCurrentAmount':{name:'f_current_amount',fieldLabel:'流动资产',anchor:'90%'},
		'remark':{name:'remark',fieldLabel:'备注',anchor:'90%'},
		'mainFlag':{name:'mainFlag',fieldLabel:'是否合并稽核',anchor:'90%'}		
							
	}
	
	var Columns_mat=[
		{name:'uids',type:'string'},{name:'pid',type:'string'},{name:'budgetId',type:'string'},{name:'assetsNo',type:'string'},
		{name:'matId',type:'string'},{name:'auditId',type:'string'},{name:'matName',type:'string'},{name:'matSpec',type:'string'},
		{name:'matSupplyunit',type:'string'},{name:'numA',type:'float'},{name:'numF',type:'float'},{name:'amountF',type:'float'},
		{name:'finOAmount',type:'float'},{name:'finDepAmount',type:'float'},{name:'finFixedAmount',type:'float'},{name:'finCurrentAmount',type:'float'},
		{name:'remark',type:'string'},{name:'mainFlag',type:'string'},{name:'matUser',type:'string'},{name:'amountA',type:'float'}
	]
	
	var Plant_mat = Ext.data.Record.create(Columns_mat)
	
	var PlantInt_mat ={
		uids:'',pid:'',budgetId:'',assetsNo:'',matId:'',auditId:'',matName:'',matSpec:'',matSupplyunit:'',numA:'',
		numF:'',amountF:'',finOAmount:'',finDepAmount:'',finFixedAmount:'',finCurrentAmount:'',remark:'',mainFlag:'',matUser:'',amountA:''
	}
	
	var cm_mat =new Ext.grid.ColumnModel([
		sm_mat,
		{id:'uids',header:fc_mat['uids'].fieldLabel,dataIndex:fc_mat['uids'].name,width:90,hidden:true},
		{id:'pid',header:fc_mat['pid'].fieldLabel,dataIndex:fc_mat['pid'].name,width:90,hidden:true},
		{id:'budgetId',header:fc_mat['budgetId'].fieldLabel,dataIndex:fc_mat['budgetId'].name,width:90},
		{id:'auditId',header:fc_mat['auditId'].fieldLabel,dataIndex:fc_mat['auditId'].name,width:90},
		{id:'assetsNo',header:fc_mat['assetsNo'].fieldLabel,dataIndex:fc_mat['assetsNo'].name,width:90,renderer:function(value){
			var val;
			for(var i= 0;i<zc_arr.length;i++){
				if(value==zc_arr[i][0]){
					val= zc_arr[i][1];
				}
			}
			return val
		}},
		{id:'matId',header:fc_mat['matId'].fieldLabel,dataIndex:fc_mat['matId'].name,width:90},
		{id:'matName',header:fc_mat['matName'].fieldLabel,dataIndex:fc_mat['matName'].name,width:90},
		{id:'matSpec',header:fc_mat['matSpec'].fieldLabel,dataIndex:fc_mat['matSpec'].name,width:90},
		{id:'matSupplyunit',header:fc_mat['matSupplyunit'].fieldLabel,dataIndex:fc_mat['matSupplyunit'].name,width:90},
		{id:'numA',header:fc_mat['numA'].fieldLabel,dataIndex:fc_mat['numA'].name,width:90},
		{id:'numF',header:fc_mat['numF'].fieldLabel,dataIndex:fc_mat['numF'].name,width:90},
		{id:'amountF',header:fc_mat['amountF'].fieldLabel,dataIndex:fc_mat['amountF'].name,width:90},
		{id:'finOAmount',header:fc_mat['finOAmount'].fieldLabel,dataIndex:fc_mat['finOAmount'].name,width:90},
		{id:'finDepAmount',header:fc_mat['finDepAmount'].fieldLabel,dataIndex:fc_mat['finDepAmount'].name,width:90},
		{id:'finFixedAmount',header:fc_mat['finFixedAmount'].fieldLabel,dataIndex:fc_mat['finFixedAmount'].name,width:90},
		{id:'finCurrentAmount',header:fc_mat['finCurrentAmount'].fieldLabel,dataIndex:fc_mat['finCurrentAmount'].name,width:90},
		{id:'remark',header:fc_mat['remark'].fieldLabel,dataIndex:fc_mat['remark'].name,width:90},
		{id:'mainFlag',header:fc_mat['mainFlag'].fieldLabel,dataIndex:fc_mat['mainFlag'].name,width:90,renderer:function(value){
			if(value==""){return "是"}}
		},
		{id:'matUser',header:fc_mat['matUser'].fieldLabel,dataIndex:fc_mat['matUser'].name,width:90},
		{id:'amountA',header:fc_mat['amountA'].fieldLabel,dataIndex:fc_mat['amountA'].name,width:90}
	])
	
	cm_mat.defaultSortable = true;//可排序
	
    ds_mat = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_mat,
			business:business,
			method: listMethod,
			params: " mainflag is null and assets_no is not null and audit_id is  null and mat_id is not null"
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns_mat),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	
	
	gridPanel_mat = new Ext.grid.EditorGridTbarPanel({
		id: 'mat',
		ds : ds_mat,
		cm : cm_mat,
		sm: sm_mat,
		border : false,
		title:'物资资产',
		height: 300, 
		width:3000,
		//clicksToEdit : 1,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资资产<B></font>'],
		loadMask : true, // 加载时是否显示进度
		//enableDragDrop: true,
		stripeRows: true,
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_mat,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_mat,
		plantInt : PlantInt_mat,
		servletUrl : MAIN_SERVLET,
		bean : bean_mat,
		business : business,
		primaryKey : primaryKey
	});
	///////////////////////////////////////////////////////设备类资产////////////////////////////////////////////////////////////////
	
	var fm_equ = Ext.form;
	var sm_equ =  new Ext.grid.CheckboxSelectionModel({singleSelect:false});
	var fc_equ = {
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLable:true,anchor:'95%'},
		'pid':{	name:'pid',fieldLabel:'项目编号',hidden:true,hideLable:true,anchor:'95%'},
		'bdgid':{name:'bdgid',fieldLabel:'概算项目编号',anchor:'95%'},
		'equId':{name:'equId',fieldLabel:'设备编码',anchor:'95%'},
		'assetsNo':{name:'assetsNo',fieldLabel:'资产分类',anchor:'95%',renderer:function(value){
			var val;
			for(var i= 0;i<zc_arr.length;i++){
				if(value==zc_arr[i][0]){
					val=zc_arr[i][1];
				}
			}
			return val
		}},
		'auditId':{name:'auditId',fieldLabel:'稽核系统编号',anchor:'95%'},
		'equName':{name:'equName',fieldLabel:'设备名称',anchor:'95%'},
		'equSpec':{name:'equSpec',fieldLabel:'规格',anchor:'95%'},
		'equSupplyunit':{name:'equSupplyunit',fieldLabel:'供应单位',anchor:'95%'},
		'equLocation':{name:'equLocation',fieldLabel:'设备安装位置',anchor:'95%'},
		'num':{name:'num',fieldLabel:'数量',anchor:'95%'},
		'unit':{name:'unit',fieldLabel:'计量单位',anchor:'95%'},
		'equAmount':{name:'equAmount',fieldLabel:'设备购置总价',anchor:'95%'},
		'equSubAmount':{name:'equSubAmount',fieldLabel:'其中成套附属设备',anchor:'95%'},
		'equBaseAmount':{name:'equBaseAmount',fieldLabel:'设备基座价值',anchor:'95%'},
		'equInstallAmount':{name:'equInstallAmount',fieldLabel:'安装费',anchor:'95%'},
		'equOtherAmount':{name:'equOtherAmount',fieldLabel:'其他费用',anchor:'95%'},
		'amount':{name:'amount',fieldLabel:'移交资产价值',anchor:'95%'},
		'remark':{name:'remark',fieldLabel:'备注',anchor:'95%'},
		'equMainAmount':{name:'equMainAmount',fieldLabel:'设备自身价值',anchor:'95%'},
		'bdgid':{name:'bdgid',fieldLabel:'概算编号主键',anchor:'95%'},
		'mainFlag':{name:'mainFlag',fieldLabel:'是否主设备',anchor:'95%',renderer:function(value){
			if(value==""){return "是"}
		}}		
	}
	
	var Columns_equ =[
		{name:'uids',type:'string'},{name:'pid',type:'string'},{name:'assetsNo',type:'string'},
		{name:'equId',type:'string'},{name:'auditId',type:'string'},{name:'equName',type:'string'},{name:'equSpec',type:'string'},
		{name:'equSupplyunit',type:'string'},{name:'equLocation',type:'string'},{name:'num',type:'float'},{name:'unit',type:'string'},
		{name:'equAmount',type:'float'},{name:'equSubAmount',type:'float'},{name:'equBaseAmount',type:'float'},{name:'equInstallAmount',type:'float'},
		{name:'equOtherAmount',type:'float'},{name:'amount',type:'float'},{name:'remark',type:'string'},{name:'equMainAmount',type:'float'},{name:'bdgid',type:'string'}
		,{name:'mainFlag',type:'string'}
	]
	
	var Plant_equ = Ext.data.Record.create(Columns_equ)
	
	var PlantInt_equ ={
		uids:'',pid:'',equId:'',assetsNo:'',auditId:'',equName:'',equSpec:'',equSupplyunit:'',
		equLocation:'',num:'',unit:'',equAmount:'',equSubAmount:'',equBaseAmount:'',equInstallAmount:'',
		equOtherAmount:'',amount:'',remark:'',equMainAmount:'',bdgid:'',mainFlag:''
	}
	
	var cm_equ =new Ext.grid.ColumnModel([
		sm_equ,
		{id:'uids',header:fc_equ['uids'].fieldLabel,dataIndex:fc_equ['uids'].name,width:90,hidden:true},
		{id:'pid',header:fc_equ['pid'].fieldLabel,dataIndex:fc_equ['pid'].name,width:90,hidden:true},
		{id:'assetsNo',header:fc_equ['assetsNo'].fieldLabel,dataIndex:fc_equ['assetsNo'].name,width:90,renderer:function(value){
			var val;
			for(var i= 0;i<zc_arr.length;i++){
				if(value==zc_arr[i][0]){
					val=zc_arr[i][1];
				}
			}
			return val;
		}},
		{id:'equId',header:fc_equ['equId'].fieldLabel,dataIndex:fc_equ['equId'].name,width:90},
		{id:'auditId',header:fc_equ['auditId'].fieldLabel,dataIndex:fc_equ['auditId'].name,width:90},
		{id:'equName',header:fc_equ['equName'].fieldLabel,dataIndex:fc_equ['equName'].name,width:90},
		{id:'equSpec',header:fc_equ['equSpec'].fieldLabel,dataIndex:fc_equ['equSpec'].name,width:90},
		{id:'equSupplyunit',header:fc_equ['equSupplyunit'].fieldLabel,dataIndex:fc_equ['equSupplyunit'].name,width:90},
		{id:'equLocation',header:fc_equ['equLocation'].fieldLabel,dataIndex:fc_equ['equLocation'].name,width:90},
		{id:'num',header:fc_equ['num'].fieldLabel,dataIndex:fc_equ['num'].name,width:90},
		{id:'unit',header:fc_equ['unit'].fieldLabel,dataIndex:fc_equ['unit'].name,width:90},
		{id:'equAmount',header:fc_equ['equAmount'].fieldLabel,dataIndex:fc_equ['equAmount'].name,width:90},
		{id:'equSubAmount',header:fc_equ['equSubAmount'].fieldLabel,dataIndex:fc_equ['equSubAmount'].name,width:90},
		{id:'equBaseAmount',header:fc_equ['equBaseAmount'].fieldLabel,dataIndex:fc_equ['equBaseAmount'].name,width:90},
		{id:'equInstallAmount',header:fc_equ['equInstallAmount'].fieldLabel,dataIndex:fc_equ['equInstallAmount'].name,width:90},
		{id:'equOtherAmount',header:fc_equ['equOtherAmount'].fieldLabel,dataIndex:fc_equ['equOtherAmount'].name,width:90},
		{id:'amount',header:fc_equ['amount'].fieldLabel,dataIndex:fc_equ['amount'].name,width:90},
		{id:'remark',header:fc_equ['remark'].fieldLabel,dataIndex:fc_equ['remark'].name,width:90},
		{id:'equMainAmount',header:fc_equ['equMainAmount'].fieldLabel,dataIndex:fc_equ['equMainAmount'].name,width:90},
		{id:'bdgid',header:fc_equ['bdgid'].fieldLabel,dataIndex:fc_equ['bdgid'].name,width:90},
		{id:'mainFlag',header:fc_equ['mainFlag'].fieldLabel,dataIndex:fc_equ['mainFlag'].name,width:90}
		
	])
	
	cm_equ.defaultSortable = true;//可排序
	
    ds_equ = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_equ,
			business:business,
			method: listMethod,
			params: " mainflag is null and assets_no is not null and audit_id is null and equ_id is not null"
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns_equ),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	
	gridPanel_equ = new Ext.grid.EditorGridTbarPanel({
		id: 'equ',
		ds : ds_equ,
		cm : cm_equ,
		sm: sm_equ,
		border : false,
		title:'设备资产',
		height: 300, 
		width:3000,
		//clicksToEdit : 1,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>设备资产<B></font>'],
		loadMask : true, // 加载时是否显示进度
		//enableDragDrop: true,
		stripeRows: true,
		viewConfig : {
			//forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_equ,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_equ,
		plantInt : PlantInt_equ,
		servletUrl : MAIN_SERVLET,
		bean : bean_equ,
		business : business,
		primaryKey : primaryKey
	});
	
	var assetsSettingBtn = new Ext.Button({
		text: '二次分摊',
		iconCls: 'btn',
		handler: apportionSettingFun 
	});
	
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: true,
        split: true,
        border: false,
        height:240,
        minHeight:200,
        tbar:[assetsSettingBtn],
        region: 'south',
        items:[gridPanel_bd,gridPanel_mat,gridPanel_equ]
    });	
    
    tabs.on('tabchange', function(tp, p){
    	if(p.id=="mat") {
    		assetsSettingBtn.setText("直接形成固定资产对照");
    	} else {
    		assetsSettingBtn.setText("二次分摊");
    	}
    })
	
	var viewport = new Ext.Viewport({
        layout:'border',
        items:[sortTreeGrid,tabs]
    });	
	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

	
	ds_bd.load({
		params : {
			start : 0,
			limit : 20
		}
	});
	
	ds_mat.load({
		params : {
			start : 0,
			limit : 20
		}
	});
	
	ds_equ.load({
		params : {
			start : 0,
			limit : 20
		}
	});
	
	sortTreeGrid.on('click',onClick);
	function onClick(node,e){
		var record = sm.getSelected();
		if(record){
			var assetsNo= record.data.assetsNo;
			var whereStr = " and assets_no is not null";
			if(assetsNo!="1") {
				whereStr = " and assets_no ='"+assetsNo+"'";
			} 
			ds_bd.baseParams.params = " mainflag='1' " + whereStr + " and budget_id is not null";
			ds_bd.load({params : {start : 0,limit : 20}});
			ds_mat.baseParams.params = " mainflag is null  " + whereStr + " and audit_id is  null and mat_id is not null"
			ds_mat.load({params : {start : 0,limit : 20}});
			ds_equ.baseParams.params = " mainflag is null  " + whereStr + " and audit_id is  null and equ_id is not null";
			ds_equ.load({params :{start : 0,limit :20}});
		}
	}
	
//	对选中的资产进行二次费用分摊	
	function apportionSettingFun() {
		var activeTab = tabs.getActiveTab();
		var selectArr = activeTab.getSelectionModel().getSelections();
		if(selectArr.length==0) {
			Ext.Msg.alert("提示", "请选择需分摊的具体资产");
		} else {
			var selectFinSubjectUrl = CONTEXT_PATH + "/Business/finalAccounts/financialAudit/assetsList/fa.fin.data.forApportion.jsp"
			if ( activeTab.id=='mat' ){
				selectFinSubjectUrl+="?showAll=true&singleSelect=true";
			}
			var param = new Object();
			var rtn = showModalDialog(selectFinSubjectUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight + ";center:yes;resizable:yes;");
			if(rtn) {
				var tableName = "";
				var handlerFlag = "apportion";	//二次分摊
				if(activeTab.id=="bd") {
					tableName = "FA_BUILDING_AUDIT_REPORT";
					handlerFlag = "apportion";
				} else if(activeTab.id=="mat") {
					tableName = "FA_MAT_AUDIT_REPORT";
					handlerFlag = "fixAssets";	//直接形成固定资产
				} else if(activeTab.id=="equ") {
					tableName = "FA_EQU_AUDIT_REPORT";
					handlerFlag = "apportion";
				}
				var ids = "";
				for(i=0;i<selectArr.length;i++) {
					ids += "`" + selectArr[i].data.uids;
				}
				if(ids.length>0) {
					ids = ids.substring(1);
				}
				
				if(tableName!="") {
				
					if(handlerFlag=="apportion") {
						financeSortService.apportionSecond(tableName, ids, rtn, function(r) {
							if(r=="OK") {
								treeGridStore.load();
								activeTab.getStore().load({params : {start : 0,limit : 20}});
							}
						});
					} else {
						financeSortService.fixAssetsDirect(tableName, ids, rtn, function(r) {
							
							if(r=="SUCCESS") {
								treeGridStore.load();
								activeTab.getStore().load({params : {start : 0,limit : 20}});
							}
							else{
								Ext.Msg.show({
								title : '无法形成对照',
								msg : '该科目余额已经对照到其它资产!',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.WARNING
							});
								
							}
						});
					}
				}
			}
		}
	}
	
	
	
	
	
	
	
	
	
	
	
})
