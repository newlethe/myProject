var treePanel, treeLoader, contentPanel;
var root;
var treePanelTitle = "工程类型维护";
var rootText = "工程类型";
var servletName = "servlet/BdgStructureServlet";

Ext.onReady(function() {

	// 工程类型对象
	var GcType = Ext.data.Record.create([{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'gcTypeName',
				type : 'string'
			}, {
				name : 'bdgLevel',
				type : 'int'
			}, {
				name : 'faBdgLevel',
				type : 'int'
			}, {
				name : 'parent',
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
					treeName : "gcTypeTree",
					businessName : "gcTypeService",
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	// 工程类型树
	treePanel = new Ext.tree.ColumnTree({
				id : 'gctype-tree-panel',
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
							header : '工程类型名称',
							width : 280,
							dataIndex : 'gcTypeName'
						}, {
							header : '概算层次',
							width : 200,
							dataIndex : 'bdgLevel'
						}, {
							header : '竣工决算概算结构层次',
							width : 200,
							dataIndex : 'faBdgLevel'
						}],
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

				// 保存按钮可用
				saveBtn.setDisabled(false);

				formFieldSet.setTitle(formPanelTitle);

				// 生成当前记录对象
				var curGcType = new GcType(node.attributes);

				// 将记录填充进form
				formPanel.getForm().loadRecord(curGcType);

			});

	// 右键菜单绑定
	treePanel.on('contextmenu', menuShow, this);

	// 菜单事件监听
	function menuHandler(menu) {
		switch (menu.id) {

			case 'menu_add' :
				// 初始化新工程类型信息纪录
				var newBdgLevel;
				var newFaBdgLevel;
				if (!isNaN(menu.node.attributes.bdgLevel)) {
					newBdgLevel = menu.node.attributes.bdgLevel + 1;
				}

				if (!isNaN(menu.node.attributes.faBdgLevel)) {
					newFaBdgLevel = menu.node.attributes.faBdgLevel + 1;
				}

				var gcType = new GcType({
							uids : null,
							pid : pid,
							gcTypeName : '',
							bdgLevel : newBdgLevel,
							faBdgLevel : newFaBdgLevel,
							isLeaf : true,
							parent : menu.node.id

						});

				// 将记录填充进form
				formPanel.getForm().loadRecord(gcType);

				formFieldSet.setTitle('添加工程类型');

				break;
			case 'menu_del' :
				deleteNode(menu.node);
				break;

		}

	}

	root.expand(true);

	function menuShow(node, e) {
		node.fireEvent("click", node, e)

		var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
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

		if (hasChild) {
			items = [menuDelete];
		} else {
			items = [menuAdd, menuDelete];
		}

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
							Ext.Ajax.request({
										method : 'post',
										url : servletName,
										params : {
											ac : 'delete-node',
											id : node.id,
											beanType : 'gcType'
										},
										success : function(result, request) {
											treePanel.getLoader().load(
													treePanel.getRootNode(),
													function() {
														treePanel.getRootNode()
																.expand(true);
													});
											Ext.example.msg('保存', '保存成功!');
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