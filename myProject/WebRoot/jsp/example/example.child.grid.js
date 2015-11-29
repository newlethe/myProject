var childGridPanel;
var childBean = "com.sgepit.frame.example.hbm.ExampleParenttable";
var childPrimaryKey = "lsh";
var childGridPanelTitle = "系统框架应用示例";
var child_ds;							
var child_PlantInt;						
var childPropertyName = "parentLsh";
var childPropertyValue = "";
Ext.onReady(function() {
		var child_fm = Ext.form; 
		var child_fc = { // 创建编辑域配置
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
		'parentLsh' : {
			name : 'parentLsh',
			fieldLabel : '父记录流水号',
			anchor : '95%'
		}
	}
	
	var child_Columns = [{name : 'lsh',type : 'string'}, {name : 'title',type : 'string'}, {name : 'parentLsh',type : 'string'}];
	
	var child_Plant = Ext.data.Record.create(child_Columns);
	
	child_PlantInt = {
		lsh : '',
		title: '新记录',
		parentLsh : currentParentLsh
	}
	
	
	var child_sm = new Ext.grid.CheckboxSelectionModel()
	var child_cm = new Ext.grid.ColumnModel([child_sm, {
		id : 'lsh',
		header : child_fc['lsh'].fieldLabel,
		dataIndex : child_fc['lsh'].name,
		hidden : true,
		width : 200
	}, {
		id : 'title',
		header : child_fc['title'].fieldLabel,
		dataIndex : child_fc['title'].name,
		width : 200,
		editor : new child_fm.TextField(child_fc['title'])
	}])
	child_cm.defaultSortable = true;

	child_ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : childBean,
			business : business,
			method : listMethod,
			params : childPropertyName + SPLITB + childPropertyValue
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : childPrimaryKey
		}, child_Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	childGridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'child-grid-panel',
		ds : child_ds,
		cm : child_cm,
		sm : child_sm,
		title : childGridPanelTitle,
		tbar: [],	
		height : 300,
		split:true,
		iconCls : 'icon-by-category', 
		border : true,
		region : 'south',  //布局位置指定，置于下方
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
			store : child_ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : child_Plant,
		plantInt : child_PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : childBean,
		business : "exampleMgm",
		primaryKey : childPrimaryKey,
		insertHandler : childInsertFun,
		insertMethod : 'insertChild',
		saveMethod : 'updateChild',
		deleteMethod : 'deleteChild'
	});
	
	function childInsertFun() {
		childGridPanel.defaultInsertHandler()
	}
	
})