var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.frame.flow.hbm.ZlInfo"
var beanA="com.sgepit.pmis.document.hbm.DaDaml"
var beanB="com.sgepit.pmis.document.hbm.ZlInfoJy"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "infoid"
var orderColumn = "stockdate"
var gridPanelTitle ="全资料信息"
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
var paramName="indexid";
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
var SPLITString= "~";
var Bill = new Array();
var zltypelist=new Array();
var indexidStr = new Array();
var jzhType = [[0,'未移交'],[1,'申请移交'],[2,'已入库'],[3,'已归档'],[4,'新增']];
var currentPid = CURRENTAPPID;
var weavArr = new Array();
Ext.onReady(function() {
	//////////////////////////////////////////////
	DWREngine.setAsync(false);
	var userid;
	zlMgm.getuserId(USERNAME,function(value){  
			userid=value;
       	});

//    Bill = new Array();
//	zlMgm.getUserOrgid(userid,function(list) {
//		for (i = 0; i < list.length; i++) {
//			var temp = new Array();
//			temp.push(list[i].deptId);
//			Bill.push(temp);
//		}
//		
//	});

//		for(j=0;j<Bill.length;j++){
//			if(j != 0){
//			 orgdata = orgdata + SPLITString
//	 		 orgdata = orgdata + Bill[j];
//			}
//	 	}

	
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

	baseMgm.getData("select indexid,mc from zl_tree",function(list){
	    if(list.length>0){
	       for(var i=0;i<list.length;i++){
	          var temp = new Array();
	          temp.push(list[i][0]);
	          temp.push(list[i][1]);
	          indexidStr.push(temp);
	       }
	    }
	})
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
        fields : ['k', 'v'],
        data : zltypelist
    });
	var dsdeptname = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : BillState
	});
	 var dsJzhType = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : jzhType
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
			orgid : orgdata,
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
		baseParams.orgid = orgdata;
		baseParams.parent = parent;

		})

	var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updatezl
	});
	var ok = new Ext.Button({
		id : 'slectok',
		text : '组卷',
		tooltip : '组卷',
		iconCls : 'btn',
		handler : slectok
		
	});
	var btnQuery = new Ext.Button({
		id : 'showQuery',
		text : '查询',
		tooltip : '查询',
		iconCls : 'option',
		handler : QueryWinwdow
	});
	var excelInput= new Ext.Button({
		id : 'Excel',
		text : 'excel导入',
		tooltip : 'excel导入',
		iconCls : 'upload',
		pressed:true,
		handler : showExcelWin
		
	});
	var btnlcfj = new Ext.Button({
		id : 'lcyj',
		text : '查看流程附件',
		tooltip : '查看流程附件',
		iconCls : 'btn',
		disabled : true,
		handler : showFlowAdjunct
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
			hidden : true,
			editable:false,
			//allowBlank: false,
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
			fieldLabel : '接收日期',
			width : 45,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'quantity' : {
			name : 'quantity',
			fieldLabel : '页数',
			//readOnly : true,
			anchor : '95%'
		},
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
		'weavecompany' : {
			name : 'weavecompany',
			fieldLabel : '责任者',
			allowBlank : false,
			anchor : '95%'
		},
		'book' : {
			name : 'book',
			fieldLabel : '单位',
			hidden : true,
			hideLabel : true,
			allowBlank : false,
			anchor : '95%'
		},
		'portion' : {
			name : 'portion',
			fieldLabel : '份数',
			hidden : true,
			hideLabel : true,
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
			fieldLabel : '附件流水号',
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
				hidden : true
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
				id : 'quantity',
				header : fc['quantity'].fieldLabel,
				dataIndex : fc['quantity'].name,
				width : 50
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
				renderer : function(v){
				     for(var i=0;i<indexidStr.length;i++){
				       if(v == indexidStr[i][0])
				         return indexidStr[i][1];
				     }
				}
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 60,
				align : 'center'
			}, {
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				renderer : fileicon
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				width : 60,
				// hidden: true,
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
					if (Value == 4) {
						return '新增'
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
			},{
				name : 'flwinsid',
				type : 'string'
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
		billstate : 4,
		responpeople : username,
		filename : '',
		remark : '',
		weavecompany : '',
		book : '',
		portion : '',
		orgid : USERORGID,
		stockdate : '',
		filelsh : ''
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
			//params : "  indexid like '"
			//	+ selectedTreeData + "%' and infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
			params : " orgid='" + USERORGID + "' and infoid not in ( select zlid from da_daml in class "+beanA+") and infoid not in (select infoid from zl_info_jy in class  "+beanB+") and (billstate=2 or billstate=4)"
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
		//title : gridPanelTitle, // 面板标题
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
		insertMethod : 'saveDeptInfo',// 自定义增删改的方法名，可选，可部分设置insertMethod/saveMethod/deleteMethod中的一个或几个
		saveMethod : 'saveDeptInfo'
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			//arams : "  indexid like '"
				//+ selectedTreeData + "%' and infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
			params : " orgid='" + USERORGID + "' and infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
		}
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
		items : [ treePanel,contentPanel]
	});

	// /////////////////////////////////////////////////////
	//root.select();
    grid.showHideTopToolbarItems("save", false);
   	grid.showHideTopToolbarItems("refresh", false);
   	grid.showHideTopToolbarItems("del", false);
   	grid.showHideTopToolbarItems("add", false);
   	var gridTopBar = grid.getTopToolbar()
	with (gridTopBar) {
		//add(update,'-',ok,'-',btnQuery,'-',btnlcfj);
		add(ok,'-',btnQuery);
	}
	
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					tb.items.get("slectok").enable();
					//tb.items.get("lcyj").enable();
				} else {
					tb.items.get("slectok").disable();
					//tb.items.get("lcyj").disable();
				}
				if (formWindow != null && !formWindow.hidden) {
					
				}
			});
	//treePanel.render();
	//treePanel.expand();

	function formatDate(value) {
		var o = value ? value.dateFormat('Y-m-d') : '';
		return o;
	};
	

	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
   function fileicon(value, metadata, record) {
		if (value != '') {
			var zltype = record.get('zltype');
			var url = BASE_PATH;
			if (zltype == 8){ 
				url += "servlet/FlwServlet?ac=loadFile&fileid="+value;
			} else if (zltype == 9){
				url += "servlet/FlwServlet?ac=loadAdjunct&fileid="+value;
			} else {
				url += "servlet/MainServlet?ac=attach&action=download&fileid="+value;
			}
			return "<center><a href='" + url + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		}
	}
	 var formDialogWin;
	 ////////////////////////////////////////////////////////////
