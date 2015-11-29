var root,fastRoot, moduleTree,targetPanel
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=moduleConfigTree&includeFast=false";
var fastTreeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=fastModuleTree";
Ext.onReady(function(){
	Ext.QuickTips.init();
	root = new Ext.tree.AsyncTreeNode({
		text : DefaultModuleRootName,
		id : defaultParentId,
		expanded:true,
		draggable:false
	});
    moduleTree = new Ext.tree.TreePanel({
    	id:'moduleTree',
        region:'west',
        split: true,
        width: 200,
        minSize: 210,
        collapsible: false,
        margins:'5 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible: true,
        lines:true,
        autoScroll:true,
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
        enableDrag : true,
        loader: new Ext.tree.TreeLoader({
        	dataUrl : treeNodeUrl + "&parentId=" + defaultParentId + "&userId="+USERID+"&includeFast=false",
				requestMethod : "GET",
				preloadChildren: true,
				clearOnLoad: false
			}),
        root: root,
        collapseFirst:false
    });
    
    
    moduleTree.getSelectionModel().on('beforeselect', function(sm, node){
        return node.isLeaf();
    });


	moduleTree.on('beforeload', function(node){ 
		moduleTree.loader.dataUrl = treeNodeUrl + "&parentId=" + node.id + "&userId="+USERID;
	});
	
    moduleTree.on('click', function(node, e){
    	if(node.parentNode!=null){
    		if (node.parentNode.id='00')
    			node.id = node.id.split(SPLITB)[0];
    	}
    	if(node.isLeaf()){
           e.stopEvent();
        }
    });
    fastRoot= new Ext.tree.AsyncTreeNode({
		text : "常用操作",
		id : "00",
		expanded:true
	})
	targetPanel = new Ext.tree.TreePanel({
		id:'targetPanel',
		title: '常用操作',
        region:'center',
        split: true,
        width: 200,
        minSize: 210,
        collapsible: false,
        margins:'5 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible: false,
        lines:true,
        autoScroll:true,
        enableDD : true,
        loader: new Ext.tree.TreeLoader({
		    dataUrl : fastTreeNodeUrl + "&parentId=" + defaultParentId + "&userId="+USERID,
			requestMethod : "GET",
			preloadChildren: true,
			clearOnLoad: false
			}),
        root : fastRoot,
        collapseFirst:false
    });
    
    targetPanel.on('beforenodedrop',function(e){
    	return e.dropNode.isLeaf()
    })
    
    targetPanel.on('nodedrop',function(e){
    	if(e.target.id=='00'||e.target.parentNode.id=='00'){
			Ext.Msg.show({
				title: '提示',
				msg: '&nbsp;&nbsp;&nbsp;更改常用操作？&nbsp;&nbsp;&nbsp;',
				buttons: Ext.Msg.YESNO,
				fn: function(value){
					if ("yes" == value){
						setCommonNode(e); 
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		} else {
			 return false
		}
	});
	
    targetPanel.on('click', function(node, e){
    	if(node.isLeaf()){
           e.stopEvent();
        }
    });
    
	var rightClick = new Ext.menu.Menu({
        id :'rightClickCont',
        items : [{
            id:'deleteMenu',
            text : '删除',
            handler : deleteMenuFun
        }]
    });    
    
    targetPanel.on('contextmenu',function(node,event){
    	if(node.parentNode.id=='00'){
    		event.preventDefault();
			rightClick.showAt(event.getXY());
			leftPressNode = node;
    	}
    });
    
    var viewPort = new Ext.Viewport({
        layout:'border',
		items:[moduleTree, targetPanel]
    });
    
    moduleTree.expandPath('/root');
   
	root.expand(false, true, function(){
		for (var index=0; index<root.childNodes.length;index++) {
			var n = root.childNodes[index]
			n.expand()
		}
	})
});

function setCommonNode(e){
	try{parent.configChanged = true}catch(e){}
	dropNode = e.dropNode.id;
	if(e.dropNode.parentNode.id=='00'){
		dropNode = e.dropNode.id.split(SPLITB)[0];
	}
//	alert(e.dropNode.text)
//	alert(e.target.text)
//	alert(e.point)
//	return;
	Ext.Ajax.request({
		url:CONTEXT_PATH + "/servlet/SysServlet?ac=addCommonPower",
		method:'post',
		params:{powerPk:dropNode,targetPk:e.target.id.split(SPLITB)[0],userId:USERID,type:e.point},
		success: function(response, option) {
			var rspXml = response.responseXML
			var msg = rspXml.documentElement.getElementsByTagName("msg")
					.item(0).firstChild.nodeValue;
			if(msg=='ok'){
				Ext.example.msg('执行成功',"<p>已设为常用操作！");
				reloadTree();
			}else{
				Ext.Msg.alert('执行出错',msg);
				reloadTree();
			}
		},
		failure: function(response, option) {
			Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
			reloadTree();
		}
	});
}
function deleteMenuFun(){
	Ext.Ajax.request({
		url:CONTEXT_PATH + "/servlet/SysServlet?ac=deleteCommonPower",
		method:'post',
		params:{powerPk:leftPressNode.id.split(SPLITB)[0],userId:USERID},
		success: function(response, option) {
			var rspXml = response.responseXML
			var msg = rspXml.documentElement.getElementsByTagName("msg")
					.item(0).firstChild.nodeValue;
			if(msg=='ok'){
				Ext.example.msg('执行成功',"<p>已删除常用操作！");
				reloadTree()	
			}else{
				Ext.Msg.alert('执行出错',msg);
				reloadTree();
			}
		},
		failure: function(response, option) {
			Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
			reloadTree();
		}
	});
}

function reloadTree() {		
	fastRoot.reload()
	fastRoot.expand(false, true, function(){
		for (var index=0; index<fastRoot.childNodes.length;index++) {
			fastRoot.childNodes[index].expand()
		}
	})
}