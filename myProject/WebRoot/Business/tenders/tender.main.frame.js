
var conid = "";
var conno = "";
var conname = "";
Ext.onReady(function (){
	function doLoad(){
		var modName =this.text;
		var url = "";
		//if (conid!=""&&conno!=""&&conname!="")
		//loadModule(modName, window.frames[0], "conid=" + conid + "&conname=" + conname + "&conno=" + conno);
		loadModule(modName,window.frames[0],"1=1");
	}
	var btnBaseInfo = new Ext.Button({
		id: 'tenderinfo',
		text: '招投标基本信息',
		tooltip: '招投标基本信息',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href = CONTEXT_PATH + '/Business/tenders/tender.main.frame.jsp';
		}
	});
	var btnUniInfo = new Ext.Button({
		id: 'unitinfo',
		text: '投标单位信息',
		tooltip: '投标单位信息',
		iconCls: 'btn',
		//disabled: true,
		handler: doLoad
	});
	var btnTensubInfo = new Ext.Button({
		id: 'subinfo',
		text: '标段划分信息',
		tooltip: '标段划分信息',
		iconCls: 'btn',
		//disabled: true,
		handler: doLoad
	});
	var btnTenabiInfo = new Ext.Button({
		id: 'abiinfo',
		text: '招标人才库信息',
		tooltip: '招标人才库信息',
		iconCls: 'btn',
		//disabled: true,
		handler: doLoad
	});
	var btnComInfo = new Ext.Button({
		id: 'cominfo',
		text: '招标委员会信息',
		tooltip: '招标委员会信息',
		iconCls: 'btn',
		//disabled: true,
		handler: doLoad
	});

    var btnRegInfo = new Ext.Button({
		id: 'reginfo',
		text: '招标评委信息',
		tooltip: '招标评委信息',
		iconCls: 'btn',
		//disabled: true,
		handler: doLoad
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
		add(btnBaseInfo, '-', btnUniInfo, "-", btnTensubInfo,"-",btnTenabiInfo,"-", btnComInfo,"-",btnRegInfo);
	}
	window.frames[0].location.href = CONTEXT_PATH + '/Business/tenders/tender.baseInfo.input.jsp';
});