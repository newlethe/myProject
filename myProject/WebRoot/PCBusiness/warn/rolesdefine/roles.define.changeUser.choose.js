var ctreePanel, croot, cgrid;
var cuserWindow;

croot = new Ext.tree.AsyncTreeNode({
   text: "组织机构",
   id: '0',
   expanded: true
});
var loader =new Ext.tree.TreeLoader({
	            dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
		        requestMethod: "GET",
		        baseParams:{
			       parentId:USERBELONGUNITID,
			       ac:"buildingUnitTree",
			       baseWhere:"unitTypeId in ('0','1','2','3','4','5','A')"
		}
	})
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
        handler: function(){ croot.expand(true); }
    }, '-', {
        iconCls: 'icon-collapse-all',
        tooltip: '全部折叠',
        handler: function(){ croot.collapse(true); }
    }],    
    loader: loader,
    root: croot,
    collapseFirst:false,
    listeners : {
        beforeload : function (node){
            loader.baseParams.parentId = node.id;
        },
        click : function (n,e){
            cds.baseParams.params = "unitid='"+n.id+"' ";
            cdsReload();
        }
    }
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
		business: 'baseMgm',
		method: 'findwhereorderby'
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
	text: '<font color=#15428b><b>&nbsp;用户列表,请选择用户</b></font>',
	iconCls: 'form'
})

var cgetUsers = new Ext.Button({
	text: '确定',
	iconCls: 'save',
	handler: function(){
		var records = cgrid.getSelections();
		if (records.length > 0){
			var form = addPersonFormPanel.getForm();
			form.findField('dutyperosnid').setValue(records[0].get('userid'));
			form.findField('dutyperson').setValue(records[0].get('realname'));
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

function cdsReload(){
    cds.load({params:{start : 0,limit : PAGE_SIZE}});
}
cuserWindow = new Ext.Window({               
	title: '人员选择列表',
	iconCls: 'form',
	layout: 'border',
	width: 600, height: 300,
	modal: true,
	closeAction: 'hide',
	maximizable: true,
	plain: true,
	items: [ctreePanel, cgrid]
});

