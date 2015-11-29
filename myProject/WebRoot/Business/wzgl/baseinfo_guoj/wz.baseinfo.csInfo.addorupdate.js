var bean = "com.sgepit.pmis.wzgl.hbm.WzCsb"
var primaryKey = "uids";
var procob;
var wzpro =new Array();
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
	DWREngine.setAsync(false);
	appMgm.getCodeValue('物资专业分类',function(list){         //参数:type_name
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			wzpro.push(temp);
		}
    });
	DWREngine.setAsync(true);
	var getwzpro =new Ext.data.SimpleStore({
		fields: ['k','v'],
		data: wzpro
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
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},'isused':{
			name:'isused',
			fieldLabel:'不使用',
			hidden:true,
			anchor:'95%'
		},'csdm':{
			name:'csdm',
			fieldLabel:'厂商代码',
			allowBlank: false,
			anchor:'95%'
		},'csmc':{
			name:'csmc',
			fieldLabel:'厂商名称',
			allowBlank: false,
			anchor:'95%'
		},'gb':{
			name:'gb',
			fieldLabel:'国家',
			anchor:'95%'
		},'post':{
			name:'post',
			fieldLabel:'邮编',
			anchor:'95%'
		},'addr':{
			name:'addr',
			fieldLabel:'地址',
			anchor:'95%'
		},'fax':{
			name:'fax',
			fieldLabel:'传真',
			anchor:'95%'
		},'tel':{
			name:'tel',
			fieldLabel:'电话',
			anchor:'95%'
		},'fr':{
			name:'fr',
			fieldLabel:'法人',
			anchor:'95%'
		},'lxr':{
			name:'lxr',
			fieldLabel:'联系人',
			anchor:'95%'
		},'email':{
			name:'email',
			fieldLabel:'邮箱',
			anchor:'95%'
		},'mobil':{
			name:'mobil',
			fieldLabel:'手机',
			anchor:'95%'
		},'bank':{
			name:'bank',
			fieldLabel:'开户行',
			anchor:'95%'
		},'accountNumber':{
			name:'accountNumber',
			fieldLabel:'银行帐号',
			anchor:'95%'
		},'taxNumber':{
			name:'taxNumber',
			fieldLabel:'税号',
			anchor:'95%'
		},'flbm':{
			name:'flbm',
			fieldLabel:'分类编码',
			allowBlank: false,
			readOnly:true,
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			xtype:'textarea',
			height: 120,
			width: 545,
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true
		}
		
	};
	
	var	procob = new fm.ComboBox({
    	name : 'property',
    	fieldLabel : '专业分类',
    	width : 70,
    	valueField : 'k',
    	displayField : 'v',
    	store : getwzpro,
    	mode : 'local',
    	triggerAction : 'all'
    })
	
	Columns = [
		{name:'uids',type:'string'},
		{name:'csdm',type:'string'},
		{name:'csmc',type:'string'},
		{name:'gb',type:'string'},
		{name:'tel',type:'string'},
		{name:'post',type:'string'},
		{name:'addr',type:'string'},
		{name:'fax',type:'string'},
		{name:'fr',type:'string'},
		{name:'lxr',type:'string'},
		{name:'email',type:'string'},
		{name:'mobil',type:'string'},
		{name:'bank',type:'string'},
		{name:'accountNumber',type:'string'},
		{name:'taxNumber',type:'string'},
		{name:'isused',type:'string'},
		{name:'flbm',type:'string'},
		{name:'bz',type:'string'},
		{name:'property',type: 'string'},
		{name:'pid',type:'string'}
	]

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(bm_id == null || bm_id==""){
		loadFormRecord = new formRecord({
	        uids:'',
			csdm:'',
			csmc:'',
			gb:'',
			tel:'',
			post:'',
			addr:'',
			fax:'',
			fr:'',
			lxr:'',
			email:'',
			mobil:'',
			bank:'',
			accountNumber:'',
			taxNumber:'',
			isused:'',
			flbm:flbm,
			bz:'',
			property:'',
			pid:CURRENTAPPID
		});
	}else{
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, uids_edit,function(obj){
			loadFormRecord = new formRecord(obj);
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
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
    			autoWidth:true,
                border: true,
                width:300,
                layout: 'column',
                items:[
	   				new fm.TextField(fc['uids']),
	   				new fm.TextField(fc['isused']),
	   				new fm.TextField(fc['pid']),
                	{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['csdm']),
	   						new fm.TextField(fc['fr']),
	   						new fm.TextField(fc['gb']),
	   						new fm.TextField(fc['tel']),
	   						new fm.TextField(fc['post']),
	   						new fm.TextField(fc['addr']),
	   						new fm.TextField(fc['fax']),
	   						new fm.TextField(fc['email'])
	   					]
    				},{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['csmc']),
	   						new fm.TextField(fc['mobil']),
	   						new fm.TextField(fc['bank']),
	   						new fm.TextField(fc['accountNumber']),
	   						new fm.TextField(fc['taxNumber']),
	   						new fm.TextField(fc['flbm']),
	   						new fm.TextField(fc['lxr']),
	   						procob
	   					]
    				}   				
    			]
    		}),new Ext.form.FieldSet({
    			layout: 'form',
    			autoWidth:true,
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [fc['bz']]
    		})
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    
	
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;供应商信息维护</b></font>','->', 
				BUTTON_CONFIG['BACK']
		],
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
    	var form = formPanel.getForm();
    	var ids = form.findField(primaryKey).getValue();
	     	if (form.isValid()){
	     		var csdm = form.findField('csdm');
	     		if (csdm.getValue() != loadFormRecord.get('csdm')){
		     		DWREngine.setAsync(false);
		     		wzbaseinfoMgm.checkCSno(csdm.getValue(), function(flag){
		     			if (flag){
		     				doFormSave();
		     			} else {
		     				Ext.Msg.show({
								title: '提示',
								msg: '厂商编号不能重复!',
								buttons: Ext.Msg.OK,
								fn: function(value){
									csdm.focus();
									csdm.getEl().dom.select();
								},
								icon: Ext.MessageBox.WARNING
							});
		     			}
		     		});
		     		DWREngine.setAsync(true);
	     		}else{
	     			doFormSave();
	     		}
		    }
	}

	function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.uids == '' || obj.uids == null){
	   		wzbaseinfoMgm.addOrUpdateWzCsb(obj, function(state){
	   			if ("1" == state){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				history.back();
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		}else{
   			wzbaseinfoMgm.addOrUpdateWzCsb(obj, function(state){
	   			if ("2" == state){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
   					history.back();
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
})