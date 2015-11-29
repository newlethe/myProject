var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='物资分类'
var temNode;
var f_bmArr = new Array;
var ds,cm,Columns,gridPanel,gridPanel_check

var bean = "com.sgepit.pmis.wzgl.hbm.WzBm"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bm'

var openWin

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
	
	//仓库号：仓库名 CKH：CKMC
 	var ck_Array = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select CKH,CKMC from WZ_CKH where "+pidWhereString+" order by CKH",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			ck_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);
	
	//--------------物资编码Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "wzBmTypeTree",
			businessName : "wzglMgmImpl",
			parent : 0,
			pid : CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'west',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		frame : false,
		tbar:[{
            iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ root.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ root.collapse(true); }
        	}],
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '名称',
			width : 260,
			dataIndex : 'pm',
			renderer: function(value){
            	return "<div id='pm'>"+value+"</div>";
            }
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '编码',
            width:   0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";
            }
        },{
            header: '层数',
            width:  0,
            dataIndex: 'lvl'
        },{
            header: '叶子',
            width:  0,
            dataIndex: 'isleaf'
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent'
        }
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
		baseParams.pid = CURRENTAPPID;
	})	
	treePanel.getRootNode().expand(); 
	treePanel.on('click',onClick);
	
	
	function onClick(node,e){
		tmpNode=node
		if(node.isLeaf()){
			addBtn_check.enable();
			addBtn.enable();
		}else{
			addBtn_check.disable();
			addBtn.disable();
		}
		selectedTreeData = node.id;
		selectedTreeData_text = node.text;
		DWREngine.setAsync(false);
		if(node.getUI().elNode.all('uids')&&node.text){
			baseMgm.getData("select bm,pm ,leaf from wz_ckclb where uids='"+node.getUI().elNode.all('uids').innerText+"' and "+pidWhereString+" ", function(obj) {
				f_bmArr[0] = obj[0][0]
				f_bmArr[1] = obj[0][1]
				f_bmArr[2] = obj[0][2]
			});
			DWREngine.setAsync(true);
			ds.baseParams.params = " flbm like'"+node.getUI().elNode.all('bm').innerText+"%' and bm_state = '1' and "+pidWhereString+" "
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
			ds_check.baseParams.params = " flbm like'"+node.getUI().elNode.all('bm').innerText+"%' and bm_state='-1' and "+pidWhereString+" "
			ds_check.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
		}
		
	}
	
	if (ModuleLVL < 3) {
		treePanel.on('contextmenu', contextmenu, this);
	}

	var treeMenu	
	function contextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (!treeMenu) {
			treeMenu = new Ext.menu.Menu({
				id : 'treeMenu',
				width : 100,
				items : [{
					id : 'menu_add',
					text : '　新增',
					value : node,
					iconCls : 'add',
					handler : toHandlerAdd
				}, '-', {
					id : 'menu_update',
					text : '　修改',
					value : node,
					iconCls : 'btn',
					handler : toHandlerUpdate
				}, '-', {
					id : 'menu_del',
					text : '　删除',
					value : node,
					iconCls : 'remove',
					handler : toHandlerDel
				}, '-', {
					id : 'menu_ck',
					text : '　查看',
					value : node,
					iconCls : 'btn',
					handler : toHandlerCK
				}]
			});
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_del").enable();
		}
		
		if("1"==f_bmArr[2]){//叶子节点
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}else{
			treeMenu.items.get("menu_del").disable();
			treeMenu.items.get("menu_update").disable();
		}
	}
	
