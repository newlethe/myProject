var root, saveBtn;
var treePanelTitle = "设备清单维护";
var conidif = "";

var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var bean = "com.sgepit.pmis.budget.hbm.BdgMoneyApp";
var rootNew,treeLoaderNew,treePanelNew;
var bdgid;
var conname,conid,conmoney;
var tempNode,isRootNode
var thisBdgid = "",thisBdgno = "";
Ext.onReady(function() {
	//---------当前合同信息---------
	var bean = "com.sgepit.pmis.contract.hbm.ConOve";
	DWREngine.setAsync(false); 
	baseDao.findByWhere2(bean, "conno='"+p_conNo+"'", function(list){
		conname = list[0].conname;
		conid = list[0].conid;
		conmoney = list[0].conmoney;
	});
	DWREngine.setAsync(true);
	

	// ---------生成概算树----------

	rootNew = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '0'
	})
	treeLoaderNew = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "bdgMoneyTree",
			businessName : "bdgMgm",
			conid : conid,
			conmoney : conmoney,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanelNew = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'west',
		width : 280,
		minSize : 230,
		maxSize : 550,
		split: true,			//设置可滑动
        collapsible : true,		//滑动展开，左右展开
        collapsed: false,		//滑动展开，设置默认为展开
        collapseMode : 'mini',	//设置可滑动展开与关闭	
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		enableDD: true,   
    	ddGroup: "tgDD",
    	listeners: {   
	        // 监听beforenodedrop事件，主要就是在这里工作，拖动后处理数据 
	        beforenodedrop: function(dropEvent){
	        	var node = dropEvent.target;    // 目标结点
	        	var data = dropEvent.data;      // 拖拽的数据
	        	if(data.node)return;
	        	if(!node.attributes.leaf)return;
	        	for(var i=0;i<data.selections.length;i++){
	        		var record = data.selections[i];
	        		record.set('bdgno',node.attributes.bdgno);
	        		record.set('bdgid',node.attributes.bdgid);
	        	}
	        	grid.defaultSaveHandler();
	        }
	    },
		columns : [{
			header : '概算名称',
			width : 530, // 隐藏字段
			dataIndex : 'bdgname'
		}, {
			header : '财务编码',
			width : 0,
			dataIndex : 'bdgno'
		}, {
			header : '概算主键',
			width : 0,
			dataIndex : 'bdgid'
		}, {
			header : '内部流水号',
			width : 0,
			dataIndex : 'conid'
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf'
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent'
		}],
		loader : treeLoaderNew,
		root : rootNew,
		rootVisible : false,
		tbar : [
			 {
				iconCls : 'icon-expand-all',
				tooltip : 'Expand All',
				text	: '全部展开',
				handler : function() {
					rootNew.expand(true);
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : 'Collapse All',
				text	: '全部收起',
				handler : function() {
					rootNew.collapse(true);
				}
			}
		]
	});

	treePanelNew.on('beforeload', function(node) {
		bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.conmoney = conmoney;
		baseParams.parent = bdgid;
	})
	//点击的树不是叶子，则补选中，并展开
	treePanelNew.on('beforeclick', function(node,e){
		if(!node.isLeaf()){
			node.expand();
			return false;
		}
	});
	treePanelNew.on('click', onClick);
	
	function onClick(node, e) {
		tempNode = node
		isRootNode = (rootText == tempNode.text);
		thisBdgid = isRootNode	? "0" : tempNode.attributes.bdgid;
		thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
	}
	
	var viewport = new Ext.Viewport({
		layout : 'border',
		region : 'center',
		items : [treePanelNew, grid]
	});

	grid.getTopToolbar().add(selectBdgBtn);
	ds.load({params:{start:0,limit:PAGE_SIZE}});
});
