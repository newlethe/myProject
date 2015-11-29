var parentGridPanel;
var parentBean = "com.sgepit.frame.example.hbm.ExampleParenttable";
var parentPrimaryKey = "lsh";
var parentGridPanelTitle = "系统框架应用示例";
var ds;
var sm;
var PlantInt;
var currentParentLsh;
Ext.onReady(function() {
		var fm = Ext.form; // 包名简写（缩写）
		var fc = { // 创建编辑域配置
		'lsh' : {
			name : 'lsh',
			fieldLabel : '主键',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'title' : {
			name : 'title',
			fieldLabel : '名称',
			allowBlank : false,
			anchor : '95%'
		},
		'categoryid' : {
			name : 'categoryid',
			fieldLabel : '分类编号',
			anchor : '95%'
		}
	}

	var Columns = [{name : 'lsh',type : 'string'}, {name : 'title',type : 'string'}, {name : 'categoryid',type : 'string'}];
	
	var Plant = Ext.data.Record.create(Columns);
	
	PlantInt = {
		lsh : '',
		title: '新记录',
		categoryid : treeRootID
	}
	
	sm = new Ext.grid.CheckboxSelectionModel()
	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'lsh',
		header : fc['lsh'].fieldLabel,
		dataIndex : fc['lsh'].name,
		hidden : true,
		width : 200
	}, {
		id : 'title',
		header : fc['title'].fieldLabel,
		dataIndex : fc['title'].name,
		width : 200,
		editor : new fm.TextField(fc['title'])
	}, {
		id : 'file',
		header :"附件",
		dataIndex : fc['lsh'].name,
		width : 200,
		renderer: fileRender
	}])
	cm.defaultSortable = true;

	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : parentBean,
			business : business,
			method : listMethod,
			params : propertyName + SPLITB + propertyValue
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : parentPrimaryKey
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	//ds.setDefaultSort(orderColumn, 'asc');

	parentGridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'parent-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		title : parentGridPanelTitle,
		tbar: [startFlowBtn],
		iconCls : 'icon-by-category',
		border : true,
		region : 'center',
		clicksToEdit : 1,
		header : true,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		// ctCls: 'borderLeft',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : parentBean,
		business : "exampleMgm",
		primaryKey : parentPrimaryKey,
		insertHandler : insertFun,
		insertMethod : 'insertParent',
		saveMethod : 'updateParent',
		deleteMethod : 'deleteParent'
	});

    parentGridPanel.on("cellclick", function(grid, rowIdx, colIdx, e){
    		var record = grid.getStore().getAt(rowIdx);
    		file_currentBID = record.get("lsh");
    		currentParentLsh = record.get("lsh");
			child_PlantInt.parentLsh = currentParentLsh;
			var title = record.get("title");
			childGridPanel.setTitle(title);
			child_ds.baseParams.params = childPropertyName + SPLITB + currentParentLsh
			child_ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

    })
	
	function insertFun() {
		parentGridPanel.defaultInsertHandler()
	}
	
})

