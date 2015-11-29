var treePanel, treeLoader, contentPanel;
var root;
var treePanelTitle = "竣工决算概算项目对照";
var rootText = "竣工决算概算项目";
var servletName = "servlet/BdgStructureServlet";
var selectBdgWin;

var curNode; // 当前选中的节点
//是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';

Ext.onReady(function() {

	// 竣建概算对象
	var FaBdgInfo = Ext.data.Record.create([{
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'bdgno',
				type : 'string'
			}, {
				name : 'bdgname',
				type : 'string'
			}, {
				name : 'gcType',
				type : 'string'
			}, {
				name : 'buildbdg',
				type : 'string'
			}, {
				name : 'buildname',
				type : 'string'
			}, {
				name : 'buildmoney',
				type : 'float'
			}, {
				name : 'equpbdg',
				type : 'string'
			}, {
				name : 'equipname',
				type : 'string'
			}, {
				name : 'equipmoney',
				type : 'float'
			}, {
				name : 'installbdg',
				type : 'string'
			}, {
				name : 'installname',
				type : 'string'
			}, {
				name : 'installmoney',
				type : 'float'
			}, {
				name : 'otherbdg',
				type : 'string'
			}, {
				name : 'othername',
				type : 'string'
			}, {
				name : 'othermoney',
				type : 'float'
			}, {
				name : 'parent',
				type : 'string'
			}, {
				name : 'correspondbdg',
				type : 'string'
			}, {
				name : 'isLeaf',
				type : 'boolean'
			}]);

	// 根节点
	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'

			});

	// 节点loader
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "faBdgTree",
					businessName : "faBdgStructureService",
					parent : 0,
					pid : pid
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	// 工程类型树
	treePanel = new Ext.tree.ColumnTree({
		id : 'fabdg-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		width : 1000,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		stateEvents : ['collapsenode', 'expandnode'], // 以下为保存树的节点展开状态
		stateId : 'tree-panel-state-id',
		getState : function() {
			var nodes = [];
			this.getRootNode().eachChild(function(child) {
						// function to store state of tree recursively
						var storeTreeState = function(node, expandedNodes) {
							if (node.isExpanded() && node.childNodes.length > 0) {
								expandedNodes.push(node.getPath());
								node.eachChild(function(child) {
											storeTreeState(child, expandedNodes);
										});
							}
						};
						storeTreeState(child, nodes);
					});

			return {
				expandedNodes : nodes
			}
		},
		applyState : function(state, activeNode) {
			var nodes = state.expandedNodes;
			for (var i = 0; i < nodes.length; i++) {
				if (typeof nodes[i] != 'undefined') {
					this.expandPath(nodes[i]);
				}
			}
			// 选中之前激活的节点
			this.selectPath(activeNode);
		}, // 结束保存树的节点展开状态
		columns : [{
					header : '概算名称',
					width : 270,
					dataIndex : 'bdgname'
				}, {
					header : '编号',
					width : 120,
					dataIndex : 'bdgno'
				}, {
					header : '建筑部分编号',
					width : 0,
					dataIndex : 'buildbdg'
				}, {
					header : '建筑部分金额',
					width : 90,
					dataIndex : 'buildmoney',
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						var retVal = '';
						if (record.buildbdg) {
							if (record.buildbdg != '') {
								retVal = cnMoneyToPrec(value);
							}
						}

						return retVal;
					}
				}, {
					header : '设备部分编号',
					width : 0,
					dataIndex : 'equipbdg'
				}, {
					header : '设备部分金额',
					width : 90,
					dataIndex : 'equipmoney',
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						var retVal = '';
						if (record.equipbdg) {
							if (record.equipbdg != '') {
								retVal = cnMoneyToPrec(value);
							}
						}

						return retVal;
					}
				}, {
					header : '安装部分编号',
					width : 0,
					dataIndex : 'installbdg'
				}, {
					header : '安装部分金额',
					width : 90,
					dataIndex : 'installmoney',
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						var retVal = '';
						if (record.installbdg) {
							if (record.installbdg != '') {
								retVal = cnMoneyToPrec(value);
							}
						}

						return retVal;
					}
				}, {
					header : '其它部分编号',
					width : 0,
					dataIndex : 'otherbdg'
				}, {
					header : '其它部分金额',
					width : 90,
					dataIndex : 'othermoney',
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {
						var retVal = '';
						if (record.otherbdg) {
							if (record.otherbdg != '') {
								retVal = cnMoneyToPrec(value);
							}
						}

						return retVal;
					}
				}
