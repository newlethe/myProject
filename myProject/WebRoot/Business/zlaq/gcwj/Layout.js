var dataUsers = new Array();
var dsUser
Ext.onReady(function() {
	DWREngine.setAsync(false);
	systemMgm.getUserByWhere('', function(list) { // 获取编制单位类型
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].userid);
					temp.push(list[i].realname);
					dataUsers.push(temp);
				}
			});
    DWREngine.setAsync(true);
    dsUser = new Ext.data.SimpleStore({
		fields: ['userid','realname'],   
		data: dataUsers
	});
	
    contentPanel = new Ext.TabPanel({
                    region:'center',
                    deferredRender:false,
                    activeTab:0,
                    items:[fileGridPanel,fileModelGridPanel]
                });
	fileGridPanel.on('activate',loadGrid)
	fileModelGridPanel.on('activate',loadGrid)
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel,contentPanel]
	});
	
	treePanel.render()
	rootNode.expand(true);
	rootNode.select();

});

function loadGrid(){
	try{
		var ds = contentPanel.getActiveTab().getStore()
		ds.baseParams.params = paramStr;
		ds.load({
		   	params:{
		    	start: 0,
		    	limit: 20
		   	}
		});
	}catch(e){
	}
}
function formatDate(value){
    return value ? value.dateFormat('Y-m-d') : '';
};

function formatDateTime(value){
    return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
};
function fileicon(value) {
	if (value != '') {
		return "<center><a href='" + BASE_PATH
				+ "servlet/MainServlet?ac=downloadfile&fileid=" + value
				+ "'><img src='" + BASE_PATH
				+ "jsp/res/images/word.gif'></img></a></center>"
	} else {

	}
}
