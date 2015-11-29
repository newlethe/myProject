var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='厂商分类'
var temNode;

var ds,cm,Columns,gridPanel

var bean = "com.sgepit.pmis.wzgl.hbm.WzCsb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'csdm'
Ext.onReady(function(){
	
	//--------------供应商地域Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "csBmTypeTree",
			businessName : "wzglMgmImpl",
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.TreePanel({
		id : 'zl-tree-panel',
		title: "厂商分类",
		region : 'west',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : false,
		lines : false,
		autoScroll : true,
		//animCollapse : false,
		//animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '名称',
			width : 260,
			dataIndex : 'pm',
			renderer: function(value){
            	return "<div id='pm'>"+value+"</div>";
            }
		}
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
	})	
	
	
	treePanel.on('click',onClick);
	
	
	function onClick(node,e){
		tmpNode=node
		selectedTreeData = node.id;
		selectedTreeData_text = node.text;
		ds.baseParams.params = " flbm='"+selectedTreeData+"' and isused = '1'"
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
		
	}
	
	
//-------------------------(启用)供应商GRID----------------------------------
	var fc={
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'csdm':{
			name:'csdm',
			fieldLabel:'厂商代码',
			allowBlank: false,
			anchor:'95%'
		},'csmc':{
			name:'csmc',
			fieldLabel:'厂商名称',
			allowBlank: false,
			anchor:'95%'
		},'addr':{
			name:'addr',
			fieldLabel:'地址',
			allowBlank: false,
			anchor:'95%'
		},'tel':{
			name:'tel',
			fieldLabel:'电话',
			allowBlank: false,
			anchor:'95%'
		},'lxr':{
			name:'lxr',
			fieldLabel:'联系人',
			allowBlank: false,
			anchor:'95%'
		},'bank':{
			name:'bank',
			fieldLabel:'开户行',
			allowBlank: false,
			anchor:'95%'
		},'accountNumber':{
			name:'accountNumber',
			fieldLabel:'银行帐号',
			allowBlank: false,
			anchor:'95%'
		},'taxNumber':{
			name:'taxNumber',
			fieldLabel:'税号',
			allowBlank: false,
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			allowBlank: false,
			anchor:'95%'
		}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'csdm',type:'string'},
		{name:'csmc',type:'string'},
		{name:'gb',type:'string'},
		{name:'tel',type:'string'},
		{name:'post',type:'string'},
		{name:'addr',type:'string'},
		{name:'fax',type:'string'},
		{name:'fr',type:'string'},
		{name:'lxr',type:'string'},
		{name:'email',type:'string'},
		{name:'mobil',type:'string'},
		{name:'bank',type:'string'},
		{name:'accountNumber',type:'string'},
		{name:'taxNumber',type:'string'},
		{name:'isused',type:'string'},
		{name:'flbm',type:'string'},
		{name:'bz',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},    	
    	{id:'csdm',header:fc['csdm'].fieldLabel,dataIndex:fc['csdm'].name,width:50},
    	{id:'csmc',header:fc['csmc'].fieldLabel,dataIndex:fc['csmc'].name,width:100},
    	{id:'tel',header:fc['tel'].fieldLabel,dataIndex:fc['tel'].name,width:50},    	
    	{id:'lxr',header:fc['lxr'].fieldLabel,dataIndex:fc['lxr'].name,width:50},
    	{id:'bank',header:fc['bank'].fieldLabel,dataIndex:fc['bank'].name,width:50,hidden:true},
    	{id:'accountNumber',header:fc['accountNumber'].fieldLabel,dataIndex:fc['accountNumber'].name,width:50,hidden:true},
    	{id:'taxNumber',header:fc['taxNumber'].fieldLabel,dataIndex:fc['taxNumber'].name,width:50,hidden:true}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
   
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
    
   
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	title:'供应商信息清单',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		clicksToEdit : 2,
		header : false,
		//addBtn:false,
		saveBtn:false,
		delBtn: false,
		region : 'center',
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>供应商信息<B></font>'],
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
		crudText: {add:'选择供货厂商'},
		insertHandler: selectSupplierFun,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds.baseParams.params = "  isused = '1'"
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});	
	

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,gridPanel]
    });		
    
    
  function selectSupplierFun (){
  	var rec = sm.getSelected()
  	if(rec){
  		window.returnValue = rec.get("csdm");
  		
  	} else{
  		window.returnValue = null;
  	}
  	window.close()
  }
   
    
});