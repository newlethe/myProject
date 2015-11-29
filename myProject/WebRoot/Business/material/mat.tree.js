
var treePanel
var data;
var idS = new Array();
var win;
var viewport;
var rootText = '该合同的材料';
 
Ext.onReady(function (){
	
	btnConfirm = new Ext.Button({
		text: '选择',
		iconCls : 'add',
		handler: confirmChoose
	})
            
   var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH + "jsp/material/mat.contractInfo.jsp"
		}
	});
            
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'   
    })
  
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"matContractTree", 
			businessName:"matMgm", 
			conid:conid, 
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	treePanel = new Ext.tree.ColumnTree({
        id: 'mat-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        tbar:['<font color=#15428b><b>&nbsp;合同材料</b></font>'
        		,'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ root.collapse(true); }
		            },
        		'->',btnConfirm,'-',btnReturn],
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '品名(分类名)',
            width: 200,
            dataIndex: 'catName'
        },{
            header: '分类编码',
            width: 100,
            dataIndex: 'catNo'
        },{
            header: '规格型号',
            width: 120,
            dataIndex: 'spec'
        },{
            header: '英文名',
            width: 120,
            dataIndex: 'enName'
        },{
            header: '分类主键',	
            width: 0,				//隐藏字段
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '单位',
            width: 60,
            dataIndex: 'unit'
        },{
            header: '单价',
            width: 60,
            dataIndex: 'price'
        },{
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
            	return "<div id='parent'>"+value+"</div>";
            }
        }], 
        loader: treeLoader,
        root: root,
        rootVisible : false 
	});
	treePanel.on('beforeload', function(node) {
		var matId = node.attributes.matId;
		if (matId == null)
			matId = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.conid = conid;
		baseParams.parent = matId;
	})
	
	var viewport = new Ext.Viewport({
       layout: 'border',
       items: [treePanel]
    });
    
	treePanel.render();
	treePanel.expand();
	root.expand();
	
	function confirmChoose(){
			window.location.href = BASE_PATH + "jsp/material/mat.tree.select.jsp?conid=" 
				+ conid+ "&conname=" + connanme;	
	}

 });
	
