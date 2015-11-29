﻿/*
 * Ext JS Library 2.0 Beta 1 Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量
var bean = "com.sgepit.pmis.budget.hbm.VBdgConApp"
var gridPanelTitle = "合同:" + conname + "  金额：" + conmoney + ",   所有分摊记录"
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var tmpNodeRecord; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var bdgid;
Ext.onReady(function() {
	/**
	 * @description 被流程所调用的页面中，按钮的统一化管理
	 * @param BUTTON_CONFIG -
	 *            存放当前页面上的所有按钮
	 * @author xiaos
	 */
	var BUTTON_CONFIG = {
		'BACK' : {
			text : '返回',
			iconCls : 'returnTo',
			disabled : true,
			handler : function() {
				var url;
				if (isQuery) {
					url = BASE_PATH
							+ "Business/budget/bdg.generalInfo.input.jsp?"+"uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
				} else {
					url = BASE_PATH
							+ "Business/contract/cont.generalInfo.input.jsp?isBack=1"
				}

				if (!window.parent.name) {
					window.parent.returnToURL(url);
				} else {
					window.location.href = url;
				}

			}
		},
		'SELECT' : {
			text : '选择',
			iconCls : 'btn',
			disabled : true,
			handler : function() {
				window.location.href = BASE_PATH
						+ "Business/budget/bdg.tree.jsp?conid=" + conid
						+ "&conname=" + conname + "&conmoney=" + conmoney;
			}
		}
	};

	/**
	 * @description 本页面一共有3种被调用的状态： 1、普通应用程序调用； 2、流程实例在流转中，任务节点调用；
	 *              3、流程实例被查看的时候调用；
	 * @param isFlwTask =
	 *            true 为第2种状态
	 * @param isFlwView =
	 *            true 为第3种状态
	 * @param isFlwTask !=
	 *            true && isFlwView != true 为第1种状态
	 */
	if (isFlwTask == true) {
		BUTTON_CONFIG['SELECT'].disabled = false;
	} else if (isFlwView == true) {

	} else if (isFlwTask != true && isFlwView != true) {
		BUTTON_CONFIG['BACK'].disabled = false;
		if ( ModuleLVL == '1' ){
		
		BUTTON_CONFIG['SELECT'].disabled = false;
		}
		else{
		BUTTON_CONFIG['SELECT'].disabled = true;
		}
	}
	
	//动态数据查看屏蔽选择按钮
	if(dyView=='true'){
		BUTTON_CONFIG['SELECT'].disabled = true;
	}
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'bdgMoneyNewTree',// 后台java代码的业务逻辑方法定义
					business : 'bdgMoneyMgm',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'conid' + SPLITB +  conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"bidbdgmoney","conbidbdgmoney","isbid",
									"conbdgappmoney","conappmoney","initappmoney", "changeappmoney",
									"claappmoney","breachappmoney","isleaf","parent","remark"]
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
						ds.baseParams.params = 'conid' + SPLITB + conid
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});	
	
	treePanelNew = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'bdgname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				//ifcheck:true,																												
				border : true,
				stripeRows : true,
				title : '', // 设置标题			
				columns : [{
							id: 'bdgname',
							header : '概算名称',
							width : 220, 
							renderer :function(value) {
								var qtip = "qtip=" + value;
								return'<span ' + qtip + '>' + value + '</span>';
							},
							dataIndex : 'bdgname'
						}, {
							header : '概算编码',
							width : 120,
							dataIndex : 'bdgno',
							renderer : function(value) {
								return "<div id='bdgno'>" + value + "</div>";
							}
						}, {
							header : '项目工程编号',
							width : 0, // 隐藏字段
							hidden : true,
							dataIndex : 'pid',
							renderer : function(value) {
								return "<div id='pid'>" + value + "</div>";
							}
						}, {
							id:"bdgid",
							header : '概算主键',
							width : 0,
							hidden : true,
							dataIndex : 'bdgid',
							renderer : function(value) {
								return "<div id='bdgid'>" + value + "</div>";
							}
						}, {
							header : '内部流水号',
							width : 0,
							hidden : true,
							dataIndex : 'conid',
							renderer : function(value) {
								return "<div id='conid'>" + value + "</div>";
							}
						}, {
							header : '概算金额',
							width : 110,
							dataIndex : 'bdgmoney',
							renderer : function(value) {
								return "<div id='bdgmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
						}, {
							//BUG8335新增字段 zhangh 2015-11-16
							header : '招标对应概算金额',
							width : 130,
							dataIndex : 'bidbdgmoney',
							align: 'right',
							renderer : cnMoneyToPrec
						}, {
							//BUG8335新增字段 zhangh 2015-11-16
							header : '本合同招标对应概算金额',
							width : 160,
							dataIndex : 'conbidbdgmoney',
							align: 'right',
							renderer : cnMoneyToPrec
						}, {
							//BUG8335新增字段 zhangh 2015-11-16
							//判断是否是招投标选择的概算项，1是，0否，如果为1，此处不能进行删除
							header : '是否招投标',
							dataIndex : 'isbid',
							hidden : true
						}, {
							header : '合同分摊总金额',
							width : 110,
							dataIndex : 'conbdgappmoney',//old sumconappmoney
							renderer : function(value) {
								return "<div id='conbdgappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同分摊总金额',
							width : 120,
							dataIndex : 'conappmoney',//old realmoney
							renderer : function(value) {
								return "<div id='conappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同签订分摊',
							width : 110,
							dataIndex : 'initappmoney',
							renderer : function(value) {
								return "<div id='initappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同变更分摊',
							width : 110,
							dataIndex : 'changeappmoney',
							renderer : function(value) {
								return "<div id='changeappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同索赔分摊',
							width : 110,
							dataIndex : 'claappmoney',
							renderer : function(value) {
								return "<div id='claappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同违约分摊',
							width : 110,
							dataIndex : 'breachappmoney',
							renderer : function(value) {
								return "<div id='breachappmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '是否子节点',
							width : 0,
							hidden : true,
							dataIndex : 'isleaf',
							renderer : function(value) {
								return "<div id='isleaf'>" + value + "</div>";
							}
						}, {
							header : '父节点',
							width : 0,
							hidden : true,
							dataIndex : 'parent',
							renderer : function(value) {
								return "<div id='parent'>" + value + "</div>";
							}
						}, {
							header : '备注',
							hidden : true,
							dataIndex : 'remark'
						}
/*						, {
							header : 'hischeck',
							hidden : true,
							dataIndex:'ischeck',
							width : 0
						}*/
						]
			});
	store.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});
			
	// 右键菜单
	treePanelNew.on('rowcontextmenu', contextmenu, this);
	var treeMenu;
	function contextmenu(thisGrid, rowIndex, e) {
		if(viewButton  != '')return;//概算管理中合同概算分摊信息点击查看时带过来的参数，该参数是控制按钮，只运行查看，不运行进行业务操作 yanglh 2014-02-10
		e.stopEvent();
		if ( ModuleLVL != '1' ){
			return;
		}
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);	
		tmpNodeRecord=record;
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		treeMenu = new Ext.menu.Menu({
					id : 'treeMenu',
					width : 100,
					items : [{
								id : 'menu_update',
								text : '　修改',
								iconCls : 'btn',
								handler : toHandler
							}, '-', {
								id : 'menu_del',
								text : '　删除',
								iconCls : 'remove',
								handler : toHandler
							}]
				});
		
		if (isFlwTask == true) {
			treeMenu.showAt(e.getXY());
		} else if (isFlwView == true) {

		} else if (isFlwTask != true && isFlwView != true) {
			treeMenu.showAt(e.getXY());
		}
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_update").enable();
			if(record.data.isbid == "0"){
				treeMenu.items.get("menu_del").enable();
			}else{
				//isbid 不等于'0' 招投标选择的概算项，此处不能删除
				treeMenu.items.get("menu_del").disable();
			}
		}
	}
    
	function toHandler() {
		var rec = treePanelNew.getSelectionModel().getSelected();   
		var state = this.text;
		var isRoot = (rootText == rec.data.bdgname);
		var menu_parent = isRoot ? "0" : rec.data.parent;
		var menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		var menu_bdgid = isRoot ? "0" : rec.data.bdgid;
		var menu_conid = rec.data.conid;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;
		if ("　删除" == state) {
			bdgMoneyMgm.isPayorChangeApp(menu_bdgid, menu_conid,
					function(flag) {
						if (flag) {
							Ext.Msg.alert('系统提示!', '该项目存在付款分摊或其它分摊，请先予以删除!')
							return
						} else {
							delHandler(menu_isLeaf, menu_bdgid, menu_parent
									);
						}
					})
		} else {
			formPanel.expand();
			formPanel.isNew = false
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		if (menu_isLeaf == '1') {
			saveBtn.setDisabled(false);
		} else {
			saveBtn.setDisabled(true);
		}
		DWREngine.setAsync(false);
		baseDao.findByWhere2(beanName, "bdgid='"+menu_bdgid+"' and conid='"+conid+"'", function(list) {
			        var obj=list[0];
					obj.realmoney=obj.initappmoney;
					loadFormRecord = new formRecord(obj);
				});
		baseMgm.findById(beanNameInfo, menu_bdgid, function(obj) {
					loadFormBdgInfo = new formRecord({
								bdgname : obj.bdgname,
								bdgno : obj.bdgno,
								bdgmoney : obj.bdgmoney
							});
				});
		DWREngine.setAsync(true);

		formPanel.getForm().loadRecord(loadFormRecord);
		formPanel.getForm().loadRecord(loadFormBdgInfo);
		}
	}

	function delHandler(isleaf, bdgid, parentid) {
		var rec = treePanelNew.getSelectionModel().getSelected();
		var childflag = ''
		DWREngine.setAsync(false)
		if (0 == isleaf) {
			bdgMoneyMgm.checkifhaveChild(parent.conid, bdgid, function(flag) {
						childflag = flag
					})
		}
		DWREngine.setAsync(true)
		if (0 == isleaf && '1' == childflag) {
			Ext.Msg.alert('提示', '有子节点的父节点不能进行删除操作')
		} else {
			Ext.Msg.show({
				title : '提示',
				msg : '是否要删除?　　　　',
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
				
						treePanelNew.getEl().mask("loading...");
						bdgMoneyMgm.deleteChildNodeBdgVMoneyApp(conid, bdgid,function(
								flag) {
							if ("0" == flag) {
								var formDelRecord = Ext.data.Record
										.create(Columns);
								var formRecord = Ext.data.Record
										.create(Columns);
								var emptyRecord = new formRecord({
											pid : pid,
											bdgid : '',
											conid : '',
											conappmoney : 0,
											prosign : 0,
											remark : '',
											bdgmoney : 0,
											bdgno : '',
											bdgname : '',
											isleaf : 1,
											parent : ""
										});
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();
								var bdgidsArr=new Array();
								bdgidsArr.push(rec.data.bdgid);
								var oldFactMoneyStr = rec.data.initappmoney+"";
								oldFactMoneyStr =oldFactMoneyStr.replace(new RegExp(",",'gm'), "");
								var oldFactMoney =oldFactMoneyStr.replace("￥","")*1;
								var parent = store.getNodeParent(rec);
								while(parent){	
									var bdgid=parent.data.bdgid;
									bdgidsArr.push(bdgid);
								    parent = store.getNodeParent(parent);
								}
								DWREngine.setAsync(false);
								var value=0-oldFactMoney*1;
								bdgInfoMgm.updaterRemainingMoney(bdgidsArr,value);//更新预计未签订金额字段
								DWREngine.setAsync(true);	
								
								removeDeletedNode(rec);//调用删除方法
								
								Ext.example.msg('删除成功！', '您成功删除了一条概算信息！');
								if (isFlwTask == true)
									parent.IS_FINISHED_TASK = true;
							} else {
								Ext.Msg.show({
											title : '提示',
											msg : '数据删除失败！',
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
							treePanelNew.getEl().unmask();
						});
					}
				}
			});
		}
	}

	// 在页面上同步删除 本次已经删除的节点
	function removeDeletedNode(rec) {
		window.location.reload();
	}

	treePanelNew.on('click', onClick);
	function onClick(e) {
	var rec = treePanelNew.getSelectionModel().getSelected();
	if(rec){
		var isRoot ="";
		if(rec&&rec.data){
			isRoot=(rec.data.bdgname== rootText);
		}
		menu_bdgid = isRoot ? "0" : rec.data.bdgid;
		menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		if (menu_isLeaf == '1') {
			saveBtn.setDisabled(false);
		} else {
			saveBtn.setDisabled(true);
		}
		DWREngine.setAsync(false);
		baseDao.findByWhere2(beanName, "bdgid='"+menu_bdgid+"' and conid='"+conid+"'", function(list) {
			        var obj=list[0];
					obj.realmoney=obj.initappmoney;
					loadFormRecord = new formRecord(obj);
				});
		baseMgm.findById(beanNameInfo, menu_bdgid, function(obj) {
					loadFormBdgInfo = new formRecord({
								bdgname : obj.bdgname,
								bdgno : obj.bdgno,
								bdgmoney : obj.bdgmoney
							});
				});
		DWREngine.setAsync(true);

		tmpNodeRecord = rec;
		tmpLeaf = menu_isLeaf;

		formPanel.getForm().loadRecord(loadFormRecord);
		formPanel.getForm().loadRecord(loadFormBdgInfo);
		}
	}
	var tbars = '';
	if(viewButton  == ''){
		tbars = ['<font color=#15428b><b>&nbsp;' + gridPanelTitle
								+ '</b></font>', '-', {
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							handler : function() {
								store.expandAllNode();
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							handler : function() {
								store.collapseAllNode();
							}
						}, '->', BUTTON_CONFIG['SELECT'], '-',
						BUTTON_CONFIG['BACK']];
	}else{
		tbars = ['<font color=#15428b><b>&nbsp;' + gridPanelTitle
						+ '</b></font>', '-', {
					iconCls : 'icon-expand-all',
					tooltip : 'Expand All',
					handler : function() {
						store.expandAllNode();
					}
				}, '-', {
					iconCls : 'icon-collapse-all',
					tooltip : 'Collapse All',
					handler : function() {
						store.collapseAllNode();
					}
				}];
	}
	
	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : tbars,
				items : [treePanelNew, formPanel]

			})

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					title : gridPanelTitle,
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
	saveBtn.setDisabled(true);
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

});
