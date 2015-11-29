var payRoot, payTreeLoader, payTreePanel;
var gridPanelTitle = "合同:" + conname + " 付款号：" + payno + " , 付款分摊"
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

	// 付款分摊对象，即一行数据
	var BudgetPayAppNk = Ext.data.Record.create([

	{
				name : 'payappid',
				type : 'string'
			}, {
				name : 'payappno',
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
				name : 'proname',
				type : 'string'
			}, {
				name : 'actiondate',
				type : 'date'
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
				name : 'begindate',
				type : 'date'
			}, {
				name : 'enddate',
				type : 'date'
			}, {
				name : 'applypay',
				type : 'float'
			}, {
				name : 'auditing',
				type : 'float'
			}, {
				name : 'factpay',
				type : 'date'
			}, {
				name : 'passpay',
				type : 'date'
			}

	]);

	payRoot = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'
			})
	payTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "BudgetPayTree",
					businessName : "budgetNkService",
					conid : conid,
					payappno : payappno,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	payTreePanel = new Ext.tree.ColumnTree({
				id : 'budget-pay-tree-panel',
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
							width : 270,
							dataIndex : 'bdgName'
						}, {
							header : '财务编码',
							width : 120,
							dataIndex : 'bdgNo'
						}, {
							header : '概算金额',
							width : 100,
							dataIndex : 'bdgMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '合同分摊总金额',
							width : 100,
							dataIndex : 'sumRealMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '本合同分摊金额',
							width : 100,
							dataIndex : 'realBdgMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '已付款分摊',
							width : 90,
							dataIndex : 'sumfactpay',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '申请金额',
							width : 90,
							dataIndex : 'applypay',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}, {
							header : '实际金额',
							width : 90,
							dataIndex : 'factpay',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
						}],
				loader : payTreeLoader,
				root : payRoot
			});

	payTreeLoader.on('beforeload', function(treeLoader, node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = payTreePanel.loader.baseParams
				baseParams.conid = conid;
				baseParams.payappno = payappno;
				baseParams.parent = bdgid;
			});

	payTreePanel.on('click', function(node, event) {
		if (node == null)
			return;

		saveBtn.setDisabled(false);

		// 生成当前记录对象
		tempNode = node;
		// 将记录填充进form
		var payApp = new BudgetPayAppNk(node.attributes);
		formPanel.getForm().loadRecord(payApp);

			 if ( !node.isLeaf() ){
			 setFieldReadonly('applypay', true);
			 setFieldReadonly('factpay', true);
			 }
			 else {
			        
			 setFieldReadonly('applypay', false);
			 setFieldReadonly('factpay', false);
			 }

		});

	// 设置本合同分摊金额只读/可写
	function setFieldReadonly(fieldName, isReadOnly) {
		var curField = formPanel.getForm().findField(fieldName);
		curField.el.dom.readOnly = isReadOnly;
	}

	// 右键菜单绑定
	payTreePanel.on('contextmenu', menuShow, this);

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

	// 删除分摊信息
	function deleteNode(node) {

		if (!node.isLeaf()) {
			Ext.Msg.show({
						title : '删除付款分摊',
						msg : '无法直接删除父节点!',
						buttons : Ext.MessageBox.OK
					});
			return;
		}

		Ext.Msg.show({
					title : '删除付款分摊',
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

										url : 'servlet/BudgetPayAppServlet',
										params : {
											ac : 'delete',
											payappid : node.attributes.payappid
										},
										success : function(result, request) {
											mask.hide();
											var jsonData = Ext.util.JSON
													.decode(result.responseText);

											if (jsonData.success) {
												Ext.example.msg('删除成功',
														jsonData.info);

												// 刷新树

												payTreePanel.getLoader()
														.load(payTreePanel
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
						payRoot.expand(true);
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : '收起所有节点',
					handler : function() {
						payRoot.collapse(true);
					}
				}, {
					text : '选择概算',
					iconCls : 'btn',
					handler : function() {
						window.location.href = BASE_PATH
								+ "Business/budgetNk/bdg.apportion.tree.jsp?conid="
								+ conid + "&payappno=" + payappno + "&type=pay"
								+ "&conname=" + encodeURIComponent(conname);

					}
				}, {
					text : '刷新',
					iconCls : 'btn',
					handler : function() {
						payTreeLoader.load(payRoot);
					}
				}],
		items : [payTreePanel, formPanel]

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
	payTreePanel.render();
	payTreePanel.expand();
	payRoot.expand();

});
