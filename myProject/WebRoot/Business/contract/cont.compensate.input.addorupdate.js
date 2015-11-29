
var bean = "com.sgepit.pmis.contract.hbm.ConCla"
var beanConOve = "com.sgepit.pmis.contract.hbm.ConOveView";
var listMethod = "findByProperty"
var primaryKey = "breid"
var orderColumn = "breno"
var formPanelTitle = "新增一条记录"
var propertyName = "conid"
var propertyValue = g_conid;
var SPLITB = "`"
var pid = CURRENTAPPID;
var penaltytypes = new Array();
var formWindow;
var myWindow;
var adjunctWin;//合同附件文档查看
var conViewWin ;//合同相信信息
var CONOVE;
Ext.onReady(function (){
    DWREngine.setAsync(false);  
	appMgm.getCodeValue('合同索赔类型',function(list){         //获取违约类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			penaltytypes.push(temp);			
		}
    });
    baseDao.findByWhere5(beanConOve, "conid='"+g_conid+"'", null,null,null,function(list){
		CONOVE = list[0];
	});
    DWREngine.setAsync(true);
    
    var dspenaltytype = new Ext.data.SimpleStore({
        fields: ['k', 'v'],     
        data: penaltytypes
    });	 
    /**
     * 存放当前页面上所有按钮
     */
	var BUTTON_CONFIG = {
	    'BACK':{
	        text : '返回',
	        iconCls : 'returnTo',
	        disabled: true,
	        handler : function (){
	            history.back();
	        }
	    },'ADJUNCT':{
	        text :'合同附件',
	        iconCls : 'word',
	        disabled:true,
	        handler :gotoConAdjunct
	    },'VIEW':{
	        text : '合同信息',
	        iconCls: 'btn',
	        disabled: true,
	        handler: gotoConView
	    },'SAVE':{
	        id: 'save',
	        text: '保存',
	        disabled: true,
	        handler: formSave
	    },'RESET':{
	        id: 'reset',
	        text: '取消',
	        disabled: true,
	        handler : function (){
	            history.back();
	        }
	    }
	}
    /**
     * @description 本页面一共有3种被调用的状态：
     * 		1、普通应用程序调用；
     * 		2、流程实例在流转中，任务节点调用；
     * 		3、流程实例被查看的时候调用；
     * @param isFlwTask = true 为第2种状态
     * @param isFlwView = true 为第3种状态
     * @param isFlwTask != true && isFlwView != true 为第1种状态
     */
    if (isFlwTask == true){
    	BUTTON_CONFIG['ADJUNCT'].disabled = false;
    	BUTTON_CONFIG['VIEW'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    } else if (isFlwView == true){
    	BUTTON_CONFIG['ADJUNCT'].disabled = false;
    	BUTTON_CONFIG['VIEW'].disabled = false;    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADJUNCT'].disabled = false;
    	BUTTON_CONFIG['BACK'].disabled = false;
    	BUTTON_CONFIG['VIEW'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    	BUTTON_CONFIG['RESET'].disabled = false;
    }
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         },'claid': {
			name: 'claid',
			fieldLabel: '索赔流水号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'clano': {
			name: 'clano',
			fieldLabel: '索赔编号',
			width : 150,
			anchor:'95%'
         }, 'clatext': {
			name: 'clatext',
			fieldLabel: '索赔情况<font color=red>*</font>', 
			hideLabel : true, 
			height: 120,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'cladate': {
			name: 'cladate',
			fieldLabel: '索赔日期<font color=red>*</font>',
			width:150,
            format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         }, 'clamoney': {
			name: 'clamoney',
			fieldLabel: '索赔金额<font color=red>*</font>',
			width : 150, 
			allowNegative:true,  
			allowBlank: false,       
			anchor:'95%'
         }, 'clatype': {
			name: 'clatype',
			fieldLabel: '索赔类型<font color=red>*</font>',
			valueField:'k',
			displayField: 'v', 
			emptyText:'请选择违约类型...',  
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dspenaltytype,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            width : 150,
            allowNegative: false,
            maxValue: 100000000,   
            allowBlank: false,      
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			hideLabel : true,
			height: 120,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'clawork': {
			name: 'clawork',
			fieldLabel: '索赔处理<font color=red>*</font>',
			hideLabel : true,
			height: 120,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '附件流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
         },'billstate':{
         	name : 'billstate',
         	fieldLabel:'流程状态',
         	hidden :true,
         	hideLabel :true,
         	anchor:'95%'
         }    
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'claid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'clano', type: 'string'},    	
		{name: 'clamoney', type: 'float'},
		{name: 'clatype', type: 'string'},
		{name: 'cladate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'filelsh', type: 'string'},
		{name: 'clatext', type: 'string'},
		{name: 'clawork', type: 'string'},
		{name : 'billstate', type :'float'}
		]
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if(isFlwTask == true||isFlwView == true){
        DWREngine.setAsync(false);
        baseDao.findByWhere5(bean," clano='"+g_clano+"'",null,null,null,function(list){
            if(list.length>0){
                list[0].billstate=0
                loadFormRecord = new formRecord(list[0]);
            }else {
            	loadFormRecord = new formRecord({
            	    conid: g_conid,
            	    pid : pid,
            	    //claid:  g_claid,
            	    clano:  g_clano,
            	    clamoney: 0,
            	    clatype:'',
            	    filelsh:'',
            	    clatext:'',
            	    clawork:'',
            	    billstate: '1'
            	})
            }
        });
        DWREngine.setAsync(true);
    }else {
        if(g_claid == null ||g_claid == 'null' || g_claid == ''){
            loadFormRecord = new formRecord({
    	        conid: g_conid,
    	        pid : pid,
    	        clano:  '',
    	        clamoney: '',
    	        clatype:'',
	    		filelsh:'',
	    		clatext:'',
	    		clawork:'',
	    		billstate:0
            })
        }else {
            DWREngine.setAsync(false);
            baseMgm.findById(bean,g_claid,function (obj){
                loadFormRecord = new formRecord(obj);
            })
            DWREngine.setAsync(true);
        }
    }
    var btnTitle = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;合同索赔信息维护</b></font>',
		iconCls: 'title'
	});
    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id:'form-panel',
        border: false,
    	iconCls: 'icon-detail-form',	//面板样式
        height: 250,
        minSize: 100,
        autoWidth : true,
        region: 'center',
        split:true,
    	collapsible: true,
    	collapseMode: 'mini',
    	autoScroll: true,
    	labelAlign: 'left',
    	tbar:[
    		btnTitle, '->', 
    		BUTTON_CONFIG['ADJUNCT'], '-',
    		BUTTON_CONFIG['VIEW'], '-',
    		BUTTON_CONFIG['BACK']    	
    	],
    	bodyStyle:'padding:8px 8px 0',
    	items: [
    			new Ext.form.FieldSet({
    			title: '索赔基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .4,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		   						 new fm.TextField(fc['clano']),
		                		 new fm.ComboBox(fc['clatype'])         			            	
				            	 
	   						   ]
    				},{
    					layout: 'form', columnWidth: .4,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.NumberField(fc['clamoney']),
				            	new fm.DateField(fc['cladate']),
				            	new fm.TextField(fc['billstate'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .0,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						new fm.TextField(fc['claid']),
				            	new fm.TextField(fc['pid']),
				            	new fm.TextField(fc['filelsh']),
				            	new fm.TextField(fc['conid'])
    					      ]
    				  }    				
    			]
    		}),
   			new Ext.form.FieldSet({
   				layout: 'form',
            	border:true, 
            	title:'索赔情况',
            	cls:'x-plain',  
            	items: [ fc['clatext'] ]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
            	border:true, 
            	title:'索赔处理',
            	cls:'x-plain',  
            	items: [ fc['clawork'] ]
    		})
    		],
		buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']],
		bbar: ['->',
			'<font color=green>处理中累计：</font>',{xtype: 'textfield', id: 'processTotal', readOnly: true, cls: 'shawsar'},'-',
	    	'<font color=red>已处理累计：</font>',{xtype: 'textfield', id: 'finishTotal', readOnly: true, cls: 'shawsar'},'-'
		]
        
    });

     var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        header : false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[formPanel]
    });
    
	// 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel],
            listeners :{
                afterlayout: loadChangeTotal
            }
        });
    }
    
    formPanel.getForm().loadRecord(loadFormRecord);
	if (isFlwTask == true) SET_FIELD_EDITABLE_FOR_FLOW();
	
    function formSave(){
    	var form = formPanel.getForm()
    	if (form.isValid()){
	    	if (formPanel.isNew) {
	    		doFormSave(true)
	    	} else {
	    		doFormSave(false)
	    	}
	    }
    }
    
    function doFormSave(isNew, dataArr){
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
        if(CONOVE.billstate!='1'&&CONOVE.billstate!='2'){
    	    Ext.Msg.alert('提示信息','只有已签订或合同执行中的合同才能进行索赔信息录入！');
    	    return ;
    	}
    	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
    	    rtnState=rtn;
    	});    	
    	if (obj.claid == '' || obj.claid == null){
    		if(isFlwTask != true || isFlwView!= true){
    		    if(rtnState=='BusinessProcess'){
    		        Ext.Msg.alert('提示信息','该新增操作只能在流程中操作');
    		        return;
    		    }
	    		if(rtnState=='BusinessProcess'){
	    		    obj.billstate=0;
	    		}else if(rtnState=='ChangeStateAuto'){
	    		    obj.billstate=1;
	    		}else if(rtnState=='None'){
	    		    Ext.Msg.alert('提示信息','该功能模块不允许流程审批');
	    		    return ;
	    		}    	
    		} else {
    			obj.billstate=-1;
    		}
	   		conclaMgm.insertConCla(obj, function(state){
	   			if(state=='0'){
	   			    if(!isFlwTask){
	   				    Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				    Ext.Msg.show({                   // 继续新增
					       title: '提示',
					       msg: '是否继续新增?　　　',
					       buttons: Ext.Msg.YESNO,
					       fn: processResult,
					       icon: Ext.MessageBox.QUESTION
					    });
	   			    }else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条合同索赔信息！　　　<br>可以发送流程到下一步操作！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
						   		}
						   }
						});	   			        
	   			    }
	   			}else {
	   			    Ext.Msg.show({
	   			        title : '提示',
	   			        msg: state,
	   			        buttons: Ext.Msg.OK,
	   			        icon: Ext.MessageBox.ERROR
	   			    })
	   			}
	   		});
   		}else{
   			if (isFlwTask != true && isFlwView != true){
   		     	//通过配置信息判断该流程是否走审批流程
   			    if(rtnState=='BusinessProcess'&&obj.billstate!='0'){
   			        Ext.Msg.alert('提示信息','审批流程中或审批结束 数据不能修改');
   			        return ;
   			    }
   			}else {
   			     if(obj.billstate=='1'){
   			         Ext.Msg.alert('提示信息','流程已结束的数据不能进行修改');
   			         return;
   			     }
   			}   			
   			conclaMgm.updateConCla(obj, function(state){
   				if(state=='0'){
   					if(!isFlwTask){
	   				    Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				    history.back();
   					}else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同索赔信息！　　　<br>可以发送流程到下一步操作！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
						   		}
						   }
						});   					
   					}
   				}else {
   				    Ext.Msg.show({
   				        title : '提示',
   				        msg: state,
   				        buttons: Ext.Msg.OK,
   				        icon: Ext.MessageBox.ERROR
   				    })
   				}
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		formPanel.getForm().reset();
    		formPanel.getForm().findField('conid').setValue(g_conid);
    		formPanel.getForm().findField('pid').setValue(pid);
    	}else{
    		history.back();
    	}
    }
    function penaltytypeRender(value){
   		var str = '';
   		for(var i=0; i<penaltytypes.length; i++) {
   			if (penaltytypes[i][0] == value) {
   				str = penaltytypes[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
    function gotoConAdjunct(){
   		if (!adjunctWin){
   			adjunctWin = new Ext.Window({
				title: '合同附件文档',
				iconCls: 'option',
				layout: 'fit',
				width: 750, height: 450,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true
			});
   		}
   		var _CONID = '';
   		if (isFlwTask == true||isFlwView == true){
   			_CONID = CONOVE.conid;
   		} else {
   			_CONID = g_conid;
   		}
   		adjunctWin.show();
   		adjunctWin.load({
			url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
			params: 'type=adjunct&conid='+_CONID
		});        
    }
    function gotoConView(){
   		if (!conViewWin){
   			conViewWin = new Ext.Window({
				title: '合同详细信息',
				iconCls: 'option',
				layout: 'fit',
				width: 750, height: 350,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: true, plain: true
			});
   		}
   		var _CONID = '';
   		if (isFlwTask == true||isFlwView == true){
   			_CONID = CONOVE.conid;
   		} else {
   			_CONID = g_conid;
   		}
   		conViewWin.show();
   		conViewWin.load({
			url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
			params: 'type=conView&conid='+_CONID
		});        
    }
   	function loadChangeTotal(){
   		var _conid = (isFlwTask == true||isFlwView == true) ? CONOVE.conid : g_conid;
		var _value_process = 0, _value_finish = 0, _value_all = 0;
		baseDao.findByWhere5(bean, "conid='"+_conid+"'", null,null,null,function(list){
			if (list){
				for (var i=0; i<list.length; i++){
					if (1 == list[i].billstate){
						_value_finish += list[i].clamoney;
					} else if (-1 == list[i].billstate){
						_value_process += list[i].clamoney;
					}
				}
			}
			Ext.getCmp('finishTotal').setValue(cnMoneyToPrec(_value_finish));
			Ext.getCmp('processTotal').setValue(cnMoneyToPrec(_value_process));
		});
	}    
   	/**
   	 * 流程调用模块时候，对模板上的栏位进行的限制
   	 */
   	function SET_FIELD_EDITABLE_FOR_FLOW(){
   		if (g_faceid){
   			baseDao.findByWhere5(faceColBean, "faceid='"+g_faceid+"'",null,null,null, function(list){
   				if (list.length > 0){
   					var form = formPanel.getForm();
   					for (var i=0; i<Columns.length; i++) {
			    		var n = Columns[i].name;
			    		var field = form.findField(n);
			    		if (field) {
			    			for (var j=0; j<list.length; j++) {
			    				if (field.getName().toUpperCase() == list[j].colname) {
			    					field.setDisabled(true);
			    				}
			    			}
			    		}
   					}
   				}
   			});
   		}
   	}    
});




