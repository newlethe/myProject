var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='物资分类'
var temNode;
var f_bmArr = new Array;
var ds,cm,Columns,gridPanel,gridPanel_check,fc,Plant,PlantInt,addBtn,editBtn

var bean = "com.sgepit.pmis.wzgl.hbm.WzBm"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bm'


Ext.onReady(function(){
	
	
//-------------------------物资编码GRID----------------------------------

   fc={
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'bm_state':{
			name:'bm_state',
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
		},'wz_property':{
			name:'wz_property',
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
		}
	};

	Columns = [
		{name:'uids',type:'string'},
		{name:'bm_state',type:'string'},
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
		{name:'wz_property',type:'string'},
		{name:'ge',type:'string'},
		{name:'de',type:'string'},
		{name:'bz',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'bm_state',header:fc['bm_state'].fieldLabel,dataIndex:fc['bm_state'].name,width:50},
    	{id:'stage',header:fc['stage'].fieldLabel,dataIndex:fc['stage'].name,width:50},
    	{id:'bm',header:fc['bm'].fieldLabel,dataIndex:fc['bm'].name,width:50},
    	{id:'pm',header:fc['pm'].fieldLabel,dataIndex:fc['pm'].name,width:50},
    	{id:'gg',header:fc['gg'].fieldLabel,dataIndex:fc['gg'].name,width:50},
    	{id:'dw',header:fc['dw'].fieldLabel,dataIndex:fc['dw'].name,width:50},
    	{id:'jhdj',header:fc['jhdj'].fieldLabel,dataIndex:fc['jhdj'].name,width:50},
    	{id:'sl',header:fc['sl'].fieldLabel,dataIndex:fc['sl'].name,width:50},
    	{id:'jhdj_sl',header:fc['jhdj_sl'].fieldLabel,dataIndex:fc['jhdj_sl'].name,width:50,
    		renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
				return record.data.sl*record.data.jhdj;
			}},
    	{id:'ckh',header:fc['ckh'].fieldLabel,dataIndex:fc['ckh'].name,width:50},
    	{id:'hwh',header:fc['hwh'].fieldLabel,dataIndex:fc['hwh'].name,width:50},
    	{id:'th',header:fc['th'].fieldLabel,dataIndex:fc['th'].name,width:50},
    	{id:'wz_property',header:fc['wz_property'].fieldLabel,dataIndex:fc['wz_property'].name,width:50},
    	{id:'ge',header:fc['ge'].fieldLabel,dataIndex:fc['ge'].name,width:50},
    	{id:'de',header:fc['de'].fieldLabel,dataIndex:fc['de'].name,width:50},
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    Plant = Ext.data.Record.create(Columns);
    PlantInt = {
    	'bm_state':'' ,    'stage':'',    'bm':'',      'pm':'',
    	'gg':'' ,          'dw':'',       'jhdj':'',    'sl':'',
    	'jhdj_sl':'' ,     'ckh':'',      'hwh':'',     'th':'',
    	'wz_property':'',  'ge':'',       'de':'',      'bz':''
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
    
    addBtn = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    editBtn = new Ext.Button({
    	text:'修改',
    	iconCls:'btn',
    	handler:toEditHandler
    })
    
    gridPanel_check  = new Ext.grid.EditorGridTbarPanel({
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
		tbar : ['<font color=#15428b><B>物资编码信息<B></font>','-',addBtn,editBtn],
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
	
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});

	
	

	
    function insertFun(){
    	if(selectedTreeData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边物资分类类型！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
	    	//gridPanel.defaultInsertHandler()
    		var url = BASE_PATH+"Business/wzgl/baseinfo_guoj/wz.baseinfo.wzbm.addorupdate.jsp?flbm="+selectedTreeData+"&&flmc="+selectedTreeData_text;
			window.location.href = url;
    	}
    }
    
    function toEditHandler(){
    	if(gridPanel.getSelectionModel().getSelected()){
    		var record = gridPanel.getSelectionModel().getSelected();
    		var url = BASE_PATH+"Business/wzgl/baseinfo_guoj/wz.baseinfo.wzbm.addorupdate.jsp?flbm="+selectedTreeData+"&&bm="+record.get('bm')+"&&uids="+record.get('uids');
			window.location.href = url;
    	}
    }
  
});