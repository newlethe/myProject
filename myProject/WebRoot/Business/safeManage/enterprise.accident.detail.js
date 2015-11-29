var beanB = "com.sgepit.pmis.safeManage.hbm.SafeEnterpriseDetail"
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "gcbh";
var orderColumnB = "gcbh";
var formWinB;
var formWindowB;
var formPanel;
var formPanelTitleB = "电力建设施工企业职工伤亡事详细"
var sextype=new Array();
var smB = new Ext.grid.CheckboxSelectionModel()
var planType = [['1','年度计划'],['11','第一季度'],['12','第二季度'],['13','第三季度'],['14','第四季度'],['1101','一月'],['1102','二月'],['1103','三月'],['1204','四月'],['1307','七月'],['1410','十月'],['1412','十二月']];

DWREngine.setAsync(false);

var planTypeStore = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : planType
		});
		
var fm = Ext.form;
var fcB = {
	'xh' : {
		name : 'xh',
		fieldLabel : '编号',
		anchor : '95%'
	},
	'jssjsw' : {
		name : 'jssjsw',
		fieldLabel : '技术设计死亡',
		anchor : '95%'
	},
	'jssjzs' : {
		name : 'jssjzs',
		fieldLabel : '技术设计重伤',
		anchor : '95%'
	}, 'sbsssw': {
		name : 'sbsssw',
		fieldLabel : '设备，设施，工具死亡',
		anchor : '95%'
		},
	'sbsszs' : {
		name : 'sbsszs',
		fieldLabel : '设备，设施，工具重伤',
		anchor : '95%'
	},
	'aqsssw' : {
		name : 'aqsssw',
		fieldLabel : '安全设施死亡',
		anchor : '95%'
	},
	'sqsszs' : {
		name : 'sqsszs',
		fieldLabel : '安全设施重伤',
		anchor : '95%'
	},
	'sccdhjsw' : {
		name : 'sccdhjsw',
		fieldLabel : '生产场地环境死亡',
		anchor : '95%'
	},
	'sccdhjzs' : {
		name : 'sccdhjzs',
		fieldLabel : '生产场地环境重伤',
		anchor : '95%'
	},
	'grfhsw' : {
		name : 'grfhsw',
		fieldLabel : '个人防护死亡',
		anchor : '95%'
	},
	'grfhzs' : {
		name : 'grfhzs',
		fieldLabel : '个人防护重伤',
		anchor : '95%'
	},
	'myaqczsw' : {
		name : 'myaqczsw',
		fieldLabel : '没有安全操作死亡',
		anchor : '95%'
	},
	'myaqczzs' : {
		name : 'myaqczzs',
		fieldLabel : '没有安全操作重伤',
		anchor : '95%'
	},
	'wfczsw' : {
		name : 'wfczsw',
		fieldLabel : '违反操作死亡',
		anchor : '95%'
	},
	'wfczzs' : {
		name : 'wfczzs',
		fieldLabel : '违反操作重伤',
		anchor : '95%'
	},
	'ldzzsw' : {
		name : 'ldzzsw',
		fieldLabel : '劳动组织死亡',
		anchor : '95%'
	},
	'ldzzzs' : {
		name : 'ldzzzs',
		fieldLabel : '劳动组织重伤',
		anchor : '95%'
	},
	'sjcsw' : {
		name : 'sjcsw',
		fieldLabel : '少检查死亡',
		anchor : '95%'
	},
	'sjczs' : {
		name : 'sjczs',
		fieldLabel : '少检查重伤',
		anchor : '95%'
	},
	'jybzsw' : {
		name : 'jybzsw',
		fieldLabel : '教育不足死亡',
		anchor : '95%'
	},
	'jybzzs' : {
		name : 'jybzzs',
		fieldLabel : '教育不足重伤',
		anchor : '95%'
	},
	'qtsw' : {
		name : 'qtsw',
		fieldLabel : '其他死亡',
		anchor : '95%'
	},
	'qtzs' : {
		name : 'qtzs',
		fieldLabel : '其他重伤',
		anchor : '95%'
	},
	'sglb' : {
		name : 'sglb',
		fieldLabel : '事故类别',
		anchor : '95%'
	},
	'bh' : {
		name : 'bh',
		fieldLabel : '编号',
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},
	'gcbh' : {
		name : 'gcbh',
		fieldLabel : '项目编号',
		hidden : true,
		hideLabel : true,
		anchor : '95%'
	},
	'rqlx' : {
		name : 'rqlx',
		fieldLabel : '计划类型',
		valueField:'k',
		displayField: 'v',
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: planTypeStore,
        lazyRender:true,
        listClass: 'x-combo-list-small',
		anchor:'95%'
	}
}

