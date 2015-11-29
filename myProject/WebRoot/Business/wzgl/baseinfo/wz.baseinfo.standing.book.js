var bean = "com.sgepit.pmis.wzgl.hbm.WztzView";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uids';
var orderColumn = 'bm';
//物资树节点编码
var nodeBM;
//物资台账编码
var wztzBM;

Ext.onReady(function(){
    //--------------物资编码Tree---------------------
	var rootText = '物资分类';
	var root = new Ext.tree.AsyncTreeNode({
	    id : '0',
	    text:rootText,
	    inconCls:'form'
	});
    
	var treeLoader = new Ext.tree.TreeLoader({
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

	var treePanel = new Ext.tree.ColumnTree({
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
			},'-',{
			iconCls: 'icon-collapse-all',
			tooltip: 'Collapse All',
			handler: function(){ root.collapse(true); }
			}],
		rootVisible : true,
		autoScroll : true,
		collapseMode : 'mini',
		columns : [{
				header: '名称',
				width:260,
				dataIndex: 'pm'
			}, {
				header: '主键',
				width:0,
				dataIndex: 'uids',
				renderer: function(value){
					return "<div id='uids'>"+value+"</div>";
				}
			},{
			    header: '编码',
			    width:0,
			    dataIndex: 'bm',
			    renderer: function(value){
					return "<div id='bm'>"+value+"</div>";
			    }
			},{
				header: '层数',
				width:0,
				dataIndex: 'lvl'
			},{
				header: '叶子',
				width:0,
				dataIndex: 'isleaf'
			},{
				header: '父节点',
				width:0,
				dataIndex: 'parent'
			}
		],
		loader : treeLoader,
		root : root
	});
    
	treePanel.on('beforeload', function(node){
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = treePanel.loader.baseParams;
		baseParams.parent = parent;
		baseParams.pid = CURRENTAPPID;
	});
	treePanel.getRootNode().expand(); 
	treePanel.on('click',onClick);

	function onClick(node,e){
		if(node.id == "0"){
			noodeBM = '';
			ds.load({params:{start:0,limit:PAGE_SIZE}});
		}else if(node.attributes.uids&&node.text){
			nodeBM = node.attributes.bm;
			ds.baseParams.params = "bm like '"+nodeBM+"%'";
			ds.load({params:{start:0,limit:PAGE_SIZE}});
		}
	}
    
    //===================物资台帐主表===================
	var fc={
		'uids':{name:'uids',fieldLabel:'流水号'},
		'bm':{name:'bm',fieldLabel:'编码'},
		'pm':{name:'pm',fieldLabel:'品名'},
		'gg':{name:'gg',fieldLabel:'规格型号'},
		'dw':{name:'dw',fieldLabel:'单位'},
		'jhdj':{name:'jhdj',fieldLabel:'单价'},
		'sl':{name:'sl',fieldLabel:'库存数量'},
		'jcje':{name:'jcje',fieldLabel:'结存金额'},
		'kw':{name:'kw',fieldLabel:'库位'},
		'bz':{name:'bz',fieldLabel:'备注'},
		'pid':{name:'pid',fieldLabel:'PID'},
		'sqsl':{name:'sqsl',fieldLabel:'申请数量'},
		'cgsl':{name:'cgsl',fieldLabel:'采购数量'},
		'rksl':{name:'rksl',fieldLabel:'入库数量'},
		'cksl':{name:'cksl',fieldLabel:'出库数量'},
		'kgry':{name:'kgry',fieldLabel:'库管人员'}
	};

	var Columns = [
		{name:'uids',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dw',type:'string'},
		{name:'jhdj',type:'float'},
		{name:'sl',type:'float'},
		{name:'jcje',type:'float'},
		{name:'kw',type:'string'},
		{name:'bz',type:'string'},
		{name:'pid',type:'string'},
		{name:'sqsl',type:'float'},//申请数量
		{name:'cgsl',type:'float'},//采购数量
		{name:'rksl',type:'float'},//入库数量
		{name:'cksl',type:'float'},//出库数量
		{name:'kgry',type:'string'}//库管人员
	];
    
	var sm =  new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
    
	var cm = new Ext.grid.ColumnModel([
		sm,
		{
			id:'uids',
			header:fc['uids'].fieldLabel,
			dataIndex:fc['uids'].name,
			hidden:true
		},{
			id:'bm',
			header:fc['bm'].fieldLabel,
			type:'string',
			dataIndex:fc['bm'].name,
			width:120,
			renderer:function(v){
				return "<div title='"+v+"'>"+v+"</div>";
			}
		},{
			id:'pm',
			header:fc['pm'].fieldLabel,
			type:'string',
			dataIndex:fc['pm'].name,
			width:160,
			renderer:function(v){
				return "<div title='"+v+"'>"+v+"</div>";
			}
		},{
			id:'gg',
			header:fc['gg'].fieldLabel,
			type:'string',
			dataIndex:fc['gg'].name,
			align:'center',
			width:100,
			renderer:function(v){
				return "<div title='"+v+"'>"+v+"</div>";
			}
		},{
			id:'dw',
			header:fc['dw'].fieldLabel,
			type:'string',
			dataIndex:fc['dw'].name,
			align:'center',
			width:80
		},{
			id:'jhdj',
			header:fc['jhdj'].fieldLabel,
			dataIndex:fc['jhdj'].name,
			align:'right',
			width:80
		},{
			id:'sl',
			header:fc['sl'].fieldLabel,
			dataIndex:fc['sl'].name,
			align:'right',
			width:80
		},{
			id:'jcje',
			header:fc['jcje'].fieldLabel,
			dataIndex:fc['jcje'].name,
			align:'right',
			width:80
		},{
			id:'kw',
			header:fc['kw'].fieldLabel,
			dataIndex:fc['kw'].name,
			width:120
		},{
			id:'sqsl',
			header:fc['sqsl'].fieldLabel,
			dataIndex:fc['sqsl'].name,
			width:70,
			align:'right',
			renderer: function(value){
				return "<a href='javascript:showTab(0)'><font color='blue'>"+value+"</font></a>";
			}
		},{
			id:'cgsl',
			header:fc['cgsl'].fieldLabel,
			dataIndex:fc['cgsl'].name,
			width:70,
			align:'right',
			renderer: function(value){
				return "<a href='javascript:showTab(1)'><font color='blue'>"+value+"</font></a>";
			}
		},{
			id:'rksl',
			header:fc['rksl'].fieldLabel,
			dataIndex:fc['rksl'].name,
			width:70,
			align:'right',
			renderer: function(value){
				return "<a href='javascript:showTab(2)'><font color='blue'>"+value+"</font></a>";
			}
		},{
			id:'cksl',
			header:fc['cksl'].fieldLabel,
			dataIndex:fc['cksl'].name,
			width:70,
			align:'right',
			renderer: function(value){
				return "<a href='javascript:showTab(3)'><font color='blue'>"+value+"</font></a>";
			}
		},{
			id:'bz',
			header:fc['bz'].fieldLabel,
			dataIndex:fc['bz'].name,
			width:180
		},{
			id:'kgry',
			header:fc['kgry'].fieldLabel,
			dataIndex:fc['kgry'].name,
			width:70,
			hidden:true
		},{
			id:'pid',
			header:fc['pid'].fieldLabel,
			dataIndex:fc['pid'].name,
			hidden:true
		}
	]);

	cm.defaultSortable = true;                      //设置是否可排序

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod
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

	var pmBook = new Ext.form.TextField({
		width : 90
	});
	var queryBook = new Ext.Button({
		text : '检索',
		iconCls : 'btn',
		handler : queryWZTZ
	});
	var expExcelBook = new Ext.Button({
		text : '导出数据',
		iconCls : 'excel',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon',
		handler : exportDataFileWZTZ
	});
	var gridPanelBook = new Ext.grid.GridPanel({
		title : '物资台帐',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		model : 'mini',
		collapsible:true,
		region : 'center',
		autoScroll : true, // 自动出现滚动条
		tbar : ['品名：',pmBook,'-',queryBook,'->',expExcelBook],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		listeners : {
			'beforecollapse' : function(){
			    //tabPanel.setHeight(600)
			},
			'beforeexpand' : function(){
			    //tabPanel.setHeight(300)
			},
			'collapse' : function(panel){
				var xy = tabPanel.getPosition();
				tabPanel.setPagePosition(xy[0],panel.getFrameHeight() - panel.getInnerHeight());
				tabPanel.setHeight(rightHeight);
			},
			'expand' : function(){
				var xy = tabPanel.getPosition();
				tabPanel.setPagePosition(xy[0],tabXY[1]);
				tabPanel.setHeight(300);
			}
		}
	});  
	ds.load({params:{start:0,limit:PAGE_SIZE}});

	function changeReloadData(){
		var record = sm.getSelected();
		if(record == null)return;
		wztzBM = record.get("bm");
		var tab = tabPanel.getActiveTab();
		var tabDs = tab.getStore();
		tabDs.baseParams.params = "bm='"+wztzBM+"'";
		tabDs.load({params:{start:0,limit:PAGE_SIZE}});
		
		var comp=ing=0;
		var sql = "";
		if(tab.id == "_sqtz"){
			sql = "SELECT SUM(t.sqsl),t.state FROM WZTZ_SQJH_VIEW t WHERE bm='"+wztzBM+"' GROUP BY t.state";
		}else if(tab.id == "_cgtz"){
			sql = "SELECT SUM(t.cgsl),t.state FROM WZTZ_CGJH_VIEW t WHERE bm='"+wztzBM+"' GROUP BY t.state";
		}else if(tab.id == "_rktz"){
			sql = "SELECT SUM(t.rksl),t.state FROM WZTZ_WZRK_VIEW t WHERE bm='"+wztzBM+"' GROUP BY t.state";
		}else if(tab.id == "_cktz"){
			sql = "SELECT SUM(t.lysl),t.state FROM WZTZ_WZCK_VIEW t WHERE bm='"+wztzBM+"' GROUP BY t.state";
		}
		baseDao.getData(sql,function(list){
			for(var i=0;i<list.length;i++){
				list[i][1] == "1" ?  comp = list[i][0] : ing +=list[i][0]
			}
			if(Ext.getCmp(tab.id+"Comp"))Ext.getCmp(tab.id+"Comp").setValue(comp);
			if(Ext.getCmp(tab.id+"Ing"))Ext.getCmp(tab.id+"Ing").setValue(ing);
		});
	}

	sm.on('rowselect',changeReloadData);

	var tabPanel = new Ext.TabPanel({
		id:'tabPanel',
		region:'south',
		activeTab:0,
		height : 240,
		border : false,
		collapsible:true,
		model : 'mini',
		items:[
			gridPanel_sqtz,
			gridPanel_cgtz,
			gridPanel_rktz,
			gridPanel_cktz
		],
		listeners : {
			'tabchange' : changeReloadData
		}
	});

	var rightPanel = new Ext.Panel({
		region:'center',
		layout : 'border',
		border : false,
		items:[gridPanelBook,tabPanel]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		border : false,
		items:[treePanel,rightPanel]
	});
	var tabXY = tabPanel.getPosition() 
	var rightHeight = treePanel.getInnerHeight()+1;
	//检索
	function queryWZTZ(){
		if(nodeBM){
			ds.baseParams.params = "bm like '"+nodeBM+"%' and pm like '%"+pmBook.getValue()+"%'";
		}else{
			ds.baseParams.params = "pm like '%"+pmBook.getValue()+"%'";
		}
		ds.load({params:{start:0,limit:PAGE_SIZE}});
	}
	//导出数据
    function exportDataFileWZTZ() {
    	var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportData&businessType=wztzList";
    	if(pmBook.getValue()){
    		openUrl += "&pm="+pmBook.getValue();
    	}
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}
});

	function showTab(i){
		if(i==0){
			Ext.getCmp('tabPanel').setActiveTab(gridPanel_sqtz);
		}else if(i==1){
			Ext.getCmp('tabPanel').setActiveTab(gridPanel_cgtz);
		}else if(i==2){
			Ext.getCmp('tabPanel').setActiveTab(gridPanel_rktz);
		}else if(i==3){
			Ext.getCmp('tabPanel').setActiveTab(gridPanel_cktz);
		}
	}