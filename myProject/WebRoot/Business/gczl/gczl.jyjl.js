var treePanel, treeLoader;
var root, saveBtn;
var treePanelTitle = "检验项目结构";
var rootText = "验评标准树";

var bean = "com.sgepit.pmis.gczl.hbm.GczlJl"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'xmbh'

var getxmbh='';
var treeFilterPart = "1=1";
Ext.onReady(function() {
	
//----------------------------Tree---------------------------------------	
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '1'  // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "gczlJyxmTree",
			businessName : "gczlMgmImpl",
			parent : 1,
			pid : CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'west',
		frame : false,
		header : false,
		border : false,
		split : true,
		collapsible : true,
		collapseFirst : false,
		lines : true,
		maxSize : 300,
		width : 305,
		autoScroll : true,
		rootVisible : true,
		animate : false,
		columns : [{
			header : '检验项目名称',
			width : 450,
			dataIndex : 'xmmc'
		}, {
			header : '主键',
			width : 0, // 隐藏字段
			dataIndex : 'uids',
			renderer : function(value) {
				return "<div id='uids'>" + value + "</div>";
			}
		}, {
			header : '项目工程编号',
			width : 0, // 隐藏字段
			dataIndex : 'xmbh',
			renderer : function(value) {
				return "<div id='xmbh'>" + value + "</div>";
			}
		}, {
			header : '标准项目编号',
			width : 0,
			dataIndex : 'bzxmbh',
			renderer : function(value) {
				return "<div id='bzxmbh'>" + value + "</div>";
			}
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}
		},{
			header : '父节点',
			width : 0,
			dataIndex : 'parentbh',
			renderer : function(value) {
				return "<div id='parentbh'>" + value + "</div>";
			}
		}],
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var xmbh = node.attributes.xmbh;
		if (xmbh == null)
			xmbh = '1';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = xmbh;
		baseParams.pid = CURRENTAPPID;
	})

	treePanel.getRootNode().expand();
	treePanel.on('click', onClick);
	function onClick(node, e) {
		tempNode=node
		var isRootNode = (rootText == tempNode.text);
		var xmbh = (node == root) ? "0" : node.getUI().elNode.all("xmbh").innerText;
		getxmbh = xmbh;
		if(isRootNode){
			ds.baseParams.params=" itype = 'yp'";
			ds.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_sg.baseParams.params=" itype = 'sg'";
			ds_sg.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_sy.baseParams.params=" itype = 'sy'";
			ds_sy.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_qt.baseParams.params=" itype = 'qt'";
			ds_qt.load({params : {start : 0,limit : PAGE_SIZE}});
			treeFilterPart = " 1=1 ";
		}else{
			ds.baseParams.params=" xmbh like '"+xmbh+"%' and itype = 'yp'";
			ds.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_sg.baseParams.params=" xmbh like '"+xmbh+"%' and itype = 'sg'";
			ds_sg.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_sy.baseParams.params=" xmbh like '"+xmbh+"%' and itype = 'sy'";
			ds_sy.load({params : {start : 0,limit : PAGE_SIZE}});
			ds_qt.baseParams.params=" xmbh like '"+xmbh+"%' and itype = 'qt'";
			ds_qt.load({params : {start : 0,limit : PAGE_SIZE}});
			treeFilterPart = " xmbh like '"+xmbh+"%' ";
		}
	}

