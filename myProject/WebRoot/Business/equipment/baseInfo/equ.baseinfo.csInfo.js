var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='设备专业分类'
var temNode;
var f_bmArr = new Array;
var ds,cm,Columns,gridPanel,gridPanel_jy ;
var sbconCom

var bean = "com.sgepit.pmis.equipment.hbm.SbCsb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'csdm'


Ext.onReady(function(){
	 ///-------获取设备合同分类
    var sbArray = new Array();
    DWREngine.setAsync(false);
    //var sql  ="select sb_mc,sb_mc from equ_list where parentid=(select sb_id from equ_list where parentid='0')";
     //从属性代码中查询设备合同分类
    var sbSql = "select c.property_code,c.property_name from property_code c " +
		"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
		"and c.detail_type like '%SB%'";
    baseMgm.getData(sbSql,function(list){
            for(var i = 0;i<list.length;i++){
                    var temp = new Array();
                    temp.push(list[i][0]);
                    temp.push(list[i][1]);
                    sbArray.push(temp);
            }
    })
    DWREngine.setAsync(true);
     var getSBSt = new Ext.data.SimpleStore({
             fields:['k','v'],
             data:sbArray
     }) 
    sbconCom = new Ext.form.ComboBox({
        name:'wzorsb',
	    fieldLabel:'设备合同分类',
        readOnly : true,
        store:getSBSt,
        valueField: 'k',
        displayField: 'v',
        triggerAction: 'all',
        width:70,
        mode: 'local',
        listeners:{select:function(combo,record,index){
            ds.baseParams.params = "isused = '1' and wzorsb='"+record.data.k +"' and pid='" + CURRENTAPPID + "'";
                    ds.load({
                            params : {
                                    start : 0,
                                    limit : 20
                            }
                    });
        }}
    })
    
    sbconComJY = new Ext.form.ComboBox({
        name:'wzorsb',
	    fieldLabel:'设备合同分类',
        readOnly : true,
        store:getSBSt,
        valueField: 'k',
        displayField: 'v',
        triggerAction: 'all',
        width:70,
        mode: 'local',
        listeners:{select:function(combo,record,index){
            ds_jy.baseParams.params = " isused = '0' and wzorsb='"+record.data.k +"'";
                    ds_jy.load({
                            params : {
                                    start : 0,
                                    limit : 20
                            }
                    });
        }}
    })
    
    //--------------处理专业--------------------------
    var zystore = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('设备专业分类', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					zystore.push(temp);
				}
			})
	DWREngine.setAsync(true);
	var getStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : zystore
			});
			
    //---------------处理评级-------------------------
	var pjArray = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('供货商评级', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					pjArray.push(temp);

				}
			})
	DWREngine.setAsync(true);
    var getPJSt = new Ext.data.SimpleStore({
         fields:['k','v'],
         data:pjArray
     }) 
	// --------------供应商地域Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
   		id : 'SB',
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "sbckTree",
			businessName : "equBaseInfo",
			parent : 'SB',
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
            dataIndex: 'parent'
        }
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = 'SB';
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
		if(node.text=="设备专业分类"){
			uids = "SB";
			bm_ = "SB";
			ds.baseParams.params = " isused = '1'  and pid='" + CURRENTAPPID + "'"
			ds_jy.baseParams.params = " isused='0' " 
		}else{
			ds.baseParams.params = " professional='"+selectedTreeData+"' and isused = '1'  and pid='" + CURRENTAPPID + "'"
			ds_jy.baseParams.params = " professional='"+selectedTreeData+"' and isused='0' "
		}
		ds.load({params:{start:0,limit:PAGE_SIZE}});
		ds_jy.load({params:{start:0,limit:PAGE_SIZE}});
		
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
		},'wzorsb':{
			name:'wzorsb',
			fieldLabel:'设备合同分类',
			allowBlank: false,
			anchor:'95%'
		},'professional':{
		    name:'professional',
			fieldLabel:'专业',
			allowBlank: false,
			anchor:'95%'
		},
		'gb':{
			name:'gb',
			fieldLabel:'国家',
			allowBlank: false,
			anchor:'95%'
		},
		'post':{
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
			fieldLabel:'银行账户',
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
		{name:'wzorsb',type:'string'},
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
		{name:'bz',type:'string'},
		{name:'professional',type:'string'}
	]
	
	sm =  new Ext.grid.CheckboxSelectionModel();
	cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
    	{id:'isused',header:fc['isused'].fieldLabel,dataIndex:fc['isused'].name,width:70,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("0"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'csdm',header:fc['csdm'].fieldLabel,dataIndex:fc['csdm'].name,width:200},
    	{id:'csmc',header:fc['csmc'].fieldLabel,dataIndex:fc['csmc'].name,width:400},
    	{id:'wzorsb',header:fc['wzorsb'].fieldLabel,dataIndex:fc['wzorsb'].name,width:50,hidden : true},
    	{id:'professional',header:fc['professional'].fieldLabel,dataIndex:fc['professional'].name,width:50,renderer : BillStateRender,align: 'center'},
    	{id:'gb',header:fc['gb'].fieldLabel,dataIndex:fc['gb'].name,width:50,hidden:true},
    	{id:'tel',header:fc['tel'].fieldLabel,dataIndex:fc['tel'].name,width:120},
    	{id:'post',header:fc['post'].fieldLabel,dataIndex:fc['post'].name,width:50,hidden:true},
    	{id:'addr',header:fc['addr'].fieldLabel,dataIndex:fc['addr'].name,width:350},
    	{id:'fax',header:fc['fax'].fieldLabel,dataIndex:fc['fax'].name,width:50,hidden:true},
    	{id:'fr',header:fc['fr'].fieldLabel,dataIndex:fc['fr'].name,width:50,hidden:true},
    	{id:'lxr',header:fc['lxr'].fieldLabel,dataIndex:fc['lxr'].name,width:50,hidden:true},
    	{id:'email',header:fc['email'].fieldLabel,dataIndex:fc['email'].name,width:50,hidden:true},
    	{id:'mobil',header:fc['mobil'].fieldLabel,dataIndex:fc['mobil'].name,width:50,hidden:true},
    	{id:'bank',header:fc['bank'].fieldLabel,dataIndex:fc['bank'].name,width:200},
    	{id:'accountNumber',header:fc['accountNumber'].fieldLabel,dataIndex:fc['accountNumber'].name,width:180},
    	{id:'rate',header:fc['rate'].fieldLabel,dataIndex:fc['rate'].name,width:50,renderer : getChinese,align: 'center'},
    	{id:'appra',header:fc['appra'].fieldLabel,dataIndex:fc['appra'].name,width:300},
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
		'bz':'',             'wzorsb':'','professional':'',		'pid': CURRENTAPPID
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
    var delBtn = new Ext.Button({
    	text:'删除',
    	iconCls:'remove',
    	handler:delFun
    })
     var jyBtn = new Ext.Button({
    	text:'禁用',
    	iconCls:'btn',
    	handler:toJyHandler
    })
    gridPanel = new Ext.grid.EditorGridTbarPanel({
    	title:'供应商信息清单',
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
		//tbar : ['<font color=#15428b><B>供应商信息<B></font>','-',jyBtn,'-',addBtn,editBtn,"->",'设备合同分类查询：',sbconCom],
		tbar : ['<font color=#15428b><B>供应商信息<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
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
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	
	ds.baseParams.params = "  isused = '1'  and pid='" + CURRENTAPPID + "'";
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
	//-------------------------(禁用)供应商GRID----------------------------------
	sm_jy =  new Ext.grid.CheckboxSelectionModel();
	cm_jy = new Ext.grid.ColumnModel([		// 创建列模型
    	sm_jy,
    	{id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
    	{id:'isused',header:fc['isused'].fieldLabel,dataIndex:fc['isused'].name,width:70,
    		renderer:function(value){
    			if("1"==value){
    				return "启用";
    			}else if("0"==value){
    				return "禁用";
    			}
    		}
    	},
    	{id:'csdm',header:fc['csdm'].fieldLabel,dataIndex:fc['csdm'].name,width:200},
    	{id:'csmc',header:fc['csmc'].fieldLabel,dataIndex:fc['csmc'].name,width:400},
    	{id:'wzorsb',header:fc['wzorsb'].fieldLabel,dataIndex:fc['wzorsb'].name,width:50,hidden : true},
    	{id:'professional',header:fc['professional'].fieldLabel,dataIndex:fc['professional'].name,width:50,renderer : BillStateRender,align: 'center'},
    	{id:'gb',header:fc['gb'].fieldLabel,dataIndex:fc['gb'].name,width:50,hidden:true},
    	{id:'tel',header:fc['tel'].fieldLabel,dataIndex:fc['tel'].name,width:120},
    	{id:'post',header:fc['post'].fieldLabel,dataIndex:fc['post'].name,width:50,hidden:true},
    	{id:'addr',header:fc['addr'].fieldLabel,dataIndex:fc['addr'].name,width:350},
    	{id:'fax',header:fc['fax'].fieldLabel,dataIndex:fc['fax'].name,width:50,hidden:true},
    	{id:'fr',header:fc['fr'].fieldLabel,dataIndex:fc['fr'].name,width:50,hidden:true},
    	{id:'lxr',header:fc['lxr'].fieldLabel,dataIndex:fc['lxr'].name,width:50,hidden:true},
    	{id:'email',header:fc['email'].fieldLabel,dataIndex:fc['email'].name,width:50,hidden:true},
    	{id:'mobil',header:fc['mobil'].fieldLabel,dataIndex:fc['mobil'].name,width:50,hidden:true},
    	{id:'bank',header:fc['bank'].fieldLabel,dataIndex:fc['bank'].name,width:200},
    	{id:'accountNumber',header:fc['accountNumber'].fieldLabel,dataIndex:fc['accountNumber'].name,width:180},
    	{id:'rate',header:fc['rate'].fieldLabel,dataIndex:fc['rate'].name,width:50,renderer : getChinese,align: 'center'},
    	{id:'appra',header:fc['appra'].fieldLabel,dataIndex:fc['appra'].name,width:300},
    	{id:'taxNumber',header:fc['taxNumber'].fieldLabel,dataIndex:fc['taxNumber'].name,width:50,hidden:true},
    	{id:'flbm',header:fc['flbm'].fieldLabel,dataIndex:fc['flbm'].name,width:50,hidden:true},
    	{id:'bz',header:fc['bz'].fieldLabel,dataIndex:fc['bz'].name,width:50,hidden:true}
    	])
	
    sm_jy.defaultSortable = true;						//设置是否可排序
    var Plant_jy = Ext.data.Record.create(Columns);
    var PlantInt_jy = {
    	'isused':'' ,       'csdm':'',           'csmc':'',        'gb':'',
    	'tel':'' ,          'post':'',           'addr':'',        'fax':'',
    	'fr':'' ,           'lxr':'',            'email':'',        'mobil':'',
    	'bank':'',          'accountNumber':'',  'taxNumber':'',    'flbm':'' ,
		'bz':'',            'wzorsb':'','professional':''
	}
    ds_jy = new Ext.data.Store({
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
    
    ds_jy.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
    
    var addBtn_jy = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler:insertFun
    })
    var editBtn_jy = new Ext.Button({
    	text:'修改',
    	iconCls:'btn',
    	handler:toEditHandler_jy
    })
    var delBtn_jy = new Ext.Button({
    	text:'删除',
    	iconCls:'remove',
    	handler:delFun_jy
    })
    var qyBtn = new Ext.Button({
    	text:'启用',
    	iconCls:'btn',
    	handler:toQyHandler
    })    
   gridPanel_jy = new Ext.grid.EditorGridTbarPanel({
    	title:'禁用供应商信息清单',
		ds : ds_jy,
		cm : cm_jy,
		sm : sm_jy,
		border : false,
		clicksToEdit : 2,
		header : false,
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		autoScroll : true, // 自动出现滚动条
		//tbar : ['<font color=#15428b><B>禁用供应商信息<B></font>','-',jyBtn,'-',addBtn_jy,editBtn_jy,"->","设备合同分类查询：",sbconComJY],
		tbar : ['<font color=#15428b><B>禁用供应商信息<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_jy,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_jy,
		plantInt : PlantInt_jy,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds_jy.baseParams.params = "  isused = '0' "
	ds_jy.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
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
        items:[gridPanel,gridPanel_jy]
    });	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,tabs]
    });	
    
    if (ModuleLVL < 3){
		gridPanel_jy.getTopToolbar().add(addBtn_jy,'-',editBtn_jy,'-',delBtn_jy,'-',qyBtn);
        gridPanel.getTopToolbar().add(addBtn,'-',editBtn,'-',delBtn,'-',jyBtn);
	}	
    
    function insertFun(){
    	if(selectedTreeData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边设备专业分类类型！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		var url = BASE_PATH+"Business/equipment/baseInfo/equ.baseinfo.csInfo.addorupdate.jsp?flbm="+selectedTreeData+"&&flmc="+selectedTreeData_text;
			window.location.href = url;
    	}
    }
    
    function toEditHandler(){
        var record = gridPanel.getSelectionModel().getSelected();
    	if(record){
    		var url = BASE_PATH+"Business/equipment/baseInfo/equ.baseinfo.csInfo.addorupdate.jsp?flbm="+selectedTreeData+"&&bm="+record.get('bm')+"&&uids="+record.get('uids');
			window.location.href = url;
    	}
    }
    function toEditHandler_jy(){
        var record = gridPanel_jy.getSelectionModel().getSelected();
    	if(record){
    		var url = BASE_PATH+"Business/equipment/baseInfo/equ.baseinfo.csInfo.addorupdate.jsp?flbm="+selectedTreeData+"&&bm="+record.get('bm')+"&&uids="+record.get('uids');
			window.location.href = url;
    	}
    }
    function delFun(){
    	var name="";
    	var index = 0;
    	var recored = gridPanel.getSelectionModel().getSelections();
    	for (var i = 0; i < recored.length; i++) {
			var getUids =  recored[i].get("uids");
			var pid =  recored[i].get("pid");
			var whereSql =  "select  t.csmc from sb_csb t where  t.uids  " +
						    "in (select csno from equ_goods_arrival  where pid='"+pid+"' ) " +
						    "and t.uids='"+getUids+"' and pid='"+pid+"'";
			DWREngine.setAsync(false);
            baseMgm.getData(whereSql,function(list){
                  if(list.length > 0){
                  	  index++;
                      name +="【"+list +"】<br>";
                  }
             })
			DWREngine.setAsync(true);
		}
    	if(index>0){
    	    Ext.Msg .alert("信息提示","供货商正在使用中，不能删除，供货商名称为：<font style='color:red;'><br>"+name+"</font>");
    	}else{
    	    gridPanel.defaultDeleteHandler();
    	}
    }
    function delFun_jy(){
    	var name="";
    	var index = 0;
    	var recored = gridPanel_jy.getSelectionModel().getSelections();
    	for (var i = 0; i < recored.length; i++) {
			var getUids =  recored[i].get("uids");
			var pid =  recored[i].get("pid");
			var whereSql =  "select  t.csmc from sb_csb t where  t.uids  " +
						    "in (select csno from equ_goods_arrival  where pid='"+pid+"' ) " +
						    "and t.uids='"+getUids+"' and pid='"+pid+"'";
			DWREngine.setAsync(false);
            baseMgm.getData(whereSql,function(list){
                  if(list.length > 0){
                  	  index++;
                      name +="【"+list +"】<br>";
                  }
             })
			DWREngine.setAsync(true);
		}
    	if(index>0){
    	    Ext.Msg .alert("信息提示","供货商正在使用中，不能删除，供货商名称为：<font style='color:red;'><br>"+name+"</font>");
    	}else{
    	   gridPanel_jy.defaultDeleteHandler();
    	}
    	
    }
    
    function toQyHandler(){//启用
    	var selectRows_qy = gridPanel_jy.getSelectionModel().getSelections();
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
    }
    function toQy(){
    	var selectRows_qy = gridPanel_jy.getSelectionModel().getSelections();
		var uidsStr_qy='';
    	for(var i=0;i<selectRows_qy.length;i++){
			uidsStr_qy+=selectRows_qy[i].get('uids')+",";
    	}
    	DWREngine.setAsync(false);
		equBaseInfo.updateEquCsStateChange(uidsStr_qy,"1",function(state){
			if(state){
				Ext.example.msg('提示！', '状态修改成功！');
				ds.reload();
				ds_jy.reload();
			}
		})
		DWREngine.setAsync(true);    	
    	
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
    		equBaseInfo.updateEquCsStateChange(uidsStr,"0",function(state){
    			if(state){
    				Ext.example.msg('提示！', '状态修改成功！');
    				ds.reload();
    				ds_jy.reload();
    			}
    		})
    		DWREngine.setAsync(true);
	  	}    	
    }
   //转换文件与字符
	function BillStateRender(value) {
		for (var i = 0; i < getStore.getCount(); i++) {
			if (getStore.getAt(i).get('k') == value) {
				return getStore.getAt(i).get('v')
			}
		}
	} 
    
function getChinese(value){
	  for(var i=0;i<getPJSt.getCount();i++){
	      if(getPJSt.getAt(i).get('k')==value){
	       return getPJSt.getAt(i).get('v')
	      }
	  }
}
});