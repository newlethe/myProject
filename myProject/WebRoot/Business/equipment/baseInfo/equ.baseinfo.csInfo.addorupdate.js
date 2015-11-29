var bean = "com.sgepit.pmis.equipment.hbm.SbCsb"
var primaryKey = "uids";
var rate_Array = new Array();
var zystore = new Array();
var value;
var getValue;
Ext.onReady(function(){
 ///-------获取设备合同分类
    var sbArray = new Array();
    DWREngine.setAsync(false);
    //var sql  ="select sb_mc,sb_mc from equ_list where parentid=(select sb_id from equ_list where parentid='0')";
    //从属性代码中查询设备合同分类
    var sbSql = "select c.property_code,c.property_name from property_code c " +
		"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
		"and c.detail_type like '%SB%'";
    baseMgm.getData(sbSql,function(list){
            for(var i = 0;i<list.length;i++){
                    var temp = new Array();
                    temp.push(list[i][0]);
                    temp.push(list[i][1]);
                    sbArray.push(temp);
            }
    })
    DWREngine.setAsync(true);
    var getSBSt = new Ext.data.SimpleStore({
         fields:['k','v'],
         data:sbArray
     }) 
    //评级
    DWREngine.setAsync(false);
    appMgm.getCodeValue('供货商评级', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					rate_Array.push(temp);

				}
			})
	DWREngine.setAsync(true);
    
    // 专业下拉框
    DWREngine.setAsync(false);
	appMgm.getCodeValue('设备专业分类', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					zystore.push(temp);
				}
			})
	DWREngine.setAsync(true);
    var getZyStore  = new Ext.data.SimpleStore({
         fields:['k','v'],
         data:zystore
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
		},'pid':{
			name:'pid',
			fieldLabel:'工程项目编号',
			hidden:true,
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
			hidden : true,
			hideLabel : true,
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
			hidden : true,
			hideLabel : true,
			anchor:'95%'
		},'bank':{
			name:'bank',
			fieldLabel:'开户行',
			anchor:'95%'
		},'accountNumber':{
			name:'accountNumber',
			fieldLabel:'银行账户',
			anchor:'95%'
		},'taxNumber':{
			name:'taxNumber',
			fieldLabel:'税号',
			hidden : true,
			hideLabel : true,
			anchor:'95%'
		},'flbm':{
			id:'flbm',
			name:'flbm',
			fieldLabel:'分类编码',
			hidden : true,
			hideLabel : true,
			allowBlank: false,
			readOnly:true,
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			hidden : true,
			xtype:'textarea',
			height: 120,
			width: 545,
			anchor:'95%'
		},'wzorsb':{
			name:'wzorsb',
			fieldLabel:'物资还是设备',
			hidden:true,
			hideLabel:true,
			value:'sb',
			anchor:'95%'
		},'rate':{
			name:'rate',
			fieldLabel:'评级',
			xtype:'textarea',
			anchor:'95%'
		},'appra':{
			name:'appra',
			fieldLabel:'评价',
			xtype:'textarea',
			anchor:'95%'
		},'professional':{
			name :'professional',
			fieldLabel: '专业',
			xtype:'textarea',
			anchor : '95%'
		}
	};
	
	
	Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
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
		{name:'wzorsb',type:'string'},
		{name:'rate',type:'string'},
		{name:'appra',type:'string'},
		{name:'bz',type:'string'},
		{name:'professional',type:'string'}
	]
	
	var getRate = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:rate_Array
 	}) 	
	var rateCombo = new fm.ComboBox({
		name:'rate',
		fieldLabel:'评级',
		readOnly : true,
		store:getRate,
		valueField: 'k',
		displayField: 'v',
		emptyText : '请选择...',
		triggerAction: 'all',
		mode: 'local',

		anchor:'95%'
	})
	var zyCombo = new fm.ComboBox({
	     	name :'professional',
			fieldLabel: '专业',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : getZyStore,
			forceSelection : true,
			lazyRender : true,
			readOnly : true,
			//emptyText :text,
			listClass : 'x-combo-list-small',
			anchor : '95%'
	})
//	zyCombo.on("select",function(text){
//	    var value = zyCombo.getValue();
//	    Ext.getCmp('flbm').setValue(value);
////	    Ext.getCmp('professional').setValue(flmc);
////	    zyCombo.setValue(flmc);
//	})
//	zyCombo.setValue(flbm);
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(bm_id == null || bm_id==""){
		loadFormRecord = new formRecord({
			pid: CURRENTAPPID,
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
			flbm:'',
			wzorsb:'',
			rate:'',
			appra:'',
			bz:'',
			professional:flbm
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
	   				new fm.TextField(fc['pid']),
	   				new fm.TextField(fc['isused']),
	   				//new fm.TextField(fc['wzorsb']),
                	{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['csdm']),
	   						new fm.TextField(fc['fr']),
//	   						new fm.TextField(fc['gb']),
	   						new fm.TextField(fc['tel']),
	   						new fm.TextField(fc['addr']),
	   						new fm.TextField(fc['post']),
	   					    new fm.TextField(fc['bank']),
	   						new fm.TextField(fc['accountNumber'])
	   					]
    				},{
	   					layout: 'form', width:300,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['csmc']),
	   						new fm.TextField(fc['lxr']),
	   						new fm.TextField(fc['fax']),
	   						new fm.TextField(fc['email']),
//	   						new fm.TextField(fc['mobil']),
//	   						new fm.TextField(fc['taxNumber']),
//	   						new fm.TextField(fc['flbm']),
	   						zyCombo,
	   						rateCombo
	   						
	   						
	   					]
    				}   				
    			]
    		})/*
    		,new Ext.form.FieldSet({
    			layout: 'form',
    			autoWidth:true,
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [fc['bz']]
    		})*/
    		,new Ext.form.FieldSet({
    			layout: 'form',
    			autoWidth:true,
                border:true, 
                title:'评价',
                cls:'x-plain',  
                items: [fc['appra']]
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
    	var professional = form.findField("professional").getValue();
    	if(professional==null||professional==""){
    	   form.findField("professional").setValue(flbm);
    	}
	     	if (form.isValid()){
	     		var csdm = form.findField('csdm');
	     		if (csdm.getValue() != loadFormRecord.get('csdm')){
		     		DWREngine.setAsync(false);
		     		equBaseInfo.checkCSno(csdm.getValue(), function(flag){
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
	   		equBaseInfo.addOrUpdateEquCsb(obj, function(state){
	   			if ("1" == state){
	   				Ext.Msg.alert('保存成功！', '您成功新增了一条信息！',function(){
		   				history.back();
	   				})
	   			}else if( "2" == state){
	   				Ext.Msg.alert('修改成功！', '您成功修改了一条信息！',function(){
		   				history.back();
	   				})
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: "保存失败",
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		DWREngine.setAsync(true);
    }
    
})