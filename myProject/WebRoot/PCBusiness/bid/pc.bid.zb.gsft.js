// 全局变量
var bean = ""
var gridPanelTitle = "概算内容:" + conname + "  金额：" + conmoney + ",   所有分摊记录"
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var tmpNodeRecord; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var bdgid;
var treePanelNew;
var BUTTON_CONFIG;
var treeMenu;
Ext.onReady(function() {
	loadStore();
	initToolbar();
	initTreeGrid();
	// 右键菜单
	treePanelNew.on('rowcontextmenu', contextmenu, this);
	treePanelNew.on('click', treeGridClickHandler);
	var tbars = '';
	if (viewButton == '') {
		tbars = [
				'<font color=#15428b><b>&nbsp;' + gridPanelTitle
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
				}, '->', BUTTON_CONFIG['SELECT'], '-', BUTTON_CONFIG['BACK'] ];
	} else {
		tbars = [
				'<font color=#15428b><b>&nbsp;' + gridPanelTitle
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
				} ];
	}

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : tbars,
		items : [ treePanelNew, formPanel ]

	})

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
			title : gridPanelTitle,
			layout : 'border',
			items : [ contentPanel ],
			title : 'Simple Tasks',
			iconCls : 'icon-show-all'
		}).render();
	} else {
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [ contentPanel ]
		});
	}
	saveBtn.setDisabled(true);
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	}

});

/**
 * treegrid单击事件
 * @param e
 */
function treeGridClickHandler(e) {
	var rec = treePanelNew.getSelectionModel().getSelected();
	if (rec) {
		var isRoot = "";
		if (rec && rec.data) {
			isRoot = (rec.data.bdgname == rootText);
		}
		menu_bdgid = isRoot ? "0" : rec.data.bdgid;
		menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		var formRecord = Ext.data.Record.create(Columns);
		if (menu_isLeaf == '1') {
			saveBtn.setDisabled(false);
		} else {
			saveBtn.setDisabled(true);
		}
		var loadFormRecord = new formRecord(rec.data); 
		formPanel.getForm().loadRecord(loadFormRecord);
	}
}

/**
 * 右键菜单
 * 
 * @param thisGrid
 * @param rowIndex
 * @param e
 */
