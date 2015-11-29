var treePanel, treeLoader;
var root;
var rootText = "资料分类";
var indexid;
var beanName = "com.sgepit.pmis.document.hbm.ZlTree";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var orgid;
var SPLITString= "~"
var treeid;
var parenttemp;
var tmp_parent;
var t_parent;
var BillState = new Array();
var currentPid = CURRENTAPPID;
Ext.onReady(function (){

	var userid = USERID;

	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form'
    })

    treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"orgZlTree", 
			businessName:"zldaMgm", 
			orgid:USERDEPTID,
			parent:0,
			pid : currentPid
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
        id: 'zl-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 200,
	    minSize: 275,
	    maxSize: 400,
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
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
		columns:[{
            header: '资料名称',
            width: 400,
            dataIndex: 'mc'
        },{
            header: '主键',
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";  }
        },{
            header: '编码',
            width: 100,
            dataIndex: 'bm',
            renderer: function(value){
            	return "<div id='bm'>"+value+"</div>";  }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '系统自动存储编码',
            width: 0,
            dataIndex: 'indexid',
            renderer: function(value){
            	return "<div id='indexid'>"+value+"</div>";
            }
        },{
            header: '部门id',
            width: 0,
            dataIndex: 'orgid',
            renderer: function(value){
            	return "<div id='orgid'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        }], 
        loader: treeLoader,
        root: root,
        rootVisible: false
	});
	
	treePanel.on('beforeload', function(node) {
		var treenode = node.attributes.treeid;
		if (treenode == null)
			treenode = 'root';
			var baseParams = treePanel.loader.baseParams
			baseParams.parent = treenode;
			
	})

	treePanel.on('contextmenu', contextmenu, this);

	var treeMenu;
	
	function contextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (!treeMenu) {
			treeMenu = new Ext.menu.Menu({
				id : 'treeMenu',
				width : 100,
				items : [{
					id : 'menu_add',
					text : '　新增',
					value : node,
					iconCls : 'add',
					handler : toHandler
				}, '-', {
					id : 'menu_update',
					text : '　修改',
					value : node,
					iconCls : 'btn',
					handler : toHandler
				}, '-', {
					id : 'menu_del',
					text : '　删除',
					value : node,
					iconCls : 'remove',
					handler : toHandler
				}]
			});
		}
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if (isRoot) {
			//treeMenu.items.get("menu_add").disable();
			//treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			//treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}

	function toHandler(){
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("treeid").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		if ("　新增" == state){
			saveBtn.setDisabled(false);
			formPanel.isNew = true;
			var formRecord = Ext.data.Record.create(Columns);
			loadFormRecord = new formRecord({
				pid: currentPid,
				treeid: null,
				mc: '',
				bm:'',
				isleaf: 1,
				parent: treeid,
				indexid:'',
				orgid:orgid
			});	
			formPanel.getForm().loadRecord(loadFormRecord);
			var form = formPanel.getForm();
			form.findField("bm").enable();
			form.findField("mc").enable();
		} else if ("　删除" == state) {
			//此处增加对资料分类下资料的查询
			zlMgm.ZlIsBlank(indexid,function(cn){
				if (0 < cn){
					Ext.Msg.show({
					   title: '提示',
					   msg: '该类别下还有资料,不能删除！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO 
					});
				}else{
					delHandler(menu_isLeaf, menu_nodeId, menu_parent, node,indexid);
				}
			});
			
		} else {
			formPanel.isNew = false
			if (t_parent !='root') {
				saveBtn.setDisabled(false);
				var form = formPanel.getForm();
				form.findField("bm").enable();
				form.findField("mc").enable();
			}
		}
	}
	
	function delHandler(leaf, nodeid, parentid, node){
		if ("0" == leaf){
			Ext.Msg.show({
			   title: '提示',
			   msg: '父节点不能进行删除操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			   
			});
		}else{
			Ext.Msg.show({
				title: '提示',
				msg: '是否删除' + node.attributes.mc,
				buttons : Ext.Msg.YESNO,
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.QUESTION,
				fn: function(value){
					if ("yes" == value){
						treePanel.getEl().mask("loading...");
						zlMgm.deleteChildNode(nodeid, function(flag) {
							if ("0" == flag) {
								var formDelRecord = Ext.data.Record
										.create(Columns);
								var flag = (node.parentNode.childNodes.length == 1)
								var pNode = flag
										? node.parentNode.parentNode
										: node.parentNode

								var formRecord = Ext.data.Record.create(Columns);
								var emptyRecord = new formRecord({									
									pid: currentPid,
									treeid: null,
									mc: '',
									bm:'',
									isleaf: 1,
									parent: '',
									indexid:''
								});								
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();
								if (flag) {
									var parent = pNode.attributes.treeid;
									var baseParams = treePanel.loader.baseParams
									baseParams.parent = parent;
								}
								treeLoader.load(pNode);
								pNode.expand();
								Ext.example.msg('删除成功！', '您成功删除了一条信息！');
							} else {
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							treePanel.getEl().unmask();
						});						
					}
				}
		    })
		}
	}

	treePanel.on('click',onClick);
	
	function onClick(node, e){
		tmp_parent = null;
		t_parent = null;
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		t_parent = node.attributes.parent;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		tmp_parent = menu_isLeaf;
		var menu_id = isRoot ? "0" : elNode.all("treeid").innerText;
		indexid=elNode.all("indexid").innerText;
		orgid = elNode.all("orgid").innerText;
		treeid=elNode.all("treeid").innerText;
		parenttemp=elNode.all("parent").innerText;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;
		saveBtn.setDisabled(true);
		var form = formPanel.getForm();
		form.findField("bm").disable();
		form.findField("mc").disable();
		DWREngine.setAsync(false);
		baseMgm.findById(beanName, menu_id, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
		tmpNode = node;
		tmpLeaf = menu_isLeaf;
		formPanel.getForm().loadRecord(loadFormRecord);   
	}
	
	contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		//tbar : [],
		items : [treePanel, formPanel]

	})
	
	if (Ext.isAir) { // 创建viewpor
		var win = new Ext.air.MainWindow({
			layout : 'border',
			items : [contentPanel],
			title : 'Simple Tasks',
			iconCls : 'icon-show-all'
		}).render();
	} else {
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [contentPanel]
		});
	}

	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand(); // 展开
	
});