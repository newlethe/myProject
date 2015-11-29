var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "内控概算结构维护";
var rootText = "所有概算单";
var allRealmoney = 0;
var currentPid = CURRENTAPPID;
var queryBdgWin;

Ext.onReady(function() {

	Ext.lib.Ajax.defaultPostHeader += ";charset=utf-8";

	// 概算对象，即一行数据
	var BudgetNk = Ext.data.Record.create([{
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'bdgNo',
				type : 'string'
			}, {
				name : 'bdgName',
				type : 'string'
			}, {
				name : 'hasBdgAmount',
				type : 'boolean'
			}, {
				name : 'bdgMoney',
				type : 'float'
			}, {
				name : 'matMoney',
				type : 'float'
			}, {
				name : 'buildMoney',
				type : 'float'
			}, {
				name : 'equMoney',
				type : 'float'
			}, {
				name : 'isLeaf',
				type : 'boolean'
			}, {
				name : 'parent',
				type : 'string'
			}, {
				name : 'totalMoney',
				type : 'float'
			}, {
				name : 'correspondBdg',
				type : 'string'
			}, {
				name : 'isFinish',
				type : 'boolean'
			}, {
				name : 'isAudit',
				type : 'boolean'
			}, {
				name : 'auditNo',
				type : 'string'
			}, {
				name : 'auditId',
				type : 'string'
			}, {
				name : 'assetNo',
				type : 'string'
			}]);

	// 根节点
	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0' // 重要 : 展开第一个节点 !!
			})

	// 节点Loader
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "BudgetInfoTree",
					businessName : "budgetNkService",
					parent : 0,
					pid : currentPid
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	// 概算结构树
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
					width : 350,
					dataIndex : 'bdgName'
				}, {
					header : '概算主键',
					width : 0, // 隐藏字段
					dataIndex : 'bdgid'

				}, {
					header : '项目工程编号',
					width : 0, // 隐藏字段
					dataIndex : 'pid'
				}, {
					header : '财务编码',
					width : 100,
					dataIndex : 'bdgNo'
				}, {
					header : '概算金额',
					width : 120,
					dataIndex : 'bdgMoney',
					cls : 'numberCell',
					renderer : cnMoneyToPrec
				}, {
					header : '分摊总金额',
					width : 120,
					dataIndex : 'totalMoney',
					cls : 'numberCell',
					renderer : cnMoneyToPrec
				}, {
					header : '差值',
					width : 120,
					dataIndex : 'remainder',
					cls : 'numberCell',
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store) {

						var dispValue = record.bdgMoney - record.totalMoney;

						// 若为负值则显示为红色
						var style = '';
						if (dispValue < 0) {
							style = ' style="color:#ff0000" ';
						}

						return '<span' + style + '>' + cnMoneyToPrec(dispValue)
								+ '</span>';
					}

				}, {
					header : '材料金额',
					width : 0,
					dataIndex : 'matMoney'
				}, {
					header : '建筑金额',
					width : 0,
					dataIndex : 'buildMoney'
				}, {
					header : '设备安装金额',
					width : 0,
					dataIndex : 'equMoney'
				}, {
					header : '是否子节点',
					width : 0,
					dataIndex : 'isLeaf'

				}, {
					header : '父节点',
					width : 0,
					dataIndex : 'parent',
					cls : 'parent'
				}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				var bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				treeLoader.baseParams.parent = bdgid;
			})

	// 点击事件
	treePanel.on('click', function(node, event) {
				if (node == null)
					return;
				// 保存按钮可用
				saveBtn.setDisabled(false);

				// 生成当前记录对象
				var curBudgetRec = new BudgetNk(node.attributes);

				// 将记录填充进form
				budgetFormPanel.getForm().loadRecord(curBudgetRec);

				formFieldSet.setTitle('修改概算信息');

				// 若不为子节点则无法编辑概算金额

				if (!node.isLeaf()) {
					setFieldReadonly('bdgMoney', true);
				} else {

					setFieldReadonly('bdgMoney', false);
				}
			});

	// 右键菜单绑定
	treePanel.on('contextmenu', menuShow, this);

	// 菜单事件监听
	function menuHandler(menu) {
		switch (menu.id) {
			// 修改
			case 'menu_update' :
				// formFieldSet.setTitle('修改概算信息');
				budgetFormPanel.expand();
				break;
			case 'menu_add' :
				// 初始化新概算信息纪录
				var newBdgEst = new BudgetNk({
							pid : currentPid,
							bdgid : null,
							bdgNo : '',
							bdgName : '',
							hasBdgAmount : true,
							bdgMoney : 0,
							totalMoney : 0,
							matMoney : 0,
							buildMoney : 0,
							equMoney : 0,
							isLeaf : true,
							parent : menu.node.id,
							correspondBdg : '',
							isFinish : false,
							isAudit : false,
							auditNo : '',
							auditId : '',
							assetNo : ''
						});

				// 将记录填充进form
				budgetFormPanel.getForm().loadRecord(newBdgEst);
				// 概算金额可编辑
				setFieldReadonly('bdgMoney', false);

				formFieldSet.setTitle('添加概算信息(' + menu.node.attributes.bdgName
						+ ')');

				// 清除验证提示
				budgetFormPanel.getForm().clearInvalid();

				// 显示form面板
				budgetFormPanel.expand();

				break;
			case 'menu_del' :
				deleteNode(menu.node);
				break;

			case 'menu_detail' :
				var bdgid = menu.node.id;
				if (bdgid) {
					showBdgDetail(bdgid);
				}
				break;

		}

	}

	// 设置概算金额只读/可写
	function setFieldReadonly(fieldName, isReadOnly) {
		var curField = budgetFormPanel.getForm().findField(fieldName);
		curField.el.dom.readOnly = isReadOnly;
	}

	// 删除概算信息
	function deleteNode(node) {
		if (!node.isLeaf()) {
			Ext.Msg.show({
						title : '提示',
						msg : '父节点不能直接删除！',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.INFO
					});

			return;
		}

		Ext.Msg.show({
					title : '删除概算',
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

										url : 'servlet/BudgetNkServlet',
										params : {
											ac : 'delete',
											bdgid : node.attributes.bdgid
										},
										success : function(result, request) {
											mask.hide();
											var jsonData = Ext.util.JSON
													.decode(result.responseText);

											if (jsonData.success) {
												Ext.example.msg('删除成功',
														jsonData.info);

												// 刷新树，并保持之前状态
												var state = treePanel
														.getState();
												contentPanel.body.mask(
														'Loading',
														'x-mask-loading');

												// 父节点被选中
												var parentPath = node.parentNode
														.getPath();

												treePanel
														.getLoader()
														.load(
																treePanel
																		.getRootNode(),
																function() {
																	contentPanel.body
																			.unmask();
																	// 将树按之前状态展开
																	treePanel
																			.applyState(
																					state,
																					parentPath);

																});
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
							budgetFormPanel.getForm().reset();
							// 保存按钮不可用
							saveBtn.setDisabled(true);

							mask.destroy();
						}
					}
				});

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

		var menuDetail = {
			id : 'menu_detail',
			text : '　查看',
			iconCls : 'form',
			node : node,
			handler : menuHandler
		};

		var items;

		// 当前节点是否为根节点
		var isRoot = node.getDepth() == 1;

		if (isRoot) {
			items = [menuAdd, menuUpdate, '-', menuDetail];
		} else {
			items = [menuAdd, menuDelete, menuUpdate, '-', menuDetail];
		}

		treeMenu = new Ext.menu.Menu({
					id : 'treeMenu',
					width : 100,
					items : items
				});

		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);

	}

	var exportExcelBtn = new Ext.Button({
		id: 'export',
		text: '导出数据',
		tooltip: '导出数据到Excel',
		cls: 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_excel.png',
		handler: function() {
			exportDataFile();
		}
	});
	function exportDataFile(){
		var openUrl = CONTEXT_PATH + "/servlet/BdgServlet?ac=exportData&&businessType=BdgInfoNK&unitId=" + USERDEPTID;
		document.all.formAc.action = openUrl
		document.all.formAc.submit();
	}
	
	// 主面板
	contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : [
						'<span style="color:#15428b; font-weight:bold">&nbsp;'
								+ treePanelTitle + '</span>','-',exportExcelBtn,
						'->',
						'所有合同分摊总金额：<span id="sumAppMoney">' + allRealmoney
								+ '<span>'],
				items : [treePanel, budgetFormPanel]
			})

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					layout : 'border',
					items : [contentPanel],
					title : 'Simple Tasks',
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
	}

	sumTotalApp();
		// showBdgDetail('01');
});

function showBdgDetail(bdgid) {
	curBdgid = bdgid;

	if (!queryBdgWin) {
		queryBdgWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 600,
					height : 250,
					title : "该内控概算分摊情况查看",
					// constrain: true,
					modal : false,
					maximizable : true,
					// minimizable: true,
					closeAction : 'hide',
					plain : true,
					items : [gridBdg]
				});
	}
	dsBdg.load({
				callback : function() {
					queryBdgWin.show();
				}
			});

}

function sumTotalApp() {
	Ext.Ajax.request({
				method : 'post',

				url : 'servlet/BudgetNkServlet',
				params : {
					ac : 'sumTotalAppMoney',
					pid : currentPid
				},
				success : function(result, request) {
					var value = cnMoneyToPrec(result.responseText);
					Ext.get('sumAppMoney').update(value);
				}

			});

}
