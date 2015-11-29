var root,treeLoader,treePanel,selectedTreeData
var rootText=''
var temNode,selectWin;
var f_bmArr = new Array;
Ext.onReady(function(){
var guidelineNodeUrl = CONTEXT_PATH + "/servlet/GuidelineServlet?ac=tree";
	var dataUrl = guidelineNodeUrl + "&parentId="+guideDefaultParentId+"&treeName=GuidelineTree&hasCheckBox="+hasCheckBox;
	if(state!=''){
		dataUrl += "&state="+state;
	}
	treeLoad = new Ext.tree.TreeLoader({
		dataUrl: dataUrl,
		requestMethod: "GET"
	});
	if(hasCheckBox=='true'){
		treeLoad.baseAttrs =  { uiProvider: Ext.tree.TreeCheckNodeUI };
	}
	
	guideTree = new Ext.tree.TreePanel({
		id:'guideline_tree',
    	region: 'west',
    	title: '指标树',
    	collapsible: guideTreeCollapsible,
		split:true,
		border: false,
        width: 200,
        minSize: 175,
        maxSize: 300,
        margins:'0 0 0 2',
        rootVisible: true,
        autoScroll: true,
        collapseMode : guideTreeCollapseMode,
        checkModel: guidelineModelType,			//多项选择multiple
        //onlyLeafCheckable:false,//只有叶子节点可以选择
        loader: treeLoad,
        root: new Ext.tree.AsyncTreeNode({
        	text: "指标",
            id: guideDefaultParentId,
            ifpercent:"0",
            jldw:'',
            draggable: false,
            expanded: true
        })
    });
    
    guideTree.on('beforeload', function(node){ 
    	var dataUrl = guidelineNodeUrl + "&parentId="+node.id+"&treeName=GuidelineTree&hasCheckBox="+hasCheckBox;
		if(state!=''){
			dataUrl += "&state="+state;
		}
		if(node.id=='d'){
			if(filterNode!=''){
				dataUrl +="&filterNode="+filterNode;
		}}
		guideTree.loader.dataUrl = dataUrl;
	});
})