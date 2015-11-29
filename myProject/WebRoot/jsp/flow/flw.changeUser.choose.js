var ctreePanel, croot, cgrid;
var cuserWindow;

croot = new Ext.tree.TreeNode({
   text: "组织机构",
   id: 'rootid',
   expanded: true
});

ctreePanel = new Ext.tree.TreePanel({
    region:'west',
    split:true,
    width: 196,
    minSize: 175,
    maxSize: 500,
    frame: false,
    layout: 'accordion',
    margins:'5 0 5 5',
    cmargins:'0 0 0 0',
    rootVisible: true,
    lines:true,
    autoScroll:true,
    collapsible: true,
    animCollapse:false,
    animate: true,
    collapseMode:'mini',
    tbar: [{
        iconCls: 'icon-expand-all',
		tooltip: '全部展开',
        handler: function(){ root.expand(true); }
    }, '-', {
        iconCls: 'icon-collapse-all',
        tooltip: '全部折叠',
        handler: function(){ root.collapse(true); }
    }],
    loader: new Ext.tree.TreeLoader({
		preloadChildren: true,
		clearOnLoad: false
	}),
    root: croot,
    collapseFirst:false
});

ctreePanel.on('click', function(node, e){
	var titles = [node.text];
	var obj = node.parentNode;
	while(obj!=null){
		if ("组织机构"!=obj.text) titles.push(obj.text);
		obj = obj.parentNode;
	}
	var title = titles.reverse().join(" / ");
	var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>';
	cgridTitleBar.setText(setTitle);
	cds.baseParams.params = 'roleid'+SPLITB+node.id;
	cds.load({
		params:{
		 	start: 0,
		 	limit: PAGE_SIZE
		}
	});
});

var csm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
var ccm = new Ext.grid.ColumnModel([
	csm, {
		id: 'userid',
		header: '主键',
		dataIndex: 'userid',
		hidden: true
	},{
		id: 'username',
		header: '用户名',
		dataIndex: 'username',
		width: .4
	},{
		id: 'realname',
		header: '用户姓名',
		dataIndex: 'realname',
		width: .4
	},{
		id: 'sex',
		header: '性别',
		dataIndex: 'sex',
		width: .2,
		renderer: function(value){
       	  if (value!="")
       	  	return value=='0' ? "<img src='jsp/res/images/shared/icons/user_suit.gif'>" 
       	  					: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
       	  	//return value=='0' ? '男':'女';
       	  else
       	  	return value;
       }
	}
]);
ccm.defaultSortable = true;

var cColumns = [
	{name: 'userid', type: 'string'},
	{name: 'username', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'sex', type: 'string'}
];

var cds = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: 'com.sgepit.frame.sysman.hbm.RockUser',
		business: 'systemMgm',
		method: 'findUserByRole'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'userid'
	}, cColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
cds.setDefaultSort('userid', 'desc');

var cgridTitleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;用户列表，请选择角色</b></font>',
	iconCls: 'form'
})

var cgetUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		var records = cgrid.getSelections();
		if (records.length > 0){
			var form = changePanel.getForm();
			form.findField('selhandlerid').setValue(records[0].get('userid'));
			form.findField('selhandler').setValue(records[0].get('realname'));
			cuserWindow.hide();
		}
	}
})

cgrid = new Ext.grid.GridPanel({
	ds: cds,
	cm: ccm,
	sm: csm,
	tbar: [cgridTitleBar, '->', cgetUsers],
	border: false,
	region: 'center',
	layout: 'accordion',
	header: false,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: cds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    width: 200
});

cuserWindow = new Ext.Window({	               
	title: '默认处理人列表',
	iconCls: 'form',
	layout: 'border',
	width: 600, height: 300,
	modal: true,
	closeAction: 'hide',
	maximizable: true,
	plain: true,
	items: [ctreePanel, cgrid]
});

function cclearChildNodes(node){
	if (node.childNodes.length > 0){
		node.childNodes[0].remove();
		cclearChildNodes(node);
	}
}

function cbuildRoleTree(_selectRoles){
	cclearChildNodes(croot);
//	for (var i = 0; i< _selectRoles.length; i++) {
//	 	var node = new Ext.tree.TreeNode({
//	 		id: _selectRoles[i][0],
//	 		text: _selectRoles[i][1],
//			leaf: true,
//			cls: "cls",
//			iconCls: "icon-cmp"
//	 	});
//		croot.appendChild(node);
//	}
	for (var i = 0; i < _selectRoles.length; i++) {
		baseMgm.findById(roleBean, _selectRoles[i], function(obj){
			var node = new Ext.tree.TreeNode({
		 		id: obj.rolepk,
		 		text: obj.rolename,
				leaf: true,
				cls: "cls",
				iconCls: "icon-cmp"
		 	});
			croot.appendChild(node);
		});	
	}
	ctreePanel.getLoader().load(croot);
	croot.expand();
}
//function buildOrgTree(){
//	for(var i=0; i<treeData.length; i++) { // 遍历生成节点
//	 	var flag = treeData[i][2]=='1' ? true : false;
//	 	var first = treeData[i][4]=='1' ? true : false;
//	 	var node = new Ext.tree.TreeNode({
//	 		id: treeData[i][0],
//	 		text: treeData[i][1],
//			leaf: flag,
//			cls: flag ? "cls" : "package",
//			iconCls: flag ? "icon-cmp" : "icon-pkg",
//			parentId: treeData[i][3]
//	 	});
//	
//		nodes.push(node);
//		
//		if (first){
//			croot.appendChild(node);
//		} else{
//			append(node);
//		}
//	}
//}
//
//function append(node) { // 递归调用
//	if (nodes.length > 1) {
//		var temp = nodes[nodes.length - 2];
//		if (node.attributes.parentId == temp.id){
//			temp.appendChild(node);
//		} else if (node.attributes.parentId == temp.attributes.parentId &&
//				temp.parentNode!=null)
//		{
//			temp.parentNode.appendChild(node);
//			if (node.leaf) {
//				nodes.pop();
//			}
//		} else {
//			var tt = temp;
//			nodes[nodes.length - 2] = node;
//			nodes[nodes.length - 1] = tt;
//			nodes.pop();
//			append(node);
//		}
//	}    
//}