var bean = "com.sgepit.pmis.wzgl.hbm.WzBm"
var primaryKey = "uids";
var max_random_bm=''
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"
Ext.onReady(function(){

  	//--材质WZ_PROPERTY:(propertycode-propertyname)
 	var wzpro_Array = new Array();
 	DWREngine.setAsync(false);
 	appMgm.getCodeValue('wz_property',function(list){         //参数:type_name
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			wzpro_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);

 	var getwzProSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:wzpro_Array
 	}) 	
 	
 	
//仓库号：仓库名 CKH：CKMC
 	var ck_Array = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData('select CKH,CKMC from WZ_CKH order by CKH',function(list){  
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
 
	
 	//获取同一分类编码下最大的BM
 	DWREngine.setAsync(false);
 	/*
 	var sql_maxbm = "select decode(length(random),1,'000'||random,2,'00'||random,3,'0'||random,random) randoms"
 					+" from(select (substr( max(bm),-4)+1)random from wz_bm where flbm='"+flbm+"')"
 	baseMgm.getData(sql_maxbm,function(list){ 
		if(list==""){max_random_bm='0001'}else{
			max_random_bm = list
		}
    });
    */
 	wzbaseinfoMgm.getStockWzBm(bm,CURRENTAPPID,function(random_bm){
 		_bm=random_bm
 	})
 	DWREngine.setAsync(true);
 	
    var BUTTON_CONFIG = {
    	'BACK': {text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				parent.openWin.hide();
				//history.back();
			}
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        handler: function(){
	        	parent.openWin.hide();
	        	//history.back();
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
		},'bmState':{
			name:'bmState',
			fieldLabel:'不使用',
			hidden:true,
			anchor:'95%'
		},'bm':{
			name:'bm',
			fieldLabel:'编码',
			allowBlank: false,
			value:_bm,
			anchor:'95%'
		},'flbm':{
			name:'flbm',
			fieldLabel:'物资分类',
			allowBlank: false,
			readOnly:true,
			value:flbm,
			anchor:'95%'
		},'pm':{
			name:'pm',
			fieldLabel:'品名',
			allowBlank: false,
			anchor:'95%'
		},'gg':{
			name:'gg',
			fieldLabel:'规格型号',
			allowBlank: false,
			anchor:'95%'
		},'dw':{
			name:'dw',
			fieldLabel:'单位',
			allowBlank: false,
			anchor:'95%'
		},'sl':{
			name:'sl',
			fieldLabel:'库存数量',
			anchor:'95%'
		},'hwh':{
			name:'hwh',
			fieldLabel:'货位号',
			anchor:'95%'
		},'th':{
			name:'th',
			fieldLabel:'图号',
			anchor:'95%'
		},'ge':{
			name:'ge',
			fieldLabel:'高额',
			anchor:'95%'
		},'de':{
			name:'de',
			fieldLabel:'低额',
			anchor:'95%'
		},'stage':{
			name:'stage',
			hidden:true,
			hideLabel:true,
			fieldLabel:'工程期(新建的时候用来排序)',
			anchor:'95%'
		},'bz':{
			name:'bz',
			fieldLabel:'备注',
			xtype:'textarea',
			height: 120,
			width: 645,
			anchor:'95%'
		},'price_avg':{
			name:'price_avg',
			fieldLabel:'平均单价',
			height: 120,
			width: 645,
			anchor:'95%'
		},'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true,
			hideLabel:true
		}
	};
	
	var wzPropertyCombo = new fm.ComboBox({
			name:'wzProperty',
			fieldLabel:'材质',
			readOnly : true,
			store:getwzProSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})
	var CK_Combo = new fm.ComboBox({
			name:'ckh',
			fieldLabel:'仓库',
			readOnly : true,
			allowBlank: false,
			store:getCkSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})
		
		
	var jhdj_text = new fm.NumberField({
		name:'jhdj',
		fieldLabel:'计划单价',
		allowBlank: false,
		anchor:'95%'
	})		
	
	Columns = [
		{name:'uids',type:'string'},
		{name:'bmState',type:'string'},
		{name:'stage',type:'string'},
		{name:'bm',type:'string'},
		{name:'flbm',type:'string'},
		{name:'pm',type:'string'},
		{name:'gg',type:'string'},
		{name:'dw',type:'string'},
		{name:'jhdj',type:'string'},
		{name:'sl',type:'string'},
		{name:'ckh',type:'string'},
		{name:'hwh',type:'string'},
		{name:'th',type:'string'},
		{name:'wzProperty',type:'string'},
		{name:'ge',type:'string'},
		{name:'de',type:'string'},
		{name:'bz',type:'string'},
		{name:'pid',type:'string'}
	]
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	
	var ss='';
	if(flbm.length<8){
		for(var i=0;i<8-flbm.length;i++){
			ss+='0';
		}
	}

	max_random_bm = flbm+ss+max_random_bm;

	if(bm_id == null || bm_id==""){
		loadFormRecord = new formRecord({
			 uids:'',
			 bmState:'',
			 stage:'',
			 bm:_bm,
			 flbm:flbm,
			 pm:'',
			 gg:'',
			 dw:'',
			 jhdj:'',
			 sl:0,
			 ckh:'',
			 hwh:'',
			 th:'',
			 wzProperty:'',
			 ge:'',
			 de:'',
			 bz:'',
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
                width:700,
                layout: 'column',
                items:[
	   				new fm.TextField(fc['uids']),
	   				new fm.TextField(fc['bmState']),
	   				new fm.TextField(fc['stage']),
	   				new fm.TextField(fc['pid']),
                	{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['bm']),
	   						new fm.TextField(fc['flbm']),
	   						CK_Combo,
	   						new fm.TextField(fc['th']),
	   						new fm.TextField(fc['pm']),
	   						new fm.TextField(fc['gg']),
	   						new fm.TextField(fc['hwh'])
	   					]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.TextField(fc['dw']),
	   						jhdj_text,
	   						wzPropertyCombo,
	   						new fm.NumberField(fc['sl']),
    						new fm.NumberField(fc['ge']),
    						new fm.NumberField(fc['de'])
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
    	/*tbar: ['<font color=#15428b><b>&nbsp;编码信息维护</b></font>','->', 
				BUTTON_CONFIG['BACK']
		],*/
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
	formPanel.getForm().findField('sl').disable();// 数量不可能编辑
	if(formPanel.getForm().findField('sl').getValue()>0){
		formPanel.getForm().findField('jhdj').disable();//数量大于0，计划单价不可编辑
	}else{
		formPanel.getForm().findField('jhdj').enable();
	}
	
	
	//保存
	function formSave(){
    	var form = formPanel.getForm();
    	var ids = form.findField(primaryKey).getValue();
	     	if (form.isValid()){
	     		var field_bm = form.findField('bm');
	     		if(field_bm.getValue().length<12){
	     			Ext.MessageBox.alert("提示","编码至少12位，请重新填写编码!");
	     			field_bm.focus();
					field_bm.getEl().dom.select();
	     		}else{
		     		if(bm!=field_bm.getValue()){
			     		DWREngine.setAsync(false);
			     		wzbaseinfoMgm.checkBMno(field_bm.getValue(), function(flag){
			     			//alert(flag)
			     			if (flag==true){
			     				doFormSave();
			     			} else {
			     				alert(1)
			     				Ext.Msg.show({
									title: '提示',
									msg: '物资编号不能重复!',
									buttons: Ext.Msg.OK,
									fn: function(value){
										field_bm.focus();
										field_bm.getEl().dom.select();
									},
									icon: Ext.MessageBox.WARNING
								});
			     			}
			     		});
			     		DWREngine.setAsync(true);
		     		}
		     		else{doFormSave();}
		     		
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
	   		wzbaseinfoMgm.addOrUpdateWzBm(obj, function(state){
	   			if ("1" == state){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				parent.ds.reload()
	   				parent.ds_check.reload()
	   				//parent.getScrollRow(obj.bm);//滚动到行
	   				parent.openWin.hide()
	   				//history.back();
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
   			wzbaseinfoMgm.addOrUpdateWzBm(obj, function(state){
	   			if ("2" == state){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				parent.udpate_bm=obj.bm
	   				parent.ds.reload()
	   				parent.ds_check.reload()
	   				parent.openWin.hide()
   					//history.back();
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
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"Business/contract/cont.generalInfo.addorupdate.jsp?";
			window.location.href = url;
    	}else{
    		history.back();
    	}
    }
})