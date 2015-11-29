var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.frame.flow.hbm.ZlInfo";
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "infoid"
var orderColumn = "stockdate"
var depttitle = USERORG.split(",");
var gridPanelTitle = depttitle[0] + "--部门资料销毁"
var formPanelTitle = "销毁资料信息"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var treeData = new Array();
var BillState = new Array();
var treePanel
var data;
var win;
var viewport;
var formWindow;
var partBs = new Array();
var uploadWin
var formPanel
var propertyName = "indexid";
var selectedTreeData = "";
var selectTreeid="";
var rootText = "资料分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var orgdata='';
var SPLITString= "~"
var businessType = "zlMaterial";
var zltypelist=new Array();
var adjunctWindow;
var jzhType = [[0,'未移交'],[1,'申请移交'],[2,'已入库'],[3,'已归档'],[6,'资料销毁']];//6标识销毁
var xhArray = [[2,'未销毁'],[6,'已销毁']];//6标识销毁
var currentPid = CURRENTAPPID;
var weavArr = new Array();
Ext.onReady(function() {
	DWREngine.setAsync(false);
	var userid;
	zlMgm.getuserId(USERNAME,function(value){  
			userid=value;
       	});

//       	var Bill = new Array();
//	zlMgm.getUserOrgid(userid,function(list) {
//		for (i = 0; i < list.length; i++) {
//			var temp = new Array();
//			temp.push(list[i].deptId);
//			//temp.push(list[i].PARENT);
//			Bill.push(temp);
//		}
//		
//	});
//	   
//		for(j=0;j<Bill.length;j++){
//			if(j != 0){
//			 orgdata = orgdata + SPLITString
//	 		 orgdata = orgdata + Bill[j];
//			}
//	 	}

	orgdata = USERDEPTID;

	appMgm.getCodeValue('资料类型',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			zltypelist.push(temp);			
		}
    });
	zlMgm.getdeptname(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].orgid);
			temp.push(list[i].orgname);
			BillState.push(temp);

		}
	});
