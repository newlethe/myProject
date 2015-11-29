var bean = "com.sgepit.pmis.contract.hbm.ConOve";
var faceColBean = "com.sgepit.frame.flow.hbm.FlwFaceColumns";
var business = "baseMgm";
var listMethod = "findByProperty";
var primaryKey = "conid";
var orderColumn = "conno";
var propertyName = "condivno";
var propertyValue = g_conid;
var SPLITB = "`";

var partBs= new Array();
var sort = new Array();
var contractType = new Array();
var BillState= new Array();
var payways= new Array();
var bidways=new Array();
var partbWindow, partBField, typeName, CONOVE;
//var contSort1 = [['GC','工程合同分类'],['SB','设备合同分类'],['QT','其它合同分类']];
var dsCombo2 = new Ext.data.SimpleStore({
    fields: ['k', 'v'],   
    data: [['','']]
});
var contSort2_gc = new Array();
var contSort2_sb = new Array();
var contSort2_qt = new Array();
var dsPartB;
var contractType = new Array();
var contarctType2 = new Array();
var currentPid = CURRENTAPPID;

Ext.onReady(function (){

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
    
	DWREngine.setAsync(false);  
	DWREngine.beginBatch(); 
	
    appMgm.getCodeValue('合同付款方式',function(list){         //获取合同付款方式
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			payways.push(temp);			
		}
    }); 
     baseDao.findByWhere2('com.sgepit.pcmis.bid.hbm.PcBidZbContent',"pid='"+CURRENTAPPID+"'",function(list){   
     	//获取招标内容
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].uids);		
			temp.push(list[i].contentes);	
			bidways.push(temp);			
		}
    }); 
    //conoveMgm.getContractSortByDept(USERDEPTID,function(list){
