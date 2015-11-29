var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.document.hbm.DaZl"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "daid"
var orderColumn = "bjhd"
var gridPanelTitle ="案卷列表"
var pageSize = PAGE_SIZE;
var databzdw=new Array();
var datazy=new Array();
var damj=new Array();
var fs_Array = new Array();
var unit_Array = new Array();
var user_Array = new Array();
var treePanel
var data;
var win;
var viewport;
var formWindow;
var partBs = new Array();
var bjhdStr = new Array();
var uploadWin
var formPanel
var propertyName = "indexid";
var selectedTreeData = "";
var rootText = "档案分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var dazjWin;
var operate;
var bb=true;
var ss=true;
var currentPid = CURRENTAPPID;
var treePath ;
var strs = "";
var ds_pid="pid='"+currentPid+"' and ";
Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		id :'0',
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		expanded :true,
		baseParams : {
			ac : "columntree",
			treeName : "daTree",
			businessName : "zldaMgm",
			pid:currentPid,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'da-tree-panel',
		region : 'west',
		split : true,
		width : 260,
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
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '档案名称',
			width : 400,
			dataIndex : 'mc'
		}, {
			id: 'treeid',
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }],
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;

		})

		// 获取借阅的份数
	DWREngine.setAsync(false);
	baseMgm.getData('select infoid,sum(fs)fs from da_zl_jy group by infoid',
			function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					fs_Array.push(temp);
				}
			});
	DWREngine.setAsync(true);
	var btnReturn = new Ext.Button({
		text : '返回',
		tooltip : '返回',
		iconCls : 'returnTo',
		handler : function() {
			history.back();
		}
	});
	////////////////////////////////////////////////////////////////
	function QueryDaWinwdow() {
		if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
				width : 460,
				height : 460,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryDAPanel]
			});
		}
		QueryDAPanel.getForm().reset();
		formWin.show();
	}
	// /////////////////////////////////////////////////////////////////////////
	DWREngine.setAsync(false);
	appMgm.getCodeValue('立卷单位',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			databzdw.push(temp);			
		}
    });
    appMgm.getCodeValue('档案密级',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			damj.push(temp);			
		}
    });
    appMgm.getCodeValue('专业',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			datazy.push(temp);			
		}
    });
    //获取单位
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit start with unitid= '10309' connect by prior unitid=upunit order by unit_type_id asc",
		function(list) {
			for (i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				unit_Array.push(temp);
			}
		});
	DWREngine.setAsync(true);
	var damjStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : damj
    });
	 var bzdwStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : databzdw
    });
    var zyStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : datazy
    });
	var unitSt = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : unit_Array
			});
    var jyrSt = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['', '']]
			});		
	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'daid' : {
			name : 'daid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'mc' : {
			id : 'mc',
			name : 'mc',
			fieldLabel : '案卷题名',
			//height: 80,
			width: 600,
			//xtype: 'htmleditor',
			anchor:'95%'
		},
		'dagh' : {
			name : 'dagh',
			fieldLabel : '档案馆号',
			anchor : '95%'
		},
		'bzdw' : {
			name : 'bzdw',
			fieldLabel : '立卷单位',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选立卷单位...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: bzdwStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor:'95%'
		},
		'bgqx' : {
			name : 'bgqx',
			fieldLabel : '保管期限',
			anchor : '95%'
		},
		'mj' : {
			name : 'mj',
			fieldLabel : '密级',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选密级...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: damjStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'bzrq' : {
			name : 'bzrq',
			fieldLabel : '起止日期',
			//readOnly : true,
			anchor : '95%'
		},
		
		'flmc' : {
			name : 'flmc',
			fieldLabel : '分类名称',
			anchor : '95%'
		},
		'bfjs':{
			name : 'bfjs',
			fieldLabel : '件数',
			anchor : '95%'
		},
		'bz' :{
			name : 'bz',
			fieldLabel : '备注',
			height: 120,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		},
		'ljr':{
			name : 'ljr',
			fieldLabel : '立卷人',
			anchor : '95%'
		},
		'ljrq' : {
			name : 'ljrq',
			fieldLabel : '立卷日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},'gdrq' : {
			name : 'gdrq',
			fieldLabel : '归档日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'dh':{
			id : 'dh',
			name : 'dh',
			fieldLabel : '档号',
			anchor : '95%'
		},
		'zy':{
			name : 'zy',
			fieldLabel : '专业',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选专业...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: zyStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            //allowBlank: false,
			anchor : '95%'
		},
		'wbxs':{
			name : 'wbxs',
			fieldLabel : '文本形式',
			anchor : '95%'
		},
		'jcjsh':{
			name : 'jcjsh',
			fieldLabel : '卷册检索号',
			anchor : '95%'
		},
		'zys':{
			name : 'zys',
			fieldLabel : '总页数',
			disabled:true,
			readOnly : true,
			anchor : '95%'
		},'kcfs':{
			name : 'kcfs',
			fieldLabel : '总份数',
			anchor : '95%'
		}, 'yjfs': {
			name : 'yjfs',
			fieldLabel : '已借份数',
			anchor : '95%'		
		}, 'syfs':{
			name : 'syfs',
			fieldLabel : '剩余份数',
			anchor : '95%'			
		}
		
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, // 第0列，checkbox,行选择器
			new Ext.grid.RowNumberer({
			header : '序号',
			 width : 38
			 }),// 计算行数
			{
				id : 'daid',
				header : fc['daid'].fieldLabel,
				dataIndex : fc['daid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'dh',
				header : fc['dh'].fieldLabel,
				dataIndex : fc['dh'].name,
				width : 200
			},
			{
				id : 'mc',
				header : fc['mc'].fieldLabel,
				dataIndex : fc['mc'].name,
				width : 300
			},
			{
				id : 'kcfs',
				header : fc['kcfs'].fieldLabel,
				dataIndex : fc['kcfs'].name,
				width : 80
			}, {
			    id : 'yjfs',
				header : fc['yjfs'].fieldLabel,
				dataIndex : fc['yjfs'].name,
				width : 80,
				renderer : function(value,s,r){
					var str = '0';
					for (var i = 0; i < fs_Array.length; i++) {
						if (fs_Array[i][0] == r.get('daid')) {
							str = fs_Array[i][1]
							break;
						}
					}
					return str;
				}
			},{
			    id : 'syfs',
				header : fc['syfs'].fieldLabel,
				dataIndex : fc['syfs'].name,
				width : 80,
				renderer : function(value,s,r){
					var str = r.get("kcfs");
					for (var i = 0; i < fs_Array.length; i++) {
						if (fs_Array[i][0] == r.get('daid')) {
							str = r.get("kcfs")-fs_Array[i][1];
							if(str == 0){
							  str = 0;
							}
							break;
						}
					}
					return str //== 0?r.get("kcfs"):str;
				}
			}, {
				id :'zys',
				header : fc['zys'].fieldLabel,
				dataIndex : fc['zys'].name,
				width : 80
			}, {
				id : 'jcjsh',
				header : fc['jcjsh'].fieldLabel,
				dataIndex : fc['jcjsh'].name,
				width : 200
			},
			{
				id : 'bzrq',
				header : fc['bzrq'].fieldLabel,
				dataIndex : fc['bzrq'].name,
				width : 150
			}, {
				id : 'bzdw',
				header : fc['bzdw'].fieldLabel,
				dataIndex : fc['bzdw'].name,
				width : 200,
				renderer : partbRender
			}, {
				id : 'gdrq',
				header : fc['gdrq'].fieldLabel,
				dataIndex : fc['gdrq'].name,
				width : 150,
				renderer : formatDate			
			},
			{
				id : 'bgqx',
				header : fc['bgqx'].fieldLabel,
				dataIndex : fc['bgqx'].name,
				align : 'center',
				width : 80,
				renderer : function(Value) {
					if (Value == 1) {
						return '短期'
					}
					if (Value == 2) {
						return '长期'
					}
					if (Value == 3) {
						return '永久'
					}
				}
			}, {
				id : 'mj',
				header : fc['mj'].fieldLabel,
				dataIndex : fc['mj'].name,
				width : 50,
				renderer :mjRender
			}, 
			{
				id : 'zy',
				header : fc['zy'].fieldLabel,
				dataIndex : fc['zy'].name,
				width : 50,
				renderer :partzyRender
			},
			{
				id : 'wbxs',
				header : fc['wbxs'].fieldLabel,
				dataIndex : fc['wbxs'].name,
				align : 'center',
				width : 80,
				renderer: function(Value){
					if (Value == 1) {
						return '正本'
					}
					if (Value == 2) {
						return '副本'
					}
				}
			},
			{
				id : 'bfjs',
				header : fc['bfjs'].fieldLabel,
				dataIndex : fc['bfjs'].name,
				width : 50
			},
			{
				id : 'ljr',
				header : fc['ljr'].fieldLabel,
				dataIndex : fc['ljr'].name,
				align : 'center',
				width : 100
			}, {
				id : 'ljrq',
				header : fc['ljrq'].fieldLabel,
				dataIndex : fc['ljrq'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true
			}, {
				id : 'bz',
				header : fc['bz'].fieldLabel,
				dataIndex : fc['bz'].name
			}
			
	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
		name : 'daid',
		type : 'string'
	}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'indexid',
				type : 'string'
			}, {
				name : 'mc',
				type : 'string'
			}, {
				name : 'dagh',
				type : 'string'
			}, {
				name : 'bzdw',
				type : 'string'
			}, {
				name : 'bgqx',
				type : 'string'
			}, {
				name : 'mj',
				type : 'string'
			}, {
				name : 'bzrq',
				type : 'string'
			}, {
				name : 'flmc',
				type : 'string'
			},{
				name : 'bz',
				type : 'string'
			},{
				name : 'ljr',
				type : 'string'
			},{
				name : 'gdrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'			
			},{
				name : 'ljrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'dh',
				type : 'string'
			},
			{
				name : 'zy',
				type : 'string'
			},
			{
				name : 'wbxs',
				type : 'float'
			},
			{
				name : 'jcjsh',
				type : 'string'
			},{
				name : 'zys',
				type : 'string'
			},{
			    name : 'kcfs',
			    type : 'float'
			},{
			    name : 'syfs',
			    type : 'float'
			}, {
			    name : 'yjfs',
			    type : 'float'
			}, {
			    name : 'bfjs',
			    type : 'float'
			}
			];
	var Fields = Columns.concat([ // 表单增加的列
	      
			])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		ljr:username,
		mc: '',
		jcrq:new Date,
		zys :0,
		kcfs :0
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		jcrq: new Date
	});

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
//			pid:currentPid,
			params :ds_pid+" indexid like '%"+selectedTreeData+"%'  "
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : ServletUrl
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
	// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
	});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列
	
	var selectJy = new Ext.Button({
				id : 'selectJy',
				text : '借阅',
				tooltip : '借阅',
				iconCls : 'btn',
				handler : selectJy
			});
	var queryBtn = new Ext.Button({
				id : 'query',
				text : '查询',
				tooltip : '查询',
				iconCls : 'btn',
				handler : QueryWinwdow
			});
    
	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
				// basic properties
				id : 'grid-panel', // id,可选
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm, // 行选择模式
				bbar : [], // 顶部工具栏，可选
				title : gridPanelTitle, // 面板标题
				border : false, // 
				region : 'center',
				header : true, //
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					// forceFit : true,
					ignoreAdd : true
				},
				tbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),

				// expend properties
				plant : Plant, // 初始化记录集，必须
				plantInt : PlantInt, // 初始化记录集配置，必须
				servletUrl : ServletUrl, // 服务器地址，必须
				bean : bean, // bean名称，必须
				business : "zlMgm", // business名称，可选
				primaryKey : primaryKey, // 主键列名称，必须
				insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
				saveMethod : 'saveDeptInfo',
				saveBtn : false,
				addBtn : false,
				delBtn : false
			});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			params : ds_pid+" indexid like '%"+selectedTreeData+"%'  "
		}
	});

	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid]
	});

	viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});

	// /////////////////////////////////////////////////////
	root.select();
   	grid.showHideTopToolbarItems("save", false);
   	grid.showHideTopToolbarItems("refresh", false);
	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		add('-', selectJy, '-', queryBtn);
	}
	function selectJy() {
		var selectRow = grid.getSelectionModel().getSelected();
		if (!selectRow) {
			Ext.MessageBox.alert('提示', '请选择要借的资料!');
			return
		}
		var sumFs = selectRow.get('kcfs');// 当前资料总份数
		if(sumFs == 0){
		    Ext.example.msg('系统提示！', '该案卷没有资料！');
			return;
		}
		var currentInfoid = selectRow.get('daid');// 当前资料主键
		var jyfs = 0;// 借阅份数份数
		var syfs = 0;// 剩余份数
		for (var i = 0; i < fs_Array.length; i++) {
			if (currentInfoid == fs_Array[i][0]) {
				jyfs = fs_Array[i][1];
				syfs = sumFs - jyfs;
			}
		}
		if (jyfs == "") {
			jyfs = 0;
			syfs = sumFs - jyfs;
		}
		if (syfs == 0) {
			Ext.combine
			return;
		} else {
			insertJyFun(currentInfoid, sumFs, jyfs, syfs);
		}
	}
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					
				} else {
//					tb.items.get("dazl").disable();
//					tb.items.get("update").disable();
				}
				if (formWindow != null && !formWindow.hidden) {
					
				}
			});
	treePanel.render();
	treePanel.expand();
	treePanel.on('click', function(node) {
		tmp_parent = null;
		treePath = node.getPath();
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("treeid").innerText;
		selectedBM = elNode.all("bm").innerText;
		PlantInt.indexid = elNode.all("indexid").innerText;
		var titles = [node.text];
		var obj = node.parentNode;
		var isRoot = (rootText == node.text);
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		tmp_parent = menu_isLeaf;

		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		if (selectedTreeData == null) {
			selectedTreeData = "";
		}
		
		ds.baseParams.params = ds_pid+"indexid  in "+ getStr(selectedTreeData)
					
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});	

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	
	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
	
   function partbRender(value) {
		var str = '';
		for (var i = 0; i < databzdw.length; i++) {
			if (databzdw[i][0] == value) {
				str = databzdw[i][1]
				break;
			}
		}
		return str;
	};
	
   function partzyRender(value) {
		var str = '';
		for (var i = 0; i < datazy.length; i++) {
			if (datazy[i][0] == value) {
				str = datazy[i][1]
				break;
			}
		}
		return str;
	};
	
	function mjRender(value) {
		var str = '';
		for (var i = 0; i < damj.length; i++) {
			if (damj[i][0] == value) {
				str = damj[i][1]
				break;
			}
		}
		return str;
	}
	
		// ///////////////////////////-------------新增借阅------------------------------//////////////////////
	var fc_insert = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'infoid' : {
			name : 'infoid',
			fieldLabel : '资料信息表主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'jyr' : {
			name : 'jyr',
			fieldLabel : '借阅人',
			anchor : '95%'
		},
		'deptid' : {
			name : 'deptid',
			fieldLabel : '借阅人部门',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : unitSt,
			lazyRender : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'fs' : {
			name : 'fs',
			fieldLabel : '借阅份数',
			anchor : '95%'
		},
		'jysj' : {
			name : 'jysj',
			fieldLabel : '借阅时间',
			width : 45,
			format : 'Y-m-d',
			anchor : '95%',
			value : new Date()
		},
		'ghsj' : {
			name : 'ghsj',
			fieldLabel : '归还时间',
			width : 45,
			format : 'Y-m-d',
			anchor : '95%'
		},
		'xjsj' : {
			name : 'xjsj',
			fieldLabel : '续借时间',
			anchor : '95%'
		},
		'xjcs' : {
			name : 'xjcs',
			fieldLabel : '续借次数',
			anchor : '95%'
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			xtype : 'htmleditor',
			height : 120,
			width : 400,
			anchor : '75%'
		},
		'memo1' : {
			name : 'memo1',
			fieldLabel : '备用1',
			allowBlank : false,
			anchor : '95%'
		},
		'memo2' : {
			name : 'memo2',
			fieldLabel : '备用2',
			allowBlank : false,
			anchor : '95%'
		}
	}
	var Columns_insert = [{
				name : 'infoid',
				type : 'string'
			}, {
				name : 'jyr',
				type : 'string'
			}, {
				name : 'fs',
				type : 'float'
			}, {
				name : 'deptid',
				type : 'string'
			}, {
				name : 'jysj',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'memo',
				type : 'string'
			}];
	var userCombo = new Ext.form.ComboBox({
				name : 'jyr',
				fieldLabel : '借阅人',
				disabled : true,
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : jyrSt,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			})
	var deptCombo = new Ext.form.ComboBox({
				name : 'deptid',
				fieldLabel : '借阅人部门',
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : unitSt,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%',
				listeners : {
					'collapse' : function(com) {
						userCombo.clearValue();
						userCombo.focus(true);
						userCombo.setDisabled(false);
						// 获取用户
						DWREngine.setAsync(false);
						baseMgm.getData(
								"select userid,realname from rock_user where dept_id='"
										+ com.value + "'", function(list) {
									user_Array.splice(0, user_Array.length)
									for (i = 0; i < list.length; i++) {
										var temp = new Array();
										temp.push(list[i][0]);
										temp.push(list[i][1]);
										user_Array.push(temp);
									}
								});
						DWREngine.setAsync(true);
						jyrSt.loadData(user_Array);
					}
				}
			})
	//借阅formpanel		
	var formPanelinsert = new Ext.FormPanel({
		id : 'form-panel',
		header : false,
		border : false,
		autoScroll : true,
		iconCls : 'icon-detail-form',
		labelAlign : 'top',
		items : [new Ext.form.FieldSet({
			title : '添加借阅人信息',
			border : true,
			width : 600,
			layout : 'column',
			items : [new fm.TextField(fc_insert['infoid']), {
						layout : 'form',
						columnWidth : .35,
						bodyStyle : 'border: 0px;',
						items : [deptCombo, new fm.DateField(fc_insert['jysj'])]
					}, {
						layout : 'form',
						columnWidth : .33,
						bodyStyle : 'border: 0px;',
						items : [
								// new fm.TextField(fc_insert['jyr']),
								userCombo, new fm.NumberField(fc_insert['fs'])]
					}]
		}), new Ext.form.FieldSet({
					layout : 'form',
					border : true,
					width : 600,
					title : '备注',
					cls : 'x-plain',
					items : [fc_insert['memo']]
				})],
		buttons : [{
					id : 'save',
					text : '保存',
					handler : formSave
				}, {
					id : 'cancel',
					text : '取消',
					handler : function() {
						formWindow.hide();
					}
				}]
	})
	
		function formSave() {
		var form = formPanelinsert.getForm()
		if (form.isValid()) {
			doFormSave(true)
		}
	}
	function doFormSave(dataArr) {
		var form = formPanelinsert.getForm()
		var obj = form.getValues()
		for (var i = 0; i < Columns_insert.length; i++) {
			var n = Columns_insert[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
			if ("fs" == n) {
				if (obj[n] == 0 || obj[n] < 0) {
					Ext.MessageBox.alert('提示', '借阅份数至少为一份');
					return
				}
			}
			if ("deptid" == n) {
				if (obj[n] == '') {
					Ext.MessageBox.alert('提示', '借阅部门不能为空');
					return
				}
			}
			if ("jyr" == n) {
				if (obj[n] == '') {
					Ext.MessageBox.alert('提示', '借阅人不能为空');
					return
				}
			}

		}
		DWREngine.setAsync(false);
		zlMgm.insertda_jy(obj, function(dat) {
					if ("0" == dat) {
						Ext.MessageBox.alert("提示", "借阅失败！")
					} else if ("1" == dat) {
						parent.ds.reload();
						Ext.Msg.show({
									title : '提示',
									msg : '借阅成功，关闭?',
									buttons : Ext.Msg.YESNO,
									fn : function(d) {
										if (d == "yes")
											parent.openWin.hide();
									    if(d == "no"){
									    	    fs_Array = new Array();
												DWREngine.setAsync(false);
												baseMgm.getData('select infoid,sum(fs)fs from da_zl_jy group by infoid',
														function(list) {
															for (i = 0; i < list.length; i++) {
																var temp = new Array();
																temp.push(list[i][0]);
																temp.push(list[i][1]);
																fs_Array.push(temp);
															}
														});
												DWREngine.setAsync(true);
											ds.reload();
										 }
									},
									animEl : 'elId',
									icon : Ext.MessageBox.QUESTION
								});
						formWindow.hide();
					} else if ("2" == dat) {
						Ext.MessageBox.alert("提示", "借阅数量不能多余剩余数量！")
					}
				});
		DWREngine.setAsync(true);
	}
	
	function insertJyFun(currentInfoid, sumFs, jyfs, syfs) {
		if (!formWindow) {
			formWindow = new Ext.Window({
						title : "借阅信息编辑",
						layout : 'fit',
						width : 700,
						height : 400,
						closeAction : 'hide',
						plain : true,
						items : formPanelinsert,
						animEl : 'action-new'
					});
		}
		formPanelinsert.getForm().reset();
		formWindow.show();

		var form = formPanelinsert.getForm();
		form.findField("infoid").setValue(currentInfoid)
	}   
	/////////-----------------查询------------////////
	function QueryWinwdow(){
    	if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
        	    width : 330,
        	    height : 280,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryzlPanel]
			});
		}
		QueryzlPanel.getForm().reset();
		formWin.show();
    }
