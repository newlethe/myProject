var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true
		});
var smOut = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true
		});	
var root = new Ext.tree.AsyncTreeNode({
        id : "01",
        text : "固定资产",
        expanded : true,
        iconCls : 'form'
    })
    var rootType = new Ext.tree.AsyncTreeNode({
        id : "01",
        text : "固定资产分类",
        expanded : true,
        iconCls : 'form'
    })
    var treeLoader = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getFACompFixedAssetList", 
            businessName:"faFixedAssetService",
            parentid:"0",
            pid: CURRENTAPPID
        },
        clearOnLoad: true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });
    
    var treePanelObj = {
        id : 'list',
        region: 'west',
        width: 240,
        minSize: 240,
        maxSize: 550,
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
        tbar: [
        '<font color=#15428b><b>固定资产清单</b></font>','-',
        {
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }
        //,'-',addTreeBtn,'-',editTreeBtn,'-',delTreeBtn
        ],
        columns:[{
            header: '固定资产名称',
            dataIndex: 'fixedname',
            width: 380,
            renderer: function(value){
                return "<div id='fixedname'>"+value+"</div>";
            }
        },{
            header: '固定资产编码',
            dataIndex: 'fixedno',
            renderer: function(value){
                return "<div id='fixedno'>"+value+"</div>";
            },
            width: 160
        },{
            header: '主键',
            dataIndex: 'uids',
            width: 0,
            renderer: function(value){
                return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '树编码',
            dataIndex: 'treeid',
            width: 0,
            renderer: function(value){
                return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            dataIndex: 'isleaf',
            width: 0,
            renderer: function(value){
                return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            dataIndex: 'parentid',
            width: 0,
            renderer: function(value){
                return "<div id='parentid'>"+value+"</div>";
            }
        }], 
        loader: treeLoader,
        root: root
    };
    var treeLoaderType = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getFACompFixedAssetTree", 
            businessName:"faFixedAssetService",
            parentid:"01",
            pid: CURRENTAPPID
        },
        clearOnLoad: true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });
    
    var chooseBtn = new Ext.Button({
        text : '确定选择',
        iconCls : 'add',
        handler : function(){
            var selNode = fixedTypeTree.getSelectionModel().getSelectedNode();
            if(!selNode){
                Ext.example.msg('提示！', '请先选中需要操作的节点！');
                return;
            }
            if(selNode == root){
                Ext.example.msg('提示','不能选择根节点');
                return;
            }
             if(sm){
             	 var record = sm.getSelected();
             	 if(record != null)
                       record.set('assetsFl',selNode.attributes.uids);
             }
           
            if(smOut){
	              var record = smOut.getSelected();
	              if(record != null)
	                   record.set('fixedAssetTreeid',selNode.attributes.uids);
            }
            fixedTypeWin.hide();
        }
    })
    var treePanelObj2 = treePanelObj;
    treePanelObj2.id = 'tree';
    treePanelObj2.root = rootType;
    treePanelObj2.loader = treeLoaderType;
    treePanelObj2.region = 'center';
    treePanelObj2.tbar = [{
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function(){ rootType.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ rootType.collapse(true); }
        },'-',chooseBtn
    ]
    var fixedTypeTree = new Ext.tree.ColumnTree(treePanelObj2);

    
//TODO:固定资产分类树窗口
    var fixedTypeWin = new Ext.Window({                 
         title: '<font color=#15428b><b>固定资产分类</b></font>',
         layout: 'fit',
         width: 560,
         height: 480,
         modal: true,
         closeAction: 'hide',
         items: [fixedTypeTree]
     });
     
    fixedTypeTree.on('beforeload', function(node) {
        var treeid = node.attributes.treeid;
        if (treeid == null){
            treeid = "01";
        }
        fixedTypeTree.loader.baseParams.parentid = treeid
        fixedTypeTree.loader.baseParams.pid = CURRENTAPPID;
    })
    