//    appMgm.getCodeValue('合同划分类型',function(list){
//    	for(i = 0; i < list.length; i++) {
//			var temp = new Array();	
//			temp.push(list[i].propertyCode);		
//			temp.push(list[i].propertyName);	
//			contractType.push(temp);			
//		}
//    })
    
    //根据属性代码中对应“合同划分类型”中查询出材料合同，“详细设置”列包含CL
	var clSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.detail_type like '%CL%'";
	DWREngine.setAsync(false);
	baseMgm.getData(clSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contractType.push(temp);			
		}
	})
    
    
    
    appMgm.getCodeValue('工程合同分类',function(list){         //获取工程合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_gc.push(temp);			
		}
    });     
    
    appMgm.getCodeValue('设备合同分类',function(list){         //获取设备合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_sb.push(temp);			
		}
    });        
    appMgm.getCodeValue('其它合同分类',function(list){         //获取设备合同划分类型
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			contSort2_qt.push(temp);			
		}
    });        
    
    DWREngine.endBatch();
	DWREngine.setAsync(true);	
	
	var contTotalType = contSort2_gc.concat(contSort2_sb)
    dsPartB = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: partBs
    });
    var dsPayway = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: payways
    });
    var dsbidway = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: bidways
    });
    var dsConDivno = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: contractType //contSort1
    });
    var dsSort = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data:sort
    });

    var fm = Ext.form;			// 包名简写（缩写）
	var fc = {		// 创建编辑域配置
    	 'conid': {
			name: 'conid',
			fieldLabel: '主键',
			anchor: '95%',
			hidden: true,
			readOnly: true,
			hideLabel: true
         }, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor:'95%'
         }, 'conno': {
			name: 'conno',
			fieldLabel: '合同编号<font color=red>*</font>',
			allowBlank: false,
			anchor:'95%'
         }, 'conname': {
			name: 'conname',
			fieldLabel: '合同名称<font color=red>*</font>',
			allowBlank: false,
			anchor:'95%'
         },'condivno': {
			name: 'condivno',
			fieldLabel: '合同分类',
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsConDivno,
            lazyRender: true,
            forceSelection: true,
            allowBlank: false,
            listClass: 'x-combo-list-small',
			anchor:'60%'
         },'sort': {
			name: 'sort',
			fieldLabel: '所属系统',
			disabled: true, 
			readOnly : true,
			valueField: 'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsSort,
            lazyRender: true,
            listClass: 'x-combo-list-small',
            allowBlank:false,
			anchor:'95%'
         }, 'convalue': {
         	id: 'convalue',
			name: 'convalue',
			fieldLabel: '合同总金额',
			readOnly : true,
			anchor: '95%'
         },'conmoney': {
			name: 'conmoney',
			fieldLabel: '合同签定金额<font color=red>*</font>',
			allowBlank: false,
			anchor: '95%'
         },'changemoney': {
			name: 'changemoney',
			fieldLabel: '变更总金额',
			readOnly : true,
			anchor: '95%'
         },'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			anchor: '95%'
         },'advmoney': {
			name: 'advmoney',
			fieldLabel: '预付款',
			anchor:'95%'
         },'matmoney': {
			name: 'matmoney',
			fieldLabel: '质保金',
			anchor: '95%'
         },'payper': {
			name: 'payper',
			fieldLabel: '付款比例',
			readOnly : true,
			anchor: '95%'
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
         },'signdate': {
			name: 'signdate',
			fieldLabel: '签订日期',
			format: 'Y-m-d',
			readOnly:false,
            allowBlank: false,
			anchor: '95%'
         },'startdate': {
			name: 'startdate',
			fieldLabel: '合同登记日期',
			format: 'Y-m-d',
			readOnly:true,
            minValue: '2000-01-01',
			anchor: '95%'
         },'enddate': {
			name: 'enddate',
			fieldLabel: '合同结束日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            readOnly:true,
			anchor: '95%'
         },'bidno': {
			name: 'bidno',
			fieldLabel: '招标备注',  
			anchor:'95%'
         },'bidprice': {
			name: 'bidprice',
			fieldLabel: '中标价',
			anchor:'95%'
         },'auditprice': {
			name: 'auditprice',
			fieldLabel: '审计价',
			hidden:true,
			hideLabel: true,
			anchor:'95%'
         },'biddate': {
			name: 'biddate',
			fieldLabel: '截标日期',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            readOnly:false,
			anchor: '95%'
         },'bidenddate': {
			name: 'bidenddate',
			fieldLabel: '完标日期',
			readOnly:true,
			format: 'Y-m-d',
            hidden:true,
            hideLabel: true,
			anchor: '95%'
         }, 'partya': {
			name: 'partya',
			fieldLabel: '甲方',
			anchor: '95%'
         }, 'actionpartya': {
			name: 'actionpartya',
			fieldLabel: '签订人', 
			anchor: '95%'
         }, 'partybno': {
			name: 'partybno',
			fieldLabel: '乙方单位',
			hiddenName:'partybno',
			//triggerClass : 'x-form-date-trigger',
			//selectOnFocus: true,
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			//emptyText:'请选择乙方单位...', 
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: dsPartB,
          	lazyRender: true,
          	listClass: 'x-combo-list-small',
			anchor:'95%'
         },'billstate': {
			name: 'billstate',
			fieldLabel: '合同状态',
              hidden: true,
			  hideLabel: true,
            //  store: dsBillState,
             // listClass: 'x-combo-list-small',
			  anchor:'60%'
         },'conadmin': {
			name: 'conadmin',
			fieldLabel: '合同管理员',
			readOnly: true,
			anchor:'95%'
         },'context': {
			name: 'context',
			fieldLabel: '合同摘要',
			hideLabel:true,
			height: 120,
			width: 645,
			xtype: 'textarea',
			anchor:'95%'
         },'remark': {
			name: 'remark',
			fieldLabel: '备注',
			hideLabel:true,
			height: 120,
			width: 645,
			xtype: 'textarea',
			anchor:'95%'
         },'bidtype':{
         	name:'bidtype',
         	//fieldLabel: '招标方式',
			fieldLabel: '招标标号',
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: dsbidway,
            lazyRender: true,
            listClass: 'x-combo-list-small',
			anchor: '95%'   	
         },'judgeprice': {
			name: 'judgeprice',
			fieldLabel: '评审价',
			anchor:'95%'
         },'alreadypay': {
			name: 'alreadypay',
			readOnly:true,
			fieldLabel: '已付金额',
			anchor:'95%'
         },'yfdwmc': {
			name: 'yfdwmc',
			fieldLabel: '乙方单位',
			hidden : true,
			hideLabel : true,
			anchor: '95%'
         },'contractors':{
            name : 'contractors',
            fieldLabel : '承办人',
            anchor : '95%'
         },'contractordept' : {
            name : 'contractordept',
            fieldLabel : '承办部门',
            anchor : '95%'
         },'projectname': {
            name : 'projectname',
            fieldLabel : '项目名称',
            anchor : '95%'
         },'performancedate' :{
            name : 'performancedate',
            fieldLabel : '履约保函到期日',
            format: 'Y-m-d',
            readOnly : true,
            anchor : '95%'
         },'invoicemoney' :{
            name : 'invoicemoney',
            fieldLabel : '发票金额',
            readOnly : true,
            anchor:'95%'
         },'bremoney' :{
            name : 'bremoney',
            fieldLabel : '合同违约总额',
            readOnly : true,
            anchor:'95%'
         },'clamoney' :{
            name : 'clamoney',
            fieldLabel : '合同索赔总额',
            readOnly : true,
            anchor:'95%'
         },'payper':{
         	name : 'payper',
         	fieldLabel : '付款比例',
            readOnly : true,
            anchor : '95%'
         }
    };
    var  condivnoCombo = new Ext.form.ComboBox({
    	name: 'condivno',
		fieldLabel: '合同分类一<font color=red>*</font>',
		readOnly : true,
		valueField: 'k',
		displayField: 'v', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsConDivno,
        lazyRender: true,
        allowBlank: false,
        forceSelection: true,
        listClass: 'x-combo-list-small',
        listeners:{'collapse':function(com){
        	condivnoCombo2.clearValue();
        	condivnoCombo2.focus(true);
        	condivnoCombo2.setDisabled(false);
        	
        	DWREngine.setAsync(false);	
	    	contarctType2 = new Array();
	    	appMgm.getCodeValue(com.getRawValue(),function(list){         //获取工程合同划分类型	    	
				for(i = 0; i < list.length; i++) {
					var temp = new Array();	
					temp.push(list[i].propertyCode);		
					temp.push(list[i].propertyName);	
					contarctType2.push(temp);			
				}
		    }); 
		    dsCombo2.loadData(contarctType2);
		    	//将合同分类二中第一组数据插入下拉菜单
				formPanel.getForm().findField('sort').setValue(contarctType2[0][0]);
				formPanel.getForm().findField('sort').getRawValue(contarctType2[0][1]);
			condivnoCombo2.setDisabled(false)
	    	DWREngine.setAsync(true);
	    	
        }},
		anchor:'95%'
    })
    
    var condivnoCombo2 = new Ext.form.ComboBox({
    	name: 'sort',
		fieldLabel: '合同分类二<font color=red>*</font>',
		disabled: false, 			//添加时将以前的true修改为false
		readOnly : true,
		valueField: 'k',
		displayField: 'v', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsCombo2,
        lazyRender: true,
        forceSelection: true,
        allowBlank:false,
        listClass: 'x-combo-list-small',
		anchor:'95%'
    })   
    var bidtypeCombo = new Ext.form.ComboBox({
    	name: 'bidtype',
    	//fieldLabel: '招标方式',
		fieldLabel: '招标内容',
		//disabled: true, 
		//readOnly : true,
		valueField: 'k',
		displayField: 'v', 
		mode: 'local',
        typeAhead: true,
        triggerAction: 'all',
        store: dsbidway,
        lazyRender: true,
        forceSelection: true,
        listClass: 'x-combo-list-small',
		anchor:'95%'
    })     
    
    
