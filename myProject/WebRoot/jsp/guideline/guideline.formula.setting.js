var curZbSeqno;
var curZbJldw;
var formulaPlantInt;

var formulaPropertyName = "zbSeqno"
//公式设置
var typeArr = new Array();//分类
var accountTypeArr = new Array();//计算方式

Ext.onReady(function(){
	var business = "guidelineService";
	var formulaBean = "com.sgepit.frame.guideline.hbm.SgccGuidelineFormula";
	var listFormulaMethod = "findbyproperty";
	var primaryKey = "id";
	
	DWREngine.setAsync(false);	
	//公式设置////////////
	systemMgm.getCodeValue("公式分类", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			typeArr.push(temp);
		}
	});	
	systemMgm.getCodeValue("计算方式", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			accountTypeArr.push(temp);
		}
	});	
    DWREngine.setAsync(true);
    
	//分类
	typeSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: typeArr
	});
	//计算方式
	accountTypeSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: accountTypeArr
	});
	/////////////////////
    
    //指标管理面板
    var formulaFc = {
		"id":{
			name: 'id',
			fieldLabel: '主键',
			anchor:'95%',
			hidden:true,
			readOnly:true
		},"zbSeqno":{
			name: 'zbSeqno',
			fieldLabel: '指标编号',
			readOnly:true,
			allowBlank: false,
			anchor:'95%',
			hidden:true,
			hideLabel:true
		},"zbName":{
			name: 'zbName',
			fieldLabel: '指标名称',
			readOnly:true,
			allowBlank: false,
			anchor:'95%'
		},"formulaType":{
			name: 'formulaType',
			fieldLabel: '分类',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: typeSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		},"decimalDigits":{
			name: 'decimalDigits',
			fieldLabel: '小数位',
			maxValue: 7,
			minValue :0,
			allowBlank: true,
			anchor:'95%'
		},"increaseDesc":{
			name: 'increaseDesc',
			fieldLabel: '增长描述',
			allowBlank: true,
			anchor:'95%'
		},"increaseSuffix":{
			name: 'increaseSuffix',
			fieldLabel: '增长后缀',
			allowBlank: true,
			anchor:'95%'
		},"depressDesc":{
			name: 'depressDesc',
			fieldLabel: '降低描述',
			allowBlank: true,
			anchor:'95%'
		},"depressSuffix":{
			name: 'depressSuffix',
			fieldLabel: '降低后缀',
			allowBlank: true,
			anchor:'95%'
		},"equalDesc":{
			name: 'equalDesc',
			fieldLabel: '相等描述',
			allowBlank: true,
			anchor:'95%'
		},"jldw":{
			name: 'jldw',
			fieldLabel: '单位',
			allowBlank: false,
			readOnly:true,
			anchor:'95%'
		},"accountType":{
			name: 'accountType',
			fieldLabel: '计算方式',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: accountTypeSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}
	};
	var formulaField = [
		{name: 'id', type: 'string'},
    	{name: 'zbSeqno', type: 'string'},//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'zbName', type: 'string'},
    	{name: 'formulaType', type: 'string'},	
    	{name: 'decimalDigits', type: 'int'},
    	{name: 'increaseDesc', type: 'string'},
    	{name: 'increaseSuffix', type: 'string'},
		{name: 'depressDesc', type: 'string'},
		{name: 'depressSuffix', type: 'string'},
		{name: 'equalDesc', type: 'string'},
		{name: 'jldw', type: 'string'},
		{name: 'accountType', type: 'string'}];
	var formulaPlant = Ext.data.Record.create(formulaField);
    formulaPlantInt = {
    	id:'',
    	zbSeqno:'',
    	zbName:'',
    	formulaType:'',
    	decimalDigits:'',
    	increaseDesc:'',
    	increaseSuffix:'',
    	depressDesc:'',
    	depressSuffix:'',
    	equalDesc:'',
    	jldw:'',
    	accountType:''
    };
    
    //////////////////////
    var typeCombo = new Ext.form.ComboBox(formulaFc['formulaType']);
    var accountCombo = new Ext.form.ComboBox(formulaFc['accountType']);
    
    typeCombo.on("change",function(dat){
    	var val;
    	if(dat.getValue()=='1'){//同比
    		val = '3';//先减后除
    	}else if(dat.getValue()=='2'){//环比
    		val = '1';//求差
    	}else if(dat.getValue()=='3'){//计划完成率
    		val = '2';//求除
    	}
    	f_sm.getSelected().set('accountType',val)
    })
    
    //
    var f_sm =  new Ext.grid.CheckboxSelectionModel();
    var f_cm = new Ext.grid.ColumnModel([		// 创建列模型
    	f_sm, {
    	   id:'id',
           header: formulaFc['id'].fieldLabel,
           dataIndex: formulaFc['id'].name,
           hidden:true,
           width: 60
        }, {
           id:'zbSeqno',
           header: formulaFc['zbSeqno'].fieldLabel,
           dataIndex: formulaFc['zbSeqno'].name,
           hidden:true,
           width: 200,
           editor:new Ext.form.TextField(formulaFc['zbSeqno'])
        }, {
           id:'formulaType',
           header: formulaFc['formulaType'].fieldLabel,
           dataIndex: formulaFc['formulaType'].name,
           renderer: function(value){
           	 for(var i=0; i<typeArr.length; i++){
           	 	if (value == typeArr[i][0])
           	 		return typeArr[i][1]
           	 }
           },
           width: 120,
           editor:typeCombo
		}, {
           id:'decimalDigits',
           header: formulaFc['decimalDigits'].fieldLabel,
           dataIndex: formulaFc['decimalDigits'].name,
           //hidden:true,
           width: 70,
           editor:new Ext.form.NumberField(formulaFc['decimalDigits'])
        }, {
           id:'increaseDesc',
           header: formulaFc['increaseDesc'].fieldLabel,
           dataIndex: formulaFc['increaseDesc'].name,
           //hidden:true,
           width: 100,
           editor: new Ext.form.TextField(formulaFc['increaseDesc'])
        }, {
           id:'increaseSuffix',
           header: formulaFc['increaseSuffix'].fieldLabel,
           dataIndex: formulaFc['increaseSuffix'].name,
           //hidden:true,
           width: 100,
           editor: new Ext.form.TextField(formulaFc['increaseSuffix'])
        }, {
           id:'depressDesc',
           header: formulaFc['depressDesc'].fieldLabel,
           dataIndex: formulaFc['depressDesc'].name,
           width: 100,
           editor:new Ext.form.TextField(formulaFc['depressDesc'])
        }, {
           id:'depressSuffix',
           header: formulaFc['depressSuffix'].fieldLabel,
           dataIndex: formulaFc['depressSuffix'].name,
           //hidden:true,
           width: 100,
           editor: new Ext.form.TextField(formulaFc['depressSuffix'])
        }, {
           id:'equalDesc',
           header: formulaFc['equalDesc'].fieldLabel,
           dataIndex: formulaFc['equalDesc'].name,
           width: 100,
           editor:new Ext.form.TextField(formulaFc['equalDesc'])
        }, {
           id:'jldw',
           header: formulaFc['jldw'].fieldLabel,
           dataIndex: formulaFc['jldw'].name,
           width: 80
           //editor:new Ext.form.TextField(formulaFc['jldw'])
        }, {
           id:'accountType',
           header: formulaFc['accountType'].fieldLabel,
           dataIndex: formulaFc['accountType'].name,
           width: 100,
           renderer: function(value){
           	 for(var i=0; i<accountTypeArr.length; i++){
           	 	if (value == accountTypeArr[i][0])
           	 		return accountTypeArr[i][1]
           	 }
           },
           editor:accountCombo
        }
	]);
    f_cm.defaultSortable = true;						//设置是否可排序

	//创建数据源
    var f_ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: formulaBean,				
	    	business: business,
	    	method: listFormulaMethod,
	    	params: formulaPropertyName+SPLITB+propertyValue
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, formulaField),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    f_ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列

	//模板列表
	formulaPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'guideline-grid-panel',			//id,可选
        ds: f_ds,						//数据源
        cm: f_cm,						//列模型
        sm: f_sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        //title: "指标信息",		//面板标题
        iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        //header: true,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
        //ctCls: 'borderLeft',
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: f_ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: formulaPlant,				
      	plantInt: formulaPlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: formulaBean,					
      	business: "guidelineService",	
      	primaryKey: primaryKey,		
      	deleteHandler: deleteFun,
      	insertMethod: 'addGuidelineFormula',
      	saveMethod: 'saveGuidelineFormula',
		deleteMethod: 'deleteGuidelineFormula'
	});
	
	
	 //////////设置公式////////////////////////////
	function insertFun(){
		formulaPanel.defaultInsertHandler();
	}
    
	function deleteFun(){
		var records = f_sm.getSelections();
		if (records.length > 0){
			var ids = new Array();
			for (var i=0; i<records.length; i++){
				ids.push(records[i].get('modelId'));
			}
			formulaPanel.defaultDeleteHandler();
		}
	}
    
    function loadFormulaForm(){
		var form = formulaPanel.getForm();
    	if (sm.getSelected()!=null){
    		var gridRecod = sm.getSelected()
    		var ids = sm.getSelected().get(primaryKey)
    		guidelineService.getGuidelineInfoByID(ids, function(rtn){
	    		if (rtn == null) {
    				Ext.MessageBox.show({
    					title: '记录不存在！',
    					msg: '未找到需要设置公式的记录，请刷新后再试！',
    					buttons: Ext.MessageBox.OK,
    					icon: Ext.MessageBox.WARNING
    				});
    				return;
	    		}
	    		guidelineService.getFormulaByGuidelineID(ids, function(data){
	    			if(data!=null){
		    			var obj = new Object();
			    		for(var i=0; i<formulaField.length; i++){
			    			var n = formulaField[i].name
			    			obj[n] = data[n]
			    		}
			    		obj['zbName']=rightSelect.get('realname');
			    		var record = new formulaPlantFields(obj)
			    		form.loadRecord(record)
	    			}else{
	    				//alert(formulaPlantFieldsInt.formulaType)
	    				formulaPlantFieldsInt.zbSeqno = rightSelect.get('zbSeqno')
	    				formulaPlantFieldsInt.zbName = rightSelect.get('realname');
	    				formulaPlantFieldsInt.jldw = rightSelect.get('jldw');
	    				form.reset();
	    				
	    				//form.loadRecord(new formulaPlantFields(formulaPlantFieldsInt))
	    			}
	    		})
    		})
    	} 
	}
    
    function saveFormula(){
    	var form = formulaPanel.getForm()
		if (form.isValid()) {
			doFormulaSave()
		}
    }
    
    function doFormulaSave(){
    	var form = formulaPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<formulaField.length; i++) {
    		var n = formulaField[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.id == '' || obj.id == null){
	   		guidelineService.addGuidelineFormula(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   		});
   		}else{
   			guidelineService.saveGuidelineFormula(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formulaWindow.hide();
//	   				reloadTree();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
	//*******************************************************************************
    
});
	
	function refreshFormulaGrid(){
		formulaPlantInt.zbSeqno = curZbSeqno;
		formulaPlantInt.jldw = curZbJldw;
		var ds = formulaPanel.getStore();
    	ds.baseParams.params = formulaPropertyName+SPLITB+curZbSeqno;
    	ds.load({
			params : {
				start : 0, // 起始序号
				limit : PAGE_SIZE
			// 结束序号，若不分页可不用设置这两个参数
			}
		});
	}
	
