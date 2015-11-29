var root,treeLoader,treePanel,selectedTreeData,selectedTreeData_text
var rootText='物资分类'
var temNode;
var f_bmArr = new Array;
var ds,cm,Columns,gridPanel,gridPanel_check

var bean = "com.sgepit.pmis.wzgl.hbm.WzBm"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bm'

Ext.onReady(function(){
	
	//--------------物资编码Tree---------------------
   root = new Ext.tree.AsyncTreeNode({
		text:rootText,
		inconCls:'form'
	})
	
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "wzBmTypeTree",
			businessName : "wzglMgmImpl",
			pid: CURRENTAPPID,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	})
	
	treePanel = new Ext.tree.ColumnTree({
		id : 'zl-tree-panel',
		region : 'west',
		split : true,
		width : 205,
		minSize : 175,
		maxSize : 300,
		frame : false,
		collapsible : true,
		collapseFirst : false,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		tbar:[{
	            iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
	            handler: function(){ root.expand(true); }
	            },'-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ root.collapse(true); }
	            }],
		columns : [{
			header : '名称',
			width : 260,
			dataIndex : 'pm',
			renderer: function(value){
            	return "<div id='pm'>"+value+"</div>";
            }
		}, {
            header: '主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '编码',
            width:   0,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";
            }
        },{
            header: '层数',
            width:  0,
            dataIndex: 'lvl'
        },{
            header: '叶子',
            width:  0,
            dataIndex: 'isleaf'
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent'
        }
        ],
		loader : treeLoader,
		root : root
	});
	
	treePanel.on('beforeload', function(node) {
		var parent = node.attributes.bm;
		if (parent == null)
			parent = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = parent;
	})	
	treePanel.getRootNode().expand(); 
	treePanel.on('click',onClick);
	
	function onClick(node,e){
		tmpNode=node
		selectedTreeData = node.id;
		selectedTreeData_text = node.text;
		window.frames["content1"].loadDataGrid(selectedTreeData)
	}
	
	
	
	var container = new Ext.Panel({
		region: 'center',
		title:'&nbsp;库&nbsp;存&nbsp;调&nbsp;整&nbsp;',
		border: false,
		html: '<iframe name=content1 src=Business/wzgl/storage/wz.stockgl.stockadjust.kctz.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	var inputPanel = new Ext.Panel({
		renderTo: document.body,
		border: false,
		title:'计划分摊领用数量',
		header : false,
		html: '<iframe name=content2 src=Business/wzgl/storage/wz.stockgl.stockadjust.jhft.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	var outputPanel = new Ext.Panel({
		renderTo: document.body,
		border: false,
		title:'到货未验收数量',
		header : false,
		html: '<iframe name=content3 src=Business/wzgl/storage/wz.stockgl.stockadjust.wys.jsp frameborder=0 style=width:100%;height:100%;></iframe>'
	});
	
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 300,
        deferredRender: false,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        items:[inputPanel,outputPanel]
    });	
    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[treePanel,{
        	region:'center',
        	layout:'border',
        	items:[container,tabs]
        }]
    });		
});