// 3. 定义记录集
   var Columns = [
    	{name: 'conid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'conno', type: 'string'},    	
		{name: 'conname', type: 'string'},
		{name: 'condivno', type: 'string'},
		{name: 'sort', type: 'string'},
		{name: 'convalue', type: 'float'},	
		{name: 'conmoney', type: 'float'},  
		{name: 'changemoney', type: 'float'},	
		{name: 'bdgmoney', type: 'float'},	
		{name: 'advmoney', type: 'float'},
		{name: 'matmoney', type: 'float'},
		{name: 'payper', type: 'string'},
		{name: 'payway', type: 'string'},
		{name: 'signdate', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'startdate', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'enddate', type: 'date', dateFormat: 'Y-m-d'},
		
		{name: 'bidno', type: 'string'},
		{name: 'bidprice', type: 'float'},
		{name: 'auditprice', type: 'float'},
    	{name: 'biddate', type: 'date', dateFormat: 'Y-m-d'},
    	{name: 'bidenddate', type: 'date', dateFormat: 'Y-m-d'},
		
		{name: 'partya', type: 'string'},
		{name: 'actionpartya', type: 'string'},
		{name: 'partybno', type: 'string'},
		{name: 'billstate', type: 'float'},
		{name: 'conadmin', type: 'string'},
		{name: 'context', type: 'string'},
		{name: 'remark', type: 'string'},
		{name: 'bidtype', type: 'string'},
		{name: 'judgeprice', type: 'float'},
		{name: 'alreadypay', type: 'float'},
		{name: 'yfdwmc', type: 'string'},
		{name : 'contractors' , type : 'string'},
		{name : 'contractordept', type : 'string'},
		{name : 'projectname', type : 'string'},
		{name : 'performancedate', type : 'date',dateFormat: 'Y-m-d'},
		{name : 'invoicemoney' ,type : 'float'},
		{name : 'bremoney' ,type : 'float'},
		{name : 'clamoney' ,type : 'float'}
	];
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    //////////////////////////////////////////////
    if (isFlwTask == true || isFlwView == true){	//任务调用模块
		if (g_conno == null || g_conno == ''){
			loadFormRecord = new formRecord({
				conid: null,
				pid : currentPid,
				conno:  '',
				conname:  '',
				condivno:'',
				sort:'',
				convalue:0,
				conmoney: 0,
				changemoney: 0,
				bdgmoney: 0,
				advmoney:0,
				matmoney:0,
				payper:'',
				payway:'',
					
				bidno:'',
				bidprice: 0,
				auditprice: 0,
					
				partya:UNITNAME,
				actionpartya:'',
				partybno: '',
				
				signdate:'',
				startdate:new Date(),
				enddate:'',
				biddate:'',
				bidenddate:'',
				
				billstate: 1,
				context:'',
				remark:'',
				//conadmin:USERNAME,
				conadmin:REALNAME,
				bidtype:'',
				judgeprice:0,
				alreadypay:0,
				contractors : '',
				contractordept : '',
				projectname : '',
				performancedate : '',
				invoicemoney : 0,
				bremoney : 0,
				clamoney : 0
			});
		} else{
	    	DWREngine.setAsync(false);
			baseDao.findByWhere2(bean, "conno='"+g_conno+"'",function(list){
				if (list.length>0){
				    list[0].billstate = '1';
					CONOVE = list[0];
					loadFormRecord = new formRecord(list[0]);
				} else {
					loadFormRecord = new formRecord({
						conid: null,
						pid : currentPid,
						conno:  g_conno,
						conname:  '',
						condivno:'',
						sort:'',
						convalue:0,
						conmoney: 0,
						changemoney: 0,
						bdgmoney: 0,
						advmoney:0,
						matmoney:0,
						payper:'',
						payway:'',
							
						bidno:'',
						bidprice: 0,
						auditprice: 0,
							
						partya:UNITNAME,
						actionpartya:'',
						partybno: '',
						
						signdate:'',
						startdate:new Date(),
						enddate:'',
						biddate:'',
						bidenddate:'',
						
						billstate: 1,
						context:'',
						remark:'',
						//conadmin:USERNAME,
						conadmin:REALNAME,
						bidtype:'',
						judgeprice:0,
						alreadypay:0,
						contractors : '',
						contractordept : '',
						projectname : '',
						performancedate: '',
						invoicemoney : 0,
						bremoney : 0,
						clamoney : 0
					});
				}
			});
			DWREngine.setAsync(true);
		}
	} else {
		if (g_conid == "null" ||g_conid == null || g_conid == ''){
			loadFormRecord = new formRecord({
				conid: null,
				pid : currentPid,
				conno:  '',
				conname:  '',
				condivno:'',
				sort:'',
				convalue:0,
				conmoney: 0,
				changemoney: 0,
				bdgmoney: 0,
				advmoney:0,
				matmoney:0,
				payper:'',
				payway:'',
					
				bidno:'',
				bidprice: 0,
				auditprice: 0,
					
				partya:UNITNAME,
				actionpartya:'',
				partybno: '',

				signdate:'',
				startdate:new Date(),
				enddate:'',
				biddate:'',
				bidenddate:'',

				billstate: 0,
				context:'',
				remark:'',
				conadmin:REALNAME,
				bidtype:'',
				judgeprice:0,
				alreadypay:0,
				contractors : '',
				contractordept : '',
				projectname : '',
				performancedate : '',
				invoicemoney : 0,
				bremoney : 0,
				clamoney : 0
			});
		} else {
			DWREngine.setAsync(false);
			baseMgm.findById(bean, g_conid,function(obj){
				loadFormRecord = new formRecord(obj);
				appMgm.getCodeValueForContractSort(obj.condivno,function(list){	
					for(i = 0; i < list.length; i++) {
						var temp = new Array();	
						temp.push(list[i].propertyCode);		
						temp.push(list[i].propertyName);	
						contarctType2.push(temp);			
					}
				 }); 
				 dsCombo2.loadData(contarctType2);
			
				
			});
			DWREngine.setAsync(true);
			
		}
	}

	
	function newWin(){
		if(!partbWindow){
	         partbWindow = new Ext.Window({	               
	             title: '乙方单位列表',
	             layout: 'fit',
	             width: 800,
	             height: 400,
	             modal: true,
	             closeAction: 'hide',
	             constrain:true,
	             maximizable: true,
	             plain: true,	                
	             items: gridPB
             });
    	}
    	dsPB.load({params:{
			    	start: 0,
			    	limit:  PAGE_SIZE
		    	}
		});
    	partbWindow.show();
   	}	
   	var partybmanField = new fm.TextField(fc['partybman']);
   	
     partBField = new Ext.form.ComboBox(fc['partybno']); 
     partBField.onTriggerClick = function (){newWin()}
     
    var conmoneyField = new Ext.form.NumberField(fc['conmoney']);
    conmoneyField.on("change",function(field,newValue,oldValue){
    	Ext.getCmp("convalue").setValue(newValue);
    })
	// 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        autoScroll:true,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
    	labelAlign: 'left',
    	items: [
    		new fm.Hidden(fc['invoicemoney']),
    		new fm.Hidden(fc['bremoney']),
    		new fm.Hidden(fc['clamoney']),
    		new Ext.form.FieldSet({
    			title: '基本信息',
    			autoWidth:true,
                border: true,
                width:700,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .35,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   						new fm.TextField(fc['conno']),
	   						new fm.TextField(fc['conname']),
	   						bidtypeCombo,
	   						new fm.TextField(fc['actionpartya'])
	   						
	   					]
    				},{
    					layout: 'form', columnWidth: .33,
    					bodyStyle: 'border: 0px;',
    					items:[
    			            new fm.TextField(fc['partya']),
    			            new fm.TextField(fc['projectname']),
    			            new fm.TextField(fc['contractordept']),
    			            new fm.DateField(fc['signdate'])
    					]
    				},{
    					layout: 'form', columnWidth: .3,
    					bodyStyle: 'border: 0px;',
    					items:[
    					    partBField,
    					    new fm.NumberField(fc['convalue']), 
    					    new fm.TextField(fc['contractors']),
    					    new fm.DateField(fc['performancedate'])
    					]
    				}    				
    			]
    		}),new Ext.form.FieldSet({
    			layout: 'form',
                border:true,
                autoWidth:true,
                title:'合同内容',
                cls:'x-plain',  
                items: [fc['context']]
    		}),
    		new Ext.form.FieldSet({
    			title: '其他信息',
    			layout: 'column',
    			border: true,
    			autoWidth:true,
    			items: [{
    				layout: 'form',
    				columnWidth :.35,
    				bodyStyle: 'border: 0px;',
    				items:[
    				    condivnoCombo,
    				    condivnoCombo2,
    				    conmoneyField,
	   					new fm.TextField(fc['billstate']),
	   					new fm.DateField(fc['bidenddate']),
	   					new fm.TextField(fc['conid'])
    				]
    				},{
    				layout: 'form',
    				columnWidth :.33,
    				bodyStyle: 'border: 0px;',
    				items:[
    				    
    				    new fm.TextField(fc['conadmin']),
    					new fm.NumberField(fc['changemoney']), 
	   					new fm.TextField(fc['bdgmoney']),
    					new fm.NumberField(fc['auditprice']),
    					new fm.TextField({
    						name: 'cpid',
							fieldLabel: '乙方单位主键',
							readOnly: true,
							hidden: true,
							hideLabel: true
						})
    				]
    				},
    				{
    				layout: 'form',
    				columnWidth:0.3,
    				bodyStyle: 'border: 0px;',
    				items:[
    				    //new fm.ComboBox(fc['payway']),
    				    new fm.NumberField(fc['payper']),
    				    new fm.TextField(fc['alreadypay']),
    				    new fm.DateField(fc['startdate']),
    				    new fm.TextField(fc['yfdwmc']),
    				    new fm.TextField(fc['pid'])	
    				    
    				]
    				}
    			]
    		}),new Ext.form.FieldSet({
    			layout: 'form',
    			autoWidth:true,
                border:true, 
                title:'备注',
                cls:'x-plain',  
                items: [fc['remark']]
    		})
    		
    	],
    	buttons: [BUTTON_CONFIG['SAVE'], BUTTON_CONFIG['RESET']]
    });
    
	
    var contentPanel = new Ext.Panel({
    	region: 'center',
    	border: false,
    	layout: 'fit',
    	tbar: ['<font color=#15428b><b>&nbsp;合同信息维护</b></font>','->', 
				BUTTON_CONFIG['BACK']
		],
    	items: [formPanel]
    });
    
    // 9. 创建viewport，加入面板action和content
	var viewport = new Ext.Viewport({
            layout: 'border',
            autoWidth:true,
            items: [contentPanel]
    });
        
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
	
	var ifmodify = loadFormRecord.get('conid')
	
	if(ifmodify != null && ifmodify.length>1){
		var partbvalue = loadFormRecord.get('partybno')
		DWREngine.setAsync(false);
		var yfdwmc;
		conpartybMgm.getyfdwmc(partbvalue,function(value){  
			yfdwmc=value;
       	});
       	DWREngine.setAsync(true);
		formPanel.getForm().findField('cpid').setValue(partbvalue);
		/*for(var i=0;i<partBs.length;i++){
			if(partbvalue == partBs[i][0]){
				partBField.setValue(partBs[i][1]);
				break;
			}
		}*/
		
		formPanel.getForm().findField('yfdwmc').setValue(yfdwmc);
		formPanel.getForm().findField('partybno').setValue(partbvalue);
		formPanel.getForm().findField('partybno').setRawValue(yfdwmc);
				
		var sortValue = loadFormRecord.get('sort')
		for(var i=0;i<contTotalType.length;i++){
			if(sortValue == contTotalType[i][0]){
				condivnoCombo2.setRawValue(contTotalType[i][1]);
				break;
			}
		}
		
		condivnoCombo.setDisabled(false);
		condivnoCombo2.setDisabled(false);
		var contDiv1 = loadFormRecord.get('condivno')
		if('GC' == contDiv1){
			condivnoCombo2.setDisabled(false);
			dsCombo2.loadData(contSort2_gc);
		}
		
	}    	
	if (isFlwTask == true) SET_FIELD_EDITABLE_FOR_FLOW();
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };
    //乙方单位
   	function partbRender(value){
   		var str = '';
   		for(var i=0; i<partBs.length; i++) {
   			if (partBs[i][0] == value) {
   				str = partBs[i][1]
   				break; 
   			}
   		}
   		return str;
   	}
    //对合同编号判断的方法, formSave中对其进行两次调用！
    function formSave(){
    	var form = formPanel.getForm();
    	var ids = form.findField(primaryKey).getValue();
    	var connoValue= form.findField("conno").getValue();
    	var connameValue= form.findField("conname").getValue();
    	var signdateValue= form.findField("signdate").getValue();
    	var convalueValue= form.findField("convalue").getValue();
    	if(connoValue==""||connameValue==""||signdateValue==""||((convalueValue==""||convalueValue=='')&&convalueValue!=0)){
    		
    		if(connoValue==""){
    			Ext.Msg.alert("提示","合同编号不能为空");
    		}
    		else if(connameValue==""){ 
    			Ext.Msg.alert("提示","合同名称不能为空");
    		}
    		else if(signdateValue==""){
    			Ext.Msg.alert("提示","签订日期不能为空");
    		}
    		else if(convalueValue==""||convalueValue==''){
    			Ext.Msg.alert("提示","合同签订金额不能为空");
    		} 
    	}  
                 
    	else{		 
    			if (form.isValid()){
	     		var con_no = form.findField('conno');
	     		if (con_no.getValue() != loadFormRecord.get('conno')){
		     		DWREngine.setAsync(false);
		     		conoveMgm.checkConno(con_no.getValue(), function(flag){
		     			if (flag){
		     				doFormSave();
		     			} else {
		     				Ext.Msg.show({
								title: '提示',
								msg: '合同编号不能重复!',
								buttons: Ext.Msg.OK,
								fn: function(value){
									con_no.focus();
									con_no.getEl().dom.select();
								},
								icon: Ext.MessageBox.WARNING
							});
		     			}
		     		});
		     		DWREngine.setAsync(true);
	     		}else{
	     			doFormSave();
	     		}
		    }  
    	}
    		    
    }
    
    function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			/*if (n == 'partybno') {	//乙方单位的处理
    				obj[n] = form.findField('cpid').getValue();
    			} else {
    				obj[n] = field.getValue();
    			}
    			*/
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.conid == '' || obj.conid == null){
	   		conoveMgm.insertConove(obj, function(state){
	   			
	   			if ("" == state){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
					if (isFlwTask != true){
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
						   msg: '您成功新增了一条合同信息！　　　<br>可以发送流程到下一步操作！',
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
   		     if (isFlwTask != true && isFlwView != true){
   			    if(obj.billstate!='0'){
   			        Ext.Msg.alert('提示信息','审批流程中或审批结束 数据不能修改');
   			        return ;
   			    }
   			}
   			conoveMgm.updateConove(obj, function(state){
	   			if ("" == state){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				if (isFlwTask != true) {
	   					//if (typeName) equlistMgm.moveCon(g_conid,typeName);
	   					history.back();
	   				} else { 
	   					Ext.Msg.show({
						   title: '保存成功！',
						   msg: '您成功修改了一条合同信息！　　　<br>可以发送流程到下一步操作！',
						   buttons: Ext.Msg.OK,
						   icon: Ext.MessageBox.INFO,
						   fn: function(value){
						   		if ('ok' == value){
						   			parent.IS_FINISHED_TASK = true;
									parent.mainTabPanel.setActiveTab('common');
									//if (typeName) equlistMgm.moveCon(CONOVE.conid,typeName);
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
    		var url = BASE_PATH+"Business/wzgl/stock/stockCon.addorupdate.jsp?";
			window.location.href = url;
    	}else{
    		history.back();
    	}
    }

    // 下拉列表中 k v 的mapping 
	// 选择乙方单位，并保存下来
   // btnSelect.on('click', selectPartB) ;
   	function selectPartB(){
   		if (!smPB.hasSelection()){
   			Ext.Msg.show({
				title: '提示',
	            msg: '请选择一条记录',
	            icon: Ext.Msg.WARNING, 
	            width:300,
	            buttons: Ext.MessageBox.OK
			})
   		}
   		var record = smPB.getSelected();
		var partybman = record.get('partyblawer');
		var cpid = record.get('cpid');
		var partyb = record.get('partyb');
   		//partBField.setValue(cpid); 
   		//partBField.setRawValue(partyb); 
   		partybmanField.setValue(partybman);
   		//TODO 乙方单位处理
   		formPanel.getForm().findField('cpid').setValue(cpid);
   		partbWindow.hide();
   	}
   	// 下拉框
//   	condivnoCombo.on('collapse', function(combo){
//   		var type = combo.getValue();
//   		if (type == '04' || type == '06'){
//   			sortCombo.setDisabled(false);
//   		}else{
//   			sortCombo.clearValue();
//   			sortCombo.setDisabled(true);
//   		}
//   	})
   	
   	condivnoCombo2.on('collapse',function(combo){
   		typeName = condivnoCombo2.getRawValue();
 	})
   	
	/**
   	 * 流程调用模块时候，对模板上的栏位进行的限制
   	 */
   	function SET_FIELD_EDITABLE_FOR_FLOW(){
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
   	   	
	if (g_conid == "null" ||g_conid == null || g_conid == ''){
   	   	//===添加合同时的操作
   		//======获取部门对应合同分类一中第一条数据
		var firstValue = dsConDivno.getRange()[0].data.k;
		var firstText = dsConDivno.getRange()[0].data.v;
		//======将部门对应合同分类显示在分类一中
		formPanel.getForm().findField('condivno').setValue(firstValue);
		formPanel.getForm().findField('condivno').getRawValue(firstText);
		
		//======添加对应合同分类二
		//=========通过DWR查询出对应的合同分类二
		DWREngine.setAsync(false);
		var loadContarctType2 = new Array()
		//alert(firstText)
		appMgm.getCodeValue(firstText,function(list){         //获取工程合同划分类型	   	
				for(i = 0; i < list.length; i++) {
					var temp = new Array();	
					temp.push(list[i].propertyCode);		
					temp.push(list[i].propertyName);	
					loadContarctType2.push(temp);			
				}
		    });
		dsCombo2.loadData(loadContarctType2);
		//=========将合同分类二中第一组数据插入下拉菜单
		formPanel.getForm().findField('sort').setValue(loadContarctType2[0][0]);
		formPanel.getForm().findField('sort').getRawValue(loadContarctType2[0][1]);
		DWREngine.setAsync(true);
	}
});