//	 var upload = new Ext.Button({
//	 	id : 'newupload',
//    	iconCls: 'upload-icon',
//    	tooltip: '上传附件',
//    	handler : function() {
//    			if (!uploadWin) {
//							uploadWin = new Ext.Window({
//								el : 'uploadWin',
//								title : '资料上传',
//								layout : 'fit',
//								width : 330,
//								height : 200,
//								modal : true,
//								closeAction : 'hide',
//								items : [new Ext.Panel({
//									contentEl : 'uploadDiv'
//								})]
//							})
//							uploadWin.on("hide", assignUploadInfo)
//						}
//				uploadWin.show();
//				if (uploadWin) {
//							document.all("uploadIFrame").src = "Business/document/uploadFile.htm"
//									//+ record.get("filelsh");
//						}
//    	}
//    })
	 
	 		var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
		//url: "/wbf/servlet/FlwServlet?ac=extUpload",
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传附件',
			iconCls: 'upload',
			//disabled: true,
			handler: function(){
				var filename = fileForm.form.findField("filename1").getValue()
				
				fileForm.getForm().submit({
					method: 'POST',
	          		params:{ac:'upload'},
					waitTitle: '请等待...',
					waitMsg: '上传中...',
					success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show();
						Ext.MessageBox.hide();
			            uploadWin.hide();
						var infos = action.result.msg;
						var fileid = infos[0].fileid; 
						var filename = infos[0].filename;
						formPanelinsert.getForm().findField('filelsh').setValue(fileid);
						formPanelinsert.getForm().findField('filename').setValue(filename);
						//formPanelinsert.getForm().findField('materialname').setValue(filename)
					},
					failure: function(form, action){
						Ext.Msg.alert('Error', 'File upload failure.'); 
					}
				})
			}
		}]
	});
	
	function uploadFile(){
		if (fileForm.items) 
			fileForm.items.removeAt(0);
			fileForm.insert({   
			    xtype: 'textfield',   
			    fieldLabel: '流水号',   
			    name: 'fileid1',
			    readOnly: true,
			    hidden: true,
			    hideLabel: true,
			    anchor: '90%'  // anchor width by percentage   
			  },{   
			    xtype: 'textfield',   
			    fieldLabel: '请选择文件',   
			    name: 'filename1',   
			    inputType: 'file',   
			    allowBlank: false,   
			    blankText: 'File can\'t not empty.',   
			    anchor: '90%'  // anchor width by percentage   
			  });
				uploadWin = new Ext.Window({
				title: '附件上传',
				layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
				maximizable: false, closable: true,
				resizable: false, modal: true, border: false,
				width: 380, height: 130,
				items: [fileForm]
		});
		uploadWin.show();
	}
	
	 var upload = new Ext.Button({
	 	id : 'newupload',
    	iconCls: 'upload-icon',
    	tooltip: '上传附件',
    	handler: uploadFile
    })
    
    
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
    ////////////////////////////////////////////////////
    
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
    
    var billstateCombo = new Ext.form.ComboBox({
				name : 'billstate',
				fieldLabel : '状态',
				disabled : true,
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : dsJzhType,
				lazyRender : true,
				listClass : 'x-combo-list-small',
				anchor : '95%'
			});
			
	////////////////////////////////////加载表单//////////////////////////////////////
	
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
	}
    /////////////////////////////////////////////////////////////////////////////////
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
						            store: zltypeStore,
						     
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
    			layout: 'form',
                cls:'x-plain',  
                items: [
   					new fm.TextField(fc['materialname'])
          			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
                cls:'x-plain',  
                items: [
   					new fm.TextField(fc['weavecompany'])
          			]
    		}),
    		/////////////////////////////////////////////////////////////////
    		new Ext.form.FieldSet({
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .31,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		
		                		   new fm.NumberField(fc['quantity'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							//new fm.TextField(fc['book']),
				            	new fm.TextField(fc['infoid'])
					      ]
    				  }    				
    			]
    		}),
    	
    		
    		////////////////////////////////////////////////////////////////
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
    							
	    						new fm.TextField(fc['pid']),
	    						new fm.TextField(fc['flwinsid'])
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
		                		
		                		//comboxWithTree
	   							billstateCombo
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
	   				ds.baseParams.params = " infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
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
    		ds.baseParams.params = "infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
	    	var form = formPanelinsert.getForm();
			//form.findField("indexid").setValue(selectedTreeData);
			form.findField("pid").setValue(currentPid);
			form.findField("responpeople").setValue(username);
	        form.findField("billstate").setValue(4);
	        form.findField("orgid").setValue(USERORGID);
	        form.findField("quantity").setValue(0);
    			
    	}else{
    		formWindow.hide();
    		ds.baseParams.params = "infoid not in ( select zlid from da_daml in class "+beanA+") and (billstate=2 or billstate=4)"
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
   ////////////////////////////////////按钮函数/////////////////////////////////////////////////////////////////////////////////////////////////
	//新增按钮
	function insertFun(){
		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:'资料录入归档',
                layout:'fit',
                width:450,
                height:300,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	formPanelinsert.getForm().reset();
       	formWindow.show();
        
		var form = formPanelinsert.getForm();
		//form.findField("indexid").setValue(selectedTreeData);
		form.findField("pid").setValue(currentPid);
		form.findField("responpeople").setValue(username);
        form.findField("billstate").setValue(4);
        form.findField("orgid").setValue(USERORGID);
		form.findField("quantity").setValue(0);
	}
	//组卷按钮
    function slectok(){
    	var record = sm.getSelected();
//		var id = record.get('infoid');
		record = sm.getSelections();// 得到选择的记录
		var ids = new Array();
		if (record != null) {
			DWREngine.setAsync(false);
			for (var i = 0; i < record.length; i++) {
				//ids.push(record[i].get('infoid'))
				zlMgm.savegdzl(record[i].get('infoid'),selectdaid);
				zlMgm.updataAnther(selectdaid);
			}
			//zlMgm.savegdzl(ids,selectdaid)//selectdaid
			DWREngine.setAsync(true);
			Ext.example.msg('归档成功！', '您归档了' + record.length + '条资料信息！');
			//parent.zjinfoWin.hide();
			ds.baseParams.params ="  indexid like '"
				+ selectedTreeData + "%'  and infoid not in ( select zlid from da_daml in class "+beanA+") and infoid not in (select infoid from zl_info_jy in class  "+beanB+") and (billstate=2 or billstate=4)"
			//ds.baseParams.params = "infoid not in ( select zlid from da_daml in class "+beanA+") and infoid not in (select infoid from zl_info_jy in class  "+beanB+") and (billstate=2 or billstate=4)";
			ds.load({
				     start : 0,
				     limit : PAGE_SIZE
				});
    		parent.ds.load({
			params:{
			 	start: 0,
			 	limit: PAGE_SIZE
			}
		});
		if(parent.parent)
				 parent.parent.ds.load({
					params:{
					 	start: 0,
					 	limit: PAGE_SIZE
					}
				});

		} else {
			Ext.MessageBox.show({
				title : '警告',
				msg : '该条资料信息尚未保存！请保存后重试！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
    }
    //修改按钮
    function updatezl(){
    	if(!formWindow){
            formWindow = new Ext.Window({	               
                title:'资料录入归档',
                layout:'fit',
                width:450,
                height:300,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       	}
       	formWindow.show();
       	loadForm();
    }
    //查询按钮
    function QueryWinwdow(){
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
				items : [QueryzlPanel]
			});
		}
		QueryzlPanel.getForm().reset();
		formWin.show();
    }
    //查看流程附件
    function showFlowAdjunct(){
      	var record = sm.getSelected();
		var _insid = record.get('flwinsid');
    	adjunctWindow = new Ext.Window({	               
		title: '查看流程附件',
		iconCls: 'copyUser',
		width: 300,
		height: 200,
		modal: true, layout: 'fit',
		closeAction: 'hide',
		maximizable: false,
		resizable: false,
		plain: true,
		items: [gridAdjunct]
		});
		adjunctWindow.show();
		dsAdjunct.baseParams.params = "insid='"+_insid+"'";
		dsAdjunct.load();
    }
/////  //////////execel 导入功能 //////////////////////////////////////////////////////////////////////
    function showExcelWin(){
		if(!fileWin){
			var fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:30,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 390,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
			var fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:450,
				height:100,
				items:[fileForm]
			})
		}
		fileWin.show()
	}
	
	function doExcelUpLoad(){
	
		var win = this.ownerCt.ownerCt
		this.ownerCt.getForm().submit({
			waitTitle:'请稍候...',
			waitMsg:'数据上传中...',
			url:MAIN_SERVLET+"?ac=ImportExcel&bean="+bean+"&business="+business+"&method=insert",
//			params:{
//				ac:'upExcel',
//				bean:bean,
//				business:business
//			},
			success:function(form,action){
				Ext.Msg.alert('恭喜',action.result.msg,function(v){
					win.close()
					//showViewWin()
				})
			},
			failure:function(form,action){
				Ext.Msg.alert('提示',action.result.msg,function(v){
					win.close()
					//showViewWin()
				})
			}
		})
	
		
		
	}	
///////////////////////////////////////////////////////////////////

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
				+ selectedTreeData + "%'  and infoid not in ( select zlid from da_daml in class "+beanA+") and infoid not in (select infoid from zl_info_jy in class  "+beanB+") and (billstate=2 or billstate=4)"
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

});
