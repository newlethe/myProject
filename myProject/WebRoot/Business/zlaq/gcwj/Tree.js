var treePanel, treeLoader;
var rootNode
var treeNodeUrl = g_path + "/servlet/ZlaqServlet";
var selectedModuleNode = null;
var selectedParentNode = null;
Ext.onReady(function() {

	rootNode = new Ext.tree.AsyncTreeNode({
		text : "工程文件分类树",
		id : "T"
	});

	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl,
		requestMethod: "GET"
	})
	treePanel = new Ext.tree.TreePanel({
		id : 'gcwj-tree',
		region : 'west',
	
		frame : false,
		tbar : [{
			iconCls : 'icon-expand-all',
			tooltip : '全部展开',
			handler : function() {
				rootNode.expand(true);
			}
		}, '-', {
			iconCls : 'icon-collapse-all',
			tooltip : '全部折叠',
			handler : function() {
				rootNode.collapse(true);
			}
		}],
		enableDD : true,
        split:true,
        width: 200,
        minSize: 175,
        maxSize: 400,
        collapsible: true,
        margins:'0 0 0 5',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : rootNode,
		collapseFirst : true
	});
	/*
	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysModuleTree"; 
	});
	*/
	treePanel.on('click', function(node, e) {
		e.stopEvent();
		selectedModuleNode = node
		selectedParentNode = node.parentNode
		try{
			selectedZlaqId = node.id
			paramStr = "type" + SPLITB + node.id
			loadGrid()
		}catch(e){}
	});
	treePanel.on('nodedrop',function(e){
		Ext.Msg.show({
			title: '提示',
			msg: '是否确定移动该节点？',
			buttons: Ext.Msg.YESNO,
			fn: function(value){
				if ("yes" == value)
					moveNode(e); 
				else{
					 reloadTree("move");
				}
			},
			icon: Ext.MessageBox.QUESTION
		});
	});
	
	var rightClick = new Ext.menu.Menu({
		    id:'rightClickCont',
		    items: [
		        {
		            id: 'addNode',
		            handler: rMenuFun,
		            icon: "jsp/res/images/icons/toolbar_item_add.png",
		            text: '增加分类'
		        },
		        {
		            id: 'editNode',
		            handler: rMenuFun,
		            icon: "jsp/res/images/icons/toolbar_item_edit.png",
		            text: '修改分类名称'
		        },'-',
		        {
		            id: 'deleteNode',
		            handler: rMenuFun,
		            icon: "jsp/res/images/icons/toolbar_item_delete.png",
		            text: '删除分类'
		        }
		    ]
		});
	if(!readOnly_Tree)
		treePanel.addListener('contextmenu', rightClickFn);//右键菜单代码关键部分
	function rightClickFn(node,e){
		selectedModuleNode = node
		selectedParentNode = node.parentNode
	    e.preventDefault();
	    rightClick.showAt(e.getXY());
	}
	/*
	treePanel.on('click', function(node, e) {
		e.stopEvent();
		PlantInt.parentid = node.id;
		var titles = [node.text];
		var obj = node.parentNode
		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);
		ds.baseParams.params = propertyName + SPLITB + node.id
		selectedModuleNode = node
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});*/
	
	function moveNode(e){
		  
		Ext.Ajax.request({
			url:treeNodeUrl + "?ac=moveTreeNode",
			method:'post',
			params:{treeId:e.dropNode.id,relationPk:e.target.id,type:e.point},
			success: function(response, option) {
				var msg = response.responseText;
				if(msg=='true'){
					//Ext.Msg.alert('执行成功',"<p>节点已经移动完毕！");
				}else{
					Ext.Msg.alert('执行出错',msg);
					reloadTree("move");
				}
			},
			failure: function(response, option) {
				Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
				reloadTree("move");
			}
		});
	
	}
	
});

function rMenuFun(item){
	switch(item.id){
		case "addNode":
			addNodeFun()
			break;
		case "editNode":
			editNodeFun()
			break;
		case "deleteNode":
			deleteNodeFun()
			break;
	}
	
}

