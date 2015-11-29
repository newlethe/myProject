var bean = "com.hdkj.webpmis.domain.ConInvested.CorpCompletion";
var beanPart = "com.hdkj.webpmis.domain.ConInvested.CorpCompletionSub";
var business = "baseMgm";
var formWindow;
var listMethod = "findWhereOrderBy";
var primaryKey = "corpinvesteid";
var orderColumn = "month";
var propertyName = "corpinvesteid";
var propertyValue = "";
var SPLITB = "`";
var equTypes = new Array();
var selectedEquId = "";
var bodyPanelTitle = "法人管理费投资完成";
var dsPartti
var sm;


Ext.onReady(function(){
	
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'btn',
		handler: popWinwdow
		
	});
	
	var fm = Ext.form;

	var fc = {
		'corpinvesteid': {
			name: 'corpinvesteid',
			fieldLabel: '法人管理费投资完成编号',
			ancher: '95%',
			readOnly: true,
			hidden: true,
			hideLabel: true
		}, 'month': {
			name: 'month',
			fieldLabel: '年月份',
            format: 'Y-m',
            //minValue: '2000-01',
			anchor:'95%'
		}, 'investemoney': {
			name: 'investemoney',
			fieldLabel: '投资完成金额',
			allowNegative: false,
			//maxValue: 100000000,
			anchor: '95%'
		}, 'investremark': {
			name: 'investremark',
			fieldLabel: '法人管理费投资完成备注',
			anchor:'95%'
		}
	};
	var Columns = [
		{name: 'corpinvesteid', type: 'string'},
		{name: 'month', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'investemoney', type: 'float'},
		{name: 'investremark', type: 'string'}
		
	];
	
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		investemoney: 0,
		investremark: ''
	};
	
    sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'corpinvesteid',
			header: fc['corpinvesteid'].fieldLabel,
			dataIndex: fc['corpinvesteid'].name,
			hidden: true,
			width: 150
		}, {
			id: 'month',
			header: fc['month'].fieldLabel,
			dataIndex: fc['month'].name,
			width: 150,
			renderer: formatDate,
            editor: new fm.DateField(fc['month'])
		}, {
			id: 'investemoney',
			header: fc['investemoney'].fieldLabel,
			dataIndex: fc['investemoney'].name,
			width: 150,
			renderer: cnMoney
		}, {
			id: 'investremark',
			header: fc['investremark'].fieldLabel,
			dataIndex: fc['investremark'].name,
			width: 200,
			editor: new fm.TextField(fc['investremark'])
		}
	]);
	cm.defaultSortable = true;
	
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: null//propertyName+SPLITB+propertyValue
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
        tbar: ['<font color=#15428b><b>&nbsp;法人管理费投资完成</b></font>','-'],
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
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
//		saveHandler: saveFun,
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey,		
      	insertHandler: insertFun,
      	deleteHandler: deleteFun
	});
	
	sm.on('selectionchange', catGridRowSelected);
	////////////////////////////////////////////////////////////////////////
	
	var fcPart = {
		'subcorpinvesteid': {
			name: 'subcorpinvesteid',
			fieldLabel: '投资完成编号',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'corpinvesteid': {
			name: 'corpinvesteid',
			fieldLabel: '投资完成编号从表',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'bdgname': {
			name: 'bdgname',
			fieldLabel: '概算名称',
			anchor: '95%'
		}, 'bdgmoney': {
			name: 'bdgmoney',
			fieldLabel: '概算金额',
			allowNegative: false,
			//maxValue: 100000000,
			anchor:'95%'
		}, 'totalmoney': {
			name: 'totalmoney',
			fieldLabel: '累计投资金额',
			allowNegative: false,
            //maxValue: 100000000,
			anchor:'95%'
		}, 'totalpercent': {
			name: 'totalpercent',
			fieldLabel: '累计百分比',
			anchor:'95%'
		}, 'remainder': {
			name: 'remainder',
			fieldLabel: '差额',
			allowNegative: false,
			anchor:'95%'
		}, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			anchor:'95%'
		}, 'currentmoney': {
			name: 'currentmoney',
			fieldLabel: '当月投资完成金额',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}
	};
	
	var ColumnsPart = [
		{name: 'subcorpinvesteid', type: 'string'},
		{name: 'corpinvesteid', type: 'string'},
		{name: 'bdgname', type: 'string'},
		{name: 'bdgmoney', type: 'float'},
		{name: 'totalmoney', type: 'float'},
		{name: 'remainder', type: 'float'},
		{name: 'totalpercent', type: 'float'},
		{name: 'bdgid', type: 'string'},
		{name: 'currentmoney', type: 'float'}
		
	];
	
	var PlantPart = Ext.data.Record.create(ColumnsPart);
	var PlantIntPart = {
		subcorpinvesteid:'',
		corpinvesteid:'',
		bdgname:'',
		bdgid: '',
		bdgmoney:0,
		totalmoney:0,
		//totalpercent:0,
		currentmoney:0
		
	};
	
	var smPart = new Ext.grid.CheckboxSelectionModel();
	var cmPart = new Ext.grid.ColumnModel([
		smPart, {
			id: 'subcorpinvesteid',
			header: fcPart['subcorpinvesteid'].fieldLabel,
			dataIndex: fcPart['subcorpinvesteid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'corpinvesteid',
			header: fcPart['corpinvesteid'].fieldLabel,
			dataIndex: fcPart['corpinvesteid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'bdgname',
			header: fcPart['bdgname'].fieldLabel,
			dataIndex: fcPart['bdgname'].name,
			width: 150,
			editor: new fm.TextField(fcPart['bdgname'])
		}, {
			id: 'bdgmoney',
			header: fcPart['bdgmoney'].fieldLabel,
			dataIndex: fcPart['bdgmoney'].name,
			width: 150,
			align: 'right',
			renderer: cnMoney
		}, {
			id: 'totalmoney',
			header: fcPart['totalmoney'].fieldLabel,
			dataIndex: fcPart['totalmoney'].name,
			width: 150,
			align: 'right',
			renderer: cnMoney
		}, {
			id: 'totalpercent',
			header: fcPart['totalpercent'].fieldLabel,
			dataIndex: fcPart['totalpercent'].name,
			width: 150,
			align: 'right',
			renderer: totalp
		}, {
			id: 'remainder',
			header: fcPart['remainder'].fieldLabel,
			dataIndex: fcPart['remainder'].name,
			width: 150,
			align: 'right',
			renderer: function(value,cellmeta,record){
				var str
				var remainder = record.get('bdgmoney')-record.get('totalmoney')-record.get('currentmoney')
				return cnMoney(remainder);
			}
		}, {
			id: 'bdgid',
			header: fcPart['bdgid'].fieldLabel,
			dataIndex: fcPart['bdgid'].name,
			whidden: true
		}, {
			id: 'currentmoney',
			header: fcPart['currentmoney'].fieldLabel,
			dataIndex: fcPart['currentmoney'].name,
			width: 150,
			align: 'right',
			renderer: cnMoney,
			editor: new fm.NumberField(fcPart['currentmoney'])
		}
	]);
	cmPart.defaultSortable = true;
	
    dsPart = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanPart,				
	    	business: business,
	    	method: "findByProperty",
	    	params: null
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'subcorpinvesteid'
        }, ColumnsPart),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    dsPart.setDefaultSort('subcorpinvesteid', 'asc');

    var btnGridTitle = new Ext.Toolbar.TextItem("<font color=#15428b><b>&nbsp;详细信息</b></font>");
    
	var gridPanelPart = new Ext.grid.EditorGridTbarPanel({
    	id: 'code-grid-panel',
        ds: dsPart,
        cm: cmPart,
        sm: smPart,
        tbar: [btnGridTitle,'-'],
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
        // expend properties
        plant: PlantPart,				
      	plantInt: PlantIntPart,			
      	servletUrl: MAIN_SERVLET,		
      	bean: beanPart,					
      	business: "baseMgm",	
      	primaryKey: 'subcorpinvesteid',		
      	insertHandler: insertFunPart,//popWinwdow,//insertFunPart,
      	saveHandler: saveFunPart,
      	deleteHandler: deleteFunPart,
      	crudText: {add: '选择概算'}
	});
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
		iconCls: 'title'
	})
	
	var contentPanel = new Ext.Panel({
        id: 'main-panel',
		tbar: [],
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
    dsPart.load();
    
   
    function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	if (record == null || (record.get("corpinvesteid")=="")) {
    		if (selectedEquId != ""){
	    		selectedEquId = "";
    		}
    	} else {
    		if (selectedEquId != record.get("corpinvesteid")) {
	    		selectedEquId = record.get("corpinvesteid")
	    		PlantIntPart.corpinvesteid = selectedEquId;
	    		var g_equName = record.get('month');
//	    		if(g_equName){
//	    			var str = "<font color=#15428b><b>&nbsp;明细</b></font>";
//	    		  	btnGridTitle.setText("<font color=#15428b><b>&nbsp;"+g_equName.dateFormat('Y-m')+" 明细</b></font>");
//    		
//	    			}
	    		}
    		
    	}
    	if (selectedEquId != "" && obj != null && !gridPanelPart.collapsed){
    		dsPart.baseParams.params = "corpinvesteid"+SPLITB+selectedEquId
	    	dsPart.load();
    	}
    }
    
	function insertFun(){
    	gridPanel.defaultInsertHandler();
    }
    
//    function saveFun(){
//    	var records = dsSub.getModifiedRecords();
//    	var ids = new Array();
//    	var bdgid = new Array();
//    	var money = new Array();
//    	var month = records[0].get('month').dateFormat('Y-m');
//    	
//    	for (var i=0; i<records.length; i++){
//    		ids[i] = records[i].get('subcorpinvesteid');
//    		bdgid[i] =  records[i].get('subcorpinvesteid');
//    		money[i] = records[i].get('currentmoney');
//    	}
//    	subcorpMgm.reCalculate(ids,money,month);
//    }
    
    function deleteFun(){
    	var records = sm.getSelections();
    	if (records.length > 0){
	    	var ids = new Array();
	    	for (var i=0; i<records.length; i++){
	    		ids.push(records[i].get('corpinvesteid'));
	    	}
	    	
	    	///////////////////
	    	corpInvMgm.checkDelete(ids, function(msg){
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
  
     function popWinwdow(){  	
     	var record=sm.getSelected();
     	//var recordpart=smPart.getSelected();
     	if(record){
     		g_corpbasicid=record.get("corpinvesteid");
	     	//g_subcorpinvesteid=recordpart.get("subcorpinvesteid");
	     	if(!formWindow){
	          formWindow = new Ext.Window({	               
	              //title:'qqqq',
	              layout:'fit',
	              border : false,
	              width:800,
	              height:400,
	              closeAction:'hide',
	              items:treePanel
	              });   
	     	}
	     	formWindow.show();
	     	root.reload();
	     	//treePanel.expandAll();
	     	//treePanel.render();
     	}
   	}
    function insertFunPart(){
    	//gridPanelPart.defaultInsertHandler();
    	popWinwdow();
    }
    
     function saveFunPart(){
    	var records = dsPart.getModifiedRecords();
    	var re=smPart.getSelected();
    	var record = sm.getSelected();
    	var selectedid=record.get('corpinvesteid');
    	var totalM;
    	for (var i=0; i<records.length; i++){
    		var row = records[i];
    		var currenprice = records[i].get('currentmoney');
    	}
		var summoney = dsPart.sum('currentmoney');
	    record.set('investemoney',summoney);
		
    	var ids = new Array();
    	var bdgid = new Array();
    	var money = new Array();
    	var month = sm.getSelected().get('month').dateFormat('Y-m-d');
    	for (var i=0; i<records.length; i++){
    		ids[i] = records[i].get('subcorpinvesteid');
    		bdgid[i] =  records[i].get('bdgid');
    		money[i] = records[i].get('currentmoney');
    	}
    	
    	gridPanel.defaultSaveHandler();
    	gridPanelPart.defaultSaveHandler()
    	DWREngine.setAsync(false)
    	subcorpMgm.reCalculate(ids, bdgid, money, month);
    	DWREngine.setAsync(true)
    	dsPart.load();
    }
    function deleteFunPart(){
    	var record = sm.getSelected();
    	var summoney = dsPart.sum('currentmoney');
	    record.set('investemoney',summoney);
    	gridPanelPart.defaultDeleteHandler(); 
	    gridPanel.defaultSaveHandler();
	    dsPart.load();
    }
    function totalp(value){
    	var prent=parseInt(value*10000)/100
        return prent+"%"//Math.round(value*1000)/1000*100+"%"
    	
    }
     function formatDate(value){
        var o = value ? value.dateFormat('Y-m') : '';
        return o;
    };
     function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m') : value;
     	  //return (value && value instanceof Date) ? value.dateFormat('Y') : value;
    };

})