var treePanel, treeLoader;
var root;
var rootText = "安全检查表项目分类";
var beanName = "com.sgepit.pmis.safeManage.hbm.SafeExamineType";
var business = "safeManageMgmImpl";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var SPLITString = "~"
var treeid;
var parenttemp;
var tmp_parent;
var BillState = new Array();
Ext.onReady(function() {

	root = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form'
			})

	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "safeTypeTree",
					businessName : business,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanel = new Ext.tree.ColumnTree({
				id : 'zl-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				width : 200,
				minSize : 275,
				maxSize : 400,
				split : true,
				frame : false,
				header : false,
				border : false,
				lines : true,
				autoScroll : true,
				animate : false,
				tbar : [{
							iconCls : 'icon-expand-all',
							tooltip : '全部展开',
							handler : function() {
								root.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '全部折叠',
							handler : function() {
								root.collapse(true);
							}
						}],
				columns : [{
							header : '类型名称',
							width : 400,
							dataIndex : 'mc'
						}, {
							header : '类型编号',
							width : 0,
							dataIndex : 'treeid',
							renderer : function(value) {
								return "<div id='treeid'>" + value + "</div>";
							}
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isleaf',
							renderer : function(value) {
								return "<div id='isleaf'>" + value + "</div>";
							}
						}, {
							header : '编码',
							width : 0,
							dataIndex : 'bm',
							renderer : function(value) {
								return "<div id='bm'>" + value + "</div>";
							}
						}, {
							header : '上级类型编号',
							width : 0,
							dataIndex : 'parent',
							renderer : function(value) {
								return "<div id='parent'>" + value + "</div>";
							}
						}],
				loader : treeLoader,
				root : root,
				rootVisible : false
			});

	treePanel.on('beforeload', function(node) {
				var treenode = node.attributes.treeid;
				if (treenode == null)
					treenode = 'root';
				var baseParams = treePanel.loader.baseParams
				baseParams.parent = treenode;

			})

	treePanel.on('contextmenu', contextmenu, this);

	var fm = Ext.form;
	var fc = {
		'treeid' : {
			name : 'treeid',
			fieldLabel : '类型编号',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'mc' : {
			name : 'mc',
			fieldLabel : '分类名称<font color=\'red\'>*</font>',
			disabled : true,
			allowBlank : false,
			anchor : '95%'
		},
		'isleaf' : {
			name : 'isleaf',
			fieldLabel : '是否子节点',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'bm' : {
			name : 'bm',
			fieldLabel : '编码',
			readOnly : true,
			anchor : '95%'
		},
		'parent' : {
			name : 'parent',
			fieldLabel : '上级类型编号',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}
	}

	var Columns = [{
				name : 'treeid',
				type : 'string'
			}, {
				name : 'mc',
				type : 'string'
			}, {
				name : 'isleaf',
				type : 'float'
			}, {
				name : 'bm',
				type : 'string'
			}, {
				name : 'parent',
				type : 'string'
			}];

	var saveBtn = new Ext.Button({
				name : 'save',
				text : '保存',
				iconCls : 'save',
				handler : formSave,
				disabled : true
			})

	var formPanel = new Ext.FormPanel({
				id : 'form-panel',
				header : false,
				width : 400,
				height : 200,
				split : true,
				collapsible : true,
				collapseMode : 'mini',
				minSize : 300,
				maxSize : 400,
				border : false,
				region : 'east',
				bodyStyle : 'padding:10px 10px; border:0px dashed #3764A0',
				iconCls : 'icon-detail-form',
				labelAlign : 'left',
				items : [
						new Ext.form.FieldSet({
									title : '基本信息',
									layout : 'form',
									border : true,
									items : [
											new fm.TextField(fc['treeid']),
							                new fm.TextField(fc['mc']),
							                new fm.TextField(fc['bm']),      
											saveBtn]
								}), new fm.TextField(fc['isleaf']),
						            new fm.TextField(fc['parent'])

				]
			});

	function formSave() {
		saveBtn.setDisabled(true);
		var form = formPanel.getForm();
		form.findField("bm").disable();
		form.findField("mc").disable();
		if (form.isValid()) {
			if (formPanel.isNew) {
				doFormSave(false, tmpLeaf)
			} else {
				doFormSave(true, tmpLeaf)
			}
		}
	}

	function doFormSave(isNew, leaf) {
		var form = formPanel.getForm();
		var obj = new Object();

		for (var i = 0; i < Columns.length; i++) {
			var name = Columns[i].name;
			var field = form.findField(name);
			if (field) {
				obj[name] = field.getValue();
			}
		}
		treePanel.getEl().mask("loading...");
		safeManageMgmImpl.addOrUpdate(obj, function(flag) {
					if ("0" == flag) {
						var node = isNew && !tmpNode.isLeaf()
								? tmpNode
								: tmpNode.parentNode;
						if (isNew) {
							/*
							 * var treeData = node.text == rootText ? "root" :
							 * node.attributes.treeid; var baseParams =
							 * treePanel.loader.baseParams baseParams.parent =
							 * treeData;
							 */
						}
						if (node.isExpanded()) {
							treeLoader.load(node);
							node.expand();
						} else {
							node.expand();
						}
						Ext.example.msg('保存成功！', '您成功保存了一条信息！');
					} else {
						Ext.Msg.show({
									title : '提示',
									msg : '数据保存失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
					treePanel.getEl().unmask("loading...");
				});
	}

	var treeMenu

	function contextmenu(node, e) {
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (!treeMenu) {
			treeMenu = new Ext.menu.Menu({
						id : 'treeMenu',
						width : 100,
						items : [{
									id : 'menu_add',
									text : '　新增',
									value : node,
									iconCls : 'add',
									handler : toHandler
								}, '-', {
									id : 'menu_update',
									text : '　修改',
									value : node,
									iconCls : 'btn',
									handler : toHandler
								}, '-', {
									id : 'menu_del',
									text : '　删除',
									value : node,
									iconCls : 'remove',
									handler : toHandler
								}]
					});
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if (isRoot) {
			// treeMenu.items.get("menu_add").disable();
			// treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			// treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}

	function toHandler() {
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("treeid").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		var tid = elNode.all("treeid").innerText;
		var bm = elNode.all("bm").innerText;
		
		var maxbm;
		DWREngine.setAsync(false);
		safeManageMgmImpl.getMaxBm(tid,bm,function(value){
			maxbm = value;
		})
		DWREngine.setAsync(true);
		if ("　新增" == state) {
			saveBtn.setDisabled(false);
			var formRecord = Ext.data.Record.create(Columns);
			loadFormRecord = new formRecord({
						treeid: null,
						mc: '',
						bm:'',
						isleaf: 1,
						parent: treeid,
						indexid:''
					});
			formPanel.getForm().loadRecord(loadFormRecord);
			var form = formPanel.getForm();
			//form.findField("bm").enable();
			form.findField("mc").enable();
			form.findField("bm").setValue(maxbm);
		} else if ("　删除" == state) {
			// 此处增加对资料分类下资料的查询
			delHandler(menu_isLeaf, menu_nodeId, menu_parent, node);
		} else {
			formPanel.isNew = false
			if (menu_isLeaf == 1) {
				saveBtn.setDisabled(false);
				var form = formPanel.getForm();
				form.findField("bm").enable();
				form.findField("mc").enable();
			}
		}
	}

	function delHandler(leaf, nodeid, parentid, node) {
		if ("0" == leaf) {
			Ext.Msg.show({
						title : '提示',
						msg : '父节点不能进行删除操作！',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.INFO

					});
		} else {
			Ext.Msg.show({
				title : '提示',
				msg : '是否删除' + node.attributes.mc,
				buttons : Ext.Msg.YESNO,
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						treePanel.getEl().mask("loading...");
						safeManageMgmImpl.deleteChildNode(nodeid, function(flag) {
							if ("0" == flag) {
								var formDelRecord = Ext.data.Record
										.create(Columns);
								var flag = (node.parentNode.childNodes.length == 1)
								var pNode = flag
										? node.parentNode.parentNode
										: node.parentNode

								var formRecord = Ext.data.Record
										.create(Columns);
								var emptyRecord = new formRecord({
										treeid: null,
										mc: '',
										bm:'',
										isleaf: 1,
										parent: '',
										indexid:''
										});
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();
								if (flag) {
									var parent = pNode.attributes.treeid;
									var baseParams = treePanel.loader.baseParams
									baseParams.parent = parent;
								}

								treeLoader.load(pNode);
								pNode.expand();
								Ext.example.msg('删除成功！', '您成功删除了一条信息！');
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
			})
		}
	}

	treePanel.on('click', onClick);

	function onClick(node, e) {
		tmp_parent = null;
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		tmp_parent = menu_isLeaf;
		var menu_id = isRoot ? "0" : elNode.all("treeid").innerText;
		treeid = elNode.all("treeid").innerText;
		parenttemp = elNode.all("parent").innerText;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		saveBtn.setDisabled(true);
		var form = formPanel.getForm();
		form.findField("bm").disable();
		form.findField("mc").disable();
		DWREngine.setAsync(false);
		baseMgm.findById(beanName, menu_id, function(obj) {
					loadFormRecord = new formRecord(obj);
				});
		DWREngine.setAsync(true);
		tmpNode = node;
		tmpLeaf = menu_isLeaf;
		formPanel.getForm().loadRecord(loadFormRecord);
	}

	contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				// tbar : [],
				items : [treePanel, formPanel]

			})

	if (Ext.isAir) { // 创建viewpor
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

	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand(); // 展开

});