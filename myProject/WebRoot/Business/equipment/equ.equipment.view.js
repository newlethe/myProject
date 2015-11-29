var bean = "com.sgepit.pmis.equipment.hbm.GetEquInfoV";
var beanPart = "com.sgepit.pmis.equipment.hbm.GetEquPartV";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "equid";
var orderColumn = "equid";
var equTypes = new Array();
var selectedEquId = "";
var bodyPanelTitle = "设备到货综合查询";
var areaTypes = [['0', '国产'],['1', '进口']];
var ds;
var data = new Array();
var macTypes = new Array();
var equids;

Ext.onReady(function(){
	
	DWREngine.setAsync(false); 
	appMgm.getCodeValue('设备类型',function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].codekey);		
			temp.push(list[i].codevalue);	
			equTypes.push(temp);
		}
    });
    appMgm.getCodeValue("机组号",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].codekey);		
			temp.push(list[i].codevalue);	
			macTypes.push(temp);
		}
    });
	DWREngine.setAsync(true);
	
	var dsEquType = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: equTypes
	});
	
	var dsArea = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: areaTypes
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
		}, 'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
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
		}, 'equid': {
			name: 'equid',
			fieldLabel: '设备主键',
			readOnly: true,
			hidden: true,
			allowBlank: false,
			hideLabel: true,
			anchor: '95%'
		}, 'equName': {
			name: 'equName',
			fieldLabel: '设备名称',
			anchor:'95%'
		}, 'equNum': {
			name: 'equNum',
			fieldLabel: '数量',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
		}, 'manufacturer': {
			name: 'manufacturer',
			fieldLabel: '制造商',
			anchor:'95%'
		}, 'producArea': {
			name: 'producArea',
			fieldLabel: '原产地',
			anchor:'95%'
		}, 'price': {
			name: 'price',
			fieldLabel: '出厂价格',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}, 'totalPrice': {
			name: 'totalPrice',
			fieldLabel: '交货总价',
			allowNegative: false,
            maxValue: 100000000,
			anchor:'95%'
		}
	};
	
	var Columns = [
		{name: 'conid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'bdgid', type: 'string'},
		{name: 'equid', type: 'string'},
		{name: 'equName', type: 'string'},
		{name: 'equNum', type: 'float'},
		{name: 'unit', type: 'string'},
		{name: 'manufacturer', type: 'string'},
		{name: 'producArea', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'totalPrice', type: 'float'}
	];
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'bdgid',
			header: fc['bdgid'].fieldLabel,
			dataIndex: fc['bdgid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'equid',
			header: fc['equid'].fieldLabel,
			dataIndex: fc['equid'].name,
			hidden: true,
			width: 100
		}, {
			id: 'equName',
			header: fc['equName'].fieldLabel,
			dataIndex: fc['equName'].name,
			width: 200
		}, {
			id: 'equNum',
			header: fc['equNum'].fieldLabel,
			dataIndex: fc['equNum'].name,
			width: 50
		}, {
			id: 'unit',
			header: fc['unit'].fieldLabel,
			dataIndex: fc['unit'].name,
			width: 80
		}, {
			id: 'manufacturer',
			header: fc['manufacturer'].fieldLabel,
			dataIndex: fc['manufacturer'].name,
			width: 200
		}, {
			id: 'producArea',
			header: fc['producArea'].fieldLabel,
			dataIndex: fc['producArea'].name,
			width: 80
		}, {
			id: 'price',
			header: fc['price'].fieldLabel,
			dataIndex: fc['price'].name,
			width: 100,
			align: 'right',
			renderer: cnMoney
		}, {
			id: 'totalPrice',
			header: fc['totalPrice'].fieldLabel,
			dataIndex: fc['totalPrice'].name,
			width: 100,
			align: 'right',
			renderer: cnMoney
		}
	]);
	cm.defaultSortable = true;
	
    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
	    	params: "equid in "+equids
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
    
	gridPanel = new Ext.grid.GridPanel({
    	id: 'cat-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [
        	new Ext.Button({
        		text: "<font color=#15428b><b>&nbsp;到货设备</b></font>", 
        		iconCls: 'form'
        	})/*, '->', comboxWithTree, '-', selectEquInfo*/],
        iconCls: 'icon-by-category',
        border: false,
        region: 'center',
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
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	sm.on('selectionchange', catGridRowSelected);
	////////////////////////////////////////////////////////////////////////
	
	var ColumnsPart = [
		{name: 'partid', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'partName', type: 'string'},
		{name: 'spec', type: 'string'},
		{name: 'partNum', type: 'float'},
		{name: 'manufacturer', type: 'string'},
		{name: 'producArea', type: 'string'},
		{name: 'price', type: 'float'},
		{name: 'totalPrice', type: 'float'},
		{name: 'equid', type: 'string'},
		{name: 'unit', type: 'string'},
		{name: 'ggNum', type: 'float'},
		{name: 'machineNo', type: 'string'},
		{name: 'ggDate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
	];
	
	var smPart = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	cmPart = new Ext.grid.ColumnModel([
		smPart, {
			id: 'pid',
			header: '工程项目编号',
			dataIndex: 'pid',
			hidden: true,
			width: 100
		}, {
			id: 'equid',
			header: '设备ID',
			dataIndex: 'equid',
			hidden: true,
			width: 100
		}, {
			id: 'partid',
			header: '部件ID',
			dataIndex: 'partId',
			hidden: true,
			width: 100
		}, {
			id: 'partName',
			header: '部件名称',
			dataIndex: 'partName',
			width: 200
		}, {
			id: 'spec',
			header: '型号与规格',
			dataIndex: 'spec',
			width: 100
		}, {
			id: 'manufacturer',
			header: '制造商',
			dataIndex: 'manufacturer',
			width: 100
		}, {
			id: 'producArea',
			header: '原产地',
			dataIndex: 'producArea',
			width: 80,
			renderer: function(value){
				for (var i=0; i<areaTypes.length; i++){
					if (value == areaTypes[i][0]) return areaTypes[i][1];
				}
			}
		}, {
			id: 'unit',
			header: '单位',
			dataIndex: 'unit',
			width: 80
		}, {
			id: 'partNum',
			header: '数量',
			dataIndex: 'partNum',
			width: 50
		}, {
			id: 'price',
			header: '单价',
			dataIndex: 'price',
			width: 100,
			align: 'right',
			renderer: cnMoney
		}, {
			id: 'totalPrice',
			header: '现场交货总价',
			dataIndex: 'totalPrice',
			width: 100,
			align: 'right',
			renderer: cnMoney
		}, {
			id: 'machineNo',
			header: '机组号',
			dataIndex: 'machineNo',
			width: 100,
			renderer: function(value){
				for (var i=0; i<macTypes.length; i++){
					if (value == macTypes[i][0]) return macTypes[i][1];
				}
			}
		}, {
			id: 'ggNum',
			header: '到货数量',
			dataIndex: 'ggNum',
			width: 80
		}, {
			id: 'ggDate',
			header: '到货日期',
			dataIndex: 'ggDate',
			width: 80,
			renderer: formatDate
		}
	]);
	cmPart.defaultSortable = true;
	
    dsPart = new Ext.data.Store({
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
            id: 'partid'
        }, ColumnsPart),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');

    var btnGridTitle = new Ext.Button({
    	text: "<font color=#15428b><b>&nbsp;到货部件</b></font>", 
    	iconCls: 'form'
    });
    
	var gridPanelPart = new Ext.grid.GridPanel({
    	id: 'code-grid-panel',
        ds: dsPart,
        cm: cmPart,
        sm: smPart,
        tbar: [btnGridTitle],
        iconCls: 'icon-by-category',
        border: false, 
        height: 350,
        minSize: 2,
        region: 'south',
        header: false,
        autoScroll: true,
        split: true,
        collapsed: false,
        collapsible: true,
        animCollapse: false,
    	collapseMode: 'mini',
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsPart,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
		iconCls: 'title'
	})
	
	var contentPanel = new Ext.Panel({
        id: 'main-panel',
//		tbar: [titleBar],
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
    	params: {
	    	start: 0,
	    	limit: PAGE_SIZE
	    }
	});
    
    function catGridRowSelected(obj){
    	var record = sm.getSelected();
    	if (record == null || (record.get("equid")=="")) {
    		if (selectedEquId != ""){
	    		selectedEquId = "";
    		}
    	} else {
    		if (selectedEquId != record.get("equid")) {
	    		selectedEquId = record.get("equid")
	    		var g_equName = record.get('equName');
	    		btnGridTitle.setText("<font color=#15428b><b>&nbsp;"+g_equName+" 到货部件</b></font>");
    		}
    	}
    	if (selectedEquId != "" && obj != null && !gridPanelPart.collapsed){
    		dsPart.baseParams.params = "equid = '"+selectedEquId+"'";
    		dsPart.load({
    			params: {
	    			start: 0,
	    			limit: 5
    			}
	    	})
    	}
    }
    
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
});
