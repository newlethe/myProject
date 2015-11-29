
var conid = "";
var conno = "";
var conname = "";

Ext.onReady(function (){
	//document.all.mainFrame.src = 'jsp/contract/cont.generalInfo.input.jsp'
//	function doLoad(){
//		var modName = this.text;
//		var url = "";
//		if (conid!=""&&conno!=""&&conname!="")
//		loadModule(modName, window.frames[0], "conid=" + conid + "&conname=" + conname + "&conno=" + conno);
//		//if ("维护" == modName) loadModule("合同维护", window.frames[0]);
//	}
	var btnConInfo = new Ext.Button({
		id: 'contract',
		text: '基本信息',
		tooltip: '基本信息',    
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href = CONTEXT_PATH + '/Business/budget/acm.contInfo.jsp';
		}
	});

	var btnEquipment = new Ext.Button({
		id: 'equipment',
		text: '合同投资完成信息',
		tooltip: '合同投资完成信息',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/acm.contract.completion.jsp?conid=" 
				+ conid + "&conname=" + conname +  "&conno=" + conno;
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
		add(btnConInfo, '-', btnEquipment);
	}
	//loadModule("合同维护", window.frames[0]);
	window.frames[0].location.href = CONTEXT_PATH + '/Business/budget/acm.contInfo.jsp';
});