function addNodeFun(){
	Ext.Msg.prompt('新增分类', '请输入分类名称:', function(btn, text){
	    if (btn == 'ok'){
	    	  //Ext.lib.Ajax.setDefaultPostHeader(false);  
			  //Ext.lib.Ajax.initHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		      Ext.Ajax.request({
				url:treeNodeUrl + "?ac=addNode",
				method:'post',
				params:{parentId:selectedModuleNode.id,nodeName:text},
				success: function(response, option) {
					if(response.responseText=='true'){
						Ext.MessageBox.alert('执行成功',"新增分类完毕！");
						reloadTree("add");
					}else{
						Ext.MessageBox.alert('执行出错',response.responseText);
					}
				},
				failure: function(response, option) {
					Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
				}
			});
	    }else{
	    	reloadTree("add");
	    }
	});
}
function editNodeFun(){
	if(selectedModuleNode == rootNode){
		Ext.Msg.alert('提示','根节点不能编辑！')
		return
	}
	Ext.Msg.prompt('编辑分类名称', '请输入新的分类名称:', function(btn, text){
	    if (btn == 'ok'){
	    	  //Ext.lib.Ajax.setDefaultPostHeader(false);  
			  //Ext.lib.Ajax.initHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		      Ext.Ajax.request({
				url:treeNodeUrl + "?ac=editNode",
				method:'post',
				params:{parentId:selectedModuleNode.id,nodeName:text},
				success: function(response, option) {
					if(response.responseText=='true'){
						Ext.MessageBox.alert('执行成功',"编辑分类完毕！");
						reloadTree("edit");
					}else{
						Ext.MessageBox.alert('执行出错',response.responseText);
						//reloadTree("edit");
					}
				},
				failure: function(response, option) {
					Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
					//reloadTree("edit");
				}
			});
	    }else{
	    	reloadTree("delete");
	    }
	},'',false,selectedModuleNode.text);
}

function deleteNodeFun(){
	if(selectedModuleNode == rootNode){
		Ext.Msg.alert('提示','根节点不能删除！')
		return
	}
	var alarm = "您将删除"+selectedModuleNode.text+"分类"
	if(!selectedModuleNode.isLeaf()){
		alarm = selectedModuleNode.text+"包含子节点，您将删除"+selectedModuleNode.text+"分类及下属子节点"
	}
	Ext.Msg.confirm('操作提示', alarm, function(btn){
	    if (btn == 'yes'){
		      Ext.Ajax.request({
				url:treeNodeUrl + "?ac=deleteNode",
				method:'post',
				params:{parentId:selectedModuleNode.id},
				success: function(response, option) {
					if(response.responseText=='true'){
						//Ext.MessageBox.alert('执行成功',"编辑分类完毕！");
						reloadTree("delete");
					}else{
						Ext.MessageBox.alert('执行出错',response.responseText);
						
					}
				},
				failure: function(response, option) {
					Ext.Msg.alert('访问出错',"异步通讯失败，请与管理员联系！");
				}
			});
	    }else{
	    	reloadTree("delete");
	    }
	});
}

function reloadTree(type) {
		if(type=="delete" || type=="move"){	
			if(selectedParentNode != null){
				var tree = Ext.getCmp("gcwj-tree")	
				var path = selectedParentNode.getPath();
				selectedParentNode.reload()
				tree.expandPath(path,null,function(){
					var curNode = tree.getNodeById(selectedParentNode.id);
					curNode.select()
				})
			}
		}else{
			var tree = Ext.getCmp("gcwj-tree")	
			var path = selectedModuleNode.getPath();
			if(selectedModuleNode.isLeaf()){
				selectedModuleNode.parentNode.reload()
			}else{
//				selectedModuleNode.reload()
				selectedModuleNode.parentNode.reload()
			}
			tree.expandPath(path,null,function(){
				var curNode = tree.getNodeById(selectedModuleNode.id);
				curNode.select()
			})
		}
	}
