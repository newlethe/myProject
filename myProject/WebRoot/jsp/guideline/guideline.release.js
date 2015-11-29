var viewport;
state='1';

Ext.onReady(function(){
	
	var panel = new Ext.Panel({
		id:'content-panel',
		//title:'指标下达',
		tbar:[],
        border: false,
        region:'center',
        split:true,
        layout:'border',
        layoutConfig: {
        	height:'100%'
        },
        items:[guideTree]
	});
	
	var releaseBtn = new Ext.Button({
		id : 'releaseBtn',
		text : '下达',
		tooltip : '下达',
		iconCls : 'btn',
		handler : releaseFun
	});
	
    viewport = new Ext.Viewport({
		layout:'fit',
		items:[panel]
	});
	
	panel.getTopToolbar().add(releaseBtn);
	
	function releaseFun(){
	
	}
});