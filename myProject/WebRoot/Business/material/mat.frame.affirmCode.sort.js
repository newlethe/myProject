//---------------------------------下拉树 begin --------------------------------------------

	var comboxWithTree = new Ext.form.ComboBox({   
        store:new Ext.data.SimpleStore({fields:[],data:[[]]}),   
        editable:false,   
        mode: 'local',   
        triggerAction:'all',   
//        maxHeight: 150,   
        tpl: "<tpl for='.'><div style='height:900px'><div id='tree'></div></div></tpl>",   
        selectedClass:'',   
        onSelect:Ext.emptyFn   
    }); 
	
	var rootNew = new Ext.tree.AsyncTreeNode({
        text: 'bb',
        iconCls: 'form',
        id : '0'
    })
  
	var treeLoaderNew = new Ext.tree.TreeLoader({
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
	
	var treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 600,
//        minSize: 100,
//        maxSize: 900,
        frame: false,
        header: false,
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            width: 300,				
            dataIndex: 'catName'
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	
	treePanelNew.on('beforeload', function(node) {
		var uuid = node.attributes.uuid;
		if (uuid == null)
			uuid = '0';
		var baseParams = treePanelNew.loader.baseParams;
		baseParams.parent = uuid;
	})
	
	treePanelNew.on('click',function(node){   
          comboxWithTree.setValue(node.attributes.uuid); 
//          comboxWithTree.setRawValue(node.attributes.catName)
          comboxWithTree.collapse();    
      });   
      
    comboxWithTree.on('expand',function(){  
        treePanelNew.expand();
    	rootNew.expand();
   	    treePanelNew.render('tree');
      });   

//-------------------------------------------------下拉树 end----------------------------
	