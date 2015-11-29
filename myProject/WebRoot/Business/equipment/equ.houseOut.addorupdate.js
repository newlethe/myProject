var bean = "com.sgepit.pmis.equipment.hbm.EquHouseout";
var bodyPanelTitle = "合同：" + conname + "，编号：" + conno + " - 设备出库信息维护";
var isApp = ''

 	var ywType = new Array();
 	var ckType = new Array();

Ext.onReady(function (){
    var fm = Ext.form;
    //======自动生成编号开始
    var initYear = new Date().getYear() + '-'
    //var init = 'GJMD-RKD-'+initYear
    var init = CURRENTAPPID+'-CKD-'+initYear
    var initBh = ''
    var partybName = '';
    var convalue = '';
    DWREngine.setAsync(false)
     baseMgm.getData("select b.partyb,a.convalue from con_ove a,con_partyb b where a.partybno=b.cpid and a.conno = '"+ conno +"'",function(_list){
			if(_list.length>0){
				partybName = _list[0].PARTYB;
				convalue=_list[0].CONVALUE;
			}
		})
    	equGetGoodsMgm.initHouseOutBh(init,function(str){
    		initBh = str
    	})
    	bdgMoneyMgm.isMonneyApp(conid,function(flag){
    		isApp = flag
    	})
    DWREngine.setAsync(true)
    //======自动生成编号结束
    
    if(outno!=null && outno!="" && outno!="null") initBh=outno
    
	//-----------------申请人（sqr: rock_user=realname)
    var userArray = new Array();
	var userArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user where userid = '"+USERID+"'",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
			userArray.push(temp);
		}
    });
 	DWREngine.setAsync(true);
  	var getuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:userArr
 	})    
    
    
    DWREngine.setAsync(false);
 	//业务类型
 	appMgm.getCodeValue('业务类型',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			ywType.push(temp);			
		}
    });
 	//入库类型
 	appMgm.getCodeValue('出库类别',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			ckType.push(temp);			
		}
    });
 	DWREngine.setAsync(true);
 	var ywTypeDs = new Ext.data.SimpleStore({
    	fields : ['k','v'],
    	data : ywType
    })
    var ckTypeDs = new Ext.data.SimpleStore({
    	fields : ['k','v'],
    	data : ckType
    })
    
    
	var fc = {
		// 'outid': {name: 'outid',fieldLabel: '设备出库主键',hidden:true,hideLabel:true,anchor:'95%'},
		 'outid': {name: 'outid',fieldLabel: '从设备入库中选取',hidden:true,hideLabel:true,anchor:'95%'},
         'conid': {name: 'conid',fieldLabel: '合同号',hidden:true,hideLabel:true,anchor:'95%'}, 
         'pid': {id:'pid',name: 'pid',fieldLabel: '入库主键',hidden:true,hideLabel:true,anchor:'95%'}, 
         'outno': {name: 'outno',fieldLabel: '出库编号',readOnly : true,allowBlank: false,anchor:'95%'}, 
         'getPart': {name: 'getPart',fieldLabel: '领用单位',anchor:'95%'}, 
         'getPerson': {name: 'getPerson',fieldLabel: '领用人',anchor:'95%'},
         'outDate': {name: 'outDate',fieldLabel: '出库日期',format: 'Y-m-d',minValue: '2000-01-01',readOnly:true,allowBlank:false,anchor:'95%'}, 
         'equMoney': {name: 'equMoney',fieldLabel: '设备金额',anchor:'95%'}, 
         'sumMoney': {name: 'sumMoney',fieldLabel: '合计价格',anchor:'95%'}, 
         'wareAdmin': {name: 'wareAdmin',fieldLabel: '仓库管理员',anchor:'95%'}, 
         'state': {name: 'state',fieldLabel: '状态',anchor:'95%'},
         'remark': {name: 'remark',fieldLabel: '备注',anchor:'95%'},
         'equipfee':{id:'equipfee',name:'equipfee',fieldLabel:'到货设备总金额',anchor:'95%',readOnly:true},
         'carryfee':{id:'carryfee',name:'carryfee',fieldLabel:'运保费',anchor:'95%',readOnly:true},
         'otherfee':{id:'otherfee',name:'otherfee',fieldLabel:'其它费用',anchor:'95%',readOnly:true},
         'toolfee':{id:'toolfee',name:'toolfee',fieldLabel:'专用工具金额',anchor:'95%',readOnly:true},
         'partfee':{id:'partfee',name:'partfee',fieldLabel:'备品备件金额',anchor:'95%',readOnly:true},
         'totalfee':{id:'totalfee',name:'totalfee',fieldLabel:'合计总金额',anchor:'95%',readOnly:true},
         'checkbh':{id:'checkbh',name:'checkbh',fieldLabel:'验收单号',anchor:'95%',readOnly:true},
         'rkzt':{name:'rkzt',fieldLabel:'出库状态',anchor:'95%'},
         'sqr':{name:'sqr',fieldLabel:'申请人',anchor:'95%'},
         'bdgid':{id:'bdgid',name:'bdgid',fieldLabel:'概算编号',anchor:'95%',readOnly:true},
         'bdgname':{id:'bdgname',name:'bdgname',fieldLabel:'概算名称',anchor:'95%',readOnly:true},
         'openid':{id:'openid',name:'openid',fieldLabel:'开箱单号',hidden:true,hideLabel:true,anchor:'95%',readOnly:true},
         'ghfp':{id:'ghfp',name:'ghfp',fieldLabel:'供货发票',anchor:'95%',readOnly:true}
         ,'ywtype':{id:'ywtype',name:'ywtype',fieldLabel:'业务类型'}
		,'cktype':{id:'cktype',name:'cktype',fieldLabel:'出库类别'}
		,'billstate':{id:'billstate',name:'billstate',fieldLabel:'审批状态',hidden: true,hideLabel: true}
         
	};
    
    // 3. 定义记录集
	var Columns = [
		{name: 'conid', type: 'string'},
    	{name: 'outid', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'outno', type: 'string'},
		{name: 'getPart', type: 'string'},
		{name: 'getPerson', type: 'string'},
		{name: 'outDate', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'equMoney', type: 'float'},
		{name: 'sumMoney', type: 'float'},
		{name: 'wareAdmin', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'equipfee', type: 'float'},
		{name: 'carryfee', type: 'float'},
		{name: 'otherfee', type: 'float'},
		{name: 'toolfee', type: 'float'},
		{name: 'partfee', type: 'float'},
		{name: 'totalfee', type: 'float'},
		{name: 'checkbh', type: 'string'},
		{name: 'rkzt', type: 'string'},
		{name: 'sqr', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'openid', type: 'string'},
		{name: 'ghfp', type: 'string'}
		
		,{name:'ywtype',type:'string'}
		,{name:'cktype',type:'string'}
		,{name:'billstate',type:'string'}
	];
	
    var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (outid == null || outid == 'null' || outid == ''){
    	loadFormRecord = new formRecord({
		outid: "",              conid:conid,        pid: CURRENTAPPID,        outno:initBh,
    	getPart: USERORG,       getPerson: USERID,   equMoney: "",   sumMoney: "",
    	wareAdmin:'',            remark: '',          state: '',      sqr:USERID,
    	equipfee:'',             carryfee:'',         otherfee:'',      toolfee:'',
    	partfee:'',              totalfee:'',          checkbh:'',      rkzt:'',
    	bdgid:'',                bdgname:'',           openid:'',       ghfp :'',
    	outDate:'',
    		ywtype:'',
			cktype:'',
			billstate:'0'
	    });
    } else {
    	DWREngine.setAsync(false);
	    baseMgm.findById(bean, outid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	} 	
	
	var sqrCombo = new fm.ComboBox({
		name : 'sqr',
		fieldLabel : '申请人',
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : getuserSt,
		readOnly : true
	})
	
	var getPersonCombo = new fm.ComboBox({
		name : 'getPerson',
		fieldLabel : '领用人',
		allowBlank : false,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : getuserSt,
		readOnly : true
	})
	
	
	var ywTypeDsCombo = new fm.ComboBox({
		name : 'ywtype',
		fieldLabel : '业务类型',
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : ywTypeDs,
		readOnly : true
	});
	var ckTypeDsCombo = new fm.ComboBox({
		name : 'cktype',
		fieldLabel : '出库类别',
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		triggerAction : 'all',
		store : ckTypeDs,
		readOnly : true
	});
	
    // 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        labelWidth :120,
        bodyStyle: 'padding:10px 10px;',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	items: [
    			new Ext.form.FieldSet({
    			title: '出库基本信息',
                border: true,
                layout: 'column',
                items:[
                		new fm.TextField(fc['pid']),
		   				new fm.TextField(fc['outid']),
				        new fm.TextField(fc['conid']),
				        new fm.TextField(fc['openid']),
				        new fm.TextField(fc['billstate']),
                		{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						/*
				            	new Ext.form.TriggerField({
		                			name:'outid',
		                			id:'getopenFromList',
		                			fieldLabel:'从设备入库中选取',
		                			triggerClass: 'x-form-date-trigger',
			    					readOnly: true, selectOnFocus: true,
			    					width:22,
			    					onTriggerClick:addSb
		                		 }),
		                	*/	
		   						 new fm.TextField(fc['outno']),
		   						 new fm.TextField(fc['getPart']),
		   						 //new fm.TextField(fc['getPerson']),//领用人
		   						 getPersonCombo,
		   						 new fm.NumberField(fc['totalfee']),
		   						 //new fm.TextField(fc['sqr'])//申请人
		   						 sqrCombo,
		   						 ywTypeDsCombo,
		   						 ckTypeDsCombo
		   						 
	   						   ]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    							new fm.DateField(fc['outDate']),
				            	new fm.NumberField(fc['equMoney']),
				            	new fm.NumberField(fc['sumMoney']),
				            	new fm.NumberField(fc['equipfee']),
				            	new fm.NumberField(fc['carryfee']),
				            	new fm.TextField(fc['checkbh']),
				            	new fm.NumberField(fc['partfee'])
    						   ]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
				            	new fm.TextField(fc['bdgid']),
				            	new fm.TextField(fc['bdgname']),  
				            	new fm.NumberField(fc['otherfee']),
				            	new fm.NumberField(fc['toolfee']),
				            	new fm.TextField(fc['rkzt']),
				            	new fm.TextField(fc['ghfp'])
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
            	parent.aouWindow.hide();
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
				})
		],
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
    	var form = formPanel.getForm()
    	if (form.isValid()){
    		if(outid==null || outid==''){
	     		var bhvalue = form.findField('outno').getValue()
	    		checkGetGoodsbh(bhvalue)
    		}else{
    			doFormSave();    		
    		}
	    }
    }
    
    //考虑到此页面可能存在在多个机器上被打开添加数据而导致自动编号重复的现象的可能性，所以增加了编号重复的判断
    function checkGetGoodsbh(value){
    			DWREngine.setAsync(false)
    				equGetGoodsMgm.checkBhExist(value,"out",function(flag){
    					if(flag){
    						doFormSave()
    					}else{
    						Ext.Msg.alert('提示','编号为：'+value+'的数据已存在！<br>请尝试在最后一位加1后重试')
    					}
    				})
    			DWREngine.setAsync(true)
    }
    
    
    function doFormSave(){
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
    	if (obj.outid == '' || obj.outid == null){
	   		equGetGoodsMgm.inserthousOutGoods(obj, function(){
	   			if(isFlwTask != true){
		   			Ext.example.msg('保存成功！', '您成功新增了一条信息！');
		   			parent.aouWindow.hide();
	   			}else{
	   				Ext.Msg.show({
					   title: '保存成功！',
					   msg: '您成功新增了一条设备出库主信息！　　　<br>下一步进行选择设备或部件！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
					   		//parent.aouWindow.hide();
	   					parent.window.location.href = BASE_PATH+"Business/equipment/equ.houseOut.input.jsp?conid="
		    			+conid+"&conname="+conname+"&conno="+conno+"&conmoney="+conmoney+"&isTask=true&outno="+initBh;
					   		}
					   }
					});
	   			}
	   		});
   		}else{
   			equGetGoodsMgm.updateGetOuseoutGoods(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				parent.aouWindow.hide();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"Business/equipment/equ.houseOut.addorupdate.jsp?conid=" 
    			+ conid + "&conname=" + conname + "&conno="+conno+ "&outid="+outid;
			window.location.href = url;
    	}else{
    		parent.aouWindow.hide();
    	}
    }
});

function addSb(){
	selectWin.show()
}


