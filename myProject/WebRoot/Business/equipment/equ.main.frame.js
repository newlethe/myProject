var conid = "";
var conno = "";
var conname = "";
var conmoney = "";
var partyb="";    

//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递

Ext.onReady(function (){
	function doLoad(){
		var modName = this.text;
		var url = "";
		var modid = null;
		DWREngine.setAsync(false);
		systemMgm.getModuleIdByName(modName,null,function(flag){
			modid = flag
		})
		DWREngine.setAsync(true);
		loadModule(modid, window.frames[0], "conid=" + conid + "&conname=" + conname + "&conno=" 
			+ conno + "&partyb="+ partyb+ "&conmoney=" + conmoney);
		
	}
	var btnConInfo = new Ext.Button({
		id: 'contract',
		text: '设备合同',
		tooltip: '设备合同',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href = CONTEXT_PATH + '/Business/equipment/equ.contInfo.input.jsp';
		}
	});

	var btnEquipment = new Ext.Button({
		id: 'equipment',
		text: '设备清单',
		tooltip: '设备清单',
		disabled: true,
		iconCls: 'btn',
		handler: doLoad
	});
	
	var btnGetGoods = new Ext.Button({
		id: 'getGoods',
		text: '设备入库',
		tooltip: '设备入库',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});
	var btnExitGoods = new Ext.Button({
		id: 'exitGoods',
		text: '设备出库',
		tooltip: '设备出库',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});	
	var btnRec = new Ext.Button({
		id: 'rec',
		text: '设备领用',
		tooltip: '设备领用',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});
	
	var btnArrival = new Ext.Button({
		id: 'arrival',
		text: '设备到货',
		tooltip: '设备到货',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});	
	
	var btnOpen = new Ext.Button({
		id: 'openbox',
		text: '设备开箱',
		tooltip: '设备开箱',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});		
	
	var btnSetup = new Ext.Button({
		id: 'setup',
		text: '设备安装',
		tooltip: '设备安装',
		iconCls: 'btn',
		disabled: true,
		handler: doLoad
	});	
	
	
	var btnUrge = new Ext.Button({
		id: 'urge',
		text: '设备催交',
		tooltip: '设备催交',
		disabled: true,
		hidden: true,	//暂不提供设备催交功能
		iconCls: 'btn',
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
		add(btnConInfo,  '-',btnEquipment ,'-', btnArrival ,'-',btnOpen,'-', btnGetGoods,'-',btnExitGoods,'-',btnSetup ,'-', btnUrge);
	}
	window.frames[0].location.href = CONTEXT_PATH + '/Business/equipment/equ.contInfo.input.jsp';
});