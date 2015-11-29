/*
 * Ext JS Library 2.0 Beta 1 Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
// 全局变量
var bean = "com.sgepit.pmis.budget.hbm.BdgMoneyApp"
var gridPanelTitle = "合同:" + conname + "  金额：" + conmoney + ",   所有分摊记录"
var pid = CURRENTAPPID;
var rootText = "概算金额分摊";
var tmpNode; // 两个js之间树Node临时变量
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
					url = BASE_PATH
							+ "PCBusiness/dynamicdata/bdg/bdgcon_view.js"

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

		BUTTON_CONFIG['BACK'].disabled = false;

	rootNew = new Ext.tree.AsyncTreeNode({
				text : rootText,
				iconCls : 'form',
				id : '0'
			})
	treeLoaderNew = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgMoneyTree",
					businessName : "pcDynamicDataService",
					conid : conid,
					conmoney : conmoney,
					pid :PID,
					time :TIME,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanelNew = new Ext.tree.ColumnTree({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				region : 'center',
				width : 800,
				minSize : 275,
				maxSize : 600,
				frame : false,
				header : false,
				border : false,
				rootVisible : true,
				lines : true,
				autoScroll : true,
				animate : false,
				columns : [{
							header : '概算名称',
							width : 270, // 隐藏字段
							dataIndex : 'bdgname'
						}, {
							header : '财务编码',
							width : 120,
							dataIndex : 'bdgno',
							renderer : function(value) {
								return "<div id='bdgno'>" + value + "</div>";
							}
						}, {
							header : '项目工程编号',
							width : 0, // 隐藏字段
							dataIndex : 'pid',
							renderer : function(value) {
								return "<div id='pid'>" + value + "</div>";
							}
						}, {
							header : '概算金额主键',
							width : 0,
							dataIndex : 'appid',
							renderer : function(value) {
								return "<div id='appid' >" + value + "</div>";
							}
						}, {
							header : '概算主键',
							width : 0,
							dataIndex : 'bdgid',
							renderer : function(value) {
								return "<div id='bdgid'>" + value + "</div>";
							}
						}, {
							header : '内部流水号',
							width : 0,
							dataIndex : 'conid',
							renderer : function(value) {
								return "<div id='conid'>" + value + "</div>";
							}
						}, {
							header : '概算金额',
							width : 120,
							dataIndex : 'bdgmoney',
							renderer : function(value) {
								return "<div id='bdgmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
						}, {
							header : '合同分摊总金额',
							width : 120,
							dataIndex : 'sumrealmoney',
							renderer : function(value) {
								return "<div id='sumrealmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '本合同分摊',
							width : 120,
							dataIndex : 'realmoney',
							renderer : function(value) {
								return "<div id='realmoney' align='right'>"
										+ cnMoneyToPrec(value) + "</div>";
							}
							// renderer: cnMoney
						}, {
							header : '项目标示',
							width : 0,
							dataIndex : 'prosign',
							renderer : function(value) {
								return "<div id='prosign'>" + value + "</div>";
							}
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isleaf',
							renderer : function(value) {
								return "<div id='isleaf'>" + value + "</div>";
							}
						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parent',
							renderer : function(value) {
								return "<div id='parent'>" + value + "</div>";
							}
						}, {
							header : '备注',
							width : 0
						}],
				loader : treeLoaderNew,
				root : rootNew,
				rootVisible : false
			});

	treePanelNew.on('beforeload', function(node) {
				bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = treePanelNew.loader.baseParams
				baseParams.conid = conid;
				baseParams.conmoney = conmoney;
				baseParams.parent = bdgid;
			})
	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
				header : false,
				tbar : [
						'<font color=#15428b><b>&nbsp;' + gridPanelTitle
								+ '</b></font>', '-', {
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							handler : function() {
								rootNew.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							handler : function() {
								rootNew.collapse(true);
							}
						}],
				items : [treePanelNew]

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
	treePanelNew.render();
	treePanelNew.expand();
	rootNew.expand();

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

});
