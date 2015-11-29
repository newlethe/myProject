var beanB = "com.sgepit.pmis.safeManage.hbm.SafeAccidentReport"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "bh";
var orderColumnB = "bh";
var formWin;
var formWindow;
var formPanel;
var formPanelTitle = "受伤人员情况"
var sextype=new Array();
var smB = new Ext.grid.CheckboxSelectionModel()

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

var fm = Ext.form;
var fcB = {
	'bh' : {
		name : 'bh',
		fieldLabel : '编号',
		hidden : true,
		hideLabel : true
	},
	'sgbh' : {
		name : 'sgbh',
		fieldLabel : '事故编号',
		hidden : true,
		hideLabel : true
	},
	'xm' : {
		name : 'xm',
		fieldLabel : '姓名',
		anchor : '95%'
	}, 'xb': {
			name: 'xb',
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
		},
	'nl' : {
		name : 'nl',
		fieldLabel : '年龄',
		anchor : '95%'
	},
	'zw' : {
		name : 'zw',
		fieldLabel : '职务',
		anchor : '95%'
	},
	'zb' : {
		name : 'zb',
		fieldLabel : '职别',
		anchor : '95%'
	},
	'price' : {
		name : 'price',
		fieldLabel : '单价',
		anchor : '95%'
	},
	'gz' : {
		name : 'gz',
		fieldLabel : '工种',
		anchor : '95%'
	},
	'gl' : {
		name : 'gl',
		fieldLabel : '工龄',
		anchor : '95%'
	},
	'whcd' : {
		name : 'whcd',
		fieldLabel : '文化程度',
		anchor : '95%'
	},
	'bgzgl' : {
		name : 'bgzgl',
		fieldLabel : '本工种工龄',
		anchor : '95%'
	},
	'shcd' : {
		name : 'shcd',
		fieldLabel : '伤害程度',
		anchor : '95%'
	},
	'zrhf' : {
		name : 'zrhf',
		fieldLabel : '责任划分',
		anchor : '95%'
	},
	'jyqk' : {
		name : 'jyqk',
		fieldLabel : '安全培训教育情况',
		anchor : '95%'
	},
	'jaqk' : {
		name : 'jaqk',
		fieldLabel : '结案情况',
		anchor : '95%'
	},
	'jawh' : {
		name : 'jawh',
		fieldLabel : '结案文号',
		anchor : '95%'
	},
	'jasj' : {
		name : 'jasj',
		fieldLabel : '结案时间',
		format: 'Y-m-d',
		anchor : '95%'
	},
	'sgclyj' : {
		name : 'sgclyj',
		fieldLabel : '事故处理意见',
		anchor : '95%'
	},
	'tbdw' : {
		name : 'tbdw',
		fieldLabel : '填报单位',
		anchor : '95%'
	},
	'tbrxm' : {
		name : 'tbrxm',
		fieldLabel : '填报人姓名',
		anchor : '95%'
	},
	'tbrq' : {
		name : 'tbrq',
		fieldLabel : '填报日期',
		format: 'Y-m-d',
		anchor : '95%'
	},
	'file_lsh' : {
		name : 'file_lsh',
		fieldLabel : '事故处理意见（文件）',
		selectOnFocus : true,
		anchor : '95%'
	}
}

var ColumnsB = [{
			name : 'bh',
			type : 'string'
		}, {
			name : 'sgbh',
			type : 'string'
		}, {
			name : 'xm',
			type : 'string'
		}, {
			name : 'xb',
			type : 'string'
		}, {
			name : 'nl',
			type : 'float'
		}, {
			name : 'zw',
			type : 'string'
		}, {
			name : 'zb',
			type : 'string'
		}, {
			name : 'gz',
			type : 'string'
		}, {
			name : 'gl',
			type : 'float'
		}, {
			name : 'whcd',
			type : 'string'
		}, {
			name : 'bgzgl',
			type : 'float'
		}, {
			name : 'shcd',
			type : 'string'
		}, {
			name : 'zrhf',
			type : 'string'
		}, {
			name : 'jyqk',
			type : 'string'
		}, {
			name : 'jaqk',
			type : 'string'
		}, {
			name : 'jawh',
			type : 'string'
		}, {
			name : 'jasj',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}, {
			name : 'sgclyj',
			type : 'string'
		}, {
			name : 'tbdw',
			type : 'string'
		}, {
			name : 'tbrxm',
			type : 'string'
		}, {
			name : 'tbrq',
			type : 'date',
			dateFormat : 'Y-m-d H:i:s'
		}];