//----------------------------Content---------------------------------------	

	var fc={
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程项目编号',hidden:true,hideLabel:true,anchor:'95%'},
		'xmbh':{name:'xmbh',fieldLabel:'检验项目代码',allowBlank: false,anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'编号',hidden:true,hideLabel:true,anchor:'95%'},
		'jlsm':{name:'jlsm',fieldLabel:'<font color=red>记录说明</font>',anchor:'95%'},
		'bzxmbh':{name:'bzxmbh',fieldLabel:'标准项目代码', anchor:'95%'},
		'itype':{name:'itype',fieldLabel:'检验类型', anchor:'95%'},
		'rq':{name:'rq',fieldLabel:'<font color=red>日期</font>',allowBlank: false,anchor:'95%'},
		'sgdw':{name:'sgdw',fieldLabel:'<font color=red>施工单位质量自评等级</font>' ,anchor:'95%'},
		'jsdw':{name:'jsdw',fieldLabel:'<font color=red>建设单位评定等级</font>' ,anchor:'95%'},
		'zjz':{name:'zjz',fieldLabel:'<font color=red>质监站核定等级</font>', anchor:'95%'},
		'lsh':{name:'lsh',fieldLabel:'附件' ,anchor:'95%'},
		'billState':{name:'billState',fieldLabel:'单据状态', anchor:'95%'},
		'filename':{name:'filename',fieldLabel:'文件名称', anchor:'95%'},
		'zls':{name:'zls',fieldLabel:'移交标志', anchor:'95%'}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'bh',type:'string'},
		{name:'jlsm',type:'string'},
		{name:'xmbh',type:'string'},
		{name:'bzxmbh',type:'string'},
		{name:'itype',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'sgdw',type:'string'},
		{name:'jsdw',type:'string'},
		{name:'zjz',type:'string'},
		{name:'lsh',type:'string'},
		{name:'billState',type:'float'},
		{name:'filename',type:'string'},
		{name:'zls',type:'float'}
	]

	var queryBtn_yp = new Ext.Button({
		id:'yp',
		text:'查询',
		iconCls:'btn',
		handler:showWindow
	})
	var queryBtn_sg = new Ext.Button({
		id:'sg',
		text:'查询',
		iconCls:'btn',
		handler:showWindow
	})
	var queryBtn_sy = new Ext.Button({
		id:'sy',
		text:'查询',
		iconCls:'btn',
		handler:showWindow
	})
	var queryBtn_qt = new Ext.Button({
		id:'qt',
		text:'查询',
		iconCls:'btn',
		handler:showWindow
	})
	
	var fm = Ext.form;
	
	//-------------------------Content:验评-------------------------
	sm =  new Ext.grid.CheckboxSelectionModel();
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'xmbh',header:fc['xmbh'].fieldLabel,dataIndex:fc['xmbh'].name,width:50},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,width:50,hidden:true},
    	{id:'bh',header:fc['bh'].fieldLabel,dataIndex:fc['bh'].name,width:50,hidden:true},
    	{id:'bzxmbh',header:fc['bzxmbh'].fieldLabel,dataIndex:fc['bzxmbh'].name,width:50,hidden:true},
    	{id:'itype',header:fc['itype'].fieldLabel,dataIndex:fc['itype'].name,width:50,hidden:true},
    	{id:'rq',header:fc['rq'].fieldLabel,dataIndex:fc['rq'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
    	{id:'sgdw',header:fc['sgdw'].fieldLabel,dataIndex:fc['sgdw'].name,width:50,editor:new fm.TextField(fc['sgdw'])},
    	{id:'jsdw',header:fc['jsdw'].fieldLabel,dataIndex:fc['jsdw'].name,width:50,editor:new fm.TextField(fc['jsdw'])},
    	{id:'zjz',header:fc['zjz'].fieldLabel,dataIndex:fc['zjz'].name,width:50,editor:new fm.TextField(fc['zjz'])},
    	{id:'jlsm',header:fc['jlsm'].fieldLabel,dataIndex:fc['jlsm'].name,width:50,editor:new fm.TextField(fc['jlsm'])},
    	{id:'lsh',header:fc['lsh'].fieldLabel,dataIndex:fc['lsh'].name,width:50,renderer:showBtn},
    	{id:'billState',header:fc['billState'].fieldLabel,dataIndex:fc['billState'].name,width:50,hidden:true},
    	{id:'filename',header:fc['filename'].fieldLabel,dataIndex:fc['filename'].name,width:50,hidden:true},
    	{id:'zls',header:fc['zls'].fieldLabel,dataIndex:fc['zls'].name,width:50,hidden:true}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'pid':CURRENTAPPID,         'bh':'',
    	'jlsm':'' ,       'xmbh':'',           'bzxmbh':'',         'itype':'yp',
    	'rq':new Date() , 'sgdw':'',           'jsdw':'',         'zjz':'',
    	'lsh':'' ,       'billState':0,           'filename':'',         'zls':0
	}
    ds = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod
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
 
    
   var gridPanel = new Ext.grid.EditorGridTbarPanel({
   		id : 'ypPanel',
    	title:'验评信息',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		clicksToEdit : 2,
		header : false,
		//addBtn:false,
		//saveBtn:false,
		saveHandler : saveFun,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>验评<B></font>'],
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
	ds.baseParams.params = "  itype = 'yp'"
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});    
	gridPanel.on("afterinsert",function(){
		var rec = sm.getSelected();
		rec.set("rq",new Date());
	})
	gridPanel.on('beforeinsert',function(){
		if(''==getxmbh){
			Ext.MessageBox.alert('提示','请先选择左边树中验评项目');
			ds.baseParams.params = "  itype = 'yp'"
			ds.load({params : {start : 0,limit : PAGE_SIZE}});
		}else{PlantInt.xmbh=getxmbh}
	});	
	
	//-------------------------Content:施工-------------------------
	sm_sg =  new Ext.grid.CheckboxSelectionModel();
	cm_sg = new Ext.grid.ColumnModel([		// 创建列模型
    	sm_sg,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'xmbh',header:fc['xmbh'].fieldLabel,dataIndex:fc['xmbh'].name,width:50},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,width:50,hidden:true},
    	{id:'bh',header:fc['bh'].fieldLabel,dataIndex:fc['bh'].name,width:50,hidden:true},
    	{id:'bzxmbh',header:fc['bzxmbh'].fieldLabel,dataIndex:fc['bzxmbh'].name,width:50,hidden:true},
    	{id:'itype',header:fc['itype'].fieldLabel,dataIndex:fc['itype'].name,width:50,hidden:true},
    	{id:'rq',header:fc['rq'].fieldLabel,dataIndex:fc['rq'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
    	{id:'sgdw',header:fc['sgdw'].fieldLabel,dataIndex:fc['sgdw'].name,width:50,editor:new fm.TextField(fc['sgdw'])},
    	{id:'jsdw',header:fc['jsdw'].fieldLabel,dataIndex:fc['jsdw'].name,width:50,editor:new fm.TextField(fc['jsdw'])},
    	{id:'zjz',header:fc['zjz'].fieldLabel,dataIndex:fc['zjz'].name,width:50,editor:new fm.TextField(fc['zjz'])},
    	{id:'jlsm',header:fc['jlsm'].fieldLabel,dataIndex:fc['jlsm'].name,width:50,editor:new fm.TextField(fc['jlsm'])},
    	{id:'lsh',header:fc['lsh'].fieldLabel,dataIndex:fc['lsh'].name,width:50,renderer:showBtn},
    	{id:'billState',header:fc['billState'].fieldLabel,dataIndex:fc['billState'].name,width:50,hidden:true},
    	{id:'filename',header:fc['filename'].fieldLabel,dataIndex:fc['filename'].name,width:50,hidden:true},
    	{id:'zls',header:fc['zls'].fieldLabel,dataIndex:fc['zls'].name,width:50,hidden:true}
    	])
	
    cm_sg.defaultSortable = true;						//设置是否可排序
    var Plant_sg = Ext.data.Record.create(Columns);
    var PlantInt_sg = {
    	'pid':CURRENTAPPID,         'bh':'',
    	'jlsm':'' ,       'xmbh':'',           'bzxmbh':'',         'itype':'sg',
    	'rq':new Date() ,       'sgdw':'',           'jsdw':'',         'zjz':'',
    	'lsh':'' ,       'billState':0,           'filename':'',         'zls':0
	}
    ds_sg = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod
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
    
    ds_sg.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
 
   var gridPanel_sg = new Ext.grid.EditorGridTbarPanel({
   		id : 'sgPanel',
    	title:'施工信息',
		ds : ds_sg,
		cm : cm_sg,
		sm : sm_sg,
		border : false,
		clicksToEdit : 2,
		header : false,
		//addBtn:false,
		//saveBtn:false,
		saveHandler : saveFun,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>施工<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_sg,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_sg,
		plantInt : PlantInt_sg,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds_sg.baseParams.params = "  itype = 'sg'"
	ds_sg.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});  
	gridPanel_sg.on("afterinsert",function(){
		var rec = sm_sg.getSelected();
		rec.set("rq",new Date());
	})
	gridPanel_sg.on('beforeinsert',function(){
		if(''==getxmbh){
			Ext.MessageBox.alert('提示','请先选择左边树中验评项目');
			ds_sg.baseParams.params = "  itype = 'sg'"
			ds_sg.load({params : {start : 0,limit : PAGE_SIZE}});
		}else{PlantInt_sg.xmbh=getxmbh}
	});	
	//-------------------------Content:试验-------------------------
	sm_sy =  new Ext.grid.CheckboxSelectionModel();
	cm_sy = new Ext.grid.ColumnModel([		// 创建列模型
    	sm_sy,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'xmbh',header:fc['xmbh'].fieldLabel,dataIndex:fc['xmbh'].name,width:50},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,width:50,hidden:true},
    	{id:'bh',header:fc['bh'].fieldLabel,dataIndex:fc['bh'].name,width:50,hidden:true},
    	{id:'bzxmbh',header:fc['bzxmbh'].fieldLabel,dataIndex:fc['bzxmbh'].name,width:50,hidden:true},
    	{id:'itype',header:fc['itype'].fieldLabel,dataIndex:fc['itype'].name,width:50,hidden:true},
    	{id:'rq',header:fc['rq'].fieldLabel,dataIndex:fc['rq'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
    	{id:'sgdw',header:fc['sgdw'].fieldLabel,dataIndex:fc['sgdw'].name,width:50,editor:new fm.TextField(fc['sgdw'])},
    	{id:'jsdw',header:fc['jsdw'].fieldLabel,dataIndex:fc['jsdw'].name,width:50,editor:new fm.TextField(fc['jsdw'])},
    	{id:'zjz',header:fc['zjz'].fieldLabel,dataIndex:fc['zjz'].name,width:50,editor:new fm.TextField(fc['zjz'])},
    	{id:'jlsm',header:fc['jlsm'].fieldLabel,dataIndex:fc['jlsm'].name,width:50,editor:new fm.TextField(fc['jlsm'])},
    	{id:'lsh',header:fc['lsh'].fieldLabel,dataIndex:fc['lsh'].name,width:50 ,renderer:showBtn},
    	{id:'billState',header:fc['billState'].fieldLabel,dataIndex:fc['billState'].name,width:50,hidden:true},
    	{id:'filename',header:fc['filename'].fieldLabel,dataIndex:fc['filename'].name,width:50,hidden:true},
    	{id:'zls',header:fc['zls'].fieldLabel,dataIndex:fc['zls'].name,width:50,hidden:true}
    	])
	
    cm_sy.defaultSortable = true;						//设置是否可排序
    var Plant_sy = Ext.data.Record.create(Columns);
    var PlantInt_sy = {
    	'pid':CURRENTAPPID,         'bh':'',
    	'jlsm':'' ,       'xmbh':'',           'bzxmbh':'',         'itype':'sy',
    	'rq':new Date() ,       'sgdw':'',           'jsdw':'',         'zjz':'',
    	'lsh':'' ,       'billState':0,           'filename':'',         'zls':0
	}
    ds_sy = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod
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
    
    ds_sy.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
 
   var gridPanel_sy = new Ext.grid.EditorGridTbarPanel({
   		id : 'syPanel',
    	title:'试验信息',
		ds : ds_sy,
		cm : cm_sy,
		sm : sm_sy,
		border : false,
		clicksToEdit : 2,
		header : false,
		//addBtn:false,
		//saveBtn:false,
		saveHandler : saveFun,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>试验<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_sy,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_sy,
		plantInt : PlantInt_sy,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds_sy.baseParams.params = "  itype = 'sy'"
	ds_sy.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});  
	gridPanel_sy.on("afterinsert",function(){
		var rec = sm_qt.getSelected();
		rec.set("rq",new Date());
	})
	gridPanel_sy.on('beforeinsert',function(){
		if(''==getxmbh){
			Ext.MessageBox.alert('提示','请先选择左边树中验评项目');
			ds_sy.baseParams.params = "  itype = 'sy'"
			ds_sy.load({params : {start : 0,limit : PAGE_SIZE}});
		}else{PlantInt_sy.xmbh=getxmbh}
	});		
	//-------------------------Content:其他-------------------------
	sm_qt =  new Ext.grid.CheckboxSelectionModel();
	cm_qt = new Ext.grid.ColumnModel([		// 创建列模型
    	sm_qt,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'xmbh',header:fc['xmbh'].fieldLabel,dataIndex:fc['xmbh'].name,width:50},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,width:50,hidden:true},
    	{id:'bh',header:fc['bh'].fieldLabel,dataIndex:fc['bh'].name,width:50,hidden:true},
    	{id:'bzxmbh',header:fc['bzxmbh'].fieldLabel,dataIndex:fc['bzxmbh'].name,width:50,hidden:true},
    	{id:'itype',header:fc['itype'].fieldLabel,dataIndex:fc['itype'].name,width:50,hidden:true},
    	{id:'rq',header:fc['rq'].fieldLabel,dataIndex:fc['rq'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
    	{id:'sgdw',header:fc['sgdw'].fieldLabel,dataIndex:fc['sgdw'].name,width:50,editor:new fm.TextField(fc['sgdw'])},
    	{id:'jsdw',header:fc['jsdw'].fieldLabel,dataIndex:fc['jsdw'].name,width:50,editor:new fm.TextField(fc['jsdw'])},
    	{id:'zjz',header:fc['zjz'].fieldLabel,dataIndex:fc['zjz'].name,width:50,editor:new fm.TextField(fc['zjz'])},
    	{id:'jlsm',header:fc['jlsm'].fieldLabel,dataIndex:fc['jlsm'].name,width:50,editor:new fm.TextField(fc['jlsm'])},
    	{id:'lsh',header:fc['lsh'].fieldLabel,dataIndex:fc['lsh'].name,width:50,renderer:showBtn},
    	{id:'billState',header:fc['billState'].fieldLabel,dataIndex:fc['billState'].name,width:50,hidden:true},
    	{id:'filename',header:fc['filename'].fieldLabel,dataIndex:fc['filename'].name,width:50,hidden:true},
    	{id:'zls',header:fc['zls'].fieldLabel,dataIndex:fc['zls'].name,width:50,hidden:true}
    	])
	
    cm_qt.defaultSortable = true;						//设置是否可排序
    var Plant_qt = Ext.data.Record.create(Columns);
    var PlantInt_qt = {
    	'pid':CURRENTAPPID,         'bh':'',
    	'jlsm':'' ,       'xmbh':'',           'bzxmbh':'',         'itype':'qt',
    	'rq':new Date() ,       'sgdw':'',           'jsdw':'',         'zjz':'',
    	'lsh':'' ,       'billState':0,           'filename':'',         'zls':0
	}
    ds_qt = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod
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
    
    ds_qt.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
 
   var gridPanel_qt = new Ext.grid.EditorGridTbarPanel({
   		id : 'qtPanel',
    	title:'其他信息',
		ds : ds_qt,
		cm : cm_qt,
		sm : sm_qt,
		border : false,
		clicksToEdit : 2,
		header : false,
		//addBtn:false,
		//saveBtn:false,
		saveHandler : saveFun,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>其他<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_qt,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_qt,
		plantInt : PlantInt_qt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds_qt.baseParams.params = "  itype = 'qt'"
	ds_qt.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});    
	gridPanel_qt.on("afterinsert",function(){
		var rec = sm_qt.getSelected();
		rec.set("rq",new Date());
	})
	gridPanel_qt.on('beforeinsert',function(){
		if(''==getxmbh){
			Ext.MessageBox.alert('提示','请先选择左边树中验评项目');
			ds_qt.baseParams.params = "  itype = 'qt'"
			ds_qt.load({params : {start : 0,limit : PAGE_SIZE}});
		}else{PlantInt_qt.xmbh=getxmbh}
	});
	
	
	function saveFun(){
		var id = this.id;
		var flag = true;
		var records = '';
		if(id == 'ypPanel'){
			records = ds.getModifiedRecords();
		}else if(id == 'sgPanel'){
			records = ds_sg.getModifiedRecords();
		}else if(id == 'syPanel'){
			records = ds_sy.getModifiedRecords();
		}else if(id == 'qtPanel'){
			records = ds_qt.getModifiedRecords();
		}else{
			return;
		}
		if(records.length==0){
			Ext.example.msg('提示！', '请先填写完整内容后再保存！');
			return;
		}
		//sgdw,jsdw,zjz
//		for (var i = 0; i < records.length; i++) {
//			if(records[i].get('sgdw')==''){
//				Ext.example.msg('提示！', fc['sgdw'].fieldLabel+'：不能为空！');
//				flag = false;
//				break;
//			}else if(records[i].get('jsdw')==''){
//				Ext.example.msg('提示！', fc['jsdw'].fieldLabel+'：不能为空！');
//				flag = false;
//				break;
//			}else if(records[i].get('zjz')==''){
//				Ext.example.msg('提示！', fc['zjz'].fieldLabel+'：不能为空！');
//				flag = false;
//				break;
//			}
//		}
		if(flag) this.defaultSaveHandler();
	}
	
		
	function showBtn(value,cellmeta,record,rowIndex,columnIndex,store){
		var fileUids = "jyjl"+record.data.uids;
	    return "<button class=btn1_mouseout onclick=getFile('"+value+"','"+record.data.uids+"')> 附件操作</button>"
	}	
	function getFile(){
		fileWin = new Ext.Window({
			title:'附件上传',
			buttonAlign:'center',
			closable:false,
			layout:'fit',
			modal:'true',
			width:300,
			height:230,
			autoScroll:true,
			items:filePanel,
			buttons:[{text:'关闭',handler:function(){fileWin.hide()}}]
		});		
		fileWin.show()
	}	
	//-------------------Content tabs-------------
    var tabs = new Ext.TabPanel({
        activeTab: 0,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'center',
        forceFit: true,
        items:[gridPanel,gridPanel_sg,gridPanel_sy,gridPanel_qt]
    });	
	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel,tabs]
	});
	gridPanel.getTopToolbar().add(queryBtn_yp);
	gridPanel_sg.getTopToolbar().add(queryBtn_sg);
	gridPanel_sy.getTopToolbar().add(queryBtn_sy);
	gridPanel_qt.getTopToolbar().add(queryBtn_qt);
	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    //-------------------query panel--------------
    var formWin, queryGrid
    var queStr="1=1";
    var fixedFilterPart = "1=1";
	var xmbhField = new Ext.form.TextField({
		id: 'xmbh',
		fieldLabel: fc['xmbh'].fieldLabel,
		width:200
	});
	var sgdwField = new Ext.form.TextField({
		id: 'sgdw',
		fieldLabel: fc['sgdw'].fieldLabel,
		width:200
	});
	var jsdwField = new Ext.form.TextField({
		id: 'jsdw',
		fieldLabel: fc['jsdw'].fieldLabel,
		width:200
	});
	var zjzField = new Ext.form.TextField({
		id: 'zjz',
		fieldLabel: fc['zjz'].fieldLabel,
		width:200
	});
	
	var rqPanel = new Ext.Panel({
		layout: 'column',
		border: false,
		width: 480,
		items:[{
			layout: 'form', columnWidth: .5, bodyStyle: 'border: 0px;',
			items:[
				new Ext.form.DateField({
					id: 'rq_begin',
					fieldLabel: fc['rq'].fieldLabel,
					format: 'Y-m-d', 
					minValue: '2000-01-01', 
					emptyText: '开始时间',
					width: 100
				})
			]
		},{
			layout: 'form', columnWidth: .5, bodyStyle: 'border: 1px;',
			items:[
				new Ext.form.DateField({
					id: 'rq_end',
					hideLabel: true,
					format: 'Y-m-d', 
					minValue: '2000-01-01', 
					emptyText: '结束时间',
					width: 100
				})
			]
		}]
	});
	var	formPanel = new Ext.FormPanel({
		id: 'form-panel',
		labelWidth:130,
	    header: false, 
	    border: false, 
		layout: 'form',
		region: 'center',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'center',
		items: [
			new Ext.form.FieldSet({
				title: '字段查询',
		      	border: true,
		      	layout: 'form',
		      	items:[xmbhField,rqPanel,sgdwField,jsdwField,zjzField]
			})
		],
		bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery
		}]
	});
		
		
	function showWindow(){
		fixedFilterPart = "1=1";
		var btnId = this.id;
		if(btnId=="yp"){
			queryGrid = gridPanel;
			fixedFilterPart = treeFilterPart + " and itype = 'yp' ";
		}else if(btnId=="sg"){
			queryGrid = gridPanel_sg;
			fixedFilterPart = treeFilterPart + " and itype = 'sg' ";
		}else if(btnId=="sy"){
			queryGrid = gridPanel_sy;
			fixedFilterPart = treeFilterPart + " and itype = 'sy' ";
		}else if(btnId=="qt"){
			queryGrid = gridPanel_qt;
			fixedFilterPart = treeFilterPart + " and itype = 'qt' ";
		}else{
			return;
		}
				
 		if(!formWin){
			formWin = new Ext.Window({	               
				title: '查询数据',
				width: 540, minWidth: 400, height: 280,
				layout: 'fit', iconCls: 'form', closeAction: 'hide',
				border: false, constrain: true, maximizable: true, modal: true,
				items: [formPanel]
			});   
     	}
     	formPanel.getForm().reset();
     	formWin.show();
   	}
   	
   	function execQuery(){
   		queStr='1=1';
   		var form = formPanel.getForm(), val = true;
		//处理日期
   		var pb = form.findField('rq_begin');
		var pe = form.findField('rq_end');
		if ('' == pb.getValue() && '' == pe.getValue()){
			
		} else {
			if ('' == pb.getValue() && '' != pe.getValue()){
				queStr += ' and rq <= to_date(\'' + formatDate(pe.getValue()) + '\',\'YYYY-MM-DD\')';
			} else if ('' != pb.getValue() && "" == pe.getValue()){
				queStr += ' and rq >= to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')';
			} else if ('' != pb.getValue() && '' != pe.getValue()){
				if (pb.getValue() > pe.getValue()){
					Ext.example.msg('提示！', fc['rq'].fieldLabel+'：开始时间应该小于等于结束时间！');
					val = false; 
					return;
				} else {
					queStr += ' and rq ' 
							+ ' between to_date(\'' + formatDate(pb.getValue()) + '\',\'YYYY-MM-DD\')' 
							+ ' and to_date(\'' + formatDate(pe.getValue())+ '\',\'YYYY-MM-DD\')'; 
				}
			}
		}
		//处理文本xmbh,sgdw,jsdw,zjz
		var field = '';
		field = form.findField('xmbh').getValue();
		if (field != '') queStr += ' and xmbh like \'%' + field + '%\'';
		field = form.findField('sgdw').getValue();
		if (field != '') queStr += ' and sgdw like \'%' + field + '%\'';
		field = form.findField('jsdw').getValue();
		if (field != '') queStr += ' and jsdw like \'%' + field + '%\'';
		field = form.findField('zjz').getValue();
		if (field != '') queStr += ' and zjz like \'%' + field + '%\'';
		
   		if (val){
   			with (queryGrid.getStore()){
   				baseParams.business = 'baseMgm';
   				baseParams.method = 'findWhereOrderBy';
   				baseParams.params = fixedFilterPart  + " and " + queStr;
   				load({
   					callback: function(){ formWin.hide(); }
   				});
   			}
   		}
   	}
   	
   	
});

//附件Window
function getFile(lsh,uids){
	var filePanel = new Ext.Panel({
    	id:'outputPanel',
		html: '<iframe name=content src="Business/gczl/gczl.jyjl.file.jsp?xmbh='+uids+'" frameborder=0 style=width:100%;height:100%;></iframe>'
	});			
	var fileWin = new Ext.Window({
		title:'附件上传',
		buttonAlign:'center',
		closable:false,
		layout:'fit',
		modal:'true',
		width:document.body.clientWidth,
		height:document.body.clientHeight,
		autoScroll:true,
		items:filePanel,
		buttons:[{text:'关闭',handler:function(){fileWin.hide()}}]
	});		
	fileWin.show()
}	