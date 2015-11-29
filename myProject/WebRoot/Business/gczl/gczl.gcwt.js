var treePanel, treeLoader;
var root, saveBtn;
var treePanelTitle = "检验项目结构";
var rootText = "验评标准树";

var bean = "com.sgepit.pmis.gczl.hbm.Gczlwt"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'xmbh'

var getxmbh='';
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
		var xmbh = (node == root) ? "0" : node.getUI().elNode.all("xmbh").innerText;
		getxmbh = xmbh;
		ds.baseParams.params=" xmbh='"+xmbh+"' ";
		ds.load({params : {start : 0,limit : PAGE_SIZE}});
	}

//----------------------------Content---------------------------------------	

	var fc={
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'工程项目编号',hidden:true,hideLabel:true,anchor:'95%'},
		'xmbh':{name:'xmbh',fieldLabel:'检验项目代码',allowBlank: false,anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'编号',hidden:true,hideLabel:true,anchor:'95%'},
		'rq':{name:'rq',fieldLabel:'<font color=red>填报日期</font>',anchor:'95%',format: 'Y-m-d'},
		'fssj':{name:'fssj',fieldLabel:'<font color=red>发生问题时间</font>',anchor:'95%',format: 'Y-m-d'},
		'zcss':{name:'zcss',fieldLabel:'<font color=red>造成损失</font>',anchor:'95%'},
		'dd':{name:'dd',fieldLabel:'<font color=red>地点</font>',anchor:'95%'},
		'yyfl':{name:'yyfl',fieldLabel:'<font color=red>质量原因</font>',anchor:'95%'},
		'zrfl':{name:'zrfl',fieldLabel:'<font color=red>责任方分类</font>',anchor:'95%'},
		'sgdw':{name:'sgdw',fieldLabel:'<font color=red>施工单位</font>',anchor:'95%'},
		'rq1':{name:'rq1',fieldLabel:'<font color=red>影响停工开始时间</font>',anchor:'95%',format: 'Y-m-d'},
		'rq2':{name:'rq2',fieldLabel:'<font color=red>影响停工结束时间</font>',anchor:'95%',format: 'Y-m-d'},
		'gcms':{name:'gcms',fieldLabel:'<font color=red>过程描述</font>',anchor:'95%'},
		'cljg':{name:'cljg',fieldLabel:'<font color=red>处理结果</font>',anchor:'95%'},
		'zgcs':{name:'zgcs',fieldLabel:'<font color=red>整改措施</font>',anchor:'95%'},
		'bzxmbh':{name:'bzxmbh',fieldLabel:'<font color=red>标准项目代码</font>',anchor:'95%'}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'bh',type:'string'},
		{name:'xmbh',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d'},
		{name:'fssj',type:'date',dateFormat:'Y-m-d'},
		{name:'zcss',type:'string'},
		{name:'dd',type:'string'},
		{name:'yyfl',type:'string'},
		{name:'zrfl',type:'string'},
		{name:'sgdw',type:'string'},
		{name:'rq1',type:'date',dateFormat:'Y-m-d'},
		{name:'rq2',type:'date',dateFormat:'Y-m-d'},
		{name:'gcms',type:'string'},
		{name:'cljg',type:'string'},
		{name:'zgcs',type:'string'},
		{name:'bzxmbh',type:'string'}
	]

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
    	{id:'rq',header:fc['rq'].fieldLabel,dataIndex:fc['rq'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq'])},
    	{id:'fssj',header:fc['fssj'].fieldLabel,dataIndex:fc['fssj'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['fssj'])},
    	{id:'rq1',header:fc['rq1'].fieldLabel,dataIndex:fc['rq1'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq1'])},
    	{id:'rq2',header:fc['rq2'].fieldLabel,dataIndex:fc['rq2'].name,width:50,renderer: formatDate,editor:new fm.DateField(fc['rq2'])},
    	{id:'sgdw',header:fc['sgdw'].fieldLabel,dataIndex:fc['sgdw'].name,width:50,editor:new fm.TextField(fc['sgdw'])},
    	{id:'zcss',header:fc['zcss'].fieldLabel,dataIndex:fc['zcss'].name,width:50,editor:new fm.TextField(fc['zcss'])},
    	{id:'dd',header:fc['dd'].fieldLabel,dataIndex:fc['dd'].name,width:50,editor:new fm.TextField(fc['dd'])},
    	{id:'yyfl',header:fc['yyfl'].fieldLabel,dataIndex:fc['yyfl'].name,width:50,editor:new fm.TextField(fc['yyfl'])},
    	{id:'zrfl',header:fc['zrfl'].fieldLabel,dataIndex:fc['zrfl'].name,width:50,editor:new fm.TextField(fc['zrfl'])},
    	{id:'gcms',header:fc['gcms'].fieldLabel,dataIndex:fc['gcms'].name,width:50,editor:new fm.TextField(fc['gcms'])},
    	{id:'cljg',header:fc['cljg'].fieldLabel,dataIndex:fc['cljg'].name,width:50,editor:new fm.TextField(fc['cljg'])},
    	{id:'zgcs',header:fc['zgcs'].fieldLabel,dataIndex:fc['zgcs'].name,width:50,editor:new fm.TextField(fc['zgcs'])}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'pid':'',         'bh':'',          'xmbh':'',           'bzxmbh':'',         'fssj':'',
    	'rq1':'' ,       'rq2':'',           'sgdw':'',         'zcss':'',
    	'rq':new Date() , 'dd':'',           'yyfl':'',         'yyfl':'',
    	'zrfl':'' ,       'gcms':'',           'cljg':'',         'zgcs':''
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
    	title:'验评信息',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		clicksToEdit : 2,
		header : false,
		region:'center',
		//addBtn:false,
		//saveBtn:false,
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
	//ds.baseParams.params = "  itype = 'yp'"
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});    
	gridPanel.on('beforeinsert',function(){
		if(''==getxmbh){
			Ext.MessageBox.alert('提示','请先选择左边树中项目');
			ds.load({params : {start : 0,limit : PAGE_SIZE}});
		}else{PlantInt.xmbh=getxmbh}
	});	
	
	
		
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
	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel,gridPanel]
	});

	
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d ') : '';
    };

});

//附件Window
function getFile(lsh,uids){
	var filePanel = new Ext.Panel({
    	id:'outputPanel',
		html: '<iframe name=content src="Business/gczl/gczl.gcwt.file.jsp?xmbh='+uids+'" frameborder=0 style=width:100%;height:100%;></iframe>'
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