//				, {
//					header : 'total',
//					width : 90,
//					renderer : function(value, metaData, record, rowIndex,
//							colIndex, store) {
//						var retVal = record.buildmoney + record.installmoney
//								+ record.equipmoney + record.othermoney;
//						return retVal;
//					}
//				}
				],
		loader : treeLoader,
		root : root,
		rootVisible : false

	});

	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				var id = node.id;
				if (id == null)
					id = '0';
				treeLoader.baseParams.parent = id;
			});

	// 点击事件
	treePanel.on('click', function(node, event) {
				if (node == null)
					return;

				curNode = node;

				if ( !btnDisabled ){
					// 保存按钮可用
				saveBtn.setDisabled(false);
				}
				

				formFieldSet.setTitle(formPanelTitle);

				// 生成当前记录对象
				var curBdgInfo = new FaBdgInfo(node.attributes);

				// 将记录填充进form
				formPanel.getForm().loadRecord(curBdgInfo);

			});

	// 右键菜单绑定
	treePanel.on('contextmenu', menuShow, this);

	// 菜单事件监听
	function menuHandler(menu) {
		switch (menu.id) {

			case 'menu_update' :

				formPanel.expand();
				break;

			case 'menu_add' :
				// 初始化新概算信息纪录

				var faBdg = new FaBdgInfo({
							bdgid : null,
							pid : pid,
							bdgno : '',
							bdgname : '',
							isLeaf : true,
							parent : menu.node.id,
							buildno : null,
							buildname : null,
							buildbdg : null,
							installno : null,
							installname : null,
							installbdg : null,
							equipno : null,
							equipname : null,
							equipbdg : null,
							otherno : null,
							otherbdg : null,
							othername : null

						});

				// 将记录填充进form
				formPanel.getForm().loadRecord(faBdg);

				formFieldSet.setTitle('添加概算信息');

				break;

			case 'menu_del' :
				deleteNode(menu.node);
				break;

		}

	}

	function menuShow(node, e) {
		node.fireEvent("click", node, e)

		var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
			node : node,
			handler : menuHandler
		};

		var menuUpdate = {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			node : node,
			handler : menuHandler
		};

		var menuDelete = {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			node : node,
			handler : menuHandler
		};

		var items;

		// 当前节点是否为根节点
		var hasChild = node.hasChildNodes();

		items = [menuAdd, menuUpdate, menuDelete];
		treeMenu = new Ext.menu.Menu({
					id : 'treeMenu',
					width : 100,
					items : items
				});

		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);

	}

	function deleteNode(node) {
		Ext.Msg.show({
			title : '删除节点',
			msg : '确认删除该节点以及其所属子节点?',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,

			fn : function(value) {
				if (value == 'yes') {
					var curNodeId = node.id;
					var parentNodeId = node.parentNode.id;
					Ext.Ajax.request({
						method : 'post',
						url : servletName,
						params : {
							ac : 'delete-node',
							id : node.id,
							beanType : 'faBdgInfo'
						},
						success : function(result, request) {

							Ext.example.msg('删除', '删除成功!');

							var state = treePanel.getState();

							// 若为添加新节点将其父节点展开
							var parentPath = treePanel
									.getNodeById(parentNodeId).getPath();
							// 当前选中的节点，若是新增则选中父节点
							var activePath;

							activePath = parentPath;
							state.expandedNodes.push(parentPath);

							treePanel.getLoader().load(treePanel.getRootNode(),
									function() {
										// 将树按之前状态展开
										treePanel.applyState(state, activePath);

										// 若为新增则再展开父节点

									});
						},
						failure : function(result, request) {

							Ext.Msg.show({
										title : '操作失败',
										msg : '操作失败',
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});

						}

					});

					// 清空表单域
					formPanel.getForm().reset();
					// 保存按钮不可用
					saveBtn.setDisabled(true);

				}
			}
		});
	}

	// 主面板
	contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : ['<span style="color:#15428b; font-weight:bold">&nbsp;'
						+ treePanelTitle + '</span>'],
				items : [treePanel, formPanel]
			});

	// 创建viewport
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]

			});

});

function showSelectBdgWin() {
	if (!selectBdgWin) {
		selectBdgWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 500,
					height : 500,
					title : '选择概算',
					modal : true,
					maximizable : true,
					closeAction : 'hide',
					plain : true,
					items : [selectTreePanel]
				});
	}

	selectRoot.reload(function() {
				selectRoot.expandChildNodes();
			});

	selectBdgWin.show();

}