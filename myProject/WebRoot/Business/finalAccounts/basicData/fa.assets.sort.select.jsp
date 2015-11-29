<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
	<head>
		<title>财务资产分类维护</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<%@ include file="/jsp/common/golobalJs.jsp" %>
		<base href="<%=basePath%>">
		
		<!-- DWR -->
		<script type='text/javascript' src='dwr/util.js'></script>
		<script type='text/javascript' src='dwr/engine.js'></script>
		<script type='text/javascript' src='dwr/interface/baseMgm.js'></script>
		<script type='text/javascript' src='dwr/interface/faAssetsService.js'></script>
		<!-- EXT -->
		<script type="text/javascript" src="/<%=Constant.propsMap.get("ROOT_EXT")%>/extend/ColumnNodeUI.js"></script>
		
		<!-- PAGE -->
		<link rel="stylesheet" type="text/css" href="jsp/res/css/style.css" />
		<link rel="stylesheet" type="text/css" href="jsp/res/css/column-tree.css" />  
	</head>
	<body >
		<br><span></span>
	<br></body>
</html>

<script type="text/javascript">
var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "请选择资产分类【双击节点选择】";
var rootText = "所有资产";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;

Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '0'  // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "assetSortTree",
			businessName : "faAssetsService",
			parent : 0,
			pid: CURRENTAPPID
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
			header : '资产名称',
			width : 350,
			dataIndex : 'assetsName'
		}, {
			header : '资产主键',
			width : 0, // 隐藏字段
			dataIndex : 'uids',
			renderer : function(value) {
				return "<div id='uids'>" + value + "</div>";
			}
		}, {
			header : '资产编号',
			width : 200, // 隐藏字段
			dataIndex : 'assetsNo'
		}, {
			header : '单位',
			width : 50,
			dataIndex : 'unit'
		}, {
			header : '折旧率',
			width : 50,
			dataIndex : 'depreciationRate',
			renderer : function(value) {
				return value > 0? "<div id='depreciationRate'>" + value+"%" + "</div>": '';
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
			dataIndex : 'parentId',
			renderer : function(value) {
				return "<div id='parentId'>" + value + "</div>";
			}
		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	treePanel.on('beforeload', function(node) {
		var uids = node.attributes.uids;
		if (uids == null)
			uids = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = uids;
	})

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>','-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ root.expand(true); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ root.collapse(true); }
		            }],
		items : [treePanel]
	})

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [contentPanel]
	});
	treePanel.render(); // 显示树
	root.expand();
	treePanel.expandAll();

	treePanel.on('dblclick', function(n, e) {
		window.returnValue = n.attributes.assetsNo;
		window.close();
	});
});
</script>
