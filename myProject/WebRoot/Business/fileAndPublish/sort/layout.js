var excludeDept = isSortIssue == "1" ? "1" : "0";
Ext.onReady(function(){
	
	treeGridStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name: 'leaf',
		parent_id_field_name: 'parentUnitId',
		url: CONTEXT_PATH + "/servlet/ComFileSortServlet",
   		isWorkMaterialType : true,    	
   		rowId_field_name :'unitId',
		reader: new Ext.data.JsonReader({
			id: 'unitId',
			root: 'topics',
			totalProperty: 'totalCount',
			fields:["unitId", "unitName", "parentUnitId", "unitTypeId", "sortId", "read", "write", "leaf"]
		})
	});
	
	treeGridStore.on('beforeload',function(ds1){
		if ( ! selectNode )
			return;
   		Ext.apply(ds1.baseParams ,{ 
			method: "buileRightTree",
			sortId: selectNode.id,
			excludeDept : excludeDept
		})
   	});
 	treeGridStore.on("load", function(store, record, options){
 		store.each(function(r){
 			if ( !store.isLeafNode(r) ){
 				store.expandNode(r);
 			}
 			
 		});
 		
 	})
	var cm = new Ext.grid.ColumnModel([
		{id: 'unitName', header:"单位或部门名称",dataIndex:"unitName",width:100},
		{header:"是否叶子节点",dataIndex:"leaf",align:"center",width:50,hidden:true},
		{header:"允许查看",dataIndex:"read",width:24, align:"center",hidden:true, renderer: editorColForReadRenderFun},
    	//{header:"允许编辑",dataIndex:"write",align:"center",width:24, hidden:true,renderer: editorColForWriteRenderFun},
    	{header:"权限设置",dataIndex:"write",align:"center",width:24, renderer: editorColForReadWriteRenderFun}
	]);
	
	sortRightGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'rightTree',
		title: '分类权限设置',
		region: 'east',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		split : true,
		frame: false,
		collapsible : false,
		collapsed: false,
		animCollapse : false,
		width:400,
		border: true,
		//tbar: [menuButton, addNewFromTemplateBtn, addBtn, addNewFromTemplateBtn, uploadFileBtn, '-', createSubDocBtn, '-', editBtn, delBtn, '-', otherOperateCombo, '->', yearSearchCombo,monthSearchCombo,statusSearchCombo,versionTypeSearchCombo],
		store: treeGridStore,
		master_column_id : 'unitName',
		cm:cm,
		//sm:csm,
		stripeRows: true,
		autoExpandColumn: 'unitName'
	});
	function editorColForReadRenderFun(value, metaData, record, rowIndex,
								colIndex, store){
		var unitId = record.data["unitId"];
		var sortId = record.data["sortId"];
		var hasEditorRole = record.data["read"];
		return hasEditorRole=="false" ? '<div id="readChecker" class=x-grid3-check-col onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'ReadOnly\')">&#160;</div>'
			 : '<div id="readChecker" class=x-grid3-check-col-on onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'ReadOnly\')">&#160;</div>'
	}
	function editorColForWriteRenderFun(value, metaData, record, rowIndex,
								colIndex, store){
		var unitId = record.data["unitId"];
		var sortId = record.data["sortId"];
		var hasEditorRole = record.data["write"];
		return hasEditorRole=="false" ? '<div id="editorChecker" class=x-grid3-check-col onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
			 : '<div id="editorChecker" class=x-grid3-check-col-on onclick="editorChxClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
	}
	//权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
	function editorColForReadWriteRenderFun(value, metaData, record, rowIndex,
								colIndex, store){
		var unitId = record.data["unitId"];
		var sortId = record.data["sortId"];
		var hasEditorRole = record.data["write"];
		return hasEditorRole=="false" ? '<div id="editorChecker" class=x-grid3-check-col onclick="editorChxAllClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
			 : '<div id="editorChecker" class=x-grid3-check-col-on onclick="editorChxAllClick(this, \'' + unitId +'\', \'' + sortId + '\',\'Write\')">&#160;</div>'
	}	
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [centerPanel,treePanel,sortRightGrid]
	});
	 
})
function editorChxClick(obj, unitId, sortId,type ){
	
	if ( ModuleLVL != '1' )
		return;
	var checked = obj.className.indexOf("-on")>-1?"false":"true";
	var mask = new Ext.LoadMask('rightTree', {
				msg : "正在设置权限..."
			});
	mask.show();
	var state = sortRightGrid.getView().getScrollState()
	ComFileSortDWR.setComFileSortNodeRightAlone(sortId,unitId,type,checked,function(dat){
		if(!dat){
			mask.hide();
			Ext.MessageBox.alert("提示信息","权限设置操作失败,请联系管理员!")
		}else{
			 if (isSortIssue == '1'){
                 ComFileSortDWR.setSyncStatus(g_rootId, false);
             }
            
			treeGridStore.reload({
				callback : function(){
					sortRightGrid.getView().restoreScroll(state);
					mask.hide();
				}
			});
		}
	})	
}
//权限设置函数，勾选表示有查看及读的权限，取消勾选表示无权限
function editorChxAllClick(obj, unitId, sortId,type ){
	
	if ( ModuleLVL != '1' )
		return;
	var checked = obj.className.indexOf("-on")>-1?"false":"true";
	var mask = new Ext.LoadMask('rightTree', {
				msg : "正在设置权限..."
			});
	mask.show();
	var state = sortRightGrid.getView().getScrollState()
	ComFileSortDWR.setComFileSortNodeRightAll(sortId,unitId,type,checked,function(dat){
		if(!dat){
			mask.hide();
			Ext.MessageBox.alert("提示信息","权限设置操作失败,请联系管理员!")
		}else{
			 if (isSortIssue == '1'){
                 ComFileSortDWR.setSyncStatus(g_rootId, false);
             }
            
			treeGridStore.reload({
				callback : function(){
					sortRightGrid.getView().restoreScroll(state);
					mask.hide();
				}
			});
		}
	})	
}
