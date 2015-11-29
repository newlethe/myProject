var appRoot, appTreeLoader, appTreePanel;
var gridPanelTitle = "合同:" + conname + "  金额：" + conmoney + ",   所有分摊记录"
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var tempNode;

Ext.onReady(function() {
	Ext.lib.Ajax.defaultPostHeader += ";charset=utf-8";

	// 合同分摊对象，即一行数据
	var BudgetAppMoneyNk = Ext.data.Record.create([{
				name : 'appid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'realMoney',
				type : 'float'
			}, {
				name : 'prosign',
				type : 'int'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'isLeaf',
				type : 'boolean'
			}, {
				name : 'parent',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'bdgName',
				type : 'string'
			}, {
				name : 'bdgMoney',
				type : 'float'
			}, {
				name : 'bdgNo',
				type : 'string'
			}]);

	appRoot = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'
			})
	appTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "BudgetMoneyAppTree",
					businessName : "budgetNkService",
					conid : conid,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	appTreePanel = new Ext.tree.ColumnTree({
				id : 'budget-tree-panel',
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
							header : '概算金额主键',
							width : 0,
							dataIndex : 'appid'
						}, {
							header : '内部流水号',
							width : 0,
							dataIndex : 'conid'
						}, {
							header : '概算金额',
							width : 120,
							dataIndex : 'bdgMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '合同分摊总金额',
							width : 120,
							dataIndex : 'sumRealMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec

						}, {
							header : '本合同分摊',
							width : 120,
							dataIndex : 'realMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '项目标示',
							width : 0,
							dataIndex : 'prosign'

						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parent'

						}, {
							header : '备注',
							width : 0,
							dataIndex : 'remark'
						}],
				loader : appTreeLoader,
				root : appRoot
			});

	appTreeLoader.on('beforeload', function(treeLoader, node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = appTreePanel.loader.baseParams
				baseParams.conid = conid;
				baseParams.conmoney = conmoney;
				baseParams.parent = bdgid;
			});

	appTreePanel.on('click', function(node, event) {
				if (node == null)
					return;

				// 保存按钮可用
				saveBtn.setDisabled(false);

				// 生成当前记录对象
				var bdgAppNk = new BudgetAppMoneyNk(node.attributes);
				tempNode = node;
				// 将记录填充进form
				formPanel.getForm().loadRecord(bdgAppNk);

				// 若不为子节点则无法编辑概算金额

				if (!node.isLeaf()) {
					setFieldReadonly('realMoney', true);
				} else {

					setFieldReadonly('realMoney', false);
				}

			});

	// 右键菜单绑定
	appTreePanel.on('contextmenu', menuShow, this);

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
		var msg = '';

		if (!node.isLeaf()) {
			msg = '及其所有的子项目分摊?';
		}

		Ext.Msg.show({
					title : '删除分摊',
					msg : '是否删除' + node.attributes.bdgName + '['
							+ node.attributes.bdgNo + ']' + msg,
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

										url : 'servlet/BudgetMoneyAppServlet',
										params : {
											ac : 'delete',
											appid : node.attributes.appid
										},
										success : function(result, request) {
											mask.hide();
											var jsonData = Ext.util.JSON
													.decode(result.responseText);

											if (jsonData.success) {
												Ext.example.msg('删除成功',
														jsonData.info);

												// 刷新树，并保持之前状态

												appTreePanel.getLoader()
														.load(appTreePanel
																.getRootNode());
											} else {
												Ext.Msg.show({
															title : '删除失败',
															msg : jsonData.info,
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.ERROR
														});
											}

										},
										failure : function(result, request) {
											mask.hide();

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
								appRoot.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '收起所有节点',
							handler : function() {
								appRoot.collapse(true);
							}
						}, {
							text : '选择概算',
							iconCls : 'btn',
							handler : function() {
								window.location.href = BASE_PATH
										+ "Business/budgetNk/bdg.selectTree.jsp?conid="
										+ conid + "&conname="
										+ encodeURIComponent(conname)
										+ "&conmoney=" + conmoney;
							}
						}],
				items : [appTreePanel, formPanel]

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
	appTreePanel.render();
	appTreePanel.expand();
	appRoot.expand();

});
