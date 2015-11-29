var title = "仓库信息";
var beanName = "com.sgepit.pmis.equipment.hbm.EquWarehouse";
var currentPid = CURRENTAPPID;
var treeGrid;
var getBtnId;
var store;
var orgidData;
var selectedPath = "";
var newData;
Ext.onReady(function() {

	var columns = [{
				id : 'pid',
				header : 'PID',
				width : 0,
				sortable : true,
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'uids',
				header : '设备仓库主键',
				width : 0,
				sortable : true,
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'equid',
				header : '系统编号',
				width : 300,
				sortable : true,
				dataIndex : 'equid',
				hidden : false
			}, {
				id : 'equno',
				header : '库区库位编码',
				width : 250,
				sortable : true,
				dataIndex : 'equno',
				hidden : false
			}, {
				id : 'detailed',
				header : '详细位置描述',
				width : 220,
				sortable : true,
				dataIndex : 'detailed',
				hidden : false
			}, {
                id : 'waretype',
                header : '仓库类别',
                width : 200,
                sortable : true,
                dataIndex : 'waretype',
                renderer : function(v) {
					var type = "";
					if (v) {
						for (var i = 0; i < waretypeArr.length; i++) {
							if (v == waretypeArr[i][0]) {
								type = waretypeArr[i][1];
								break;
							}
						}
					}
					return type;
				}
            }, {
                id : 'waretypecode',
                header : '仓库类别编码',
                width : 170,
                sortable : true,
                dataIndex : 'waretypecode'
            }, {
                id : 'wareno',
                header : '仓库号',
                width : 170,
                sortable : true,
                dataIndex : 'wareno'
            }, {
                id : 'warenocode',
                header : '仓库号编码',
                width : 170,
                sortable : true,
                dataIndex : 'warenocode'
            }, {
				id : 'memo',
				header : '备注',
				width : 200,
				sortable : true,
				dataIndex : 'memo',
				hidden : true
			}]

	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'equWarehouseGridTree',// 后台java代码的业务逻辑方法定义
					business : 'equBaseInfo',// spring 管理的bean定义
					bean : beanName,// gridtree展示的bean
					params : 'pid' + SPLITB + currentPid + SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'equid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["pid", "uids", "equno", "equid",
                                "waretype","waretypecode","wareno","warenocode",
									"detailed", "memo", "parent", "isleaf"]
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
						ds.baseParams.params = 'pid' + SPLITB + currentPid
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}

			})

	var expendAll = new Ext.Button({
				iconCls : 'icon-expand-all',
				tooltip : '全部展开',
				handler : function() {
					store.expandAllNode();
				}
			});
	var expendClose = new Ext.Button({
				iconCls : 'icon-collapse-all',
				tooltip : '全部收起',
				handler : function() {
					store.collapseAllNode();
				}
			});
	var exportExcelBtn = new Ext.Button({
				id : 'export',
				text : '导出数据',
				tooltip : '导出数据到Excel',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler : function() {
					// exportDataFile();
				}
			});
	var addMenu = new Ext.Button({
				id : 'menu_add',
				text : '新增',
				iconCls : 'add',
				handler : toHandler
			})
	var updateMenu = new Ext.Button({
				id : 'menu_update',
				text : '修改',
				iconCls : 'btn',
				handler : toHandler
			})
	var deleteMenu = new Ext.Button({
				id : 'menu_del',
				text : '删除',
				// cls : 'btn',
				iconCls : 'remove',
				handler : toHandler
			})

	var tbarArr = ['<font color=#15428b><b>&nbsp;' + title + '</b></font>',
			'-', expendAll, '-', expendClose, '-', addMenu, '-', updateMenu,
			'-', deleteMenu ]
			
	treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'equid',// 定义设置哪一个数据项为展开定义
		enableHdMenu : false,
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
		columns : columns,
		stripeRows : true
		})
	var panel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : tbarArr,
				items : [treeGrid, formPanel]
			})
			
