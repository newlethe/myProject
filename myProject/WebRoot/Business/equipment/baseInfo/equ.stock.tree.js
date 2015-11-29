var newtreePanel, newtreeLoader;
var newroot;
var newrootText = "设备仓库编码树";
var beanName = "com.sgepit.pmis.equipment.hbm.EquWarehouse";
var orgdata='';
var getTreeEquid="";
var getTreeEquno="";
var currentPid = CURRENTAPPID;

orgdata = USERDEPTID;

	newroot = new Ext.tree.AsyncTreeNode({
        text: newrootText,
        id: '01',
        iconCls: 'form'
    })
    newtreeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"ckxxTree",
			businessName:"equBaseInfo", 
			orgid:orgdata, 
			parent:0,
			isbody : '1',//主体
			pid : currentPid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	newtreePanel = new Ext.tree.ColumnTree({
        id: 'zl-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        autoWidth: true,
	    split: true,
	    frame: false,
	    header: false,
	    border: false,
	    lines: true,
	    autoScroll: true,
	    animate: false,
	    tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ newroot.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ newroot.collapse(true); }
        }],
		columns:[{
            header: '库区库位编码',
            width: 200,
            dataIndex: 'equno',
            renderer: function(value){
            	return "<div id='equno'>"+value+"</div>";  }
        },{
            header: '设备仓库主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";  }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'equid',
            renderer: function(value){
            	return "<div id='equid'>"+value+"</div>";  }
        },{
			header : '是否子节点',
			dataIndex: 'isleaf',
			width: 0,
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";  }
		},{
			header : '父节点',
			dataIndex: 'parent',
			width: 0,
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";  }
		}], 
        loader: newtreeLoader,
        root: newroot,
        rootVisible: false
	});
	