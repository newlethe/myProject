var mainbean = "com.sgepit.pmis.equipment.hbm.EquRec";
var bodyPanelTitle = " 设备领用单信息维护";

Ext.onReady(function (){
    var fm = Ext.form;
	var fc = {
		'recid': {
			name: 'recid',
			fieldLabel: '领用主键',
			readOnly: true,
			hidden: true,
			//allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			readOnly: true,
			value:conid,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		},'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly: true,
			value:CURRENTAPPID,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'recdate': {
			name: 'recdate',
			fieldLabel: '领用日期',
			width:45,
            format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
           // allowBlank: false,
			anchor:'95%'
		}, 'recunit': {
			name: 'recunit',
			fieldLabel: '领用单位',
			anchor:'95%'
		}, 'recman': {
			name: 'recman',
			fieldLabel: '领用人',
			value:USERNAME,
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			height: 120,
			width: 730,
			xtype: 'htmleditor',
			anchor:'95%'
		},'recno': {
			name: 'recno',
			fieldLabel: '领用单编号',
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
		{name: 'recid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'recunit', type: 'string'},
		{name: 'recman', type: 'recman'},
		{name: 'recno', type: 'recman'},
		{name: 'recdate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'remark', type: 'string'},
		{name: 'pleRecdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (recid!=""){
    	loadFormRecord = new formRecord({								//设置初始值 
	    	recid:recid,
	    	conid: conid,
	    	pid: CURRENTAPPID,
	    	recunit:'',
	    	recman: USERNAME,
	    	recno: '',
	    	recdate: '',
	    	remark: '',
	    	pleRecdate: ''
    });	
    }  
    if(recid!=""){
		DWREngine.setAsync(false);
	    baseMgm.findById(mainbean, recid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
    }

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
    			title: '领用单基本信息',
                border: true,
                layout: 'column',
                items:[{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
		                		 new fm.TextField(fc['recno']),
		                		 new fm.DateField(fc['recdate']),
		                		 new fm.DateField(fc['pleRecdate'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
		                		 new fm.TextField(fc['recman']),
		                		 new fm.TextField(fc['recunit'])
    					      ]
    				  },{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   							 new fm.TextField(fc['recid']),
		                		 new fm.TextField(fc['conid']),
		                		 new fm.TextField(fc['pid'])
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
            	history.back();
            }
        }]
        
    });

    var contentPanel = new Ext.Panel({
        border: false,
        header : false,
        region:'center',
        tbar: [
    			new Ext.Button({
					text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
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
    if(recid!=""){
	    formPanel.getForm().loadRecord(loadFormRecord);
    }
	
    function formSave(){
    	var form = formPanel.getForm()
    		if(form.isValid()){
		    	var obj = form.getValues()
		    	for(var i=0; i<Columns.length; i++) {
		    		var n = Columns[i].name;
		    		var field = form.findField(n);
		    		if (field) {
		    			obj[n] = field.getValue();
		    		}
		    	}
    		}
    	if(recid==""||recid=="null"){//插入
		    	DWREngine.setAsync(false);
				equRecMgm.insertequRec(obj, function(){
					Ext.example.msg('保存成功！', '您成功添加了一条信息！');
		   		});
		   		DWREngine.setAsync(true);
	   		   	Ext.Msg.show({                   // 继续新增
				title: '提示',
				msg: '是否继续新增?　　　',
				buttons: Ext.Msg.YESNO,
				fn: function(value){
					if ("yes" == value){
						window.location.href=window.location.href
			    	}else{
			    		parent.window.location.reload();
		   				parent.recWindow.hide();
			    	}
				},
				icon: Ext.MessageBox.QUESTION
				});
    		}
    	else{//修改
    		DWREngine.setAsync(false);
				equRecMgm.saveOrUpdate(obj, function(){
					Ext.example.msg('保存成功！', '您成功修改了一条信息！');
		   		});
		   	DWREngine.setAsync(true);
		   	parent.window.location.reload();
	    	parent.recWindow.hide();
    	}
    }
});