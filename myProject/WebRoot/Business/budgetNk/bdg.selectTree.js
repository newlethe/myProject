var treePanel
var data;
var idS = new Array();
var win;
var viewport;
var currentPid = CURRENTAPPID;

Ext.onReady(function() {

	Ext.lib.Ajax.defaultPostHeader += ";charset=utf-8";

	btnConfirm = new Ext.Button({
				text : '确定选择',
				iconCls : 'save',
				handler : function() {
					var nodes = treePanel.getChecked('bdgid');
					if ( nodes.length > 0 )
					addSelApps(nodes);
				}
			})

	var btnReturn = new Ext.Button({
				text : '返回',
				iconCls : 'returnTo',
				handler : function(){
					history.back();
				}
			});

	// 根节点
	root = new Ext.tree.AsyncTreeNode({
				text : '概算信息',
				iconCls : 'form',
				id : '0' // 重要 : 展开第一个节点 !!
			})

	// 节点Loader
	treeLoader = new Ext.tree.TreeLoader({
				url : 'servlet/BudgetNkServlet',
				baseParams : {
					ac : "checkBoxColumnTree",
					treeName : "BudgetSelectTree",
					parent : 0,
					conid : conid,
					pid : currentPid
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.ux.ColumnTreeCheckNodeUI,
					'plain' : Ext.tree.ColumnTreeNodeUI
				}
			});
	treePanel = new Ext.tree.ColumnTree({
				id : 'budget-select-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				width : 800,
				minSize : 275,
				maxSize : 600,
				frame : false,
				header : false,
				checkModel : 'cascade',// 级联多选，如果不需要checkbox,该属性去掉
				onlyLeafCheckable : false,// 所有结点可选，如果不需要checkbox,该属性去掉
				tbar : [
						'<font color=#15428b><b>&nbsp;合同: ' + conname
								+ '</b></font> 选择概算', '-', {
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
						}, '-', btnConfirm, '-', btnReturn],
				border : false,
				rootVisible : true,
				lines : true,
				autoScroll : true,
				animate : false,
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
							width : 0,
							dataIndex : 'totalMoney',
							cls : 'numberCell',
							renderer : cnMoneyToPrec
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
				treeLoader.baseParams.conid = conid;
			})

	// 保存选择节点
	function addSelApps(nodeIds) {
		treePanel.getEl().mask('正在保存...');
		Ext.Ajax.request({
					method : 'post',

					url : 'servlet/BudgetMoneyAppServlet',
					params : {
						ac : 'saveApps',
						conid : conid,
						ids : nodeIds
					},
					success : function(result, request) {
						treePanel.getEl().unmask();
						viewport.hide();
						window.location.href = BASE_PATH
								+ "Business/budgetNk/bdg.money.apportion.jsp?conid="
								+ conid + "&conname="
								+ encodeURIComponent(conname) + "&conmoney="
								+ conmoney;
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

	}

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel]
			});

	treePanel.render();
	treePanel.expand();
	root.expand();

});
