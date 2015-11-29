var treePanel, gridPanel;
var ServletUrl = MAIN_SERVLET
var formPanelTitle = "严重未遂事故登记表"
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.pmis.safeManage.hbm.SevereAccidentRegister";
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

	var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	'bh': {
			name: 'bh',
			fieldLabel: '编号',
			hidden : true,
			hideLabel : true,
			anchor:'95%'
        }, 'sgdw': {
			name: 'sgdw',
			fieldLabel: '事故单位',
			allowBlank: false,
			anchor:'95%'
		}, 'sgbh': {
			name: 'sgbh',
			fieldLabel: '事故编号',
			anchor:'95%'
		}, 'sgsj': {
			name: 'sgsj',
			fieldLabel: '事故时间',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'sgdd': {
			name: 'sgdd',
			fieldLabel: '事故地点',
			anchor:'95%'
		}, 'dsr': {
			name: 'dsr',
			fieldLabel: '当事人',
			anchor:'95%'
		}, 'fileLsh': {
			name: 'fileLsh',
			fieldLabel: '未遂事故经过及原因',
			height: 60,
			width: 300,
			xtype: 'htmleditor',
 			anchor:'95%'
        }, 'zgcs': {
			name: 'zgcs',
			fieldLabel: '整改措施',
			height: 60,
			width: 300,
			xtype: 'htmleditor',
 			anchor:'95%'
        }, 'zgdw': {
			name: 'zgdw',
			fieldLabel: '整改单位',
			anchor:'95%'
		}, 'fzr': {
			name: 'fzr',
			fieldLabel: '负责人',
			anchor:'95%'
		}, 'wgq': {
			name: 'wgq',
			fieldLabel: '完工期',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'ajkyj': {
			name: 'ajkyj',
			fieldLabel: '安监科意见',
			height: 60,
			width: 300,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'ldps': {
			name: 'ldps',
			fieldLabel: '领导批示',
			height: 60,
			width: 300,
			xtype: 'htmleditor',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'bh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'sgdw', type: 'string'},
		{name: 'sgbh', type: 'string'},    	
    	{name: 'sgsj', type: 'date',dateFormat : 'Y-m-d H:i:s'},
    	{name: 'sgdd', type: 'string'},
    	{name: 'dsr', type: 'string'},
		{name: 'zgcs', type: 'string'},
		{name: 'zgdw', type: 'string'},
		{name: 'fzr', type: 'string'},
		{name: 'wgq', type: 'date',dateFormat : 'Y-m-d H:i:s'},
		{name: 'ajkyj', type: 'string'},
		{name: 'ldps', type: 'string'}
		];
		
	var Fields = Columns.concat([ // 表单增加的列
					{name: 'fileLsh', type: 'string'}])
			
    var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
    var PlantInt = {
    	bh: '',
    	sgdw: '', 
    	sgbh: '',
    	sgsj: '',
    	sgdd: '',
    	dsr: '',
    	zgcs: '',
    	zgdw: '',
    	fzr: '',
    	wgq: '',
    	ajkyj: '',
    	ldps: ''
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
           width: 100
        }, {
           id:'sgdw',
           header: fc['sgdw'].fieldLabel,
           dataIndex: fc['sgdw'].name,
           width: 100,
           editor: new fm.TextField(fc['sgdw'])
        }, {
           id:'sgbh',
           header: fc['sgbh'].fieldLabel,
           dataIndex: fc['sgbh'].name,
           width: 100,
           editor: new fm.TextField(fc['sgbh'])
        }, {
           id:'sgsj',
           header: fc['sgsj'].fieldLabel,
           dataIndex: fc['sgsj'].name,
           width: 100,
           renderer: formatDateTime,
           editor: new fm.DateField(fc['sgsj'])
        }, {
           id:'sgdd',
           header: fc['sgdd'].fieldLabel,
           dataIndex: fc['sgdd'].name,
           width: 100,
           editor: new fm.TextField(fc['sgdd'])
        }, {
           id:'dsr',
           header: fc['dsr'].fieldLabel,
           dataIndex: fc['dsr'].name,
           width: 100,
           editor: new fm.TextField(fc['dsr'])
        }, {
           id:'zgcs',
           header: fc['zgcs'].fieldLabel,
           dataIndex: fc['zgcs'].name,
           width: 100,
           editor: new fm.TextField(fc['zgcs'])
        }, {
           id:'zgdw',
           header: fc['zgdw'].fieldLabel,
           dataIndex: fc['zgdw'].name,
           width: 100
        }, {
           id:'fzr',
           header: fc['fzr'].fieldLabel,
           dataIndex: fc['fzr'].name,
           width: 100,
           editor: new fm.TextField(fc['fzr'])
        }, {
           id:'wgq',
           header: fc['wgq'].fieldLabel,
           dataIndex: fc['wgq'].name,
           width: 100,
           renderer:formatDateTime,
           editor: new fm.DateField(fc['wgq'])
        }, {
           id:'ajkyj',
           header: fc['ajkyj'].fieldLabel,
           dataIndex: fc['ajkyj'].name,
           width: 100,
           editor: new fm.TextField(fc['ajkyj'])
        }, {
           id:'ldps',
           header: fc['ldps'].fieldLabel,
           dataIndex: fc['ldps'].name,
           width: 100,
           editor: new fm.TextField(fc['ldps'])
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
		title : '严重未遂事故登记表', // 面板标题
		border : false, // 
		region : 'center',
		clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
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
	ds.load();
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
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
		form.findField("sgsj").setValue(new Date());
		form.findField("wgq").setValue(new Date());
    }
    
    function deleteFun(){
    	if (sm.getCount() > 0) {
    			gridPanel.defaultDeleteHandler(); 
    	}
    }    
	
    function saveFun(){
    	gridPanel.defaultSaveHandler();
    }        
    

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
    
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
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['sgdw'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['sgbh'])
    					      ]
    				  }  ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['sgsj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['sgdd'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['dsr'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zgdw'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fzr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['wgq'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fileLsh'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zgcs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ajkyj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ldps'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
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
	   		safeManageMgmImpl.insertSevereAccidentRegister(obj, function(){
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
   			safeManageMgmImpl.updateSevereAccidentRegister(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
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
