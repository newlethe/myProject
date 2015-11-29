﻿﻿var bean = "com.sgepit.pmis.material.hbm.MatStoreIn"
var bodyPanelTitle = "物资入库登记"
var userType = [[USERID,USERNAME]];
var billState = new Array();
var htType = new Array();
var maxStockBh,incrementLsh;
var maxStockBhPrefix;

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function (){  
    var userstore = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data: userType
    })
    
    //在流程中，如果编号存在，则不经过添加，直接查询出来
    if(isFlwTask&&(uuid==null||uuid=="")){
    	DWREngine.setAsync(false);
    	baseMgm.getData("select in_no from mat_store_in where in_no='"+rkdbh+"' and "+pidWhereString+" ",function(obj){
    		if(obj.length>0){
    			var url = BASE_PATH+"/Business/material/mat.store.in.jsp?rkdbh="+rkdbh+"&rkdId=&isTask=true&isView=false";
				window.location.href = url;
    		}
    	})
    	DWREngine.setAsync(true);
    }
    
    if(isFlwView){
    	var url = BASE_PATH+"/Business/material/mat.store.in.jsp?rkdbh="+rkdbh+"&rkdId=&isTask=false&isView=true";
		window.location.href = url;
    }
    
    if(uuid==null||uuid==""){
		DWREngine.setAsync(false);	
		//新增编号获取
		maxStockBhPrefix = USERNAME + new Date().format('ym');
		stockMgm.getStockPlanNewBh(maxStockBhPrefix,"in_no","MAT_STORE_IN",null,function(dat){
			if(dat != "")	{
				maxStockBh = dat;
				incrementLsh = (maxStockBh.substr(maxStockBhPrefix.length,4)) *1
			}	
		})
		DWREngine.setAsync(true);
		rkdbh = maxStockBh;
    }
    
    
    DWREngine.setAsync(false);
    //02:物资部合同，CG物资部合同分类中的采购合同
    //2011-09-02 多项目中修改，此处采购合同隶属于材料合同，属性代码中“合同划分类型”的“详细设置”包含CL的合同分类下所有合同
    conoveMgm.getCgHt("CL","","1=1 and "+pidWhereString+" ",function(list){
    	for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].conid);		
				temp.push("【"+list[i].conno+"】"+list[i].conname);	
				htType.push(temp);	
			}
    })
    var htStore =  new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data: htType
    })
    
    //供货单位
    var deptType = new Array();
    DWREngine.setAsync(false);
    baseMgm.getData("select uids,csmc from WZ_CSB where ISUSED='1' and "+pidWhereString+" ",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i][0]);		
			temp.push(list[i][1]);	
			deptType.push(temp);	
		}
	})
    DWREngine.setAsync(true);
    var deptStore = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data: deptType
    })
    
    appMgm.getCodeValue('流程状态',function(list){         //流程审批状态
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].propertyCode);		
				temp.push(list[i].propertyName);	
				billState.push(temp);	
			}
	    });
	 var billStateStore = new Ext.data.SimpleStore({
    	fields:['k','v'],
    	data: billState
    })
    DWREngine.setAsync(true);
    var fm = Ext.form;
       
	var fc = { // 创建编辑域配置
		'uuid' : {
			name : 'uuid',
			fieldLabel : '主键',
			hideLabel : true,
			hidden:true
		},'pid' : {
			name : 'pid',
			fieldLabel : '项目ID',
			hidden : true,
			hideLabel : true,
			value : CURRENTAPPID,
			anchor : '95%'
		},'inNo' : {
			name : 'inNo',
			fieldLabel : '入库单编号',
			readOnly : true,
			anchor : '95%'
		},'dept' : {
			name : 'dept',
			fieldLabel : '部门名称',
			anchor : '95%'
		},'name' : {
			name : 'name',
			fieldLabel : '登记人员',
			anchor : '95%',
			displayField:'v',valueField:'k',
			mode:'local',typeAhead:true,triggerAction:'all',editable:false,
			store: userstore,
			disabled : true,
			lazyRender:true,listClass:'x-combo-list-small'
		},'inDate' : { 
			name : 'inDate',
			fieldLabel : '入库日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'conid' : { 
			name : 'conid',
			triggerClass : 'x-form-date-trigger',
			fieldLabel : '合同名称',
			readOnly:true,
			anchor : '95%'
		},'sum' : { 
			name : 'sum',
			fieldLabel : '总价',
			anchor : '95%'
		},'fareType' : { 
			name : 'fareType',
			fieldLabel : '费用类型',
			anchor : '95%'
		},'matType' : {
			name : 'matType',
			fieldLabel : '物品类别',
			anchor : '95%'
		},'arrivDate' : {
			name : 'arrivDate',
			fieldLabel : '到货日期',
			format: 'Y-m-d',
			anchor : '95%'
		},'userWay' : {
			name : 'userWay',
			fieldLabel : '用途',
			anchor : '95%'
		},'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			height: 100,
			width: 645,
			anchor : '95%'
		},'storetype':{
			name:'storetype',
			fieldLabel:'区分标志符',
			anchor:'95%',
			hidden :true,
			hideLabel : true
		},'billState':{
			name:'billState',
			fieldLabel:'审批状态',
			anchor:'95%',
			displayField:'v',valueField:'k',
			mode:'local',typeAhead:true,triggerAction:'all',editable:false,
			store: billStateStore,
			disabled : true,
			hideLabel : !hasFlow,
			hidden:!hasFlow,
			lazyRender:true,listClass:'x-combo-list-small'
		},'conid':{
			name:'conid',
			fieldLabel:'采购合同',
			anchor:'95%',
			displayField:'v',
			valueField:'k',
			mode:'local',
			typeAhead:true,
			triggerAction:'all',
			editable:false,
			store: htStore,
			lazyRender:true,
			listClass:'x-combo-list-small'
		},'offerDept' : {
			name : 'offerDept',
			fieldLabel : '供货单位',
			anchor : '95%',
			displayField:'v',
			valueField:'k',
			mode:'local',
			typeAhead:true,
			triggerAction:'all',
			editable:false,
			store: deptStore,
			lazyRender:true,
			listClass:'x-combo-list-small'
		}
	}
    
     var Columns = [
    	{name: 'uuid', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'inNo', type: 'string'},    		
		{name: 'dept', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'inDate',  type: 'date', dateFormat: 'Y-m-d'}, 
		{name: 'arrivDate',   type: 'date', dateFormat: 'Y-m-d'}, 
		{name: 'sum', type: 'float' },
		{name: 'fareType', type: 'string'},
		{name: 'offerDept', type: 'string'},
		{name: 'matType', type: 'string'},
		{name: 'userWay', type: 'string'},
		{name: 'remark', type: 'string'},
		{name:'storetype', type:'string'},
		{name:'billState', type:'string'},
		{name:'conid', type:'string'}
	];
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (uuid == null || uuid == 'null' || uuid == ''){
    	loadFormRecord = new formRecord({
			uuid: '',
			pid: CURRENTAPPID,
			inNo: rkdbh,
			dept: '',
			name: USERID,
			conid: '',
			inDate: new Date,
			arrivDate: new Date,
			sum: 0,
			fareType: '',
			offerDept: '',
			matType: '',
			userWay: '',
			remark:'',
			storetype : "storein",
			billState : 0
	    });
    } else {
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, uuid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	}
	
	//var remarkTextArea = 

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
    			title: '入库基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .5,
	   					bodyStyle: 'border: 0px;',
	   					items:[	   							
		   						new fm.TextField(fc['inNo']),
	   							new fm.TextField(fc['matType']),
		              	  		new fm.ComboBox(fc['name']),
		                		new fm.DateField(fc['arrivDate']),	                		
		                		new fm.DateField(fc['inDate']),    							
    							new fm.ComboBox(fc['billState'])
		                	]
    				},{
    					layout: 'form', columnWidth: .5,
    					bodyStyle: 'border: 0px;',
    					items:[
    							/*new Ext.form.TriggerField({
		                			name:'offerDept',
		                			id:'getCsFromList',
		                			fieldLabel:'供货厂商',
		                			triggerClass: 'x-form-date-trigger',
			    					readOnly: true, selectOnFocus: true,
			    					anchor:'95%',
			    					onTriggerClick:getParamsFromList
		                		}),*/
		                		new fm.ComboBox(fc['conid']),
		                		new fm.ComboBox(fc['offerDept']), 
    							new fm.TextField(fc['fareType']), 
    							new fm.TextField(fc['sum']),   							
    							new fm.TextField(fc['userWay']),
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
                	new fm.TextArea(fc['remark']),
                	new fm.TextField(fc['uuid']),
    				new fm.ComboBox(fc['storetype'])   
                   	
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
            	back(rkdbh,uuid,isFlwTask,isFlwView)
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
	if (uuid == null || uuid == 'null' || uuid == ''){
		if(isFlwTask || isFlwView){
			formPanel.getForm().findField("inNo").setDisabled(true)
		}else{
			formPanel.getForm().findField("inNo").setDisabled(false)
		}		
	}else{
		formPanel.getForm().findField("inNo").setDisabled(true)
	}
    function formSave(){
    	var form = formPanel.getForm()
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
    	if (obj.uuid == '' || obj.uuid == null){
	   		matStoreMgm.insertRkd(obj, function(dat){
   				if(dat){
   					Ext.example.msg('保存成功！', '您成功新增了一条信息！');
   					back(obj.inNo,obj.uuid,isFlwTask,isFlwView)
   				}	   				
	   		});
   		}else{
   			matStoreMgm.updateRkd(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				back(obj.inNo,obj.uuid,isFlwTask,isFlwView)
	   		});
   		}
   		DWREngine.setAsync(true);
    }
	
});


function back(rkdno,pk,task,view){
	if (task) {
		window.location.href = CONTEXT_PATH+"/Business/material/mat.store.in.jsp?rkdbh="
		    			+ rkdno + "&rkdId=" + pk + "&isTask="+task+ "&isView="+view;
	} else {
		history.back();
	}
}