var Fields = ColumnsB.concat([ // 表单增加的列
					{name: 'file_lsh', type: 'string'}])
var PlantFields = Ext.data.Record.create(Fields);
var PlantFieldsInt = new Object();					
var PlantB = Ext.data.Record.create(ColumnsB);

var PlantIntB = {
	bh : '',
	sgbh : '',
	xm : '',
	xb : '',
	nl : null,
	zw : '',
	zb : '',
	gz : '',
	gl : null,
	whcd : '',
	bgzgl : null,
	shcd : '',
	zrhf : '',
	jyqk : '',
	jawh : '',
	jasj : '',
	sgclyj : '',
	tbdw : '',
	tbrxm : '',
	tbrq : '',
	file_lsh : ''
}
 Ext.applyIf(PlantFieldsInt, PlantIntB);
 PlantFieldsInt = Ext.apply(PlantFieldsInt);
	
var dsB = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : beanB,
				business : businessB,
				method : listMethodB,
				params : null
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : primaryKeyB
					}, ColumnsB),
			remoteSort : true,
			pruneModifiedRecords : true
		});
dsB.setDefaultSort(orderColumnB, 'asc');

var update = new Ext.Button({
			id : 'update',
			text : '修改',
			tooltip : '修改',
			iconCls : 'btn',
			handler : updateUser
		});

