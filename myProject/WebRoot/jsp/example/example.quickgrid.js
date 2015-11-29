
Ext.onReady(function() {
	var tabPanel = new Ext.TabPanel({
		region: 'center',
		frame: false,
		border: false,
		activeTab: 0,
		defaults:{autoScroll: true},
        items:[{
                title: 'QuickGrid',
                autoLoad:'jsp/example/example.quickgrid.intro.htm'
            },{
            	title: '运行例子',
            	autoLoad:'jsp/example/example.quickgrid.frame.htm'
            },{
            	title: '查看脚本',
            	autoLoad:'jsp/example/example.quickgrid.code.htm'
            }
        ]
	})
	var viewport = new Ext.Viewport({
		layout:'border',
		items : [tabPanel]
	});
})