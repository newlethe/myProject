var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "资产分类维护";
var rootText = "所有资产";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;

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
			treeName : "assetSortTree",
			businessName : "faAssetsService",
			parent : 0,
			pid: CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		width : 800,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		columns : [{
			header : '资产名称',
			width : 350,
			dataIndex : 'assetsName'
		}, {
			header : '资产主键',
			width : 0, // 隐藏字段
			dataIndex : 'uids',
			renderer : function(value) {
				return "<div id='uids'>" + value + "</div>";
			}
		}, {
			header : '资产编号',
			width : 200, // 隐藏字段
			dataIndex : 'assetsNo'
		}, {
			header : '单位',
			width : 50,
			dataIndex : 'unit'
		}, {
			header : '折旧率',
			width : 50,
			dataIndex : 'depreciationRate',
			renderer : function(value) {
				return value > 0? "<div id='depreciationRate'>" + value+"%" + "</div>": '';
			}
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parentId',
			renderer : function(value) {
				return "<div id='parentId'>" + value + "</div>";
			}
		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	treePanel.on('beforeload', function(node) {
		var uids = node.attributes.uids;
		if (uids == null)
			uids = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = uids;
	})
	
	if (ModuleLVL < 3) {
		treePanel.on('contextmenu', contextmenu, this);
	}
	var treeMenu
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
				text : '　新增',
				value : node,
				iconCls : 'add',
				handler : toHandler
			}, '-', {
				id : 'menu_update',
				text : '　修改',
				value : node,
				iconCls : 'btn',
				handler : toHandler
			}, '-', {
				id : 'menu_del',
				text : '　删除',
				value : node,
				iconCls : 'remove',
				handler : toHandler
			}]
		});

		treeMenu.showAt(e.getXY());
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}

	function toHandler() {
		formPanel.expand();
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("uids").innerText;
		var menu_parentId = isRoot ? "0" : elNode.all("parentId").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;

		if ("　新增" == state) {
			saveBtn.setDisabled(false);
			var formRecord = Ext.data.Record.create(Columns);
			loadFormRecord = new formRecord({
				uids : null,
				assetsNo : '',
				assetsName : '',
				unit : '',
				depreciationRate : null,
				isleaf : 1,
				parentId : menu_nodeId
			});
			formPanel.isNew = true
			formPanel.getForm().loadRecord(loadFormRecord);
		} else if ("　删除" == state) {
			delHandler(menu_nodeId, node);
		} else {
			formPanel.isNew = false
			saveBtn.setDisabled(false);
		}
	}

	function delHandler(nodeid, node) {
		if (node.childNodes.length > 0) {
			Ext.Msg.show({
				title : '提示',
				msg : '父节点不能直接删除操作！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
		} else {
			Ext.Msg.show({
				title : '提示',
				msg : '是否删除' + node.attributes.assetsName + '['
						+ node.attributes.assetsNo + ']',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						treePanel.getEl().mask("loading...");
						faAssetsService.deleteChildNodeSort(nodeid, function(flag) {
							if ("0" == flag) {
								var formDelRecord = Ext.data.Record.create(Columns);
								var flag = (node.parentNode.childNodes.length == 1)
								var pNode = flag? node.parentNode.parentNode: node.parentNode
								var formRecord = Ext.data.Record.create(Columns);
								var emptyRecord = new formRecord({
									uids : null,
									assetsNo : '',
									assetsName : '',
									unit : '',
									depreciationRate : null,
									isleaf : 1,
									parentId : ""
								});
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();

								if (flag) {
									var uids = pNode.attributes.uids;
									var baseParams = treePanel.loader.baseParams
									baseParams.parent = uids;
								}
								root.reload(function(n){
									if ( root.firstChild ){
									root.firstChild.expand();
									}
									
								});
								
								Ext.example.msg('删除成功！', '您成功删除了一条资产分类！');
							} else {
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							treePanel.getEl().unmask();
						});
					}
				}
			});
		}
	}

	treePanel.on('click', onClick);
	function onClick(node, e) {
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		var menu_uids = isRoot ? "0" : elNode.all("uids").innerText;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;

		saveBtn.setDisabled(true);
		DWREngine.setAsync(false);
		baseMgm.findById(beanName, menu_uids, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);

		tmpNode = node;
		tmpLeaf = menu_isLeaf;

		formPanel.getForm().loadRecord(loadFormRecord);
	}

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>','-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ root.collapse(true); }
		            }],
		items : [treePanel, formPanel]
	})

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand();

});