var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
var billStateArr = new Array();

Ext.onReady(function(){
	DWREngine.setAsync(false);  
	conStore = new Ext.data.SimpleStore({
		id: 0,
		fields : ['conid','conname','conno']
	})
	
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出工程合同，“详细设置”列包含GC
	var gcSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%GC%'";
	DWREngine.setAsync(false);
	baseMgm.getData(gcSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	
	
	var conSql = "select conid,conname ,conno,'2' as type from con_ove t where t.partybno = (select cpid from con_partyb where partyb = '"+USERPOSNAME+"') order by type";
	if(showAllCon){
		conSql = "select conid,conname ,conno,'2' as type from con_ove t where t.condivno in ("+contFilterId+") and pid='" + CURRENTAPPID + "' order by type";
	}
	db2Json.selectSimpleData(conSql,
		function(dat){
			if(dat && dat!=null && dat.length>0) {
				conStore.loadData(eval(dat))
			}
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
        forceSelection: true,
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
    	proAcmMgm.getSjTypeForComp(conid,
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
    }
	var fc = {		
    		'uids': {name: 'uids',fieldLabel: '主键',anchor:'95%',hidden:true,hideLabel:true}	
    		,'pid': {name: 'pid',fieldLabel: '工程项目ID',anchor:'95%',hidden:true,hideLabel:true}	
			,'monId': {name: 'monId',fieldLabel: '工程投资完成月份主键',anchor:'95%',hidden:true,hideLabel:true}
			, 'conid': {name: 'conid',fieldLabel: '合同主键',hidden:true,hideLabel:true,anchor:'95%'}
			, 'conno': {name: 'conno',fieldLabel: '合同编号',disabled: true,anchor: '95%'}
			, 'conname': {name: 'conname',fieldLabel: '合同名称',disabled: true,anchor: '95%'}
			, 'month': {name: 'month',fieldLabel: '数据期别',anchor:'95%'}
			, 'unitId': {name: 'unitId',fieldLabel: '填报单位ID', hidden:true,hideLabel:true, anchor:'95%'}
			, 'unitName': {name: 'unitName',fieldLabel: '填报单位名称',disabled: true,anchor:'95%'}
			, 'operator': {name: 'operator',fieldLabel: '填报人',anchor:'95%'}
			, 'decmoney': {name: 'decmoney',fieldLabel: '申报金额',disabled: true,allowNegative: false,anchor:'95%'}
			, 'checkmoney': {name: 'checkmoney',fieldLabel: '核定金额',disabled: true,allowNegative: false,anchor:'95%'}
			, 'ratiftmoney': {name: 'ratiftmoney',fieldLabel: '批准金额',disabled: true,allowNegative: false,anchor:'95%'}
			, 'billstate': {name: 'billstate',fieldLabel: '流程审批状态',anchor:'95%'}
		}
	
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'monId', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'conno', type: 'string'},
		{name: 'conname', type: 'string'},
		{name: 'month', type: 'string'},
		{name: 'unitId', type: 'string'},
		{name: 'unitName', type: 'string'},
		{name: 'operator', type: 'string'},
    	{name: 'decmoney', type: 'float'},
		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'billstate', type: 'string'}];
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    
    if(uids && uids!="") {
    	//业务功能模块；
    	loadFormRecord = new formRecord(editData);
    	sjTypeCombo.setValue(editData.month)
    } else {
    	loadFormRecord = new formRecord({
			pid : CURRENTAPPID,
			conid: conid,
			conno: conno,
			conname : conname,
			monId: monId,
			month: '',
			unitId: unitId,
			unitName : unitName,
			billState: '0',
			operator: USERID,
			decmoney: null,
			checkmoney: null,
			ratiftmoney: null			
	    });
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
    infoForm = new Ext.FormPanel({
        id: 'masterform',
		title: '投资完成',
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
		   					layout: 'form', columnWidth: .60,
		   					bodyStyle: 'border: 0px;',
		   					items:[
			   						 conCombo, //选择合同
			   						 conNoField,		                		
			                		 new fm.TextField(fc['unitName']),
			                		 userCombo,         //填报人     
			                		 billStateCombo		//流程状态    
		   						   ]
		    				},{
		    					layout: 'form', columnWidth: .40,
		    					bodyStyle: 'border: 0px;',
		    					items:[
		    							sjTypeCombo,		//选择数据期别	    							
		    							new fm.NumberField(fc['decmoney']),	
		    							new fm.NumberField(fc['checkmoney']),
		    							new fm.NumberField(fc['ratiftmoney'])
		    						   ]			
		    				}			
	    			]
    			}),
	    	    new fm.TextField(fc['pid']),
         		new fm.TextField(fc['conid']),
         		new fm.NumberField(fc['monId']),
	           	new fm.NumberField(fc['unitId'])
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
   
    var viewport = new Ext.Viewport({
		layout : 'border',
		items : [infoForm]
	});
     //数据加载
     
    infoForm.getForm().loadRecord(loadFormRecord);
	
})

function formSave(){
	var form = infoForm.getForm();
	if(form.isValid()){
		var data = form.getValues()
		data.month = sjTypeCombo.getValue();
		data.uids = uids;
		data.monId = monId;
		if(monId && monId!="" && data.uids!=""){
			data.uids = monId;
		}
		data.operator = userCombo.getValue();
		data.billstate = billStateCombo.getValue();
		data.conid = conCombo.getValue();
		var jsonData = Ext.encode(data);
		Ext.Ajax.request({
				waitMsg: '保存中......',
				method: 'POST',
				url : MAIN_SERVLET,
				params : {
							ac : "form-insert",
							id : uids,
							bean : bean
						},
				xmlData : jsonData,			
				success:function(form,action){
			        var obj = Ext.util.JSON.decode(form.responseText);
			        if(obj.success==true)
			        { 		           
			            if(editMode == "insert"){
			            	editMode = "update";		            	
							uids = obj.msg
							DWREngine.setAsync(false);  
					    	proAcmMgm.initialProAcmInfo(conid, uids, CURRENTAPPID, function(){
					    		Ext.Msg.alert('提示',"保存成功!");
					    		window.close();
					    	});
					    	DWREngine.setAsync(true);  	
						}else{
							Ext.Msg.alert('提示',"保存成功!");
							window.close();
						}		
			        }else
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