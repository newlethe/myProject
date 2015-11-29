
Ext.onReady(function() {
	var tabPanel = new Ext.TabPanel({
		region: 'center',
		frame: false,
		border: false,
		activeTab: 0,
		defaults:{autoScroll: true},
        items:[{
                title: 'Ext Combo Grid',
                autoLoad:'jsp/example/example.extcombogrid.intro.htm'
            },{
            	title: '运行例子',
            	autoLoad:'jsp/example/example.extcombogrid.frame.htm'
            },{
            	title: '查看脚本',
            	autoLoad:'jsp/example/example.extcombogrid.code.htm'
            }
        ]
	})
	var viewport = new Ext.Viewport({
		layout:'border',
		items : [tabPanel]
	});
})