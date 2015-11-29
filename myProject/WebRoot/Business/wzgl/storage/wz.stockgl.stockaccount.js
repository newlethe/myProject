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

var bean_account = "com.sgepit.pmis.wzgl.hbm.ViewWzAccount"
var business_account = "baseMgm"
var listMethod_account = "findwhereorderby"
var primaryKey_account = 'bm'
var orderColumn_account = 'bm'
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
		//-----------------部门（bmbz：sgcc_ini_unit==unitname)
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
			pid: CURRENTAPPID,
			parent : 0
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
		loader : treeLoader,
		root : root
	});
	treePanel.getRootNode().expand();
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
	})	
	
	treePanel.on('click',onClick);
	
	
	function onClick(node,e){
		tmpNode=node
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
//			ds_check.baseParams.params = " flbm like'"+node.getUI().elNode.all('bm').innerText+"%' and bm_state='-1' and "+pidWhereString+" "
//			ds_check.load({
//				params : {
//					start : 0,
//					limit : PAGE_SIZE
//				}
//			});
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
		{name:'jhdj',type:'string'},
		{name:'sl',type:'string'},
		{name:'jhdj_sl',type:'string'},
		{name:'ckh',type:'string'},
		{name:'hwh',type:'string'},
		{name:'th',type:'string'},
		{name:'wzProperty',type:'string'},
		{name:'ge',type:'string'},
		{name:'de',type:'string'},
		{name:'bz',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
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
    	{id:'bm',header:fc['bm'].fieldLabel,type:'string',dataIndex:fc['bm'].name,width:50},
    	{id:'pm',header:fc['pm'].fieldLabel,type:'string',dataIndex:fc['pm'].name,width:50},
    	{id:'gg',header:fc['gg'].fieldLabel,type:'string',dataIndex:fc['gg'].name,width:50},
    	{id:'dw',header:fc['dw'].fieldLabel,type:'string',dataIndex:fc['dw'].name,width:50},
    	{id:'jhdj',header:fc['jhdj'].fieldLabel,dataIndex:fc['jhdj'].name,width:50},
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
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50}
    	])
	
    cm.defaultSortable = true;						//设置是否可排序
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	'bmState':'' ,    'stage':'',    'bm':'',      'pm':'',
    	'gg':'' ,          'dw':'',       'jhdj':'',    'sl':'',
    	'jhdj_sl':'' ,     'ckh':'',      'hwh':'',     'th':'',
    	'wzProperty':'',  'ge':'',       'de':'',      'bz':''
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
		delBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资编码信息<B></font>','-',{
					id: 'query',
					text: '查询',
					tooltip: '查询',
					iconCls: 'option',
					handler: showWindow_
				}],
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
	ds.baseParams.params = "  bm_state = '1' AND pid='" + CURRENTAPPID + "'"
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	 function showWindow_(){showWindow(gridPanel)};
//-------------------------台帐GRID----------------------------------	
	
	var fc_account={
		'bm':{name:'bm',fieldLabel:'编码',anchor:'95%'},
		'dw':{name:'dw',fieldLabel:'计量单位',anchor:'95%'},
		'qrrq':{name:'qrrq',fieldLabel:'确认日期',anchor:'95%',format: 'Y-m-d', minValue: '2000-01-01'},
		'billname':{name:'billname',fieldLabel:'单据名称',anchor:'95%'},
		'sl':{name:'sl',fieldLabel:'实收数量',anchor:'95%'},
		'jhdj':{name:'jhdj',fieldLabel:'计划单价',anchor:'95%'},
		'jhzj':{name:'jhzj',fieldLabel:'计划总价',anchor:'95%'},
		'sqbm':{name:'sqbm',fieldLabel:'申请部门',anchor:'95%'},
		'bgr':{name:'bgr',fieldLabel:'保管员',anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'单据编号',anchor:'95%'},
		'zdrq':{name:'zdrq',fieldLabel:'制单日期',anchor:'95%',format: 'Y-m-d', minValue: '2000-01-01'},
		'jcsl':{name:'jcsl',fieldLabel:'结存数量',anchor:'95%'},
		'jczj':{name:'jczj',fieldLabel:'结存金额',anchor:'95%'},
		'billtype':{name:'billtype',fieldLabel:'出库状态',anchor:'95%'},
		'stocks':{name:'stocks',fieldLabel:'确认前的库存数量',anchor:'95%'},
		'billState':{name:'billState',fieldLabel:'状态',anchor:'95%'}
	};

	Columns_account = [
		{name:'bm',type:'string'},{name:'dw',type:'string'},
		{name:'qrrq',type:'date',dateFormat:'Y-m-d H:i:s'},{name:'billname',type:'string'},
		{name:'sl',type:'float'},{name:'jhdj',type:'float'},
		{name:'jhzj',type:'float'},{name:'sqbm',type:'string'},
		{name:'bgr',type:'string'},{name:'bh',type:'string'},
		{name:'zdrq',type:'date',dateFormat:'Y-m-d H:i:s'},{name:'jcsl',type:'string'},
		{name:'jczj',type:'string'},{name:'billtype',type:'string'},
		{name:'stocks',type:'float'},{name:'billState',type:'string'}
		
	]
	var sm_check =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm_check= new Ext.grid.ColumnModel([		// 创建列模型
    	sm_check,
    	{id:'bm',header:fc_account['bm'].fieldLabel,dataIndex:fc_account['bm'].name,width:50,hidden:true},
    	{id:'qrrq',header:fc_account['qrrq'].fieldLabel,dataIndex:fc_account['qrrq'].name,renderer: formatDate},
    	{id:'billname',header:fc_account['billname'].fieldLabel,dataIndex:fc_account['billname'].name},
    	{id:'dw',header:fc_account['dw'].fieldLabel,dataIndex:fc_account['dw'].name},
    	{id:'sl',header:fc_account['sl'].fieldLabel,dataIndex:fc_account['sl'].name},
    	{id:'jhdj',header:fc_account['jhdj'].fieldLabel,dataIndex:fc_account['jhdj'].name},
    	{id:'jhzj',header:fc_account['jhzj'].fieldLabel,dataIndex:fc_account['jhzj'].name},
    	{id:'jcsl',header:fc_account['jcsl'].fieldLabel,dataIndex:fc_account['jcsl'].name},
    	{id:'jczj',header:fc_account['jczj'].fieldLabel,dataIndex:fc_account['jczj'].name},
    	{id:'sqbm',header:fc_account['sqbm'].fieldLabel,dataIndex:fc_account['sqbm'].name,
    		renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}
    	},
    	{id:'bgr',header:fc_account['bgr'].fieldLabel,dataIndex:fc_account['bgr'].name,hidden:true},
    	{id:'bh',header:fc_account['bh'].fieldLabel,dataIndex:fc_account['bh'].name},
    	{id:'zdrq',header:fc_account['zdrq'].fieldLabel,dataIndex:fc_account['zdrq'].name,renderer: formatDate},
    	{id:'billtype',header:fc_account['billtype'].fieldLabel,dataIndex:fc_account['billtype'].name,hidden:true},
    	{id:'stocks',header:fc_account['stocks'].fieldLabel,dataIndex:fc_account['stocks'].name,hidden:true},
    	{id:'billState',header:fc_account['billState'].fieldLabel,dataIndex:fc_account['billState'].name,hidden:true}
    	])
	
    cm_check.defaultSortable = true;						//设置是否可排序
    var Plant_check = Ext.data.Record.create(Columns_account);
    var PlantInt_check = {
    	 bm:'',dw:'', qrrq:'', billname:'',sl:'',
		 jhdj:'',jhzj:'',sqbm:'',bgr:'',
		 bh:'',zdrq:'',jcsl:'',jczj:'',
		 billtype:'',stocks:'',billState:''
	}
    ds_check = new Ext.data.Store({
    	baseParams : {
			ac : 'list', // 表示取列表
			bean : bean_account,
			business : business_account,
			method : listMethod_account,
			params : "  bm ='' AND pid='" + CURRENTAPPID + "'"
		},// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey_account
		}, Columns_account),
		// 设置是否可以服务器端排序
		remoteSort : true,
		pruneModifiedRecords : true
    })
    
    ds_check.setDefaultSort(orderColumn_account, 'desc'); // 设置默认排序列
    
    
  var printBtn = new Ext.Button({
    	text:'打印物料台帐',
    	iconCls : 'btn',
    	handler:printlnAccount
    })
    gridPanel_check = new Ext.grid.EditorGridTbarPanel({
    	title:'台帐',
		ds : ds_check,
		cm : cm_check,
		sm : sm_check,
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>台帐信息<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		tbar:[printBtn],
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
		bean : bean_account,
		business : business_account,
		primaryKey : primaryKey_account
	});	

    var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 155,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'center',
        forceFit: true,
        items:[gridPanel]//,gridPanel_check
    });
    
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,tabs]
    });	
    
    //---------------------------关联---------
    sm.on('rowselect',function(sm,rowIndex,record){
    	var bm = record.get('bm');
    	ds_check.baseParams.params = " bm='"+bm+"'  AND pid='" + CURRENTAPPID + "'";
    	ds_check.load({params:{start:0,limit:PAGE_SIZE}});
    })
    
    function printlnAccount(){
	    with(document.all.dbnetcell0) {
	    	var record = gridPanel_check.getSelectionModel().getSelected();
			if(!record) return;
			code = 'WZBILL'
			report_no = '0511'
			lsh = ''
			readOnly = true
			reportArgs = new Object()
			onReportOpened = "reportOpened2"
	}
	
	function reportOpened2(CellWeb){
		var record = gridPanel_check.getSelectionModel().getSelected();
		
		if(record) {
			//var code = document.all.dbnetgrid2.currentRow.id
			var code = record.get('bm')
			var str1 = "select wz_input.qrrq,wz_input.bh,wz_input.billname,wz_input.sl sl1,wz_input.sjdj dj1,wz_input.sjzj zj1,null sl2,null dj2,null zj2,wz_input.jssl,wz_input.jsje,unit_info.dwmc dwmc from wz_input,unit_info where wz_input.ghdw=unit_info.dwbm and wz_input.code='"+code+"' and (wz_input.BILL_STATE='S' or wz_input.BILL_STATE='Y')"
			var str2 = "select wz_output.qrrq,wz_output.bh||'-'||wz_inout.bh bh,wz_output.billname,null sl1,null dj1,null zj1,wz_inout.sl sl2,wz_inout.dj dj2,wz_inout.zj zj2,wz_output.jssl,wz_output.jsje,group_list.notes dwmc from wz_output,wz_inout,group_list where wz_output.bh=wz_inout.outbh and wz_output.billname=wz_inout.outname and wz_output.sqbm=group_list.groupid(+) and wz_output.code='"+code+"' and (wz_output.BILL_STATE='S' or wz_output.BILL_STATE='Y') "
			var sqlStr = "select * from ("+str1+" union "+str2+") order by QRRQ"
			var dat1 = document.all.dbnetgrid2.selectData(sqlStr,null,true)
			var dat2 = document.all.dbnetgrid2.selectData("select wz_bm.bm,wz_bm.pm,wz_bm.gg,wz_bm.dw,wz_bm.ge,wz_bm.de,wz_ckh.ckmc from wz_bm,wz_ckh where wz_bm.ckh=wz_ckh.ckh and wz_bm.code='"+code+"'")
			with(CellWeb) {
				EnableUndo(0)
				//S( 2,2,0,sqlStr)
				S( 3, 3, 0, dat2.ckmc)
				S( 7, 3, 0, dat2.pm)
				S( 11, 3, 0, "  " + dat2.gg)
				S( 3, 4, 0, dat2.bm)
				S( 7, 4, 0, dat2.dw)
				S( 10, 4, 0, dat2.ge)
				S( 13, 4, 0, dat2.ge)
				InsertRow(8, dat1.length-1, 0)
				for(var i in dat1) {
					var r = i-0+7
					S( 2, r, 0, dat1[i].qrrq)
					S( 3, r, 0, dat1[i].billname)
					S( 4, r, 0, dat1[i].bh)
					
					if(dat1[i].sl1!="") D( 5, r, 0, dat1[i].sl1)
					if(dat1[i].dj1!="") D( 6, r, 0, dat1[i].dj1)
					if(dat1[i].zj1!="") D( 7, r, 0, dat1[i].zj1)
					
					if(dat1[i].sl2!="") D( 8, r, 0, dat1[i].sl2)
					if(dat1[i].dj2!="") D( 9, r, 0, dat1[i].dj2)
					if(dat1[i].zj2!="") D( 10, r, 0, dat1[i].zj2)
					
					if(dat1[i].jssl!="") D( 11, r, 0, dat1[i].jssl)
					if(dat1[i].jsje!="") D( 12, r, 0, dat1[i].jsje)
					
					S( 13, r, 0, dat1[i].dwmc)
					
					height = GetRowBestHeight(r) - 0 + 6
					SetRowHeight( 1, height, r, 0)
				}
			}
		}
	}
	var lsh = document.all.dbnetcell0.open()
    }
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
});