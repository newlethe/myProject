//在引用本js文件的jsp文件中需要定义
//1、defaultParentId：默认根节点
//2、year:需要查询的功能树的有效年度(如果不传这个参数，默认取当前年；如果传“all”则取所有年度)
//3、<script type="text/javascript" src="<%=path%>/extExtend/extTreeNodeUI.js"></script>

var parentID= UNITID;

var unitTree;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
if((ROLETYPE != '0') ){
	treeNodeUrl = treeNodeUrl +"&attachUnit=" + UNITID;
}
if(typeof(year)!='undefined'&& year !=''){
	treeNodeUrl += "&year="+year;
}


Ext.onReady(function(){

	root = new Ext.tree.AsyncTreeNode({
       text:defaultParentName,
       id: defaultParentId
    });
    
    treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + defaultParentId + "&treeName=SysOrgTree",
		requestMethod: "GET"
	});
	
	treePanel = new Ext.tree.TreePanel({
        id:'orgs-tree',
        region:'west',
        split:true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        collapsible : true,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : root,
		collapseFirst : false
	});
	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysOrgTree"; 
	});
});