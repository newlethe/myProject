var treePanel, gridPanel;
var ServletUrl = MAIN_SERVLET
var formPanelTitle = "三级安全教育卡片"
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.pmis.safeManage.hbm.SafeEducationCard";
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
	
    var fc = {		// 创建编辑域配置
    	'bh': {
			name: 'bh',
			fieldLabel: '编号',
			hidden : true,
			hideLabel : true,
			anchor:'95%'
        }, 'xm': {
			name: 'xm',
			fieldLabel: '姓名',
			allowBlank: false,
			anchor:'95%'
		}, 'bm': {
			name: 'bm',
			fieldLabel: '部门',
			anchor:'95%'
		}, 'bz': {
			name: 'bz',
			fieldLabel: '班组',
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
		}, 'tjjg': {
			name: 'tjjg',
			fieldLabel: '体检结果',
			anchor:'95%'
		}, 'jg': {
			name: 'jg',
			fieldLabel: '籍贯',
			anchor:'95%'
		}, 'ygxs': {
			name: 'ygxs',
			fieldLabel: '用工形式',
 			anchor:'95%'
        }, 'gs_jynr': {
			name: 'gsJynr',
			fieldLabel: '公司教育内容',
 			anchor:'95%'
        }, 'gs_rq': {
			name: 'gsRq',
			fieldLabel: '公司教育日期',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'gs_kscj': {
			name: 'gsKscj',
			fieldLabel: '公司考试成绩',
			anchor:'95%'
		}, 'gs_aqfzr': {
			name: 'gsAqfzr',
			fieldLabel: '公司安全负责人',
			anchor:'95%'
		}, 'bm_jynr': {
			name: 'bmJynr',
			fieldLabel: '部门教育内容',
			anchor:'95%'
		}, 'bm_rq': {
			name: 'bmRq',
			fieldLabel: '部门教育日期',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'bm_kscj': {
			name: 'bmKscj',
			fieldLabel: '部门考试成绩',
			anchor:'95%'
		}, 'bm_aqfzr': {
			name: 'bmAqfzr',
			fieldLabel: '部门安全负责人',
			anchor:'95%'
		}, 'bz_jynr': {
			name: 'bzJynr',
			fieldLabel: '班组教育内容',
			anchor:'95%'
		}, 'bz_rq': {
			name: 'bzRq',
			fieldLabel: '班组教育日期',
			anchor:'95%'
		}, 'bz_kscj': {
			name: 'bzKscj',
			fieldLabel: '班组考试成绩',
			anchor:'95%'
		}, 'bz_fzr': {
			name: 'bzFzr',
			fieldLabel: '班组负责人',
			anchor:'95%'
		}, 'gcmc': {
			name: 'gcmc',
			fieldLabel: '工程名称',
			anchor:'95%'
		}, 'kssj': {
			name: 'kssj',
			fieldLabel: '开始时间',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'wgsj': {
			name: 'wgsj',
			fieldLabel: '完工时间',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'sgrs': {
			name: 'sgrs',
			fieldLabel: '事故认识',
			format: 'Y-m-d',
			anchor:'95%'
		}, 'comm': {
			name: 'comm',
			fieldLabel: '备注',
			height: 80,
			width: 600,
			xtype: 'htmleditor',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'bh', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'xm', type: 'string'},
		{name: 'bm', type: 'string'},    	
		{name: 'bz', type: 'string'},
    	{name: 'sex', type: 'string'},
    	{name: 'tjjg', type: 'string'},
    	{name: 'jg', type: 'string'},
    	{name: 'ygxs', type: 'string'},
    	{name: 'gsJynr', type: 'float'},
    	{name: 'gsRq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'gsKscj', type: 'string'},
		{name: 'gsAqfzr', type: 'string'},
		{name: 'bmJynr', type: 'string'},
		{name: 'bmRq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'bmKscj', type: 'string'},
		{name: 'bmAqfzr', type: 'string'},
		{name: 'bzJynr', type: 'string'},
		{name: 'bzRq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'bzKscj', type: 'string'},
		{name: 'bzFzr', type: 'string'},
		{name: 'gcmc', type: 'string'},
		{name: 'kssj', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'wgsj', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'sgrs', type: 'string'}
		];
		
	var Fields = Columns.concat([ // 表单增加的列
					{name: 'comm', type: 'string'}])
			
    var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
    var PlantInt = {
    	bh: '',
    	xm: '', 
    	bm: '',
    	bz: '',
    	sex: ''
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
           id:'xm',
           header: fc['xm'].fieldLabel,
           dataIndex: fc['xm'].name,
           width: 80
        }, {
           id:'bm',
           header: fc['bm'].fieldLabel,
           dataIndex: fc['bm'].name,
           width: 100
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 50,
           renderer: sexComboBoxRenderer
        }, {
           id:'bz',
           header: fc['bz'].fieldLabel,
           dataIndex: fc['bz'].name,
           width: 80
        }, {
           id:'tjjg',
           header: fc['tjjg'].fieldLabel,
           dataIndex: fc['tjjg'].name,
           width: 80
        }, {
           id:'jg',
           header: fc['jg'].fieldLabel,
           dataIndex: fc['jg'].name,
           width: 80
        }, {
           id:'ygxs',
           align: 'center',
           header: fc['ygxs'].fieldLabel,
           dataIndex: fc['ygxs'].name,
           //renderer:formatDateTime,
           width: 80
        }, {
           id:'gs_jynr',
           align: 'center',
           header: fc['gs_jynr'].fieldLabel,
           dataIndex: fc['gs_jynr'].name,
           width: 80
        }, {
           id:'gs_rq',
           header: fc['gs_rq'].fieldLabel,
           dataIndex: fc['gs_rq'].name,
           renderer:formatDate,
           width: 100
        }, {
           id:'gs_kscj',
           header: fc['gs_kscj'].fieldLabel,
           dataIndex: fc['gs_kscj'].name,
           width: 80,
           editor: new fm.TextField(fc['gs_kscj'])
        }, {
           id:'gs_aqfzr',
           header: fc['gs_aqfzr'].fieldLabel,
           dataIndex: fc['gs_aqfzr'].name,
           width: 80
           
        }, {
           id:'bm_jynr',
           header: fc['bm_jynr'].fieldLabel,
           dataIndex: fc['bm_jynr'].name,
           width: 80
        }, {
           id:'bm_rq',
           header: fc['bm_rq'].fieldLabel,
           dataIndex: fc['bm_rq'].name,
           renderer:formatDate,
           width: 80
        }, {
           id:'bm_kscj',
           header: fc['bm_kscj'].fieldLabel,
           dataIndex: fc['bm_kscj'].name,
           width: 80
        }, {
           id:'bm_aqfzr',
           header: fc['bm_aqfzr'].fieldLabel,
           dataIndex: fc['bm_aqfzr'].name,
           hidden: true,
           width: 80
        }, {
           id:'bz_jynr',
           header: fc['bz_jynr'].fieldLabel,
           dataIndex: fc['bz_jynr'].name,
           hidden: true,
           width: 80
        }, {
           id:'bz_rq',
           header: fc['bz_rq'].fieldLabel,
           dataIndex: fc['bz_rq'].name,
           renderer:formatDate,
           hidden: true,
           width: 80
        }, {
           id:'bz_kscj',
           header: fc['bz_kscj'].fieldLabel,
           dataIndex: fc['bz_kscj'].name,
           hidden: true,
           width: 80
        }, {
           id:'bz_fzr',
           header: fc['bz_fzr'].fieldLabel,
           dataIndex: fc['bz_fzr'].name,
           hidden: true,
           width: 80
        }, {
           id:'comm',
           header: fc['comm'].fieldLabel,
           dataIndex: fc['comm'].name,
           hidden: true,
           width: 80
        }, {
           id:'gcmc',
           header: fc['gcmc'].fieldLabel,
           dataIndex: fc['gcmc'].name,
           hidden: true,
           width: 80
        }, {
           id:'kssj',
           header: fc['kssj'].fieldLabel,
           dataIndex: fc['kssj'].name,
           renderer:formatDate,
           hidden: true,
           width: 80
        }, {
           id:'wgsj',
           header: fc['wgsj'].fieldLabel,
           dataIndex: fc['wgsj'].name,
          renderer:formatDate,
           hidden: true,
           width: 80
        }, {
           id:'sgrs',
           header: fc['sgrs'].fieldLabel,
           dataIndex: fc['sgrs'].name,
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
		title : formPanelTitle, // 面板标题
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
		//form.findField("type").setValue(selectedTreeData);
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
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
    };
    
    function sexComboBoxRenderer(value){
	for(var i=0; i<sextype.length; i++){
    	if (value == sextype[i][0])
     		return sextype[i][1]
	}
}
    
	function formSave() {
			var form = formPanelinsert.getForm();
//			alert(form.getValues());
//			return
			if (form.isValid()) {
				doFormSave(true)	
			}
	}
	  
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
		                		 new fm.TextField(fc['xm'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['bm'])
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
    							new fm.TextField(fc['bz'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['tjjg'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['jg'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ygxs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['gs_jynr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['gs_rq'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['gs_kscj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['gs_aqfzr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bm_jynr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['bm_rq'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bm_kscj'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bm_aqfzr'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bz_jynr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['bz_rq'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bz_kscj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bz_fzr'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['gcmc'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['kssj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['wgsj'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['sgrs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['bh'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: 1.,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['comm'])
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
//    	alert(Ext.encode(obj));
//    		return
    	DWREngine.setAsync(false);
    	if (obj.bh == '' || obj.bh == null){
    		
	   		safeManageMgmImpl.insertSafeEducationCard(obj, function(){
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
   			safeManageMgmImpl.updateSafeEducationCard(obj, function(){
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
			ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
    		formPanelinsert.getForm().reset();
    	}else{
    		formWindow.hide();
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
