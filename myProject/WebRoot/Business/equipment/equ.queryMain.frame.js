Ext.onReady(function (){
	   
	var btnGetView = new Ext.Button({
		id: 'getView',
		text: '设备到货查询',
		tooltip: '设备到货查询',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href = CONTEXT_PATH + '/Business/equipment/equ.equipment.view.jsp';
		}
	});
	
	var btnPartView = new Ext.Button({
		id: 'partView',
		text: '备品备件查询',
		tooltip: '备品备件查询',
		iconCls: 'btn',
		handler: function(){
			loadModule(this.text, window.frames[0]);
		}
	});
	
	var btnInstruView = new Ext.Button({
		id: 'instruView',
		text: '专用工器具查询',
		tooltip: '专用工器具查询',
		iconCls: 'btn',
		handler: function(){
			loadModule(this.text, window.frames[0]);
		}
	});
	
    mainPanel = new Ext.Panel({
    	layout: 'fit',
    	region: 'center',
    	border: false,
    	header: false,
    	contentEl: 'mainDiv',
    	tbar: ['-']
    })
    
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [mainPanel]
    });
	
	var gridTopBar = mainPanel.getTopToolbar()
	with(gridTopBar){
		add(btnGetView, '-', btnPartView, '-', btnInstruView);
	}
	
	window.frames[0].location.href = CONTEXT_PATH + '/Business/equipment/equ.equipment.view.jsp';
});