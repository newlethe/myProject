var bean = "com.sgepit.pmis.reimburse.hbm.DeptReimburse"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'reDate'
var bgdid_Combo
var maxStockBhPrefix
Ext.onReady(function(){
	
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
		'title':{name:'title',fieldLabel:'标题',anchor:'95%'},
		'reDate':{name:'reDate',fieldLabel:'报销时间',format: 'Y-m-d',anchor:'95%'},
		'reZje':{name:'reZje',id:'reZje',fieldLabel:'报销总金额',anchor:'95%'},
		'jhcontent':{name:'jhcontent',fieldLabel:'计划内容',readOnly:true,allowBlank: false,anchor:'95%'},
		'jhje':{name:'jhje',id:'jhje',fieldLabel:'计划金额',readOnly:true,anchor:'95%'},
		'relj':{name:'relj',id:'relj',fieldLabel:'报销累计金额',readOnly:true,anchor:'95%'},
		'reUser':{name:'reUser',fieldLabel:'报销人',anchor:'95%',hidden:true,hideLabel:true},
		'reDept':{name:'reDept',fieldLabel:'报销部门',anchor:'95%',hidden:true,hideLabel:true},
		'reStyle':{name:'reStyle',fieldLabel:'报销类型',anchor:'95%',hidden:true,hideLabel:true},
		'jhuid':{name:'jhuid',id:'jhuid',fieldLabel:'计划主键',anchor:'95%',hidden:true,hideLabel:true},
		'memo':{name:'memo',fieldLabel:'编号',anchor:'95%',hidden:true,hideLabel:true},
		'memo1':{name:'memo1',fieldLabel:'明细附件',anchor:'95%',hidden:true,hideLabel:true},
		'billState':{name:'billState',fieldLabel:'流程状态',anchor:'95%',hidden:true,hideLabel:true},
		'djState':{name:'djState',fieldLabel:'单据状态',anchor:'95%',hidden:true,hideLabel:true},
		'pid':{name:'pid',fieldLabel:'PID',anchor:'95%',hidden:true,hideLabel:true}
	}
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'title',type:'string'},		{name:'reUser',type:'string'},
		{name:'reDept',type:'string'}, 	 
		{name:'reZje',type:'float'},     {name:'jhje',type:'float'},        {name:'relj',type:'float'},
		{name:'reDate',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'reStyle',type:'string'},   {name:'jhcontent',type:'string'},
		{name:'jhuid',type:'string'},	  {name:'memo',type:'string'},{name:'memo1',type:'string'},
		{name:'billState',type:'string'}, {name:'djState',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;
	if(uids_edit == null || uids_edit==""){
		loadFormRecord = new formRecord({
		uids:'',       title:'',      reUser:USERID,  reDept:USERDEPTID,   reZje:0,jhje:0,    relj:0,   reDate:new Date(),
		reStyle:'0',   jhcontent:'',  jhuid:'',memo:bh_flow, memo1:'',billState:'0',djState:'0',
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
	   						new fm.TextField(fc['title']),
	   						new fm.NumberField(fc['reZje']),
	   						new fm.DateField(fc['reDate']),
	   						new Ext.form.TriggerField({
	                			name:'jhcontent',
	                			id:'jhcontentList',
	                			fieldLabel:'计划内容',
	                			triggerClass: 'x-form-date-trigger',
		    					readOnly: true, selectOnFocus: true,
		    					anchor:'95%',
		    					onTriggerClick:getParamsFromList
		                	 }),
	   						new fm.NumberField(fc['jhje']),
	   						new fm.NumberField(fc['relj']),
	   						new Ext.form.TriggerField({
	                			name:'memo1',
	                			id:'memo1',
	                			fieldLabel:'上传明细(点击上传)',
	                			triggerClass: 'x-form-date-trigger',
		    					readOnly: true, selectOnFocus: true,
		    					width:25,
		    					onTriggerClick:getFile
		                	 }),
	   						new fm.Hidden(fc['pid']),
	   						new fm.Hidden(fc['memo']),
	   						new fm.Hidden(fc['jhuid']),
	   						new fm.Hidden(fc['reDept']),
	   						new fm.Hidden(fc['reStyle']),
	   						new fm.Hidden(fc['billState']),
	   						new fm.Hidden(fc['djState']),
	   						new fm.Hidden(fc['reUser'])
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
    	tbar: ['<font color=#15428b><b>&nbsp;费用报销信息维护</b></font>','->', 
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
		var rezje=0;relj=0;jhje=0
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			Ext.getCmp('reZje').getValue() 
    			if(n=="reZje"){rezje=field.getValue();continue}//本次总金额
    			if(n=="jhje"){jhje=field.getValue();continue}//计划金额
	    		if(n=="relj"){obj[n]=rezje+field.getValue();relj=rezje+field.getValue();continue}//累次
    			obj[n] = field.getValue();
    		}
    	}
    	if(relj>jhje && jhje!=0){
    		Ext.MessageBox.confirm('提示','报销累计金额大于计划金额，继续保存？',function(btn){
    			if(btn=="yes"){
    				saveData(obj)
    			}else{return;}
    		})
    	}else{saveData(obj)}

    }
	function saveData(obj){
    	DWREngine.setAsync(false);
    	if (obj.uids == '' || obj.uids == null){
	   		reimburseMgm.addOrUpdateRe(obj, function(state){
	   			if ("1" == state){
	   				if(isFlwTask != true){
		   				parent.Ext.example.msg('保存成功！', '您成功新增了一条信息！');
		   				history.back();
	   				}else{
						Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条费用报销信息！　　　<br>进入下一步流程！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			reimburseMgm.udpateBillState(bh_flow,function(state){
						   				if("1"==state){
											parent.IS_FINISHED_TASK = true;
											parent.mainTabPanel.setActiveTab('common');
											
						   				}
						   			})
						   		}
						   }
						});	   				
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
   			reimburseMgm.addOrUpdateRe(obj, function(state){
	   			if ("2" == state){
	   				if(isFlwTask != true){
		   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   					history.back();
	   				}else{
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条费用报销信息！　　　<br>进入下一步流程！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
									reimburseMgm.udpateBillState(obj.memo,function(state){
						   				if("1"==state){
											parent.IS_FINISHED_TASK = true;
											parent.mainTabPanel.setActiveTab('common');
						   				}
						   			})
						   		}
						   }
						});
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
   		}
   		DWREngine.setAsync(true);	
	}
    function getParamsFromList(){
    	var rtn = window.showModalDialog(BASE_PATH + 'Business/reimburse/re_info_addorupdate.selecplan.jsp' ,null,"dialogWidth:900px;dialogHeight:500px;center:yes;resizable:yes;")
	    if(rtn){
		    Ext.getCmp('jhje').setValue(rtn.split("||")[0]);
		    Ext.getCmp('jhcontentList').setValue(rtn.split("||")[1]);
		    Ext.getCmp('jhuid').setValue(rtn.split("||")[2])
		    if(rtn.split("||")[2]){
	    	    DWREngine.setAsync(false);
			    baseMgm.getData("select sum(re_Zje)sumrezje from dept_reimburse where (bill_state='1' or bill_state='-1') and jhuid='"+rtn.split("||")[2]+"' ",function(list){  
				    if(list[0]!=""){
					    Ext.getCmp('relj').setValue(list[0])
				    }else{Ext.getCmp('relj').setValue()}
			    });
				DWREngine.setAsync(true);
		    }
	    }   	
    }
    
    
    function getFile(){
    	if(uids_edit==""){
	    	showFileWin('bussiness_deptreimburse',bh_flow,'true','','')
    	}else{
    		DWREngine.setAsync(false);
			baseMgm.getData("select memo from dept_reimburse where uids='"+uids_edit+"'",function(obj){
				showFileWin('bussiness_deptreimburse',obj[0],'true','','')
			});
			DWREngine.setAsync(true);
    	}
    }
});