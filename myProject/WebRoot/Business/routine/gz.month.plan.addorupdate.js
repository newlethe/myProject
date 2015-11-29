var bean = "com.sgepit.pmis.routine.hbm.GzJh"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'month'
var bgdid_Combo
var maxStockBhPrefix
Ext.onReady(function(){
	
	//-----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"+USERDEPTID+"'order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bmbzArr.push(temp);
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
 	baseMgm.getData("select userid,realname from rock_user where userid = '"+USERID+"'",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
  	var getuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:userArr
 	})
	//-----------------负责人（sqr: rock_user=realname)
 	/*
	var fzrArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user where userid in (select userid from rock_user where unitid='"+USERUNITID+"')",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			fzrArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
  	var getfzrSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:fzrArr
 	})
 	*/
	//-----------------分管领导（sqr: rock_user=realname)
	var deptuserArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user where userid in (select userid from rock_user where unitid='02')",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			deptuserArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
  	var getdeptuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:deptuserArr
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
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'content':{name:'content',fieldLabel:'主题',allowBlank: false,anchor:'95%'},
		'month':{name:'month',fieldLabel:'汇报日期',format: 'Y-m-d',anchor:'95%',allowBlank: false},
		'shr':{name:'shr',fieldLabel:'审核人',anchor:'95%'},
		'gzhbr':{name:'gzhbr',fieldLabel:'工作汇报人',anchor:'95%',allowBlank: false},
		'unitid':{name:'unitid',fieldLabel:'汇报部门',anchor:'95%'}
	}
	var gzhbr_Combo = new fm.ComboBox({
			name:'gzhbr',
			fieldLabel:'工作汇报人',
			readOnly : true,
			store:getuserSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})	
	var shr_Combo = new fm.ComboBox({
			name:'shr',
			fieldLabel:'审核人',
			readOnly : true,
			store:getdeptuserSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})	
	var dept_Combo = new fm.ComboBox({
			name:'unitid',
			fieldLabel:'汇报部门',
			readOnly : true,
			store:getBmbzSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})
		
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'content',type:'string'},
		{name:'month',type:'date',dateFormat:'Y-m-d H:i:s'},       
    	{name:'shr',type:'string'},{name:'gzhbr',type:'string'},{name:'unitid',type:'string'}
	]	
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(uids_edit == null || uids_edit==""){
		loadFormRecord = new formRecord({
			uids:'',  content:'',  month:'',   shr:'', 
			gzhbr:'',unitid:''
		});
	}else{
	    DWREngine.setAsync(false);
		baseMgm.findById(bean, uids_edit,function(obj){
			loadFormRecord = new formRecord(obj);
			//alert(loadFormRecord)
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
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
    			autoWidth:true,
                border: true,
                layout: 'column',
                items:[
	   				new fm.TextField(fc['uids']),
                	{
	   					layout: 'form', columnWidth: .50,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextArea(fc['content']),
	   						new fm.DateField(fc['month']),
	   						//new fm.TextField(fc['fzr']),
	   						shr_Combo,
	   						gzhbr_Combo,
	   						dept_Combo
	   						//new fm.TextField(fc['deptuser']),
	   						//new fm.TextField(fc['zbr']),

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
    	tbar: ['<font color=#15428b><b>&nbsp;工作汇报审核</b></font>','->', 
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
    	var hbr = form.findField('gzhbr').getValue();
    	if (""==hbr){
    			Ext.Msg.show({
				title : '提示',
				msg : '工作汇报人不能为空！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}
    	
    	//alert(form.findField(primaryKey).getValue())
	     	if (form.isValid()){
	     		doFormSave();
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
    		//alert(obj.unitid)
	   		gzJhMgm.addOrUpdateGzJh(obj, function(state){
	   			//alert(state)
	   			if ("1" == state){
	   				if(isFlwTask != true){
		   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
		   				history.back();
	   				}else{
						/*Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条申请计划主信息！　　　<br>下一步进行物资材料的选择！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
									var url = BASE_PATH+"Business/wzgl/stock/wz.stockgl.applyPlan.jsp?isFlwTask=true&bhflow="+obj.bh;
									window.location.href = url;
						   		}
						   }
						});	 */  				
	   				}
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
   			gzJhMgm.addOrUpdateGzJh(obj, function(state){
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