var treePanel, treeLoader, contentPanel;
var root;
var treePanelTitle = "费用分摊定义";
var rootText = "其它费用";
var servletName = "servlet/FAFinanceServlet";
var rootId = "0104";
// 重新加载树保持原来状态使用
var curNodeId, parentNodeId;
var currentPid = CURRENTAPPID;

Ext.onReady(function() {

	// 待摊基建支出分摊明细表
	var FAOutcomeApp = Ext.data.Record.create([{
				name : 'uids',
				type : 'string'
			},  {
				name : 'pid',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'bdgname',
				type : 'string'
			}, {
				name : 'deferredExpense',
				type : 'float'
			}, {
				name : 'buildPubExpense',
				type : 'float'
			}, {
				name : 'buildExclExpense',
				type : 'float'
			}, {
				name : 'installPubExpense',
				type : 'float'
			}, {
				name : 'installExclExpense',
				type : 'float'
			}, {
				name : 'equPubExpense',
				type : 'float'
			}, {
				name : 'equExclExpense',
				type : 'float'
			}, {
				name : 'exclProperties',
				type : 'string'
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
					treeName : "faOutcomeAppTree",
					businessName : "faOtherAppService",
					parent : rootId,
					pid : currentPid
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	// 待摊支出明细树
	treePanel = new Ext.tree.ColumnTree({
		id : 'outcome-app-tree-panel',
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
					header : '费用项目',
					width : 240,
					dataIndex : 'bdgname'
				}, {
					header : '待摊支出',
					width : 90,
					dataIndex : 'deferredExpense'
				}, {
					header : '实际分摊总额',
					width : 90,
					renderer : function(value, metaData, record, rowIndex,
							colIndex, store){
						var retVal = record.buildPubExpense + record.buildExclExpense
						+ record.installPubExpense + record.installExclExpense +
						record.equPubExpense + record.equExclExpense;
						var styleMsg = '';
						if (retVal != record.deferredExpense) {
							styleMsg = ' style="color:#ff0000" qtip="各项分摊总和与待摊支出不相等" ';
						}
						
						retVal = '<span ' + styleMsg + '>' + retVal + '</span>';
						return retVal;
					},
				cls : 'numberCell'
				},	
				{
					header : '建筑共益费',
					width : 90,
					dataIndex : 'buildPubExpense',
				cls : 'numberCell'
				}, {
					header : '建筑专属费',
					width : 90,
					dataIndex : 'buildExclExpense',
				cls : 'numberCell'
				}, {
					header : '安装共益费',
					width : 90,
					dataIndex : 'installPubExpense',
				cls : 'numberCell'
				}, {
					header : '安装专属费',
					width : 90,
					dataIndex : 'installExclExpense',
				cls : 'numberCell'
				}, {
					header : '设备共益费',
					width : 90,
					dataIndex : 'equPubExpense',
				cls : 'numberCell'
				}, {
					header : '设备专属费',
					width : 90,
					dataIndex : 'equExclExpense',
				cls : 'numberCell'
				}, {
					header : '专属费性质及范围',
					width : 110,
					dataIndex : 'exclProperties'
				}],
		loader : treeLoader,
		root : root,
		rootVisible : false

	});

	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				var id = node.attributes.bdgid;

				if (!id)
					id = rootId;
				treeLoader.baseParams.parent = id;
			});

	// 点击事件
	treePanel.on('click', function(node, event) {
				if (node == null)
					return;

				// 保存按钮可用
				if ( node.isLeaf() ){
					saveBtn.setDisabled(false);
					autoCaclBtn.setDisabled(false);
				}
				else{
					saveBtn.setDisabled(true);
					autoCaclBtn.setDisabled(true);
				}
				

				curNodeId = node.id;
				parentNodeId = node.parentNode.id;

				// 生成当前记录对象
				var curReport = new FAOutcomeApp(node.attributes);

				// 将记录填充进form
				formPanel.getForm().loadRecord(curReport);

			});

	// 右键菜单绑定
	treePanel.on('contextmenu', menuShow, this);

	// 菜单事件监听
	function menuHandler(menu) {
		switch (menu.id) {

		}

	}

	function menuShow(node, e) {
		node.fireEvent("click", node, e)

	}

	// 主面板
	contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : [
						'<span style="color:#15428b; font-weight:bold">&nbsp;'
								+ treePanelTitle + '</span>', '-', {
							iconCls : 'icon-expand-all',
							tooltip : '展开全部节点',
							handler : function() {
								root.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '收起全部节点',
							handler : function() {
								root.collapse(true);
							}
						}],
				items : [treePanel, formPanel]
			});

	// 创建viewport
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]

			});

});