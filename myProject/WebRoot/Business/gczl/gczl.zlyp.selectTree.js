var treePanel
var data;
var idS = new Array();
var rootName = '检验项目';
var servletName = 'servlet/ZlypServlet';
var root;

Ext.onReady(function() {

	Ext.lib.Ajax.defaultPostHeader += ";charset=utf-8";

	btnConfirm = new Ext.Button({
				text : '添加单位工程',
				iconCls : 'save',
				tooltip : '添加选择的单位工程到统计报表',
				handler : function() {
					var nodes = treePanel.getChecked('xmbh');
					if ( nodes.length > 0 )
					addSelApps(nodes);
				}
			})

	var btnReturn = new Ext.Button({
				text : '关闭',
				tooltip : '关闭窗口',
				iconCls : 'icon-delete',
				handler : closeWin
			});

	// 根节点
	root = new Ext.tree.AsyncTreeNode({
				text : rootName,
				iconCls : 'form',
				id : '0' // 重要 : 展开第一个节点 !!
			})

	// 节点Loader
	treeLoader = new Ext.tree.TreeLoader({
				url : servletName,
				baseParams : {
					ac : "dwprj-select-tree",
					treeName : "BudgetSelectTree",
					statid : statId
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
						'单位工程', '-', {
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
							header : '单位工程名称',
							width : 350,
							dataIndex : 'xmmc'
						},{
							header : '编号',
							width : 150,
							dataIndex : 'xmbh'
						}],
				loader : treeLoader,
				root : root,
				rootVisible : false
			});
	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	treeLoader.on('beforeload', function(treeLoader, node) {
				var xmbh = node.attributes.xmbh;
				if (xmbh == null)
					xmbh = '0';
				treeLoader.baseParams.parent = xmbh;
				treeLoader.baseParams.statid = statId;
			})
			
	function closeWin(){
		
					var win = treePanel.findParentByType('window');
					if ( win ){
						win.hide();
					}
					
				
	}

	// 保存选择节点
	function addSelApps(nodeIds) {
		
		Ext.Ajax.request({
					method : 'post',

					url : servletName,
					params : {
						ac : 'add-dwprj-nodes',
						statid : statId,
						ids : nodeIds
					},
					success : function(result, request) {
						
						// alert('successs');
						closeWin();
						window.frames["xgrid"].doReload();
						
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

	}

	

// treePanel.render();
// treePanel.expand();
// root.expand();

});
