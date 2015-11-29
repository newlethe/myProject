var newtreePanel, newtreeLoader;
var newroot;
var newrootText = "资料分类";
var beanName = "com.sgepit.pmis.document.hbm.ZlTree";
var currentPid = CURRENTAPPID;
Ext.onReady(function (){
	newroot = new Ext.tree.AsyncTreeNode({
        text: newrootText,
        iconCls: 'form'
    })
    newtreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"zlTree", 
			businessName:"zldaMgm", 
			orgid:'', 
			parent:0,
			pid : currentPid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	newtreePanel = new Ext.tree.ColumnTree({
        id: 'zl-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 300,
//	    minSize: 275,
//	    maxSize: 400,
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
            handler: function(){ newroot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ newroot.collapse(true); }
        }],
		columns:[{
            header: '资料名称',
            width: 280,
            dataIndex: 'mc'
        },{
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }], 
        loader: newtreeLoader,
        root: newroot,
        rootVisible: false
	});
	
	newtreePanel.on('beforeload', function(node) {
		var parent = node.attributes.treeid;
		if (parent == null)
			parent = 'root';
			var baseParams = newtreePanel.loader.baseParams
			baseParams.orgid = '';
			baseParams.parent = parent;
	})

	
});