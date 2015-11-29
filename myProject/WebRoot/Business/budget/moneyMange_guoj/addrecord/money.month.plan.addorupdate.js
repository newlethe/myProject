var bean = "com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'enddate'
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
	var fzrArr = new Array();
 	DWREngine.setAsync(false);
 	//baseMgm.getData("select userid,realname from rock_user where userid in (select userid from rock_user where unitid='"+USERUNITID+"')",function(list){  
 	baseMgm.getData("select userid,realname from rock_user where userid ='"+USERID+"'",function(list){  
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
		'content':{name:'content',fieldLabel:'工作内容',allowBlank: false,anchor:'95%'},
		'planmoney':{name:'planmoney',fieldLabel:'计划费用',allowBlank: false,anchor:'95%'},
		'enddate':{name:'enddate',fieldLabel:'工作完成日期',format: 'Y-m-d',anchor:'95%',allowBlank: false},
		'sbsj':{name:'sbsj',fieldLabel:'上报日期',format: 'Y-m-d',anchor:'95%',allowBlank: false},
		'fzr':{name:'fzr',fieldLabel:'负责人',anchor:'95%'},
		'deptuser':{name:'deptuser',fieldLabel:'分管领导审批',anchor:'95%'},
		'zbr':{name:'zbr',fieldLabel:'制表人',anchor:'95%'},
		'memo':{name:'memo',fieldLabel:'备注',anchor:'95%'},
		'memo1':{name:'memo1',fieldLabel:'备用字段',hidden:true,hideLabel:true,anchor:'95%'},
		'dept':{name:'dept',fieldLabel:'上报部门', hidden:true,hideLabel:true},
		'jhzt':{name:'jhzt',fieldLabel:'计划状态', hidden:true,hideLabel:true},
		'billState':{name:'billState',fieldLabel:'执行状态', hidden:true,hideLabel:true},
		'ifbl':{name:'ifbl',fieldLabel:'是否补录', hidden:true,hideLabel:true},
		'bh':{name:'bh',fieldLabel:'编号',anchor:'95%',readOnly:true},
		'hzbh':{name:'hzbh',fieldLabel:'汇总编号',anchor:'95%',hidden:true,hideLabel:true},
		'pid':{name:'pid',fieldLabel:'PID',anchor:'95%',hidden:true,hideLabel:true}
	}
	var sqr_Combo = new fm.ComboBox({
			name:'zbr',
			fieldLabel:'制表人',
			readOnly : true,
			store:getuserSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})	
	var fzr_Combo = new fm.ComboBox({
			name:'fzr',
			fieldLabel:'负责人',
			readOnly : true,
			store:getfzrSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})	
	var deptuser_Combo = new fm.ComboBox({
			name:'deptuser',
			fieldLabel:'分管领导',
			readOnly : true,
			store:getdeptuserSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			anchor:'95%'
		})	
		
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'content',type:'string'},		{name:'planmoney',type:'float'},
		{name:'enddate',type:'date',dateFormat:'Y-m-d H:i:s'},        
		{name:'sbsj',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'fzr',type:'string'},{name:'deptuser',type:'string'},
		{name:'zbr',type:'string'},     {name:'memo',type:'string'},	{name:'memo1',type:'string'},
		{name:'dept',type:'string'},     {name:'jhzt',type:'string'},	{name:'billState',type:'string'},
		{name:'ifbl',type:'string'},
		{name:'bh',type:'string'},{name:'hzbh',type:'string'},{name:'pid',type:'string'}
	]	
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(uids_edit == null || uids_edit==""){
		loadFormRecord = new formRecord({
			uids:'',  content:'',    planmoney:'',   enddate:'', sbsj:'',   fzr:'',   deptuser:'',bh:bh_flow,
			zbr:'',   memo:'',  memo1:'',dept:USERDEPTID,jhzt:'0',billState:'0',ifbl:'1',
			bh:bh_flow, hzbh:'', pid:CURRENTAPPID
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
	   					    new fm.TextField(fc['bh']),
	   						new fm.TextArea(fc['content']),
	   						new fm.NumberField(fc['planmoney']),
	   						new fm.DateField(fc['enddate']),
	   						new fm.DateField(fc['sbsj']),
	   						//new fm.TextField(fc['fzr']),
	   						fzr_Combo,
	   						//deptuser_Combo,
	   						//new fm.TextField(fc['deptuser']),
	   						//sqr_Combo,
	   						//new fm.TextField(fc['zbr']),
	   						new fm.TextArea(fc['memo']),
	   						new fm.Hidden(fc['memo1']),
	   						new fm.Hidden(fc['dept']),
	   						new fm.Hidden(fc['jhzt']),
	   						new fm.Hidden(fc['billState']),
	   						new fm.Hidden(fc['ifbl']),
	   						new fm.Hidden(fc['hzbh']),
	   						new fm.Hidden(fc['pid'])
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
    	tbar: ['<font color=#15428b><b>&nbsp;费用计划信息维护</b></font>','->', 
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
	   		bdgMoneyMgm.addOrUpdateBdgMonthMoneyPlan(obj, function(state){
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
   			bdgMoneyMgm.addOrUpdateBdgMonthMoneyPlan(obj, function(state){
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