var ColumnsB = [{
			name : 'xh',
			type : 'string'
		}, {
			name : 'jssjsw',
			type : 'float'
		}, {
			name : 'jssjzs',
			type : 'float'
		}, {
			name : 'sbsssw',
			type : 'float'
		}, {
			name : 'sbsszs',
			type : 'float'
		}, {
			name : 'aqsssw',
			type : 'float'
		}, {
			name : 'sqsszs',
			type : 'float'
		}, {
			name : 'sccdhjsw',
			type : 'float'
		}, {
			name : 'sccdhjzs',
			type : 'float'
		}, {
			name : 'grfhsw',
			type : 'float'
		}, {
			name: 'bh', 
			type: 'string'
		}, {
			name: 'gcbh', 
			type: 'string'
		}, {
			name : 'grfhzs',
			type : 'float'
		}];

var FieldsB = ColumnsB.concat([ // 表单增加的列
					{name: 'myaqczsw', type: 'float'},
					{name: 'myaqczzs', type: 'float'},
					{name: 'wfczsw', type: 'float'},
					{name: 'wfczzs', type: 'float'},
					{name: 'ldzzsw', type: 'float'},
					{name: 'ldzzzs', type: 'float'},
					{name: 'sjcsw', type: 'float'},
					{name: 'sjczs', type: 'float'},
					{name: 'jybzsw', type: 'float'},
					{name: 'jybzzs', type: 'float'},
					{name: 'qtsw', type: 'float'},
					{name: 'qtzs', type: 'float'},
					{name: 'sglb', type: 'string'},
					{name: 'rqlx', type: 'string'}
					])
var PlantFieldsB = Ext.data.Record.create(FieldsB);
var PlantFieldsIntB = new Object();					
var PlantB = Ext.data.Record.create(ColumnsB);

var PlantIntB = {
	xh : '',
	jssjsw : null,
	jssjzs : null,
	sbsssw : null,
	sbsszs : null,
	aqsssw : null,
	sqsszs : null,
	sccdhjsw : null,
	sccdhjzs : null,
	grfhsw : null,
	grfhzs : null
}
 Ext.applyIf(PlantFieldsIntB, PlantIntB);
 PlantFieldsIntB = Ext.apply(PlantFieldsIntB);
	
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

var updateB = new Ext.Button({
			id : 'update',
			text : '修改',
			tooltip : '修改',
			iconCls : 'btn',
			handler : updateUserB
		});

function insertFunB() {
	if (selectedData == null) {
			Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的事故！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}
		
	if (!formWindowB) {
		formWindowB = new Ext.Window({
					title : formPanelTitleB,
					layout : 'fit',
					width : 600,
					height : 400,
					closeAction : 'hide',
					plain : true,
					items : formPanelinsertB,
					animEl : 'action-new'
				});
	}
	formPanelinsertB.getForm().reset();
	formWindowB.show();

	var form = formPanelinsertB.getForm();
	//form.findField("tbrq").setValue(new Date);
	form.findField("bh").setValue(selectedData);
}

function deleteFunB() {
	if (smB.getCount() > 0) {
		gridPanelB.defaultDeleteHandler();
	}
}

function saveFunB() {
	gridPanelB.defaultSaveHandler();
}

