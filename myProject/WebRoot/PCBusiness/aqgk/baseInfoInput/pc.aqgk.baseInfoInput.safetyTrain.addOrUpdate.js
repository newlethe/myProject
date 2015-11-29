var bean = "com.sgepit.pcmis.aqgk.hbm.PcAqgkSafetytrainInfo"
var primaryKey = "uids";
var businessType="PCAqgkAccidentAffix"

Ext.onReady(function(){
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
			readOnly :!editAble,
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '项目编码',
			readOnly :!editAble,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'traintime' : {
			name : 'traintime',
			fieldLabel : '培训时间',
			readOnly :true,
			allowBlank:false,
			format:'Y-m-d',
			anchor : '95%'
		},
		'trainaddr' : {
			name : 'trainaddr',
			fieldLabel : '培训地点',
			readOnly :!editAble,
			allowBlank:false,
			anchor : '95%'
		},
		'traintitle' : {
			name : 'traintitle',
			fieldLabel : '培训主题',
			allowBlank:false,
			readOnly :!editAble,
			anchor : '95%'
		},
		'trainunit' : {
			name : 'trainunit',
			fieldLabel : '培训单位',
			readOnly :!editAble,
			allowBlank:false,
			anchor : '95%'
		},
		'trainnumber' : {
			name : 'trainnumber',
			fieldLabel : '培训人数',
			readOnly :!editAble,
			allowBlank:false,
			allowDecimals:false,
			allowNegative:false,
			maxLength:3,
//			nanText:'请输入有效数字', 
//			msgTarget:'qtip', 
			anchor : '95%'
		},
		'traincontent': {
			name : 'traincontent',
			fieldLabel : '培训内容',
			readOnly :!editAble,
			height:120,
			anchor : '95%'
		},
		'remarks': {
			name : 'remarks',
			fieldLabel : '备注',
			readOnly :!editAble,
			height:90,
			anchor : '95%'
		},
		'trainStatus' : {
			name : 'trainStatus',
			fieldLabel : '状态',
			readOnly :!editAble,
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
				name : 'traintime',
				type : 'string'
			}, {
				name : 'trainaddr',
				type : 'string'
			}, {
				name : 'trainunit',
				type : 'string'
			}, {
				name : 'traintitle',
				type : 'string'
			}, {
				name : 'trainnumber',
				type : 'float'
			}, {
				name : 'traincontent',
				type : 'string'
			}, {
				name : 'remarks',
				type : 'string'
			},{
				name : 'trainStatus',
				type : 'float'
			}];
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = new formRecord({uids:'',
					pid:edit_pid,
					traintime:'',
					trainaddr:'',
					trainunit:'',
					traintitle:'',
					trainnumber:'',
					traincontent:'',
					remarks:'',
					trainStatus:''});
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
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'right',
    	items: [{
    			xtype:'fieldset',
    			border:false, 
    			layout: 'form',width:638,
	   			bodyStyle: 'border: 0px;',
	   			items:[
	   				new fm.TextField(fc['traintitle'])
	   			]
    		},{
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
	   						new fm.DateField(fc['traintime']),
	   						new fm.TextField(fc['trainunit'])
	   					]
    				},{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['trainaddr']),
	   						new fm.NumberField(fc['trainnumber'])
	   							
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
                	new fm.TextArea(fc['traincontent']),
                	new fm.TextArea(fc['remarks']),
                	new fm.TextField(fc['uids']),
                	new fm.TextField(fc['pid']),
                	new fm.TextField(fc['trainStatus'])
				]
    		}
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
	
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;安全培训基本信息</b></font>'],
    	items: [formPanel]
    });
    // 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'border',
            autoWidth:true,
            items: [contentPanel]
    });
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
	
	
	
	
	//保存
	function formSave(){
		var formData=formPanel.getForm().getValues();
		if(re_edit){
			if(formData.trainStatus==1)formData.trainStatus=2;
		}
//		alert(re_edit);
//		alert(Ext.encode(formData));

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
					Ext.example.msg('保存成功！', '您成功新增了一个项目！');
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

