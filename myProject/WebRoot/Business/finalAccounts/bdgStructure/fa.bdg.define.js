/**
 * 工程项目定义（建筑工程）
 * @type 
 */
var treePanel, treeLoader, contentPanel;
var root;
var treePanelTitle = "工程项目定义";
var rootText = "所有概算";
var rootParentId = '0101';
var servletName = "servlet/BdgStructureServlet";
var currentBdgid;
var selectBdgWin;

Ext.onReady(function() {
	
	
	
	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0' // 重要 : 展开第一个节点 !!
			})
	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgAppDefineTree",
					businessName : "faBdgStructureService",
					parent : rootParentId,
					pid : CURRENTAPPID,
					defTreeType : 'build'
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanel = new Ext.tree.ColumnTree({
				id : 'bdg-define-tree-panel',
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
				columns : [{
							header : '概算名称',
							width : 350,
							dataIndex : 'bdgname'
						}, {
							header : '财务编码',
							width : 150,
							dataIndex : 'bdgno'
						}, {
							header : '是否竣工',
							width : 70,
							dataIndex : 'isfinish',
							renderer : checkColRender

						}, {
							header : '对应项目编号',
							width : 150,
							dataIndex : 'cobdgno'
						}, {
							header : '基座费',
							width : 150,
							dataIndex : 'cobdgname'
						}, {
							header : '选择对应项目',
							width : 90,
							dataIndex : 'isleaf',
							renderer : coBdgRender
						}],
				loader : treeLoader,
				root : root,
				rootVisible : false
			});

	treePanel.on('beforeload', function(node) {
				var bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '-1';
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = bdgid;
			})

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel]
			});
	treePanel.render(); // 显示树
	root.expand();


	function checkColRender(value) {
		if (value == '1') {
			return '<div id="colChecker" class="x-grid3-check-col-on">&#160;</div>'
		} else {
			return '<div id="colChecker" class="x-grid3-check-col" >&#160;</div>'
		}
	}
	function coBdgRender(value) {
		// if (value == 1){
		return '<div id="coBdgSelect" class="coBdg" style="color:#15428b;font-weight:bold" >选择对应项目</div>'
		// }else{
		// return ''
		// }
	}

	treePanel.on("click", function(node, e) {

		var chx = e.getTarget()

		if (chx.id && chx.id.indexOf("Checker") > 0) {
			chx.className = chx.className == "x-grid3-check-col-on"
					? "x-grid3-check-col"
					: "x-grid3-check-col-on";
			var checked = chx.className == "x-grid3-check-col-on";
			var finish = checked ? 1 : 0;
			deepCheck(node, chx.id, checked);
			treePanel.getEl().mask('正在保存...');

			Ext.Ajax.request({
						method : 'post',
						url : servletName,
						params : {
							ac : 'setFinish',
							bdgid : node.id,
							finish : finish
						},
						success : function(result, request) {
							treePanel.getEl().unmask();
						},
						failure : function(result, request) {
							treePanel.getEl().unmask();

						}

					});

		}
		// ---------------------------------------------对应概算项-------------------------
		if (chx.id && chx.id.indexOf("Bdg") > 0) {
			currentBdgid = node.id;
			showSelectBdgWin();
		}
			// ------------------------------------------------------------------------------
		});

	function checkerClick(chx, flag) {
		if (chx.className != "") {
			var checked = chx.className == "x-grid3-check-col-on"

			if (typeof(flag) == "undefined")
				chx.className = checked
						? "x-grid3-check-col"
						: "x-grid3-check-col-on"
			else
				chx.className = flag
						? "x-grid3-check-col-on"
						: "x-grid3-check-col"
		}
	}

	function deepCheck(node, id, checked) {

		for (var i = 0; i < node.childNodes.length; i++) {
			var child = node.childNodes[i];
			var elNode = child.getUI().elNode;
			var chx = elNode.all(id)
			checkerClick(chx, checked)
			deepCheck(child, id, checked)
		}
	}

	

});

function setCorrespondBdg(coBdgid){
	treePanel.getEl().mask('正在保存...');
	Ext.Ajax.request({
						method : 'post',
						url : servletName,
						params : {
							ac : 'setCorrespondBdg',
							bdgid : currentBdgid,
							coBdgid : coBdgid
						},
						success : function(result, request) {
							var curNode = treePanel.getNodeById(currentBdgid);
							if ( curNode ){
								if ( curNode.parentNode ){
									treeLoader.load(curNode.parentNode, function(p, newNode){
										//curNode.select();
										newNode.expand();
										var newCurNode = newNode.findChild('bdgid', currentBdgid);
										if ( newCurNode ){
											newCurNode.select();
										}
									});
									
								}
							}
							treePanel.getEl().unmask();
						},
						failure : function(result, request) {
							treePanel.getEl().unmask();

						}

					});
}

function showSelectBdgWin() {
	if (!selectBdgWin) {
		selectBdgWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 500,
					height : 500,
					title : '选择对应的安装工程',
					modal : true,
					maximizable : true,
					closeAction : 'hide',
					plain : true,
					items : [selectTreePanel]
				});
	}

	selectRoot.reload(function() {
				selectRoot.expandChildNodes();
			});

	selectBdgWin.show();

}