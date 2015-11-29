
var conid = "";
var conno = "";
var conname = "";
var conmoney = "";

//encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递

Ext.onReady(function (){

	function doLoad(){
		var modName = "合同"+this.text;
		var url = "";
		if (this.text)
		loadModule(modName, window.frames[0], "conid=" + conid + "&conname=" + conname + "&conno=" + conno)
	}
	var btnMoney = new Ext.Button({
				id : 'money',
				text : '合同分摊',
				tooltip : '合同分摊',
				iconCls : 'btn',
				disabled : true,
				handler : function() {
					window.frames[0].location.href = BASE_PATH
							+ "Business/budget/bdg.money.apportion.combine.jsp?conid="
							+ conid + "&conname=" + encodeURIComponent(conname)
							+ "&conmoney=" + conmoney + "&conno=" + conno + "&isquery=1";
				}
			});
	var btnChange = new Ext.Button({
		id: 'change',
		text: '变更分摊',
		tooltip: '变更分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.change.jsp?conid=" + conid + "&conname=" + encodeURIComponent(conname)
			 +　"&conmoney=" + conmoney+ "&conno=" + conno;
		}
	});
	var btnPayInfo = new Ext.Button({
		id: 'pay',
		text: '付款分摊',
		tooltip: '付款分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.payInfo.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno;
		}
	});
	var btnBreach = new Ext.Button({
		id: 'breach',
		text: '违约分摊',
		tooltip: '违约分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.breach.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname)+ "&conno=" + conno;
		}
	});
	var btnCompensate = new Ext.Button({
		id: 'compensate',
		text: '索赔分摊',
		tooltip: '索赔分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.compensate.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno;
		}
	});
	var btnBalance = new Ext.Button({
		id: 'balance',
		text: '结算分摊',
		tooltip: '结算分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.balance.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno;
		}
		
	});
	var btnMain = new Ext.Button({
		id: 'main',
		text: '合同信息主页',
		tooltip: '合同信息主页',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp";
		}
	});
	var btnProject = new Ext.Button({
		id: 'project',
		text: '工程量分摊',
		tooltip: '工程量分摊',
		iconCls: 'btn',
		disabled: true,
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.project.apportion.jsp?conid=" 
				+ conid + "&conname=" + encodeURIComponent(conname) + "&conno=" + conno + "&type=normal";
		}
	});
	
	var btnEqu = new Ext.Button({
		id: 'equation',
		text: '平衡检查',
		tooltip: '平衡检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.conmoney.realmoney.jsp";
		}
	});
	
	var btnPro = new Ext.Button({
		id: 'equproject',
		text: '工程量检查',
		tooltip: '工程量检查',
		iconCls: 'btn',
		handler: function(){
			window.frames[0].location.href= BASE_PATH + "Business/budget/bdg.bdgmoney.project.jsp";
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
		add( btnMoney,"-",btnChange, "-",btnPayInfo , "-", btnCompensate, "-", btnBreach, 
			"-",btnBalance,'-',btnProject,'-',btnEqu,'-',btnPro,'-',btnMain);
	}
	
	window.frames[0].location.href = CONTEXT_PATH + '/Business/budget/bdg.generalInfo.input.jsp'
});