var chgRoot, chgTreeLoader, chgTreePanel;
var gridPanelTitle = "合同:" + conname + " 变更号：" + chano + " , 所有合同变更概算记录"
var pid = CURRENTAPPID;
var rootText = "合同变更分摊";
var tempNode;

Ext.onReady(function() {
	Ext.lib.Ajax.defaultPostHeader += ";charset=utf-8";

	var btnReturn = new Ext.Button({
				text : '返回',
				iconCls : 'returnTo'

			});

	var btnSelect = new Ext.Button({
				text : '选择',
				iconCls : 'btn'
			});

	// 变更分摊对象，即一行数据
	var BudgetChangeMoneyNk = Ext.data.Record.create([

	{
				name : 'caid',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'chgMoney',
				type : 'float'
			}, {
				name : 'chaid',
				type : 'string'
			}, {
				name : 'isLeaf',
				type : 'boolean'
			}, {
				name : 'parent',
				type : 'string'
			}, {
				name : 'bdgNo',
				type : 'string'
			}, {
				name : 'bdgName',
				type : 'string'
			}, {
				name : 'realMoney',
				type : 'float'
			}

	]);

	chgRoot = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'
			})
	chgTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "BudgetChangeTree",
					businessName : "budgetNkService",
					conid : conid,
					chaid : chaid,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	chgTreePanel = new Ext.tree.ColumnTree({
				id : 'budget-change-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				width : 800,
				minSize : 275,
				maxSize : 600,
				frame : false,
				header : false,
				border : false,
				rootVisible : false,
				lines : true,
				autoScroll : true,
				animate : false,
				columns : [{
							header : '概算名称',
							width : 270, // 隐藏字段
							dataIndex : 'bdgName'
						}, {
							header : '财务编码',
							width : 200,
							dataIndex : 'bdgNo'
						}, {
							header : '项目工程编号',
							width : 0,
							dataIndex : 'pid'
						}, {
							header : '变更分摊主键',
							width : 0,
							dataIndex : 'caid'
						}, {
							header : '概算主键',
							width : 0,
							dataIndex : 'bdgid'
						}, {
							header : '内部流水号',
							width : 0,
							dataIndex : 'conid'
						}, {
							header : '实际分摊金额',
							width : 90,
							dataIndex : 'realMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '变更分摊金额',
							width : 90,
							dataIndex : 'chgMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '变更单主键',
							width : 0,
							dataIndex : 'chaid'
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isLeaf'
						},

						{
							header : '父节点',
							width : 0,
							dataIndex : 'parent'

						}],
				loader : chgTreeLoader,
				root : chgRoot
			});

	chgTreeLoader.on('beforeload', function(treeLoader, node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = chgTreePanel.loader.baseParams
				baseParams.conid = conid;
				baseParams.chaid = chaid;
				baseParams.parent = bdgid;
			});

	chgTreePanel.on('click', function(node, event) {
				if (node == null)
					return;

				saveBtn.setDisabled(false);

				// 生成当前记录对象
				tempNode = node;
				// 将记录填充进form
				var changeApp = new BudgetChangeMoneyNk(node.attributes);
				formPanel.getForm().loadRecord(changeApp);

				if (!node.isLeaf()) {
					setFieldReadonly('chgMoney', true);
				} else {

					setFieldReadonly('chgMoney', false);
				}

			});

	// 右键菜单绑定
	chgTreePanel.on('contextmenu', menuShow, this);

	// 菜单事件监听
	function menuHandler(menu) {
		switch (menu.id) {
			// 修改
			case 'menu_update' :
				// formFieldSet.setTitle('修改概算信息');
				formPanel.expand();
				break;

			case 'menu_del' :
				deleteNode(menu.node);
				break;
		}
	}

	// 设置本合同分摊金额只读/可写
	function setFieldReadonly(fieldName, isReadOnly) {
		var curField = formPanel.getForm().findField(fieldName);
		curField.el.dom.readOnly = isReadOnly;
	}

	// 删除分摊信息
	function deleteNode(node) {

		if (!node.isLeaf()) {
			Ext.Msg.show({
						title : '删除变更分摊',
						msg : '无法直接删除父节点!',
						buttons : Ext.MessageBox.OK
					});
			return;
		}

		Ext.Msg.show({
					title : '删除变更分摊',
					msg : '是否删除' + node.attributes.bdgName + '['
							+ node.attributes.bdgNo + ']',
					buttons : Ext.Msg.YESNO,
					icon : Ext.MessageBox.QUESTION,

					fn : function(value) {
						if (value == 'yes') {
							var mask = new Ext.LoadMask(Ext.getBody(), {
										msg : "正在删除..."
									});
							mask.show();

							Ext.Ajax.request({
										method : 'post',

										url : 'servlet/BudgetChangeAppServlet',
										params : {
											ac : 'delete',
											caid : node.attributes.caid
										},
										success : function(result, request) {
											mask.hide();
											var jsonData = Ext.util.JSON
													.decode(result.responseText);

											if (jsonData.success) {
												Ext.example.msg('删除成功',
														jsonData.info);

												// 刷新树

												chgTreePanel.getLoader()
														.load(chgTreePanel
																.getRootNode());
											} else {
												Ext.Msg.show({
															title : '删除失败',
															msg : jsonData.info,
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.ERROR
														});
											}

										}

									});

							// 清空表单域
							formPanel.getForm().reset();
							// 保存按钮不可用
							saveBtn.setDisabled(true);

							mask.destroy();
						}
					}
				});

	}

	function menuShow(node, e) {
		node.fireEvent("click", node, e)

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

		var items = [menuUpdate, menuDelete];

		treeMenu = new Ext.menu.Menu({
					id : 'treeMenu',
					width : 100,
					items : items
				});

		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
	}

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : [
				'<font color=#15428b><b>&nbsp;' + gridPanelTitle
						+ '</b></font>', '-', {
					iconCls : 'icon-expand-all',
					tooltip : '展开所有节点',
					handler : function() {
						chgRoot.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : '收起所有节点',
					handler : function() {
						chgRoot.collapse(true);
					}
				}, {
					text : '选择概算',
					iconCls : 'btn',
					handler : function() {
						window.location.href = BASE_PATH
								+ "Business/budgetNk/bdg.apportion.tree.jsp?conid="
								+ conid + "&chaid=" + chaid + "&chano=" + chano
								+ "&type=change" + "&conname="
								+ encodeURIComponent(conname);

					}
				}, {
					text : '刷新',
					iconCls : 'btn',
					handler : function() {
						chgTreeLoader.load(chgRoot);
					}
				}],
		items : [chgTreePanel, formPanel]

	});

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					title : gridPanelTitle,
					layout : 'border',
					items : [contentPanel],
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
	}
	chgTreePanel.render();
	chgTreePanel.expand();
	chgRoot.expand();

});
