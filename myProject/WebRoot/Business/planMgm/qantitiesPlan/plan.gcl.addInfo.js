var bean = "com.sgepit.pmis.planMgm.hbm.PlanMaster";
var billStateArr = new Array();
//页面布局描述
/*
   新增工程量投资计划【form形式展现】
*/

Ext.onReady(function(){
	DWREngine.setAsync(false);  
	conStore = new Ext.data.SimpleStore({
		id: 0,
		fields : ['conid','conname','conno']
	})
	db2Json.selectSimpleData("select conid,conname ,conno from con_ove t where t.partybno = (select cpid from con_partyb where partyb = '"+USERPOSNAME+"')",
		function(dat){
			conStore.loadData(eval(dat))
	});
    conCombo = new Ext.form.ComboBox({
    	name: "conid",
		fieldLabel: '合同名称',
		valueField: 'conid',
		displayField: 'conname', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: conStore,
        lazyRender: true,
        forceSelection: true,
        allowBlank: false,
        width : 300,
        listClass: 'x-combo-list-small',
		anchor:'95%'
    })
    
	//设置流程状态
	appMgm.getCodeValue('流程状态',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			billStateArr.push(temp);			
		}
    }); 
    var billStateStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: billStateArr
    });
    billStateCombo = new Ext.form.ComboBox({
    	name: "billState",
		fieldLabel: '流程审批状态',
		disabled: true, 
		valueField: 'k',
		displayField: 'v', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: billStateStore,
        lazyRender: true,
        allowBlank:true,
        listClass: 'x-combo-list-small',
		anchor:'95%'
    }) 
    var userStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
    userCombo = new Ext.form.ComboBox({
    	name : "operator",
    	fieldLabel: '填报人',
    	width:100,
    	maxHeight:300,
    	store: userStore,
    	displayField:'txt',
		valueField:'val',
		disabled : true,
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
	db2Json.selectSimpleData("select userid,realname from rock_user where userid = '"+USERID+"'",
		function(dat){
			userStore.loadData(eval(dat))
	});
    var unitStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
    var unitCombo = new Ext.form.ComboBox({
    	fieldLabel: '填报单位',
    	width:100,
    	maxHeight:300,
    	store: unitStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		selectOnFocus:true
    });
	db2Json.selectSimpleData("select unitid,unitname from sgcc_ini_unit where unitid = '"+unitId+"'",
		function(dat){
			unitStore.loadData(eval(dat))
	});
	
	var sjTypeStore = new Ext.data.SimpleStore({
    	id: 0,
        fields: ['val', 'txt']
    });
	
    sjTypeCombo = new Ext.form.ComboBox({
    	fieldLabel: '数据期别',
    	width:100,
    	maxHeight:300,
    	store: sjTypeStore,
    	displayField:'txt',
		valueField:'val',
		typeAhead: id,
		triggerAction: 'all',
		mode: 'local',
		editable :false,
		allowBlank: false,
		selectOnFocus:true
    });
    DWREngine.setAsync(true); 
    sjTypeCombo.on("beforequery",function(obj){
    	if(conCombo.getValue()==""){
    		Ext.Msg.alert('提示', '请先选择合同！');
    		return false;
    	}
    	DWREngine.setAsync(false); 
    	investmentPlanService.getSjTypeForPlan(businessType,unitId,conid,
			function(dat){			
				if(editMode =="insert"){
					sjTypeStore.loadData(eval(dat))
				}
		});
		DWREngine.setAsync(true); 
    	return true;
    })
    if(editMode =="update"){
    	sjTypeCombo.setValue(sjType);
    	//sjTypeCombo.setRawValue(sjType);
    }
    
	
   	
	

	var fc = {
		'pid':   {name: 'pid',fieldLabel: '工程项目编号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		,'conid':   {name: 'conid',fieldLabel: '合同内部流水号',ancher: '95%',readOnly: true,hidden: true,hideLabel: true}
		, 'conno': {name: 'conno',fieldLabel: '合同编号',disabled: true,anchor: '95%'}
		, 'conname': {name: 'conname',fieldLabel: '合同名称',disabled: true,anchor: '95%'}
		, 'uids': {	name: 'uids',fieldLabel: '主键',anchor:'95%',hidden: true,hideLabel: true}
		, 'sjType': {name: 'sjType',fieldLabel: '数据期别',anchor:'95%'}
		, 'unitId': {name: 'unitId',fieldLabel: '单位ID',allowNegative: false,hidden: true,hideLabel: true,anchor:'95%'}
		, 'unitName': {name: 'unitName',fieldLabel: '填报单位',allowNegative: false, anchor:'95%',disabled: true}
		, 'businessType': {name: 'businessType',fieldLabel: '业务类型',anchor:'95%',hidden: true,hideLabel: true}
		, 'billState': {name: 'billState',fieldLabel: '流程审批状态',anchor:'95%'}
		, 'state': {name: 'state',fieldLabel: '报送状态',anchor:'95%',hidden: true,hideLabel: true}
		, 'operator': {name: 'operator',fieldLabel: '填报人',anchor:'95%'}
		, 'operateTime': {name: 'operateTime',fieldLabel: '填报时间',format: 'Y-m-d H:i:s',anchor:'95%',readOnly: true}
		, 'operateTimeStr': {name: 'operateTimeStr',fieldLabel: '填报时间',anchor:'95%'}		
		, 'flowbh': {name: 'flowbh',fieldLabel: '流程编号',anchor:'95%',hidden: true,hideLabel: true}
		, 'remark': {name: 'remark',fieldLabel: '备注',hideLabel: true,anchor:'95%'}
		,'fileLsh':{name:'fileLsh',fieldLabel:'概要文件流水号',anchor:'95%',hidden: true,hideLabel: true}
		,'fileName':{name:'fileName',fieldLabel:'概要文件',anchor:'95%',hidden: true,hideLabel: true}
	};
    
    // 3. 定义记录集
	var Columns = [
		{name: 'pid', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'uids', type: 'string'},
		{name: 'sjType', type: 'string'},
		{name: 'unitId', type: 'string'},
		{name: 'unitName', type: 'string'},
		{name: 'businessType', type: 'string'},
		{name: 'billState', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'operator', type: 'string'},
		{name: 'operateTime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'operateTimeStr', type: 'string'},
		{name: 'flowbh', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'fileLsh', type: 'string'},
		{name: 'fileName', type: 'string'}
	];	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (uids == null || uids == 'null' || uids == '' || flowbh==''){
    	loadFormRecord = new formRecord({
			pid : CURRENTAPPID,
			conid: conid,
			conno: conno,
			conname : conname,
			uids: '',
			sjType: '',
			unitId: unitId,
			unitName : unitName,
			businessType: businessType,
			billState: '0',
			state: '0',
			operator: USERID,
			operateTime: SYS_TIME_STR,
			flowbh: flowbh,
			remark: '',
			fileLsh: '',
			fileName : ''
			
	    });
    } else {
    	DWREngine.setAsync(false);
    	if(flowbh==""){      //非流程
    		baseMgm.findById(bean, uids, function(obj){
		    	loadFormRecord = new formRecord(obj);
		    	sjTypeCombo.setValue(obj.sjType)
		    });
    	}else{ //流程中查看或流程中任务节点
    		investmentPlanService.findPlanMasterByFlowbh(flowbh, function(obj){
		    	loadFormRecord = new formRecord(obj);
		    	sjTypeCombo.setValue(obj.sjType)
		    });
    	}
	    DWREngine.setAsync(true);
	}
	
	
    // 6. 创建表单form-panel
    var fm = Ext.form;
    var conNoField = new fm.TextField(fc['conno']);
    conCombo.on("select",function(obj,rec,inx){
    	conid = obj.getValue();
    	conno = conStore.getById(obj.getValue()).get('conno')
    	conname = conStore.getById(obj.getValue()).get('conname')
   		conNoField.setValue(conno)
    })
    /* 附件以多附件的形式进行上传
    var fileNameField = new fm.TextField(fc['fileName']); 	
	fileField = new Ext.ux.form.FileUploadField({
			id: 'attach_file',
     		emptyText: '选择上传的文件',
     		fieldLabel: fc['fileName'].fieldLabel,
     		name: 'file',
     		buttonText: '上传',
     		anchor: '95%'
	});
	
	fileField.on('fileselected', function(){
		var filePath = this.getValue();
		if(filePath && filePath.length>0){
			var fileName = filePath.substring(filePath.lastIndexOf("\\")+1,filePath.lastIndexOf("."));
		}
		fileNameField.setValue(fileName);
	});*/
    infoForm = new Ext.FormPanel({
        id: 'masterform',
		title: '工程量投资计划基本信息',
    	labelWidth: 100,
        frame:true,
        region: 'center',
        bodyBorder: true,
        border: true,
        bodyStyle:'padding:5px 5px 5px 5px',
        width: 680,
        height: 500,
		method : 'POST',
		//iconCls: 'icon-detail-form',	//面板样式
		url :  '',
    	items: [
    			new Ext.form.FieldSet({
	    			title: '基本信息',
	                border: true,
	                layout: 'column',
	                items:[{
		   					layout: 'form', columnWidth: .50,
		   					bodyStyle: 'border: 0px;',
		   					items:[
			   						 conCombo,
			   						 sjTypeCombo,			   						
			                		 userCombo,
			                		 billStateCombo		                		
		   						   ]
		    				},{
		    					layout: 'form', columnWidth: .50,
		    					bodyStyle: 'border: 0px;',
		    					items:[
		    							conNoField,
		    							new fm.TextField(fc['unitName']),
		    							new fm.DateField(fc['operateTime'])				            	
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
	   					new fm.TextArea(fc['remark'])
					]
	    		}),
	    	    new fm.TextField(fc['pid']),
         		new fm.TextField(fc['conid']),
         		new fm.TextField(fc['businessType']),
         		new fm.TextField(fc['state']),
         		new fm.NumberField(fc['uids']),
	           	new fm.NumberField(fc['unitId']),
	           	new fm.TextField(fc['fileLsh']),
	           	new fm.TextField(fc['flowbh'])
    	],
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: !editEnable,
            handler: formSave
        },{
			id: 'cancel',
            text: '关闭',
            handler: function(){
            	window.close();
            }
        }]
        
    });
    fileUploadUrl = CONTEXT_PATH+"/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable="+fileEditFlag+"&businessId="+uids;	
	filePanel = new Ext.Panel({
       border: true,
       region: "south",
       //height:'60%',
       height: 220,
       split: true,
       title:"附件",
       html: "<iframe name='fileFrame' src='"+fileUploadUrl+"' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
    var viewport = new Ext.Viewport({
		layout : 'border',
		items : [infoForm,filePanel]
	});
     //数据加载
     
    infoForm.getForm().loadRecord(loadFormRecord);
	
})
function formSave(){
	var form = infoForm.getForm();
	if(form.isValid()){
		var data = form.getValues()
		data.sjType = sjTypeCombo.getValue();
		data.operateTimeStr = data.operatorTime
		data.uids = uids
		data.operator = userCombo.getValue();
		data.billState = billStateCombo.getValue();
		data.conid = conCombo.getValue();
		var jsonData = Ext.encode(data);
		Ext.Ajax.request({
				waitMsg: '保存中......',
				method: 'POST',
				url : CONTEXT_PATH + '/servlet/InvestmentPlanServlet',
				params : {
							ac : "savePlanMaster"
						},
				xmlData : jsonData,
				
				success:function(form,action){
			        var obj = Ext.util.JSON.decode(form.responseText);
			        if(obj.success==true)
			        { 
			           
			            if(editMode == "insert"){
			            	editMode = "update";		            	
							uids = obj.msg
							investmentPlanService.initQuantitiesPlanData(uids,function(dat){
								if(dat){
									Ext.Msg.alert('提示',"保存成功!");
									window.close();
								}else{
									Ext.Msg.alert('提示',"工程量投资计划明细初始化失败!");
								}
							})
							fileUploadUrl = CONTEXT_PATH+"/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="+businessType+"&editable=true&businessId="+uids;
							window.frames["fileFrame"].location.href = fileUploadUrl
						}else{
							Ext.Msg.alert('提示',"保存成功!");
							window.close();
						}		
			        }
			        else
			        {
			            Ext.Msg.alert('提示',obj.msg);
			        } 
				},
			    failure:function(form,action){
			        Ext.Msg.alert('警告','系统错误');
			    }
			    
			});
	} else {
		Ext.Msg.alert('提示','必填项数据为空，或数据填写不符合规则！');
	}
}