appMgm.getCodeValue('责任者',function(list){ 
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			weavArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
	var zltypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : zltypelist
    });
	var dsJzhType = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : jzhType
		});
	var dsdeptname = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : BillState
	});
	var xhStr = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : xhArray
	});
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "zlTree",
			businessName : "zldaMgm",
			//orgid : orgdata,
			orgid : '',
			parent : 0,
			pid : currentPid
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

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
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		columns : [{
			header : '资料名称',
			width : 260,
			dataIndex : 'mc'
		}, {
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
		//baseParams.orgid = orgdata;
		baseParams.orgid = '';
		baseParams.parent = parent;

		})


	var btnReturn = new Ext.Button({
		text : '返回',
		tooltip : '返回',
		iconCls : 'returnTo',
		handler : function() {
			history.back();
		}
	});
    
	// /////////////////////////////////////////////////////////////////////////

	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : queryFun
	});
	

	var dsindexid = new Ext.data.SimpleStore({fields: [], data: [[]]});
	sm = new Ext.grid.CheckboxSelectionModel()
	var fm = Ext.form; // 包名简写（缩写）
	
	var fc = { // 创建编辑域配置
			'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsJzhType,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'infoid' : {
			name : 'infoid',
			fieldLabel : '主键',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			// allowBlank: false,
			anchor : '95%'
		},
		'indexid' : {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			mode : 'local',
			//hidden : true,
			editable:false,
			allowBlank: false,
            listWidth: 200,
            maxHeight: 200,
            triggerAction: 'all',
            store: dsindexid,
			tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},
		'fileno' : {
			name : 'fileno',
			fieldLabel : '文件编号',
			// allowBlank: false,
			anchor : '95%'
		},
		'responpeople' : {
			name : 'responpeople',
			fieldLabel : '录入人',
			anchor : '95%'
		},
		'yjr' : {
			name : 'yjr',
			fieldLabel : '移交人',
			anchor : '95%'
		},
		'jsr' : {
			name : 'jsr',
			fieldLabel : '经手人',
			anchor : '95%'
		},
		'materialname' : {
			name : 'materialname',
			fieldLabel : '文件材料题名',
			allowBlank : false,
			anchor : '95%'
		},
		'stockdate' : {
			name : 'stockdate',
			fieldLabel : '文件日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'quantity' : {
			name : 'quantity',
			fieldLabel : '每份页数',
			anchor : '95%'
		},
		'weavecompany' : {
			name : 'weavecompany',
			fieldLabel : '责任者',
			allowBlank : false,
			anchor : '95%'
		},
		'book' : {
			name : 'book',
			fieldLabel : '单位',
			allowBlank : false,
			anchor : '95%'
		},
		'portion' : {
			name : 'portion',
			fieldLabel : '份数',
			allowBlank : false,
			anchor : '95%'
		},
		'orgid' : {
			name : 'orgid',
			fieldLabel : '部门名称',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : dsdeptname,
			lazyRender : true,
			hidden : true,
			hideLabel : true,
			listClass : 'x-combo-list-small',
			anchor : '95%'
		},
		'filename' : {
			name : 'filename',
			fieldLabel : '附件文件名称',
			anchor : '95%'
		},
		'filelsh':{
			name : 'filelsh',
			fieldLabel : '电子文档',
			anchor : '95%'
		},
		'infgrade':{
			name : 'infgrade',
			fieldLabel : '资料电子文档密级',
			anchor : '95%'
		},
		'remark' :{
			name : 'remark',
			fieldLabel : '备注',
			height: 120,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		},
		'rkrq' : {
			name : 'rkrq',
			fieldLabel : '入库日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'zltype' : {
			name : 'zltype',
			fieldLabel : '资料类型',
			allowBlank : false,
			anchor : '95%'
		},
		'flwinsid' : {
			name : 'flwinsid',
			fieldLabel : '流程实例',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
		sm,  
			{
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				width : 80,
				renderer : function(Value) {
					if (Value == 0) {
						return '未移交'
					}
					if (Value == 1) {
						return '申请移交'
					}
					if (Value == 2) {
						return '已入库'
					}
					if (Value == 3) {
						return '已归档'
					}
					if (Value == 6) {
						return '资料销毁'
					}
				}
			},
			{
				id : 'infoid',
				header : fc['infoid'].fieldLabel,
				dataIndex : fc['infoid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			// editor: new fm.TextField(fc['pid'])
			}, {
				id : 'orgid',
				header : fc['orgid'].fieldLabel,
				dataIndex : fc['orgid'].name,
				hidden : true,
				renderer : partbRender
			}, {
				id : 'fileno',
				header : fc['fileno'].fieldLabel,
				dataIndex : fc['fileno'].name,
				width : 100,
				align : 'center'
			}, {
				id : 'materialname',
				header : fc['materialname'].fieldLabel,
				dataIndex : fc['materialname'].name,
				width : 240
			}, {
				id : 'stockdate',
				header : fc['stockdate'].fieldLabel,
				dataIndex : fc['stockdate'].name,
				width : 100,
				renderer : formatDate
			}, {
				id : 'weavecompany',
				header : fc['weavecompany'].fieldLabel,
				dataIndex : fc['weavecompany'].name,
				width : 100,
				renderer:function(value){
					if(weavArr .length > 0){
						var str = '';
						for(var i = 0;i<weavArr.length;i++){
							if (weavArr[i][0] == value) {
								str = weavArr[i][1]
								break;
							}else{
								str = value;
								//break;
							}
						}
						return str;
					}else{
						return value;
					}
				}
			}, {
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				renderer : fileicon
			}, {
				id : 'portion',
				header : fc['portion'].fieldLabel,
				dataIndex : fc['portion'].name,
				width : 50
			},
			{
				id : 'quantity',
				header : fc['quantity'].fieldLabel,
				dataIndex : fc['quantity'].name,
				width : 80
			},{
				id : 'book',
				header : fc['book'].fieldLabel,
				dataIndex : fc['book'].name,
				width : 50,
				renderer : bookNumUnitRender
			}, {
				id : 'responpeople',
				header : fc['responpeople'].fieldLabel,
				dataIndex : fc['responpeople'].name,
				align : 'center',
				hidden : true,
				width : 40
			},{
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true
			},  {
				id : 'zltype',
				header : fc['zltype'].fieldLabel,
				dataIndex : fc['zltype'].name,
				hidden: true
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 60,
				align : 'center'
			}
	]);
	cm.defaultSortable = true; // 设置是否可排序
	
	// 3. 定义记录集
	var Columns = [{
		name : 'infoid',
		type : 'string'
	}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'fileno',
				type : 'string'
			}, {
				name : 'filelsh',
				type : 'string'
			}, {
				name : 'filename',
				type : 'string'
			}, {
				name : 'materialname',
				type : 'string'
			}, {
				name : 'indexid',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'stockdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'quantity',
				type : 'float'
			}, {
				name : 'responpeople',
				type : 'string'
			}, {
				name : 'yjr',
				type : 'string'
			}, {
				name : 'jsr',
				type : 'string'
			}, {
				name : 'weavecompany',
				type : 'string'
			}, {
				name : 'book',
				type : 'float'
			}, {
				name : 'portion',
				type : 'float'
			}, {
				name : 'orgid',
				type : 'string'
			},
			 {
				name : 'zltype',
				type : 'float'
			}, {
				name : 'rkrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},
			{
				name : 'billstate',
				type : 'float'
			},
			{
				name : 'flwinsid',
				type : 'string'
			},{
			    name : 'yjTableAndId',
			    type : 'string'
			}];
	var Fields = Columns.concat([ // 表单增加的列
			{
				name : 'filename',
				type : 'string'
			}, {
				name : 'infgrade',
				type : 'float'
			}])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		fileno : '',
		pid : currentPid,
		materialname : '',
		indexid : '',
		quantity : '',
		billstate : '0',
		responpeople : username,
		filename : '',
		remark : '',
		weavecompany : '',
		book : '',
		portion : '',
		orgid : USERORGID,
		stockdate : '',
		filelsh : '',
		yjr: '',
		jsr: '',
		rkrq: '',
		zltype: ''
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		portion : ""
	});

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : "indexid in (select indexid from ZlTree) and billstate='2' "
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
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	
	var xhBtn = new Ext.Button({
		id : 'zl_xh',
		text : '销毁',
		tooltip : '销毁',
		iconCls : 'btn',
		handler : xhFun
	});
    var xhCombo = new Ext.form.ComboBox({
		id : 'xh_combo',
		fieldLabel : '是否销毁',
		readOnly : true,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		typeAhead : true,
		triggerAction : 'all',
		store : xhStr,
		lazyRender : true,
		listClass : 'x-combo-list-small',
		anchor : '95%',
		listeners:{'collapse':function(com){
			if(com.value=='6'){
				 xhBtn.setDisabled(true);
				 refresh("yes6");//yes6的意思是在查询的时候billstate='6';
			}
			if(com.value=='2'){
			    xhBtn.setDisabled(false);
			    refresh("yes2");//yes2的意思是在查询的时候billstate='2';
			}
        }}
	})	
	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		tbar : [], // 顶部工具栏，可选
		title : gridPanelTitle, // 面板标题
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		// frame: false, //是否显示圆角边框
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
//			forceFit : true,
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
		plant : Plant, // 初始化记录集，必须
		plantInt : PlantInt, // 初始化记录集配置，必须
		servletUrl : ServletUrl, // 服务器地址，必须
		bean : bean, // bean名称，必须
		business : "zlMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		addBtn:false,
		delBtn:false,
		//deleteHandler : deleteFun,
		// form: true,
		//formHandler: popForm,
		// formHandler: showEditDialog,
		//saveHandler : saveFun,
		insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
		saveMethod : 'saveDeptInfo'
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			params : "indexid in (select indexid from ZlTree) and billstate='2' "
		}
	});

	sm.on('rowselect',function(sm,rowIndex,record){
		var billS = record.get('billstate');
		if(billS!=""){
			if(billS=='6'){
				xhBtn.setDisabled(true);
			}else{xhBtn.setDisabled(false);}
		}
	})
	// 6. 创建表单form-panel
	formPanel = new Ext.FormPanel({
		id : 'form-panelef',
		header : false,
		border : false,
		iconCls : 'icon-detail-form',
		labelAlign : 'top',
		// listeners: {beforeshow: handleActivate},
		bbar : ['->', {
			id : 'query',
			text : '查询',
			tooltip : '查询',
			iconCls : 'btn'//,
			//handler : execQuery
		}],
		items : [new fm.TextField(fc['fileno']), new fm.TextField(fc['materialname']),
				new fm.TextField(fc['weavecompany']),
				new fm.DateField(fc['stockdate'])]

	});

   ////////////////////////////////////////////////////////////	// //////////////////////////////////////////
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
		add("是否销毁:",xhCombo,xhBtn,'-','文件材料题名:',new Ext.form.TextField({id:'searchText',emptyText:'输入文件名'}),'-', btnQuery,'->');
	}
	treePanel.render();
	treePanel.expand();

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	
	function fileicon(value, metadata, record) {
		if (value != '') {
			var zltype = record.get('zltype');
			var url = BASE_PATH;
			if (zltype == 8){ 
				url += "servlet/FlwServlet?ac=loadFile&fileid="+value;
			} else if (zltype == 9){
				url += "servlet/FlwServlet?ac=loadAdjunct&fileid="+value;
			} else if (zltype == 4){
				url += "servlet/MainServlet?ac=downloadBlobFileByFileId&isCompressed=1&fileId="+value+"&fileName="+record.get("filename");
			} else if(zltype == 2){
			     return '<div id="sidebar"><a href="javascript:conAdjustWin(\''
			             + record.get("filelsh") + '\' )"><img src=\'' + BASE_PATH
					+ "jsp/res/images/word.gif\''></img></a></div>"
			
			}else {
				url += "servlet/MainServlet?ac=downloadBlobFileByFileId&fileId="+value+"&fileName="+record.get("filename");
			}
			return "<center><a href='" + url + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		} else {
				var yjTableAndId = record.get('yjTableAndId');
				var infoid = record.get('infoid');
				if(yjTableAndId !='' ){
						return "<center><a href='javascript:showBlobListWin(\"" + infoid + "\")'><img src='" + BASE_PATH
					                             + "jsp/res/images/word.gif'></img></a></center>"
	
				}else{
						return '<center><a href="javascript:showUploadWin(\''
									+ businessType + '\', ' + false + ', \''
									+ infoid+ '\', \''+'文件列表'+'\')">' + "<img src='" + 
									BASE_PATH+ "jsp/res/images/word.gif'></img>" +'</a><center>'
					}
			}
	}

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
   ////////////////////////////////////////////////////////////
	
    

	function partbRender(value) {
		var str = '';
		for (var i = 0; i < BillState.length; i++) {
			if (BillState[i][0] == value) {
				str = BillState[i][1]
				break;
			}
		}
		return str;
	}
    
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("indexid").innerText;
		selectorgid=elNode.all("orgid").innerText; 
		selectTreeid =  elNode.all("treeid").innerText;
		PlantInt.indexid = selectedTreeData;
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
		refresh("yes2");//yes26的意思是在查询的时候billstate='2' or billstate='6';
	});
	function refresh(str){
		if(selectorgid == null || selectorgid == "")
		{
		      selectorgid = USERORGID
		}
		var where = "treeid" + SPLITB +selectTreeid + SPLITA + "pid"+SPLITB+CURRENTAPPID + SPLITA+
		            "orgid"+SPLITB+selectorgid+SPLITA+"billstate"+SPLITB+str;
		ds.baseParams.business = "zlMgm";
	    ds.baseParams.method  ='newFindwhereorderby';
	    ds.baseParams.params = where;
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
 }
	
	/////////-----------------查询------------////////
	function queryFun(){
		var  zl_q = Ext.getCmp("searchText").getValue();
		ds.baseParams.business = "baseMgm";
	    ds.baseParams.method  ="findwhereorderby";
	    ds.baseParams.params = "  materialname like '%"
				+ zl_q + "%' and billstate='2'";
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	}	
		////////-------------------销毁-------------------------------//
  function xhFun(){
	var records=grid.getSelectionModel().getSelections();
		if(records.length<1||records==""){
			Ext.MessageBox.alert('提示','请选择要销毁的资料记录!')
		}else{
			var infoids="";
			for(var i=0;i<records.length;i++){
				infoids+=records[i].get('infoid')+","
			}
			Ext.MessageBox.confirm('确认销毁','资料销毁不能恢复，请确认操作？',function(btn){
			if('yes'==btn){
				DWREngine.setAsync(false);
		    	zlMgm.updateXh(infoids,function(dat){
					if(dat){
						Ext.MessageBox.alert('提示','销毁成功，可到销毁资料管理模块中查看!');
						ds.reload();
					}else{Ext.MessageBox.alert('提示','销毁失败!');}
		    	});
		    	DWREngine.setAsync(true);
			}else{return;}
		})
			
		}
	}
});

//显示移交多附件的文件列表
function showBlobListWin(infoid){
	var title = '文件列表';
	var whereCondition = ""

	DWREngine.setAsync(false);
    if (infoid != null && infoid!=''){
	   	zlMgm.getZlFileLshs(infoid, function(dat){
	   		whereCondition = dat;
	   	});
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/Business/document/fileUploadSwf_zl.jsp?openType=url&editable=false&whereCondition="+whereCondition;
	fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	DWREngine.setAsync(true);
}

//查看合同附件函数
function conAdjustWin(conid){
	fileUrl = CONTEXT_PATH
				+ "/Business/contract/cont.files.view.jsp?select="
				+ conid+"&checkout=check";
	var fileWin = new Ext.Window({
				title : '资料附件',
				tbar : [{}],
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}
//显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}