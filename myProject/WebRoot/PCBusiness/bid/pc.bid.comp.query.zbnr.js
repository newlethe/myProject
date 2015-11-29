Ext.onReady(function(){
	var zbUids=zbuids;
   	var url1=basePath+"PCBusiness/bid/pc.bid.zb.apply.input.jsp?zbUids="+zbUids+"";
  	var url2=basePath+"PCBusiness/bid/pc.bid.zb.agency.jsp?zbUids="+zbUids+"";
	var url3=basePath+"PCBusiness/bid/pc.bid.zhxx.jsp?zbUids="+zbUids+"";
	var zbApllyPanel = new Ext.Panel({
   	    id : 'zbApply',
		layout:'fit',
		title:'招标申请信息',
		html:'<iframe name="zbApply" style="width:100%;height:100%;" src="'+url1+'" />'//以iframe的形式
	});
	var agencyPanel = new Ext.Panel({
   	    id : 'agency',
		layout:'fit',
		title:'招标代理机构',
		html:'<iframe name="agency" style="width:100%;height:100%;" src="'+url2+'" />'//以iframe的形式
	});
	var zhxxPanel = new Ext.Panel({
   	    id : 'zhxx',
		layout:'fit',
		title:'招标综合信息',
		html:'<iframe name="zhxx" style="width:100%;height:100%;" src="'+url3+'" />'//以iframe的形式
	});
   var zhTabPanel = new Ext.TabPanel({
   	    id : 'zhTabPanel',
		activeTab : 0,
        border: false,
        region: 'center',
        items : [zbApllyPanel,agencyPanel,zhxxPanel],
        listeners : {
            'tabchange' : function(tabPanel,tab){
                if(document.frames[tab.id].location)
               	 document.frames[tab.id].location.reload();
            }
        }
	});
	
   var zhPanel = new Ext.Panel({
   	    id : 'zhPanel',
		layout:'border',
		region: 'center',
		border: false,
		title:'招标内容综合页面',
		items : [zhTabPanel]
	});	
	var viewPort = new Ext.Viewport({
		layout:'fit',
		//border: false,
        items: [zhPanel]
	});
})