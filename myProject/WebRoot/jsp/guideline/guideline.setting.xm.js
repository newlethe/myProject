var bean = "com.sgepit.frame.guideline.hbm.SgccGuidelineInfo";
var business = "guidelineService";
var listMethod = "getGuidelinesByParentId";
var primaryKey = "zbSeqno";
var orderColumn = "showOrder";
var propertyName = "parentid";
var propertyValue = "d";
var PlantInt;
var sm;
var ds;
var frm;
var formPanel;
var selectedOrgNode;

var formWindow;
var formPanelTitle = "指标信息";

var SPLITB = "`";

var stateArr = new Array();//有效状态
var ifpubArr = new Array();//归属类型
var collectTypeArr = new Array();//汇总类型
var yesOrNoArr = new Array();//是否
var zbZzlxArr = new Array();//增长率类型
var zbTrccArr = new Array();//投入产出类型
var sxLbArr = new Array();//类别属性
var unitArr = new Array();//单位编号

Ext.onReady(function(){
	DWREngine.setAsync(false);	
	systemMgm.getCodeValue("有效状态", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			stateArr.push(temp);
		}
	});	
	
	systemMgm.getCodeValue("归属类型", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			ifpubArr.push(temp);
		}
	});	
	
	systemMgm.getCodeValue("汇总类型", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			collectTypeArr.push(temp);
		}
	});	
	
	systemMgm.getCodeValue("类别属性", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			sxLbArr.push(temp);
		}
	});	
	
	systemMgm.getCodeValue("是否判断", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			yesOrNoArr.push(temp);
		}
	});	
	systemMgm.getCodeValue("增长率类型", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			zbZzlxArr.push(temp);
		}
	});	
	systemMgm.getCodeValue("投入产出类型", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			zbTrccArr.push(temp);
		}
	});	
	guidelineService.getUnitWithProperty(function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			unitArr.push(temp);
		}
	});	
    DWREngine.setAsync(true);
    
	//有效状态
	stateSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: stateArr
	});
	
	//归属类型
	ifpubSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: ifpubArr
	});
	
	//汇总类型
	collectTypeSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: collectTypeArr
	});
	
	//类别属性
	sxLbSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: sxLbArr
	});
	
	//是否判断
	yesOrNoSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: yesOrNoArr
	});
	//增长率类型
	zbZzlxSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: zbZzlxArr
	});
	//投入产出类型
	zbTrccSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: zbTrccArr
	});
	//单位编号