function contextmenu(thisGrid, rowIndex, e) {
	if (viewButton != '')
		return;// 概算管理中合同概算分摊信息点击查看时带过来的参数，该参数是控制按钮，只运行查看，不运行进行业务操作 yanglh
				// 2014-02-10
	e.stopEvent();
	if (ModuleLVL != '1') {
		return;
	}
	thisGrid.getSelectionModel().selectRow(rowIndex);
	var record = thisGrid.getStore().getAt(rowIndex);
	tmpNodeRecord = record;
	var name = e.getTarget().innerText;
	var isRoot = (rootText == name);
	treeMenu = new Ext.menu.Menu({
		id : 'treeMenu',
		width : 100,
		items : [ {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			handler : toHandler
		}, '-', {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			handler : toHandler
		} ]
	});

	if (isRoot) {
		treeMenu.items.get("menu_update").disable();
		treeMenu.items.get("menu_del").disable();
	} else {
		treeMenu.items.get("menu_update").enable();
		treeMenu.items.get("menu_del").enable();
	}
	// 显示菜单
	treeMenu.showAt(e.getXY());
/***********************************************************右键菜单处理事件********************************************************* */
	function toHandler() {
		var rec = treePanelNew.getSelectionModel().getSelected();
		var isRoot = (rootText == rec.data.bdgname);
		var menu_parent = isRoot ? "0" : rec.data["parentId"];
		var menu_isLeaf = isRoot ? "false" : rec.data["isleaf"];
		var menu_bdgid = isRoot ? "0" : rec.data["bdgId"];
		var menu_conid = rec.data["contentId"];
		var uids = rec.data["uids"];
		tmpNodeRecord = rec;
		tmpLeaf = menu_isLeaf;
		if ("menu_del" == this.id) {
			// TODO:删除时可能会有判断
			delHandler(menu_isLeaf,uids);
		} else {
			formPanel.expand();
			formPanel.isNew = false
			var formRecord = Ext.data.Record.create(Columns);
			if (menu_isLeaf == '1') {
				saveBtn.setDisabled(false);
			} else {
				saveBtn.setDisabled(true);
			}
			rec.data.zbgsMoney = rec.data.planBgMoney;
			var loadFormRecord = new formRecord(rec.data);
			formPanel.getForm().loadRecord(loadFormRecord);
//			formPanel.getForm().loadRecord(loadFormBdgInfo);
		}
	}

	/**
	 * 右键菜单删除数据
	 * @param isleaf 是否是子节点
	 * @param uids  主键
	 */
	function delHandler(isleaf,uids) {
		var rec = treePanelNew.getSelectionModel().getSelected();
		//如果是父节点，就不能进行删除操作
		if( 0 == isleaf){
			Ext.Msg.alert('提示', '有子节点的父节点不能进行删除操作');
			return;
		}
		Ext.Msg.show({
			title:"提示",
			msg:"是否要删除?",
			buttons:Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,
			fn:deleteFn
		});
		function deleteFn(value){
			if("yes" == value){
				treePanelNew.getEl().mask("loading...");
				bidBdgApportionMgm.delChildNodeBidBdgApportion(uids,function(result){
					if("0" == result){
						Ext.example.msg('删除成功！','您成功删除了一条概算信息！');
						setTimeout(function(){
							window.location.reload();
						},500);
					}else{
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
		} //end deleteFn
	}//end delHandler
}


/**
 * 初始化头部选择和返回按钮
 */
function initToolbar() {
	BUTTON_CONFIG = {
		"BACK" : {
			text : '返回',
			iconCls : 'returnTo',
			disabled : false,
			handler : backHandler
		},
		"SELECT" : {
			text : '选择',
			iconCls : 'btn',
			disabled : false,
			handler : selectHandler
		}
	};

	// 返回操作
	function backHandler() {
		var url = BASE_PATH+ "PCBusiness/bid/pc.bid.zb.apply.input.jsp?pid=" + pid + "&mUids=" + zbUids
		 	+ "&contentUids=" + conid + "&mPageNo=" + mPageNo + "&cPageNo="+ cPageNo + "&mIndex=" + mIndex + "&cIndex=" + cIndex;
		window.location.href = url;
//		if (!window.parent.name) {
//			window.parent.returnToURL(url);
//		} else {
//		}
	}
	// 选择操作
	function selectHandler() {
		window.location.href = BASE_PATH + "Business/budget/bidBdg.tree.jsp?conid=" + conid + "&zbUids="+ zbUids;
	}
}

/**
 * 初始化树
 */
function initTreeGrid() {
	treePanelNew = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'bdgName',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		region : 'center',
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		frame : false,
		collapsible : false,
		animCollapse : false,
		// ifcheck:true,
		border : true,
		stripeRows : true,
		title : '', // 设置标题
		columns : [
				{
					id : 'bdgName',
					header : '概算名称',
					width : 220,
					renderer : function(value) {
						var qtip = "qtip=" + value;
						return '<span ' + qtip + '>' + value + '</span>';
					},
					dataIndex : 'bdgName'
				},
				{
					header : '概算编码',
					width : 120,
					dataIndex : 'bdgNo',
					renderer : function(value) {
						return "<div id='bdgNo'>" + value + "</div>";
					}
				},
				{
					header : '项目工程编号',
					width : 0, // 隐藏字段
					hidden : true,
					dataIndex : 'pid',
					renderer : function(value) {
						return "<div id='pid'>" + value + "</div>";
					}
				},
				{
					id : "bdgId",
					header : '概算主键',
					width : 0,
					hidden : true,
					dataIndex : 'bdgId',
					renderer : function(value) {
						return "<div id='bdgId'>" + value + "</div>";
					}
				},
				{
					header : '内部流水号',
					width : 0,
					hidden : true,
					dataIndex : 'contentId',
					renderer : function(value) {
						return "<div id='contentId'>" + value + "</div>";
					}
				},
				{
					header : '概算金额',
					width : 110,
					dataIndex : 'bdgMoney',
					renderer : function(value) {
						return "<div id='bdgMoney' align='right'>"
								+ cnMoneyToPrec(value) + "</div>";
					}
				},
				{
					header : '招标对应概算金额',
					width : 210,
					dataIndex : 'zbgsMoney',
					renderer : function(value) {
						var result = arguments[2].json["planBgMoney"];
						result = parseFloat(result) + parseFloat(value);
						return "<div id='zbgsMoney' align='right'>"+ cnMoneyToPrec(result) + "</div>";
					}
				},
				{
					header : '本次招标对应概算金额',
					width : 220,
					dataIndex : 'planBgMoney',// old realmoney
					renderer : function(value) {
						return "<div id='planBgMoney' align='right'>"
								+ cnMoneyToPrec(value) + "</div>";
					}
				},
				{
					header : '本次招标计划概算金额',
					width : 210,
					dataIndex : 'planBgMoney',
					renderer : function(value) {
						return "<div id='initappmoney' align='right'>"
								+ cnMoneyToPrec(value) + "</div>";
					}
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
					dataIndex : 'parentId',
					renderer : function(value) {
						return "<div id='parentId'>" + value + "</div>";
					}
				},{
					id:"uids",
					header:"主键id",
					width:0,
					hidden:true,
					dataIndex:"uids"
				} ]
	});
}

/**
 * 数据加载
 */
function loadStore() {
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name : 'isleaf',// 是否叶子节点字段
		parent_id_field_name : 'parentId',// 树节点关联父节点字段
		url : MAIN_SERVLET,
		baseParams : {
			ac : 'list',
			method : 'bidBdgApportionTree',// 后台java代码的业务逻辑方法定义
			business : 'bidBdgApportionMgm',// spring 管理的bean定义
			bean : bean,// gridtree展示的bean
			params : 'conid' + SPLITB + conid + SPLITB// 查询条件
		},
		reader : new Ext.data.JsonReader({
			id : 'bdgId',
			root : 'topics',
			totalProperty : 'totalCount',
			fields : [ "uids", "pid", "zbUids", "contentId", "bdgId",
					"bdgName", "bdgNo", "bdgMoney", "parentId", "isleaf",
					"planBgMoney", "zbgsMoney" ]
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
				ds.baseParams.params = 'conid' + SPLITB + conid + ";parent"
						+ SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
			}
		}
	});

	store.on("load", function(ds1, recs) {
		if (ds1.getCount() > 0) {
			var rec1 = ds1.getAt(0);
			if (!ds1.isExpandedNode(rec1)) {
				ds1.expandNode(rec1);
			}
		}
	});
}
