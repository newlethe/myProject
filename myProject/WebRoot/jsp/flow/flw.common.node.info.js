var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";
var nodePathBean = "com.sgepit.frame.flow.hbm.NodePathView";
var arrNodes = new Array();
var B_NODEID = 000000, B_NAME = '-1', E_NODEID = 000000, E_NAME = '-1', FLOW_ID = '-1';
var _userData = new Array();

Ext.onReady(function(){
	
	baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.RockUser", "", function(list){
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].userid);
			temp.push(list[i].realname);
			_userData.push(temp);
		}
	});
	
	var commonPanel = new Ext.Panel({
		region: 'center',
		layout: 'fit',
		iconCls: 'icon-by-category',
		title: '请选择流程',
		header: true,
		border: false,
//		tbar: [{text: 'activeItem', handler: function(){alert(commonPanel.layout.activeItem.id);}}],
//    	animCollapse: true,
//    	collapsible: true,
        margins:'0 0 5 0',
        layout:'accordion',
        layoutConfig:{
            animate:true
        }
	})
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [commonPanel]
	});
	
	//将状态节点按路径排序
	function addNodes(list, startid){
		for (var i=0; i<list.length; i++){
			if (list[i].startid == startid){
				arrNodes.push(list[i]);
				if (list[i].endid == '0') return;
				addNodes(list, list[i].endid);
			}
		}
	}

	if (parent.FLOW_ID && parent.FLOW_TITLE){
		FLOW_ID = parent.FLOW_ID;
		commonPanel.setTitle(parent.FLOW_TITLE);
		//获得状态节点路径
		DWREngine.setAsync(false);
		baseDao.findByWhere2(nodePathBean, "flowid='"+parent.FLOW_ID+"' order by starttype", function(list){
			arrNodes.push(list[0]);
			addNodes(list, list[0].endid);
		});
		DWREngine.setAsync(true);
		for (var i=0; i<arrNodes.length; i++){
			commonPanel.insert(i, {
				id: arrNodes[i].startid,
				title: getType(arrNodes[i]),
				border: false,
				collapsed: true,
				node: arrNodes[i],
				listeners: {
					beforeExpand: function(p){
//							alert('flowid:'+p.node.flowid+'\nnodeid:'+p.node.nodeid+'\nname:'+p.node.name);
						B_NODEID = p.node.startid;
						B_NAME = p.node.bname;
						E_NODEID = p.node.endid;
						E_NAME = p.node.ename;
						if (p.node.starttype != '2') {
    						p.load({
								url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
								params: 'type=commonConfig',
								text: '<b>Loading...</b>'
							});
						}
					}
				}
			});
		}
		DWREngine.setAsync(true);
		viewport.render();
	}
	
	function getType(obj){
		if (obj.starttype == '0') return '<font color=green>'+obj.bname+'</font>';
		if (obj.starttype == '1') return '<font color=blue>'+obj.bname+'</font>';
		if (obj.starttype == '2') return '<font color=red>'+obj.bname+'</font>';
	}
});
