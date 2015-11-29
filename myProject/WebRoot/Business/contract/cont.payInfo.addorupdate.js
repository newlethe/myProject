var bean = "com.sgepit.pmis.contract.hbm.ConPay";
var beanConOve = "com.sgepit.pmis.contract.hbm.ConOve";
var faceColBean = "com.sgepit.frame.flow.hbm.FlwFaceColumns";
var primaryKey = 'payid';
var pid = CURRENTAPPID;
var accInfoWindow;
var payTypes = new Array();
var conExpList = new Array();
var objFields = new Array();
var conAccInfoList = new Array();
var cashuse_list = new Array();
var countInfoList = new Array();
var payways= new Array();//付款方式
var payactman=new Array();//经办人
var CONOVE;
var getpaybh;
var conPayChargeWin;//合同付款扣款记录
var conViewWin, adjunctWin;
var conObj;//合同信息记录
var demonArr = new Array();//合同扣款数组
var payObj;	//合同付款记录

//是否国金
var isGj = CURRENTAPPID=='1030902'||CURRENTAPPID=='1030903' ? true : false;

Ext.onReady(function (){
	DWREngine.setAsync(false);
	conpayMgm.AutoPayNo(REALNAME,USERNAME, function(value){
		getpaybh=value;
	});
	 appMgm.getCodeValue('合同付款类型',function(list){			//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyName);
    		payTypes.push(temp);
    	}
    });
	appMgm.getCodeValue('扣款项目名称',function(list){			//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		demonArr.push(temp);
    	}
    });
	appMgm.getCodeValue('合同付款方式',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			payways.push(temp);			
		}
    }); 

    appMgm.getCodeValue('合同费用归属',function(list){			
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		cashuse_list.push(temp);
    	}
    });
    if (isFlwTask == true||isFlwView == true){
		baseDao.findByWhere2(beanConOve, "conno='"+g_conno+"'", function(list){
			CONOVE = list[0];
		});
		if (g_payno != null && g_payno != ''){
			baseDao.findByWhere2(bean, "payno='"+g_payno+"'", function(list){
				if (list.length>0){
					conAccinfoMgm.getConAccinfoBeans(list[0].payid, function(list){
						if (list != null){
							for (var i = 0; i < list.length; i++){
								var temp = new Array();
								temp.push(list[i].expression);
								temp.push(list[i].expvalue);
								temp.push(list[i].accid);
								conAccInfoList.push(temp);
							}
						}
					});
				}
			});
		}
    } else {
		conAccinfoMgm.getConAccinfoBeans(g_payid, function(list){
			if (list != null){
				for (var i = 0; i < list.length; i++){
					var temp = new Array();
					temp.push(list[i].expression);
					temp.push(list[i].expvalue);
					temp.push(list[i].accid);
					conAccInfoList.push(temp);
				}
			}
		});
    }

	if(g_conid && g_conid!='null') {
		baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOveView","conid='"+g_conid+"'",function(list){
		   for(var i=0;i<list.length;i++){
		        conObj=list[i];
		   }
		})
	} else {
		baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOveView","conno='"+g_conno+"'",function(list){
		   for(var i=0;i<list.length;i++){
		        conObj=list[i];
		        g_conid = conObj.conid;
		   }
		})
	}
	if (g_payid != null && g_payid != ''){
		baseDao.findByWhere2(bean, "payid='"+g_payid+"'", function(list){
			if (list.length==1){
				payObj = list[0];
			}
		});
	}
		
	var currentConidPid=conObj.pid;  
	PCBidDWR.getUserInDept(currentConidPid,function(list){
	array_user=new Array();
	for(i = 0; i < list.length; i++) {
		var temp = new Array();	
		temp.push(list[i].userid);
		temp.push(list[i].realname);
		payactman.push(temp);			
		}
	});		
	DWREngine.setAsync(true); 

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
		},/*'ADD': {
	    	text: '选择帐目信息',
	    	tooltip: '选择帐目信息',
	    	iconCls: 'add',
	    	disabled: true,
	    	handler: newWin
	    },*/'SAVE': {
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
	    },'GETAPPLYMONEY':{
	       id : 'getapplymoney',
	       text : '获取申请付款金额',
	       iconCls :'btn',
	       tooltip:"获取工程量完成中申请付款金额",
	       disabled: true,
	       handler : getApplyMoney
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
    	//BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    	BUTTON_CONFIG['GETAPPLYMONEY'].disabled = false;
    } else if (isFlwView == true){
    	BUTTON_CONFIG['ADJUNCT'].disabled = false;
    	BUTTON_CONFIG['VIEW'].disabled = false;    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['ADJUNCT'].disabled = false;
    	BUTTON_CONFIG['BACK'].disabled = false;
    	BUTTON_CONFIG['VIEW'].disabled = false;
    //	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    	BUTTON_CONFIG['RESET'].disabled = false;
    	BUTTON_CONFIG['GETAPPLYMONEY'].disabled = false;
    }
	
  
 	var payTypeStore = new Ext.data.SimpleStore({
        fields: ['k'],
        data: payTypes
    });
    var deMonStore = new Ext.data.SimpleStore({
        fields:['k','v'],
        data: demonArr
    })
 	var cashuse_list_Store = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: cashuse_list
    });
    var dsPayway = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: payways
    });
    var dsPayactman = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: payactman
    });
    // 2. 创建列模型  招标方式
    var fm = Ext.form;			// 包名简写（缩写）

	var fc = {		// 创建编辑域配置
    	 'payid': {
			name: 'payid',
			fieldLabel: '主键',
			height: 0,
			width: 0,
			anchor: '40%',
			hidden: true,
			hideLabel: true
			//allowBlank: true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			//allowBlank: true,
			anchor: '95%'
         }, 'payno': {
			name: 'payno',
			fieldLabel: '付款编号<font color=\'red\'>*</font>',
			hideLabel: false,
			allowBlank: false,
			anchor:'95%'
         }, 'actman': {
		    name: 'actman',
		    fieldLabel: '经办人',
		    //valueField: 'k',
		    //displayField: 'v',
		    //mode: 'local',
            //typeAhead: true,
            //triggerAction: 'all',
            //store: dsPayactman,
            //lazyRender: true,
            //listClass: 'x-combo-list-small',
		    anchor: '95%'
         }, 'paydate': {
			name: 'paydate',
			fieldLabel: '付款日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
            width: 125,
            readOnly: true,
			anchor:'95%'
         },'paytype': {
			name: 'paytype',
			fieldLabel: '付款类型',
	     	displayField: 'k',
			valueField: 'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: payTypeStore,
            lazyRender: true,
            listClass: 'x-combo-list-small',
            allowBlank: true,
            width: 125,
			anchor:'95%'
         },'payins': {
			name: 'payins',
			fieldLabel: '付款说明',
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'98%'
         },'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			hidden: true,
			hideLabel: true,
			//allowBlank: false,
			anchor:'40%'
         },'filelsh': {
			name: 'filelsh',
			fieldLabel: '付款附件编号',
			hidden: true,
			hideLabel: true,
			//allowBlank: false,
			anchor:'40%'
         }, 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			hidden:true,
			hideLabel:true,
		    anchor:'40%'
         }, 'appmoney': {
         	id : 'appmoney',
			name: 'appmoney',
			fieldLabel: '申请付款',
			anchor:'95%'
         },'demoney': {
			name: 'demoney',
			fieldLabel: '应扣款',
			anchor:'95%'
         },  'passmoney': {
			name: 'passmoney',
			fieldLabel: '批准付款',
			anchor:'95%'
         },'paymoney': {
			name: 'paymoney',
			fieldLabel: '实际付款',
			anchor:'95%'
         },'invoiceno': {
			name: 'invoiceno',
			fieldLabel: '收据金额',
			anchor:'95%'
         },'invoicemoney': {
			name: 'invoicemoney',
			fieldLabel: '发票金额',
			anchor:'95%'
         },'cashuse': {
			name: 'cashuse',
			fieldLabel: '费用归属',
	     	displayField: 'v',
			valueField: 'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: cashuse_list_Store,
            emptyText:'请选择...',
            lazyRender: true,
            listClass: 'x-combo-list-small',
            width: 125, hideLabel: true, hidden: true,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '付款备注',
			allowBlank: true,
			anchor:'95%'
         }, 'planmoney': {
			name: 'planmoney',
			fieldLabel: '计划付款',
			allowBlank: false,
			anchor:'95%'
         },'payway': {
			name: 'payway',
			fieldLabel: '付款方式',
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsPayway,
            lazyRender: true,
            listClass: 'x-combo-list-small',
			anchor: '95%'
         },'paymentno':{
            name : 'paymentno',
            fieldLabel : '付款凭证号',
            anchor : '95%'
         },'invoicerecord': {
            name : 'invoicerecord',
            fieldLabel : '发票入账凭证号',
            anchor : '95%'
         },'applydept':{
            name : 'applydept',
            fieldLabel :'申请付款部门',
            anchor : '95%'
         },'applyuser':{
            name : 'applyuser',
            fieldLabel : '申请人',
            anchor : '95%'
         },'applydate':{
            name : 'applydate',
            fieldLabel : '申请付款日期',
            format : 'Y-m-d',
            width :125,
            readOnly: true,
            anchor : '95%'
         },'approveuser':{
            name : 'approveuser',
            fieldLabel : '批准人',
            anchor : '95%'
         },'approvedate':{
            name : 'approvedate',
            fieldLabel :'批准付款日期',
            format : 'Y-m-d',
            readOnly:true,
            anchor:'95%'
         },'actualuser':{
            name : 'actualuser',
         	fieldLabel : '实际支付人',
         	anchor :'95%'
		},
		'invoiceDate' : {
			name : 'invoiceDate',
			fieldLabel : '发票日期',
			hidden: true,
			hideLabel: true
		}
    };
    
	// 3. 定义记录集
	var Columns = [
    	{name: 'payid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'payno', type: 'string'},
		{name: 'actman', type: 'string'},
		{name: 'paydate',type: 'date', formatDate: 'Y-m-d'},
		{name: 'paytype', type: 'string'},		
		{name: 'payins', type: 'string'},
		{name: 'billstate', type: 'float'},	
		{name: 'filelsh', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'appmoney', type: 'float'},
		{name: 'demoney', type: 'float'},
		{name: 'passmoney', type: 'float'},
		{name: 'paymoney', type: 'float'},
		{name: 'invoiceno', type: 'string'},
		{name: 'invoicemoney', type: 'float'},
		{name: 'planmoney', type: 'float'},
		{name: 'cashuse', type: 'string'},
		{name: 'remark', type: 'string'},
		{name : 'payway', type : 'string'},
		{name : 'paymentno',type : 'string'},
		{name : 'invoicerecord',type : 'string'},
		{name : 'applydept',type :'string'},
		{name : 'applyuser',type : 'string'},
		{name : 'applydate',type : 'date',formatDate: 'Y-m-d'},
		{name : 'approveuser',type : 'string'},
		{name : 'approvedate',type : 'date',formatDate: 'Y-m-d'},
		{name : 'actualuser',type : 'string'},
		{name : 'invoiceDate',type : 'date',formatDate: 'Y-m-d'}
	];
	/**
	 * @function	重新加载viewport
	 * @author		xiaos
	 */
	function reLoadViewport(){
	    viewport.insert(0, formPanel);
	    viewport.render();
	    viewport.show();
    }
	// 6. 创建表单form-panel
	
	var accinfoField = new Ext.form.FieldSet({
		title: '合同帐目信息',
      	border: true,
      	//layout: 'form',
      	layout: 'table',
      	layoutConfig: {columns: 3},
      	defaults: {bodyStyle:'padding:1px 1px'}
		
	})
	
	var realname = new fm.TextField({fieldLabel: '经办人', readOnly:true, anchor:'95%', value: REALNAME});
	
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        autoScroll: true,
        bodyStyle: 'padding:10px 10px;',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	tbar: [
    		new Ext.Button({
				text: '<font color=#15428b><b>&nbsp;合同付款信息维护</b></font>',
				iconCls: 'title'
			}),'->',
			BUTTON_CONFIG['ADJUNCT'],'-',
			BUTTON_CONFIG['VIEW'],'-',
		//	BUTTON_CONFIG['ADD'],'-',
			BUTTON_CONFIG['GETAPPLYMONEY'],'-',
			BUTTON_CONFIG['BACK']
		],
		autoHeight: true,
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                autoHeight: true,
                items:[{
	   					layout: 'form', columnWidth: .33,
	   					bodyStyle: 'border: 0px;',
	   					autoHeight: true,
	   					items:[
	   						new fm.TextField(fc['payno']),
	   						new fm.NumberField(fc['appmoney']),
//	   						new fm.DateField(fc['applydate']),
//	   						new fm.TextField(fc['applydept']),
//	   						new fm.TextField(fc['applyuser']),
	   						new fm.TextField(fc['invoiceno']),
	   						new Ext.form.TriggerField({
	   							id :'demoney',
	   						    name : 'demoney',
	   						    fieldLabel : '应扣款',
	   						    triggerClass: 'x-form-date-trigger',
	   						    readOnly: true,
	   						    selectOnFocus: true,
	   						    onTriggerClick: demoneyShow,
	   						    anchor : '95%'
	   						})
	   						
	   					]
    				},{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.ComboBox(fc['paytype']),
    						new fm.NumberField(fc['passmoney']),
//    						new fm.TextField(fc['approveuser']),
//    						new fm.DateField(fc['approvedate']),
    						new fm.NumberField(fc['invoicemoney']),
    						new fm.TextField(fc['remark']),
    						new fm.TextField(fc['actman']),
    						new fm.TextField(fc['conid'])
    						
    					]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    					    new fm.TextField(fc['paymentno']),
    					    new fm.NumberField(fc['paymoney']),
    					    new fm.DateField(fc['paydate']),
//    					    new fm.TextField(fc['actualuser']),
    					    new fm.ComboBox(fc['payway']),
    					    new fm.TextField(fc['invoicerecord']),
    						new fm.TextField(fc['payid']),
    						new fm.TextField(fc['pid']),
    						new fm.DateField(fc['invoiceDate'])
    					]
    				},{
    					layout: 'form', columnWidth: 1.0,
    					bodyStyle: 'border: 0px;',
    					items: [
    						//fc['payins']
    						new fm.TextArea(fc['payins'])
    					]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items: [new fm.TextField(fc['filelsh'])]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items: [new fm.TextField(fc['billstate'])]
    				}
    			]
    		})
    	],
        buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']],
        bbar: ['->',
			'<font color=green>处理中付款累计：</font>',{xtype: 'textfield', id: 'processTotal', readOnly: true, cls: 'shawsar'},'-',
	    	'<font color=red>已处理付款累计：</font>',{xtype: 'textfield', id: 'finishTotal', readOnly: true, cls: 'shawsar'}
		]
    });
    /**
     * 扣款记录列表
     */
    
    var conPayFc = {
        'uids': {
             name : 'uids',
             fieldLabel : '主键',
             anchor :'95%',
             readOnly: true,
             hidden : true,
             hideLabel:true
        },'conid':{
             name : 'conid',
             fieldLabel : '合同主键',
             anchor : '95%',
             readOnly : true,
             hidden : true,
             hideLabel : true
        },'payid':{
             name : 'payid',
             fieldLabel : '付款主键',
             anchor : '95%',
             readOnly : true,
             hidden : true,
             hideLabel : true
        },'chargename':{
			name: 'chargename',
			fieldLabel: '扣款项目名称',
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            allowBlank : false,
            store: deMonStore,
            lazyRender: true,
            listClass: 'x-combo-list-small',
			anchor: '95%',
			listeners : {
			    'expand': function (){
			    	var records=conPayGrid.getStore().getRange();
			    	deMonStore.filterBy(deMonFilter);
			    	function deMonFilter(rec,id){
			    	    for(var i=0;i<records.length;i++){
			    	        if(rec.get("k")==records[i].get("chargename"))
			    	        return false;
			    	    }
			    	    return true;
			    	}
			    }
			}
        },'chargemoney':{
             name : 'chargemoney',
             fieldLabel : '扣款金额',
             anchor :'95%',
             allowDecimals : true,
             decimalPrecision : 2
        },'pid':{
             name : 'pid',
             fieldLabel : '项目单位ID',
             anchor : '95%',
             readOnly : true,
             hidden : true,
             hideLabel : true
        }
    }
    var conpayColumns =[
        {name : 'uids',type : 'string'},
        {name : 'conid',type : 'string'},
        {name : 'conpaytype',type : 'string'},
        {name : 'chargename',type : 'string'},
        {name : 'chargemoney' ,type : 'float'},
        {name : 'chargeremark', type : 'string'},
        {name : 'pid',type : 'string'}
    ]
    var conpanyPlant = new Ext.data.Record.create(conpayColumns);
    conpanyPlantInt = {
        uids: '',
        conid:g_conid,
        payid:'',
        conpaytype : '',
        chargename : '',
        chargemoney:0,
        chargeremark : '',
        pid : pid
    }
    var filter="conid='"+g_conid+"' and pid='"+pid+"' ";
    if(g_payid==""){
        filter+=" and payid is null";
    }else {
        filter+=" and payid='"+g_payid+"'";
    }
    
    var conpayStore = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pmis.contract.hbm.ConPayCharge',
            business :'baseMgm',
            method :'findwhereorderby',
            params : filter
        },
        proxy : new Ext.data.HttpProxy({
            url : MAIN_SERVLET,
            method : 'GET'
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount'
        },conpayColumns)
    })
    
    /**
     * 计算合同扣款总金额
     */
    var conPayTotalDs = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pmis.contract.hbm.ConPayCharge',
            business :'baseMgm',
            method :'findwhereorderby',
            params : filter
        },
        proxy : new Ext.data.HttpProxy({
            url : MAIN_SERVLET,
            method : 'GET'
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount'
        },conpayColumns)        
    })
    var conPaySm = new Ext.grid.CheckboxSelectionModel();
    var conPayCm = new Ext.grid.ColumnModel([
        //conPaySm,
        {
            id : conPayFc['uids'].name,
            header : conPayFc['uids'].fieldLabel,
            dataIndex : conPayFc['uids'].name,
            width : 200,
            hidden : true
        },{
            id : conPayFc['conid'].name,
            header : conPayFc['conid'].fieldLabel,
            dataIndex : conPayFc['conid'].name,
            width : 200,
            hidden : true
        },{
            id : conPayFc['chargename'].name,
            header : conPayFc['chargename'].fieldLabel,
            dataIndex: conPayFc['chargename'].name,
            align : 'center',
            renderer : function (v){
				if (v) {
					for (var i = 0; i < demonArr.length; i++) {
						if (demonArr[i][0] == v) {
							return demonArr[i][1];
						}
					}
				}
            },
            width : 250,
            editor : new Ext.form.ComboBox(conPayFc['chargename'])
        },{
            id : conPayFc['chargemoney'].name,
            header : conPayFc['chargemoney'].fieldLabel,
            dataIndex : conPayFc['chargemoney'].name,
            width : 80,
            editor : new Ext.form.NumberField(conPayFc['chargemoney'])
        },{
            id : conPayFc['pid'].name,
            header : conPayFc['pid'].fieldLabel,
            dataIndex : conPayFc['pid'].name,
            width :200,
            hidden : true
        }
    ])
    var conPayGrid = new Ext.grid.EditorGridTbarPanel({
        height : 300,
        width : 400,
        store : conpayStore,
        sm :conPaySm,
        cm :conPayCm,
        tbar: [{
            text : '关闭',
            iconCls :'option',
            handler : function(){
            	conPayChargeWin.hide();
            }
        },'-'],
        border: false,
        clicksToEdit:1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: conpayStore,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant :conpanyPlant,
        plantInt :conpanyPlantInt,
        servletUrl: MAIN_SERVLET,	
        bean : 'com.sgepit.pmis.contract.hbm.ConPayCharge',
        business : 'baseMgm',
        primaryKey: 'uids',
        insertHandler :insertConPayHandler,
        saveHandler : saveConPayHandler,
        deleteHandler :deleteConPayHandler,
        listeners : {
            aftersave : function (grid,idsOfInsert,idsOfUpdate,primaryKey,bean){
                conpayMgm.addDataChangeToSave(idsOfInsert,idsOfUpdate,bean,function (rtn){
                })
            },
            afterdelete: function (grid,ids,primaryKey,bean){
              	conpayMgm.addDataChangeToDel(ids,bean,function (rtn){
              })
            
            }
        }
    })
    conpayStore.load({params:{start : 0,limit : PAGE_SIZE}});
    conPayTotalDs.load();
    function insertConPayHandler (){
        if(g_FlowStatus=='shenqing'){
    	 conpanyPlantInt.paytype='1';
    	}else if(g_FlowStatus='pizhun'){
    	 conpanyPlantInt.paytype='2';
    	}else if(g_FlowStatus='zhifu'){
    	 conpanyPlantInt.paytype='3';
    	}else {
    	    conpanyPlantInt.paytype='4';
    	}
    	if(g_payid!==''){
    	  conpanyPlantInt.payid=g_payid;
    	}
        conPayGrid.defaultInsertHandler();            
    }
    
    function saveConPayHandler(){
        conPayGrid.defaultSaveHandler();
    }
    function deleteConPayHandler(){
    	conPayGrid.defaultDeleteHandler();
    }

    //弹出扣款记录窗口
    function demoneyShow(){
       if(!conPayChargeWin){
           conPayChargeWin = new Ext.Window({
                title : '扣款记录列表',
                width : 420,
                height : 340,
                modal : true,
                closeAction : 'hide',
                maximizable : true,
                minimizable : true,
                resizable : true,
                autoScroll : true,
                plain : true,
                items : [conPayGrid],
                listeners : {
                    'hide': function (win){
                    	conPayTotalDs.reload({callback:function(){
	                    	Ext.getCmp('demoney').setValue(conPayTotalDs.sum('chargemoney').toFixed(2));
	                        win.close();
                    	}});
                    }
                }
           })
       }
       conpayStore.load({params:{start : 0,limit : PAGE_SIZE}});
       conPayTotalDs.load();
       conPayChargeWin.show();
       
    } 
    
    var cmTotal = new Ext.grid.ColumnModel([
	        {header:'累计名称', dataIndex:'name'},
	        {header:'累计金额', dataIndex:'money', maxValue: 100000000, align: 'right', renderer: cnMoneyToPrec}
	]);

    var dsTotal = new Ext.data.Store({
        proxy: new Ext.data.MemoryProxy(countInfoList),
        reader: new Ext.data.ArrayReader({}, [
            {name: 'name'},
            {name: 'money'}
        ])
    });
	//dsTotal.load();
    var gridTotal = new Ext.grid.GridPanel({
        ds: dsTotal,
        cm: cmTotal,
        title: '累计',
        header: true,
        iconCls: 'icon-show-all',
        split: true,
        autoScroll:true,
        minSize: 175,
        maxSize: 445,
        border: false,
        region: 'center',
        forceFit: true,
        loadMask: true,
        width: 180
    });
    
    // 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
        	formPanel, {
        		region: 'south', height: 130, layout: 'border', 
        		border: false, split: true, 
        		items: [
        			gridTotal, {
        				xtype: 'form', region: 'east', width: 260, 
        				border: false, split: true, frame: true,
        				bodyStyle: 'padding: 5px 5px;',
        				items: [
        					{xtype: 'textfield', id: 'appmoneyTotal', fieldLabel: '申请付款累计', readOnly: true, cls: 'shawsar'},
        					{xtype: 'textfield', id: 'passmoneyTotal', fieldLabel: '批准付款累计', readOnly: true, cls: 'shawsar'},
        					{xtype: 'textfield', id: 'paymoneyTotal', fieldLabel: '实际付款累计', readOnly: true, cls: 'shawsar'},
        					{xtype: 'textfield', id: 'invoicemoneyTotal', fieldLabel: '发票金额累计', readOnly: true, cls: 'shawsar'}
        				]
        			}
        		]
        	}
        ],
        listeners: {
        	afterlayout: loadPayTotal
        }
    });
    
    // 隐藏累计扣款项
    gridTotal.hide();
