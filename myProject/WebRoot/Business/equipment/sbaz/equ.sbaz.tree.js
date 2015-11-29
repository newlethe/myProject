var selectCkdId = "";
Ext.onReady(function (){

	root = new Ext.tree.AsyncTreeNode({
        text: rootNodeText,
        iconCls: 'icon-pkg',
        id : rootNodeId,
        attributes:{description: rootNodeType}        
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"tree", 
			treeName:"htAndOutTree", 
			businessName:"equMgm",
			sbHtFl1Id : "02",
			parentType: "Ht",
			parent:rootNodeId
		},
		clearOnLoad: true
	});
	treePanel = new Ext.tree.TreePanel({
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 250,
        minSize: 200,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: true,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false, 
        loader: treeLoader,
        root: root
	});
	treePanel.on('beforeload', function(node) {
		var parentType = node.attributes.description;
		if (parentType == null)
			parentType = rootNodeType;
		var baseParams = treePanel.loader.baseParams;
		baseParams.parent = node.id;
		baseParams.parentType = parentType;	
	})
	
	treePanel.on('click', onClick);
	function onClick(node, e ){
		if(node.attributes.description != "Ckd"){
			selectCkdId = "";
			ds.baseParams.params = "1=2"
			ds.load();
		}else{
			selectCkdId = node.id;
			ds.baseParams.params = "outid = '"+selectCkdId+"'"
			ds.load();
		}
		ds_az.baseParams.params = gridfiter
		ds_az.load();
		Ext.getCmp("add").setDisabled(true);
		Ext.getCmp("save").setDisabled(true);
		Ext.getCmp("del").setDisabled(true);		
	}
});