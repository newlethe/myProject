var selectTreePanel;
var panelTitle = '选择对应科目';
var selectedIds;
var selectRoot;
var rootName = '财务科目';
var servletName = 'servlet/FAFinanceServlet';
var subjectRootId = '0000';
var currentPid = CURRENTAPPID;
btnConfirm = new Ext.Button({
			text : '确定选择',
			iconCls : 'save',
			handler : function() {
				var subIds = selectTreePanel.getChecked('uids');

				if (subIds.length == 0) {
					return;
				}

				setSubjectsToBdg(subIds);

			}
		});

var btnReturn = new Ext.Button({
			text : '关闭',
			tooltip : '关闭窗口',
			iconCls : 'icon-delete',
			handler : closeWin
		});

// 根节点
selectRoot = new Ext.tree.AsyncTreeNode({
			text : rootName,
			iconCls : 'form',
			id : '0' // 注意：财务科目根节点
		});

// 节点Loader
var selectTreeLoader = new Ext.tree.TreeLoader({
			url : MAIN_SERVLET,
			baseParams : {
				ac : "columntree",
				treeName : "subjectSortSelectTree",
				businessName : "financeSortService",
				parent : '0',
				pid : currentPid
			},
			clearOnLoad : true,
			uiProviders : {
				'col' : Ext.ux.ColumnTreeCheckNodeUI,
				'plain' : Ext.tree.ColumnTreeNodeUI
			}
		});
selectTreePanel = new Ext.tree.ColumnTree({
			id : 'subject-select-tree-panel',
			iconCls : 'icon-by-category',
			region : 'center',
			width : 800,
			minSize : 275,
			maxSize : 600,
			frame : false,
			header : false,
			checkModel : 'cascade',
			onlyLeafCheckable : false,// 所有结点可选，如果不需要checkbox,该属性去掉
			tbar : ['财务科目', '-', {
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
					}, '-', btnConfirm, '-', btnReturn],
			border : false,
			rootVisible : false,
			lines : true,
			autoScroll : true,
			animate : false,
			columns : [{
						header : '科目名称',
						width : 200,
						dataIndex : 'subName'

					}, {
						header : '科目编号',
						width : 100,
						dataIndex : 'subNo'
					}, {
						header : '科目全称',
						width : 250,
						dataIndex : 'fullName'
					}],
			loader : selectTreeLoader,
			root : selectRoot,
			rootVisible : false
		});
// 覆盖每个节点的Loader，将相应的节点id作为parent参数发送请求
selectTreeLoader.on('beforeload', function(selectTreeLoader, node) {
			var uids = node.attributes.uids;
			if (uids == null)
				uids = subjectRootId;
			selectTreeLoader.baseParams.parent = uids;
		});

function closeWin() {

	var win = selectTreePanel.findParentByType('window');
	if (win) {
		win.hide();
	}

}

// 将选择的科目对应到当前选择的概算
function setSubjectsToBdg(subIds) {
	Ext.Ajax.request({
				method : 'post',
				url : servletName,
				params : {
					ac : 'setSubjectRefBdg',
					bdgid : curBdgid,
					subIds : subIds
				},
				success : function(result, request) {
					closeWin();
					reloadSubRefGrid(curBdgid);
					Ext.example.msg('保存成功！', '保存成功!');
				},
				failure : function(result, request) {
					Ext.Msg.show({
								title : '保存失败',
								msg : '保存失败',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});

}

function toggleCheck(node, isCheck) {
	if (node) {
		var args = [isCheck];
		node.cascade(function() {
					c = args[0];
					this.ui.toggleCheck(c);
					this.attributes.checked = c;
				}, null, args);
	}
}
