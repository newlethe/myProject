var root, saveBtn;
var treePanelTitle = "设备清册维护";
var rootText = "所有设备";
var conidif="";
Ext.onReady(function (){
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : "0"        
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equListTreeQc", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 250,
        minSize: 200,
        maxSize: 400,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备名称',
            width: 500,
            dataIndex: 'sbMc'
        },{
            header: '设备主键',
            width: 0,
            dataIndex: 'sbid',
            renderer: function(value){
            	return "<div id='sbid'>"+value+"</div>";
            }
        },{
            header: 'KKS设备编码',
            width: 0,
            dataIndex: 'kks',
            renderer: function(value){
            	return "<div id='kks'>"+value+"</div>";
            }
        }, {
            header: '规格型号',
            width: 0,
            dataIndex: 'ggxh'
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzh'
        }], 
        loader: treeLoader,
        root: root
	});

	treePanel.on('beforeload', function(node) {
		var sbid = node.attributes.kks;
		if (sbid == null)
			sbid = "0";
		var baseParams = treePanel.loader.baseParams;
		baseParams.parent = sbid;
	})
	
	treePanel.on('click', onClick);
	function onClick(node, e ){
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		sbId = isRoot ? "0" : elNode.all("kks").innerText;
		treePanel.selectPath(node.getPath());
		PlantInt.parent = sbId
		tmpNode = node;
		tmpLeaf = isLeaf;
		ds.baseParams.params = "parent = '"+ sbId +"' and pid='" + CURRENTAPPID + "'";
		ds.load({params:{start: 0,limit: PAGE_SIZE}});
    	if(tmpNode.attributes.conid != '')excelBtn.setDisabled(false);		
	}
	
	
	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [grid]
	});
    
// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [treePanel, contentPanel]
    });
    
    
    //grid.getTopToolbar().add(excelBtn)
    
    treePanel.render(); // 显示树
    treePanel.expand();
    if(root.firstChild){
    	root.expand(false,true,function(){root.firstChild.expand()});//自动展开第一次子节点	
    }
});

