var bean = "com.sgepit.frame.flow.hbm.ZlInfo";
var bodyPanelTitle='部门资料信息';
var BillState = new Array();
var currentPid = CURRENTAPPID;
Ext.onReady(function (){
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
    var fm = Ext.form;
    
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
			fieldLabel : '责任人',
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
			fieldLabel : '张',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			anchor : '95%'
		},
		'weavecompany' : {
			name : 'weavecompany',
			fieldLabel : '编制人/单位',
			allowBlank : false,
			anchor : '95%'
		},
		'book' : {
			name : 'book',
			fieldLabel : '本',
			allowBlank : false,
			anchor : '95%'
		},
		'portion' : {
			name : 'portion',
			fieldLabel : '份',
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
		}
	}
    
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
			}, {
				name : 'billState',
				type : 'float'
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
			}];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (infoid == null || infoid == 'null' || infoid == ''){
    	loadFormRecord = new formRecord({
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
			portion : ''
	    });
    } else {
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, ggid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	} 	

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
		   						 new fm.TextField(fc['indexid']),
		                		 new fm.TextField(fc['fileno']),
		                		 new fm.TextField(fc['materialname']),
		                		 new fm.TextField(fc['responpeople']),
		                		 new fm.DateField(fc['stockdate'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['weavecompany']),
				            	new fm.NumberField(fc['quantity']),
				            	new fm.NumberField(fc['book']),
				            	new fm.NumberField(fc['portion']),
				            	new fm.TextField(fc['billstate'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						new fm.TextField(fc['filelsh']),
				         	 	
				            	new fm.TextField(fc['filename']),
				            	
				            	{
					            	border: false,
	    							layout: 'form',
	    							bodyStyle: 'padding: 3px',
					            	items: [upload]
				            	},
				            	new fm.TextField(fc['infoid']),
				            	new fm.TextField(fc['pid']),
				            	new fm.TextField(fc['orgid'])
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
            	history.back();
            }
        }]
	});
//var upload = new Ext.Button({
//	 	id : 'newupload',
//    	iconCls: 'select',
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
    
     var contentPanel = new Ext.Panel({
        border: false,
        header : false,
        region:'center',
        tbar: [
    			new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
					iconCls: 'title'
				})
				],
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[formPanelinsert]
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
    
    //数据加载
    formPanelinsert.getForm().loadRecord(loadFormRecord);

    function formSave(){
    	var form = formPanelinsert.getForm()
    	if (form.isValid()){
    		doFormSave();
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
					   msg: '是否继续新增?　　　',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			zlMgm.updatezlinfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				var url = BASE_PATH+"jsp/zlgl/zl.dept.input.jsp?indexid=" 
    					+ selectedTreeData + "&selectorgid=" + selectorgid;
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
   function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"jsp/zlgl/zl.dept.input.jsp?indexid=" 
    			+ selectedTreeData + "&selectorgid=" + selectorgid;
    		
			window.location.href = url;
    	}else{
    		history.back();
    	}
    }
	function formCancel() {
		// formPanel.getForm().reset();
		formWindow.hide();
	}

});




