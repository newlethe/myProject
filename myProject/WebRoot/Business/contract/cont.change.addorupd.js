var bean = "com.sgepit.pmis.contract.hbm.ConCha";
var beanConOve = "com.sgepit.pmis.contract.hbm.ConOveView";
var business = "baseMgm";
var listMethod = "findByProperty";
var primaryKey = "chaid";
var orderColumn = "chano";
var formPanelTitle = "编辑记录（查看详细信息）";
var pageSize = PAGE_SIZE;
var SPLITB = "`";
var pid = CURRENTAPPID;
var propertyName = "chaid";
var propertyValue = g_conid;
var changeType = new Array();
var CONOVE;
var conViewWin, adjunctWin;

Ext.onReady(function (){

    var fm = Ext.form;			// 包名简写（缩写）

	DWREngine.setAsync(false);
	appMgm.getCodeValue('合同变更类型',function(list){      //获取变更类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			changeType.push(temp);			
		}
    });
		baseDao.findByWhere5(beanConOve, "conid='"+g_conid+"'", null,null,null,function(list){
			CONOVE = list[0];
		});
	DWREngine.setAsync(true);
	
	/**
	 * @description 被流程所调用的页面中，按钮的统一化管理
	 * @param BUTTON_CONFIG - 存放当前页面上的所有按钮
	 * @author xiaos
	 */
    var BUTTON_CONFIG = {
    	'BACK': {
			text: '返回',
			iconCls: 'returnTo',
			disabled: true,
			handler: function(){
				history.back();
			}
		},'ADJUNCT': {
			text: '合同附件',
			iconCls: 'word',
			disabled: true,
			handler: gotoConAdjunct
		},'VIEW': {
			text: '合同信息',
			iconCls: 'btn',
			disabled: true,
			handler: gotoConView
		},'SAVE': {
			id: 'save',
	        text: '保存',
	        disabled: true,
	        handler: formSave
	    },'RESET': {
			id: 'reset',
	        text: '取消',
	        disabled: true,
	        handler: function(){
	        	history.back();
	        }
	    }
    };

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
    
	var dschangeType = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: changeType
    });
	var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chaid': {
			name: 'chaid',
			fieldLabel: '变更流水号',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chano': {
			name: 'chano',
			fieldLabel: '变更单编号<font color=\'red\'>*</font>',
			allowBlank: false,
			anchor:'95%'
         }, 'chamoney': {
			name: 'chamoney',
			fieldLabel: '变更金额<font color=\'red\'>*</font>', 
			allowBlank: false,
			allowNegative: true,
            maxValue: 100000000,
			anchor:'95%'
         }, 'actionman': {
			name: 'actionman',
			fieldLabel: '经办人',
			hidden: true,
			readOnly:true,
			hideLabel:true,
			anchor:'95%'
         }, 'chadate': {
			name: 'chadate',
			fieldLabel: '变更日期<font color=\'red\'>*</font>',
			allowBlank: false,
			width:130, 
			format: 'Y-m-d',
            minValue: '2000-01-01',
			anchor:'95%'
         },'chatype': {
			name: 'chatype',
			fieldLabel: '变更类型<font color=\'red\'>*</font>',
			allowBlank: false,
			store:dschangeType,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            width:120,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
			anchor:'95%'
         }, 'chareason': {
			name: 'chareason',
			fieldLabel: '变更依据',  
		//	readOnly:true,
			hideLabel:true,
			height: 100,
			width: 645,
			xtype: 'htmleditor',      
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '变更内容',
			//readOnly:true,
			hideLabel:true,
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '变更附件号',
			hidden: true,
			hideLabel:true,
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			hidden: true,
			hideLabel: true,
			anchor:'95%'
         }
	}; 
	// 3. 定义记录集
    var Columns = [
    		{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
			{name: 'pid', type: 'string'},
			{name: 'chaid', type: 'string'},
			{name: 'chano', type: 'string'},
			{name: 'chamoney', type: 'float'},
			{name: 'chatype', type: 'string'},
			{name: 'chadate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'actionman', type: 'string'},
			{name: 'chareason', type: 'string'},
			{name: 'remark', type: 'string'},
			{name: 'filelsh', type: 'string'},
			{name: 'billstate', type: 'float'}
	];
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (isFlwTask == true || isFlwView == true){	//任务调用模块
    	DWREngine.setAsync(false);
    	baseDao.findByWhere5(bean, "chano='"+g_chano+"'", null,null,null,function(list){
    		if (list.length > 0){
    			list[0].billstate = '1';
    			loadFormRecord = new formRecord(list[0]);
    		} else {
				loadFormRecord = new formRecord({
			    		conid: CONOVE.conid,
			    		pid:pid,
			    		chaid: '',
			    		chano: g_chano,
			    		chamoney: '',
			    		chatype: '',
			    		chadate: '',
			    		actionman:USERID, 
			    		chareason:'', 
			    		remark:'', 
			    		filelsh:'',
			    		billstate: '1'
			    });
    		}
    	});
    	DWREngine.setAsync(true);
    } else {
    	if (g_chaid == null || g_chaid == ''){
	    	loadFormRecord = new formRecord({
		    		conid: g_conid,
		    		pid:pid,
		    		chaid: '',
		    		chano: '',
		    		chamoney: '',
		    		chatype: '',
		    		chadate: '',
		    		actionman:USERID, 
		    		chareason:'', 
		    		remark:'', 
		    		filelsh:'',
		    		billstate: '0'
		    });
	    }else{
	    	DWREngine.setAsync(false);
	   		baseMgm.findById(bean, g_chaid, function(obj){
		    	loadFormRecord = new formRecord(obj);
		    });
		    DWREngine.setAsync(true);
		}
    }
	var btnTitle = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;合同变更信息维护</b></font>',
		iconCls: 'title'
	});
		
	// 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        border: false,
        autoScroll: true,
        region: 'center',
        bodyStyle: 'padding:10px 10px; border:0px',
    	//iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	tbar: [
    		btnTitle, '->', 
    		BUTTON_CONFIG['ADJUNCT'], '-',
    		BUTTON_CONFIG['VIEW'], '-',
    		BUTTON_CONFIG['BACK']
    	],
    	items: [
    		new Ext.form.FieldSet({
    			title: '变更信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .4,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['chano']),
			            	new fm.ComboBox(fc['chatype']),
							new fm.TextField(fc['actionman'])
	   					]
    				},{
    					layout: 'form', columnWidth: .4,
    					bodyStyle: 'border: 0px;',
    					items:[
    					    new fm.NumberField(fc['chamoney']),
	   						new fm.DateField(fc['chadate']),
	   						new fm.TextField(fc['filelsh'])
    					]
    				}
    			]
    		}),
    		new Ext.form.FieldSet({
    			title: '变更依据',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: 1,
	   					bodyStyle: 'border: 0px;',
	   					items:[ /*fc['chareason']*/new fm.TextArea(fc['chareason']) ]
    				},{
    					layout: 'form', columnWidth: .0,
    					bodyStyle: 'border: 0px;',
    					items:[
					        new fm.TextField(fc['pid']),
	   						new fm.TextField(fc['conid']),
			            	new fm.TextField(fc['chaid']),
			            	new fm.TextField(fc['billstate'])
    					]
    				}
    			]
    		}),
    		new Ext.form.FieldSet({
    			title: '变更内容',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: 1,
	   					bodyStyle: 'border: 0px;',
	   					items:[ /*fc['remark']*/new fm.TextArea(fc['remark']) ]
    				}
				]
    		})
    	],
		buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']],
		bbar: ['->',
			'<font color=green>处理中累计：</font>',{xtype: 'textfield', id: 'processTotal', readOnly: true, cls: 'shawsar'},'-',
	    	'<font color=red>已处理累计：</font>',{xtype: 'textfield', id: 'finishTotal', readOnly: true, cls: 'shawsar'},'-'
		]
    });

    // 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        border: false,
        items: [formPanel],
        listeners: {
        	afterlayout: loadChangeTotal
        }
    });

    // 11. 事件绑定
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
	if (isFlwTask == true) SET_FIELD_EDITABLE_FOR_FLOW();
	
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

    function formSave(){
    	var form = formPanel.getForm();
//    	var ids = form.findField(primaryKey).getValue();
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
    	if(CONOVE.billstate!='1'&&CONOVE.billstate!='2'){
    	    Ext.Msg.alert('提示信息','只有已签订或合同执行中的合同才能进行变更信息录入！');
    	    return ;
    	}
    	var rtnState='';
    	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
    	    rtnState=rtn;
    	});
    	if (obj.chaid == '' || obj.chaid == null ){
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
	   		conchaMgm.instConCha(obj, function(state){
	   			if ("0" == state){
	   				if (isFlwTask != true){
	   					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
		   				Ext.Msg.show({
						   title: '提示',
						   msg: '是否继续新增?　　　',
						   buttons: Ext.Msg.YESNO,
						   fn: processResult,
						   icon: Ext.MessageBox.QUESTION
						});
	   				} else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条合同变更信息！　　　<br>可以发送流程到下一步操作！',
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
   			conchaMgm.updConCha(obj, function(state){
	   			if ("1" == state){
	   				if (isFlwTask != true) {
	   					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   					history.back();
	   				} else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同变更信息！　　　<br>可以发送流程到下一步操作！',
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
    		formPanel.getForm().reset();
    		formPanel.getForm().findField('conid').setValue(g_conid);
    		formPanel.getForm().findField('pid').setValue(pid);
            formPanel.getForm().findField('actionman').setValue(USERID);
    	}else{
    		history.back();
    	}
    }
    
    
    // 下拉列表中 k v 的mapping 
   	function changeTypesRender(value){	//变更类型
   		var str = '';
   		for(var i=0; i<changeTypes.length; i++) {
   			if (changeTypes[i][0] == value) {
   				str = changeTypes[i][1]
   				break; 
   			}
   		}
   		return str;
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
   	
   	function loadChangeTotal(){
   		var _conid = (isFlwTask == true||isFlwView == true) ? CONOVE.conid : g_conid;
		var _value_process = 0, _value_finish = 0, _value_all = 0;
		baseDao.findByWhere5(bean, "conid='"+_conid+"'", null,null,null,function(list){
			if (list){
				for (var i=0; i<list.length; i++){
					if (1 == list[i].billstate){
						_value_finish += list[i].chamoney;
					} else if (-1 == list[i].billstate){
						_value_process += list[i].chamoney;
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


