var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "财务科目对照";
var rootText = "所有概算单";
var curBdgid;	//当前选择的bdgid
var selectWin;


Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '0'  // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "BudgetInfoTree",
			businessName : "bdgMgm",
			pid: CURRENTAPPID,
			parent : 0
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'west',
		width :505,
		minSize : 200,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		split: true,
		autoScroll : true,
		animate : false,
		columns : [{
			header : '概算名称',
			width : 350,
			dataIndex : 'bdgname'
		}, {
			header : '概算主键',
			width : 0, // 隐藏字段
			dataIndex : 'bdgid',
			renderer : function(value) {
				return "<div class='bdgid'>" + value + "</div>";
			}
		}, {
			header : '财务编码',
			width : 150,
			dataIndex : 'bdgno'
		}, {
			header : '概算金额',
			width : 150,
			dataIndex : 'bdgmoney',
			renderer : function(value) {
				return '<div align=right>' + cnMoney(value) + '</div>';
			}
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div class='isleaf'>" + value + "</div>";
			}
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent',
			renderer : function(value) {
				return "<div class='parent'>" + value + "</div>";
			}
		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	treePanel.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = bdgid;
	})

	treePanel.on('contextmenu', contextmenu, this);
	var treeMenu;
	function contextmenu(node, e) {
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (rootText == name)
			return;
			
		
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : [{
				id : 'menu_add',
				text : '选择科目',
				value : node,
				iconCls : 'add',
				handler : popSubjectTree
			}]
		});
		treeMenu.showAt(e.getXY());
	}



	treePanel.on('click', onClick);
	function onClick(node, e) {
		var id = node.attributes.bdgid
		curBdgid = id;
		reloadSubRefGrid(id);
	}

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>'],
		items : [treePanel, grid]
	})

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	treePanel.render(); // 显示树
	root.expand();


	function popSubjectTree() {
		if (!selectWin) {
			selectWin = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 600,
				height : 500,
				modal : false,
				maximizable : true,
				constrain: true,
				closeAction : 'hide',
				plain : true,
				items : [selectTreePanel]
			});
		}
		 toggleCheck(selectRoot, false);
		selectWin.show();
	}
});

function reloadSubRefGrid(bdgid){

		ds.baseParams.bdgid = bdgid;
   		ds.load({ params:{start: 0, limit: PAGE_SIZE }});
}