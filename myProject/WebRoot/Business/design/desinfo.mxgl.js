var ServletUrl = MAIN_SERVLET
var bean = "com.sgepit.pmis.design.hbm.DesignInfoGl"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "infoid"
var orderColumn = "bzrq"
var gridPanelTitle ="设计文件列表"
var formPanelTitle = "设计文件组卷"
var pageSize = PAGE_SIZE;
var SPLITB = "`"
var treeData = new Array();
var BillState = new Array();
var databzdw=new Array();
var datazy=new Array();
var damj=new Array();
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
var selectedBM
var rootText = "设计文件分类";
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
var PID=CURRENTAPPID;
Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "designinfoTree",
			businessName : "designinfoMgm",
			parent : 0,
			pid:PID
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
			header : '设计名称',
			width : 400,
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

	var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updatedept
	});
	

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
    appMgm.getCodeValue('文件密级',function(list){         //获取编制单位类型
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
			name : 'mc',
			fieldLabel : '设计文件题名',
			//height: 80,
			width: 600,
			//xtype: 'htmleditor',
			anchor:'95%'
		},
		'bzrq' : {
			name : 'bzrq',
			fieldLabel : '编制日期',
			width : 45,
			allowBlank: false,
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '数量',
			hidden : true,
			hideLabel : true,
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
	
		'bzr':{
			name : 'bzr',
			fieldLabel : '编制人',
			anchor : '95%'
		},
		'infobh':{
			name : 'infobh',
			fieldLabel : '编号',	
			readOnly : true,
			hidden : true,
			hideLabel : true,
			
			anchor : '95%'
		},
			'bm':{
			name : 'bm',
			fieldLabel : '编码',	
			readOnly : true,
			hidden : true,
			hideLabel : true,			
			anchor : '95%'
		},
		'filelsh':{
			name : 'filelsh',
			fieldLabel : '电子文档',
			anchor : '95%'
		},'filename':{
			name : 'filename',
			fieldLabel : '文件名称',
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
				id : 'infoid',
				header : fc['infoid'].fieldLabel,
				dataIndex : fc['infoid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			},{
				id : 'bzr',
				header : fc['bzr'].fieldLabel,
				dataIndex : fc['bzr'].name,
				width : 150
			}, {
				id : 'bm',
				header : fc['bm'].fieldLabel,
				dataIndex : fc['bm'].name,
				width : 200,
				hidden : true
			},{
				id : 'infobh',
				header : fc['infobh'].fieldLabel,
				dataIndex : fc['infobh'].name,
				width : 200,
				hidden : true
			},
			{
				id : 'mc',
				header : fc['mc'].fieldLabel,
				dataIndex : fc['mc'].name,
				width : 300
			},{
				id : 'bzrq',
				header : fc['bzrq'].fieldLabel,
				dataIndex : fc['bzrq'].name,
				width : 150,
				renderer : formatDate
			},{
				id : 'indexid',
				header : fc['indexid'].fieldLabel,
				dataIndex : fc['indexid'].name,
				hidden : true
			},
			{
				id : 'filelsh',
				header : fc['filelsh'].fieldLabel,
				dataIndex : fc['filelsh'].name,
				width : 120,
				renderer : fileicon
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
				name : 'indexid',
				type : 'string'
			}, {
				name : 'mc',
				type : 'string'
			},{
				name : 'bzrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'sl',
				type : 'float'
			}, {
				name : 'bz',
				type : 'string'
			},{
				name : 'bzr',
				type : 'string'
			},{
				name : 'bm',
				type : 'string'
			},
			{
				name : 'infobh',
				type : 'string'
			},
			{
				name : 'filelsh',
				type : 'string'
			},
			{
				name : 'filename',
				type : 'string'
			}
			
			];
	var Fields = Columns.concat([ // 表单增加的列
	      
			])

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	PlantInt = {
		bzr:username,
		mc: ''
	}; // 初始值
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt, {
		bzrq: new Date
	});

	// 4. 创建数据源

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : " indexid like '"
					+ selectedTreeData + "%'"
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

	/* var printMenu = new Ext.menu.Menu({
        id: 'mainMenu',
        items: [
            {
                text: '打印案卷题名',
                iconCls: 'print',
                handler: PrintFmWinwdow
            },'-', {
                text: '打印卷内备考表',
                iconCls: 'print',
                handler: PrintJNBKBWinwdow
            },'-', {
                text: '打印案卷目录',
                iconCls: 'print',
                handler: PrintfnmlWinwdow
            },'-', {
                text: '打印卷内目录',
                iconCls: 'print',
                handler: PrintMLWinwdow
            },'-',
            {
                text: '打印案卷脊背(1.5cm格式)',
                iconCls: 'print',
                handler: PrintBJWinwdow
            },'-',
            {
                text: '打印案卷脊背(2cm格式)',
                iconCls: 'print',
                handler: PrintBJ2Winwdow
            },'-',
            {
                text: '打印案卷脊背(2.5cm格式)',
                iconCls: 'print',
                handler: PrintBJ25Winwdow
            },'-',
            {
                text: '打印案卷脊背(3cm格式)',
                iconCls: 'print',
                handler: PrintBJ3Winwdow
            },'-',
            {
                text: '打印案卷脊背(4cm格式)',
                iconCls: 'print',
                handler: PrintBJ4Winwdow
            },'-',
            {
                text: '打印案卷脊背(5cm格式)',
                iconCls: 'print',
                handler: PrintBJ5Winwdow
            },'-',
             {
                text: '打印案卷脊背(6cm格式)',
                iconCls: 'print',
                handler: PrintBJ6Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(7cm格式)',
                iconCls: 'print',
                handler: PrintBJ7Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(8cm格式)',
                iconCls: 'print',
                handler: PrintBJ8Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(9cm格式)',
                iconCls: 'print',
                handler: PrintBJ9Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(10cm格式)',
                iconCls: 'print',
                handler: PrintBJ10Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(11cm格式)',
                iconCls: 'print',
                handler: PrintBJ11Winwdow
            }
            ,'-',
             {
                text: '打印案卷脊背(12cm格式)',
                iconCls: 'print',
                handler: PrintBJ12Winwdow
            }
        ]
    });

    */
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
		addBtn:false,
		delBtn:false,
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
		business : "baseMgm", // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		saveHandler : saveFun,
		//deleteMethod : 'delete'
		deleteHandler : deleteFun
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE,
			arams : " indexid like '"
					+ selectedTreeData + "%'"
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
	//	add(update,'-',dazl,'-',btnDaQuery,'-',{text:'打印', iconCls: 'print', menu:printMenu});//btnPrintFM,'-',btnPrintJNBKB,'-',btnPrintBJ,'-',btnPrintML);
	//	add(update,'-');
	}
	// 11. 事件绑定
	sm.on('selectionchange', function(sm) { // grid 行选择事件
				var record = sm.getSelected();
				var tb = grid.getTopToolbar();
				if (record != null) {
					//tb.items.get("dazl").enable();
					tb.items.get("update").enable();
					/*tb.items.get("printfm").enable();
					tb.items.get("printjnbkb").enable();
					tb.items.get("printml").enable();
					tb.items.get("printbj").enable();*/
					
					
				} else {
					//tb.items.get("dazl").disable();
					tb.items.get("update").disable();
					/*tb.items.get("printfm").disable();
					tb.items.get("printjnbkb").disable();
					tb.items.get("printml").disable();
					tb.items.get("printbj").disable();*/
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
	
	function formatDateTime(value) {
		return (value && value instanceof Date)
				? value.dateFormat('Y-m-d H:i')
				: value;
	};
	
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
    ////////////////////////////////////////////////////


	// 6. 创建表单form-panel
	var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		iconCls: 'icon-detail-form',
		labelAlign: 'top',
	 	items: [
    			new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
					            // new fm.TextField(fc['dh'])
	   						new fm.TextField(fc['bzr']),
	   						new fm.TextField(fc['infoid'])		
						]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    								new fm.DateField(fc['bzrq'])   							
    						   ]
    				} ,
    				{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    								new fm.TextField(fc['pid']) 							
    						   ]
    				}   	
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
                //border:true, 
               // title:'案卷题名',
                cls:'x-plain',  
                items: [
   					//fc['mc']
                new fm.TextField(fc['mc'])
                   	
				]
    		}),
    		new Ext.form.FieldSet({
    			//title: '基本信息',
                //border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                			new fm.TextField(fc['filename'])
		                	
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
 								 new fm.TextField(fc['filelsh']),
		                		 new fm.TextField(fc['indexid'])
				         
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
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
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					fc['bz']
                   	
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
//            	history.back();
            	formWindow.hide();
            }
        }]
	});
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
       	operate="0";
       	formPanelinsert.getForm().reset();
       	formWindow.show();
        
		var form = formPanelinsert.getForm();
		form.findField("indexid").setValue(selectedTreeData);
		form.findField("pid").setValue(PID);
		form.findField("bzr").setValue(username);
	
	
		//form.findField("mc").setValue('山西耀光煤电有限责任公司2×200MW机组');       
	};

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
       	operate="1";
       	formWindow.show();
       	loadForm();
   }
   /*
   function dazlwin(){
	     if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
							title : '警告',
							msg : '请选择将要组卷的记录！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
						return;
	    }
        var record = sm.getSelected();
		var id = record.get('daid');
		if (!dazjWin) {
			dazjWin = new Ext.Window({
				title : '组卷信息',
				layout : 'fit',
				border : false,
      			modal : true,
				width : document.body.clientWidth,
				height : document.body.clientHeight,
				closeAction : 'hide',
				items : [new Ext.Panel({
							contentEl : 'dazjDiv'
						})]
		});
	}
		
	dazjWin.show();
    
	if (dazjWin) {
		document.all('dazjIFrame').src = "Business/document/da.zl.info.jsp?id="+id
	}
   }
   */
	function saveFun() {
		grid.defaultSaveHandler();

	};
	
	
	function deleteFun(){
		var id = sm.getSelected().get(primaryKey)
		zlMgm.getRowCount(id,function(cn){
			if (0 < cn){
					Ext.Msg.show({
					   title: '提示',
					   msg: '该档案下还有资料,不能删除！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO 
					});
				}else{
					grid.defaultDeleteHandler()
				}
		})
	}
	
	
	

	function formSave() {
		var form = formPanelinsert.getForm()
		if (form.isValid()) {
			doFormSave()	
		}
		var ids = form.findField(primaryKey).getValue();

	}

	function partbRender(value) {
		var str = '';
		for (var i = 0; i < databzdw.length; i++) {
			if (databzdw[i][0] == value) {
				str = databzdw[i][1]
				break;
			}
		}
		return str;
	}
	function partzyRender(value) {
		var str = '';
		for (var i = 0; i < datazy.length; i++) {
			if (datazy[i][0] == value) {
				str = datazy[i][1]
				break;
			}
		}
		return str;
	}
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
	function fileicon(value) {
		if (value != '') {
			return "<center><a href='" + BASE_PATH
					+ "servlet/MainServlet?ac=downloadfile&fileid="
					+ value + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>"
		} else {

		}
	}
	function doFormSave(dataArr){
    	var form = formPanelinsert.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = n=='infobh'?field.getRawValue():field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.infoid == '' || obj.infoid == null){
	   		zlMgm.savedesigninfogl(obj, function(){
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
   			zlMgm.updatedesigninfogl(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
	   				ds.baseParams.params = " indexid like '"
								+ selectedTreeData + "%' and bm like '" + selectedBM + "'"
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
    		 ds.baseParams.params = " indexid like '"
				+ selectedTreeData + "%' and bm like '"+selectedBM+"'"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
    		var form = formPanelinsert.getForm();
			form.findField("indexid").setValue(selectedTreeData);
			form.findField("pid").setValue(PID);
			form.findField("bzr").setValue(username);
			//form.findField("orgid").setValue(USERORGID);
			//form.findField("zys").setValue('0');
			//var substr=selectedTreeData.substring(0,3);
		   //	form.findField("dh").setValue('0100'+'-'+selectedBM+"-");
		    //form.findField("mc").setValue('山西耀光煤电有限责任公司2×200MW机组');
    		
    	}else{
    		formWindow.hide();
            ds.baseParams.params = " indexid like '"
				+ selectedTreeData + "%' and bm like'" + selectedBM + "%'"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    	}
    }
	function formCancel() {
		formWindow.hide();
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
	var formDialogWin;
	
	treePanel.on('click', function(node) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		selectedTreeData = elNode.all("indexid").innerText;
		selectedBM = elNode.all("bm").innerText;
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
		ds.baseParams.params = " indexid like '"
				+ selectedTreeData + "%' and bm like'" +selectedBM + "%'"
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

/*移除html标签和空格
		*/
	 function   Del(Word)   {   
		  a =Word.indexOf("<");   
		  b =Word.indexOf(">");   
		  len =Word.length;   
		  c  =Word.substring(0,   a);   
		  if(b ==-1)   
		  b  =a;   
		  d  =Word.substring((b   +   1),   len);   
		  Word  =c+d;   
		  tagCheck =Word.indexOf("<");   
		  if(tagCheck!=-1)   
		  Word =Del(Word);  
	  	  re=new   RegExp("&nbsp;","ig");   
	      var ss =Word.replace(re,"");        
		  return   ss;   
	  }

})