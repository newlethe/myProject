var mainPanel;
var currentPanelName;

Ext.onReady(function() {

	var buildBtn = new Ext.Button({
				id : 'build-prj',
				text : '建筑工程',
				iconCls : 'btn',
				handler : loadHandler
			});

	var installBtn = new Ext.Button({
				id : 'install-prj',
				text : '安装工程',
				iconCls : 'btn',
				handler : loadHandler
			});

	var otherBtn = new Ext.Button({
				id : 'other-prj',
				text : '其他费用',
				iconCls : 'btn',
				disabled : false,
				handler : loadHandler
			});

	mainPanel = new Ext.Panel({
				layout : 'fit',
				region : 'center',
				border : false,
				header : false,
				tbar : ['-', buildBtn, '-', installBtn, '-', otherBtn],
				contentEl : 'mainDiv'
			})

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [mainPanel]
			});

	function loadHandler() {
		if (currentPanelName == this.id) {
			return;
		}

		var url;
		switch (this.id) {
			case 'build-prj' :
				url = BASE_PATH
						+ '/Business/finalAccounts/bdgStructure/fa.bdg.define.jsp';
				loadUrl(url);
				currentPanelName = this.id;
				return;
			case 'install-prj' :
				url = BASE_PATH
						+ '/Business/finalAccounts/bdgStructure/fa.bdg.define.install.jsp?rootParentId=0102&defTreeType=install';
				loadUrl(url);
				currentPanelName = this.id;
				return;
			case 'other-prj' :
				url = BASE_PATH
						+ '/Business/finalAccounts/bdgStructure/fa.bdg.define.install.jsp?rootParentId=0103&defTreeType=other';
				loadUrl(url);
				currentPanelName = this.id;
				return;

		}
	}

	function loadUrl(url) {
		window.frames['mainFrame'].location.href = url;
	}

	loadUrl(BASE_PATH
			+ '/Business/finalAccounts/bdgStructure/fa.bdg.define.jsp');

});
