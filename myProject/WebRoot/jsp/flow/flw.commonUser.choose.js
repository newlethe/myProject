var cmtreePanel, cmroot, cmgrid;
var cmuserWindow;

cmroot = new Ext.tree.TreeNode({
   text: "组织机构",
   id: 'rootid',
   expanded: true
});

cmtreePanel = new Ext.tree.TreePanel({
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
    root: cmroot,
    collapseFirst:false
});

cmtreePanel.on('click', function(node, e){
	var titles = [node.text];
	var obj = node.parentNode;
	while(obj!=null){
		if ("组织机构"!=obj.text) titles.push(obj.text);
		obj = obj.parentNode;
	}
	var title = titles.reverse().join(" / ");
	var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>';
	cmgridTitleBar.setText(setTitle);
	cmds.baseParams.params = 'roleid'+SPLITB+node.id;
	cmds.load({
		params:{
		 	start: 0,
		 	limit: PAGE_SIZE
		}
	});
});

var cmsm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
var cmcm = new Ext.grid.ColumnModel([
	cmsm, {
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
cmcm.defaultSortable = true;

var cmColumns = [
	{name: 'userid', type: 'string'},
	{name: 'username', type: 'string'},
	{name: 'realname', type: 'string'},
	{name: 'sex', type: 'string'}
];

var cmds = new Ext.data.Store({
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
	}, cmColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
cmds.setDefaultSort('userid', 'desc');

var cmgridTitleBar = new Ext.Button({
	text: '<font color=#15428b><b>&nbsp;用户列表，请选择角色</b></font>',
	iconCls: 'form'
})

var cmgetUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		var records = cmgrid.getSelections();
		if (records.length > 0){
			var cRecord = commonGrid.getSelectionModel().getSelected();
			cRecord.set('userid', records[0].get('userid'));
			cRecord.set('realname', records[0].get('realname'));
			cmuserWindow.hide();
		}
	}
})

cmgrid = new Ext.grid.GridPanel({
	ds: cmds,
	cm: cmcm,
	sm: cmsm,
	tbar: [cmgridTitleBar, '->', cmgetUsers],
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
        store: cmds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    }),
    width: 200
});

cmuserWindow = new Ext.Window({	               
	title: '默认处理人列表',
	iconCls: 'form',
	layout: 'border',
	width: 600, height: 300,
	modal: true,
	closeAction: 'hide',
	maximizable: true,
	plain: true,
	items: [cmtreePanel, cmgrid]
});

function cmclearChildNodes(node){
	if (node.childNodes.length > 0){
		node.childNodes[0].remove();
		cmclearChildNodes(node);
	}
}

function cmbuildRoleTree(){
	cmclearChildNodes(cmroot);
	var _selectRoles = commonGrid.getSelectionModel().getSelected().get('role').split(',');
	for (var i = 0; i < _selectRoles.length; i++) {
		baseMgm.findById(roleBean, _selectRoles[i], function(obj){
			var node = new Ext.tree.TreeNode({
		 		id: obj.rolepk,
		 		text: obj.rolename,
				leaf: true,
				cls: "cls",
				iconCls: "icon-cmp"
		 	});
			cmroot.appendChild(node);
		});	
	}
	cmtreePanel.getLoader().load(cmroot);
	cmroot.expand();
}
