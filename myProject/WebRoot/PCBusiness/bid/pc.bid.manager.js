var rockTree;
Ext.onReady(function (){
	////////功能菜单//////////////////////
	rockTree = createRockTree();
	var rootNode = rockTree.getNodeById('bid-root');
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ rockTree,{
        	region:'center',
			tbar:['->',{
				text:'返回',
				handler:function(){
					window.location.href = CONTEXT_PATH+"/PCBusiness/bid/pc.bid.statis.jsp";
				}
			}],
        	html: '<iframe name="bidFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
        }]
    });	
});
//功能菜单
function createRockTree(){
	var tmpTree = new Ext.tree.TreePanel({
		title:'功能菜单',
        collapsible : true,
		enableDD : true,
		region:'west',
		width:200,
		rootVisible : false,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader:new Ext.tree.TreeLoader(),
		root : new Ext.tree.AsyncTreeNode({
	       text:"功能菜单",
	       id: "bid-root",
	       leaf:false,
	       children:[{ id : 'bid-apply-input',
	       		text:'招标信息录入',href:"PCBusiness/bid/pc.bid.zb.apply.input.jsp?pid=" + currentPid,hrefTarget:"bidFrame",leaf:true
	       	},{
	       		id : 'bid-agency',
	       		text:'招标代理机构',href:"PCBusiness/bid/pc.bid.zb.agency.jsp?pid=" + currentPid,hrefTarget:"bidFrame",leaf:true
	       	},{
	       		id : 'bid-notice',
	       		text:'招标公告',href:"PCBusiness/bid/pc.bid.zb.publish.notice.jsp?pid=" + currentPid,hrefTarget:"bidFrame",leaf:true
	       	},{
	       		id : 'bid-detail',
	       		text:'招标过程详细信息',href:"PCBusiness/bid/pc.bid.zb.content.jsp?pid=" + currentPid,hrefTarget:"bidFrame",leaf:true
	       	}]
	    })
	});
	return tmpTree;
}