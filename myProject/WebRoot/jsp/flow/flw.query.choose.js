var userTreePanel, userRoot, userGrid;
var nodes = new Array();
var userBean = "com.sgepit.frame.sysman.hbm.RockUser";
var gridPanelTitle = '用户列表，请选择角色';
var userWindow;
var _roleData = new Array();
var _orgData = new Array();
var nodes = new Array();

/*
systemMgm.getRoles(function(list){
	for (var i = 0; i < list.length; i++) {
		var temp = new Array();
		temp.push(list[i].roleid);
		temp.push(list[i].rolename);
		_roleData.push(temp);
	}
});
*/

systemMgm.getListedOrgs("0",true,function(list){
	for(var i=0;i<list.length;i++)
	{
		var temp = new Array()
		temp.push(list[i].orgid)
		temp.push(list[i].orgname)
		temp.push(list[i].leaf)
		temp.push(list[i].parent)
		temp.push(list[i].property)
		_orgData.push(temp)	
	}
})

userRoot = new Ext.tree.TreeNode({
   text: "组织机构",
   id: '0',
   expanded: true
});

userTreePanel = new Ext.tree.TreePanel({
    id:'orgs-tree',
    region:'west',
    split:true,
    width: 196,
    minSize: 175,
    maxSize: 500,
    frame: false,
    layout: 'accordion',
    margins:'5 0 5 5',
    cmargins:'0 0 0 0',
    rootVisible: false,
    lines:true,
    autoScroll:true,
    collapsible: true,
    animCollapse:false,
    animate: true,
    collapseMode:'mini',
    tbar: [{
        iconCls: 'icon-expand-all',
		tooltip: '全部展开',
        handler: function(){ userRoot.expand(true); }
    }, '-', {
        iconCls: 'icon-collapse-all',
        tooltip: '全部折叠',
        handler: function(){ userRoot.collapse(true); }
    }],
    loader: new Ext.tree.TreeLoader({
		preloadChildren: true,
		clearOnLoad: false
	}),
    root: userRoot,
    collapseFirst:false
});

userTreePanel.on('click', function(node, e){
	var titles = [node.text];
	var obj = node.parentNode;
	while(obj!=null){
		if ("组织机构"!=obj.text) titles.push(obj.text);
		obj = obj.parentNode;
	}
	var title = titles.reverse().join(" / ");
	var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>';
	gridTitleBar.setText(setTitle);
	userDs.baseParams.params = 'orgid'+SPLITB+node.id;
	userDs.load({
		params:{
		 	start: 0,
		 	limit: PAGE_SIZE
		}
	});
});

var userSm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
var userCm = new Ext.grid.ColumnModel([
	userSm, {
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
userSm.defaultSortable = true;

var userColumns = [
	{name: 'userid', type: 'string'},
	{name: 'username', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'sex', type: 'string'}
];

var userDs = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: userBean,
		business: 'systemMgm',
		method: 'findUserByOrg' //'findUserByRole'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'userid'
	}, userColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
userDs.setDefaultSort('userid', 'desc');

var gridTitleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
	iconCls: 'form'
})

var getUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		var records = userGrid.getSelections();
		if (records.length > 0){
			Ext.getCmp('userid').setValue(records[0].get('userid'));
			Ext.getCmp('realname').setValue(records[0].get('realname'));
//			form.findField('handler').setValue(records[0].get('userid'));
//			form.findField('username').setValue(records[0].get('username'));
//			form.findField('realname').setValue(records[0].get('realname'));
			userWindow.hide();
		}
	}
})

userGrid = new Ext.grid.GridPanel({
	ds: userDs,
	cm: userCm,
	sm: userSm,
	tbar: [gridTitleBar, '->', getUsers],
	border: false,
	region: 'center',
	layout: 'accordion',
	header: false,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: false
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: userDs,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    width: 200
});

function clearChildNodes(node){
	if (node.childNodes.length > 0){
		node.childNodes[0].remove();
		clearChildNodes(node);
	}
}

function buildRoleTree()
{
	clearChildNodes(userRoot)
	for(var i = 0;i<_orgData.length;i++)
	{
		var flag = _orgData[i][2] =='1'?true:false
		var first = _orgData[i][3] == '0'?true:false
	 	var node = new Ext.tree.TreeNode({
	 		id: _orgData[i][0],
	 		text: _orgData[i][1],
			leaf: flag,
			cls: flag ? "cls" : "package",
			iconCls: flag ? "icon-cmp" : "icon-pkg",
			parentId: _orgData[i][3],
			_property : _orgData[i][4]
	 	});		
	 	
		nodes.push(node);
		
		if (first){
			userRoot.appendChild(node);
		} else{
			append(node);
		}
		
	}
}

function append(node) { // 递归调用
	if (nodes.length > 1) {
		var temp = nodes[nodes.length - 2];
		if (node.attributes.parentId == temp.id){
			temp.appendChild(node);
		} else if (node.attributes.parentId == temp.attributes.parentId &&
				temp.parentNode!=null)
		{
			temp.parentNode.appendChild(node);
			if (node.leaf) {
				nodes.pop();
			}
		} else {
			var tt = temp;
			nodes[nodes.length - 2] = node;
			nodes[nodes.length - 1] = tt;
			nodes.pop();
			append(node);
		}
	}    
}

/*
function buildRoleTree(){
	clearChildNodes(userRoot);
	for (var i = 0; i< _roleData.length; i++) {
	 	var node = new Ext.tree.TreeNode({
	 		id: _roleData[i][0],
	 		text: _roleData[i][1],
			leaf: true,
			cls: "cls",
			iconCls: "icon-cmp"
	 	});
		userRoot.appendChild(node);
	}
	userTreePanel.getLoader().load(userRoot);
	userRoot.expand();
}
*/

