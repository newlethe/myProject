var conInfoUrl =CONTEXT_PATH+"/Business/contract/cont.main.frame.jsp";
var conShareUrl =CONTEXT_PATH+"/Business/budget/bdg.main.frame.jsp";
Ext.onReady(function(){
	var root = new Ext.tree.TreeNode({
		text:'合同信息管理',
		id:PID,
		expanded :true
	});
	var treenode1 = new Ext.tree.TreeNode({
		id:'bdg',
		text: '合同明细信息',
		parentid: PID,
		expanded :true
	})
	var treenode2 = new Ext.tree.TreeNode({
		id:'con',
		text: '合同分摊信息',
		parentid: PID,
		expanded :true
	})
	var treenode3 = new Ext.tree.TreeNode({
		id:'conException',
		text: '合同异常数据信息',
		parentid: PID,
		expanded :true
	})	
	root.appendChild(treenode1);
	root.appendChild(treenode2);
	root.appendChild(treenode3);
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
				    window.frames[0].location.href=conInfoUrl;
				   alert('合同详细信息页面');
				}
				if('con'==node.id){
					window.frames[0].location.href=conShareUrl;
					alert('合同分摊信息页面')
				}
				if('conException'==node.id){
					alert('合同异常信息页面')
					
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
				+conInfoUrl
				+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
	  });
    new Ext.Viewport({
        layout: 'fit',
		border: false,
        items: [{
        	region: 'north',
	        layout: 'border',
            items:[testP, ct]
        }]
    });
})


