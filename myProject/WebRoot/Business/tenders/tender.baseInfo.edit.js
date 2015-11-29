var ServletUrl = MAIN_SERVLET;
var bean = "com.sgepit.pmis.tenders.hbm.ZbBasic";
var business = "tendersMgm";
var listMethod = "findByProperty";
var primaryKey = "tenid";
var orderColumn = "tenid";

var formPanelTitle = "编辑记录（查看详细信息）";
var pageSize = PAGE_SIZE;
var SPLITB = "`";
var pid = PID;
var propertyName = "tenid";
var changeTypes = new Array();
var propertyValue = g_conid;


Ext.onReady(function (){

// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel();
    
    // 2. 创建列模型  招标方式
    var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('招标方式',function(list){		//招标方式
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
    appMgm.getCodeValue('类型',function(list){		//类型
    	for (i = 0; i < list.length; i ++ ){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		changeTypes.push(temp);
    	}
    });
    DWREngine.setAsync(true);

    var changeTypeStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data : changeTypes
    });

	var fc = {		// 创建编辑域配置
    	 'tenid': {
			name: 'tenid',
			fieldLabel: '主键',
			height: 0,
			width: 0,
			anchor:'40%',
			hidden:true,
			hideLabel:true,
			allowBlank: true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: true,
			anchor:'95%'
         }, 'tenno': {
			name: 'tenno',
			fieldLabel: '招投标编号<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         }, 'tenname': {
			name: 'tenname',
			fieldLabel: '标段名称<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         }, 'tendept': {
			name: 'tendept',
			fieldLabel: '招标书编制单位<font color=\'red\'>*</font>',
			allowBlank: false,
			hideLabel:false,
			anchor:'90%'
         },'tenprinc': {
			name: 'tenprinc',
			fieldLabel: '审查单位<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         }, 'teninputdate': {
			name: 'teninputdate',
			fieldLabel: '审查日期<font color=\'red\'>*</font>',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
            readOnly:true,
			anchor:'95%'

         },'tenmoney': {
			name: 'tenmoney',
			fieldLabel: '标底测算结果<font color=\'red\'>*</font>',
            allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
			anchor:'90%'
         },'tenmode': {
			name: 'tenmode',
			fieldLabel: '招标方式<font color=\'red\'>*</font>',
			displayField: 'v',
			valueField: 'k',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: changeTypeStore,
			lazyRender: true,
			listClass: 'x-combo-list-small',
			allowBlank: false,
			anchor:'80%'
         },'tenbound': {
			name: 'tenbound',
			fieldLabel: '标段范围<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         },'tensendpc': {
			name: 'tensendpc',
			fieldLabel: '招标批次',
			hideLabel:false,
			allowBlank: true,
			anchor:'90%'
         }, 'tenmind': {
			name: 'tenmind',
			fieldLabel: '工期要求<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         },'tencomment': {
			name: 'tencomment',
			fieldLabel: '评标意见<font color=\'red\'>*</font>',
			hideLabel:false,
			allowBlank: false,
			anchor:'90%'
         },'tenopendate': {
			name: 'tenopendate',
			fieldLabel: '发标日期<font color=\'red\'>*</font>',
			format: 'Y-m-d',
            minValue: '2000-01-01',
            //disabledDays: [0, 6],
            //disabledDaysText: '只能选择工作日！',
            allowBlank: false,
            readOnly:true,
			anchor:'95%'
         }, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			hideLabel:false,
			allowBlank: true,
			anchor:'90%'
         },'tenminiprice': {
			name: 'tenminiprice',
			fieldLabel: '标底价<font color=\'red\'>*</font>',
			allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
            hideLabel:false,
			anchor:'90%'
         },'tentype': {
			name: 'tentype',
			fieldLabel: '类型<font color=\'red\'>*</font>',
			displayField: 'v',
			valueField: 'k',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: changeTypeStore,
			lazyRender: true,
			listClass: 'x-combo-list-small',
			allowBlank: false,
			hideLabel:false,
			anchor:'90%'
         },'tenmainprice': {
			name: 'tenmainprice',
			fieldLabel: '概算价',
			allowNegative: false,
            maxValue: 100000000,
            allowBlank: true,
            hideLabel:false,
			anchor:'90%'
         },'tencompar': {
			name: 'tencompar',
			fieldLabel: '评标价<font color=\'red\'>*</font>',
			allowNegative: false,
            maxValue: 100000000,
            allowBlank: false,
            hideLabel:false,
			anchor:'90%'
         },'tenfilenm': {
			name: 'tenfilenm',
			fieldLabel: '文件名称',
			hideLabel:false,
			allowBlank: true,
			anchor:'90%'
         }, 'tenfileid': {
			name: 'tenfileid',
			fieldLabel: '文件流水号',
			hidden:true,
			hideLabel:true,
			allowBlank: true
         } 
         
         
    };
// 3. 定义记录集
   var Columns = [
    	{name: 'tenid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'tenno', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'tenname', type: 'string'},
		{name: 'tendept', type: 'string'},
		{name: 'tenprinc', type: 'string'},
		{name: 'teninputdate',type: 'date', formatDate: 'Y-m-d'},
		
		{name: 'tenmoney', type: 'float'},		
		{name: 'tenmode', type: 'string'},
		{name: 'tenbound', type: 'string'},
		{name: 'tensendpc', type: 'string'},
		{name: 'tenmind', type: 'string'},
		{name: 'tencomment', type: 'string'},		
		{name: 'tenopendate', type: 'date', formatDate: 'Y-m-d'},
		{name: 'remark', type: 'string'},
		{name: 'tenminiprice', type: 'float'},
		{name: 'tentype', type: 'string'},
		{name: 'tenmainprice', type: 'float'},		
		{name: 'tencompar', type: 'string'},
		{name: 'tenfilenm', type: 'string'},
		{name: 'tenfileid', type: 'string'}
	];

var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (g_chaid == null || g_chaid == ''){

    	loadFormRecord = new formRecord({
	    		tenid:'',//g_conid,
	    		pid:pid,
	    		tenno: '',
	    		tenname: '',
	    		tendept: '',
	    		tenprinc: '',
	    		teninputdate: '',
	    		
	    		tenmoney:'',
	    		tenmode :'',
	    		tenbound:'',
	    		tensendpc:'',
	    		tenmind :'',
	    		tencomment:'',
	    		tenopendate:'',
	    		remark :'',
	    		tenminiprice:'',
                tentype:'',
                tenmainprice:'',
                tencompar:'',
                tenfilenm:'',
                tenfileid: ''  		
	    });
    }else{
    	DWREngine.setAsync(false);
	    tendersMgm.getFormBeant(g_conid,function(obj){
	    	loadFormRecord = new formRecord({
	    		tenid: obj.tenid,
	    		tenno: obj.tenno,
	    		pid: obj.pid,
	    		tenname: obj.tenname,
	    		tendept: obj.tendept,
	    		tenprinc: obj.tenprinc,
	    		teninputdate: obj.teninputdate,
	    		
	    		tenmoney:obj.tenmoney,
	    		tenmode :obj.tenmode,
	    		tenbound:obj.tenbound,
	    		tensendpc:obj.tensendpc,
	    		tenmind :obj.tenmind,
	    		tencomment:obj.tencomment,
	    		tenopendate:obj.tenopendate,
	    		remark :obj.remark,
	    		tenminiprice:obj.tenminiprice,
                tentype:obj.tentype,
                tenmainprice:obj.tenmainprice,
                tencompar:obj.tencompar,
                tenfilenm:obj.tenfilenm,
                tenfileid: obj.tenfileid  
	    	});
	    });
	    DWREngine.setAsync(true);
	}
	/*var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});*/
	
		
	// 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: true,
        title: 'asdfsdf',
        region: 'center',
        bodyStyle: 'padding:10px 10px; border:2px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	labelAlign: 'left',
    	tbar: [/*'->',btnReturn*/],
    	items: [
    		new Ext.form.FieldSet({
    			title: '基本信息',
                border: true,
                layout: 'column',
                items:[{
	   					layout: 'form', columnWidth: .33,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   					    
	   						new fm.TextField(fc['tenno']),
	   						new fm.TextField(fc['tenname']),
	   						new fm.TextField(fc['tendept']),
	   						new fm.TextField(fc['tenprinc'])
	   					]
    				},{
    					layout: 'form', columnWidth: .35,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.DateField(fc['teninputdate']),
    						new fm.NumberField(fc['tenmoney']),
    						new fm.TextField(fc['tenbound']),
    						new fm.ComboBox(fc['tenmode'])
    						
    						
    					]
    				},{
    					layout: 'form', columnWidth: .32,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.TextField(fc['tensendpc']),
    						new fm.TextField(fc['tenmind']),
    						new fm.TextField(fc['tencomment']),
    						new fm.DateField(fc['tenopendate'])
    						
    					]
    				}    				
    			]
    		}),
    		
    		new Ext.form.FieldSet({
    			title: '招标信息',
				 layout: 'column',
                border: true,
                items: [{
    					layout: 'form', columnWidth: .50,
    					bodyStyle: 'border: 0px;',
    					items:[
    						
    						new fm.NumberField(fc['tencompar']),
    					    new fm.NumberField(fc['tenminiprice']),
    						new fm.ComboBox(fc['tentype']),
    					    new fm.TextField(fc['tenfileid']),
    					    new fm.TextField(fc['pid'])
    					]
    				},{
    					layout: 'form', columnWidth: .50,
    					bodyStyle: 'border: 0px;',
    					items:[
    						
    						
            	            new fm.TextField(fc['tenfilenm']),
    						new fm.NumberField(fc['tenmainprice']),
    						new fm.TextField(fc['remark']),
    						new fm.TextField(fc['tenid'])
    					]
    				}
                	
				]
    		})
    		
    	],

            
		buttons: [{
			id: 'save',
            text: '保存',
            disabled: false,
            handler: formSave
        },/*{
        	id: 'cancel',
        	text: '清空',
        	handler: formCancel
        },*/{
			id: 'return',
            text: '返回',
            handler: function(){
            	history.back();
            }
        }
        
        ]
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

    
    // 12. 加载数据
	formPanel.getForm().loadRecord(loadFormRecord);
    
    // 13. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

    function insertFun(){
        //grid.defaultInsertHandler();
        //var params = sm.getSelected().get('chaid')
        //window.location.href = baseUrl+"jsp/Ext_Demo/demoEdit.jsp?chaid='" + params + "'";
    };
    
       
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
    	if (obj.tenid == '' || obj.tenid == null){
    		tendersMgm.insertOrUpdate(obj, function(flag){
   				if ("0" == flag){
   					Ext.example.msg('保存成功！', '您成功保存了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?　　　',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});   					
   				}else{
   					Ext.Msg.show({
						title: '提示',
						msg: '数据保存失败！',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
   				}    			
    		});
    	}
    	else {
    		tendersMgm.insertOrUpdate(obj, function(flag){
   				if ("0" == flag){
   					Ext.example.msg('保存成功！', '您成功保存了一条信息！');
   				}else{
   					Ext.Msg.show({
						title: '提示',
						msg: '数据保存失败！',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
   				}
   			});
    	}		
   		DWREngine.setAsync(true);
    	
    	//var dataArr = '[' + Ext.encode(obj) + ']';
	   //formPanel.doSave(dataArr, 1, 1);
    }
    
    function processResult(value){
    	if ("yes" == value){
    		var url = BASE_PATH+"Business/tenders/tender.baseInfo.edit.jsp?";
			window.location.href = url;
    	}else{
    		var url = BASE_PATH+"Business/tenders/tender.baseInfo.input.jsp?";
			window.location.href = url;
    	}
    }
    
    function formCancel(){
	   	formPanel.getForm().reset();
    }

    
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





});


