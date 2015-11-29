var bean = "com.sgepit.pmis.contract.hbm.ConBal";
var primaryKey = 'balid';
var pid = CURRENTAPPID;
var accInfoWindow;
var conExpList = new Array();
var objFields = new Array();
var conAccInfoList = new Array();
var conObj = new Object();

Ext.onReady(function (){
	DWREngine.setAsync(false);
	var beanName = "com.sgepit.pmis.contract.hbm.ConOveView";
    baseMgm.findById(beanName, g_conid, function(obj){
    	conObj = obj;
    });
	conAccinfoMgm.getConAccinfoBeans(g_balid, function(list){
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
		},'ADD': {
	    	text: '选择帐目信息',
	    	tooltip: '选择帐目信息',
	    	iconCls: 'add',
	    	disabled: true,
	    	handler: newWin
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
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    } else if (isFlwView == true){
    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['BACK'].disabled = false;
    	BUTTON_CONFIG['ADD'].disabled = false;
    	BUTTON_CONFIG['SAVE'].disabled = false;
    	BUTTON_CONFIG['RESET'].disabled = false;
    }
    
    // 2. 创建列模型  招标方式
    var fm = Ext.form;			// 包名简写（缩写）
    var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '合同号',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'			
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			allowBlank: false,
			anchor:'95%'
         }, 'balid': {
			name: 'balid',
			fieldLabel: '结算编号',
			hidden: true,
			hideLabel: true,
			readOnly: true,
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号', 
			readOnly : true,         
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称', 
			readOnly : true,         
			anchor:'95%'
         }, 'baldate': {
			name: 'baldate',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
			fieldLabel: '结算日期<font color=\'red\'>*</font>',
			width: 125,
			allowBlank: false,
			anchor:'95%'
         }, 'convalue': {
			name: 'convalue',
			fieldLabel: '合同金额',  
			allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'balappmoney': {
			name: 'balappmoney',
			fieldLabel: '结算审定金额<font color=\'red\'>*</font>',  
			allowNegative: false,   
			allowBlank: false, 
			anchor:'95%'
         }, 'actpaymoney': {
			name: 'actpaymoney',
			fieldLabel: '实际支付金额',  
			//allowNegative: false,   
			readOnly : true,     
			anchor:'95%'
         }, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',  
			allowNegative: false,
			readOnly : true,
			hidden: true,
			hideLabel: true,
			anchor:'95%'
         }, 'actman': {
			name: 'actman',
			fieldLabel: '经办人',
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         }, 'totalmoney': {
			name: 'totalmoney',
			fieldLabel: '累计实际付款',  
			//allowNegative: false,
			value: g_totalMoney,
			readOnly : true,     
			anchor:'95%'
         }
    }
    
    var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'balid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'convalue', type: 'float'},
		{name: 'balappmoney', type: 'float'},
		{name: 'actpaymoney', type: 'float'},
		{name: 'baldate', type: 'date', dateFormat:'Y-m-d H:i:s'},    	
		{name: 'billstate', type: 'float'},
		{name: 'actman', type: 'string'},
		{name: 'remark', type: 'string'}
	];
	
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (g_balid == null || g_balid == ''){
    	loadFormRecord = new formRecord({
	    		balid: '',
	    		pid: pid,
	    		conno: conObj.conno,
	    		conname: conObj.conname,
	    		convalue: conObj.convaluemoney,
	    		balappmoney: 0,
	    		actpaymoney: 0,	
	    		baldate: '',
	    		conid: g_conid,
	    		billstate: '',
	    		actman: '',
	    		remark: ''	
	    });
	}else{
		DWREngine.setAsync(false);
	    baseMgm.findById(bean, g_balid, function(obj){
	    	obj.conno = conObj.conno;
	    	obj.conname = conObj.conname;
	    	obj.convalue = conObj.convaluemoney;
	    	loadFormRecord = new formRecord(obj)
	    });
	    DWREngine.setAsync(true);
	}
	
	var smAccInfo = new Ext.grid.CheckboxSelectionModel();
	
	var cmAccInfo = new Ext.grid.ColumnModel([
		smAccInfo,
		{header: '主键', dataIndex: 'kidid', hidden: true},
		{header: '帐目名称', dataIndex: 'expression'}
	]);
	
	
	/**
	 * @function	重新加载viewport
	 * @author		xiaos
	 */
	function reLoadViewport(){
	    viewport.insert(0, formPanel);
	    viewport.render();
	    viewport.show();
    }
	
	var confirm = new Ext.Button({
		text: '确定选择',
		iconCls: 'save',
		handler: addFields
	});
	
	/**
	 * @function	添加fields
	 * @author		xiaos
	 */
	function addFields(){
		var nums = smAccInfo.getCount();
		if (0 != nums){
			var records = smAccInfo.getSelections();
			for (var i = 0; i < nums; i++){
				var value = records[i].get('expression');
				if (checkAddFields(value)) continue;
				var numField = new Ext.form.NumberField({
					name: value,
					fieldLabel: value,
					allowNegative: false,
            		maxValue: 100000000,
					anchor: '95%'
				});
				objFields.push(numField);
				formPanel.add(numField);
				numField.on('change', function(){
					setActpaymoney(balappmoney, actpaymoney, totalmoney);
				});
			}
			checkDelFields();
			reLoadViewport();
			accInfoWindow.hide();
		}
	}
	
	/**
	 * @function	检索添加的fields
	 * @params		value:该field的name
	 * @return		true:已添加过, false:新添加
	 * @author		xiaos
	 */
	function checkAddFields(value){
		var flag = false;
		for (var j = 0; j < objFields.length; j++){
			if (objFields[j].name == value){
				flag = true;
				break;
			}
		}
		return flag;
	}
	
	/**
	 * @function	检索勾选被取掉的fields
	 * @author		xiaos
	 */
	function checkDelFields(){
		var delIds = new Array();
		for (var j = 0; j < objFields.length; j++){
			if (findObjFields(objFields[j].name) == false){
				if (objFields[j].accid) delIds.push(objFields[j].accid);
				objFields[j].setDisabled(true);
				objFields[j].setValue('该栏位已被删除...');
				objFields.splice(j,1);
				setActpaymoney(balappmoney, actpaymoney, totalmoney);
			}
		}
		if (delIds.length > 0) conAccinfoMgm.deleteAccinfoBeans(delIds);
	}
	
	/**
	 * @function	检索objFields
	 * @params		value:该objfield的name
	 * @return		true:勾选, false:未勾选
	 * @author		xiaos
	 */
	function findObjFields(value){
		var nums = smAccInfo.getCount();
		var records = smAccInfo.getSelections();
		for (var i = 0; i < nums; i++){
			if (records[i].get('expression') == value){
				return true;
			}else{
				continue;
			}
		}
		return false;
	}
	
	var gridAccInfo = new Ext.grid.GridPanel({
        //ds: dsAccInfo,
        cm: cmAccInfo,
        sm: smAccInfo,
        iconCls: 'icon-show-all',
        border: false,
        viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
        bbar: ['->',confirm]
    });
	
	/**
	 * @function	设置勾选项
	 * @author		xiaos
	 */
	function setSelected(){
		var arrIndex = new Array();
		for (var i = 0; i < objFields.length; i++){
			for (var j = 0; j < dsAccInfo.getCount(); j++){
				var record = dsAccInfo.getAt(j);
				if (record.get('expression') == objFields[i].name){
					arrIndex.push(j);
				}
			}
		}
		if (arrIndex.length > 0) smAccInfo.selectRows(arrIndex);
	}
	
	function newWin(){
		if(!accInfoWindow){
	         accInfoWindow = new Ext.Window({	               
	             title: '选择帐目信息',
	             iconCls: 'form',
	             layout: 'fit',
	             width: 150,
	             height: 270,
	             modal: true,
	             closeAction: 'hide',
	             plain: true,	                
	             items: gridAccInfo
	         });
	   }
	    accInfoWindow.show();
   	}

	var add = new Ext.Button({
    	text: '选择帐目信息',
    	iconCls: 'add',
    	handler: newWin
    });
    
	// 6. 创建表单form-panel
	var accinfoField = new Ext.form.FieldSet({
		title: '合同帐目信息',
      	border: false,
      	layout: 'table',
      	layoutConfig: {columns: 3},
      	defaults: {bodyStyle:'padding:1px 1px'}
		
	})    

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
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .33,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['conno']),
	   						new fm.NumberField(fc['balappmoney']),
	   						new fm.DateField(fc['baldate']),
	   						
	   						new fm.TextField(fc['conid'])
	   					]
    				},{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.TextField(fc['conname']),
    						new fm.NumberField(fc['totalmoney']),
    						new fm.TextField(fc['actman']),
    						
    						new fm.TextField(fc['pid'])
    					]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.NumberField(fc['convalue']),
    						new fm.NumberField(fc['actpaymoney']),
    						
    						new fm.TextField(fc['balid']),
    						new fm.TextField(fc['billstate'])
    					]
    				},{
    					layout: 'form', columnWidth: 1,
    					bodyStyle: 'border: 0px;',
    					items: [fc['remark']]
    				}
    			]
    		})
    	],
		buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    
    // 9. 创建viewport，加入面板action和content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout: 'border',
            items: [formPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [formPanel]
        });
    }
    // 11. 事件绑定

    
    // 12. 加载数据、控制
	formPanel.getForm().loadRecord(loadFormRecord);
	loadFields();
	//if (g_balid == null || g_balid == '') add.setDisabled(true);
	var balappmoney = formPanel.getForm().findField('balappmoney');
	var actpaymoney = formPanel.getForm().findField('actpaymoney');
	var totalmoney = formPanel.getForm().findField('totalmoney');
	balappmoney.on('change', function(){
		setActpaymoney(balappmoney, actpaymoney, totalmoney);
	});
	
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    
    /**
     * @function	自动计算出实际支付金额
     * @author		xiaos
     */
    function setActpaymoney(obj_balapp, obj_actpay, obj_total){
    	var value = 0;
		if (objFields.length > 0){
			var sum = 0;
			for (var i = 0; i < objFields.length; i++){
				sum += objFields[i].getValue();
			}
			value = obj_balapp.getValue() - obj_total.getValue() - sum;
		}else{
			value = obj_balapp.getValue() - obj_total.getValue();
		}
		obj_actpay.setValue(value);
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
				numField.on('change', function(){
					setActpaymoney(balappmoney, actpaymoney, totalmoney);
				});
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
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	
    	DWREngine.setAsync(false);
    	if (obj.balid == '' || obj.balid == null){
   			conbalMgm.insertConbal(obj, function(state){
	   			if ("" == state){
	   				if (isFlwTask != true){
		   				Ext.example.msg('保存成功！', '您成功新增了一条合同结算信息！');
		   				window.history.back();
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
   			doSelFormSave();
   			conbalMgm.updateConbal(obj, function(state){
	   			if ("" == state){
	   				if (isFlwTask != true) {
				        Ext.example.msg('保存成功！', '您成功修改该合同结算信息！');
		   				history.back();
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
    
    /**
     * @function	保存合同帐目信息
     * @depiction	在合同付款信息修改时使用
     * @author		xiaos
     */
    function doSelFormSave(){
    	if (objFields.length > 0){
	    	var ConAccinfo = function(){
	    		this.accid = '',
	    		this.pid = currentPid,
	    		this.expression = '',
	    		this.expvalue = '',
	    		this.conid = g_conid,
	    		this.seq = '',
	    		this.payid = g_balid
	    	};
	    	var objs = new Array();
	    	for (var i = 0; i < objFields.length; i++){
	    		var conAccinfo = new ConAccinfo();
	    		if (objFields[i].accid) conAccinfo.accid = objFields[i].accid;		//判断新增、修改
	    		conAccinfo.expression = objFields[i].name;
	    		conAccinfo.expvalue = objFields[i].getValue();
	    		objs.push(conAccinfo);
	    	}
	    	conAccinfoMgm.addOrUpdate(objs);
    	}
    }
});