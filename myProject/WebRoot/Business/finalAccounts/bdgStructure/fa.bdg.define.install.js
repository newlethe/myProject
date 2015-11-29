/**
 * 工程项目定义（安装工程，其它工程）
 * 
 * @type
 */
var treePanel, treeLoader, contentPanel;
var root;
var treePanelTitle = "工程项目定义";
var rootText = "所有概算";
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
					defTreeType : defTreeType
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
