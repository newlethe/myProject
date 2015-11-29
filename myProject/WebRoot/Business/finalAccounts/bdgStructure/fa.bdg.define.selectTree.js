/**
 * 工程项目定义中选择基座对应的安装工程窗口
 * 
 */

var selectTreePanel;
var panelTitle = '';
var data;
var selectedId;
var rootName = '安装工程';
var servletName = 'servlet/BdgStructureServlet';
var selectRoot;
var rootParentId;	// 根节点ID，选择安装工程则为0102

Ext.onReady(function() {

	rootParentId = '0102';

	btnConfirm = new Ext.Button({
				text : '确定选择',
				iconCls : 'save',
				handler : function() {
					var nodes = selectTreePanel.getChecked('bdgid');
		
					if ( nodes.length == 0 ){
						return;
					}
					else if ( nodes.length > 1 ){
						Ext.Msg.show({
								title : '选择概算',
								msg : '只能选择一条概算',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.WARNING
							});
					}
					else{
						setSelectedBdg(nodes[0]);
						closeWin();
					}
					// addSelApps(nodes);
				}
			})

	var btnReturn = new Ext.Button({
				text : '关闭',
				tooltip : '关闭窗口',
				iconCls : 'icon-delete',
				handler : closeWin
			});
			
	var btnCancel = new Ext.Button({
		text : '取消对应',
		iconCls : 'remove',
		handler : cancelSelect
	});

	// 根节点
	selectRoot = new Ext.tree.AsyncTreeNode({
				text : rootName,
				iconCls : 'form',
				id : '0' // 重要 : 展开第一个节点 !!
			})

	// 节点Loader
	var selectTreeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgSelectTreeToLevel",
					businessName : "faBdgStructureService",
					parent : rootParentId,
					level : 7,
					pid : CURRENTAPPID
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.ux.ColumnTreeCheckNodeUI,
					'plain' : Ext.tree.ColumnTreeNodeUI
				}
			});
	selectTreePanel = new Ext.tree.ColumnTree({
				id : 'budget-select-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				width : 800,
				minSize : 275,
				maxSize : 600,
				frame : false,
				header : false,
				checkModel : 'single',
				onlyLeafCheckable : false,// 所有结点可选，如果不需要checkbox,该属性去掉
				tbar : [
						'概算结构', '-', {
							iconCls : 'icon-expand-all',
							tooltip : '展开全部节点',
							handler : function() {
								selectRoot.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '收起全部节点',
							handler : function() {
								selectRoot.collapse(true);
							}
						}, '-', btnConfirm, btnCancel,'-', btnReturn],
				border : false,
				rootVisible : false,
				lines : true,
				autoScroll : true,
				animate : false,
				columns : [{
							header : '概算名称',
							width : 350,
							dataIndex : 'bdgname'
						},{
							header : '编号',
							width : 150,
							dataIndex : 'bdgno'
						},
						{ header : '金额',
							width : 150,
							dataIndex : 'bdgmoney',
							renderer : cnMoney
						}
						],
				loader : selectTreeLoader,
				root : selectRoot,
				rootVisible : false
			});
	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	selectTreeLoader.on('beforeload', function(selectTreeLoader, node) {
				var bdgid = node.attributes.bdgid;
				if (!bdgid)
					bdgid = rootParentId;
				selectTreeLoader.baseParams.parent = bdgid;
			})
			
	function closeWin(){
		
					var win = selectTreePanel.findParentByType('window');
					if ( win ){
						win.hide();
					}
					
				
	}

	// 保存选择节点
	function setSelectedBdg(coBdgid) {
		setCorrespondBdg(coBdgid);
	}

	function cancelSelect(){
		setCorrespondBdg(null);
		closeWin();
	}
	

// selectTreePanel.render();
// selectTreePanel.expand();
// selectRoot.expand();

});
