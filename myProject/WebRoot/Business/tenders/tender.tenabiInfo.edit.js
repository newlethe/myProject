var ServletUrl = MAIN_SERVLET;
var bean = "com.sgepit.pmis.tenders.hbm.TenSub";
var business = "tendersMgm";
var listMethod = "findByProperty";
var primaryKey = "peoid";
var orderColumn = "peoid";

var formPanelTitle = "编辑记录（查看详细信息）";
var pageSize = PAGE_SIZE;
var SPLITB = "`";
var pid = PID;
var propertyName = "peoid";
var changeTypes = new Array();
var propertyValue = g_conid;


Ext.onReady(function (){

// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel();
    
    // 2. 创建列模型  招标方式
    var fm = Ext.form;			// 包名简写（缩写）
	DWREngine.setAsync(false);	
    appMgm.getCodeValue('招标方式',function(list){		//性别
    	for (i = 0; i < list.length; i++){
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
    	 'peoid': {
			name: 'peoid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: true
         }, 'pid': {
			name: 'pid',
			fieldLabel: '招投标编码',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			allowBlank: true,
			anchor:'95%'
         }, 'peono': {
			name: 'peono',
			fieldLabel: '序号',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         }, 'peoname': {
			name: 'peoname',
			fieldLabel: '姓名',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         }, 'peodept': {
			name: 'peodept',
			fieldLabel: '单位',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peoduty': {
			name: 'peoduty',
			fieldLabel: '学历',
            //readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peospeci': {
			name: 'peospeci',
			fieldLabel: '专业',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'reomark': {
			name: 'reomark',
			fieldLabel: '职务',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peotecspec': {
			name: 'peotecspec',
			fieldLabel: '部门',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         }, 'peotecfield': {
			name: 'peotecfield',
			fieldLabel: '从事领域',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peosex': {
			name: 'peosex',
			fieldLabel: '性别',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peotel': {
			name: 'peotel',
			fieldLabel: '电话',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peoemail': {
			name: 'peoemail',
			fieldLabel: '电子邮箱',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         },'peotecpost': {
			name: 'peotecpost',
			fieldLabel: '职称',
			//readOnly:true,
			//hidden:true,
			hideLabel:false,
			allowBlank: false,
			anchor:'95%'
         }
         
    };
  
// 3. 定义记录集
    	 var Columns = [
    	{name: 'peoid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'pid', type: 'string'},
		{name: 'peono', type: 'string'},
		{name: 'peoname', type: 'string'},
		{name: 'peodept', type: 'string'},
		{name: 'peoduty', type: 'string'},
		{name: 'peospeci', type: 'string'},
		
		{name: 'reomark', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'peotecspec', type: 'string'},
		{name: 'peotecfield', type: 'string'},
		{name: 'peosex', type: 'string'},
		{name: 'peotel', type: 'string'},
		{name: 'peoemail', type: 'string'},
		{name: 'peotecpost', type: 'string'}
	];

var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if (g_chaid == null || g_chaid == ''){

    	loadFormRecord = new formRecord({
	    			peono: "", 
    				 peoid: '', 
    				pid:pid,
    				peoname: '', 
    				peodept: '',
    				peoduty: '', 
    				peospeci: '' ,
    				
    				reomark:'',
		    		peotecspec :'',
		    		peotecfield:'',
		    		peosex:'',
		    		peotel :'',
		    		peoemail:'',
		    		peotecpost:''
	    });
    }else{
    	DWREngine.setAsync(false);
    	tendersMgm.getFormBeanAbi(g_conid,function(obj){
	    	loadFormRecord = new formRecord({
	    		peoid: obj.peoid,
	    		peono: obj.peono,
	    		pid: obj.pid,
	    		peoname: obj.peoname,
	    		peodept: obj.peodept,
	    		peoduty: obj.peoduty,
	    		peospeci: obj.peospeci,
	    		
	    		reomark:obj.reomark,
	    		peotecspec :obj.peotecspec,
	    		peotecfield:obj.peotecfield,
	    		peosex:obj.peosex,
	    		peotel :obj.peotel,
	    		peoemail:obj.peoemail,
	    		peotecpost:obj.peotecpost
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
	   					layout: 'form', columnWidth: .50,
	   					bodyStyle: 'border: 0px;',
	   					items:[
	   					    
	   						new fm.TextField(fc['peono']),
	   						new fm.TextField(fc['peoname']),
	   						new fm.TextField(fc['peosex']),
	   						new fm.TextField(fc['peotel']),
	   						new fm.TextField(fc['peoemail']),
	   						new fm.TextField(fc['peotecspec']),
	   						new fm.TextField(fc['peoid'])
	   						
	   					]
    				} 
    				,{
    					layout: 'form', columnWidth: .50,
    					bodyStyle: 'border: 0px;',
    					items:[
    						new fm.TextField(fc['peodept']),
    						new fm.TextField(fc['peoduty']),
	   						new fm.TextField(fc['peospeci']),
	   						new fm.TextField(fc['reomark']),
	   						new fm.TextField(fc['peotecpost']),
	   						new fm.TextField(fc['peotecfield']),
    						new fm.TextField(fc['pid'])
    						
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
    		tendersMgm.insertOrUpd(obj, function(flag){
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
    		tendersMgm.insertOrUpd(obj, function(flag){
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
    		var url = BASE_PATH+"Business/tenders/tender.tenabiInfo.edit.jsp?";
			window.location.href = url;
    	}else{
    		var url = BASE_PATH+"Business/tenders/tender.tenabiInfo.input.jsp?";
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


