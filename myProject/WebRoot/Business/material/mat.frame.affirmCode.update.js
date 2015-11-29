var bean = "com.sgepit.pmis.material.hbm.MatCodeApply"
var appStates = [[1,'未申请'],[2,'申请中'],[3,'批准'],[4,'未批准']];
var newWindow;
 
Ext.onReady(function (){
	 
	var dsAppStates = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: appStates
    });

	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		    history.back();
		}
	});
    
    var fm = Ext.form;			// 包名简写（缩写）
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true
		},'applyNo' : {
			name : 'applyNo',
			fieldLabel : '申请编号',
			anchor : '95%'
		},'catname' : {
			name : 'catname',
			fieldLabel : '品名',
			anchor : '95%'
		},'enName' : {
			name : 'enName',
			fieldLabel : '英文名',
			anchor : '95%'
		},'spec' : {
			name : 'spec',
			fieldLabel : '规格型号',
			anchor : '95%'
		},'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},'price' : {
			name : 'price',
			fieldLabel : '单价',
			anchor : '95%'
		},'appDept' : {
			name : 'appDept',
			fieldLabel : '申请部门',
			anchor : '95%'
		},'appMan' : {  
			name : 'appMan',
			fieldLabel : '申请人',
			anchor : '95%'
		},'appDate' : { 
			name : 'appDate',
			fieldLabel : '申请日期',  
			format: 'Y-m-d',
			anchor : '95%'
		},'acceptMan' : {  
			name : 'acceptMan',
			fieldLabel : '接受人',  
			anchor : '95%'
		},'approveOpin' : {  
			name : 'approveOpin',
			fieldLabel : '处理意见',
			xtype: 'textarea',
			hideLabel:true,
//			heigth: 30,
			anchor : '95%'
		},'approveExplain' : {  
			name : 'approveExplain',
			fieldLabel : '处理说明',  
			xtype: 'textarea',
			hideLabel:true,
//			heigth: 30,
			anchor : '95%'
		},'remark' : {  
			name : 'remark',
			fieldLabel : '备注', 
			xtype: 'textarea',
			hideLabel:true,
//			heigth: 30,
			anchor : '95%'
		},'appState' : {
			name : 'appState',
			fieldLabel : '申请状态',
			triggerClass : 'x-form-date-trigger',
			selectOnFocus: true,
			valueField:'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsAppStates,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor : '95%'
		},'frameId' : {  
			name : 'frameId',
			fieldLabel : '所在分类',  
			readOnly: true,			
//			listeners: {
//				'triggerClick':function(){alert(22)}
//			},
			anchor : '95%' 
		},'catNo' : {  
			name : 'catNo',
			fieldLabel : '物资编码',  
			readOnly: true,
			anchor : '95%'
		},'warehouse' : {  
			name : 'warehouse',
			fieldLabel : '仓库名',  
			anchor : '95%'
		},'wareNo' : {  
			name : 'wareNo',
			fieldLabel : '货位号',  
			anchor : '95%'
		}
	}

    var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'applyNo', type: 'string'},    		
		{name: 'catname', type: 'string'},
		{name: 'enName', type: 'string'},    	
		{name: 'spec', type: 'string' },
		{name: 'unit', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'appDept', type: 'string'},
		{name: 'appMan', type: 'string'},
		{name: 'appDate',  type: 'date', dateFormat: 'Y-m-d H:i:s'},  
		{name: 'acceptMan', type: 'string'},
		
		{name: 'approveOpin', type: 'string'},
		{name: 'approveExplain', type: 'string'},
		{name: 'appState', type: 'string'},  
		{name: 'remark', type: 'string'},
		
		{name: 'frameId', type: 'string'},
		{name: 'catNo', type: 'string'},
		{name: 'warehouse', type: 'string'},
		{name: 'wareNo', type: 'string'}
		];
		
