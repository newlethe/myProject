var treePanel, treeLoader;
var rootNode,selectNode,selectPath
var treeNodeUrl = CONTEXT_PATH + "/servlet/ComFileSortServlet?method=buildAllTreeByDept&parentId="+g_rootId+"&deptId="+USERDEPTID;
Ext.onReady(function() {
	rootNode = new Ext.tree.AsyncTreeNode({
		text : g_rootName,
		expand : true,
		id : g_rootId,
		desc : g_rootBh,
		expanded  : true
	});
	selectNode = rootNode
	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl,
		requestMethod: "GET"
	})
	treeLoader.on("load",function(obj,node,rsp){
		treePanel.expandAll();
		if(selectNode){
			treePanel.fireEvent("click",selectNode)
		}else{
			selectNode = node;
			treePanel.fireEvent("click",node)
		}		
	})
	treePanel = new Ext.tree.TreePanel({
		id : 'fileSort-tree',
		region : 'west',	
		frame : false,
		tbar : [{
			iconCls : 'icon-expand-all',
			tooltip : '全部展开',
			handler : function() {
				rootNode.expand(true);
			}
		}, '-', {
			iconCls : 'icon-collapse-all',
			tooltip : '全部折叠',
			handler : function() {
				rootNode.collapse(true);
			}
		}],
		//enableDD : true,
        split:true,
        width: 200,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : rootNode
		//,collapseFirst : true
	});
	
	treePanel.on("click",function(node){
		selectNode = node
		var pathValue = '当前分类：' + node.getPath('text').replace("/"+g_rootName,"")
		if(pathValue == "当前分类："){
			pathValue = pathValue +"/"+ g_rootName;
		}
		if ( pathLabel )
		Ext.get(pathLabel.getEl()).update(pathValue);
		dsResult.load({params:{start:0,limit: PAGE_SIZE}});
		
	})
})