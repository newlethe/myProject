var partBPage =CONTEXT_PATH+"/Business/contract/cont.partB.addorupdate.jsp";
Ext.onReady(function(){
    var ct = new Ext.Panel({
		border : true,
		id : 'centerpanel',
		region : 'center',
		layout :'fit',
		width : 200,
		split : true,
		html : '<iframe name="centerFrame" src="'
				+partBPage
				+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
	  });
    new Ext.Viewport({
        layout: 'border',
		border: false,
        items: [ct
        ]
    });
})


