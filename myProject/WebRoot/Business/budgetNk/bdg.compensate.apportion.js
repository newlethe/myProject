var chgRoot, chgTreeLoader, chgTreePanel;
var gridPanelTitle = "合同:" + conname + " 索赔号：" + clano + " , 所有索赔分摊"
var pid = CURRENTAPPID;
var rootText = "合同索赔分摊";
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

	// 索赔分摊对象，即一行数据
	var BudgetClaMoneyNk = Ext.data.Record.create([

	{
				name : 'claappid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'claid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'clamoney',
				type : 'float'
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

	claRoot = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'
			})
	claTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "BudgetClaimTree",
					businessName : "budgetNkService",
					conid : conid,
					claid : claid,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	claTreePanel = new Ext.tree.ColumnTree({
				id : 'budget-claim-tree-panel',
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
							header : '概算分摊金额',
							width : 90,
							dataIndex : 'realMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '索赔分摊金额',
							width : 90,
							dataIndex : 'clamoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}],
				loader : claTreeLoader,
				root : claRoot
			});

	claTreeLoader.on('beforeload', function(treeLoader, node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = claTreePanel.loader.baseParams
				baseParams.conid = conid;
				baseParams.claid = claid;
				baseParams.parent = bdgid;
			});

	claTreePanel.on('click', function(node, event) {
		if (node == null)
			return;

		saveBtn.setDisabled(false);

		// 生成当前记录对象
		tempNode = node;
		// 将记录填充进form
		var claimApp = new BudgetClaMoneyNk(node.attributes);
		formPanel.getForm().loadRecord(claimApp);

			 if ( !node.isLeaf() ){
			 setFieldReadonly('clamoney', true);
			 }
			 else {
			        
			 setFieldReadonly('clamoney', false);
			 }

		});

	// 设置本合同分摊金额只读/可写
	function setFieldReadonly(fieldName, isReadOnly) {
		var curField = formPanel.getForm().findField(fieldName);
		curField.el.dom.readOnly = isReadOnly;
	}

	// 右键菜单绑定
	claTreePanel.on('contextmenu', menuShow, this);

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

	// 删除索赔分摊信息
	function deleteNode(node) {

		if (!node.isLeaf()) {
			Ext.Msg.show({
						title : '删除索赔分摊',
						msg : '无法直接删除父节点!',
						buttons : Ext.MessageBox.OK
					});
			return;
		}

		Ext.Msg.show({
					title : '删除索赔分摊',
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

										url : 'servlet/BudgetClaAppServlet',
										params : {
											ac : 'delete',
											claappid : node.attributes.claappid
										},
										success : function(result, request) {
											mask.hide();
											var jsonData = Ext.util.JSON
													.decode(result.responseText);

											if (jsonData.success) {
												Ext.example.msg('删除成功',
														jsonData.info);

												// 刷新树

												claTreePanel.getLoader()
														.load(claTreePanel
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
						claRoot.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : '收起所有节点',
					handler : function() {
						claRoot.collapse(true);
					}
				}, {
					text : '选择概算',
					iconCls : 'btn',
					handler : function() {
						window.location.href = BASE_PATH
								+ "Business/budgetNk/bdg.apportion.tree.jsp?conid="
								+ conid + "&claid=" + claid + "&type=cla"
								+ "&conname=" + encodeURIComponent(conname);

					}
				}, {
					text : '刷新',
					iconCls : 'btn',
					handler : function() {
						claTreeLoader.load(claRoot);
					}
				}],
		items : [claTreePanel, formPanel]

	})

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
	claTreePanel.render();
	claTreePanel.expand();
	claRoot.expand();

});
