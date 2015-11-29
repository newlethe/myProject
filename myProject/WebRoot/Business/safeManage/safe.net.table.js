var treePanel, gridPanel;
var ServletUrl = MAIN_SERVLET
var formPanelTitle = "安环监察网络表"
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.pmis.safeManage.hbm.SafeUser";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = "bh";
var orderColumn = "bh";
var root;
var formWin;
var formWindow;
var formPanel;
var selectedTreeData;
var sextype=new Array();

Ext.onReady(function (){
	DWREngine.setAsync(false);
	appMgm.getCodeValue('性别',function(list){         //获取编制单位类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			sextype.push(temp);			
		}
    });
    DWREngine.setAsync(true);
	
    var sextypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : sextype
    });
    
	var fm = Ext.form;			// 包名简写（缩写）
	
	root = new Ext.tree.AsyncTreeNode({
		text : '用户类型',
		iconCls : 'form'

	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "userTypeTree",
			businessName : "safeManageMgmImpl",
			parent : 'root'
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
			header : '名称',
			width : 260,
			hidden : true,
			dataIndex : 'name'
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'id',
            hidden : true,
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        }],
		loader : treeLoader,
		root : root
	});

	treePanel.on('click', function(node) {
		var elNode = node.getUI().elNode;
		selectedTreeData = node.text;
		PlantInt.type = selectedTreeData;
		ds.baseParams.params = "  type = '"
				+ selectedTreeData + "'"
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});

    var fc = {		// 创建编辑域配置
    	'bh': {
			name: 'bh',
			fieldLabel: '编号',
			hidden : true,
			hideLabel : true,
			anchor:'95%'
        }, 'name': {
			name: 'name',
			fieldLabel: '姓名',
			allowBlank: false,
			anchor:'95%'
		}, 'department': {
			name: 'department',
			fieldLabel: '单位名称',
			anchor:'95%'
		}, 'sex': {
			name: 'sex',
			fieldLabel: '性别',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: sextypeStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'birthday': {
			name: 'birthday',
			fieldLabel: '出生日期',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'position': {
			name: 'position',
			fieldLabel: '职务',
			anchor:'95%'
		}, 'education': {
			name: 'education',
			fieldLabel: '教育程度',
 			anchor:'95%'
        }, 'begin_work': {
			name: 'begin_work',
			fieldLabel: '参加工作时间',
            format: 'Y-m-d',
 			anchor:'95%'
        }, 'time_with_secuty': {
			name: 'time_with_secuty',
			fieldLabel: '从事安全工作时间',
			anchor:'95%'
		}, 'id': {
			name: 'id',
			fieldLabel: '身份证号码',
			anchor:'95%'
		}, 'certification_class': {
			name: 'certification_class',
			fieldLabel: '安监证书类别',
			anchor:'95%'
		}, 'certification_no': {
			name: 'certification_no',
			fieldLabel: '安监证书编号',
			anchor:'95%'
		}, 'department_give_certification': {
			name: 'department_give_certification',
			fieldLabel: '安监证书颁发部门',
			anchor:'95%'
		}, 'type': {
			name: 'type',
			fieldLabel: '人员类别',
			anchor:'95%'
		}, 'photo': {
			name: 'photo',
			fieldLabel: '照片',
			anchor:'95%'
		}, 'bz': {
			name: 'bz',
			fieldLabel: '备注',
			height: 80,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'bh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'name', type: 'string'},
		{name: 'department', type: 'string'},    	
		{name: 'sex', type: 'string'},
    	{name: 'birthday', type: 'date',dateFormat: 'Y-m-d'},
    	{name: 'position', type: 'string'},
    	{name: 'education', type: 'string'},
    	{name: 'begin_work', type: 'date', dateFormat: 'Y-m-d'},
    	{name: 'time_with_secuty', type: 'float'},
    	{name: 'id', type: 'string'},
		{name: 'certification_class', type: 'string'},
		{name: 'certification_no', type: 'string'},
		{name: 'department_give_certification', type: 'string'},
		{name: 'type', type: 'string'},
		{name: 'bz', type: 'string'}
		];
		
	var Fields = Columns.concat([ // 表单增加的列
					{name: 'photo', type: 'string'}])
			
    var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
    var PlantInt = {
    	bh: '',
    	name: '', 
    	department: '',
    	sex: '',
    	birthday: '',
    	position: '',
    	education: '',
    	begin_work: '',
    	time_with_secuty: '',
    	id: '',
    	certification_class: '',
    	certification_no: '',
    	department_give_certification: '',
    	type: '',
    	photo: '',
    	bz: ''
    };
    Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt);
	
    var sm =  new Ext.grid.CheckboxSelectionModel();
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'bh',
           header: fc['bh'].fieldLabel,
           dataIndex: fc['bh'].name,
           hidden:true,
           width: 50
        }, {
           id:'name',
           header: fc['name'].fieldLabel,
           dataIndex: fc['name'].name,
           width: 80
        }, {
           id:'department',
           header: fc['department'].fieldLabel,
           dataIndex: fc['department'].name,
           width: 100
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 50,
           renderer: sexComboBoxRenderer
        }, {
           id:'birthday',
           header: fc['birthday'].fieldLabel,
           dataIndex: fc['birthday'].name,
           width: 80
        }, {
           id:'position',
           header: fc['position'].fieldLabel,
           dataIndex: fc['position'].name,
           width: 80
        }, {
           id:'education',
           header: fc['education'].fieldLabel,
           dataIndex: fc['education'].name,
           width: 80
        }, {
           id:'begin_work',
           align: 'center',
           header: fc['begin_work'].fieldLabel,
           dataIndex: fc['begin_work'].name,
           renderer:formatDateTime,
           width: 80
        }, {
           id:'time_with_secuty',
           align: 'center',
           header: fc['time_with_secuty'].fieldLabel,
           dataIndex: fc['time_with_secuty'].name,
           width: 80
        }, {
           id:'id',
           header: fc['id'].fieldLabel,
           dataIndex: fc['id'].name,
           width: 100
        }, {
           id:'certification_class',
           header: fc['certification_class'].fieldLabel,
           dataIndex: fc['certification_class'].name,
           width: 80
        }, {
           id:'certification_no',
           header: fc['certification_no'].fieldLabel,
           dataIndex: fc['certification_no'].name,
           width: 80
           
        }, {
           id:'department_give_certification',
           header: fc['department_give_certification'].fieldLabel,
           dataIndex: fc['department_give_certification'].name,
           width: 80
        }, {
           id:'type',
           header: fc['type'].fieldLabel,
           dataIndex: fc['type'].name,
           width: 80
        }, {
           id:'photo',
           header: fc['photo'].fieldLabel,
           dataIndex: fc['photo'].name,
           hidden: true,
           width: 80
        }, {
           id:'bz',
           header: fc['bz'].fieldLabel,
           dataIndex: fc['bz'].name,
           hidden: true,
           width: 80
        }
        
	]);
    cm.defaultSortable = true;						//设置是否可排序

    ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : " 1=1"
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
    
    var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updateUser
	});
		
    gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'grid-panel', // id,可选
		ds : ds, // 数据源
		cm : cm, // 列模型
		sm : sm, // 行选择模式
		tbar : [], // 顶部工具栏，可选
		title : '安环监察网络表', // 面板标题
		border : false, // 
		region : 'center',
		clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
		header : true, //
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
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
		business : business, // business名称，可选
		primaryKey : primaryKey, // 主键列名称，必须
		insertHandler : insertFun, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFun,
		saveHandler : saveFun
	});

	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,gridPanel]
    });	
	
    gridPanel.showHideTopToolbarItems("save", false);
    var gridTopBar = gridPanel.getTopToolbar()
	with (gridTopBar) {
		add(update);
	}
   
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
	
	
  function updateUser(){
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
   
    function insertFun(){
    	
    	if (selectedTreeData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边的用户类型！',
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
       	formPanelinsert.getForm().reset();
       	formWindow.show();
        
		var form = formPanelinsert.getForm();
		form.findField("type").setValue(selectedTreeData);
    }
    
    function deleteFun(){
    	if (sm.getCount() > 0) {
    			gridPanel.defaultDeleteHandler(); 
    	}
    }    
	
    function saveFun(){
    	gridPanel.defaultSaveHandler();
    }        
    
    treePanel.render();
	treePanel.expand();
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
    };
    
    function sexComboBoxRenderer(value){
	for(var i=0; i<sextype.length; i++){
    	if (value == sextype[i][0])
     		return sextype[i][1]
	}
}
    
	function formSave() {
			var form = formPanelinsert.getForm()
			if (form.isValid()) {
				doFormSave(true)	
			}
	}
	
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
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
						formPanelinsert.getForm().findField('photo').setValue(fileid);
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
    			title: '',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		                		 new fm.TextField(fc['name'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['department'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.ComboBox({
				            		name: 'sex',
									fieldLabel: '性别',
									allowBlank : false,
									emptyText : '请选择...',
									valueField: 'k',
									displayField: 'v',
									mode: 'local',
						            typeAhead: true,
						            triggerAction: 'all',
						            store: sextypeStore,
						            lazyRender: true,
						            listClass: 'x-combo-list-small',
									anchor: '95%'
				            	})
    					      ]
    				  }  ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['birthday'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['position'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['education'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['begin_work'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.NumberField(fc['time_with_secuty'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['id'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['certification_class'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['certification_no'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['department_give_certification'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['type'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['photo'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							upload
    					      ]
    				  },{
    					layout: 'form', columnWidth: .8,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bz']),
    							new fm.TextField(fc['bh'])
    					      ]
    				  }        
    				  
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
    	if (obj.bh == '' || obj.bh == null){
	   		safeManageMgmImpl.insertSafeUser(obj, function(){
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
   			safeManageMgmImpl.updateSafeUser(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
	   				ds.baseParams.params = "  type = '"
						+ selectedTreeData + "'"
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
//    		ds.baseParams.params = "  indexid like '"
//				+ selectedTreeData + "%'"
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
    	}else{
    		formWindow.hide();
//    		ds.baseParams.params = "  indexid like '"
//				+ selectedTreeData + "%'"
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
	
	
});
