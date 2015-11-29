var bean = "com.sgepit.pmis.equipment.hbm.EquRecSub";
var bodyPanelTitle = " 设备领用信息维护";
var jzhType = [[5,'#1、#2机组'],[1,'#1机组'],[2,'#2机组']];

Ext.onReady(function (){

    var dsMachine = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: jzhType
	});   
	
    var fm = Ext.form;
    
	var fc = {
		'recsubid': {
			name: 'recsubid',
			fieldLabel: '领用从表主键',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'recid': {
			name: 'recid',
			fieldLabel: '领用主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'conid': {
			name: 'recid',
			fieldLabel: '合同主键',
			readOnly: true,
			value:conid,
			//hidden: true,
			allowBlank: false,
			//hideLabel: true,
			anchor: '95%'
		},'equid': {
			name: 'equid',
			fieldLabel: '设备主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'partid': {
			name: 'partid',
			fieldLabel: '部件主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'pleRecnum': {
			name: 'pleRecnum',
			fieldLabel: '请领数量',
			allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
		}, 'recnum': {
			name: 'recnum',
			fieldLabel: '领用数量',
			allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'95%'
		}, 'machineNo': {
			name: 'machineNo',
			fieldLabel: '机组号',
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsMachine,
            lazyRender: true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
         }, 'recdate': {
			name: 'recdate',
			fieldLabel: '领用日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 120,
			width: 730,
			xtype: 'htmleditor',
			anchor:'95%'
		}, 'pleRecdate': {
			name: 'pleRecdate',
			fieldLabel: '请领日期',
			width:45,
            format: 'Y-m-d',
			anchor:'95%'
		}
	};
    
    // 3. 定义记录集
	var Columns = [
		{name: 'recsubid', type: 'string'},
		{name: 'recid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'equid', type: 'string'},
		{name: 'partid', type: 'string'},
		{name: 'pleRecnum', type: 'float'},
		{name: 'recnum', type: 'float'},
		{name: 'machineNo', type: 'string'},
		{name: 'recdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'remark', type: 'string'},
		{name: 'pleRecdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
	DWREngine.setAsync(false);
    baseMgm.findById(bean, recsubid, function(obj){
    	loadFormRecord = new formRecord(obj);
    });
    DWREngine.setAsync(true);

    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    			new Ext.form.FieldSet({
    			title: '领用基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		   						 new fm.NumberField(fc['pleRecnum']),
		                		 new fm.DateField(fc['recdate']),
		                		 
		                		 new fm.TextField(fc['conid']),
		                		 new fm.TextField(fc['equid'])
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.NumberField(fc['recnum']),
    							new fm.DateField(fc['pleRecdate']),
    							
				            	new fm.TextField(fc['recsubid']),
				            	new fm.TextField(fc['partid'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
	    						new fm.ComboBox(fc['machineNo']),
	    						
				            	new fm.TextField(fc['recid'])
    					      ]
    				  }    				
    			]
    		}),
   			new Ext.form.FieldSet({
    			layout: 'form',
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [
   					//new fm.TextArea(fc['context']),
   					fc['remark']
                   	
				]
    		})
    	],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	parent.selectWindow.hide();
            }
        }]
        
    });

    var contentPanel = new Ext.Panel({
        border: false,
        header : false,
        region:'center',
        tbar: [
    			new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font> - <font color=green>库存数量：'+storenum+'</font>',
					iconCls: 'title'
				}),'->', 
				new Ext.Button({
					text: '返回',
					iconCls: 'returnTo',
					handler: function(){
						history.back();
					}
				})],
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[formPanel]
    });
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
    
    //数据加载
    formPanel.getForm().loadRecord(loadFormRecord);
	
    function formSave(){
    	var form = formPanel.getForm();
    	var pleRecnum = form.findField('pleRecnum');
    	var recnum = form.findField('recnum');
    	if (pleRecnum.getValue() > storenum) {
    		Ext.example.msg('错误', '[请领数量] > [库存数量]'); pleRecnum.getEl().dom.select(); return;
    	} else if (recnum.getValue() > storenum) {
    		Ext.example.msg('错误', '[领用数量] > [库存数量]'); recnum.getEl().dom.select(); return;
    	}
    	if (form.isValid()){
    		doFormSave();//修改
	    }else{//插入
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
			equRecMgm.insertequRec(obj, function(){
				Ext.example.msg('保存成功！', '您成功添加了一条信息！');
				parent.selectWindow.hide();
	   		});
	   		DWREngine.setAsync(true);
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
		equRecMgm.updateRecSub(obj, function(){
			Ext.example.msg('保存成功！', '您成功修改了一条信息！');
			parent.selectWindow.hide();
   		});
   		DWREngine.setAsync(true);
    }
    
});




