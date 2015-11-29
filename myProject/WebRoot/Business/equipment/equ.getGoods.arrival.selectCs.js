var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='中国'
var temNode;
var f_bmArr = new Array;
var ds,cm,Columns,gridPanel,gridPanel_jy

var bean = "com.sgepit.pmis.equipment.hbm.SbCsb"
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
			parent : 'C',
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
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		tbar:[{
	            iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
	            },'-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ root.collapse(true); }
	            }],
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
            width:  0,
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
            dataIndex: 'leaf'
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentbm'
        }
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = 'C';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
	})	
	
	
	treePanel.getRootNode().expand(); 
	treePanel.on('click',onClick);
	
	function onClick(node,e){
		tmpNode=node
		selectedTreeData = node.id;
		selectedTreeData_text = node.text;
		DWREngine.setAsync(false);
		var uids = ""; bm_="";
		if(node.text=="中国"){
			uids = "C";
			bm_ = "C";
			ds.baseParams.params = " isused = '1'  and pid='" + CURRENTAPPID + "'"
		}else if(!node.leaf){
			uids = node.getUI().elNode.all('uids').innerText;
			bm_ = node.getUI().elNode.all('bm').innerText
			ds.baseParams.params = " (flbm='"+bm_+"' or flbm in (select bm from WzCsbType where parentbm='"+bm_+"')) and isused = '1'  and pid='" + CURRENTAPPID + "'"
		}else{
			uids = node.getUI().elNode.all('uids').innerText;
			bm_ = node.getUI().elNode.all('bm').innerText
			ds.baseParams.params = " flbm='"+bm_+"' and isused = '1'  and pid='" + CURRENTAPPID + "'"
		}
		ds.load({params:{start:0,limit:PAGE_SIZE}});
		
		baseMgm.getData("select bm,pm ,leaf from wz_csb_type where uids='"+uids+"'", function(obj) {
			f_bmArr[0] = obj[0][0]
			f_bmArr[1] = obj[0][1]
			f_bmArr[2] = obj[0][2]
		});
		DWREngine.setAsync(true);
	}
	

//-------------------------(启用)供应商GRID----------------------------------
	var fc={
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'工程项目编号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'isused':{
			name:'isused',
			fieldLabel:'是否启用',
			allowBlank: false,
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
		},'gb':{
			name:'gb',
			fieldLabel:'国家',
			allowBlank: false,
			anchor:'95%'
		},'post':{
			name:'post',
			fieldLabel:'邮编',
			allowBlank: false,
			anchor:'95%'
		},'addr':{
			name:'addr',
			fieldLabel:'地址',
			allowBlank: false,
			anchor:'95%'
		},'fax':{
			name:'fax',
			fieldLabel:'传真',
			allowBlank: false,
			anchor:'95%'
		},'tel':{
			name:'tel',
			fieldLabel:'电话',
			allowBlank: false,
			anchor:'95%'
		},'fr':{
			name:'fr',
			fieldLabel:'法人',
			allowBlank: false,
			anchor:'95%'
		},'lxr':{
			name:'lxr',
			fieldLabel:'联系人',
			allowBlank: false,
			anchor:'95%'
		},'email':{
			name:'email',
			fieldLabel:'邮箱',
			allowBlank: false,
			anchor:'95%'
		},'mobil':{
			name:'mobil',
			fieldLabel:'手机',
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
		},'flbm':{
			name:'flbm',
			fieldLabel:'分类编码',
			allowBlank: false,
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			allowBlank: false,
			anchor:'95%'
		},'rate':{
			name:'rate',
			fieldLabel:'评级',
			allowBlank: false,
			anchor:'95%'
		},'appra':{
			name:'appra',
			fieldLabel:'评价',
			allowBlank: false,
			anchor:'95%'
		}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
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
		{name:'rate',type:'string'},
		{name:'appra',type:'string'},
		{name:'bz',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect :true});
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
    	{id:'isused',header:fc['isused'].fieldLabel,dataIndex:fc['isused'].name,width:50,hidden:true,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("0"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'csdm',header:fc['csdm'].fieldLabel,dataIndex:fc['csdm'].name,width:50},
    	{id:'csmc',header:fc['csmc'].fieldLabel,dataIndex:fc['csmc'].name,width:50},
    	{id:'gb',header:fc['gb'].fieldLabel,dataIndex:fc['gb'].name,width:50,hidden:true},
    	{id:'tel',header:fc['tel'].fieldLabel,dataIndex:fc['tel'].name,width:50},
    	{id:'post',header:fc['post'].fieldLabel,dataIndex:fc['post'].name,width:50,hidden:true},
    	{id:'addr',header:fc['addr'].fieldLabel,dataIndex:fc['addr'].name,width:50},
    	{id:'fax',header:fc['fax'].fieldLabel,dataIndex:fc['fax'].name,width:50,hidden:true},
    	{id:'fr',header:fc['fr'].fieldLabel,dataIndex:fc['fr'].name,width:50,hidden:true},
    	{id:'lxr',header:fc['lxr'].fieldLabel,dataIndex:fc['lxr'].name,width:50,hidden:true},
    	{id:'email',header:fc['email'].fieldLabel,dataIndex:fc['email'].name,width:50,hidden:true},
    	{id:'mobil',header:fc['mobil'].fieldLabel,dataIndex:fc['mobil'].name,width:50,hidden:true},
    	{id:'bank',header:fc['bank'].fieldLabel,dataIndex:fc['bank'].name,width:50},
    	{id:'accountNumber',header:fc['accountNumber'].fieldLabel,dataIndex:fc['accountNumber'].name,width:50},
    	{id:'rate',header:fc['rate'].fieldLabel,dataIndex:fc['rate'].name,width:50},
    	{id:'appra',header:fc['appra'].fieldLabel,dataIndex:fc['appra'].name,width:50},
    	{id:'taxNumber',header:fc['taxNumber'].fieldLabel,dataIndex:fc['taxNumber'].name,width:50,hidden:true},
    	{id:'flbm',header:fc['flbm'].fieldLabel,dataIndex:fc['flbm'].name,width:50,hidden:true},
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50,hidden:true}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'isused':'' ,       'csdm':'',           'csmc':'',         'gb':'',
    	'tel':'' ,          'post':'',           'addr':'',         'fax':'',
    	'fr':'' ,           'lxr':'',            'email':'',        'mobil':'',
    	'bank':'',          'accountNumber':'',  'taxNumber':'',    'flbm':'' ,
		'bz':''
	}
    ds = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			pid: CURRENTAPPID
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
    var addConBtn = new Ext.Button({
		id: "btnSelectCs",
    	text:'选择厂商',
    	tooltip:'从下面表格中选择',
    	iconCls : 'add',
    	handler:selectCsFun
    })
    gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'center',
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		delBtn:false,
		saveBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>供应商信息<B></font>','-',addConBtn],
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
	//ds.baseParams.params = "  isused = '1'  and wzorsb ='sb'"
	ds.baseParams.params = "  isused = '1'  and pid='" + CURRENTAPPID + "'";
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
    
    function selectCsFun(){
    	var record = gridPanel.getSelectionModel().getSelected();
    	if(record){
    		window.close()
		    window.returnValue = record.get('csmc')
    	}
    }
    
});