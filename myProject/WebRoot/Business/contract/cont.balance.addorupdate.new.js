var bean = "com.sgepit.pmis.contract.hbm.ConBalNew";
var primaryKey = 'uids';
var pid = CURRENTAPPID;
var conObj = new Object();
var balTypeArr = new Array();
Ext.onReady(function (){
	DWREngine.setAsync(false);
	var beanName = "com.sgepit.pmis.contract.hbm.ConOveView";
    baseMgm.findById(beanName, g_conid, function(obj){
    	conObj = obj;
    });
    
    appMgm.getCodeValue("合同结算类型",function(list){
    	if(list){
    		for(var i=0;i<list.length;i++){
    			var temp = new Array();
    			temp.push(list[i].propertyCode);
    			temp.push(list[i].propertyName);
    			balTypeArr.push(temp);
    		}
    	}
    });
    DWREngine.setAsync(true);
    var balTypeStore = new Ext.data.SimpleStore({
        fields: ['k','v'],
        data: balTypeArr
    });
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
    	BUTTON_CONFIG['SAVE'].disabled = false;
    } else if (isFlwView == true){
    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['BACK'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    	BUTTON_CONFIG['RESET'].disabled = false;
    }
    
    // 2. 创建列模型  招标方式
    var fm = Ext.form;			// 包名简写（缩写）
     var fc = {		// 创建编辑域配置
    	 'uids': {
			name: 'uids',
			fieldLabel: '主键',
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
         },'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
         }, 'balNo': {
			name: 'balNo',
			fieldLabel: '结算编号',
			//readOnly: true,
			anchor: '95%'
         }, 'balPrice': {
			name: 'balPrice',
			fieldLabel: '竣工结算报价', 
			anchor:'95%'
         }, 'balApproPrice': {
			name: 'balApproPrice',
			fieldLabel: '竣工结算审批价', 
			anchor:'95%'
         }, 'balType': {
			name: 'balType',
			fieldLabel: '结算类型',
	     	displayField: 'v',
			valueField: 'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: balTypeStore,
            lazyRender: true,
            listClass: 'x-combo-list-small',
            allowBlank: true,
			anchor:'95%'
         }, 'applyMan': {
			name: 'applyMan',
			fieldLabel: '申请人',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'applyDate': {
			name: 'applyDate',
			fieldLabel: '申请时间',  
			format: 'Y年m月d日',
            minValue: '2000-01-01',
            readOnly : true,
			fieldLabel: '申请时间',          
			anchor:'95%'
         }, 'fileid': {
			name: 'fileid',
			fieldLabel: '附件',  
			allowNegative: false,   
			anchor:'95%'
         }, 'billState': {
			name: 'billState',
			fieldLabel: '单据状态',  
			allowNegative:false,
			readOnly : true,        
			anchor:'95%'
         }, 'conMoney': {
			name: 'conMoney',
			fieldLabel: '合同金额',
			readOnly : true,          
			anchor:'95%'
         }, 'payMoney': {
			name: 'payMoney',
			fieldLabel: '已付款总金额',
			readOnly : true,  
			anchor:'95%'
         },'payDetail': {
			name: 'payDetail',
			fieldLabel: '付款明细',
			readOnly : true,          
			anchor:'95%'
         },'doBalMoney': {
			name: 'doBalMoney',
			fieldLabel: '处理中结算金额',
			readOnly : true,          
			anchor:'95%'
         },'doneBalMoney': {
			name: 'doneBalMoney',
			fieldLabel: '已处理结算金额',
			readOnly : true,          
			anchor:'95%'
         }
    }
    
    var Columns = [
    	{name: 'uids', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'balNo', type: 'string'},
		{name: 'balPrice', type: 'float'},
		{name: 'balApproPrice', type: 'float'},
		{name: 'balType', type: 'string'},
		{name: 'applyMan', type: 'string'},
		{name: 'applyDate', type: 'date', dateFormat:'Y-m-d H:i:s'},
		{name: 'fileid', type: 'string'},    	
		{name: 'billState', type: 'string'},
		{name: 'conMoney', type: 'float'},
		{name: 'payMoney', type: 'float'},
		{name: 'payDetail', type: 'string'},
		{name: 'doBalMoney', type: 'float'},
		{name: 'doneBalMoney', type: 'float'}
	];
	//自动生成结算编号
	var g_balno = '';
	var maxBal = '';
	DWREngine.setAsync(false);
	baseMgm.getData("select max(nvl(substr(t.bal_no,-3),'1')) balno from con_bal_new t",function(list){
		if(list){
			maxBal = list[0]
		}
	});
	DWREngine.setAsync(true);
	if(maxBal == null || maxBal==''){
		maxBal = '000';
	}
	var year = new Date().getYear();
	var month = new Date().getMonth()>8?new Date().getMonth()+1:'0'+(new Date().getMonth()+1);
	g_balno = parseInt(year+''+month+''+maxBal,10)+1;
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (g_balid == null || g_balid == ''){
    	loadFormRecord = new formRecord({
	    		uids: '',
	    		pid: pid,
	    		conid: g_conid,
	    		balNo:g_balno,
	    		balPrice:'',
	    		balApproPrice:'',
	    		balType:'',
	    		applyMan:REALNAME,
	    		applyDate:new Date(),
	    		conMoney: conObj.convaluemoney,
	    		payMoney:conObj.conpay
	    });
	}else{
		DWREngine.setAsync(false);
	    baseMgm.findById(bean, g_balid, function(obj){
	    	obj.convalue = conObj.convaluemoney;
	    	loadFormRecord = new formRecord(obj)
	    });
	    DWREngine.setAsync(true);
	}
	
	
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	tbar: [
    		new Ext.Button({
				text: '<font color=#15428b><b>&nbsp;合同结算信息维护</b></font>',
				iconCls: 'title'
			}),'->','-',BUTTON_CONFIG['BACK']
		],
    	items: [
    		new Ext.form.FieldSet({
    			title: '结算信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .5,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.Hidden(fc['uids']),
	   						new fm.Hidden(fc['pid']),
	   						new fm.Hidden(fc['conid']),
	   						new fm.TextField(fc['balNo']),
	   						new fm.NumberField(fc['balPrice']),
    						new fm.NumberField(fc['balApproPrice']),
    						new fm.ComboBox(fc['balType'])
	   						
	   					]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.NumberField(fc['conMoney']),
    						new fm.NumberField(fc['payMoney']),
    						
    						new fm.TextField(fc['applyMan']),
    						new fm.DateField(fc['applyDate'])
    					]
    				}
    			]
    		})
    	],
		buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    
    // 9. 创建viewport，加入面板action和content
       var viewport = new Ext.Viewport({
           layout: 'border',
           items: [formPanel]
       });
    // 11. 事件绑定

    
    // 12. 加载数据、控制
	formPanel.getForm().loadRecord(loadFormRecord);

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
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
   			conbalMgm.insertConbalNew(obj, function(state){
	   			if ("" == state){
	   				if (isFlwTask != true){
		   				//Ext.MessageBox.alert('提示', '保存成功！');
		   				//window.history.back();
		   				Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条合同结算信息!',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			window.history.back();
						   		}
						   }
						});
	   				} else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功新增了一条合同结算信息！　　　<br>可以发送流程到下一步操作！',
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
	   			}
	   		});
   		}else{
   			conbalMgm.updateConbalNew(obj, function(state){
	   			if ("" == state){
	   				if (isFlwTask != true) {
				       Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同结算信息!',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			window.history.back();
						   		}
						   }
						});
	   				} else {
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同结算信息！　　　<br>可以发送流程到下一步操作！',
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
});