//	unitSt = new Ext.data.SimpleStore({fields: [], data: [[]]});
	unitSt = new Ext.data.SimpleStore({
		fields: ['val','text'],   
		data: unitArr
	});
    
    //指标管理面板
    var fc = {		// 创建编辑域配置
    	'zbSeqno': {
			name: 'zbSeqno',
			fieldLabel: '指标编号',
			anchor:'95%',
			hidden:true,
			hideLabel : true
		},'unitId': {
			name: 'unitId',
			fieldLabel: '单位编号',
			allowBlank : true,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: unitSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'parentid': {
			name: 'parentid',
			fieldLabel: '父指标编号',
			hidden:true,
			hideLabel:true,
			allowBlank: false,
			anchor:'95%'
		}, 'name': {
			name: 'name',
			fieldLabel: '显示名称',
			//readOnly:true,
			allowBlank: false,
			anchor:'95%'
		}, 'realname': {
			name: 'realname',
			fieldLabel: '指标名称',
			//allowBlank: false,
			anchor:'95%'
		}, 'jldw': {
			name: 'jldw',
			fieldLabel: '计量单位',
			//readOnly:true,
			anchor:'95%'
		}, 'showOrder': {
			name: 'showOrder',
			fieldLabel: '显示顺序',
			allowBlank: false,
			//readOnly:true,
			anchor:'95%'
		}, 'state': {
			name: 'state',
			fieldLabel: '状态',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: stateSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'ifpub': {
			id: 'ifpub',
			name: 'ifpub',
			fieldLabel: '归属类型',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: ifpubSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'collectType': {
			name: 'collectType',
			fieldLabel: '汇总类型',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: collectTypeSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'sxLb': {
			name: 'sxLb',
			fieldLabel: '类别属性',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: sxLbSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'ifydfx': {
			name: 'ifydfx',
			fieldLabel: '异动分析',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: yesOrNoSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'zbZzlx': {
			name: 'zbZzlx',
			fieldLabel: '增长率类型',
			//allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: zbZzlxSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'zbTrcc': {
			name: 'zbTrcc',
			fieldLabel: '投入产出类型',
			//allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: zbTrccSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'ifpercent': {
			name: 'ifpercent',
			fieldLabel: '是否百分比指标',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: yesOrNoSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'hqfs': {
			name: 'hqfs',
			fieldLabel: '是否福利类指标',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: yesOrNoSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
        }
	};

	//定义记录集
    var Columns = [
    	{name: 'zbSeqno', type: 'string'},//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'unitId', type: 'string'},	
    	{name: 'realname', type: 'string'},
    	{name: 'sxLb', type: 'string'},
		{name: 'jldw', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'ifpub', type: 'string'},
		{name: 'showOrder', type: 'int'},
    	{name: 'collectType', type: 'string'}];
	var Fields = Columns.concat([
		{name: 'parentid', type: 'string'},
		{name: 'name', type: 'string'},
		{name: 'ifydfx', type: 'string'},
		{name: 'zbZzlx', type: 'string'},
		{name: 'zbTrcc', type: 'string'},
		{name: 'ifpercent', type: 'string'}]);
		
    var Plant = Ext.data.Record.create(Columns);
    var PlantFields = Ext.data.Record.create(Fields);
    var PlantFieldsInt = new Object();
    var PlantInt = {
    	zbSeqno:'',
    	id:propertyValue,
    	unitId:'',
		parentid:'',
		name:'',
		realname:'',
		jldw:'',
		state:'1',
		ifpub:'',
		collectType:'',
		ifydfx:'',
		zbZzlx:'',
		zbTrcc:'',
		ifpercent:'',
		sxLb:'',
		showOrder:''
    };
    Ext.applyIf(PlantFieldsInt, PlantInt);
    
    //
    var sm =  new Ext.grid.CheckboxSelectionModel();
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
    	   id:'zbSeqno',
           header: fc['zbSeqno'].fieldLabel,
           dataIndex: fc['zbSeqno'].name,
           //hidden:true,
           width: 100
        }, {
           id:'unitId',
           header: fc['unitId'].fieldLabel,
           dataIndex: fc['unitId'].name,
           hidden:true,
           width: 150
		}, {
           id:'parentid',
           header: fc['parentid'].fieldLabel,
           dataIndex: fc['parentid'].name,
           hidden:true,
           width: 100
        }, {
           id:'name',
           header: fc['name'].fieldLabel,
           dataIndex: fc['name'].name,
           hidden:true,          
           width: 100
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
            renderer: setNameFormulorFun,
           width: 150
        }, {
           id:'jldw',
           header: fc['jldw'].fieldLabel,
           dataIndex: fc['jldw'].name,
           width: 80
        }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 60,
  		   renderer: function(value){
           	 for(var i=0; i<stateArr.length; i++){
           	 	if (value == stateArr[i][0])
           	 		return stateArr[i][1]
           	 }
           }
        }, {
           id:'ifpub',
           header: fc['ifpub'].fieldLabel,
           dataIndex: fc['ifpub'].name,
           hidden:true,
           width: 60,
           renderer: function(value){
           	 for(var i=0; i<ifpubArr.length; i++){
           	 	if (value == ifpubArr[i][0])
           	 		return ifpubArr[i][1]
           	 }
           }
        }, {
           id:'sxLb',
           header: fc['sxLb'].fieldLabel,
           dataIndex: fc['sxLb'].name,
           width: 60,
           renderer: function(value){
           	 for(var i=0; i<sxLbArr.length; i++){
           	 	if (value == sxLbArr[i][0])
           	 		return sxLbArr[i][1]
           	 }
           }
        }, {
           id:'collectType',
           header: fc['collectType'].fieldLabel,
           dataIndex: fc['collectType'].name,
           hidden:true,
           width: 80,
           renderer: function(value){
           	 for(var i=0; i<collectTypeArr.length; i++){
           	 	if (value == collectTypeArr[i][0])
           	 		return collectTypeArr[i][1]
           	 }
           }
        }, {
           id:'ifydfx',
           header: fc['ifydfx'].fieldLabel,
           dataIndex: fc['ifydfx'].name,
           hidden:true,
           width: 60
        }, {
           id:'zbZzlx',
           header: fc['zbZzlx'].fieldLabel,
           dataIndex: fc['zbZzlx'].name,
           hidden:true,
           width: 60
        }, {
           id:'zbTrcc',
           header: fc['zbTrcc'].fieldLabel,
           dataIndex: fc['zbTrcc'].name,
           hidden:true,
           width: 60
        }, {
           id:'ifpercent',
           header: fc['ifpercent'].fieldLabel,
           dataIndex: fc['ifpercent'].name,
           hidden:true,
           width: 60
        }, {
           id:'showOrder',
           header: fc['showOrder'].fieldLabel,
           dataIndex: fc['showOrder'].name,
           //hidden:true,
           width: 60
        }
	]);
    cm.defaultSortable = true;						//设置是否可排序

	//创建数据源
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue
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
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列

	//模板列表
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'guideline-grid-panel',			//id,可选
        ds: ds,						//数据源
        cm: cm,						//列模型
        sm: sm,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: "指标信息",		//面板标题
        iconCls: 'icon-by-category',	//面板样式
        border: false,				// 
        region: 'center',
        saveBtn : false,
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: true,				//
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
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "guidelineService",	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	deleteHandler: deleteFun,
		deleteMethod: 'deleteGuideline'
	});
	gridPanel.on("afterdelete", reloadTree)
	gridPanel.on("dblclick", updateFun)
	if(filterNode!=""&&filterNode!=null){
		var cm=gridPanel.getColumnModel();
		cm.setHidden(cm.getIndexById('unitId'),true);
		cm.setHidden(cm.getIndexById('sxLb'),true);
		cm.setHidden(cm.getIndexById('ifpub'),true);
		//cm.setHidden(cm.getIndexById('hqfs'),true);
	}
	//修改按钮
//	var updateBtn = new Ext.Button({
//		id : 'update',
//		text : '修改',
//		tooltip : '修改',
//		iconCls : 'btn',
//		handler : updateFun
//	});
	//移动到
	var moveBtn = new Ext.Button({
		id : 'update',
		text : '移动',
		tooltip : '请选择目标指标',
		iconCls : 'btn',
		handler : moveFun
	});
	
	//右键按钮
	var rightClick = new Ext.menu.Menu({
        id :'rightClickCont',
        items : [{
            id:'formulaMenu',
            text : '设置公式',
            //增加菜单点击事件
            handler:formulaMenuFun
        }]
    });
    
    var setAllFormula = new Ext.Button({
		id : 'setAllFormula',
		text : '设置所有指标的公式',
		tooltip : '设置所有指标的公式',
		iconCls : 'btn',
		hidden : true,
		handler : setAllFormulaFun
	});
    
    var rightSelect;
    //gridPanel.addListener('rowcontextmenu', rightClickFn);
   /* function rightClickFn(grid1,rowindex,e){
    	sm.selectRow(rowindex) ;
    	rightSelect = sm.getSelected() ;
    	if(rightSelect.get('sxLb')=='1'&&rightSelect.get('jldw')!=''){
    		curZbSeqno = rightSelect.get('zbSeqno')
    		curZbJldw = rightSelect.get('jldw')
	   		e.preventDefault();
			rightClick.showAt(e.getXY());//取得鼠标点击坐标，展示菜单
		}
    }; */
	
	var contentPanel = new Ext.Panel({
        id:'content-panel',
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[gridPanel]
    });	
    
	var viewport = new Ext.Viewport({
		layout:'border',
		items:[guideTree,contentPanel]
	});
	
	//************************************************
    
	var formPanelinsert = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		bodyStyle: 'padding:10px 10px',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
	 	items: [new Ext.form.FieldSet({
    			title: '指标基本信息',
                border: true,
                layout: 'column',
                items:[{
		 				layout: 'form', columnWidth: .98,
						bodyStyle: 'border: 0px;',
		   				items:[//new Ext.form.TextField(fc['id']),
		   					   new Ext.form.TextField(fc['name']),
		   					   new Ext.form.TextField(fc['realname'])]
	    			}]
	    		}),
	    		new Ext.form.FieldSet({
	    		title: '其他信息',
                layout: 'column',
                items:[{
		 				layout: 'form', columnWidth: .48,
						bodyStyle: 'border: 0px;',
		   				items:[new Ext.form.ComboBox(fc['unitId']),
		   					   new Ext.form.ComboBox(fc['sxLb']),
		   					   new Ext.form.TextField(fc['jldw']),
		   					   new Ext.form.ComboBox(fc['hqfs']),
		   					   new Ext.form.Hidden(fc['collectType']),
		   					   new Ext.form.Hidden(fc['ifydfx']),
		   					   new Ext.form.Hidden(fc['zbTrcc'])]
	    			},{
	    				layout: 'form', columnWidth: .48,
	    				bodyStyle: 'border: 0px;',
	    				items:[
		   					   new Ext.form.ComboBox(fc['state']),
		   					   new Ext.form.ComboBox(fc['ifpub']),
		   					   new Ext.form.ComboBox(fc['ifpercent']),
		   					   new Ext.form.Hidden(fc['zbZzlx']),
		   					   new Ext.form.TextField(fc['showOrder'])]
	    			}]
	    		}),
	    		new Ext.form.FieldSet({
	    		bodyStyle: 'display:none;',
	    		baseCls:"x-fieldset-free", 
                layout: 'column',
                items:[{
	    				layout: 'form', columnWidth: .48,
	    				bodyStyle: 'border: 0px;',
	    				items:[new Ext.form.TextField(fc['zbSeqno']),
	    					   new Ext.form.TextField(fc['parentid'])]
	    			}]
	    		})],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: saveValidate
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow.hide();
            }
        }]
	});
	var formPanel_km = new Ext.FormPanel({
		id: 'form-panel',
        header: false,
		border: false,
		autoScroll:true,
		bodyStyle: 'padding:10px 10px',
		iconCls: 'icon-detail-form',
		labelAlign: 'left',
	 	items: [new Ext.form.FieldSet({
    			title: '指标基本信息',
                border: true,
                layout: 'column',
                items:[{
		 				layout: 'form', columnWidth: .98,
						bodyStyle: 'border: 0px;',
		   				items:[//new Ext.form.TextField(fc['id']),
		   					   new Ext.form.Hidden(fc['name']),
		   					   new Ext.form.TextField(fc['realname'])]
	    			}]
	    		}),
	    		new Ext.form.FieldSet({
	    		title: '其他信息',
                layout: 'column',
                items:[{
		 				layout: 'form', columnWidth: .48,
						bodyStyle: 'border: 0px;',
		   				items:[//new Ext.form.ComboBox(fc['unitId']),
		   					  // new Ext.form.ComboBox(fc['sxLb']),
		   					   new Ext.form.TextField(fc['jldw']),
		   					    new Ext.form.TextField(fc['showOrder']),
		   					   //new Ext.form.ComboBox(fc['hqfs']),
		   					   new Ext.form.Hidden(fc['collectType']),
		   					   new Ext.form.Hidden(fc['ifydfx']),
		   					   new Ext.form.Hidden(fc['zbTrcc'])]
	    			},{
	    				layout: 'form', columnWidth: .48,
	    				bodyStyle: 'border: 0px;',
	    				items:[
		   					   new Ext.form.ComboBox(fc['state']),
		   					  // new Ext.form.Hidden(fc['ifpub']),
		   					   new Ext.form.ComboBox(fc['ifpercent']),
		   					   new Ext.form.Hidden(fc['zbZzlx'])
		   					  ]
	    			}]
	    		}),
	    		new Ext.form.FieldSet({
	    		bodyStyle: 'display:none;',
	    		baseCls:"x-fieldset-free", 
                layout: 'column',
                items:[{
	    				layout: 'form', columnWidth: .48,
	    				bodyStyle: 'border: 0px;',
	    				items:[new Ext.form.TextField(fc['zbSeqno']),
	    					   new Ext.form.TextField(fc['parentid'])]
	    			}]
	    		})],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: saveValidate
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWindow.hide();
            }
        }]
	});

	//*******************************************************************************
	//添加按钮
	gridPanel.getTopToolbar().add('-',setAllFormula,'->',moveBtn);
	if(filterNode!=""){
		gridPanel.getTopToolbar().items.get('update').hide(); 
		
	}
	
	//页面初始选中根节点
	var root = guideTree.getRootNode();
	root.select();
	onClick(root);
	
	//指标树事件
	guideTree.on('click', onClick);
	function onClick(node){/*
		if(filterNode!=""||filterNode!=null){
			selectedOrgNode = node;
			if(node.id=="d"){
				propertyValue = "005";
			}
			else{
				propertyValue = node.id;
				refreshGrid();
			}
		}*/

			selectedOrgNode = node;
			propertyValue = node.id;
			refreshGrid();

	}
	
	//刷新树
	function reloadTree() {	
		var tree = Ext.getCmp("guideline_tree")	
		var nodePath = selectedOrgNode.getPath();
		if(selectedOrgNode.parentNode!=null){
			selectedOrgNode.parentNode.reload()	;
		}else{
			selectedOrgNode.reload();
		}
		tree.expandPath(nodePath,null,function(){
			var curNode = tree.getNodeById(selectedOrgNode.id);
			curNode.select()
			onClick(curNode)
		})	
	}	
	
	//****************************************
	
	function insertFun() {
		if (propertyValue =='') {
			Ext.Msg.show({
				title : '提示',
				msg : '请选择子节点！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO

			});
			return;

		}

		//grid.defaultInsertHandler();
		if(filterNode!=""&&filterNode!=null){
		if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:440,
                modal: true,
                closeAction:'hide',
                plain: true,	                
                items: formPanel_km,
                animEl:'action-new'
                });
       		}
       		formPanel=formPanel_km;
       		formPanel_km.getForm().reset();
       		formWindow.show();
		}
		else{
		  if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:440,
                modal: true,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       		}
       		formPanel=formPanelinsert;
       		formPanelinsert.getForm().reset();
       		formWindow.show();
		}
		initAddWindow();

	};
	

	
	function initAddWindow(){
		var form = formPanel.getForm();
		//form.findField("unitId").setValue("10000000000000");
		//form.findField("unitName").setValue("国网公司");
		if(filterNode!=""&&filterNode!=null){
			form.findField("parentid").setValue(propertyValue);
		//form.findField("sxLb").setValue("1");
		form.findField("collectType").setValue("SUM");
		form.findField("ifydfx").setValue("0");
		form.findField("zbTrcc").setValue("1");
		form.findField("state").setValue("1");
		form.findField("ifpercent").setValue("0");
		form.findField("zbZzlx").setValue("1");
		//form.findField("ifpub").setValue("1");
		//form.findField("hqfs").setValue("0");
		}else{
		form.findField("parentid").setValue(propertyValue);
		form.findField("sxLb").setValue("1");
		form.findField("collectType").setValue("SUM");
		form.findField("ifydfx").setValue("0");
		form.findField("zbTrcc").setValue("1");
		form.findField("state").setValue("1");
		form.findField("ifpercent").setValue("0");
		form.findField("zbZzlx").setValue("1");
		form.findField("ifpub").setValue("1");
		form.findField("hqfs").setValue("0");}
		//form.findField("showOrder").setValue();
	}
	
	///////////////修改///////////////////////////////////////////////
	function updateFun(){
		if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
				title : '警告',
				msg : '请选择将要修改的记录！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
	    }
	    if(filterNode!=null||filterNode!=""){
	   	if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:440,
                modal:true,
                closeAction:'hide',
                plain: true,	                
                items: formPanel_km,
                animEl:'action-new'
                });
       	}
       	formPanel=formPanel_km
       }
       	else{   	if(!formWindow){
            formWindow = new Ext.Window({	               
                title:formPanelTitle,
                layout:'fit',
                width:600,
                height:440,
                modal:true,
                closeAction:'hide',
                plain: true,	                
                items: formPanelinsert,
                animEl:'action-new'
                });
       		}
       		formPanel_km=formPanelinsert;
       	}
       	
       	formWindow.show();
       	loadForm();
	}
	
	function loadForm(){
		var form = formPanel.getForm();
    	if (sm.getSelected()!=null){
    		var gridRecod = sm.getSelected()
    		var ids = sm.getSelected().get(primaryKey)
    		guidelineService.getGuidelineInfoByID(ids, function(rtn){
	    		if (rtn == null) {
    				Ext.MessageBox.show({
    					title: '记录不存在！',
    					msg: '未找到需要修改的记录，请刷新后再试！',
    					buttons: Ext.MessageBox.OK,
    					icon: Ext.MessageBox.WARNING
    				});
    				return;
	    		}
	    		var obj = new Object();
	    		for(var i=0; i<Fields.length; i++){
	    			var n = Fields[i].name
	    			obj[n] = rtn[n]
	    		}
	    		var record = new PlantFields(obj)
	    		form.loadRecord(record)
    		})
    	}else{
    		form.loadRecord(new PlantFields(PlantFieldsInt))
    	}  
	}
	///////////////删除////////////////////////////////////////////
	function deleteFun(){
    	if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
				title : '警告',
				msg : '请选择将要修改的记录！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
	    }
	    var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('zbSeqno'));
	    	}
	    	gridPanel.defaultDeleteHandler();
    	}
    }
    //////////////移动//////////////////////////////
    function moveFun(){
    	if(!sm.hasSelection()){
	    	Ext.MessageBox.show({
				title : '警告',
				msg : '请选择将要移动的指标！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
	    }
	    openTreeWin();
    }
    function openTreeWin(){
    	var treeWin = new Ext.Window({
			title:'指标选择',
			width:300,
			height:400,
			autoScroll: true,
			resizable: false,
			plain: true,
			modal: true,
			closeAction:'hide',
			//items: inxTree,
			html:'<iframe name="content1" src="Business/jsp/common/tree/guidelineTree.jsp?model=single" frameborder=0 style="width:100%;height:100%;"></iframe>',
			buttons: [{text:'确定',handler:confirm},{text:'取消',handler:cancel}],
			buttonAlign:'center'
	    });
	    treeWin.show()
	    function confirm() {
	    	var frm = window.frames["content1"]
	    	var zbStr = frm.getSelectZb();
	    	if(zbStr==''){
	    		Ext.Msg.show({
					title : '提示',
					msg : '请选择移动的目标结点！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
	
				});
				return;
	    	}
	    	var records = sm.getSelections();
	    	if (records.length > 0){
		    	var ids = '';
		    	for (var i=0; i<records.length; i++){
		    		ids +="'"+records[i].get('zbSeqno')+"'";
		    		if(i<records.length-1)
		    			ids +=",";
		    	}
		    	DWREngine.setAsync(false);
		   			guidelineService.moveGuidelineInfo(ids,zbStr.split("&&")[0], function(){
		   				Ext.example.msg('移动成功！', '您成功移动了'+records.length+'条信息！');
		   				treeWin.hide();
//		   				refreshGrid();
		   				reloadTree();
			   		});
		   		DWREngine.setAsync(true);
	    	}
	    	treeWin.close()
	    }
	    function cancel() {
	    	treeWin.close()
	    }
    }
    
    //////////////保存///////////////////////////////
    function saveValidate(){
    	var form = formPanel.getForm()
    	form.findField('name').setValue(form.findField('realname').getValue());
    	if(filterNode!=""&&filterNode!=null){
    		formSave();
		}else{
    		var unitField = form.findField('unitId')
	    	if(unitField.getValue()!=null&&unitField.getValue()!=''){//
	    		Ext.Msg.show({
					title: '提示',
					msg: '如果上级节点的所属单位比本指标的所属单位小，<br>将会被设置成本指标的所属单位，<br>您同意吗?',
					buttons: Ext.Msg.YESNO,
					fn: function(value){
						if ("yes" == value)
							formSave(); 
					},
					icon: Ext.MessageBox.QUESTION
				});
	    	}else{
	    		formSave(); 
    		}
    	}
    	return false;
    }
    
    function formSave() {
		var form = formPanel.getForm()
		if (form.isValid()) {
			doFormSave(true)
		}
	}
	
	function doFormSave(dataArr){
    	var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Fields.length; i++) {
    		var n = Fields[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if(filterNode != null && filterNode != ""){
    		//工资科目中判断指标名称是否存在
    		var flag;
    		guidelineService.checkRealName(obj.realname,filterNode,function(str){
    			flag = str;
    		});
    	}
		if(flag == '1'){
			Ext.example.msg('保存失败！', '指标名称已经存在，请编辑后保存！');
			form.findField('realname').markInvalid("指标名称已经存在!");
    		return;
		}
    	if (obj.zbSeqno == '' || obj.zbSeqno == null){
	   		guidelineService.addGuidelineInfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
	   				Ext.Msg.show({
					   title: '提示',
					   msg: '是否继续新增?',
					   buttons: Ext.Msg.YESNO,
					   fn: processResult,
					   icon: Ext.MessageBox.QUESTION
					});
	   		});
   		}else{
   			guidelineService.saveGuidelineInfo(obj, function(){
	   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
	   				formWindow.hide();
//	   				refreshGrid();
	   				reloadTree();
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	if ("yes" == value){
//    		refreshGrid();
    		reloadTree();
    		formPanel.getForm().reset();
	    	initAddWindow();
    	}else{
    		formWindow.hide();
//    		refreshGrid();
    		reloadTree();
    	}
    }
   
    
    function setAllFormulaFun(){
    	guidelineService.setAllGuidelineFormula(function(rtn){
    		if(rtn==true){
    			Ext.example.msg('保存成功！', '批量设置公式成功！');
    		}
    	})
    }
    
    function setNameFormulorFun(value,o, record,i){
    	if(filterNode!=""){
    		return value;
    	}
    	var str = value
    	if(record.get("jldw") !=""){
   			 str = "<font color='blue' ><u onclick=formulaMenuFun('" +  record.get('zbSeqno') + "') style='cursor:hand' title='设置公式'>"+value+"</U></font>";
		} 
		return str;
	}
	if(filterNode!=""&&filterNode!=null){
		var ds = gridPanel.getStore();
		ds.baseParams.params = propertyName+SPLITB+"005";
    	ds.load({
			params : {
				start : 0, // 起始序号
				limit : PAGE_SIZE
			// 结束序号，若不分页可不用设置这两个参数
			}
		});
		
	}

});
	
	function refreshGrid(){
		var ds = gridPanel.getStore();
    	ds.baseParams.params = propertyName+SPLITB+propertyValue;
    	ds.load({
			params : {
				start : 0, // 起始序号
				limit : PAGE_SIZE
			// 结束序号，若不分页可不用设置这两个参数
			}
		});
	}
	
 //////////设置公式////////////////////////////
    function formulaMenuFun(value){
    	curZbSeqno = value;

    	formulaWindow = new Ext.Window({	               
	        title:'设置公式',
	        layout:'fit',
	        width:600,
	        height:350,
	        modal: true,
	        closeAction:'hide',
	        plain: true,	                
	        items: formulaPanel,
	        animEl:'action-new'
		});
		formulaWindow.show();
		refreshFormulaGrid()
    }