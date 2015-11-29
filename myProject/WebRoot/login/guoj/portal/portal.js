var setFastModWin,showNewsWin
		
//var swPanelHeight = (window["sw"]) ? sw.height - 29 : 270
var newsPicHeight = (window["newsPic"]) ? newsPic.height : 270
var newsHeight = (window["news"]) ? news.height - 29 : 270
var todoListHeight = (window["todoList"]) ? todoList.height: 270
var linksHeight = (window["links"]) ? links.height - 29 : 270
var infosHeight = (window["infos"]) ? infos.height -12: 270
var MessagesHeight = (window["Messages"]) ? Messages.height : 270
var infosPanel;
var MessagesPanel;
var validHeight;
var portlets1;

Ext.onReady(function(){
	Ext.QuickTips.init();
	/* 三维图片链接 */
	swUrl=CONTEXT_PATH+'/login/guoj/swxt.html'
	var swPanel = new Ext.Panel({
		border: false,
		layout:'fit',
		region: 'north',
		height:100,
		html:"<iframe name='frm' scrolling='auto' src='"+swUrl+"' width='100%' height='100%' ></iframe>"
	}) ;

	/* 新闻图片链接 */
	newsPicUrl=CONTEXT_PATH+'/login/guoj/portal/news/com.news.picture.query.jsp'
	var newsPicPanel = new Ext.Panel({
		title:"新闻图片",
		layout:'fit',
		region: 'center',
		style: 'padding:5px 0px 5px 5px',
		height:newsPicHeight,
		html:"<iframe name='frm' scrolling='auto' src='"+newsPicUrl+"' width='100%' height='100%' ></iframe>"
	}) ;
	if (window.newsPic) {
		Ext.applyIf(newsPic,
		{
			items: newsPicPanel
		})
	}
	
	/* 新闻 */
	newsUrl=CONTEXT_PATH+'/login/guoj/portal/news/news.jsp'
	var newsPanel = new Ext.Panel({
		title:'国锦煤电新闻',
		layout:'fit',
		region: 'center',
		style: 'padding:5px 0px 5px 5px',
		height:newsHeight,
		html:"<iframe name='frm' scrolling='auto' src='"+newsUrl+"' width='100%' height='100%' ></iframe>"
	}) ;
	if (window.news) {
		Ext.applyIf(news,
		{
			items: newsPanel
		})
	}
	
	/* 常用链接 */
	linksUrl=CONTEXT_PATH+'/login/guoj/portal/contact/contactInfo.jsp'
	var linksPanel = new Ext.Panel({
		title:"常用链接",
		layout:'fit',
		region: 'south',
		style: 'padding:5px 0px 5px 5px',
		height:linksHeight,
		html:"<iframe name='frm' scrolling='auto' src='"+linksUrl+"' width='100%' height='100%' ></iframe>"
	}) ;
	
	if (window.links) {
		Ext.applyIf(links,
		{
			items: linksPanel
		})
	}
	/* 主要待办 */
	MessagesUrl=CONTEXT_PATH+'/login/guoj/portal/ps.jsp'
	 MessagesPanel = new Ext.Panel({
		layout:'fit',
		region: 'south',
		style: 'padding:5px 0px 5px 5px',
		height:MessagesHeight,
		html:"<iframe name='MessagesPanelFrm' scrolling='auto' src='"+MessagesUrl+"' width='100%' height='100%' ></iframe>"
	}) ;
	
	if (window.Messages) {
		Ext.applyIf(Messages,
		{
			items: MessagesPanel
		})
	}
	
	/* 待办事项 */
	var todoListPanel = new Ext.Panel({
		layout: 'fit',
		region: 'center',
		height:todoListHeight,
		style: 'padding:5px 0px 5px 5px',
		//layout:'ux.row',
		items:[grid]
	}) ;

	/* 消息提醒 */
	infosPanel = new Ext.Panel({
		layout: 'fit',
		region: 'south',
		height:infosHeight,
		style: 'padding:5px 0px 5px 5px',
		//layout:'ux.row',
		items:[info_grid]
	}) ;

    portlets1 = new Ext.Panel({
    	border: false,
    	layout: 'column',
    	items: [{
			id: 'c1',
			border: false,
			columnWidth: .31,
    		layout: 'border',
			items: [newsPicPanel, MessagesPanel] 
    	},{
    		id: 'c2',
    		layout: 'border',
    		border: false,
    		columnWidth: .43,
    		items: [newsPanel, infosPanel]
    	},{
    		id: 'c3',
    		border: false,
    		layout: 'border',
    		columnWidth: .26,
    		items: [todoListPanel, linksPanel]
    	}]
    });

    var viewport = new Ext.Viewport({
        layout:'fit',
        border: false,
        items:[portlets1]
    });
    
    validHeight = portlets1.getSize().height;
    Ext.getCmp("c1").setHeight(validHeight);
    Ext.getCmp("c2").setHeight(validHeight);
    Ext.getCmp("c3").setHeight(validHeight);

    loadInfoGrid()//读取待办事项 
    loadInfo()//读取消息
    
	/*	处理进度条	*/
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
   
	function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
    
});
    function reSizePanel(h) {
    	Ext.getCmp("c1").setHeight(h);
	    Ext.getCmp("c2").setHeight(h);
	    Ext.getCmp("c3").setHeight(h);
    }
