var bean = "com.sgepit.pmis.safeManage.hbm.SafeEnterpriseAccident";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "bh";//主表主健
var orderColumn = "bh";//从表排序字段
var selectedData;
var gridPanelB;
var formWin;
var formWindow;
var formPanel;
var formPanelTitle = "电力建设施工企业职工伤概况"

Ext.onReady(function() {

	var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'bzrq' : {
			name : 'bzrq',
			fieldLabel : '编制日期',
			format: 'Y-m-d'
		},'tbdw' : {
			name : 'tbdw',
			fieldLabel : '填表单位'
		},'ypjzgrs' : {
			name : 'ypjzgrs',
			fieldLabel : '月平均职工人数',
			anchor : '95%'
		},'dwfzrqz' : {
			name : 'dwfzrqz',
			fieldLabel : '单位负责人签章',
			anchor : '95%'
		},'ckfarqz' : {
			name : 'ckfarqz',
			fieldLabel : '处科负责人签章',
			anchor : '95%'
		},'zbrqz' : { 
			name : 'zbrqz',
			fieldLabel : '制表人签章',
			anchor : '95%'
		},'bcrq' : {
			name : 'bcrq',
			fieldLabel : '报出日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'zdswsg' : {
			name : 'zdswsg',
			fieldLabel : '重大伤亡事故',
			anchor : '95%'
		},'swsg' : {
			name : 'swsg',
			fieldLabel : '死亡事故',
			anchor : '95%'
		},'zssg' : {
			name : 'zssg',
			fieldLabel : '重伤事故',
			anchor : '95%'
		},'qssg' : {
			name : 'qssg',
			fieldLabel : '轻伤事故',
			anchor : '95%'
		},'fbsw' : {
			name : 'fbsw',
			fieldLabel : '分包死亡',
			anchor : '95%'
		},'fbzs' : {
			name : 'fbzs',
			fieldLabel : '分包重伤',
			anchor : '95%'
		},'fbqsw' : {
			name : 'fbqsw',
			fieldLabel : '非本企死亡',
			anchor : '95%'
		},'fbqzs' : {
			name : 'fbqzs',
			fieldLabel : '非本企重伤',
			anchor : '95%'
		},'fbqqs' : {
			name : 'fbqqs',
			fieldLabel : '非本企轻伤',
			anchor : '95%'
		},'zjjjss' : {
			name : 'zjjjss',
			fieldLabel : '直接经济损失（元）',
			anchor : '95%'
		},'ssgzrzs' : {
			name : 'ssgzrzs',
			fieldLabel : '受伤害人损失工作日总数',
			anchor : '95%'
		},'swl' : {
			name : 'swl',
			fieldLabel : '死亡率',
			anchor : '95%'
		},'zsl' : {
			name : 'zsl',
			fieldLabel : '重伤率',
			anchor : '95%'
		},'ljswl' : {
			name : 'ljswl',
			fieldLabel : '累计死亡率',
			anchor : '95%'
		},'ljzsl' : {
			name : 'ljzsl',
			fieldLabel : '累计重伤率',
			anchor : '95%'
		},'bh' : {
			name : 'bh',
			fieldLabel : '编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},'jhlx' : {
			name : 'jhlx',
			fieldLabel : '计划类型',
			anchor : '95%'
		},'sj' : {
			name : 'sj',
			fieldLabel : '时间',
			anchor : '95%'
		},'nd' : {
			name : 'nd',
			fieldLabel : '计划年度',
			anchor : '95%'
		},'sglb' : {
			name : 'sglb',
			fieldLabel : '事故类别',
			anchor : '95%'
		}
		
	}

    var Columns = [
    	{name: 'bzrq',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
    	{name: 'tbdw', type: 'string'},
    	{name: 'ypjzgrs', type: 'string'},
    	{name: 'dwfzrqz', type: 'string'}, 
    	{name: 'ckfarqz', type: 'string'},
		{name: 'zbrqz', type: 'string'},
		{name: 'bcrq',  type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'zdswsg', type: 'string'}, 
		{name: 'swsg', type: 'string'},
		{name: 'zssg', type: 'string'},
		{name: 'bh', type: 'string'},
		{name: 'qssg', type: 'string'}
		];
	
	var Fields = Columns.concat([ // 表单增加的列
					{name: 'fbsw', type: 'string'},
					{name: 'fbzs', type: 'string'},
					{name: 'fbqsw', type: 'string'},
					{name: 'fbqzs', type: 'string'},
					{name: 'fbqqs', type: 'string'},
					{name: 'zjjjss', type: 'string'},
					{name: 'ssgzrzs', type: 'string'},
					{name: 'swl', type: 'string'},
					{name: 'zsl', type: 'string'},
					{name: 'ljswl', type: 'string'},
					{name: 'ljzsl', type: 'string'},
					{name: 'jhlx', type: 'string'},
					{name: 'sj', type: 'string'},
					{name: 'nd', type: 'string'},
					{name: 'sglb', type: 'string'}
					])
					
	var Plant = Ext.data.Record.create(Columns);
	var PlantFields = Ext.data.Record.create(Fields);
	var PlantFieldsInt = new Object();
	
	var PlantInt = {
		bzrq : '',
		tbdw : '',
		ypjzgrs : '',
		dwfzrqz:'',
		ckfarqz:'',
		zbrqz:'',
		bcrq : '',
		zdswsg:'',
		swsg: '',
		zssg: '',
		qssg:''
	}
	
	Ext.applyIf(PlantFieldsInt, PlantInt);
	PlantFieldsInt = Ext.apply(PlantFieldsInt);
	
	var sm =  new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel([
	sm,{
		id : 'bzrq',
		header : fc['bzrq'].fieldLabel,
		dataIndex : fc['bzrq'].name,
		renderer: formatDate,
		width : 100
	},{
		id : 'tbdw',
		header : fc['tbdw'].fieldLabel,
		dataIndex : fc['tbdw'].name,
		width : 100
	}, {
		id : 'ypjzgrs',
		header : fc['ypjzgrs'].fieldLabel,
		dataIndex : fc['ypjzgrs'].name,
		width : 100
	}, {
		id : 'dwfzrqz',
		header : fc['dwfzrqz'].fieldLabel,
		dataIndex : fc['dwfzrqz'].name,
		width : 120
	}, {
		id : 'ckfarqz',
		header : fc['ckfarqz'].fieldLabel,
		dataIndex : fc['ckfarqz'].name,
		width : 80
	}, {
		id : 'zbrqz',
		header : fc['zbrqz'].fieldLabel,
		dataIndex : fc['zbrqz'].name,
		width : 120
	}, {
		id : 'bcrq',
		header : fc['bcrq'].fieldLabel,
		dataIndex : fc['bcrq'].name,
		width : 100,
		renderer: formatDate
	}, {
		id : 'zdswsg',
		header : fc['zdswsg'].fieldLabel,
		dataIndex : fc['zdswsg'].name,
		width : 100
	}, {
		id : 'swsg',
		header : fc['swsg'].fieldLabel,
		dataIndex : fc['swsg'].name,
		width : 100
	},{
		id : 'zssg',
		header : fc['zssg'].fieldLabel,
		dataIndex : fc['zssg'].name,
		width : 100
	},{
		id : 'qssg',
		header : fc['qssg'].fieldLabel,
		dataIndex : fc['qssg'].name,
		width : 100
	}])
	
	cm.defaultSortable = true;
	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'asc');
	
	 var update = new Ext.Button({
		id : 'update',
		text : '修改',
		tooltip : '修改',
		iconCls : 'btn',
		handler : updateUser
	});
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : [],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 5,
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
		primaryKey : primaryKey,
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
    
    function formSave() {
			var form = formPanelinsert.getForm()
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
		                		 new fm.DateField(fc['bzrq'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    					        new fm.TextField(fc['tbdw'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ypjzgrs'])
    					      ]
    				  }  ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['dwfzrqz'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ckfarqz'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zbrqz'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['bcrq'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zdswsg'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['swsg'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zssg'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['qssg'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fbsw'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fbzs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fbqsw'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fbqzs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['fbqqs'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zjjjss'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ssgzrzs'])
    					      ]
    				  }  ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['swl'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['zsl'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ljswl'])
    					      ]
    				  }   ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['ljzsl'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['jhlx'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['sj'])
    					      ]
    				  }   ,{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['nd'])
    					      ]
    				  } ,{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['sglb'])
    					      ]
    				  },{
    					layout: 'form', columnWidth: .32,
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
	   		safeManageMgmImpl.insertSafeEnterpriseAccident(obj, function(){
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
   			safeManageMgmImpl.updateSafeEnterpriseAccident(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
//	   				ds.baseParams.params = "  type = '"
//						+ selectedTreeData + "'"
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
	
	

	//-----------------------------------------从grid begin-------------------------
	var cmB = new Ext.grid.ColumnModel([
	smB, {
		id : 'xh',
		header : fcB['xh'].fieldLabel,
		dataIndex : fcB['xh'].name
	},{
		id : 'jssjsw',
		header : fcB['jssjsw'].fieldLabel,
		dataIndex : fcB['jssjsw'].name
	}, {
		id : 'jssjzs',
		header : fcB['jssjzs'].fieldLabel,
		dataIndex : fcB['jssjzs'].name,
		width : 40
	}, {
		id : 'sbsssw',
		header : fcB['sbsssw'].fieldLabel,
		dataIndex : fcB['sbsssw'].name,
		width : 40
	}, {
		id : 'sbsszs',
		header : fcB['sbsszs'].fieldLabel,
		dataIndex : fcB['sbsszs'].name,
		width : 40
	}, {
		id : 'aqsssw',
		header : fcB['aqsssw'].fieldLabel,
		dataIndex : fcB['aqsssw'].name,
		width : 40
	}, {
		id : 'sqsszs',
		header : fcB['sqsszs'].fieldLabel,
		dataIndex : fcB['sqsszs'].name,
		width : 40
	}, {
		id : 'sccdhjsw',
		header : fcB['sccdhjsw'].fieldLabel,
		dataIndex : fcB['sccdhjsw'].name,
		width : 60,
		hidden : true
	}, {
		id : 'sccdhjzs',
		header : fcB['sccdhjzs'].fieldLabel,
		dataIndex : fcB['sccdhjzs'].name,
		width : 60
	}, {
		id : 'grfhsw',
		header : fcB['grfhsw'].fieldLabel,
		dataIndex : fcB['grfhsw'].name,
		width : 60
	}, {
		id : 'grfhzs',
		header : fcB['grfhzs'].fieldLabel,
		dataIndex : fcB['grfhzs'].name,
		width : 60
	}, {
		id : 'myaqczsw',
		header : fcB['myaqczsw'].fieldLabel,
		dataIndex : fcB['myaqczsw'].name,
		width : 30,
		hidden : true
	}, {
		id : 'myaqczzs',
		header : fcB['myaqczzs'].fieldLabel,
		dataIndex : fcB['myaqczzs'].name,
		width : 30,
		hidden : true
	}, {
		id : 'wfczsw',
		header : fcB['wfczsw'].fieldLabel,
		dataIndex : fcB['wfczsw'].name,
		width : 30,
		hidden : true
	}, {
		id : 'wfczzs',
		header : fcB['wfczzs'].fieldLabel,
		dataIndex : fcB['wfczzs'].name,
		width : 30,
		hidden : true
	}, {
		id : 'ldzzsw',
		header : fcB['ldzzsw'].fieldLabel,
		dataIndex : fcB['ldzzsw'].name,
		width : 30,
		hidden : true
	}, {
		id : 'ldzzzs',
		header : fcB['ldzzzs'].fieldLabel,
		dataIndex : fcB['ldzzzs'].name,
		width : 30,
		hidden : true
	}, {
		id : 'sjcsw',
		header : fcB['sjcsw'].fieldLabel,
		dataIndex : fcB['sjcsw'].name,
		width : 30,
		hidden : true
	},{
		id : 'sjczs',
		header : fcB['sjczs'].fieldLabel,
		dataIndex : fcB['sjczs'].name,
		width : 30,
		hidden : true
	},{
		id : 'jybzsw',
		header : fcB['jybzsw'].fieldLabel,
		dataIndex : fcB['jybzsw'].name,
		width : 30,
		hidden : true
	},{
		id : 'jybzzs',
		header : fcB['jybzzs'].fieldLabel,
		dataIndex : fcB['jybzzs'].name,
		width : 30,
		hidden : true
	},{
		id : 'qtsw',
		header : fcB['qtsw'].fieldLabel,
		dataIndex : fcB['qtsw'].name,
		width : 30,
		hidden : true
	},{
		id : 'qtzs',
		header : fcB['qtzs'].fieldLabel,
		dataIndex : fcB['qtzs'].name,
		width : 30,
		hidden : true
	},{
		id : 'sglb',
		header : fcB['sglb'].fieldLabel,
		dataIndex : fcB['sglb'].name,
		width : 30,
		hidden : true
	},{
		id : 'bh',
		header : fcB['bh'].fieldLabel,
		dataIndex : fcB['bh'].name,
		width : 30,
		hidden : true
	},{
		id : 'gcbh',
		header : fcB['gcbh'].fieldLabel,
		dataIndex : fcB['gcbh'].name,
		width : 30,
		hidden : true
	},{
		id : 'rqlx',
		header : fcB['rqlx'].fieldLabel,
		dataIndex : fcB['rqlx'].name,
		width : 30,
		hidden : true
	}
	])
	cmB.defaultSortable = true;
	

	gridPanelB = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-gridB-panel',
		ds : dsB,
		cm : cmB,
		sm : smB,
		tbar : [],
		border : false,
		region : 'south',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : true, // 是否可折叠
		split:true,
		model: 'mini',
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		height: 300, 
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsB,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : PlantB,
		plantInt : PlantIntB,
		servletUrl : MAIN_SERVLET,
		bean:beanB,
		business : businessB,
		primaryKey : primaryKeyB,
		insertHandler : insertFunB, // 自定义新增按钮的单击方法，可选
		deleteHandler : deleteFunB,
		saveHandler : saveFunB
	});
	
	
	dsB.on('load',function(){
		if(sm.getSelected()){
			var bh = sm.getSelected().get('bh')
//			if(sm.getSelected().get('appMoney') != dsB.sum('sum')&&appid != null){
//				sm.getSelected().set('appMoney',dsB.sum('sum'))
//				sm.getSelected().commit()
//				//appBuyMgm.updateSumPrice(appid)
//			}
		}
	})

	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		items: [gridPanel,gridPanelB]
		
	}) 

	//-----------------------------------------从grid end---------------------------
  	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	
	gridPanel.showHideTopToolbarItems("save", false);
	var gridTopBar = gridPanel.getTopToolbar()
	with (gridTopBar) {
		add(update);
	}
	
	gridPanelB.showHideTopToolbarItems("save", false);
    var gridTopBar = gridPanelB.getTopToolbar()
	with (gridTopBar) {
		add(updateB);
	}
	//-------------------------------------------function ------------------------------
	
   sm.on('rowselect', function(sm, rowIndex, record){
   		var bh = record.get('bh');
   		selectedData = record.get('bh');
   		dsB.baseParams.params = " bh ='" + bh + "'";
   		dsB.load({ params:{start: 0, limit: PAGE_SIZE }});
   })	


   function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
	
});