function insertFun() {
	if (selectedData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的事故！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}
		
	if (!formWindow) {
		formWindow = new Ext.Window({
					title : formPanelTitle,
					layout : 'fit',
					width : 600,
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
	form.findField("tbrq").setValue(new Date);
	form.findField("sgbh").setValue(selectedData);
}

function deleteFun() {
	if (smB.getCount() > 0) {
		gridPanelB.defaultDeleteHandler();
	}
}

function saveFun() {
	gridPanelB.defaultSaveHandler();
}

function updateUser() {
	if (!smB.hasSelection()) {
		Ext.MessageBox.show({
					title : '警告',
					msg : '请选择将要修改的记录！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}
	if (!formWindow) {
		formWindow = new Ext.Window({
					title : formPanelTitle,
					layout : 'fit',
					width : 600,
					height : 400,
					closeAction : 'hide',
					plain : true,
					items : formPanelinsert,
					animEl : 'action-new'
				});
	}
	formWindow.show();
	loadForm();
}

function formSave() {
	var form = formPanelinsert.getForm()
	if (form.isValid()) {
		doFormSave(true)
	}
}

var fileForm = new Ext.FormPanel({
	fileUpload : true,
	header : false,
	border : false,
	url : MAIN_SERVLET + "?ac=upload",
	fileUpload : true,
	bodyStyle : 'padding: 20px 20px;',
	autoScroll : true,
	labelAlign : 'right',
	bbar : ['->', {
		id : 'uploadBtn',
		text : '上传附件',
		iconCls : 'upload',
		//disabled: true,
		handler : function() {
			var filename = fileForm.form.findField("filename1").getValue()

			fileForm.getForm().submit({
				method : 'POST',
				params : {
					ac : 'upload'
				},
				waitTitle : '请等待...',
				waitMsg : '上传中...',
				success : function(form, action) {
					tip = Ext.QuickTips.getQuickTip();
					tip
							.setTitle(
									'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!',
									'icon-success')
					tip.show();
					Ext.MessageBox.hide();
					uploadWin.hide();
					var infos = action.result.msg;
					var fileid = infos[0].fileid;
					var filename = infos[0].filename;
					formPanelinsert.getForm().findField('file_lsh')
							.setValue(fileid);
				},
				failure : function(form, action) {
					Ext.Msg.alert('Error', 'File upload failure.');
				}
			})
		}
	}]
});

function uploadFile() {
	if (fileForm.items)
		fileForm.items.removeAt(0);
	fileForm.insert({
				xtype : 'textfield',
				fieldLabel : '流水号',
				name : 'fileid1',
				readOnly : true,
				hidden : true,
				hideLabel : true,
				anchor : '90%' // anchor width by percentage   
			}, {
				xtype : 'textfield',
				fieldLabel : '请选择文件',
				name : 'filename1',
				inputType : 'file',
				allowBlank : false,
				blankText : 'File can\'t not empty.',
				anchor : '90%' // anchor width by percentage   
			});
	uploadWin = new Ext.Window({
				title : '附件上传',
				layout : 'fit',
				closeAction : 'hide',
				iconCls : 'upload',
				maximizable : false,
				closable : true,
				resizable : false,
				modal : true,
				border : false,
				width : 380,
				height : 130,
				items : [fileForm]
			});
	uploadWin.show();
}

var upload = new Ext.Button({
			id : 'newupload',
			iconCls : 'upload-icon',
			tooltip : '上传附件',
			handler : uploadFile
		})

var formPanelinsert = new Ext.FormPanel({
	id : 'form-panel',
	header : false,
	border : false,
	autoScroll : true,
	//bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
	iconCls : 'icon-detail-form',
	labelAlign : 'top',
	//listeners: {beforeshow: handleActivate},
	items : [new Ext.form.FieldSet({
		title : '',
		border : true,
		layout : 'column',
		items : [{
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['xm'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.ComboBox({
								name : 'xb',
								fieldLabel : '性别',
								allowBlank : false,
								emptyText : '请选择...',
								valueField : 'k',
								displayField : 'v',
								mode : 'local',
								typeAhead : true,
								triggerAction : 'all',
								store : sextypeStore,
								lazyRender : true,
								listClass : 'x-combo-list-small',
								anchor : '95%'
							})]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['nl'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['zw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['zb'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['gz'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['gl'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['whcd'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['bgzgl'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['shcd'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['zrhf'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['jyqk'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['jaqk'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['jawh'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items :  [new fm.DateField(fcB['jasj'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['sgclyj'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.TextField(fcB['tbdw'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items :  [new fm.TextField(fcB['tbrxm'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items :  [new fm.DateField(fcB['tbrq'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items :  [new fm.TextField(fcB['file_lsh'])]
				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    							upload
    					      ]
    			}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items:[
    							new fm.TextField(fcB['bh']),
    							new fm.TextField(fcB['sgbh'])
    					      ]
				}

		]
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
});

function doFormSave(dataArr) {
	var form = formPanelinsert.getForm()
	var obj = form.getValues()
	for (var i = 0; i < ColumnsB.length; i++) {
		var n = ColumnsB[i].name;
		var field = form.findField(n);
		if (field) {
			obj[n] = field.getValue();
		}
	}
	DWREngine.setAsync(false);
	if (obj.bh == '' || obj.bh == null) {
		safeManageMgmImpl.insertSafeAccident(obj, function() {
					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
					Ext.Msg.show({
								title : '提示',
								msg : '是否继续新增?',
								buttons : Ext.Msg.YESNO,
								fn : processResult,
								icon : Ext.MessageBox.QUESTION
							});
				});
	} else {
		safeManageMgmImpl.updateSafeAccident(obj, function() {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					formWindow.hide();
					dsB.baseParams.params = "  sgbh = '" + selectedData
							+ "'"
					dsB.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				});
	}
	DWREngine.setAsync(true);
}

function processResult(value) {
	if ("yes" == value) {
		    		dsB.baseParams.params = "  sgbh = '"
						+ selectedData + "'"
		dsB.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
		formPanelinsert.getForm().reset();
	} else {
		formWindow.hide();
		    		dsB.baseParams.params = "  sgbh = '"
						+ selectedData + "'"
		dsB.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}
}

function loadForm(){
		//////////
		var form = formPanelinsert.getForm();
    	if (smB.getSelected()!=null)
    	{
    		var gridRecod = smB.getSelected()
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
	    		var ids = smB.getSelected().get(primaryKeyB)
	    		baseMgm.findById(beanB, ids, function(rtn){
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
		    				for(var i=0; i<ColumnsB.length; i++){
		    					if (typeof(obj[ColumnsB[i].name])!="undefined"){
		    						obj[ColumnsB[i].name] = gridRecod.get(ColumnsB[i].name)
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
	
	
function formCancel() {
	// formPanel.getForm().reset();
	formWindow.hide();
}

function sexComboBoxRenderer(value) {
	for (var i = 0; i < sextype.length; i++) {
		if (value == sextype[i][0])
			return sextype[i][1]
	}
}

