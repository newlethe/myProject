var treePanel, root, grid;
var nodes = new Array();
var bean = "com.sgepit.frame.sysman.hbm.RockUser";
var business = "systemMgm";
var listMethod = "findUserByRole";
var gridPanelTitle = '用户列表，请选择角色';
var userWindow;
var selectRecords = new Array();

root = new Ext.tree.TreeNode({
   text: "组织机构",
   id: 'rootid',
   expanded: true
});

treePanel = new Ext.tree.TreePanel({
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
    root: root,
    collapseFirst:false
});

treePanel.on('click', function(node, e){
	var titles = [node.text];
	var obj = node.parentNode;
	while(obj!=null){
		if ("组织机构"!=obj.text) titles.push(obj.text);
		obj = obj.parentNode;
	}
	var title = titles.reverse().join(" / ");
	var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>';
	gridTitleBar.setText(setTitle);
	ds.baseParams.params = 'roleid'+SPLITB+node.id;
	ds.load({
		params:{
		 	start: 0,
		 	limit: PAGE_SIZE
		}
	});
});

var sm = new Ext.grid.CheckboxSelectionModel();
var cm = new Ext.grid.ColumnModel([
	sm, {
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
cm.defaultSortable = true;

var Columns = [
	{name: 'userid', type: 'string'},
	{name: 'username', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'sex', type: 'string'}
];

var ds = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: bean,
		business: business,
		method: listMethod
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'userid'
	}, Columns),
	remoteSort: true,
	pruneModifiedRecords: true
});
ds.setDefaultSort('userid', 'desc');

var gridTitleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
	iconCls: 'form'
})

var getUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		if (selectRecords.length > 0){
			var chooseData = new Array();
			for (var i = 0; i < selectRecords.length; i++){
				var obj = new Array();
				obj.push(selectRecords[i].get('userid'));
				obj.push(selectRecords[i].get('username'));
				obj.push(selectRecords[i].get('realname'));
				obj.push(selectRecords[i].get('sex'));
				chooseData.push(obj);
			}
			userGrid.getStore().loadData(chooseData);
			userWindow.hide();
		}
	}
})

grid = new Ext.grid.GridPanel({
	ds: ds,
	cm: cm,
	sm: sm,
	tbar: [gridTitleBar, '->', getUsers],
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
        store: ds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    width: 200
});

//sm.on('selectionchange', function(){
//	alert(sm.getSelections().length)
//	var records = sm.getSelections();
//	if (selectRecords.length>0){
//		for (var i=0; i<records.length; i++) {
//			for (var j=0; j<selectRecords.length; j++) {
//				if (selectRecords[j].get('userid') == records[i].get('userid')) {
//					
//				}
//			}
//		}
//	} else {
//		for (var i=0; i<records.length; i++) {
//			selectRecords.push(records[i]);
//		}
//	}
//});
function isExistRecord(record){
	for (var i = 0; i < selectRecords.length; i++){
		if (selectRecords[i].get('userid') == record.get('userid')){
			return true;
		}
	}
	return false;
}
sm.on('rowselect', function(sModel, rowIndex, record){
	if (selectRecords.length > 0){
		if (!isExistRecord(record)) selectRecords.push(record); 
	} else {
		selectRecords.push(record);
	}
});
sm.on('rowdeselect', function(sModel, rowIndex, record){
	for (var i = 0; i < selectRecords.length; i++){
		if (selectRecords[i].get('userid') == record.get('userid')){
			selectRecords.splice(i,1);
		}
	}
});
ds.on('load', function(){
	if (ds.getCount() > 0){
		if (selectRecords.length > 0){
			var selectIndexs = new Array();
			for (var i = 0; i < ds.getCount(); i++) {
				for (var j = 0; j < selectRecords.length; j++) {
					if (selectRecords[j].get('userid') == ds.getAt(i).get('userid')) {
						selectIndexs.push(i);
					}
				}
			}
			sm.selectRows(selectIndexs);
		}
	}
});

function buildRoleTree(){
	treePanel.getEl().mask("Loading...");
	systemMgm.getRoles(function(list){
		for(var i=0; i<list.length; i++) {
		 	var node = new Ext.tree.TreeNode({
		 		id: list[i].rolepk,
		 		text: list[i].rolename,
				leaf: true,
				cls: "cls",
				iconCls: "icon-cmp"
		 	});
			root.appendChild(node);
		}
		treePanel.getEl().unmask();
	});
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
//			root.appendChild(node);
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