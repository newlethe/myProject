var newroot;
var newtreeLoader;
var newtreePanel;

var newrootPart;
var newtreeLoaderPart;
var newtreePanelPart;
//构建设备仓库树 yanglh 2014-02-27
var storageTreePanel, storageTreeLoader;
var storagRoot;
var storagRootText = "设备仓库编码树";
var storagBeanName = "com.sgepit.pmis.equipment.hbm.EquWarehouse";
var storagOrgdata='';
var storagTreeEquid="";
var storagTreeEquno="";
var storagCurrentPid = CURRENTAPPID;

storagOrgdata = USERDEPTID;

Ext.onReady(function(){
	//构建设备合同分类树
	newroot = new Ext.tree.AsyncTreeNode({
        text: "设备合同分类树",
        iconCls: 'form',
        id : "0"        
    })
	newtreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	newtreePanel = new Ext.tree.ColumnTree({//用于构造下拉设备合同分类树
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备合同分类树',
            width: 160,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
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
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: newtreeLoader,
        root: newroot
	});
	
	
	
	//======部件中使用
	newrootPart = new Ext.tree.AsyncTreeNode({
        text: "设备合同分类树",
        iconCls: 'form',
        id : "0"        
    })
	newtreeLoaderPart = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	newtreePanelPart = new Ext.tree.ColumnTree({//用于构造下拉设备合同分类树
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '设备合同分类树',
            width: 160,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
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
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: newtreeLoaderPart,
        root: newrootPart
	});
	
	newtreePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid = node.attributes.conid;
		if(conid == null || treeid == null){
			conid = edit_conid;
			treeid = conno;
		}
		newtreePanel.loader.baseParams.parent = treeid+SPLITB+"04";;
		newtreePanel.loader.baseParams.conid = conid;
	});
	
	newtreePanelPart.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid = node.attributes.conid;
		if(conid == null || treeid == null){
			conid = edit_conid;
			treeid = conno;
		}
		newtreePanelPart.loader.baseParams.parent = treeid+SPLITB+"04";;
		newtreePanelPart.loader.baseParams.conid = conid;
	});
	
    newtreePanel.expand();
    newtreePanelPart.expand();
    
    if(newroot.firstChild){
    	newroot.expand(false,true,function(){newroot.firstChild.expand()});//自动展开第一次子节点	
    }
//构建设备仓库树 yanglh 2014-02-27
    storagRoot = new Ext.tree.AsyncTreeNode({
        text: storagRootText,
        id: '01',
        iconCls: 'form'
    })
    storageTreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"ckxxTree",
			businessName:"equBaseInfo", 
			orgid:storagOrgdata, 
			parent:0,
			isbody : '0',//非主体
			pid : storagCurrentPid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	storageTreePanel = new Ext.tree.ColumnTree({
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
            handler: function(){ storagRoot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ storagRoot.collapse(true); }
        }],
		columns:[{
            header: '详细位置描述',
            width: 200,
            dataIndex: 'equno',
            renderer: function(value){
            	return "<div id='equno'>"+value+"</div>";  }
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
        loader: storageTreeLoader,
        root: storagRoot,
        rootVisible: false
	});
});