var wz_root,wz_treeLoader,wz_treePanel,wz_selectedTreeData,wz_selectedTreeData_text
var wz_rootText='物资分类'
var wz_f_bmArr = new Array;
var wz_ds,wz_cm,wz_Columns,wz_gridPanel

var wz_bean = "com.sgepit.pmis.wzgl.hbm.WzBm"
var wz_business = "baseMgm"
var wz_listMethod = "findwhereorderby"
var wz_primaryKey = 'uids'
var wz_orderColumn = 'bm'

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

var wzArr = new Array();
Ext.onReady(function(){
	var btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	})

	//--------------物资编码Tree---------------------
   wz_root = new Ext.tree.AsyncTreeNode({
		text:wz_rootText,
		inconCls:'form'
	})
	
	wz_treeLoader = new Ext.tree.TreeLoader({
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
	
	wz_treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'west',
		split : true,
		width : 200,
		minSize : 200,
		maxSize : 300,
		tbar:[{
            iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ root.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ root.collapse(true); }
        	}],
		frame : false,
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
		loader : wz_treeLoader,
		root : wz_root
	});
	
	wz_treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = wz_treePanel.loader.baseParams
		baseParams.parent = parent;
		baseParams.pid = CURRENTAPPID;
	})	
	//wz_treePanel.getRootNode().expand();
	wz_treePanel.on('click',onClick);
	
	
	function onClick(node,e){
		tmpNode=node
		wz_selectedTreeData = node.id;
		wz_selectedTreeData_text = node.text;
		DWREngine.setAsync(false);
		baseMgm.getData("select bm,pm ,leaf from wz_ckclb where uids='"+node.getUI().elNode.all('uids').innerText+"' and "+pidWhereString+" ", function(obj) {
			wz_f_bmArr[0] = obj[0][0]
			wz_f_bmArr[1] = obj[0][1]
			wz_f_bmArr[2] = obj[0][2]
		});
		DWREngine.setAsync(true);
		
		wz_ds.baseParams.params = " flbm='"+node.getUI().elNode.all('bm').innerText+"' and bm_state = '1' and  bm not in(select catNo from MatStoreOutsub where outId ='"+selectUuid+"' and "+pidWhereString+" ) and "+pidWhereString+" "
		wz_ds.load({
			params : {
				start : 0,
				limit : 20
			}
		});
	}
	
	
