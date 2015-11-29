
Ext.onReady(function(){		
	var tabs = new Ext.TabPanel({
        activeTab: 0,
        height: 300,
        split: true,
        plain: true,
        border: false,
        region: 'south',
        forceFit: true,
        collapsible: true,			//是否可折叠
        items:[gridPanelMat,gridPanelDoc]
    });	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanelCon,tabs]
    });
    var topToolbar = gridPanelMat.getTopToolbar()
     if (ModuleLVL < 3){
     	//gridPanelCon.getTopToolbar().insertButton(0,btnAdd);
		topToolbar.insertButton(0,addBtn)
		topToolbar.insertButton(2,matGridSaveBtn)
     }
     
     tabs.on('tabchange', function(t, p){
     	if(p==gridPanelDoc) {
     		if (ModuleLVL < 3){
		     	gridPanelDoc.getTopToolbar().add(addAdjunct, '-', editAdjunct, '-', delAdjunct, '-', btnQuery, '-',btndevolve);
     		}
     	}
     })
});