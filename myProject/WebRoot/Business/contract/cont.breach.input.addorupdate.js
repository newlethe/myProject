var bean = "com.sgepit.pmis.contract.hbm.ConBre"
var beanConOve = "com.sgepit.pmis.contract.hbm.ConOveView";
var business = "baseMgm"
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
var CONOVE;//合同详细信息
var adjunctWin;//合同附件文档查看
var conViewWin ;//合同相信信息
Ext.onReady(function (){
    DWREngine.setAsync(false);  
	appMgm.getCodeValue('合同违约类型',function(list){         //获取违约类型
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
         },'breid': {
			name: 'breid',
			fieldLabel: '违约流水号',
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
         }, 'breno': {
			name: 'breno',
			fieldLabel: '违约编号',
			width : 150,
			anchor:'95%'
         }, 'brereason': {
			name: 'brereason',
			fieldLabel: '违约原因<font color=red>*</font>', 
			hideLabel : true, 
			height: 90,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'bredate': {
			name: 'bredate',
			fieldLabel: '违约日期<font color=red>*</font>',
			width:150,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            allowBlank: false,
			anchor:'95%'
         }, 'dedmoney': {
			name: 'dedmoney',
			fieldLabel: '违约金额<font color=red>*</font>',
			width : 150, 
			allowNegative:true,  
			allowBlank: false,       
			anchor:'95%'
         }, 'bretype': {
			name: 'bretype',
			fieldLabel: '违约类型<font color=red>*</font>',
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
			height: 70,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'brework': {
			name: 'brework',
			fieldLabel: '违约处理*',
			hideLabel : true,
			height: 75,
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
            fieldLabel : '流程状态',
            hidden :true,
            hideLabel : true,
            anchor : '95%'
         }    
    }
    
    // 3. 定义记录集
    var Columns = [
    	{name: 'conid', type: 'string'},
    	{name: 'breid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'breno', type: 'string'},    	
		{name: 'bredate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'dedmoney', type: 'float'},
		{name: 'bretype', type: 'string'},
		{name: 'filelsh', type: 'string'},						//表单增加的列
		{name: 'brereason', type: 'string'},
		{name: 'brework', type: 'string'},
		{name: 'remark', type: 'string'},
		{name :'billstate',type :'float'}
		]
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if(isFlwTask == true||isFlwView == true){
        DWREngine.setAsync(false);
        baseDao.findByWhere5(bean,"breno='"+g_breno+"'",null,null,null,function(list){
            if(list.length>0){
                list[0].billstate=0
                loadFormRecord = new formRecord(list[0])
            }else {
                loadFormRecord = new formRecord({
    	            conid: g_conid,
    	            pid : pid,
    	            breno:  '',
    	            dedmoney: 0,
    	            bretype:'',
	    		    filelsh:'',
	    		    brereason:'',
	    		    brework:'',
	    		    remark:'',
	    		    billstate:1
                })
            }
        })
        DWREngine.setAsync(true);
    }else {
        if(g_breid == null ||g_breid == 'null' || g_breid == ''){
    	loadFormRecord = new formRecord({
    	        conid: g_conid,
    	        pid : pid,
    	        breno:  '',
    	        dedmoney: '',
    	        bretype:'',
	    		filelsh:'',
	    		brereason:'',
	    		brework:'',
	    		remark:'',
	    		billstate:0
	    });            
        }else {
            DWREngine.setAsync(false);
            baseMgm.findById(bean,g_breid,function (obj){
                loadFormRecord = new formRecord(obj);
            })
            DWREngine.setAsync(true);            
        }
    }
    var btnTitle = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;合同违约信息维护</b></font>',
		iconCls: 'title'
	});	
    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id:'form-panel',
        border: false,
        header : false,
    	iconCls: 'icon-detail-form',	//面板样式
    	width : 400,
        height: 200,
        minSize: 100,
        //layout: 'fit',
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
    	bodyStyle:'padding:8px 8px',
    	items: [
    			new Ext.form.FieldSet({
    			title: '违约基本信息',
    			width:700,
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .5,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		   						 new fm.TextField(fc['breno']),
		                		 new fm.ComboBox(fc['bretype'])         			            	
				            	 
	   						   ]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.NumberField(fc['dedmoney']),
				            	new fm.DateField(fc['bredate']),
				            	new fm.TextField(fc['billstate'])
    						   ]
    				},{
    					layout: 'form', columnWidth: 0.0,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						new fm.TextField(fc['breid']),
				            	new fm.TextField(fc['pid']),
				            	new fm.TextField(fc['conid'])
    					      ]
    				  }    				
    			]}),new fm.TextField(fc['filelsh']),
	   			new Ext.form.FieldSet({
	   				layout: 'form',
	            	border:true, 
	            	title:'违约原因',
	            	cls:'x-plain',  
	            	items: [ fc['brereason'] ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'违约处理',
	            	cls:'x-plain',  
	            	items: [ fc['brework'] ]
	    		}),
	    		new Ext.form.FieldSet({
	    			layout: 'form',
	            	border:true, 
	            	title:'备注',
	            	cls:'x-plain',  
	            	items: [ fc['remark'] ]
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
        layout:'border',
        region:'center',
        split:true,
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
    	var ids = form.findField(primaryKey).getValue()
    	if(form.findField("brework").getValue()!=""){
	    	if (form.isValid()){
		    	if (formPanel.isNew) {
		    		doFormSave(true)
		    	} else {
		    		doFormSave(false)
		    	}
		    }
    	}else{
    		Ext.MessageBox.alert("敬告","违约处理不能为空!");
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
    	    Ext.Msg.alert('提示信息','只有已签订或合同执行中的合同才能进行违约信息录入！');
    	    return ;
    	}
    	systemMgm.getFlowType(USERUNITID,"",function(rtn){
//    	    rtnState=rtn;
    		rtnState='ChangeStateAuto';
    	});    	
    	if (obj.breid == '' || obj.breid == null){
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
	   		conbreMgm.insertConbre(obj, function(){
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
					   msg: '您成功新增了一条合同违约信息！　　　<br>可以发送流程到下一步操作！',
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
   			conbreMgm.updateConbre(obj, function(){
   					if(!isFlwTask){
	   				    Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				    history.back();
   					}else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同违约信息！　　　<br>可以发送流程到下一步操作！',
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
    		window.history.back();
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
						_value_finish += list[i].dedmoney;
					} else if (-1 == list[i].billstate){
						_value_process += list[i].dedmoney;
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




