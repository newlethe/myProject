var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkAccidenrInfo"
var primaryKey = "uids";
var businessType="PCAqgkAccidentAffix"
var array_accidentType=new Array();
var dsCombo_accidentType=new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: [['','']]
});

Ext.onReady(function(){
	
	DWREngine.setAsync(false);  
	DWREngine.beginBatch();
	appMgm.getCodeValue('事故类型',function(list){    
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			array_accidentType.push(temp);	
		}
    });
	DWREngine.endBatch();
  	DWREngine.setAsync(true);
	dsCombo_accidentType.loadData(array_accidentType);
	
//	alert(edit_uids);
    var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
//			hidden:!editAble,
			handler: function(){
				history.back();
			}
		},'SAVE': {
			id: 'save',
			hidden:!editAble,
	        text: '保存',
	        handler:formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
			hidden:hiddRest,
	        handler: function(){
	        	history.back();
	        }
	    },'UPANDLOAD':{
	    	id: 'upandload',
	        text: '上传附件',
			hidden:!editAble,
	        handler: function(){
	        	uploadfile(edit_pid,businessType);
	        }
	    }
    };		
    
    var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			readOnly :!editAble,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目名称',
			readOnly :!editAble,
			anchor : '95%',
			hidden : true,
			hideLabel : true,
			value:edit_pid
		},
		'accidentunit' : {
			name : 'accidentunit',
			readOnly :!editAble,
			fieldLabel : '事故单位',
			anchor : '95%'
		},
		'accidentno' : {
			name : 'accidentno',
			readOnly :!editAble,
			fieldLabel : '事故编号',
			anchor : '95%'
		},
		'accidenttime' : {
			name : 'accidenttime',
			readOnly :true,
			fieldLabel : '事故时间',
			allowBlank:false,
			format:'Y-m-d',
			anchor : '95%'
		},
		'accidentaddr' : {
			name : 'accidentaddr',
			readOnly :!editAble,
			allowBlank:false,
			fieldLabel : '事故地点',
			anchor : '95%'
		},
		'parties' : {
			name : 'parties',
			fieldLabel : '当事人',
			readOnly :!editAble,
			anchor : '95%'
		},
		'accidentType' : {
			name : 'accidentType',
			readOnly :!editAble,
			fieldLabel : '事故类型',
			allowBlank:false,
			anchor : '95%',
			store:dsCombo_accidentType,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
        	hiddenName : 'accidentType',
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
       		selectOnFocus:true
		},
		'accidentreason' : {
			name : 'accidentreason',
			readOnly :!editAble,
			fieldLabel : '事故经过及原因',
			allowBlank:false,
			height:95,
			anchor : '95%'
		},
		'measure' : {
			name : 'measure',
			readOnly :!editAble,
			fieldLabel : '整改措施',
			height:95,
			anchor : '95%'
		},
		'recunit' : {
			name : 'recunit',
			readOnly :!editAble,
			fieldLabel : '整改单位',
			anchor : '95%'
		},
		'dutyperson' : {
			name : 'dutyperson',
			readOnly :!editAble,
			fieldLabel : '责任人',
			allowBlank:false,
			anchor : '95%'
		},
		'reportStatus' : {
			name : 'reportStatus',
			readOnly :!editAble,
			fieldLabel : '责任人',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}
		
	}
	
	
		var Columns = [{
				name : 'uids',
				type : 'string'
			},
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'accidentunit',
				type : 'string'
			}, {
				name : 'accidentType',
				type : 'string'
			}, {
				name : 'accidenttime',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'accidentaddr',
				type : 'string'
			}, {
				name : 'parties',
				type : 'string'
			}, {
				name : 'accidentno',
				type : 'string'
			}, {
				name : 'accidentreason',
				type : 'string'
			}, {
				name : 'measure',
				type : 'string'
			},{
				name : 'recunit',
				type : 'string'
			},{
				name : 'dutyperson',
				type : 'string'
			},{
				name : 'reportStatus',
				type : 'float'
			}];
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = new formRecord({
					uids:"",
					pid:edit_pid,
					accidentunit:"",
					accidentType:"",
					accidenttime:"",
					accidentaddr:"",
					parties:"",
					accidentno:"",
					accidentreason:"",
					measure:"",
					recunit:"",
					dutyperson:"",
					reportStatus:""});
	if(edit_uids!= ""){
	    DWREngine.setAsync(false);
		baseDao.findByWhere2(bean, "uids='"+edit_uids+"'",function(list){
			if(list.length>0){
				loadFormRecord = new formRecord(list[0]);
			}
		});
		
		DWREngine.setAsync(true);
	}
	
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'center',
        bodyStyle: 'padding:10px 10px;overflow-x:hidden;',
    	labelAlign: 'left',
    	items: [{
    			xtype:'fieldset',
    			autoWidth:true,
    			autoHeight:true,
                border: false,
                width:300,
                layout: 'column',
                items:[
                	{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['accidentunit']),
	   						new fm.DateField(fc['accidenttime']),
	   						new fm.TextField(fc['parties'])
	   					]
    				},{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['accidentno']),
	   						new fm.TextField(fc['accidentaddr']),
	   						new Ext.form.ComboBox(fc['accidentType'])
	   					]
    				}   				
    			]
    		},{
    			xtype:'fieldset',
    			layout: 'form',
    			width:638,
    			autoHeight:true,
                border:false, 
                cls:'x-plain',  
                items: [
                	new fm.TextArea(fc['accidentreason']),
                	new fm.TextArea(fc['measure'])
				]
    		},{
    			xtype:'fieldset',
    			autoWidth:true,
    			autoHeight:true,
                border: false,
                width:300,
                buttonAlign:'left',
                layout: 'column',
                items:[
                	{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['recunit']),
	   						new fm.TextField(fc['uids'])
	   					]
    				},{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['dutyperson']),
	   						new fm.Hidden(fc['pid']),
	   						new fm.TextField(fc['reportStatus'])
	   					]
    				}   				
    			]
//    			buttons:[BUTTON_CONFIG['UPANDLOAD']]
    		}
    	],
    	buttonAlign:'center',
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
	
    var contentPanel = new Ext.Panel({
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;安全事故基本信息</b></font>'],
    	items: [formPanel]
    });
    // 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'fit',
            items: [contentPanel]
    });
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
	
	
	
	
	//保存
	function formSave(){
		var baseForm = formPanel.getForm();
		var formData=formPanel.getForm().getValues();
		if(re_edit){
			if(formData.reportStatus==1)formData.reportStatus=2;
		}
		formData.accidenttime = baseForm.findField('accidenttime').getValue();
		Ext.Ajax.request({
			method: 'POST',
			url : MAIN_SERVLET,
			params : {
				ac : "form-insert",
				id : formData.uids,
				bean : bean
			},
			xmlData:  Ext.encode(formData),			
			success:function(form,action){
					Ext.example.msg('保存成功！', '您成功新增了一个事故记录！');
	   				history.back();
			},
			failure:function(form,action){
					Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
			}
		});
	}
	
	function uploadfile(pid,biztype){
		var param = {
			businessId:pid,
			businessType:biztype,
			editable : "true"
		};
		showMultiFileWin(param);
	}

});

