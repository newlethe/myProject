var selectTreeGrid;
var bdgType;
var selectStore;
var buiArr = new Array();
var equArr = new Array();
var insArr = new Array();
var othArr = new Array();
var arr = new Array();
var buiSql,equSql,insSql,othSql;

Ext.onReady(function() {

	buiSql = "select t.buildbdg from facomp_bdg_info t where t.buildbdg is not null";
	equSql = "select t.equipbdg from facomp_bdg_info t where t.equipbdg is not null";
	insSql = "select t.installbdg from facomp_bdg_info t where t.installbdg is not null";
	othSql = "select t.otherbdg from facomp_bdg_info t where t.otherbdg is not null";
	DWREngine.setAsync(false);
	baseMgm.getData(buiSql, function(list) {
				for (var i = 0; i < list.length; i++) {
					buiArr.push(list[i]);
				}
			});
	baseMgm.getData(equSql, function(list) {
				for (var i = 0; i < list.length; i++) {
					equArr.push(list[i]);
				}
			});
	baseMgm.getData(insSql, function(list) {
				for (var i = 0; i < list.length; i++) {
					insArr.push(list[i]);
				}
			});
	baseMgm.getData(othSql, function(list) {
				for (var i = 0; i < list.length; i++) {
					othArr.push(list[i]);
				}
			});
	DWREngine.setAsync(true);

});

	function closeWin() {
		selectBdgWin.close();
	}

	// 保存选择节点
	function setSelectedBdg(bdgid, bdgNo, bdgName) {
		switch (bdgType) {
			case 'build' :
				buildBdgField.setValue(bdgid);
				buildBdgTrigger.setValue(bdgNo);
				buildNameField.setValue(bdgName);
				break;
			case 'equip' :
				equipBdgField.setValue(bdgid);
				equipBdgTrigger.setValue(bdgNo);
				equipNameField.setValue(bdgName);
				break;
			case 'install' :
				installBdgField.setValue(bdgid);
				installBdgTrigger.setValue(bdgNo);
				installNameField.setValue(bdgName);
				break;
			case 'other' :
				otherBdgField.setValue(bdgid);
				otherBdgTrigger.setValue(bdgNo);
				otherNameField.setValue(bdgName);
				break;
		}
	}

	// 取消对应
	function cancelSelect() {
		switch (bdgType) {
			case 'build' :
				buildBdgField.setValue(null);
				buildBdgTrigger.setValue(null);
				buildNameField.setValue(null);
				break;
			case 'equip' :
				equipBdgField.setValue(null);
				equipBdgTrigger.setValue(null);
				equipNameField.setValue(null);
				break;
			case 'install' :
				installBdgField.setValue(null);
				installBdgTrigger.setValue(null);
				installNameField.setValue(null);
				break;
			case 'other' :
				otherBdgField.setValue(null);
				otherBdgTrigger.setValue(null);
				otherNameField.setValue(null);
				break;
		}
		closeWin();
	}


	function selectBdg() {
		bdgType = this.id;

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

		var btnConfirm = new Ext.Button({
					text : '确定选择',
					iconCls : 'save',
					handler : function() {
						var uids = formPanel.getForm().findField('uids')
								.getValue();
						var rec = selectTreeGrid.getSelectionModel()
								.getSelected();
						var flag;
						if (rec) {
							DWREngine.setAsync(false);
							faBaseInfoService.checkBdgno(CURRENTAPPID, uids,
									bdgType + 'bdg', rec.get('bdgid'),
									function(str) {
										flag = str;
									});
							DWREngine.setAsync(true);
							if (flag == 'false') {
								Ext.example.msg('提示', '此概算项已被选择');
								return false;
							}
							var bdgid = rec.get('bdgid');
							var bdgno = rec.get('bdgno');
							var bdgname = rec.get('bdgname');
							setSelectedBdg(bdgid, bdgno, bdgname);
							closeWin();
						}
					}
				});

		selectStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
			autoLoad : false,
			leaf_field_name : 'isleaf',// 是否叶子节点字段
			parent_id_field_name : 'parent',// 树节点关联父节点字段
			url : MAIN_SERVLET,
			baseParams : {
				ac : 'list',
				method : 'VBdgTree',// 后台java代码的业务逻辑方法定义
				business : 'faBaseInfoService',// spring 管理的bean定义
				bean : 'com.sgepit.pmis.budget.hbm.VBdgInfo',// gridtree展示的bean
				params : 'pid' + SPLITB + pid + SPLITB// 查询条件
			},
			reader : new Ext.data.JsonReader({
						id : 'bdgid', // 此id作为ds.paramNames.active_node
						root : 'topics',
						totalProperty : 'totalCount',
						fields : ['bdgid', 'bdgno', 'bdgname', 'parent',
								'isleaf', 'ischeck']
					}),
			listeners : {
				'beforeload' : function(ds, options) {
					var parent = null;
					if (options.params[ds.paramNames.active_node] == null) {
						switch (bdgType) {
							case 'build' :
								options.params[ds.paramNames.active_node] = pid + "-0101";
								parent = pid + "-0101"; // 此处设置第一次加载时的parent参数
								arr = buiArr;
								break;
							case 'equip' :
								options.params[ds.paramNames.active_node] = pid + "-0102";
								parent = pid + "-0102"; // 此处设置第一次加载时的parent参数
								arr = equArr;
								break;
							case 'install' :
								options.params[ds.paramNames.active_node] = pid + "-0103";
								parent = pid + "-0103"; // 此处设置第一次加载时的parent参数
								arr = insArr;
								break;
							case 'other' :
								options.params[ds.paramNames.active_node] = pid + "-0104";
								parent = pid + "-0104"; // 此处设置第一次加载时的parent参数
								arr = othArr;
								break;
						}
					} else {
						parent = options.params[ds.paramNames.active_node];
					}
					ds.baseParams.params = 'pid' + SPLITB + pid + ";parent"
							+ SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
				}
			}
		});

		selectTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
					id : 'gctype-tree-panel',
					iconCls : 'icon-by-category',
					store : selectStore,
					master_column_id : 'bdgname',// 此项为列的id，定义设置哪一个数据项为展开定义
					autoScroll : true,
					region : 'center',
					viewConfig : {
						ignoreAdd : true
					},
					frame : false,
					collapsible : false,
					animCollapse : false,
					border : true,
					// ifcheck:true, //根据ischeck属性判断是否勾选
					// ifdisable:true, //设置为true后，ischeck为true的节点禁用
					columns : [{
								id : 'bdgname',
								header : '概算名称',
								width : 350,
								dataIndex : 'bdgname',
								renderer : function(v, m, r) {
									for (var i = 0; i < arr.length; i++) {
										if (r.get('bdgid') == arr[i]) {
											m.attr = "style=color:gray";
											break;
										}
									}
									return v;
								}
							}, {
								header : '编号',
								width : 150,
								dataIndex : 'bdgno'
							}],
					stripeRows : true,
					tbar : ['概算结构', '-', {
								iconCls : 'icon-expand-all',
								tooltip : 'Expand All',
								handler : function() {
									selectStore.expandAllNode();
								}
							}, '-', {
								iconCls : 'icon-collapse-all',
								tooltip : 'Collapse All',
								handler : function() {
									selectStore.collapseAllNode();
								}
							}, '->', btnConfirm, btnCancel, '-', btnReturn]
				});

		selectTreeGrid.getSelectionModel().singleSelect = true;
		selectStore.on("load", function(ds1, recs) {
					// 设定根节点，解决展开节点时挂错位置的BUG
					selectStore.setRootNodes(pid + '-01');
					if (ds1.getCount() > 0) {
						var rec1 = ds1.getAt(0);
						if (!ds1.isExpandedNode(rec1)) {
							ds1.expandNode(rec1);
						}
					}
				});

		selectBdgWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 500,
					height : 500,
					title : '选择概算',
					modal : true,
					maximizable : true,
					closeAction : 'close',
					plain : true,
					items : [selectTreeGrid]
				});
		selectStore.load();
		selectBdgWin.show();
	}