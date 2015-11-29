var FLAG_LAYOUT = "WZBODY";
Ext.onReady(function() {
	var conditions = "?conid=" + edit_conid + "&partUids=" + edit_partUids + "&equName="
			+ edit_equName + "&treeUids=" + edit_treeUids + "&flagLayout=" + FLAG_LAYOUT;
	var url3 = basePath + "Business/wzgl/baseinfo_wzgl/wz.into.warehousing.main.jsp" + conditions;
	var url6 = basePath + "Business/wzgl/baseinfo_wzgl/wz.goods.stock.out.jsp" + conditions;
	var intosContentPanel3 = new Ext.Panel({
		id : 'intosContentPanel3',
		layout : 'fit',
		title : '正式入库',
		html : '<iframe name="intosContentPanel3" style="width:100%;height:100%;" src="'
				+ url3 + '" />'// 以iframe的形式
	});
	var outContentPanel3 = new Ext.Panel({
		id : 'outContentPanel3',
		layout : 'fit',
		title : '正式出库',
		html : '<iframe name="outContentPanel3" style="width:100%;height:100%;" src="'
				+ url6 + '" />'// 以iframe的形式
	});
	var tabPanel = new Ext.TabPanel({
				renderTo : 'mainDiv',
				activeTab : 0,
				border : false,
				height : document.body.clientHeight,
				region : 'center',
				items : [intosContentPanel3, outContentPanel3],
				listeners : {
					'tabchange' : function(tabPanel, tab) {
						document.frames[tab.id].location.reload();
					}
				}
			});

	var viewPort = new Ext.Viewport({
				layout : 'border',
				border : false,
				items : [tabPanel]
			});

})