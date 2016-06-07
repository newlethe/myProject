var gridPanel
var bean = "com.sgepit.frame.sysman.hbm.SgccDeptSplit";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var primaryKey = "splitId";
var orderColumn = "unitId,deptId";

var listWhere =  "unitId='" + unitId+ "'"

Ext.onReady(function() {
	
	var typeArr = new Array();
	DWREngine.setAsync(false);	
	systemMgm.getCodeValue("专项分解", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			typeArr.push(temp);
		}
	});	
    DWREngine.setAsync(true);
    
	var fm = Ext.form;

	var fc = { // 创建编辑域配置
		'splitId' : {
			name : 'splitId',
			fieldLabel : '主键',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		}, 
		'unitId': {
			name: 'unitId',
			fieldLabel: '单位',
            allowBlank: false,
			anchor:'95%'
        },
		'deptId' : {
			name : 'deptId',
			fieldLabel : '部门',
			allowBlank : false,
			anchor : '95%'
		},
		'splitType' : {
			name : 'splitType',
			fieldLabel : '类型',
			allowBlank : false,
			anchor : '95%'
		}
	}
	
	var unitStore = new Ext.data.SimpleStore({
		fields: ['val', 'txt']
	})
	var typeStore = new Ext.data.SimpleStore({
		fields: ['val', 'txt'],
		data: typeArr
	})
	
	var unitCom = new fm.ComboBox({
        name: 'deptId',	fieldLabel: '部门',	allowBlank : true,	emptyText : '请选择...',
		valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
        store: unitStore
    })
    unitCom.on('beforequery',getDeptName)
    
    var sql1 = "select unitid , unitname from sgcc_ini_unit t where t.upunit = '"+unitId+"' "
    		+ "and t.unitid not in (select dept_id from sgcc_dept_split where unit_id = '"+unitId+"')"
    function getDeptName() {
    	db2Json.selectSimpleData(sql1, function(data) {
    		unitStore.loadData(eval(data),false)
		})
    }
    
	var typeCom = new fm.ComboBox({
        name: 'splitType',fieldLabel: '类型',	allowBlank : true,	emptyText : '请选择...',
		valueField: 'val',displayField: 'txt',	mode: 'local',typeAhead: true,triggerAction: 'all',
        store: typeStore
    })

	var Columns = [
		{name : 'splitId',type : 'string'}, 
		{name: 'unitId',type: 'string'},
		{name : 'deptId',type : 'string'}, 
		{name : 'splitType',type : 'string'}];
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		splitId : '',
		unitId : unitId,
		deptId : '',
		splitType : ''
	}

	var sm = new Ext.grid.CheckboxSelectionModel()

	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'splitId',
		header : fc['splitId'].fieldLabel,
		dataIndex : fc['splitId'].name,
		hidden : true,
		width : 200
	}, {
        id:'unitId',
        header: fc['unitId'].fieldLabel,
        dataIndex: fc['unitId'].name,
        width: 160,
        renderer: function(value) {
        	var name = ""
        	DWREngine.setAsync(false); 
        	infoPubService.getUnitName(value,function(data) {
        		name = data
        	})
        	DWREngine.setAsync(true); 
        	return name
        }
     }, {
		id : 'deptId',
		header : fc['deptId'].fieldLabel,
		dataIndex : fc['deptId'].name,
		width : 160,
		renderer: function(value) {
        	var name = ""
        	if(value != "") {
	        	DWREngine.setAsync(false); 
	        	infoPubService.getUnitName(value,function(data) {
	        		name = data
	        	})
	        	DWREngine.setAsync(true); 
        	}
        	return name
        },
		editor : unitCom 
	}, {
		id : 'splitType',
		header : fc['splitType'].fieldLabel,
		dataIndex : fc['splitType'].name,
		width : 160,
		renderer: function(value) {
        	for(var i=0; i<typeArr.length; i++){
           	 	if (value == typeArr[i][0])
           	 		return typeArr[i][1]
           	 }
        },
		editor : typeCom
	}])
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params: listWhere
			
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'position-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		header : false,
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		autoScroll : true,
		collapsible : false,
		animCollapse : false,
		autoExpandColumn : 2,
		loadMask : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
            beforePageText:"第",
	        afterPageText :"页,共{0}页",
            store: ds,
            displayInfo: true,
	        firstText: '第一页',  
	   		prevText: '前一页',  
	        nextText: '后一页',  
	        lastText: '最后一页',  
	        refreshText: '刷新',  
	        displayMsg: '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
            emptyMsg: "无记录。"
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : "baseMgm",
		primaryKey : primaryKey,
		insertHandler: insertFun
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel]
	});

	ds.load({
		params : {
			start : 0, // 起始序号
			limit : PAGE_SIZE
		}
	});
	
	function insertFun(){
    	gridPanel.defaultInsertHandler()
    }
	
});