var root, saveBtn;
var treePanelTitle = "设备合同分类树";
var rootText = "所有设备合同";
var conidif="";
var selectedPath = "";
var prerec ;
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var isLeaf , treeId,conId,nodeText,queryParent,rootId;
Ext.onReady(function (){
	treePanelTitle = CURRENTAPPID == "1031902"? "设备/材料合同分类树名称":"设备合同分类树名称";
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : "0"        
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"equTypeTree", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:"",
			initFlag:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'west',
        width: 250,
        minSize: 200,
        maxSize: 400,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: treePanelTitle,
            width: 600,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: treeLoader,
        root: root
	});

	treePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid=node.attributes.conid;
		//燃气和国峰，国金项目pid，初始化设备合同分类树时加入材料合同
        var initConFlag = (CURRENTAPPID == "1031902" 
                || CURRENTAPPID == "1032102"
                || CURRENTAPPID == "1030902"
                || CURRENTAPPID == "1030903")
		var initflag = initConFlag ? "3":"1";
		if (treeid == null){
			treeid = "0";
			conid="";
			initflag = initConFlag ? "2":"0";
		}
		treePanel.loader.baseParams.parent = treeid;
		treePanel.loader.baseParams.conid = conid;
		treePanel.loader.baseParams.initFlag = initflag;//是否初始化的标记0表示只初始化设备合同名称，1表示初始化设备合同的四大主属性
	})
	treeLoader.on('load',function(t,node){
		if(node.attributes.treeid==null){
		  treePanel.getNodeById(node.firstChild.id).select();
	      treeId=node.firstChild.attributes.treeid;
	      conId=node.firstChild.attributes.conid;
	      var parent="0";
			DWREngine.setAsync(false);
				equBaseInfo.getEquTypeTreeRootByProperties(parent,conId, function(obj) {
							queryParent = obj.treeid;//保存当前选中设备合同的treeid，主要用于构造下拉选择树
							rootId=conId+'-'+obj.treeid;//刷新节点id为rootId的树节点
						});
			DWREngine.setAsync(true);
	      store.load();
		}
	})
	treePanel.on('click', onClick);
	function onClick(node, e ){
		nodeText=node.text;//设备合同分类树显示名称
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		treeId = isRoot ? "0" : elNode.all("treeid").innerText;
		conId = isRoot ? "0" : elNode.all("conid").innerText;
		var parentid = isRoot ? "0" : elNode.all("parentid").innerText;
		funcHandler(treeId,parentid,toHandlerLeft);
		treePanel.selectPath(node.getPath());
		var parent="0";
		DWREngine.setAsync(false);
			equBaseInfo.getEquTypeTreeRootByProperties(parent,conId, function(obj) {
						queryParent = obj.treeid;//保存当前选中设备合同的treeid，主要用于构造下拉选择树
						rootId=conId+'-'+obj.treeid;//刷新节点id为rootId的树节点
					});
		DWREngine.setAsync(true);
		store.load();
	}
	 treePanel.on('contextmenu', treecontextmenu, this);
	 function treecontextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var treeid=node.attributes.treeid;
		var parentid=node.attributes.parentid;
		var isRoot = (rootText == name);
		if (rootText == name)
			return;
		contextmenutemp(isRoot,treeid,parentid,e,toHandlerLeft);
	 }
	 function toHandlerLeft(node){
	 	var formRecord = Ext.data.Record.create(Columns);
	 	var selNode=treePanel.getSelectionModel().getSelectedNode();
		var rec = new formRecord({
			ptreename :"",
			ptreeid : "",
			pid : CURRENTAPPID,
			uuid : selNode.attributes.uuid,
			treeid : selNode.attributes.treeid,
			treename : selNode.attributes.treename,
			conid :selNode.attributes.conid,
			memo : selNode.attributes.memo,
			isleaf : selNode.attributes.isleaf,
			parentid : selNode.attributes.parentid,
			jzid : selNode.attributes.jzid
		});
		toHandler(node,rec);
	 }
	contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [treeGrid,formPanel]
	});
// 7. 创建viewport加入面板content
    var viewport = new Ext.Viewport({
        layout:'border',
        items: [treePanel,contentPanel]
    });
    
    
    //grid.getTopToolbar().add(excelBtn)
    
    treePanel.render(); // 显示树
    treePanel.expand();
    if(root.firstChild){
    	root.expand(false,true,function(){root.firstChild.expand()});//自动展开第一次子节点	
    }
});

