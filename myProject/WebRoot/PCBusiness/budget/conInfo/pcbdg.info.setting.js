var conPageUrl =CONTEXT_PATH+"/Business/budget/bdg.main.frame.jsp";
var flag=switchoverProj(PID,PNAME);
Ext.onReady(function(){
	var root = new Ext.tree.TreeNode({
		text:'概算信息管理',
		id:PID,
		expanded :true
	});
	var treenode1 = new Ext.tree.TreeNode({
		id:'bdg',
		text: '概算信息录入',
		parentid: PID,
		expanded :true
	})
	var treenode2 = new Ext.tree.TreeNode({
		id:'con',
		text: '合同概算分摊',
		parentid: PID,
		expanded :true
	})
	root.appendChild(treenode1);
	root.appendChild(treenode2);
	var treeloader = new Ext.tree.TreeLoader({
	})
	var treepanel = new Ext.tree.TreePanel({
		region: 'center',
		id: 'pro-tree',
		collapsible: true,
		frame: true,
		width : 200,
		minSize: 200,
		maxSize: 500,
		layout: 'accordion',
		margins: '5 0 5 5',
		cmargins: '0 0 0 0 ',
		rootVisible: true,
		line: false,
		autoScroll: true,
		collapsible: true,
		animCollapse:false,
		animate: false,
		collapseMode:'mini',
		loader:treeloader,
		root:root,
		listeners:{
			click :function(node,e){
				if('bdg'==node.id){
				    window.frames[0].location.href=bdgPageUrl;
				}
				if('con'==node.id){
					window.frames[0].location.href=conPageUrl;
				}
			}
		}
	});
	
	var testP = new Ext.Panel({
		layout : 'fit',
		region : 'west',
		items : [treepanel],
		width : 175
	});
	
    var ct = new Ext.Panel({
		border : true,
		id : 'centerpanel',
		region : 'center',
		layout :'fit',
		width : 200,
		split : true,
		html : '<iframe name="centerFrame" src="'
				+conPageUrl
				+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
	  });
    new Ext.Viewport({
        layout: 'border',
		border: false,
        items: [{region: 'north',
            autoHeight: true,
            border: false,
            margins: '0 0 5 0'
            },ct
        ]
    });
})


