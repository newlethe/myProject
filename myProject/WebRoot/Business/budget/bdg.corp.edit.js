
var bean = "com.sgepit.pmis.budget.hbm.BdgCorpBasic";
var primaryKey = "corpbasicid";
var months = [['1','一月'],['2','二月'],['3','三月'],['4','四月'],['5','五月'],['6','六月'],
		['7','七月'],['8','八月'],['9','九月'],['10','十月'],['11','十一月'],['12','十二月']];

Ext.onReady(function (){
	
	var monthsStore = new Ext.data.SimpleStore({
        fields: ['k', 'v'],
        data: months
    });

	// 1. 创建选择模式
    var sm =  new Ext.grid.CheckboxSelectionModel()
    
    // 2. 创建列模型
    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'corpbasicid': {
			name: 'corpbasicid',
			fieldLabel: '建设法人主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor:'95%'
         }, 'month': {
			name: 'month',
			fieldLabel: '月份<font color=\'red\'>*</font>',
			displayField: 'v',
			valueField:'k',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            editable: false,
            store: monthsStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowBlank: false,
            width: 125,
			anchor:'95%'
         } ,'money': {
			name: 'money',
			fieldLabel: '金额<font color=\'red\'>*</font>',
			allowBlank: false,
			anchor:'95%'
         } ,'corpremark': {
			name: 'corpremark',
			fieldLabel: '备注',
			height: 100,
			width: 645,
			xtype: 'htmleditor',
			anchor:'95%'
         }
    };
    
	// 3. 定义记录集
    var Columns = [
    	{name: 'corpbasicid', type: 'string'},
		{name: 'month', type: 'string'},
		{name: 'money', type: 'float'},
		{name: 'corpremark', type: 'string'}
	];
	var formRecord = Ext.data.Record.create(Columns);
    var loadFormRecord = null;
    if ('' == g_corpbasicid || null == g_corpbasicid){
   		loadFormRecord = new formRecord({
    		corpbasicid: '',
    		month: '',
    		money: 0,
    		corpremark: ''
	    });
    }else{
    	DWREngine.setAsync(false);
    	baseMgm.findById(bean, g_corpbasicid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
	    DWREngine.setAsync(true);
	}
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
	var btnTitle = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;建设法人管理维护</b></font>',
		iconCls: 'title'
	})
	
	// 6. 创建表单form-panel
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
    	iconCls: 'icon-detail-form',	//面板样式
    	tbar: [btnTitle, '->', btnReturn],
    	labelAlign: 'left',
    	items: [
    		new Ext.form.FieldSet({
    			title: '具体内容',
                border: false,
                layout: 'form',
                items:[
		            new fm.ComboBox(fc['month']),
		            new fm.NumberField(fc['money']),
		           	fc['corpremark'],
		           	new fm.TextField(fc['corpbasicid'])
    			]
    			
    			
    		})
    	],
            
		buttons: [{
			id: 'save',
            text: '保存',
            //disabled: true,
            handler: formSave
        },{
			id: 'return',
            text: '取消',
            handler: function(){
            	history.back();
            }
        }]
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
  
    function formSave(){
    	var form = formPanel.getForm()
    	var ids = form.findField(primaryKey).getValue()
    	if (form.isValid()){
	    	doFormSave()
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
    	if (obj.corpbasicid == '' || obj.corpbasicid == null){
	   		bdgCorpMgm.insertBdgCorpBasic(obj, function(state){
	   			if ("" == state){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
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
						msg: state,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
	   		});
   		}else{
   			bdgCorpMgm.updateBdgCorpBasic(obj, function(state){
	   			if ("" == state){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				history.back();
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
    		var url = BASE_PATH+"Business/budget/bdg.corp.edit.jsp";
			window.location.href = url;
    	}else{
    		history.back();
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




