var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "材料编码维护";
var rootText = "所有材料";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
Ext.onReady(function (){
	
	root = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form',
        id : '0'        
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"matFrameTree", 
			businessName:"matMgm",
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
        id: 'equipment-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '品名(分类名)',
            width: 200,
            dataIndex: 'catName'
        },{
            header: '分类编码',
            width: 100,
            dataIndex: 'catNo'
        },{
            header: '规格型号',
            width: 120,
            dataIndex: 'spec'
        },{
            header: '英文名',
            width: 120,
            dataIndex: 'enName'
        },{
            header: '分类主键',	
            width: 0,				//隐藏字段
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '单位',
            width: 60,
            dataIndex: 'unit'
        },{
            header: '单价',
            width: 60,
            dataIndex: 'price',
            renderer: function(value){
    			return (value == null || value == '') ? '': cnMoney(value);	
            }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
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
        rootVisible : false                         
	});

	treePanel.on('beforeload', function(node) {
		var uuid = node.attributes.uuid;
		if (uuid == null)
			uuid = '0';
		var baseParams = treePanel.loader.baseParams;
		baseParams.parent = uuid;
	})

	treePanel.on('contextmenu', contextmenu, this);
	var treeMenu
	function contextmenu(node, e){
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (rootText == name) return;
	    var treeMenu = new Ext.menu.Menu({
	        id: 'treeMenu',
	        width: 100,
	        items: [{
	        			id: 'menu_apply',
		                text: '新增',
		                value: node,
		                iconCls: 'add',
		                handler : toHandler
                    }, '-', {
						id : 'menu_update',
						text : '修改',
						value : node,
						iconCls : 'btn',
						handler : toHandler
					}, '-', {
                    	id: 'menu_del',
		                text: '删除',
		                value: node,
		                iconCls: 'remove',
		                handler : toHandler
                	}]
	    });
		
	    var coords = e.getXY();
	    treeMenu.showAt([coords[0], coords[1]]);
	    if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}
	
	function toHandler(){
		formPanel.expand();
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("uuid").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		
		if ("新增" == state){
		    saveBtn.setDisabled(false);
		    DWREngine.setAsync(false); 
		   	 var indexId ;
		   	 matFrameMgm.getIndexId(menu_nodeId, function(id){
		   	 	indexId = id;
		   	 });
		    DWREngine.setAsync(false); 
			var formRecord = Ext.data.Record.create(ColumnsF);
			loadFormRecord = new formRecord({
	    		pid: PID,
	    		uuid: null,
	    		catNo: indexId,
	    		catName: '',
	    		spec: '',
	    		unit: null,
	    		price: null,
	    		enName: '',
	    		warehouse: '',
	    		wareNo:'',
	    		remark:'',
	    		isleaf: 1,
	    		appid:'',
	    		parent: menu_nodeId
    		});	
    		formPanel.isNew = true  
    	    formPanel.getForm().loadRecord(loadFormRecord);
		}else if ("删除" == state){
			delHandler(menu_isLeaf, menu_nodeId, menu_parent,node);
		}else {
			formPanel.isNew = false
			saveBtn.setDisabled(false);
	}
		
	}
	
	function delHandler(isleaf, nodeid, parentid, node) {
		if ("0" == isleaf) {
			Ext.Msg.show({
				title : '提示',
				msg : '父节点不能进行删除操作！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		} else {
			Ext.Msg.show({
				title : '提示',
				msg : '是否删除' + node.attributes.catName ,
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,

				fn : function(value) {
					if ("yes" == value) {
						treePanel.getEl().mask("loading...");
						matFrameMgm.deleteMatFrame(nodeid, function() {
								var formDelRecord = Ext.data.Record.create(ColumnsF);
								var flag = (node.parentNode.childNodes.length == 1)
								var pNode = flag? node.parentNode.parentNode: node.parentNode

								var formRecord = Ext.data.Record.create(ColumnsF);
								var emptyRecord = new formRecord({
									pid: PID,
						    		uuid: null,
						    		catNo: '',
						    		catName: '',
						    		spec: '',
						    		unit: null,
						    		price: null,
						    		enName: '',
						    		warehouse: '',
						    		wareNo:'',
						    		remark:'',
						    		appid:'',
						    		isleaf: 1,
						    		parent: ''
								});								
								formPanel.getForm().loadRecord(emptyRecord);
								formPanel.getForm().clearInvalid();
								
								node.remove()
								if (flag) {
									var uuid = pNode.attributes.uuid;
//									treePanel.loader.dataUrl = BASE_PATH+ "servlet/BdgServlet?ac=equFrameTree&parent="
//											+ uuid;
									var baseParams = treePanel.loader.baseParams	
									baseParams.parent = uuid;	
								}
								treeLoader.load(pNode);
								pNode.expand();
								Ext.example.msg('删除成功！', '您成功删除了一条概算信息！');
								treePanel.getEl().unmask();
						});
					}
				}
			});
		}
	}
	
	
	treePanel.on('click', onClick);
	
	function onClick(node, e ){
		formPanel.expand();
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		var menu_uuid = isRoot ? "0" : elNode.all("uuid").innerText;
		var formRecord = Ext.data.Record.create(ColumnsF);
	    var loadFormRecord = null;
	    
	    saveBtn.setDisabled(true);
	    
    	DWREngine.setAsync(false);
    	baseMgm.findById(beanName, menu_uuid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
		DWREngine.setAsync(true);
		
		tmpNode = node;
		tmpLeaf = menu_isLeaf;
	    formPanel.getForm().loadRecord(loadFormRecord);
	}
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		tbar:['<font color=#15428b><b>&nbsp;材料结构维护</b></font>'],
		items: [treePanel,formPanel]
		
	}) 
    
	// 7. 创建viewport加入面板content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel]
        });
    }
    treePanel.render(); // 显示树
    treePanel.expand();
	root.expand();
});