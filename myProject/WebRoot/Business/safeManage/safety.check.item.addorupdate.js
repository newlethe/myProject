var bean = "com.sgepit.pmis.safeManage.hbm.SafetyCheckItem"
var business = "safeManageMgmImpl"
var listMethod = "findWhereOrderby"

//安全监察部ID
var deptId = '04'

Ext.onReady(function(){
 	var resUser = new Array();
 	DWREngine.setAsync(false);
 	//查询出安全监察部人员
    baseMgm.getData("select userid,realname from rock_user where posid='"+deptId+"'",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			resUser.push(temp);
		}
	})
 	DWREngine.setAsync(true);
 	var resUserDs = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:resUser	
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
		'uuid':{name:'uuid',fieldLabel:'编号',hidden:true,hideLabel:true,anchor:'95%'},
		'itembh':{name:'itembh',fieldLabel:'安监项目编号',hidden:true,hideLabel:true,anchor:'95%'},
		'itemname':{name:'itemname',fieldLabel:'检查项目',allowBlank:false,anchor:'95%'},
		'responsibleuser':{name:'responsibleuser',fieldLable:'责任人',anchor:'95%'},
		'checkresult':{name:'checkresult',fieldLabel:'检查结果',allowBlank:false,anchor:'95%'},
		'checktime':{name:'checktime',fieldLabel:'检查时间',format:'Y-m-d',allowBlank:false,anchor:'95%'},
		'pid':{name:'pid',fieldLabel:'PID',hidden:true,hideLabel:true,anchor:'95%'}
	}
	
	var responsibleUserComboBox = new fm.ComboBox({
		name:'responsibleuser',
		fieldLabel:'责任人',
		readOnly : true,
		store:resUserDs,
		emptyText:'请选择责任人',
		valueField: 'k',
		displayField: 'v',
		triggerAction: 'all',
		mode: 'local',
		anchor:'95%'
	});
	var checkResultTextArea = new Ext.form.TextArea({
		name:'checkresult',
		fieldLabel:'检查结果',
		allowBlank:false,
		width:348,
		height:140
	})
	var checkTimeField = new Ext.form.DateField({
		name: 'checktime',
		fieldLabel: '检查时间',
		allowBlank:false,
		width:351,
		format:'Y-m-d H:i',
		menu:new DatetimeMenu()
	})
	
	
	var Columns = [
	  	{name: 'uuid', type: 'string'},
	  	{name: 'itembh', type: 'string'},    		
		{name: 'itemname', type: 'string'},
		{name: 'checkresult',type: 'string'},
		{name: 'checktime',  type: 'date', dateFormat: 'Y-m-d H:i'},
		{name: 'responsibleuser',  type: 'string'},
		{name: 'pid',  type: 'string'}
	];	
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(uuid_edit == null || uuid_edit==""){
		loadFormRecord = new formRecord({
			uuid:'',
			itembh:'',
			itemname:'',
			checkresult:'', 
			checktime:'',
			pid:CURRENTAPPID
		});
	}else{
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, uuid_edit,function(obj){
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
	}
	
	
    var formPanel = new Ext.FormPanel({
		id: 'form-panel',
		header: false,
		border: false,
		autoScroll:true,
		labelWidth:130,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
    	items:[
	    	new Ext.form.FieldSet({
				title: '基本信息',
				autoWidth:true,
				border: true,
				layout: 'column',
				items:[
					new fm.Hidden(fc['uuid']),
		    		new fm.Hidden(fc['itembh']),
		    		new fm.Hidden(fc['pid']),
		    		{
		    			layout: 'form',
		    			columnWidth:.60,
			   			bodyStyle: 'border:0px;',
			   			items:[
			   				new fm.TextField(fc['itemname']),
							checkTimeField,
			   				checkResultTextArea,
			   				responsibleUserComboBox
			   			]
	    			}
				]
			})	
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
	});
	
	
	var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;安监项目详情</b></font>','->',BUTTON_CONFIG['BACK']],
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
	
	
	function formSave(){
    	var form = formPanel.getForm();
    	//var ids = form.findField(primaryKey).getValue();
    	var itemname = form.findField('itemname').getValue();
    	var checktime = form.findField('checktime').getValue();
    	var checkresult = form.findField('checkresult').getValue();
    	if (""==itemname){
    		Ext.Msg.show({
				title : '提示',
				msg : '检查项目名称不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
    	if (""==checktime){
    		Ext.Msg.show({
				title : '提示',
				msg : '检查时间不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
    	if (""==checkresult){
    		Ext.Msg.show({
				title : '提示',
				msg : '检查结果不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
	    if (form.isValid()){
	    	doFormSave();
		}		
	}
	
	
	function doFormSave(){
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
    	if (obj.uuid == '' || obj.uuid == null){
    		//添加
    		safeManageMgmImpl.insertSafetyCheckItem(obj,function(str){
    			if(str!=null || str!=""){
		   			Ext.example.msg('保存成功！', '您成功新增了一条信息！');
		   			history.back();
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					})
	   			}
    		})
    	}else{
    		//修改
    		safeManageMgmImpl.updateSafetyCheckItem(obj,function(str){
	   			Ext.example.msg('保存成功！', '您成功修改了一条信息！');
   				history.back();
    		})
    	}
    	DWREngine.setAsync(true);
	}
}); 	