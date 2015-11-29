var bean = "com.sgepit.pmis.budget.hbm.ConCompletion";
var beanPart = "com.sgepit.pmis.budget.hbm.ConCompletionSub";
var business = "baseMgm";
var listMethod = "findByProperty";
var primaryKey = "concomid";
var orderColumn = "concomid";
var propertyName = "conid";
var propertyValue = selectedConId;
var SPLITB = "`";
var selectedConcomId = "";
var bodyPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo + " - 合同投资完成";

Ext.onReady(function(){
	
	var btnInit = new Ext.Button({
		name: 'initial',
           text: '初始化',
           iconCls: 'copyUser',
           handler: initial
	});
	
	var fm = Ext.form;
	
	var fc = {
		'conid': {
			name: 'conid',
			fieldLabel: '合同内部流水号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'concomid': {
			name: 'concomid',
			fieldLabel: '合同投资完成主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'month': {
			name: 'month',
			fieldLabel: '年月份',
			format: 'Y-m',
           	minValue: '2000-01-01',
			anchor:'95%'
		}, 'summoney': {
			name: 'summoney',
			fieldLabel: '总金额',
			allowNegative: false,
            renderer: cnMoney,
			anchor:'95%'
		}, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			anchor:'95%'
		}
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'concomid', type: 'string'},
		{name: 'month', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'summoney', type: 'float'},
		{name: 'billstate', type: 'string'},
		{name: 'remark', type: 'string'}
	];
	
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		conid: selectedConId,
		concomid: '',
		//month: '',
		summoney: 0,
		billstate: '',
		remark: ''
	};
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'concomid',
			header: fc['concomid'].fieldLabel,
			dataIndex: fc['concomid'].name,
			hidden: true,
			width: 100
		}, {
            id: 'month',
            header: fc['month'].fieldLabel,
            dataIndex: fc['month'].name,
            width: 100,
            renderer: formatDate,
            editor: new fm.DateField(fc['month'])
        }, {
            id: 'summoney',
            header: fc['summoney'].fieldLabel,
            dataIndex: fc['summoney'].name,
            width: 120,
            editor: new fm.NumberField(fc['summoney'])
        }, {
			id: 'billstate',
			header: fc['billstate'].fieldLabel,
			dataIndex: fc['billstate'].name,
			width: 100,
			editor: new fm.TextField(fc['billstate'])
		}, {
			id: 'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width: 200,
			editor: new fm.TextField(fc['remark'])
		}
	]);
	cm.defaultSortable = true;
	
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: propertyName+SPLITB+propertyValue
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [new Ext.Button({text: "<font color=#15428b><b>&nbsp;合同投资完成 - 主表</b></font>", iconCls: 'form'})],
        iconCls: 'icon-by-category',
        border: false,
        region: 'center',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	saveHandler: saveFun,
      	deleteHandler: deleteFun
	});
	
	sm.on('selectionchange', catGridRowSelected);
	////////////////////////////////////////////////////////////////////////
	
	var fcPart = {
		'concomid': {
			name: 'concomid',
			fieldLabel: '合同投资完成主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'concomsubid': {
			name: 'concomsubid',
			fieldLabel: '主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			anchor:'95%'
		}, 'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			allowNegative: false,
            maxValue: 100000000000,
			anchor:'95%'
		}, 'totalmoney': {
			name: 'totalmoney',
			fieldLabel: '累计投资金额',
			allowNegative: false,
            maxValue: 100000000000,
			anchor:'95%'
		}, 'totalpercent': {
			name: 'totalpercent',
			fieldLabel: '累计百分比',
			anchor:'95%'
		}, 'currentmoney': {
			name: 'currentmoney',
			fieldLabel: '当月投资完成金额',
			allowNegative: false,
            maxValue: 100000000000,
			anchor:'95%'
		}
	};
	
	var ColumnsPart = [
		{name: 'concomid', type: 'string'},
		{name: 'concomsubid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'bdgmoney', type: 'float'},
		{name: 'totalmoney', type: 'float'},
		{name: 'totalpercent', type: 'string'},
		{name: 'currentmoney', type: 'float'}
	];
	
	var PlantPart = Ext.data.Record.create(ColumnsPart);
	var PlantIntPart = {
		concomid: '',
		concomsubid: '',
		bdgid: '',
		bdgname: '',
		bdgmoney: 0,
		totalmoney: 0,
		totalpercent: '',
		currentmoney: 0
	};
	
	var smPart = new Ext.grid.CheckboxSelectionModel();
	var cmPart = new Ext.grid.ColumnModel([
		smPart, {
			id: 'concomid',
			header: fcPart['concomid'].fieldLabel,
			dataIndex: fcPart['concomid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'concomsubid',
			header: fcPart['concomsubid'].fieldLabel,
			dataIndex: fcPart['concomsubid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'bdgid',
			header: fcPart['bdgid'].fieldLabel,
			dataIndex: fcPart['bdgid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'bdgname',
			header: fcPart['bdgname'].fieldLabel,
			dataIndex: fcPart['bdgname'].name,
			width: 200
		}, {
			id: 'bdgmoney',
			header: fcPart['bdgmoney'].fieldLabel,
			dataIndex: fcPart['bdgmoney'].name,
			renderer: cnMoney,
			width: 100
		}, {
			id: 'totalmoney',
			header: fcPart['totalmoney'].fieldLabel,
			dataIndex: fcPart['totalmoney'].name,
			width: 100,
			renderer: cnMoney
		}, {
			id: 'totalpercent',
			header: fcPart['totalpercent'].fieldLabel,
			dataIndex: fcPart['totalpercent'].name,
			width: 80,
			renderer: function(value){ return value + '%'; }
		}, {
			id: 'currentmoney',
			header: fcPart['currentmoney'].fieldLabel,
			dataIndex: fcPart['currentmoney'].name,
			width: 100,
			renderer: cnMoney,
			editor: new fm.NumberField(fcPart['currentmoney'])
		}
	]);
	cmPart.defaultSortable = true;
	
    var dsPart = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanPart,				
	    	business: business,
	    	method: listMethod
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'concomsubid'
        }, ColumnsPart),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    dsPart.setDefaultSort('concomsubid', 'asc');

    var btnGridTitle = new Ext.Button({
    	text: "<font color=#15428b><b>&nbsp;合同投资完成 - 从表</b></font>", 
    	iconCls: 'form'
    });
    
	var gridPanelPart = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panel',
        ds: dsPart,
        cm: cmPart,
        sm: smPart,
        tbar: [btnGridTitle],
        iconCls: 'icon-by-category',
        border: false, 
        height: 360,
        minSize: 2,
        region: 'south',
        clicksToEdit: 2,
        header: false,
        autoScroll: true,
        split: true,
        collapsed: false,
        collapsible: true,
        //animCollapse: false,
    	//collapseMode: 'mini',
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsPart,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: PlantPart,				
      	plantInt: PlantIntPart,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanPart,					
      	business: "baseMgm",	
      	primaryKey: 'concomsubid',		
      	saveHandler: saveFunPart,
      	deleteHandler: deleteFunPart
	});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
		iconCls: 'title'
	})
	
	var contentPanel = new Ext.Panel({
        id: 'main-panel',
		tbar: [titleBar],
        border: false,
        region: 'center',
        split: true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[gridPanel, gridPanelPart]
    });	
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [contentPanel]
    });
    
    ds.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
    
    gridPanel.getTopToolbar().add('->', btnInit);
    
    with(gridPanelPart.getTopToolbar().items){
    	get('add').setVisible(false);
    	get('del').setVisible(false);
    }
    
    function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	if (!record) return;
    	selectedConcomId = record.get('concomid');
    	if (selectedConcomId != ""){
    		dsPart.baseParams.params = "concomid"+SPLITB+selectedConcomId;
		    dsPart.load({
		    	params:{
			    	start: 0,
			    	limit: PAGE_SIZE
		    	}
		    });
    	}
    }
    
	function insertFun(){
    	gridPanel.defaultInsertHandler();
    }
    
    function saveFun(){
    	if (fnValidate()){
    		gridPanel.defaultSaveHandler();
    	}
    }
    
    function deleteFun(){
    	var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('concomid'));
	    	}
	    	conCompletionMgm.checkDelete(ids, function(msg){
	    		if ("" == msg){
	    			gridPanel.defaultDeleteHandler();
	    		}else{
		    		Ext.Msg.show({
						title: '提示',
						msg: msg,
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	    		}
	    	});
    	}
    }
    
    function formatDate(value){
		return value ? value.dateFormat('Y-m') : '';
    };
    
    function saveFunPart(){
    	var record = sm.getSelected();
    	var records = dsPart.getModifiedRecords();
    	var flag = true;
    	if (record && records.length > 0){
	    	for (var i = 0; i < records.length; i++) {
	    		var row = records[i];
	    		var bdgM = row.get('bdgmoney');
    			var totalM;
    			var currentM = row.get('currentmoney');
	    		DWREngine.setAsync(false);
	    		conCompletionMgm.setTotalMoney(selectedConId, row.get('bdgid'), record.get('month').dateFormat('Y-m-d'), function(list){
	    			totalM = list[0].TOTAL;
	    		});
	    		DWREngine.setAsync(true);
    			row.set('totalmoney', totalM);
    			row.set('totalpercent', totalM/bdgM*100);
    			if ((totalM + currentM) > bdgM){
    				Ext.Msg.show({
						title: "提示",
						msg: "概算名称为: "+ row.get('bdgname') +"<br>[累计投资金额] + [当月投资完成金额] > [概算金额]",
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.WARNING
    				})
    			}
	    	}
    	}
    	gridPanelPart.defaultSaveHandler();
    }
    
    function deleteFunPart(){
    	gridPanelPart.defaultDeleteHandler(); 
    }
    
    function initial(){
    	var record = sm.getSelected();
    	if (!record) return;
    	Ext.Msg.show({
			title: '提示',
			msg: '是否要初始化?　　　　',
			buttons: Ext.Msg.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: function(value){
				if ("yes" == value){
			    	var record = sm.getSelected();
			    	var concomid = record.get('concomid');
			    	Ext.get('loading-mask').show();
					Ext.get('loading').show();
			    	conCompletionMgm.initConCompletionSub(propertyValue, concomid, function(){
				    	dsPart.baseParams.params = "concomid"+SPLITB+concomid;
				    	dsPart.load({
					    	params:{
						    	start: 0,
						    	limit: PAGE_SIZE
					    	}
					    })
			    	});
			    	Ext.get('loading-mask').hide();
					Ext.get('loading').hide();
				}
			}
		})
    }
    
    function fnValidate(){
   		var flag = true;
   		var editRecords = ds.getModifiedRecords();
    	for (var i = 0; i < editRecords.length; i++) {
    		var record = editRecords[i];
    		var f_month = record.get('month');
    		if ("" == f_month){
    			Ext.example.msg('提示', '必填项：月份 未填写！');
    			flag = false;
    		}
    	}
    	return flag;
   	}
})