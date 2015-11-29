var treePanel, treeLoader, childGridPanel, formPanel, formWin;
var nodes = new Array();
var childBean = "com.sgepit.frame.example.hbm.ExampleChildtable";
var business = "exampleMgm";
var listMethod = "findByProperty";
var childPrimaryKey = "lsh";
var treeRootID = "0";
var currentTreeID = treeRootID;
var childGridPanelTitle = MODULE_ROOT_NAME;
var formPanelTitle = "编辑记录（查看详细信息）";
var treePropertyName = "parentid";
var propertyName = "categoryid";
var propertyValue = treeRootID;
var SPLITB = "`";
var root;
var treeNodeUrl = CONTEXT_PATH + "/servlet/ExpServlet?ac=tree";
var selectedModuleNode = null;

Ext.onReady(function() {
	root = new Ext.tree.AsyncTreeNode({
		text : "分类根节点",
		id : treeRootID
	});


	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + treeRootID,
		requestMethod: "GET"
	})
	treePanel = new Ext.tree.TreePanel({
		id : 'category-tree',
		region : 'west',
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 500,
		frame : false,
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
		collapsible : true,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : root,
		collapseFirst : false
	});

	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id; 
	});

	
	treePanel.on('click', function(node, e) {
		e.stopEvent();
		PlantInt.categoryid = node.id;
		var titles = [node.text];
		var obj = node.parentNode
		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		var title = titles.reverse().join(" / ");
		parentGridPanel.setTitle(title);
		parentGridPanel.stopEditing();
		selectedModuleNode = node
		ds.baseParams.params = propertyName + SPLITB + PlantInt.categoryid
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});
	


	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : true,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [parentGridPanel,childGridPanel]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});
	
	treePanel.render()
	root.expand();
	root.select();
	selectedModuleNode = root
	
	if (parent.retrieveCondition != undefined) {
		ds.baseParams.params = "lsh" + SPLITB + parent.retrieveCondition;
	}
	
	ds.load({
		params : {
			start : 0, // 起始序号
			limit : PAGE_SIZE
		// 结束序号，若不分页可不用设置这两个参数
		}
	});
	
	

});

	var lsh;
	function fileRender(vl){
		    
			return "<a href='javascript: viewFile()' title='查看附件'>查看附件</a>"
	}
	
	function viewFile(){
		setGetParam();
		attachfilewin.show();
	}
	