//-------------------------(已启用)物资编码GRID----------------------------------


	var wz_fc={
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
		},'pid':{
			name:'pid',
			fieldLabel:'PID',
			hidden:true
		}
	};

	wz_Columns = [
		{name:'uids',type:'string'},
		{name:'bmState',type:'string'},
		{name:'stage',type:'string'},
		{name:'bm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dw',type:'string'},
		{name:'jhdj',type:'string'},
		{name:'sl',type:'string'},
		{name:'jhdj_sl',type:'string'},
		{name:'ckh',type:'string'},
		{name:'hwh',type:'string'},
		{name:'th',type:'string'},
		{name:'wzProperty',type:'string'},
		{name:'ge',type:'string'},
		{name:'de',type:'string'},
		{name:'bz',type:'string'},
		{name:'pid',type:'string'}
	]
	
	
	wz_sm = new Ext.grid.CheckboxSelectionModel({
		renderer:function(value,metaData,record){
			if(record.get('sl')==0){
				return;
			}else{
				return Ext.grid.CheckboxSelectionModel.prototype.renderer.apply(this,arguments);
			}
		},
		listeners:{'beforerowselect':function(SelectionModel,rowIndex,keepExisting,record){
			if(record.data.sl==0){
				Ext.example.msg('不能选择！','库存数量为0的物资不能选择！');
				return false;//不能进行选择
			}else{
				return true;
			}
		}}
	});

	wz_cm = new Ext.grid.ColumnModel([		// 创建列模型
    	wz_sm,
    	{id:'uids',header:wz_fc['uids'].fieldLabel,dataIndex:wz_fc['uids'].name,hidden:true},
    	{id:'bmState',header:wz_fc['bmState'].fieldLabel,dataIndex:wz_fc['bmState'].name,width:50,hidden:true,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("-1"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'stage',header:wz_fc['stage'].fieldLabel,dataIndex:wz_fc['stage'].name,width:50,hidden:true},
    	{id:'bm',header:wz_fc['bm'].fieldLabel,dataIndex:wz_fc['bm'].name,type:'string',width:50},
    	{id:'pm',header:wz_fc['pm'].fieldLabel,dataIndex:wz_fc['pm'].name,type:'string',width:50},
    	{id:'gg',header:wz_fc['gg'].fieldLabel,dataIndex:wz_fc['gg'].name,type:'string',width:50},
    	{id:'dw',header:wz_fc['dw'].fieldLabel,dataIndex:wz_fc['dw'].name,width:50},
    	{id:'jhdj',header:wz_fc['jhdj'].fieldLabel,dataIndex:wz_fc['jhdj'].name,width:50},
    	{id:'sl',header:wz_fc['sl'].fieldLabel,dataIndex:wz_fc['sl'].name,width:50},
    	{id:'jhdj_sl',header:wz_fc['jhdj_sl'].fieldLabel,dataIndex:wz_fc['jhdj_sl'].name,width:50,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sl*record.data.jhdj;
			}},
    	{id:'ckh',header:wz_fc['ckh'].fieldLabel,dataIndex:wz_fc['ckh'].name,width:50,hidden:true},
    	{id:'hwh',header:wz_fc['hwh'].fieldLabel,dataIndex:wz_fc['hwh'].name,width:50,hidden:true},
    	{id:'th',header:wz_fc['th'].fieldLabel,dataIndex:wz_fc['th'].name,width:50,hidden:true},
    	{id:'wzProperty',header:wz_fc['wzProperty'].fieldLabel,dataIndex:wz_fc['wzProperty'].name,width:50,hidden:true},
    	{id:'ge',header:wz_fc['ge'].fieldLabel,dataIndex:wz_fc['ge'].name,width:50,hidden:true},
    	{id:'de',header:wz_fc['de'].fieldLabel,dataIndex:wz_fc['de'].name,width:50,hidden:true},
    	{id:'bz',header:wz_fc['bz'].fieldLabel,dataIndex:wz_fc['bz'].name,width:50,hidden:true},
    	{id:'pid',header:wz_fc['pid'].fieldLabel,dataIndex:wz_fc['pid'].name,width:50,hidden:true}
    	])
	
    wz_cm.defaultSortable = true;						//设置是否可排序
    wz_Plant = Ext.data.Record.create(wz_Columns);
    wz_PlantInt = {
    	'bmState':'' ,    'stage':'',    'bm':'',      'pm':'',
    	'gg':'' ,          'dw':'',       'jhdj':'',    'sl':'',
    	'jhdj_sl':'' ,     'ckh':'',      'hwh':'',     'th':'',
    	'wzProperty':'',  'ge':'',       'de':'',      'bz':'',
    	'pid':CURRENTAPPID
	}
    wz_ds = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : wz_bean,
			business : wz_business,
			method : wz_listMethod,
			params : pidWhereString
		},// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : wz_primaryKey
		}, wz_Columns),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
    })
    
    wz_ds.setDefaultSort(wz_orderColumn, 'desc'); // 设置默认排序列
    
    wz_gridPanel = new Ext.grid.EditorGridTbarPanel({
    	title:'物资清单',
		ds : wz_ds,
		cm : wz_cm,
		sm : wz_sm,
		region:'center',
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资编码信息<B></font>','->',{
                    text : '查询',
                    iconCls : 'option',
                    handler : function(){
                        showWindow(wz_gridPanel);
                    }
                },'-',btnConfirm],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : wz_ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : wz_Plant,
		plantInt : wz_PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : wz_bean,
		business : wz_business,
		primaryKey : wz_primaryKey
	});
	//wz_ds.baseParams.params = "  bm_state = '1' and bm not in(select catNo from MatStoreOutsub where outId ='"+selectUuid+"')"
	//wz_ds.load({params:{start : 0,limit : 20}});
	storeSelects(wz_ds,wz_sm);
	wz_sm.on('rowselect',function(sm, rowIndex, record){
		if(record.data.sl==0);
	})
	
  selectWin = new Ext.Window({
	title:'选择物资',
	buttonAlign:'center',
	layout:'border',
	//width: document.body.clientWidth,
    //height: document.body.clientHeight,
    modal: true,
    width: 800,
	height: 500,
    constrain:true,
    maximizable: true,
    closeAction: 'hide',
    plain: true,
	items:[wz_treePanel,wz_gridPanel],
	buttons:[{id:'btnSavfe',text:'确定选择' ,handler:confirmChoose},{text:'取消',handler:function(){selectWin.hide()}}]
  });
		
	function confirmChoose(){
		var recArr = collectionToRecords();
		var selectRows = wz_gridPanel.getSelectionModel().getSelected();
		var chooseArr = new Array();
		if(recArr.length >0){
			for(var i=0;i<recArr.length;i++){
				//chooseMatArr.push(recArr[i].data.bm);
				//chooseUidsArr.push(recArr[i].data.uids);
				if(recArr[i].data.sl==0)continue;
				var obj = new Object();
				obj.outId = selectUuid;
				obj.appId = recArr[i].data.bh;
				obj.matId = recArr[i].data.uids;
				obj.catNo = recArr[i].data.bm;
				obj.catName = recArr[i].data.pm;
				obj.spec = recArr[i].data.gg;
				obj.unit = recArr[i].data.dw;
				obj.appNum = '';
				obj.price = recArr[i].data.jhdj;
				obj.money = '';
				obj.outType = '2';
				obj.pid = CURRENTAPPID;
				chooseArr.push(obj);
			}
			matStoreMgm.saveMatStoreOutSub(chooseArr,function(state){
	  			Ext.example.msg('提示！', '选择成功！');
	  			selectWin.hide();
	  			wz_sm.clearSelections();
	  			dsOut.load({params:{start:0,limit:PAGE_SIZE_OUT}});
	  		})
		}else{
			Ext.Msg.alert("提示","请选择物资")
		} 
	}	
});