//-------------------------(已启用)物资编码GRID----------------------------------


	var fc={
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'bmState':{
			name:'bmState',
			fieldLabel:'不使用',
			allowBlank: false,
			anchor:'95%'
		},'stage':{
			name:'stage',
			fieldLabel:'工程期',
			allowBlank: false,
			anchor:'95%'
		},'bm':{
			name:'bm',
			fieldLabel:'编码',
			allowBlank: false,
			anchor:'95%'
		},'pm':{
			name:'pm',
			fieldLabel:'品名',
			allowBlank: false,
			anchor:'95%'
		},'gg':{
			name:'gg',
			fieldLabel:'规格型号',
			allowBlank: false,
			anchor:'95%'
		},'dw':{
			name:'dw',
			fieldLabel:'单位',
			allowBlank: false,
			anchor:'95%'
		},'jhdj':{
			name:'jhdj',
			fieldLabel:'计划单价',
			allowBlank: false,
			anchor:'95%'
		},'priceAvg':{
			name:'priceAvg',
			fieldLabel:'平均单价',
			allowBlank: false,
			anchor:'95%'
		},'sl':{
			name:'sl',
			fieldLabel:'库存数量',
			allowBlank: false,
			anchor:'95%'
		},'jhdj_sl':{
			name:'jhdj_sl',
			fieldLabel:'库存金额',
			allowBlank: false,
			anchor:'95%'
		},'isuse':{
			name:'isuse',
			fieldLabel:'是否正在使用',
			allowBlank: false,
			anchor:'95%'
		},'ckh':{
			name:'ckh',
			fieldLabel:'仓库',
			allowBlank: false,
			anchor:'95%'
		},'hwh':{
			name:'hwh',
			fieldLabel:'货位号',
			allowBlank: false,
			anchor:'95%'
		},'th':{
			name:'th',
			fieldLabel:'图号',
			allowBlank: false,
			anchor:'95%'
		},'wzProperty':{
			name:'wzProperty',
			fieldLabel:'材质',
			allowBlank: false,
			anchor:'95%'
		},'ge':{
			name:'ge',
			fieldLabel:'高额',
			allowBlank: false,
			anchor:'95%'
		},'de':{
			name:'de',
			fieldLabel:'低额',
			allowBlank: false,
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			allowBlank: false,
			anchor:'95%'
		},
		'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true
		}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'bmState',type:'string'},
		{name:'stage',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dw',type:'string'},
		{name:'jhdj',type:'float'},
		{name:'priceAvg',type:'float'},
		{name:'sl',type:'float'},
		{name:'jhdj_sl',type:'string'},
		{name:'ckh',type:'string'},
		{name:'isuse',type:'string'},
		{name:'hwh',type:'string'},
		{name:'th',type:'string'},
		{name:'wzProperty',type:'string'},
		{name:'ge',type:'float'},
		{name:'de',type:'float'},
		{name:'bz',type:'string'},
		{name:'pid',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel({
		/*
		renderer: function(value, metaData, record){
        if(record.get('sl')>0){
	         return;
        }else 
       		 return Ext.grid.CheckboxSelectionModel.prototype.renderer.apply(this, arguments);
        },
         listeners: {
        beforerowselect: function(selModel, rowIndex, keepExisting, record){
            if(record.get('sl') > 0){
                return true;
            }else return false;
        }
    }*/
	});
	
	//sm.lock();
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'bmState',header:fc['bmState'].fieldLabel,type:'string',dataIndex:fc['bmState'].name,width:50,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("-1"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'stage',header:fc['stage'].fieldLabel,dataIndex:fc['stage'].name,width:50,hidden:true},
    	{id:'bm',header:fc['bm'].fieldLabel,type:'string',dataIndex:fc['bm'].name,width:90},
    	{id:'pm',header:fc['pm'].fieldLabel,type:'string',dataIndex:fc['pm'].name,width:90},
    	{id:'gg',header:fc['gg'].fieldLabel,type:'string',dataIndex:fc['gg'].name,width:50},
    	{id:'dw',header:fc['dw'].fieldLabel,type:'string',dataIndex:fc['dw'].name,width:50},
    	{id:'jhdj',header:fc['jhdj'].fieldLabel,type:'float',dataIndex:fc['jhdj'].name,width:50,
    		renderer:function(v){
    			return v.toFixed(4);
    	}},
    	{id:'priceAvg',header:fc['priceAvg'].fieldLabel,dataIndex:fc['priceAvg'].name,width:50,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
    			if(value==""||value==null){return 0;}
    			else return value;
    	}},
    	{id:'sl',header:fc['sl'].fieldLabel,type:'float',dataIndex:fc['sl'].name,width:50},
    	{id:'jhdj_sl',header:fc['jhdj_sl'].fieldLabel,dataIndex:fc['jhdj_sl'].name,width:50,hidden:true,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sl*record.data.jhdj;
			}},
		{id:'isuse',header:fc['isuse'].fieldLabel,width:90,
			renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				var sql="select bm from wz_cjsxb where bm='"+record.data.bm+"' and "+pidWhereString+" union all " +
						"select cat_no from mat_store_insub where cat_no='"+record.data.bm+"' and "+pidWhereString+" union all " +
						"select bm from wz_cjhxb where bm='"+record.data.bm+"' and "+pidWhereString+"";
				DWREngine.setAsync(false);
				baseMgm.getData(sql,function(list){
					if(list.length>0){
						record.data.isuse= "是"
						}
					else {
						record.data.isuse= "否"
//						return "<font color=red>否</font>"
					}
				})
				return record.data.isuse
				DWREngine.setAsync(true);
			}
		},
    	{id:'ckh',header:fc['ckh'].fieldLabel,dataIndex:fc['ckh'].name,width:50,hidden:true,
    		renderer:function(value){
    			for(var i = 0;i<ck_Array.length;i++){
					if(value == ck_Array[i][0]){
						return ck_Array[i][1]
					}
				}
    		}
    	},
    	{id:'hwh',header:fc['hwh'].fieldLabel,dataIndex:fc['hwh'].name,width:50,hidden:true},
    	{id:'th',header:fc['th'].fieldLabel,dataIndex:fc['th'].name,width:50,hidden:true},
    	{id:'wzProperty',header:fc['wzProperty'].fieldLabel,dataIndex:fc['wzProperty'].name,width:50,hidden:true},
    	{id:'ge',header:fc['ge'].fieldLabel,type:'float',dataIndex:fc['ge'].name,width:50,hidden:true},
    	{id:'de',header:fc['de'].fieldLabel,type:'float',dataIndex:fc['de'].name,width:50,hidden:true},
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50},
    	{id:'pid',  header:fc['pid'].fieldLabel,   dataIndex:fc['pid'].name,  hidden:true}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'bmState':'' ,    'stage':'',    'bm':'',      'pm':'',
    	'gg':'' ,          'dw':'',       'jhdj':'',    'sl':'',
    	'jhdj_sl':'' ,     'ckh':'',      'hwh':'',     'th':'',
    	'wzProperty':'',  'ge':'',       'de':'',      'bz':'','isuse':'','priceAvg':'',
    	'pid': CURRENTAPPID
	}
    ds = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params: pidWhereString
		},// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
    })
    
    ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    
    var addBtn = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    var editBtn = new Ext.Button({
    	text:'修改',
    	iconCls:'btn',
    	handler:toEditHandler
    })
    var jyBtn = new Ext.Button({
    	id:'jy',
    	text:'禁用',
    	iconCls:'btn',
    	handler:toJyHandler
    })
    
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	title:'物资清单',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		saveBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资编码信息<B></font>','-'],
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
	
	ds.baseParams.params = "  bm_state = '1' and "+pidWhereString+" "
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
   gridPanel.on('click', function(){
   	var isdisable =true;
   	var tb = gridPanel.getTopToolbar();// grid 行选择事件
	var records = gridPanel.getSelectionModel()
			.getSelections();
	for(var i=0;i<records.length;i++){
		if(records[i].get('isuse')=="是"){
			isdisable=true;
			break;
		}	
		else{isdisable=false}
	}
	if(isdisable==true){
		editBtn.setDisabled(true);
		tb.items.get("jy").disable();
		if(tb.items.get("del")){
			tb.items.get("del").disable();
		}
	}
	else{tb.items.get("jy").enable();
	tb.items.get("del").enable();}
});
	//var row = gridPanel.getView().getRow(0);//得到第一行的div   
	//Ext.get(row).mask();//
	
	function showWindow_(){showWindow(gridPanel)};