//	store.load();	
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [panel]
			})
	
	store.on("load", function(ds1, recs) {
		if(selectedPath && selectedPath!="") {
			store.expandPath(selectedPath, "equid");
		} else {
			if (ds1.getCount() > 0) {
				var rec1 = ds1.getAt(0);
				if (!ds1.isExpandedNode(rec1)) {
					ds1.expandNode(rec1);
				}
				//treeGrid.getView().getRow(0).style.display='none';
			}
		}
	});
	
	store.on('expandnode',function(ds,rc){
			if(selectedPath && selectedPath!="") {
				var equidArr = selectedPath.split("/");
				if(rc.get("equid") == equidArr.pop()){
					treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
				}
			}
		});


	// ----------------------相关Function-----------------------------

	function toHandler(text) {
		formCancel();
		var rec = treeGrid.getSelectionModel().getSelected();
		var parentequid = "";
		var parentequno = "";
		if ((rec == null || rec == "")&&(text.id == 'menu_update' || text.id == 'menu_del')) {
			Ext.Msg.alert("信息提示", "请选择相关项！");
			return;
		}
		var equid = "01";
		var parent = "01";
		var pid = CURRENTAPPID;
		var parentequid;
		var parentequno;
		var equno="";
		if(rec != null && rec != ""){
			equid = rec.data.equid;
			parent = rec.data.equid;
			pid = rec.data.pid;
			equno = rec.data.equno;
			DWREngine.setAsync(false);
			baseMgm.getData("select equid,equno from equ_warehouse where pid='"
							+ pid + "' and equid ='" + rec.data.parent + "'", function(list) {
				if (list.length > 0) {
					parentequid = list[0][0];
					parentequno = list[0][1];
				} else {
					parentequid = rec.data.equid;
					parentequno = rec.data.equno;
				}
			})
			DWREngine.setAsync(true);
		}
		if (text.id == "menu_add") {
			getBtnId = "menu_add";
	        var sql = "select equno from equ_warehouse where pid='"+pid+"' and equid ='01' and parent='0'";
			if(rec == null || rec == ""){
				 DWREngine.setAsync(false);
			     baseMgm.getData(sql,function(list){
			          parentequno =list;
			     })
			    DWREngine.setAsync(true);
			}
			Ext.getCmp('formFieldSet').setTitle('新增设备仓库');
			DWREngine.setAsync(false);
			equBaseInfo.getActequid(equid, pid,0, function(list) {
				formPanel.getForm().findField("equid").setValue(list);
			});
		    DWREngine.setAsync(true);
			formPanel.getForm().findField('parentequid').setValue(equid);
			formPanel.getForm().findField('parentequid').el.dom.disabled = true;
			formPanel.getForm().findField('parentequno').el.dom.disabled = true;
			Ext.getCmp('parentequno').disabled = true;
			if(equid=='01'){
			   Ext.getCmp('parentequno').setValue(parentequno);
			}else{
		       Ext.getCmp('parentequno').setValue(equno);
			}
			formPanel.getForm().findField('pid').setValue(pid);
			formPanel.getForm().findField('uids').setValue("");
			formPanel.getForm().findField('equid').el.dom.disabled = true;
			formPanel.getForm().findField('isleaf').setValue("1");
			formPanel.getForm().findField('parent').setValue(parent);
			formPanel.expand();
			saveBtn.setDisabled(false);
			
		}else if (text.id == 'menu_update') {
			pathTree = null;
            if(rec.data.equid=='01'){
                  formPanel.collapse();
                  Ext.example.msg('系统提示','<font style="color:red;">根节点不能修改！</font>')
                  return ;
            }
		    if(rec.get('equid') == '01'){
			    formPanel.getForm().findField('parentequno').el.dom.disabled = true;
				Ext.getCmp('parentequno').disabled = true;
		    }else{
		    	formPanel.getForm().findField('parentequno').el.dom.disabled = false;
		    	Ext.getCmp('parentequno').disabled = false;	
		    }
			var equid = rec.data.equid;
			getBtnId = "menu_update";
			Ext.getCmp('formFieldSet').setTitle('修改设备仓库');
//			formPanel.getForm().findField('pid').setValue(rec.data.pid);
			formPanel.getForm().findField('parentequid').setValue(parentequid);
			Ext.getCmp('parentequno').setValue(parentequno);
//			formPanel.getForm().findField('equid').setValue(rec.data.equid);
			formPanel.getForm().findField('equid').el.dom.disabled = true;
//			formPanel.getForm().findField('equno').setValue(rec.data.equno);
//			formPanel.getForm().findField('detailed').setValue(rec.data.detailed);
//			formPanel.getForm().findField('memo').setValue(rec.data.memo);
//			formPanel.getForm().findField('uids').setValue(rec.data.uids);
//			formPanel.getForm().findField('isleaf').setValue(rec.data.isleaf);
//			formPanel.getForm().findField('parent').setValue(rec.data.parent);

			formPanel.expand();
            var formRecord = Ext.data.Record.create(Columnsform);
            var loadFormRecord = new formRecord(rec.data);
            formPanel.getForm().loadRecord(loadFormRecord);
            saveBtn.setDisabled(false);
            
		} else if (text.id == 'menu_del') {
			if(rec.data.equid=='01'){
				  formPanel.collapse();
	              Ext.example.msg('系统提示','<font style="color:red;">根节点不能删除！</font>')
				  return ;
			}
			var equid = rec.data.equid;
			formPanel.collapse();
			deleteData(equid)
		}
	}
		newtreePanel.on('beforeload', function(node) {
			var parent = node.attributes.equid;
			if (parent == null)
				parent = '0';
			var baseParams = newtreePanel.loader.baseParams
			baseParams.orgid = Ext.getCmp("equid").getValue();
			baseParams.parent = parent;
		})

		treeGrid.on('cellmousedown', function(grid, rowIndex,columnIndex, e) {
			var parentequid = "";
			var parentequno = "";
			var rec = treeGrid.getSelectionModel().getSelected();
			if(rec == null || rec == ""){
			  return ;
			}
			DWREngine.setAsync(false);
			baseMgm.getData("select equid,equno from equ_warehouse  t where pid='"
							+ pid + "' and equid ='" + rec.data.parent + "'", function(
							list) {

						if (list.length > 0) {
							parentequid = list[0][0];
							parentequno = list[0][1];

						} else {
							parentequid = rec.data.equid;
							parentequno = rec.data.equno;
						}
					})
			DWREngine.setAsync(true);
			saveBtn.setDisabled(false);
		    if(getBtnId == "menu_add"){
	            	equBaseInfo.getActequid(rec.data.equid, rec.data.pid,0, function(list) {
						formPanel.getForm().findField("equid").setValue(list);
					})
					formPanel.getForm().findField('parentequid')
							.setValue(rec.data.equid);
					formPanel.getForm().findField('parentequid').el.dom.disabled = true;
					Ext.getCmp('parentequno').disabled = true;
					Ext.getCmp('parentequno').setValue(rec.data.equno);
					formPanel.getForm().findField('pid').setValue(rec.data.pid);
					formPanel.getForm().findField('uids').setValue("");
					formPanel.getForm().findField('equid').el.dom.disabled = true;
					formPanel.getForm().findField('equno').setValue("");
					formPanel.getForm().findField('detailed').setValue("");
					formPanel.getForm().findField('memo').setValue("");
					formPanel.getForm().findField('isleaf').setValue("1");
					formPanel.getForm().findField('parent')
							.setValue(rec.data.equid);
					formPanel.expand();
					saveBtn.setDisabled(false);
		    }else if(getBtnId == "menu_update"){
		    	pathTree = null;
				if(rec.get('equid') == '01'){
				    formPanel.getForm().findField('parentequno').el.dom.disabled = true;
					Ext.getCmp('parentequno').disabled = true;
			    }else{
			    	formPanel.getForm().findField('parentequno').el.dom.disabled = false;
			    	Ext.getCmp('parentequno').disabled = false;	
			    }
		    	formPanel.getForm().findField('pid').setValue(rec.data.pid);
				formPanel.getForm().findField('parentequid')
						.setValue(parentequid);
				Ext.getCmp('parentequno').setValue(parentequno);
				formPanel.getForm().findField('equid').setValue(rec.data.equid);
				formPanel.getForm().findField('equid').el.dom.disabled = true;
				formPanel.getForm().findField('equno').setValue(rec.data.equno);
				formPanel.getForm().findField('detailed').setValue(rec.data.detailed);
				formPanel.getForm().findField('memo').setValue(rec.data.memo);
				formPanel.getForm().findField('uids').setValue(rec.data.uids);
				formPanel.getForm().findField('isleaf').setValue(rec.data.isleaf);
				formPanel.getForm().findField('parent').setValue(rec.data.parent);
				//formPanel.getForm().findField("waretype").setRawValue(rec.data.waretype);
				formPanel.getForm().findField("waretype").setValue(rec.data.waretype);
				formPanel.getForm().findField("waretypecode").setValue(rec.data.waretypecode);
				formPanel.getForm().findField("wareno").setValue(rec.data.wareno);
				formPanel.getForm().findField("warenocode").setValue(rec.data.warenocode);
				formPanel.expand();
		    }
		})
		
	function deleteData(equid) {
		var rec = treeGrid.getSelectionModel().getSelected();
		var parent = rec.data.parent;
		var isleaf = rec.data.isleaf;
		DWREngine.setAsync(false);
		var hasChild = true;
		equBaseInfo.isHasChilds1(equid, function(flag) {
					if (!flag) {
						hasChild = false
					}
				})
		DWREngine.setAsync(true);
		DWREngine.setAsync(false);
		var msgStr = "";
		if (hasChild) {
			msgStr = '是否删除系统编号为【<font style="color:red;">' + rec.data.equid
					+ '</font>】及下层所有仓库信息?';
		} else {
			msgStr = '是否删除系统编号为【<font style="color:red;">' + rec.data.equid
					+ '</font>】的仓库信息?';
		}
		Ext.Msg.show({
					title : '信息提示',
					msg : msgStr,
					buttons : Ext.Msg.YESNO,
					icon : Ext.MessageBox.QUESTION,
					fn : function(value) {
						if (value == 'yes') {
							treeGrid.getEl().mask("正在删除中，请稍后...");
							DWREngine.setAsync(false);
							equBaseInfo.deleteEquWarehouse(rec.data.uids,rec.data.pid,
									function(text) {
										
										if (text == true) {
											selectedPath = store.getPath(rec, "equid");
											formCancel();
											store.load();
											Ext.example.msg('删除成功！',
													'您成功删除了相关的仓库信息！');
										} else {
											Ext.Msg.show({
														title : '提示',
														msg : '数据删除失败！',
														buttons : Ext.Msg.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
							DWREngine.setAsync(true);
							treeGrid.getEl().unmask();
						}else{
								Ext.example.msg('系统提示！','您放弃了相关仓库信息的删除！');
						}
					}
				})
	}
})