//	var matSort =  new Ext.form.TriggerField(fc['frameId']);
//	matSort.onTriggerClick = function (){
//		newWin()
//	}	
		
    var formRecord = Ext.data.Record.create(Columns);
    var appNo = USERNAME + new Date().format('ynjhi');
    var loadFormRecord = null;
    if (appId == null ||appId == 'null' ||appId == ''){
    	loadFormRecord = new formRecord({
	        uuid : null,
			applyNo : appNo,
			linkNo: '',
			catname : '',
			enName:'',
			spec : '',
			unit: '',
			price : null,
			appDept:'',
			appMan:USERNAME,
			appDate: '',
			appState:'',
			acceptMan: '',
			approveOpin: '',
			approveExplain:'',
			remark: '',
			
			frameId:'',
			catNo:'',
			warehouse:'',
			wareNo:''
	    });
    }else{
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, appId, function(obj){
	    	loadFormRecord = new formRecord({
	    		uuid : obj.uuid,
				applyNo : obj.applyNo,
				catNo: obj.catNo,
				catname : obj.catname,
				ca : obj.catname,
				enName: obj.enName,
				spec : obj.spec,
				unit: obj.unit,
				price: obj.price,
				appDept: obj.appDept,
				appMan : obj.appMan,
				appDate: obj.appDate,
				appState: obj.appState,
				acceptMan: obj.acceptMan,
				approveOpin: obj.approveOpin,
				approveExplain: obj.approveExplain,
				remark: obj.remark, 
				frameId: obj.frameId,
				catNo:obj.catNo,
				warehouse:obj.warehouse,
				wareNo:obj.wareNo
	    	});
	    });
	    DWREngine.setAsync(true);
    } 

    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id:'form-panel',
        border: false,
    	iconCls: 'icon-detail-form',	//面板样式
//        height: 250,
        minSize: 100,
//        autoWidth : true,
        region: 'center',
    	autoScroll: true, 
    	labelAlign: 'left',
    	bodyStyle:'padding:8px 8px 0',
    	items: [
    			new Ext.form.FieldSet({
    			title: '物资编码申请',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .4,
	   					bodyStyle: 'border: 0px;',
	   					items:[
		   						new fm.TextField(fc['applyNo']),
		   						new fm.TextField(fc['catname']),
		                		new fm.TextField(fc['unit']),
		                		new fm.TextField(fc['appDept']),
		                		new fm.TextField(fc['acceptMan']),
		                		new fm.DateField(fc['appDate']),
		                		new fm.TextField(fc['warehouse']),
		                		new fm.TextField(fc['frameId'])
//								matSort
	   						   ]
    				},{
    					layout: 'form', columnWidth: .4,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.TextField(fc['enName']),
    							new fm.TextField(fc['spec']),
    							new fm.NumberField(fc['price']),
    							new fm.TextField(fc['appMan']),
    							new fm.TextField(fc['appState']),
    							new fm.TextField(fc['catNo']),
    							new fm.TextField(fc['wareNo']),
    							new fm.TextField(fc['uuid'])
    						   ]
    				}   				
    			]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
            	border:true, 
            	title:'处理意见',
            	cls:'x-plain',  
            	items: [ fc['approveOpin'] ]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
            	border:true, 
            	title:'处理说明',
            	cls:'x-plain',  
            	items: [ fc['approveExplain'] ]
    		}),
    		new Ext.form.FieldSet({
    			layout: 'form',
            	border:true, 
            	title:'备注',
            	cls:'x-plain',  
            	items: [ fc['remark'] ]
    		})],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: formCancel
        }]
    });

     var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        header : false,
        layout:'border',
        region:'center',
        tbar : ['<font color=#15428b><b>&nbsp;物资编码申请编辑</b></font>','->',btnReturn],
        layoutConfig: {
        	height:'100%'
        },
        items:[formPanel]
    });
    
//    var comboxPanel = new Ext.Panel({
//        id:'content-2',
//        border: false,
//        header : false,
//        layout:'border',
//        items:[treePanelNew]
//    });
    
	// 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [contentPanel]
    });
   
    formPanel.getForm().loadRecord(loadFormRecord);

 
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
    	if (obj.uuid == '' || obj.uuid == null){
    	
	   		maAppMgm.updateMcapp(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				
	   				Ext.Msg.show({                   // 继续新增
					   title: '提示',
					   msg: '是否继续新增?　　　',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			maAppMgm.updateMcapp(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				history.back();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"jsp/contract/cont.compensate.input.addorupdate.jsp?conid=" 
    			+ g_conid +"&claid=" + g_claid + "&conname=" + conname + "&conno="+conno;
			window.location.href = url;
    	}else{
    		history.back();
    	}
    }
    
    function formCancel(){
    	history.back();
    }
 
  	function kindRender(value){
   		var str = '';
   		for(var i=0; i<kinds.length; i++) {
   			if (kinds[i][0] == value) {
   				str = kinds[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
   	
   	
   	function newWin(){
		if(!newWindow){
	         newWindow = new Ext.Window({	               
	             title: '物资分类',
	             layout: 'fit',
	             width: 800,
	             height: 400,
	             modal: true,
	             closeAction: 'hide',
	             constrain:true,
	             maximizable: true,
	             plain: true  ,              
	             items: [comboxPanel]
             });
    	}
    	 treePanel.render(); // 显示树
		 treePanel.expand();
		 root.expand();
    	newWindow.show();
   	}	

});