//-------------------------(禁用)物资编码GRID----------------------------------	
	
	var sm_check =  new Ext.grid.CheckboxSelectionModel();
	var cm_check= new Ext.grid.ColumnModel([		// 创建列模型
    	sm_check,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'bmState',header:fc['bmState'].fieldLabel,dataIndex:fc['bmState'].name,width:50,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("-1"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'stage',header:fc['stage'].fieldLabel,dataIndex:fc['stage'].name,width:50,hidden:true},
    	{id:'bm',header:fc['bm'].fieldLabel,dataIndex:fc['bm'].name,width:50},
    	{id:'pm',header:fc['pm'].fieldLabel,dataIndex:fc['pm'].name,width:50},
    	{id:'gg',header:fc['gg'].fieldLabel,dataIndex:fc['gg'].name,width:50},
    	{id:'dw',header:fc['dw'].fieldLabel,dataIndex:fc['dw'].name,width:50},
    	{id:'jhdj',header:fc['jhdj'].fieldLabel,dataIndex:fc['jhdj'].name,width:50,
    		renderer:function(v){
    			return v.toFixed(4);
    	}},
    	{id:'sl',header:fc['sl'].fieldLabel,dataIndex:fc['sl'].name,width:50},
    	{id:'jhdj_sl',header:fc['jhdj_sl'].fieldLabel,dataIndex:fc['jhdj_sl'].name,width:50,hidden:true,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sl*record.data.jhdj;
			}},
    	{id:'ckh',header:fc['ckh'].fieldLabel,dataIndex:fc['ckh'].name,width:50,hidden:true},
    	{id:'hwh',header:fc['hwh'].fieldLabel,dataIndex:fc['hwh'].name,width:50,hidden:true},
    	{id:'th',header:fc['th'].fieldLabel,dataIndex:fc['th'].name,width:50,hidden:true},
    	{id:'wzProperty',header:fc['wzProperty'].fieldLabel,dataIndex:fc['wzProperty'].name,width:50,hidden:true},
    	{id:'ge',header:fc['ge'].fieldLabel,dataIndex:fc['ge'].name,width:50,hidden:true},
    	{id:'de',header:fc['de'].fieldLabel,dataIndex:fc['de'].name,width:50,hidden:true},
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50},
    	{id:'pid',  header:fc['pid'].fieldLabel,   dataIndex:fc['pid'].name,  hidden:true}
    	])
	
    cm_check.defaultSortable = true;						//设置是否可排序
    var Plant_check = Ext.data.Record.create(Columns);
    var PlantInt_check = {
    	'bmState':'' ,    'stage':'',    'bm':'',      'pm':'',
    	'gg':'' ,          'dw':'',       'jhdj':'',    'sl':'',
    	'jhdj_sl':'' ,     'ckh':'',      'hwh':'',     'th':'',
    	'wzProperty':'',  'ge':'',       'de':'',      'bz':'',
    	'pid': CURRENTAPPID
	}
    ds_check = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params: pidWhereString
		},// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
    })
    
    ds_check.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    
    var addBtn_check = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    var editBtn_check = new Ext.Button({
    	text:'修改',
    	iconCls:'btn',
    	handler:toEditHandler_check
    })	
    var qyBtn_check = new Ext.Button({
    	text:'启用',
    	iconCls:'btn',
    	handler:toQyHandler
    })	
    gridPanel_check = new Ext.grid.EditorGridTbarPanel({
    	title:'禁用物资',
		ds : ds_check,
		cm : cm_check,
		sm : sm_check,
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		saveBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资编码信息<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_check,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_check,
		plantInt : PlantInt_check,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});	

	ds_check.baseParams.params = "  bm_state = '-1' and "+pidWhereString+" "
	ds_check.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
	
	
	
    function insertFun(){
	    if(openWin){openWin.destroy()}
		outputPanel = new Ext.Panel({
	    	id:'outputPanel',
			html: '<iframe name=content src="" frameborder=0 style=width:100%;height:100%;></iframe>'
		});
		openWin = new Ext.Window({
				title:'编辑信息维护',
				buttonAlign:'center',
				closable:false,
				maximizable: true,
				layout:'fit',
				modal:'true',closable: true, closeAction: 'hide',
				width:document.body.clientWidth,
				height:document.body.clientHeight,
				autoScroll:true,
				items:outputPanel
			});	
		
    	if(selectedTreeData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边物资分类类型！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		var urls = CONTEXT_PATH+"/Business/wzgl/baseinfo/wz.baseinfo.wzbm.addorupdate.jsp?flbm="+selectedTreeData+"&flmc="+selectedTreeData_text;
			Ext.getCmp('outputPanel').html='<iframe name=content src="'+urls+'" frameborder=0 style=width:100%;height:100%;></iframe>';
			openWin.show()
    		//window.location.href = url;
    	}
    }
    
    function toEditHandler(){
	    if(openWin){openWin.destroy()}
		outputPanel = new Ext.Panel({
	    	id:'outputPanel',
			html: '<iframe name=content src="" frameborder=0 style=width:100%;height:100%;></iframe>'
		});
		openWin = new Ext.Window({
				title:'编辑信息维护',
				buttonAlign:'center',
				closable:false,
				maximizable: true,
				layout:'fit',
				modal:'true',closable: true, closeAction: 'hide',
				width:document.body.clientWidth,
				height:document.body.clientHeight,
				autoScroll:true,
				items:outputPanel
			});	    	
        var record = gridPanel.getSelectionModel().getSelected();
    	if(record){
    		var urls = CONTEXT_PATH+"/Business/wzgl/baseinfo/wz.baseinfo.wzbm.addorupdate.jsp?flbm="+selectedTreeData+"&flmc="+selectedTreeData_text+"&bm="+record.get('bm')+"&uids="+record.get('uids')+"&isuse="+record.get('isuse');
			Ext.getCmp('outputPanel').html='<iframe name=content src="'+urls+'" frameborder=0 style=width:100%;height:100%;></iframe>';
			openWin.show()
    	}
    }
    function toEditHandler_check(){
	    if(openWin){openWin.destroy()}
		outputPanel = new Ext.Panel({
	    	id:'outputPanel',
			html: '<iframe name=content src="" frameborder=0 style=width:100%;height:100%;></iframe>'
		});
		openWin = new Ext.Window({
				title:'编辑信息维护',
				buttonAlign:'center',
				closable:false,
				maximizable: true,
				layout:'fit',
				modal:'true',closable: true, closeAction: 'hide',
				width:document.body.clientWidth,
				height:document.body.clientHeight,
				autoScroll:true,
				items:outputPanel
			});	    	
    	var record_check = gridPanel_check.getSelectionModel().getSelected();
    	if(record_check){
    		var urls = CONTEXT_PATH+"/Business/wzgl/baseinfo/wz.baseinfo.wzbm.addorupdate.jsp?flbm="+selectedTreeData+"&bm="+record_check.get('bm')+"&uids="+record_check.get('uids');
			Ext.getCmp('outputPanel').html='<iframe name=content src="'+urls+'" frameborder=0 style=width:100%;height:100%;></iframe>';
			openWin.show()
    		//window.location.href = url;
    	}
    }
    
    function toQyHandler(){//启用
        var selectRows_qy = gridPanel_check.getSelectionModel().getSelections();
	    	if(selectRows_qy.length==0){
	  			Ext.example.msg('提示！', '至少选取一条数据！');
		  	}else{
	    		Ext.MessageBox.confirm("提示","确定启用?",
		    		function(btn){
		    			if(btn == "yes"){
		    				toQy()
		    			}
		    		else{
						return;
		    		}
	    	});
	  	}
   /* 	
		if(gridPanel_check.getSelectionModel().getSelected()){
	    	Ext.MessageBox.confirm("提示","确定启用?",
	    		function(btn){
	    			if(btn == "yes"){
	    				toQy()
	    			}
	    		else{
					return;
	    		}
	    		});
		 }else{
		 	Ext.example.msg('提示！', '请选择一条数据！');
		 }*/
    }
    function toQy(value){
    	var selectRows_qy = gridPanel_check.getSelectionModel().getSelections();
		var uidsStr_qy='';
    	for(var i=0;i<selectRows_qy.length;i++){
			uidsStr_qy+=selectRows_qy[i].get('uids')+",";
    	}
    	DWREngine.setAsync(false);
		wzbaseinfoMgm.updateWzbmStateChange(uidsStr_qy,"1",function(state){
			if(state){
				Ext.example.msg('提示！', '状态修改成功！');
				ds.reload();
				ds_check.reload();
			}
		})
		DWREngine.setAsync(true);
/*    	if(record_check){
    		var record = gridPanel_check.getSelectionModel().getSelected()
    		var uids = record.get('uids');
    		DWREngine.setAsync(false);
    		wzbaseinfoMgm.updateWzbmStateChange(uids,"1",function(state){
    			if(state){
    				Ext.example.msg('提示！', '状态修改成功！');
    				ds_check.reload();
    				ds.reload();
    			}
    		})
    		DWREngine.setAsync(true);
    	}*/
    }
    
    function toJyHandler(){//禁用
    	var selectRows = gridPanel.getSelectionModel().getSelections();
    	if(selectRows.length==0){
  			Ext.example.msg('提示！', '至少选取一条数据！');
	  	}else{
    		Ext.MessageBox.confirm("提示","确定禁用?",
	    		function(btn){
	    			if(btn == "yes"){
	    				toJy()
	    			}
	    		else{
					return;
	    		}
	    		});
	  	}
    /*	if(gridPanel.getSelectionModel().getSelected()){
		 }else{
		 	Ext.example.msg('提示！', '请选择一条数据！');
		 }*/
    }
    
    function toJy(value){
    	var selectRows = gridPanel.getSelectionModel().getSelections();
    	if(selectRows.length==0){
  			Ext.example.msg('提示！', '至少选取一条数据！');
	  	}else{
	  		var uidsStr='';
	    	for(var i=0;i<selectRows.length;i++){
				if(selectRows[i].get('sl')>0){
				}else{uidsStr+=selectRows[i].get('uids')+",";}
	    	}
	    	DWREngine.setAsync(false);
    		wzbaseinfoMgm.updateWzbmStateChange(uidsStr,"-1",function(state){
    			if(state){
    				Ext.example.msg('提示！', '状态修改成功！');
    				ds.reload();
    				ds_check.reload();
    			}
    		})
    		DWREngine.setAsync(true);
	  	}
    	/*var record = gridPanel.getSelectionModel().getSelected();
    	if(record){
			var uids = record.get('uids');
    		DWREngine.setAsync(false);
    		wzbaseinfoMgm.updateWzbmStateChange(uids,"-1",function(state){
    			if(state){
    				Ext.example.msg('提示！', '状态修改成功！');
    				ds.reload();
    				ds_check.reload();
    			}
    		})
    		DWREngine.setAsync(true);
    	}*/
    }
  
    
    var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'center',
        forceFit: true,
        items:[gridPanel,gridPanel_check]
    });
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,tabs]
    });
    if (ModuleLVL < 3) {
    	gridPanel.getTopToolbar().add(jyBtn,{
					id: 'query',
					text: '查询',
					tooltip: '查询',
					iconCls: 'option',
					handler: showWindow_
				},'->',addBtn,editBtn);
		gridPanel_check.getTopToolbar().add(qyBtn_check,'-',addBtn_check,editBtn_check);
    }
});

function getScrollRow(bm){
    gridPanel.getSelectionModel().selectRow(100);   
    //gridPanel.getView().scrollToRow(7);
}