var treeGrid, treeLoader, contentPanel;
var store;
var treePanelTitle = "财务科目维护";
var servletName = "servlet/FACompleteServlet";
var business = 'faBaseInfoService';
var beanName = 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompFinanceSubject';
var selectedPath;

Ext.onReady(function() {

	var Columns = [{
				header : '主键',
				dataIndex : 'uids',
				hidden : true
			}, {
				header : '节点id',
				dataIndex : 'treeid',
				hidden : true
			}, {
				id : 'subjectName',
				header : '科目名称',
				width : 450,
				dataIndex : 'subjectName'
			}, {
				header : '财务编码',
				width : 300,
				dataIndex : 'subjectBm'
			},  {
				header : '科目全称',
				width : 300,
				dataIndex : 'subjectAllname'
			},{
				header : '备注',
				width : 300,
				dataIndex : 'remark'
			}, {
				header : '项目id',
				dataIndex : 'pid',
				hidden : true
			}, {
				header : '是否是叶子节点',
				dataIndex : 'isleaf',
				hidden : true
			}];

	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentid',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'financeSubjectTree',// 后台java代码的业务逻辑方法定义
					business : business,// spring 管理的bean定义
					bean : beanName,// gridtree展示的bean
					params : 'pid' + SPLITB + pid + SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeid', // 此id作为ds.paramNames.active_node
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ['uids', 'pid', 'treeid', 'subjectName',
									'subjectBm', 'subjectAllname', 'remark',
									'parentid', 'isleaf']
						}),
				listeners : {
					'beforeload' : function(ds, options) {
						var parent = null;
						if (options.params[ds.paramNames.active_node] == null) {
							options.params[ds.paramNames.active_node] = '0';
							parent = "0"; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds.paramNames.active_node];
						}
						ds.baseParams.params = 'pid' + SPLITB + pid + ";parent"
								+ SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});
	store.setDefaultSort('subjectBm','asc');

	treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'subject-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'subjectName',// 此项为列的id，定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				columns : Columns,
				stripeRows : true,
				tbar : [
						'<span style="color:#15428b; font-weight:bold">&nbsp;'
								+ treePanelTitle + '</span>', '-', {
							iconCls : 'icon-expand-all',
							tooltip : '展开全部节点',
							handler : function() {
								store.expandAllNode();
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : '收起全部节点',
							handler : function() {
								store.collapseAllNode();
							}
						}]
			});

	store.on("load", function(ds1, recs) {
				if (selectedPath) {
					store.expandPath(selectedPath, "uids");
				} else {
					if (ds1.getCount() > 0) {
						var rec1 = ds1.getAt(0);
						if (!ds1.isExpandedNode(rec1)) {
							ds1.expandNode(rec1);
						}
					}
				}
			});

	treeGrid.on('click', function() {
				// 生成当前记录对象，点击空白也进入，必须加判断
				if (treeGrid.getSelectionModel().getSelected()) {
					var rec = treeGrid.getSelectionModel().getSelected();
					if (rec && rec.get('treeid') == '01') {
						saveBtn.setDisabled(true);
						formPanel.collapse();
					} else {
						formPanel.getForm().loadRecord(rec);
						formFieldSet.setTitle(formPanelTitle);
						var parentSubj = store.getNodeParent(rec);
						if(parentSubj){
							formPanel.getForm().findField('parentName').setValue(parentSubj.get('subjectName'));
							formPanel.getForm().findField('parentBm').setValue(parentSubj.get('subjectBm'));
							formPanel.getForm().findField('parentAllName').setValue(parentSubj.get('subjectAllname'));
						}
						saveBtn.setDisabled(false);
					}
				}
			});
	// 右键菜单绑定
	treeGrid.on('rowcontextmenu', contextmenu, this);

	function contextmenu(thisGrid, rowIndex, e) {
		// e.preventDefault();//阻止系统默认的右键菜单
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var treeid = record.get("treeid");
		var isleaf = record.get("isleaf");
		var isRoot = (treeid == '01');
		var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
			handler : toHandler
		};
		var menuUpdate = {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			handler : toHandler
		};
		var menuDelete = {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			handler : toHandler
		};
		var items = [menuAdd, menuUpdate, menuDelete];
		var treeMenu = new Ext.menu.Menu({
					id : 'treeMenu',
					width : 100,
					items : items
				});
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_del").enable();
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
	}

	// 菜单事件监听
	function toHandler(node) {
		switch (node.id) {
			case 'menu_add' :
				var rec = treeGrid.getSelectionModel().getSelected();
				// 将记录填充进form
				var formRecord = Ext.data.Record.create(Columns);
				loadFormRecord = new formRecord({
							uids : null,
							pid : pid,
							treeid : null,
							subjectName : null,
							subjectBm : null,
							subjectAllname : null,
							remark : null,
							parentid : rec.get('treeid'),
							isleaf : 1
						});
				formPanel.getForm().loadRecord(loadFormRecord);
				formFieldSet.setTitle('添加财务科目');
				formPanel.expand();
				formPanel.getForm().findField('parentName').setValue(rec.get('subjectName'));
				formPanel.getForm().findField('parentBm').setValue(rec.get('subjectBm'));
				formPanel.getForm().findField('parentAllName').setValue(rec.get('subjectAllname'));
				saveBtn.setDisabled(false);
				break;
			case 'menu_update' :
				var rec = treeGrid.getSelectionModel().getSelected();
				// 将记录填充进form
				formPanel.getForm().loadRecord(rec);
				formFieldSet.setTitle(formPanelTitle);
				formPanel.expand();
				var parentSubj = store.getNodeParent(rec);
				if(parentSubj){
					formPanel.getForm().findField('parentName').setValue(parentSubj.get('subjectName'));
					formPanel.getForm().findField('parentBm').setValue(parentSubj.get('subjectBm'));
					formPanel.getForm().findField('parentAllName').setValue(parentSubj.get('subjectAllname'));
				}
				saveBtn.setDisabled(false);
				break;
			case 'menu_del' :
				var rec = treeGrid.getSelectionModel().getSelected();
				if (rec.get('isleaf') == 0) {
					Ext.example.msg('提示', '此节点下有子节点,不可删除!')
					break;
				} else {
					var uids = rec.get('uids');
					var parentid = rec.get('parentid');
					Ext.Msg.show({
						title : '删除节点',
						msg : '确认删除该节点?',
						buttons : Ext.Msg.YESNO,
						icon : Ext.MessageBox.QUESTION,

						fn : function(value) {
							if (value == 'yes') {
								treeGrid.getEl().mask("loading...");
								Ext.Ajax.request({
											method : 'post',
											url : servletName,
											params : {
												ac : 'delete-node',
												id : uids,
												beanType : 'subject',
												parentid : parentid
											},
											success : function(result, request) {
												selectedPath = store.getPath(
														rec, "uids");
												store.load();
												Ext.example.msg('删除成功！',
														'您成功删除了本工程类型！');
											},
											failure : function(result, request) {
												Ext.Msg.show({
															title : '提示',
															msg : '数据删除失败！',
															buttons : Ext.Msg.OK,
															icon : Ext.MessageBox.ERROR
														});
											}
										});
								treeGrid.getEl().unmask();
								// 清空表单域
								formPanel.getForm().reset();
								// 保存按钮不可用
								saveBtn.setDisabled(true);
							}
						}
					});
					break;
				}
		}
	}

	// 主面板
	contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				items : [treeGrid, formPanel]
			});

	// 创建viewport
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [contentPanel]
			});

});