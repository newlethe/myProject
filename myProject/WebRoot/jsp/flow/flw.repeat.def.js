var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var FLOW_ID, FLOW_TITLE;

Ext.onReady(function(){
	
	var root = new Ext.tree.TreeNode({
    	text: '业务工作流程树',
    	id: 'root',
    	type: 'root'
    });
    
    var treePanel = new Ext.tree.TreePanel({
		region: 'west',
		split: true,
		width: 200,
		minSize: 175,
		maxSize: 500,
		frame: false,
		margins: '5 0 5 5',
		cmargins: '0 0 0 0',
		rootVisible: true,
		lines: true,
		animate: true,
		autoScroll: true,
		animCollapse : true,
		collapsible: true,
		collapseMode: 'mini',
		tbar: ['<font color=#15428b>&nbsp;流程结构树</font>'],
		loader: new Ext.tree.TreeLoader(),
		root: root,
		collapseFirst: false
	});
	
	var mainPanel = new Ext.Panel({
		region: 'center',
		layout: 'fit',
		border: false,
		collapsible: true,
    	animCollapse: true,
    	autoLoad:{
    		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
    		params: 'type=form',
    		text: '<div style="font: bold  15px; color: #15428b">Loading...</div>'
    	}
	})
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [treePanel, mainPanel]
	});
	
	buildFrameTree();
	
	treePanel.on('click', function(node, e){
		if (node.attributes.type == 'flow'){
			FLOW_ID = node.id;
			FLOW_TITLE = node.text;
			mainPanel.doAutoLoad();
		}
	});
	
	function buildFrameTree(){
		treePanel.getEl().mask("Loading...");
		clearChildNodes(root);
		baseDao.findByWhere2(frameBean, '', function(frame_list){
			for (var i = 0; i < frame_list.length; i++) {
				var treeNode = new Ext.tree.TreeNode({
					id: frame_list[i].frameid,
					text: frame_list[i].framename,
					type: 'document'
				});
				DWREngine.setAsync(false);
				baseDao.findByWhere2(bean, 'frameid = \''+frame_list[i].frameid+'\'', function(flow_list){
					for (var j = 0; j < flow_list.length; j++) {
						treeNode.appendChild(
							new Ext.tree.TreeNode({
								id: flow_list[j].flowid,
								text: flow_list[j].flowtitle,
								iconCls: 'flow',
								type: 'flow'
							})
						);
					}
				});
				DWREngine.setAsync(true);
				root.appendChild(treeNode);
			}
			root.expand();
			root.expandChildNodes(true);
			treePanel.getEl().unmask();
		});
	}
	
	function clearChildNodes(node){
		if (node.childNodes.length > 0){
			node.childNodes[0].remove();
			clearChildNodes(node);
		}
	}
});