function updateUserB() {
	if (!smB.hasSelection()) {
		Ext.MessageBox.show({
					title : '警告',
					msg : '请选择将要修改的记录！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}
	if (!formWindowB) {
		formWindowB = new Ext.Window({
					title : formPanelTitleB,
					layout : 'fit',
					width : 600,
					height : 400,
					closeAction : 'hide',
					plain : true,
					items : formPanelinsertB,
					animEl : 'action-new'
				});
	}
	formWindowB.show();
	loadFormB();
}

function formSaveB() {
	var form = formPanelinsertB.getForm()
	if (form.isValid()) {
		doFormSaveB(true)
	}
}

var formPanelinsertB = new Ext.FormPanel({
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
					items : [new fm.TextField(fcB['xh'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['jssjsw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['jssjzs'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['sbsssw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['sbsszs'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['aqsssw'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['sqsszs'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['sccdhjsw'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['sccdhjzs'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['grfhsw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['grfhzs'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['myaqczsw'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['myaqczzs'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['wfczsw'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items :  [new fm.NumberField(fcB['wfczzs'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['ldzzsw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items : [new fm.NumberField(fcB['ldzzzs'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items :  [new fm.NumberField(fcB['sjcsw'])]
				}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items :  [new fm.NumberField(fcB['sjczs'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items :  [new fm.NumberField(fcB['jybzsw'])]
				},{
    				layout: 'form', 
    				columnWidth: .32,
    				bodyStyle: 'border: 0px;',
    				items :  [new fm.NumberField(fcB['jybzzs'])]
    			}, {
					layout : 'form',
					columnWidth : .35,
					bodyStyle : 'border: 0px;',
					items:[new fm.NumberField(fcB['qtsw'])]
				}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items :  [new fm.NumberField(fcB['qtzs'])]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items :  [new fm.TextField(fcB['sglb'])]
				},{
    				layout: 'form', 
    				columnWidth: .35,
    				bodyStyle: 'border: 0px;',
    				items : [new fm.ComboBox({
								name : 'rqlx',
								fieldLabel : '计划类型',
								allowBlank : false,
								emptyText : '请选择...',
								valueField : 'k',
								displayField : 'v',
								mode : 'local',
								typeAhead : true,
								triggerAction : 'all',
								store : planTypeStore,
								lazyRender : true,
								listClass : 'x-combo-list-small',
								anchor : '95%'
							})]
    			}, {
					layout : 'form',
					columnWidth : .33,
					bodyStyle : 'border: 0px;',
					items:[
    							new fm.TextField(fcB['gcbh'])
    					      ]
				}, {
					layout : 'form',
					columnWidth : .32,
					bodyStyle : 'border: 0px;',
					items:[
    							new fm.TextField(fcB['bh'])
    					      ]
				}

		]
	})],
	buttons : [{
				id : 'save',
				text : '保存',
				handler : formSaveB
			}, {
				id : 'cancel',
				text : '取消',
				handler : function() {
					formWindowB.hide();
				}
			}]
});

function doFormSaveB(dataArr) {
	var form = formPanelinsertB.getForm()
	var obj = form.getValues()
	for (var i = 0; i < ColumnsB.length; i++) {
		var n = ColumnsB[i].name;
		var field = form.findField(n);
		if (field) {
			obj[n] = field.getValue();
		}
	}
	DWREngine.setAsync(false);
	if (obj.gcbh == '' || obj.gcbh == null) {
		safeManageMgmImpl.insertSafeEnterpriseDetail(obj, function() {
					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
					Ext.Msg.show({
								title : '提示',
								msg : '是否继续新增?',
								buttons : Ext.Msg.YESNO,
								fn : processResultB,
								icon : Ext.MessageBox.QUESTION
							});
				});
	} else {
		safeManageMgmImpl.updateSafeEnterpriseDetail(obj, function() {
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
					formWindowB.hide();
					dsB.baseParams.params = "  bh = '" + selectedData
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

function processResultB(value) {
	if ("yes" == value) {
		    		dsB.baseParams.params = "  bh = '"
						+ selectedData + "'"
		dsB.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
		formPanelinsertB.getForm().reset();
	} else {
		formWindowB.hide();
		    		dsB.baseParams.params = "  bh = '"
						+ selectedData + "'"
		dsB.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}
}

function loadFormB(){
		//////////
		var form = formPanelinsertB.getForm();
    	if (smB.getSelected()!=null)
    	{
    		var gridRecod = smB.getSelected()
    		if (gridRecod.isNew){
    			if (gridRecod.dirty){
    				var temp = new Object()
    				Ext.applyIf(temp, PlantFieldsIntB);
    				for(var i=0; i<ColumnsB.length; i++){
    					if (typeof(temp[ColumnsB[i].name])!="undefined"){
    						temp[ColumnsB[i].name] = gridRecod.get(ColumnsB[i].name)
    					}
    				}
    				form.loadRecord(new PlantFieldsB(temp))
    			}
    			else
    				form.loadRecord(new PlantFieldsB(PlantFieldsIntB))
    			//form.reset()
    			formPanelinsertB.buttons[0].enable()
    	
    			formPanelinsertB.isNew = true
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
			    		for(var i=0; i<FieldsB.length; i++){
			    			var n = FieldsB[i].name
			    			obj[n] = rtn[n]
			    		}
		    			if (gridRecod.dirty){
		    				for(var i=0; i<ColumnsB.length; i++){
		    					if (typeof(obj[ColumnsB[i].name])!="undefined"){
		    						obj[ColumnsB[i].name] = gridRecod.get(ColumnsB[i].name)
		    					}
		    				}
					    }	
			    		var record = new PlantFieldsB(obj)
			    		form.loadRecord(record)
			    		formPanelinsertB.buttons[0].enable()
			    		formPanelinsertB.isNew = false
		    		}
	    		)
    		}
    	}
    	else
    	{
    		form.loadRecord(new PlantFieldsB(PlantFieldsIntB))
    		formPanel.buttons[0].disable()
    	}  
		////////
		
	}
	
	
function formCancelB() {
	// formPanel.getForm().reset();
	formWindowB.hide();
}
