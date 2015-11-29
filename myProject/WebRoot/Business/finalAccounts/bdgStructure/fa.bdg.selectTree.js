var selectTreePanel;
var panelTitle = '';
var data;
var selectedId;
var rootName = '概算项目';
var servletName = 'servlet/BdgStructureServlet';
var selectRoot;
var bdgType;

Ext.onReady(function() {


	btnConfirm = new Ext.Button({
				text : '确定选择',
				iconCls : 'save',
				handler : function() {
					var nodes = selectTreePanel.getChecked('bdgid');
					var bdgnos = selectTreePanel.getChecked('bdgno');
					var names = selectTreePanel.getChecked('bdgname');
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
						setSelectedBdg(nodes[0], bdgnos[0],names[0]);
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
					treeName : "bdgSelectTree",
					businessName : "faBdgStructureService",
					parent : 0,
					pid : pid
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
						}],
				loader : selectTreeLoader,
				root : selectRoot,
				rootVisible : false
			});
	// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
	selectTreeLoader.on('beforeload', function(selectTreeLoader, node) {
				var bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				selectTreeLoader.baseParams.parent = bdgid;
			})
			
	function closeWin(){
		
					var win = selectTreePanel.findParentByType('window');
					if ( win ){
						win.hide();
					}
					
				
	}

	// 保存选择节点
	function setSelectedBdg(bdgid, bdgNo, bdgName) {
		switch (bdgType){
			case 'build':
				buildBdgField.setValue(bdgid);
				buildBdgTrigger.setValue(bdgNo);
				buildNameField.setValue(bdgName);
				break;
				
			case 'equip':
			equipBdgField.setValue(bdgid);
			equipBdgTrigger.setValue(bdgNo);
				equipNameField.setValue(bdgName);
				break;
			case 'install':
			installBdgField.setValue(bdgid);
			installBdgTrigger.setValue(bdgNo);
				installNameField.setValue(bdgName);
				break;
			case 'other':
			otherBdgField.setValue(bdgid);
			otherBdgTrigger.setValue(bdgNo);
				otherNameField.setValue(bdgName);
				break;
		}
		

	}

	// 取消对应 
	function cancelSelect() {
		switch (bdgType){
			case 'build':
				buildBdgField.setValue(null);
				buildBdgTrigger.setValue(null);
				buildNameField.setValue(null);
				break;
				
			case 'equip':
				equipBdgField.setValue(null);
				equipBdgTrigger.setValue(null);
				equipNameField.setValue(null);
				break;
			case 'install':
				installBdgField.setValue(null);
				installBdgTrigger.setValue(null);
				installNameField.setValue(null);
				break;
			case 'other':
				otherBdgField.setValue(null);
				otherBdgTrigger.setValue(null);
				otherNameField.setValue(null);
				break;
		}
		closeWin();

	}
	

// selectTreePanel.render();
// selectTreePanel.expand();
// selectRoot.expand();

});
