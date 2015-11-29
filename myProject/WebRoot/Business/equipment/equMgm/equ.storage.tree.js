//【通用】设备仓库分类树

var storTreeRoot;
var storTreeLoader;
var storTreePanel;
var beanName = "com.sgepit.pmis.equipment.hbm.EquWarehouse";

Ext.onReady(function(){

	storTreeRoot = new Ext.tree.AsyncTreeNode({
        id : "0",
        text: "设备仓库分类树",
        iconCls: 'form'
    })
	storTreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"ckxxTree",
			businessName:"equBaseInfo", 
			orgid : 0, 
			parent : 0,
			isbody : '0',//非主体
			pid : CURRENTAPPID
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	storTreePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 240,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		id: 'zl-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        autoWidth: true,
	    split: true,
	    frame: false,
	    header: false,
	    border: false,
	    lines: true,
	    autoScroll: true,
	    animate: false,
	    tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ storTreeRoot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ storTreeRoot.collapse(true); }
        }],
		columns:[{
            header: '详细位置描述',
            width: 200,
            dataIndex: 'equno',
            renderer: function(value){
            	return "<div id='equno'>"+value+"</div>";  }
        },{
            header: '详细位置描述',
            width: 0,
            dataIndex: 'detailed',
            renderer: function(value){
            	return "<div id='detailed'>"+value+"</div>";  }
        },{
            header: '设备仓库主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";  }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'equid',
            renderer: function(value){
            	return "<div id='equid'>"+value+"</div>";  }
        },{
			header : '是否子节点',
			dataIndex: 'isleaf',
			width: 0,
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";  }
		},{
			header : '父节点',
			dataIndex: 'parent',
			width: 0,
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";  }
		}],  
        loader: storTreeLoader,
        root: storTreeRoot,
        rootVisible: false
	});

	storTreePanel.on('beforeload', function(node) {
		var equid = node.attributes.equid;
		if (equid == null){
			equid = "0";
		}
		if(node.attributes.parent=="0"){
			queryParent = node.attributes.equid;
		}
		storTreePanel.loader.baseParams.parent = equid;
	});
	
});