var QueryzlPanel = new Ext.FormPanel({
		id : 'form-panelef',
		header: false,
        border: false,
        width : 200,
        height: 100,
        split: true,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 200,
        maxSize: 100,
        border: false,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
		labelAlign : 'top',
		// listeners: {beforeshow: handleActivate},
		bbar: ['->',{
				id: 'query',
		text: '查询',
				tooltip: '查询',
				iconCls: 'btn',
				handler: execQuery
			}],
		items : [
		 			new Ext.form.FieldSet({
    			    title: '资料查询',
            	    layout: 'form',
            	    width : 300,
            	    height : 200,
            	    border: true,
            	items: [
		           new fm.TextField(fc['dh']),
		           new fm.TextField(fc['mc']),
		           new Ext.form.DateField({
		          	 				id:'ljrq1',
		          	 				fieldLabel : '立卷时间',
		          	 				emptyText:'选择开始时间',
		          	 				readOnly:true,width:85,format:'Y-m-d'})
		          	 				]
		          	 	})
		          ]									
	});
	
	/*
	 * 查询主方法--
	 */	
	function execQuery(){
		var  dh= Ext.getCmp("dh").getValue();
		var  mc = Ext.getCmp("mc").getValue();
		var psql=" 1=1";
		var jysj_q = new Date();
		jysj_q = Ext.getCmp("ljrq1").getValue();
        if(dh != ""){
           psql += " and dh like '%"+dh+"%'";
        }
        if(mc != ""){
           psql +=" and mc like '%"+mc+"%'";
        }
        if(jysj_q != ""){
           psql +=" and ljrq  = to_date('"+jysj_q.getYear()+"-"+(jysj_q.getMonth()+1)+"-"+jysj_q.getDate()+"', 'yyyy-MM-dd')";
        }
        
        if( selectedTreeData != ""){
            psql += " and indexid in "+ getStr(selectedTreeData);
        }
	    ds.baseParams.params = psql
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			},
			callback: function(){ formWin.hide();}
		});
	}
   function  getStr(selectedTreeData){
       if(selectedTreeData == null || selectedTreeData == ''){
        selectedTreeData = '1'
	    }
	   if( selectedTreeData != ""){
	        	strs="(";
	        	DWREngine.setAsync(false);
	        	baseMgm.getData("select indexid from da_tree start with treeid='"+selectedTreeData+"' connect by prior   treeid=parent",
						function(list) {
						  if(list.length == 0) return strs +='';
						  for(var i = 0; i < list.length;i++){
						     if(list.length == 1){
						       strs +="'"+list[i]+"'";
					            break;
						     }
						     if(i < list.length -1 ){
						        strs +="'"+list[i]+"',";
						     }else{
						        strs +="'"+list[i]+"'";
						     }
						  }
						})
				DWREngine.setAsync(true);
				strs  +=")"
	        }
	        return strs;
   } 	
});

