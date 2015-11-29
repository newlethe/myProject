var formPanel;
var sendArr = [['1','是'],['0','否']];
var send_com;
Ext.onReady(function(){
	 var sendStore = new Ext.data.SimpleStore({
	 	fields : ['k','v'],
	 	data : sendArr
	 })
	 var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				history.back();
			}
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        handler: function(){
	        	history.back();
	        }
	    }
    };	
	
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLabel:true},
		'code':{name:'code',fieldLabel:'类型编码', anchor:'95%',allowBlank:false},
		'name':{name:'name',fieldLabel:'类型名称', anchor:'95%',allowBlank:false},
		'sendType':{name:'sendType',fieldLabel:'是否发放', anchor:'95%',allowBlank:false},
		'state':{name:'state',fieldLabel:'有效状态',value:1,hidden:true,hideLabel:true}
	}
	
	var Columns = [
		{name:'uids',type:'string'}     ,  {name:'code',type:'string'},     {name:'name',type:'string'},
		{name:'sendType',type:'string'}   ,  {name:'state',type:'string'}
	]
	
	send_com = new Ext.form.ComboBox({
		name : 'sendType',
		fieldLabel:'是否发放',
		store:sendStore,
		displayField : 'v',
		valueField : 'k',
		readOnly : true,
		triggerAction: 'all',
		allowBlank:false,
		mode: 'local',
		anchor:'95%'
	})
	
	formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'center',
        labelWidth: 80,
        width: 680,
        height: 500,
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                labelWidth: 70,
                layout: 'column',
                items:[
					new fm.TextField(fc['uids']),
					new fm.TextField(fc['state']),
                	{
	   					layout: 'form', columnWidth: .5,
	   					labelWidth: 70,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['code']),
	   						new fm.TextField(fc['name']),
	   						send_com
	   					]
    				}/*
    				,{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					labelWidth: 70,
    					items:[
    					fc['remark']
    					]
    				} */   				
    			]
    		}) 		
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;工资类型维护</b></font>','->'
		],
    	items: [formPanel]
    });
    
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[contentPanel]
    });
    if(flag==true){
    	var form = formPanel.getForm()
    	form.findField('code').setValue(code);
    	form.findField('name').setValue(name);
    	form.findField('uids').setValue(uids);
    	send_com.setValue(sendtype)
    }
	
})
function formSave(){
	var form =  formPanel.getForm();
	var obj  =  new Object();
   	obj.uids = 	form.findField('uids').getValue();
	obj.name =  form.findField('name').getValue();
	obj.code =  form.findField('code').getValue();
	
	obj.sendType = send_com.getValue();
	obj.state = "1";
	if(obj.name==""||obj.sendType==""||obj.code==""){
		Ext.MessageBox.alert("提示","请填写完整数据!");
	}else{
		rlzyXcglMgm.validateName(obj,function(val){
			if(val==true){
					rlzyXcglMgm.saveSalType(obj,function(dat){
					if(dat==true){
						history.back();
					}
					else{
						Ext.MessageBox.alert("提示","数据保存失败!");
					}
				})
			}
			else{
				Ext.MessageBox.alert("提示","类型名称重复!");
			}
		})

	}
	
}