//    realname.getEl().up('.x-form-item').setDisplayed(true); 
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (isFlwTask == true || isFlwView == true){	//任务调用模块
    	DWREngine.setAsync(false);
    	baseDao.findByWhere2(bean, "payno='"+g_payno+"'", function(list){
    		if (list.length > 0){
    			//list[0].billstate = '1';
    			loadFormRecord = new formRecord(list[0]);
				loadCountPay(list[0]);
				baseDao.findByWhere5("com.sgepit.frame.sysman.hbm.RockUser", "userid='"+list[0].actman+"'",null,null,null, function(list){
					if(typeof(list[0])!='undefined')
					realname.setValue(list[0].realname);
				});
    		} else {
    			loadFormRecord = new formRecord({
		    		payid: '',
		    		pid: pid,
		    		payno: g_payno,
		    		actman: REALNAME,
		    		paydate: new Date(),
		    		paytype: '',
		    		payins: '',	
		    		billstate: '1',
		    		filelsh: '',
		    		conid: CONOVE.conid,
		    		appmoney: 0,
		    		demoney: 0,
		    		passmoney: 0,
		    		paymoney: 0,
		    		invoiceno:'',
		    		invoicemoney:0,
		    		cashuse:'',
		    		remark: '',
		    		payway : '',
		    		paymentno : '',
		    		invoicerecord :''
				});
    		}
    	});
    	DWREngine.setAsync(true);
    } else {
		if (g_payid == null || g_payid == ''){
	    		loadFormRecord = new formRecord({
		    		payid: '',
		    		pid: pid,
		    		payno: getpaybh,
		    		actman: REALNAME,
		    		paydate: new Date(),
		    		paytype: '',
		    		payins: '',	
		    		billstate: '0',
		    		filelsh: '',
		    		conid: g_conid,
		    		appmoney: 0,
		    		passmoney: 0,
		    		paymoney: 0,
		    		invoiceno:'',
		    		invoicemoney:0,
		    		cashuse:'',
		    		remark: '',
		    		payway : '',
		    		paymentno : '',
		    		invoicerecord : ''
			});
		}else{
			DWREngine.setAsync(false);
			baseMgm.findById(bean, g_payid, function(obj){
				loadFormRecord = new formRecord(obj)
				loadCountPay(obj);
				baseDao.findByWhere5("com.sgepit.frame.sysman.hbm.RockUser", "userid='"+obj.actman+"'",null,null,null, function(list){
				    if(typeof(list[0])!='undefined')
					 realname.setValue(list[0].realname);
				});
			});
			DWREngine.setAsync(true);
		}
    }

    // 12. 加载数据、控制
	formPanel.getForm().loadRecord(loadFormRecord);
	loadFields();
	if (isFlwTask == true) SET_FIELD_EDITABLE_FOR_FLOW();
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
  
    function getParamsFromList(){
    	var rtn = window.showModalDialog(BASE_PATH + 'Business/contract/cont.payInfo.addorupdate.selecplan.jsp' ,null,"dialogWidth:900px;dialogHeight:500px;center:yes;resizable:yes;")
	    if(rtn){
	    	Ext.getCmp('planmoneyList').getEl().up('.x-form-item').child('.x-form-item-label').update("计划付款:("+rtn.split("||")[1]+")"); 
		    Ext.getCmp('planmoneyList').setValue(rtn.split("||")[0]);
	    }   	
    }
    
    
    /**
     * @function	加载数据库合同帐目信息表中数据
     * @author		xiaos
     */
    function loadFields(){
		if (conAccInfoList.length > 0){
			for (var i = 0; i < conAccInfoList.length; i++){
				var name = conAccInfoList[i][0];
				var value = conAccInfoList[i][1];
				var id = conAccInfoList[i][2];
				var numField = new Ext.form.NumberField({
					accid: id,
					name: name,
					fieldLabel: name,
					value: value,
					allowNegative: false,
	           		maxValue: 100000000,
					anchor: '95%'
				});
				objFields.push(numField);
			}
			for (var i = 0; i < objFields.length; i++){
				accinfoField.add(new Ext.Panel({
					layout: 'form',
					border: false,
					width: 255,
					items:[objFields[i]]
				}));
			}
			formPanel.add(accinfoField);
			reLoadViewport();
		}
	}
    
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
    	var appm=0;dem=0;planm=0;
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			//paymoney planmoney
	    		if(n=="appmoney"){appm=field.getValue();continue}
	    		if(n=="planmoney"){planm=field.getValue();continue}
	    		if(n=="demoney"){dem=field.getValue();continue}
	    		//if(n=="paymoney" && field.disabled){obj[n]=appm-dem;continue}
    			obj[n] = field.getValue();
    		}
    	}
    	if(appm-dem>planm && planm!=0){
    		Ext.MessageBox.confirm("提示","实际付款大于计划付款，继续保存?",
		     function(btn){
		           if(btn == "yes"){
		           	doFormSave1(dataArr)
		           }
		           else{
		           }
		  });
		/*
    	}else if(planm==""||planm==null){
    		Ext.MessageBox.confirm("提示","未填写计划付款，继续保存?",
		     function(btn){
		           if(btn == "yes"){
		           	doFormSave1(dataArr)
		           }
		           else{
		           }
		  });
    	*/	
    	}else{doFormSave1(dataArr)}
    }
    function doFormSave1(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	var appm=0;dem=0;planm=0;
    	
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
	    		if(n=="appmoney"){appm=field.getValue();continue}
	    		if(n=="planmoney"){planm=field.getValue();continue}
	    		if(n=="demoney"){dem=field.getValue();continue}
	    		//在实际付款框不可编辑的情况下自动计算
	    		if(n=="paymoney" && field.disabled){ obj[n]=appm-dem;continue}
	    		
    			obj[n] = field.getValue();
    		}
    	}
    	obj['appmoney']=appm;
    	obj['paytype'] = form.findField('paytype').getRawValue();
    	
    	//修改时：合同累计已付款金额需去掉本次合同实际付款金额
    	var conPayAll = conObj.conpay;
    	if(payObj && payObj.paymoney) {
    		conPayAll = conObj.conpay-payObj.paymoney;
    	}
    	var totalconapp=conPayAll+obj.appmoney;
    	totalconapp=totalconapp.toFixed(3);
    	if(totalconapp>conObj.convaluemoney){
    	    Ext.Msg.alert('提示信息','合同申请金额与累计已付款之和不能超出合同总金额');
    	    return ;
    	}
    	var totalconpass=conPayAll+obj.passmoney;
    	totalconpass=totalconpass.toFixed(3);
    	if(totalconpass>conObj.convaluemoney){
    	    Ext.Msg.alert('提示信息','合同批准付款金额与累计已付款之和不能超出合同总金额');
    	    return ;
    	}
    	var totalconpay=conPayAll+obj.paymoney;
    	totalconpay=totalconpay.toFixed(3);
    	if(totalconpay>conObj.convaluemoney){
    	    Ext.Msg.alert('提示信息','合同实际付款金额与累计已付款之和不能超出合同总金额')
    	    return ;
    	}
    	var state='';
    	state=conObj.billstate;
    	if(state!='1'&&state!='2'){
         Ext.Msg.alert('提示信息','已签订或已执行中的合同才能进行付款操作');
         return;
    	}
    	/**
    	 * 验证是否走流程
    	 * 
    	 */
    	DWREngine.setAsync(false);
		var rtnState='';
		systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
		    rtnState=rtn;
		})
    	if (obj.payid == '' || obj.payid == null){
    		if(isFlwTask != true && isFlwView != true){
	    		if(rtnState=='BusinessProcess'){
	    		    obj.billstate=0;
	    		}else if(rtnState=='ChangeStateAuto'){
	    		    obj.billstate=1
	    		}
	    		else if(rtnState=='None'){
	    		    obj.billstate=1
	    		}
    		} else {
    			obj.billstate=-1;
    		}
    		
	   		conpayMgm.insertConpay(obj, function(state){
	   			if ("" == state){
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
						   msg: '您成功新增了一条合同付款信息！　　　<br>可以发送流程到下一步操作！',
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
   			doSelFormSave();
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
   			//在实际付款禁用的情况下自动计算
   			if ( form.findField('paymoney').disabled ){
   				calculatePayM(obj);
   				//减去应扣款
   				obj['paymoney'] = obj['passmoney'] - obj['demoney'];
   			}
   			
   			
   			conpayMgm.updateConpay(obj, function(state){
	   			if ("" == state){
	   				if (isFlwTask != true) {
	   					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   					history.back();
	   				} else { 
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同付款信息！　　　<br>可以发送流程到下一步操作！',
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
    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate.jsp?conid="+g_conid+"&modid="+MODID;
    		//国锦项目单独付款新增页面
    		if(CURRENTAPPID=='1030603') {
	    		var url = BASE_PATH+"Business/contract/cont.payInfo.addorupdate_guoj.jsp?conid="+g_conid+"&modid="+MODID;
    		}
			window.location.href = url;
    	}else{
    		history.back();
    	}
    }
    
    /**
     * @function	保存合同帐目信息
     * @depiction	在合同付款信息修改时使用
     * @author		xiaos
     */
    function doSelFormSave(){
    	if (objFields.length > 0){
	    	var ConAccinfo = function(){
	    		this.accid = '',
	    		this.pid = pid,
	    		this.expression = '',
	    		this.expvalue = '',
	    		this.conid = g_conid,
	    		this.seq = '',
	    		this.payid = g_payid
	    	};
	    	var objs = new Array();
	    	for (var i = 0; i < objFields.length; i++){
	    		var conAccinfo = new ConAccinfo();
	    		if (objFields[i].accid) conAccinfo.accid = objFields[i].accid;		//判断新增、修改
	    		conAccinfo.expression = objFields[i].name;
	    		conAccinfo.expvalue = objFields[i].getValue();
	    		objs.push(conAccinfo);
	    	}
	    	//DWREngine.setAsync(false);
	    	conAccinfoMgm.addOrUpdate(objs);
	    	//DWREngine.setAsync(true);
    	}
    }
    
    // 计算实际付款金额 = 批准付款金额 - 各个扣款项
    function calculatePayM(obj){
		var total = 0, pm = obj.passmoney;
		for (var i = 0; i < objFields.length; i++){
    		total += objFields[i].getValue();
    	}
    	obj.paymoney = pm - total;
    };
    
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
   	function loadCountPay(con_pay){
   		conexpMgm.getCountInfo('合同付款',con_pay.conid, con_pay.payid, function(list){
	    	for (i = 0; i < list.length; i++){
	    		var temp = new Array();
	    		temp.push(list[i][0]);
	    		temp.push(list[i][1]);
	    		countInfoList.push(temp);
	    	}
	    	dsTotal.load({params:{
			    	start: 0,
			    	limit: PAGE_SIZE
		   		}
		   	});
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
	   		adjunctWin.show();
	   		adjunctWin.load({
				url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
				params: 'type=adjunct&conno='+g_conno
			});
   		} else {
   			_CONID = g_conid;
   			var conove_="";
   			DWREngine.setAsync(false);
   			baseDao.findByWhere2(beanConOve, "conid='"+g_conid+"'", function(list){
			  conove_ = list[0];
		    });
		    DWREngine.setAsync(true);
	   		adjunctWin.show();
	   		adjunctWin.load({
				url: BASE_PATH+'Business/contract/viewDispatcher.jsp',
				params: 'type=adjunct&conno='+conove_.conno
			});
   		}
   	}
   	
   	function loadPayTotal(){
   		var _conid = (isFlwTask == true||isFlwView == true) ? CONOVE.conid : g_conid;
		var _value_process = 0, _value_finish = 0;
		var _total_appmoney = 0, _total_passmoney = 0, _total_paymoney = 0 ,_total_invoicemoney =0;
		baseDao.findByWhere5(bean, "conid='"+_conid+"'",null,null,null, function(list){
			if (list){
				for (var i=0; i<list.length; i++){
					if (1== list[i].billstate){
						_value_finish += list[i].paymoney;
					} else if (1!= list[i].billstate || 0!= list[i].billstate){
						_value_process += list[i].appmoney;
					}
					_total_appmoney += list[i].appmoney;
					_total_passmoney += list[i].passmoney;
					_total_paymoney += list[i].paymoney;
					_total_invoicemoney += list[i].invoicemoney;
				}
			}
			Ext.getCmp('finishTotal').setValue(isGj ? cnMoneyToPrec(_value_finish, 2) : cnMoneyToPrec(_value_finish));
			Ext.getCmp('processTotal').setValue(isGj ? cnMoneyToPrec(_value_process, 2) : cnMoneyToPrec(_value_process));
			Ext.getCmp('appmoneyTotal').setValue(isGj ? cnMoneyToPrec(_total_appmoney, 2) : cnMoneyToPrec(_total_appmoney));
			Ext.getCmp('passmoneyTotal').setValue(isGj ? cnMoneyToPrec(_total_passmoney, 2) : cnMoneyToPrec(_total_passmoney));
			Ext.getCmp('paymoneyTotal').setValue(isGj ? cnMoneyToPrec(_total_paymoney, 2) : cnMoneyToPrec(_total_paymoney));
			Ext.getCmp('invoicemoneyTotal').setValue(isGj ? cnMoneyToPrec(_total_invoicemoney, 2) : cnMoneyToPrec(_total_invoicemoney));
		});
	}
   	
   	/**
   	 * 流程调用模块时候，对模板上的栏位进行的限制
   	 */
   	function SET_FIELD_EDITABLE_FOR_FLOW(){
//   		g_faceid = '402881e51c65b4b0011c65d24a350002';
   		if (g_faceid){
   			baseDao.findByWhere2(faceColBean, "faceid='"+g_faceid+"'", function(list){
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
   	function getApplyMoney(){
   		var res ;
   		DWREngine.setAsync(false);
   	    conpayMgm.getApplyMoneyFromBdgProject(g_conid,pid,function (rtn){
   	        res =rtn;
   	    });
   	    DWREngine.setAsync(true);
   	    Ext.getCmp('appmoney').setValue(res);
   	}
});


