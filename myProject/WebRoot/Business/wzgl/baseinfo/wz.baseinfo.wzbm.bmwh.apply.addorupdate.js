var bean = "com.sgepit.pmis.wzgl.hbm.WzBmwh"
var primaryKey = 'bh'
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){
	
	//-----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"+USERDEPTID+"' order by unitid",function(list){ 
 		if(list==null||list==""){
 			var temp = new Array();
			temp.push(USERDEPTID);
			temp.push(UNITNAME);
			bmbzArr.push(temp);
 		}else{
 			for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bmbzArr.push(temp);
		  }
 		} 

		
    });
 	DWREngine.setAsync(true);	
  	var getBmbzSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:bmbzArr
 	})	
	//-----------------申请人（sqr: rock_user=realname)
	var userArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user where userid = '"+USERID+"' and unitid='"+CURRENTAPPID+"' ",function(list){
 		if(list==""||list==null){
 			var temp = new Array();
			temp.push(USERID);
			temp.push(REALNAME);
			userArr.push(temp);
 		}else{
 			for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
		}
 		}
	
    });
 	DWREngine.setAsync(true);
  	var getuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:userArr
 	})	
	//---仓库号：仓库名 CKH：CKMC
 	var ck_Array = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select CKH,CKMC from WZ_CKH where "+pidWhereString+" order by CKH",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			ck_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
 	var getCkSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:ck_Array
 	}) 		
 	//工程期
 	var stagetArr =[['公用','公用'],['一期','一期'],['二期','二期']];
 	var getStageSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:stagetArr
 	}) 
	//----------------------物资维护信息----------------------------//
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
		'qr':{id:'qr',name:'qr',fieldLabel:'确认',anchor:'95%',value:"-1",hidden:true},
		'wzbm':{name:'wzbm',fieldLabel:'物资编码',anchor:'95%',hidden:true},
		'flbm':{name:'flbm',fieldLabel:'物资分类',anchor:'95%',hidden:true},
		'ckh':{name:'ckh',fieldLabel:'仓库',anchor:'95%',allowBlank: false},
		'pm':{name:'pm',fieldLabel:'品名',anchor:'95%',allowBlank: false},
		'gg':{name:'gg',fieldLabel:'规格',anchor:'95%'},
		'dw':{name:'dw',fieldLabel:'单位',anchor:'95%'},
		'dj':{name:'dj',fieldLabel:'单价',anchor:'95%'},
		'bmbz':{name:'bmbz',fieldLabel:'部门',anchor:'95%',readOnly : true,value:USERDEPTID},
		'sqr':{name:'sqr',fieldLabel:'申请人',anchor:'95%',readOnly : true,value:USERID},
		'rq':{name:'rq',fieldLabel:'申请日期',anchor:'95%',format: 'Y-m-d', minValue: '2000-01-01',value:new Date()},
		'bh':{name:'bh',fieldLabel:'记录编号',anchor:'95%',hidden:true},
		'bz':{name:'bz',fieldLabel:'备注',anchor:'95%',xtype:'textarea',height:120,width:600},
		'qrr':{name:'qrr',fieldLabel:'确认人',anchor:'95%',hidden:true},
		'pid':{name:'pid',fieldLabel:'PID',value:CURRENTAPPID,hidden:true}
	}
  
   var stage_Combo = new fm.ComboBox({
			name:'stage',
			fieldLabel:'工程期',
			store:getStageSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})
	var CK_Combo = new fm.ComboBox({
			name:'ckh',
			fieldLabel:'仓库',
			allowBlank: false,
			store:getCkSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})		
	var sqr_Combo = new fm.ComboBox({
			name:'sqr',
			fieldLabel:'申请人',
			readOnly : true,
			allowBlank: false,
			store:getuserSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})		
	var bmbz_Combo = new fm.ComboBox({
			name:'bmbz',
			fieldLabel:'申请部门',
			readOnly : true,
			allowBlank: false,
			store:getBmbzSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})		
	var Columns = [
		{name:'qr',type:'string'},
		{name:'wzbm',type:'string'},
		{name:'stage',type:'string'},
		{name:'flbm',type:'string'},
		{name:'ckh',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dw',type:'string'},
		{name:'dj',type:'float'},
		{name:'bmbz',type:'string'},
		{name:'sqr',type:'string'},
		{name:'rq',type:'date',dateFormat:'Y-m-d H:i:s'},
		{name:'bh',type:'string'},
		{name:'bz',type:'string'},
		{name:'qrr',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(bh_id == null || bh_id==""){//如果是新增，初始化
		loadFormRecord = new formRecord({
			qr:'',
			wzbm:'',
			stage:'',
			flbm:'',
			ckh:'',
			pm:'',
			gg:'',
			dw:'',
			dj:'',
			bmbz:USERDEPTID,
			sqr:USERID,
			rq:new Date(),
			bh:'',
			bz:'',
			qrr:'',
			pid:CURRENTAPPID
		});
	}else{//如果是修改
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, bh_id,function(obj){
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
                width:700,
                layout: 'column',
                items:[
					new fm.TextField(fc['qr']),
					new fm.TextField(fc['wzbm']),
					new fm.TextField(fc['flbm']),
					new fm.TextField(fc['qrr']),
	   				new fm.TextField(fc['bh']),
	   				new fm.TextField(fc['pid']),
                	{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						stage_Combo,
	   						CK_Combo,
	   						bmbz_Combo,
	   						sqr_Combo,
	   						new fm.DateField(fc['rq'])
	   					]
    				},{
    					layout: 'form', columnWidth: .3,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.TextField(fc['pm']),
	   						new fm.TextField(fc['gg']),
	   						new fm.TextField(fc['dw']),
	   						new fm.NumberField(fc['dj'])
    					]
    				}    				
    			]
    		}),
    		new Ext.form.FieldSet({
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
    	tbar: ['<font color=#15428b><b>&nbsp;编码申请信息维护</b></font>','->', 
				BUTTON_CONFIG['BACK']
		],
    	items: [formPanel]
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[contentPanel]
    });	
    
    formPanel.getForm().loadRecord(loadFormRecord);//加载数据
    //zhangh 2010-10-21 表单数据加载后，将qr的值修改为-1
    Ext.getCmp('qr').setValue('-1');
    //form.findField('qr').setValue('-1');
    
	//保存
	function formSave(){
    	var form = formPanel.getForm();
    	var ids = form.findField(primaryKey).getValue();
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
    	if (obj.bh == '' || obj.bh == null){
	   		wzbaseinfoMgm.addOrUpdateWzBmApply(obj, function(state){
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
   			wzbaseinfoMgm.addOrUpdateWzBmApply(obj, function(state){
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
    
});