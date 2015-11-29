var conid = "";
var conno = "";
var conname = "";
var conmoney = "";

// encodeURIComponent()函数，对传递的参数进行编码，使带#、+、%...等特殊符号能正常传递

Ext.onReady(function() {

	function doLoad() {
		var modName = "合同" + this.text;
		var url = "";
		// if (this.text)
		// TODO load module
		// loadModule(modName, window.frames[0], "conid=" + conid + "&conname="
		// + conname + "&conno=" + conno)
	}
	var btnMoney = new Ext.Button({
				id : 'money',
				text : '合同分摊',
				tooltip : '合同分摊',
				iconCls : 'btn',
				disabled : true,
				handler : function() {
					window.frames[0].location.href = encodeURI(BASE_PATH
							+ "Business/budgetNk/bdg.money.apportion.jsp?conid="
							+ conid + "&conname=" + encodeURIComponent(conname)
							+ "&conmoney=" + conmoney + "&conno=" + conno);

				}
			});

	mainPanel = new Ext.Panel({
				layout : 'fit',
				region : 'center',
				border : false,
				header : false,
				contentEl : 'mainDiv',
				tbar : ['-']
			})

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [mainPanel]
			});

	var gridTopBar = mainPanel.getTopToolbar();
	with (gridTopBar) {
		add(btnMoney);
	}

	window.frames[0].location.href = CONTEXT_PATH
			+ '/Business/budgetNk/bdg.generalInfo.jsp'
});