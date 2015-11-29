var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.frame.flow.hbm.ZlInfo"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "infoid"
var orderColumn = "indexid,stockdate"
var depttitle = USERORG.split(",");
var gridPanelTitle =  "资料信息综合管理"
var formPanelTitle = "资料信息综合管理"
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
var rootText = "资料分类";
var tmp_parent;
var PlantInt;
var sm;
var ds;
var formWin;
var selectorgid;
var flag = true;
var yjokWin;
var currentPid = CURRENTAPPID;
Ext.onReady(function() {
	DWREngine.setAsync(false);

	zlMgm.getdeptname(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].orgid);
			temp.push(list[i].orgname);
			BillState.push(temp);

		}
	});

	DWREngine.setAsync(true);

	var dsdeptname = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : BillState
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

	var btnyjok = new Ext.Button({
		id : 'yjok',
		text : '资料移交确认',
		tooltip : '资料移交确认',
		iconCls : 'btn',
		//disabled : true,
		handler : yjok
	});
	var btnPrint = new Ext.Button({
		id : 'print',
		text : '打印',
		tooltip : '打印',
		iconCls : 'print',
		//disabled : true,
		handler : PrintWinwdow
	});
	var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updatedept
	});
	function PrintWinwdow() {
		if (tmp_parent != true) {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}
		with (document.all.dbnetcell0) {
			code = "inf" // 模块编号
			report_no = "infdaml" // 报表编号
			reportArgs = new Object() // 报表参数，可用变量赋值以对应不同的记录
			reportArgs.infyj = USERORGID// 报表参数的值 bc	部门编号
			reportArgs.inftitle=selectedTreeData//分类编码
			open() // 调用open方法打开报表，返回流水号
		}
	}
	// /////////////////////////////////////////////////////////////////////////

	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : QueryWinwdow
	});
	function QueryWinwdow() {
		if (!formWin) {
			formWin = new Ext.Window({
				title : '查询数据',
				width : 460,
				height : 400,
				layout : 'fit',
				iconCls : 'form',
				closeAction : 'hide',
				border : true,
				constrain : true,
				maximizable : true,
				modal : true,
				items : [QueryPanel]
			});
		}
		QueryPanel.getForm().reset();
		formWin.show();
	}
   
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
			fieldLabel : '每份数量',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
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
			// allowNegative: false,
			// maxValue: 100000000,
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
		}
	}
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, // 第0列，checkbox,行选择器
			// new Ext.grid.RowNumberer({
			// header : '序号',
			// width : 40
			// }),// 计算行数
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
				width : 100
			}, {
				id : 'quantity',
				header : fc['quantity'].fieldLabel,
				dataIndex : fc['quantity'].name,
				width : 80
			}, {
				id : 'portion',
				header : fc['portion'].fieldLabel,
				dataIndex : fc['portion'].name,
				width : 50
			},{
				id : 'book',
				header : fc['book'].fieldLabel,
				dataIndex : fc['book'].name,
				width : 50,
				renderer : function(Value) {
					if (Value == 1) {
						return '碟'
					}
					if (Value == 2) {
						return '张'
					}
					if (Value == 3) {
						return '页'
					}
				}
			}, {
				id : 'responpeople',
				header : fc['responpeople'].fieldLabel,
				dataIndex : fc['responpeople'].name,
				align : 'center',
				hidden : true,
				width : 40
			}, {
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true,
				//width : 100,
				editor: comboxWithTree
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 100,
				align : 'center'
			}, {
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				renderer : fileicon
			},
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
				}
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
				name : 'materialname',
				type : 'string'
			},  {
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
			}];
	var Fields = Columns.concat([ // 表单增加的列
			{
				name : 'filename',
				type : 'string'
			}, {
				name : 'infgrade',
				type : 'float'
			},
			{
				name : 'billstate',
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
		billstate : '2',
		responpeople : username,
		filename : '',
		remark : '',
		weavecompany : '',
		book : '',
		portion : '',
		orgid : USERORGID,
		stockdate : '',
		filelsh : '',
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
			params : "  indexid like '"
					+ selectedTreeData + "%' and  (billstate=2 or billstate=3) "
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

	// 5. 创建可编辑的grid: grid-panel
	grid = new Ext.grid.EditorGridTbarPanel({
		// basic properties
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		// renderTo: 'editorgrid', //所依附的DOM对象，可选
		tbar : [], // 顶部工具栏，可选
		// width : 800, //宽
		title : gridPanelTitle, // 面板标题
		// iconCls: 'icon-show-all', //面板样式
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
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun,
		// form: true,
		//formHandler: popForm,
		// formHandler: showEditDialog,
		saveHandler : saveFun,
		insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
		saveMethod : 'saveDeptInfo'
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			arams : "   indexid like '"
					+ selectedTreeData + "%' and  (billstate=2 or billstate=3)"
		}
	});

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
		add(update,'-', btnPrint, '-', btnQuery,'->',btnyjok);
	}
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					//tb.items.get("selectsort").enable();
				} else {
					//tb.items.get("selectsort").disable();
				}
				if (formWindow != null && !formWindow.hidden) {
					
				}
			});
	treePanel.render();
	treePanel.expand();

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	function fileicon(value) {
		if (value != '') {
			return "<center><a href='" + BASE_PATH
					+ "servlet/MainServlet?ac=attach&action=download&fileid="
					+ value + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		} else {

		}
	}

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
   ////////////////////////////////////////////////////////////
	 var upload = new Ext.Button({
	 	id : 'newupload',
    	iconCls: 'upload-icon',
    	tooltip: '上传附件',
    	handler : function() {
    			if (!uploadWin) {
							uploadWin = new Ext.Window({
								el : 'uploadWin',
								title : '资料上传',
								layout : 'fit',
								width : 330,
								height : 200,
								modal : true,
								closeAction : 'hide',
								items : [new Ext.Panel({
									contentEl : 'uploadDiv'
								})]
							})
							uploadWin.on("hide", assignUploadInfo)
						}
				uploadWin.show();
				if (uploadWin) {
							document.all("uploadIFrame").src = "jsp/test/test.uploadFile.htm"
									//+ record.get("filelsh");
						}
    	}
    })
    ////////////////////////////////////////////////////
    
    var comboxWithTree = new fm.ComboBox(fc['indexid']);
	
	comboxWithTree.on('expand', function(){
		newtreePanel.render('tree');
	});
	
	newtreePanel.on('click', function(node){
		if ("" != node.attributes.mc && "1" == node.attributes.isleaf){
			comboxWithTree.setValue(node.attributes.indexid);
			comboxWithTree.collapse();
		}
	});
    
   
    //////////////////////////////////////////////////
		// 6. 创建表单form-panel
	var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		//bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
		//listeners: {beforeshow: handleActivate},
	 	items: [
    			new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		 new fm.ComboBox({
				            		name: 'zltype',
									fieldLabel: '资料类型',
									allowBlank : false,
									emptyText : '请选择...',
									valueField: 'k',
									displayField: 'v',
									mode: 'local',
						            typeAhead: true,
						            triggerAction: 'all',
						            store: new Ext.data.SimpleStore({
						            	data: [['1','图纸'],['2','合同'],['3','资料']],
						            	fields: ['k', 'v']
						            }),
						            lazyRender: true,
						            listClass: 'x-combo-list-small',
									anchor: '95%'
				            	})
		                		
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['fileno'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['responpeople'])
				            	
    					      ]
    				  }    				
    			]
    		}),
    		//////////////////////////////////////////////////////////
    		new Ext.form.FieldSet({
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		
		                		   new fm.TextField(fc['materialname']),
		                		   new fm.TextField(fc['weavecompany'])
		                		  
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				                new fm.NumberField(fc['portion']),
				            	new fm.NumberField(fc['quantity'])
				            	
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							
	    						new fm.ComboBox({
				            		name: 'book',
									fieldLabel: '单位',
									allowBlank : false,
									emptyText : '请选择...',
									valueField: 'k',
									displayField: 'v',
									mode: 'local',
						            typeAhead: true,
						            triggerAction: 'all',
						            store: new Ext.data.SimpleStore({
						            	data: [['1','碟'],['2','张'],['3','页']],
						            	fields: ['k', 'v']
						            }),
						            lazyRender: true,
						            listClass: 'x-combo-list-small',
									anchor: '95%'
				            	}),
				            	new fm.TextField(fc['infoid'])
					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		
		                		 new fm.DateField(fc['rkrq'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				                new fm.DateField(fc['stockdate'])
				            	
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							
	    						new fm.TextField(fc['pid'])
					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		
		                		 new fm.TextField(fc['filelsh'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				                new fm.TextField(fc['filename'])
				            	
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['orgid']),
    							{
					            	border: false,
	    							layout: 'form',
	    							bodyStyle: 'padding: 3px',
					            	items: [upload]
				            	}
    							
	    						
					      ]
    				  }    				
    			]
    		}),
    		new Ext.form.FieldSet({
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		
		                		comboxWithTree
	   						   ]
    				},
    				{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
				                new fm.TextField(fc['billstate'])
				            	
    						   ]
    				}
    			]
    		}),
    		/////////////////////////////////////////////////////////////
   			new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					fc['remark']
                   	
				]
    		})
    	],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow.hide();
            }
        }]
	});
	
   //////////////////////////////////////////////////////////
	function insertFun() {
		if (tmp_parent != true) {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}

		//grid.defaultInsertHandler();
		
		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:400,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	formPanelinsert.getForm().reset();
       	formWindow.show();
        
		var form = formPanelinsert.getForm();
		form.findField("indexid").setValue(selectedTreeData);
		form.findField("pid").setValue(currentPid);
		form.findField("responpeople").setValue(username);
        form.findField("billstate").setValue('2');
        form.findField("orgid").setValue(selectorgid);
		

	};
	//修改部门资料信息
	function loadForm(){
		//////////
		var form = formPanelinsert.getForm();
    	if (sm.getSelected()!=null)
    	{
    		var gridRecod = sm.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsInt);
    				for(var i=0; i<Columns.length; i++){
    					if (typeof(temp[Columns[i].name])!="undefined"){
    						temp[Columns[i].name] = gridRecod.get(Columns[i].name)
    					}
    				}
    				form.loadRecord(new PlantFields(temp))
    			}
    			else
    				form.loadRecord(new PlantFields(PlantFieldsInt))
    			//form.reset()
    			formPanelinsert.buttons[0].enable()
    	
    			formPanelinsert.isNew = true
    		}
    		else
    		{
	    		var ids = sm.getSelected().get(primaryKey)
	    		baseMgm.findById(bean, ids, function(rtn){
			    		if (rtn == null) {
		    				Ext.MessageBox.show({
		    					title: '记录不存在！',
		    					msg: '未找到需要修改的记录，请刷新后再试！',
		    					buttons: Ext.MessageBox.OK,
		    					icon: Ext.MessageBox.WARNING
		    				});
		    				return;
			    		}
			    		var obj = new Object();
			    		for(var i=0; i<Fields.length; i++){
			    			var n = Fields[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<Columns.length; i++){
		    					if (typeof(obj[Columns[i].name])!="undefined"){
		    						obj[Columns[i].name] = gridRecod.get(Columns[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFields(obj)
			    		form.loadRecord(record)
			    		formPanelinsert.buttons[0].enable()
			    		formPanelinsert.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    		formPanel.buttons[0].disable()
    	}  
		////////
		
	}
   function updatedept(){
   	 if(!sm.hasSelection()){
    	Ext.MessageBox.show({
						title : '警告',
						msg : '请选择将要修改的记录！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.WARNING
					});
					return;
    }
   	if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:400,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	formWindow.show();
       	loadForm();
   }
	function saveFun() {
		if (fnValidateForSub()) {
			grid.defaultSaveHandler();

		}

	};

	function deleteFun() {
		var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('infoid'));
			}
			
	///////////////////////////////////////////////////////////////////////
		if (ids.length > 0){
    		Ext.Msg.show({
				title: '提示',
				msg: '是否要删除?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						Ext.get('loading-mask').show();
						Ext.get('loading').show();
						zlMgm.deleteinfo(ids, function(){
							Ext.get('loading-mask').hide();
							Ext.get('loading').hide();
							Ext.example.msg('删除成功！', '您成功删除了('+ids.length+')条部门资料信息！');
							ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE,
									arams : "   indexid like '"
											+ selectedTreeData + "%' and  (billstate=2 or billstate=3)"
								}
							});
							if (ds.getCount() > 0)
					    		sm.selectRow(0);
						});
					}
				}
    		});
    	}
	
	}
}

	function formSave() {
		var form = formPanelinsert.getForm()
		if (form.isValid()) {
			doFormSave(true)	
		}
	}

	function doFormSave(dataArr){
    	var form = formPanelinsert.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.infoid == '' || obj.infoid == null){
	   		zlMgm.insertzlinfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			zlMgm.updatezlinfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
	   				ds.baseParams.params = "  indexid like '"
						+ selectedTreeData + "%' and  (billstate=2 or billstate=3)"
					ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
	   				
	   		});
   		}
   		DWREngine.setAsync(true);
    }

    function processResult(value){
    	if ("yes" == value){
    		ds.baseParams.params = "  indexid like '"
				+ selectedTreeData + "%'"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
	    	var form = formPanelinsert.getForm();
			form.findField("indexid").setValue(selectedTreeData);
			form.findField("pid").setValue(currentPid);
			form.findField("responpeople").setValue(username);
	        form.findField("billstate").setValue(0);
	        form.findField("orgid").setValue(selectorgid);
    			
    	}else{
    		formWindow.hide();
    		ds.baseParams.params = "  indexid like '"
				+ selectedTreeData + "%' and  (billstate=2 or billstate=3)"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    	}
    }
	function formCancel() {
		// formPanel.getForm().reset();
		formWindow.hide();
	}
     function yjok(){
    	
    	if (!yjokWin) {
			yjokWin = new Ext.Window({
				title : '资料移交信息',
				layout : 'fit',
				border : false,
      			modal : true,
				width : 800,
				height : 500,
				closeAction : 'hide',
				items : [new Ext.Panel({
							contentEl : 'yjokDiv'
						})]
		});
	}
	yjokWin.show();
    
	if (yjokWin) {
		document.all('yjokIFrame').src = "jsp/zlgl/zl.yjok.jsp"
	}
   }
	var formDialogWin;

	function fnValidateForSub() {
		var flag = true;
		var subEditRecords = ds.getModifiedRecords();
		for (var i = 0; i < subEditRecords.length; i++) {
			var record = subEditRecords[i];
			var f_wjbh = record.get('wjbh');
			var f_wjcltm = record.get('wjcltm');
			var f_rq = record.get('rq');
			if ("" == f_wjcltm) {
				Ext.example.msg('提示', '必填项：文件材料提名 未填写！');
				flag = false;
			} else if ("" == f_wjbh) {
				Ext.example.msg('提示', '必填项：文件编号 未填写！');
				flag = false;
			} else if ("" == f_rq) {
				Ext.example.msg('提示', '必填项：日期 未填写！');
				flag = false;
			}
		}
		return flag;
	}

	function assignUploadInfo() {

		var frame = window.frames["uploadIFrame"];
		uploadFileInfo = frame.document.body.innerText;
		if (uploadFileInfo.substring(0, 9) == "fieldname") {
			var c = (uploadFileInfo.substring(0, uploadFileInfo.length - 1))
					.split(SPLITA)
			var msg = c[3].split(SPLITB)[1];
			var fieldName;
			var fileid;
			var filename;
			if (msg.split(SPLITC)[0] == SUCCESS) {
				fieldName = c[0].split(SPLITB)[1];
				fileid = c[1].split(SPLITB)[1];

				filename = c[2].split(SPLITB)[1];

			}
			var form = formPanelinsert.getForm();
			form.findField("filename").setValue(filename)
			form.findField("filelsh").setValue(fileid)
			
		}
	}

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
		ds.baseParams.params = "  indexid like '"
				+ selectedTreeData + "%' and  (billstate=2 or billstate=3)"
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

});
