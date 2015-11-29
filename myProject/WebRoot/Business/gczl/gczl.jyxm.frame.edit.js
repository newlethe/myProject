var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "检验项目结构维护";
var rootText = "验评标准树";
var tempNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;
var checkBgdWin;

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
					treeName : "gczlJyxmTree",
					businessName : "gczlMgmImpl",
					parent : 0,
					pid : CURRENTAPPID
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanel = new Ext.tree.ColumnTree({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				tbar : [{
							id : 'add',
							text : '新增',
							iconCls : 'add',
							handler : toHandler
						}, '-', {
							id : 'update',
							text : '修改',
							iconCls : 'btn',
							handler : toHandler
						}, '-', {
							id : 'del',
							text : '删除',
							iconCls : 'remove',
							handler : toHandler
						}],
				frame : false,
				header : false,
				border : false,
				lines : true,
				autoScroll : true,
				animate : false,
				columns : [{
							header : '检验项目名称',
							width : 450,
							dataIndex : 'xmmc'
						}, {
							header : '主键',
							width : 0, // 隐藏字段
							dataIndex : 'uids',
							renderer : function(value) {
								return "<div id='uids'>" + value + "</div>";
							}
						}, {
							header : '项目工程编号',
							width : 150, // 隐藏字段
							dataIndex : 'xmbh',
							renderer : function(value) {
								return "<div id='xmbh'>" + value + "</div>";
							}
						}, {
							header : '标准项目编号',
							width : 0,
							dataIndex : 'bzxmbh',
							renderer : function(value) {
								return "<div id='bzxmbh'>" + value + "</div>";
							}
						}, {
							header : '工程类别',
							width : 100,
							dataIndex : 'gcType',
							renderer : function(value) {
								var index = gcTypeStore.find('k', value);
								if (index > -1) {
									return gcTypeStore.getAt(index).get('v');
								} else {
									return '';
								}

							}

						}, {
							header : '是否子节点',
							width : 66,
							dataIndex : 'isleaf',
							renderer : function(value) {
								return "<div id='isleaf'>" + value + "</div>";
							}
						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parentbh',
							renderer : function(value) {
								return "<div id='parentbh'>" + value + "</div>";
							}
						}],
				loader : treeLoader,
				root : root,
				rootVisible : false
			});

	treePanel.on('beforeload', function(node) {
				var xmbh = node.attributes.xmbh;
				if (xmbh == null)
					xmbh = '0';
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = xmbh;
				baseParams.pid = CURRENTAPPID;
			})

	function toHandler() {
		if (typeof(tempNode) == "undefined") {
			Ext.Msg.show({
						title : '提示',
						msg : '请选择一条记录!',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.INFO
					});
		} else {
			var isRoot = (rootText == tempNode.text);
			var nodeId = isRoot
					? "0"
					: tempNode.getUI().elNode.all("xmbh").innerText;
			var nodeId_add = isRoot
					? "1"
					: tempNode.getUI().elNode.all("xmbh").innerText;
			formPanel.expand();
			if ("新增" == this.text) {
				saveBtn.setDisabled(false);
				// 获取同一分类编码下最大的BM
				DWREngine.setAsync(false);
				var sql_maxbm = "select max(xmbh)+1 from gczl_jyxm where parentbh='"
						+ nodeId_add + "'"
				var xmbh_add = '';
				baseMgm.getData(sql_maxbm, function(list) {
							xmbh_add = list
						});
				DWREngine.setAsync(true);
				if ( xmbh_add == '' ){
					
					xmbh_add = nodeId_add + '01';
				}
				var formRecord = Ext.data.Record.create(Columns);
				loadFormRecord = new formRecord({
							uids : '',
							xmbh : xmbh_add,
							xmmc : '',
							isleaf : 1,
							parentbh : nodeId_add
						});
				formPanel.isNew = true
				formPanel.getForm().loadRecord(loadFormRecord);
			} else if ("删除" == this.text) {
				delHandler(nodeId, tempNode);
			} else {
				formPanel.isNew = false
				saveBtn.setDisabled(false);
			}
		}
	}

	function delHandler(nodeid, node) {
		var hasChild = true;
		DWREngine.setAsync(false);
		gczlJyxmImpl.isHasChilds(nodeid, function(flag) {
					if (flag) {
						Ext.Msg.show({
									title : '提示',
									msg : '父节点不能直接删除操作！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.INFO
								});
					} else {
						hasChild = false
					}
				})
		DWREngine.setAsync(true);
		// 如果存在子節點，則不執行
		if (hasChild)
			return;
		Ext.Msg.show({
			title : '提示',
			msg : '是否删除' + node.attributes.xmmc + '[' + node.attributes.xmbh
					+ ']',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,

			fn : function(value) {
				if ("yes" == value) {
					treePanel.getEl().mask("loading...");
					gczlJyxmImpl.deleteChildNode(nodeid, function(flag) {
						if ("0" == flag) {
							var formDelRecord = Ext.data.Record.create(Columns);
							var flag = (node.parentNode.childNodes.length == 1)
							var pNode = flag
									? node.parentNode.parentNode
									: node.parentNode

							var formRecord = Ext.data.Record.create(Columns);
							var emptyRecord = new formRecord({
										xmbh : '',
										xmmc : '',
										isleaf : 1,
										parentbh : ""
									});
							formPanel.getForm().loadRecord(emptyRecord);
							formPanel.getForm().clearInvalid();

							if (flag) {
								var xmbh = pNode.attributes.xmbh;
								var baseParams = treePanel.loader.baseParams
								baseParams.parent = xmbh;
							}
							treeLoader.load(pNode);
							pNode.expand();
							Ext.example.msg('删除成功！', '您成功删除了一条项目检验信息！');
						} else {
							Ext.Msg.show({
										title : '提示',
										msg : '数据删除失败！',
										buttons : Ext.Msg.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
						treePanel.getEl().unmask();
					});
				}
			}
		});

	}

	treePanel.on('click', onClick);
	function onClick(node, e) {
		tempNode = node
		var uids = (node == root)
				? "0"
				: node.getUI().elNode.all("uids").innerText;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		DWREngine.setAsync(false);
		baseMgm.findById(beanName, uids, function(obj) {
					loadFormRecord = new formRecord(obj);
				});
		DWREngine.setAsync(true);
		formPanel.getForm().loadRecord(loadFormRecord);
		saveBtn.setDisabled(true);
	}

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				items : [treePanel, formPanel]
			})

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});

	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand();

});