var root,rockTree,filter,centerPanel;
var PROJ_BASEINFO_PATH = BASE_PATH+"PCBusiness/zhxx/baseInfoInput";
var PROJ_QUERY_PATH = BASE_PATH+"PCBusiness/zhxx/query";
if(select_pid==undefined || select_pid==""){
		select_pid=CURRENTAPPID;		
}
Ext.onReady(function (){
	////////功能菜单//////////////////////
	filter = createUnitTreeCombo(null,null,null,"unitTypeId in ('0','1','2','3','4','5','A')");
	
	rockTree = getProjTree();
	_defaultUrl=PROJ_BASEINFO_PATH+"/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp?edit=false&edit_pid="+select_pid;
	centerPanel = new Ext.Panel({
    	title:'<center>项目基本信息查看</center>',
		region:'center',

		html: '<iframe name="bidDetailFrame" src="'+_defaultUrl+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
    });
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[rockTree,centerPanel]
    });	
    filter.value = CURRENTAPPID;
    filter.setRawValue(CURRENTAPPNAME);
	filter.on('select',reBuildRockTree);
});

function reBuildRockTree(){
	if(root.hasChildNodes()){
		var childNodes = root.childNodes;
		for(var i=childNodes.length-1;i>=0;i--){
    		root.removeChild(childNodes[i])
		}
	}
	var unitid=filter.getValue();
	if(unitid==undefined){
		root.appendChild(buildNode(select_pid));   		
	}else{
		DWREngine.setAsync(false);
		systemMgm.getPidsByUnitid(unitid,function(list){
    		for(var i=0;i<list.length; i++){
    			root.appendChild(buildNode(list[i].unitid,list[i].unitname));
    		}
		});
		DWREngine.setAsync(true);
	}
}

function buildNode(pid,text){
	if(text==undefined||text==""){
		DWREngine.setAsync(false);
		var _SQL="select PRJ_NAME from pc_zhxx_prj_info where pid='"+select_pid+"'";
		baseMgm.getData(_SQL, function(list) {
			if (list.length>0){
				text=list[0];
			} 
		});
		DWREngine.setAsync(true);
	}
	
	
	var node=new Ext.tree.AsyncTreeNode({
		text:text,
		pid:pid,
		expanded:true,
		children : [ {
			text : '项目基本信息',
			pid:pid,
			href : PROJ_BASEINFO_PATH+"/pc.zhxx.projinfo.baseinfo.addOrUpdate.jsp?edit=false&edit_pid="+pid,
			hrefTarget : "bidDetailFrame",
			leaf : true,
			pname: text
		}, {
			text : '项目公司信息',
			pid:pid,
			leaf : false,
			expanded : true,
			pname: text,
			children : [ {
				text : '项目组织结构',
				pid:pid,
				href : PROJ_QUERY_PATH+"/pc.zhxx.projinfo.unitStructure.jsp?edit_pid="+pid+"&edit_pname="+text,
				hrefTarget : "bidDetailFrame",
				pname: text,
				leaf : true
			}, {
				text : '项目主要人员',
				pid:pid,
				href : PROJ_QUERY_PATH+"/pc.zhxx.projinfo.keyman.jsp?edit_pid="+pid,
				hrefTarget : "bidDetailFrame",
				pname: text,
				leaf : true
			}, {
				text : '项目主要合作单位',
				pid:pid,
				href : PROJ_QUERY_PATH+"/pc.zhxx.projinfo.coUnit.jsp?edit_pid="+pid,
				hrefTarget : "bidDetailFrame",
				pname: text,
				leaf : true
			} ]
		}, {
			text : '项目主要事件',
			pid:pid,
			href : BASE_PATH + "Business/fileAndPublish/fileManage/com.fileManage.jsp?filterPid=" + pid + "&rootId=big_event_root&canReport=1",
			hrefTarget : "bidDetailFrame",
			pname: text,
			leaf : true
		} ]
	})
	
	return node;
}
//获取项目结构树
function getProjTree(){
	root=new Ext.tree.TreeNode({
		id:'t',
		text:'项目菜单',
		leaf:false,
		expanded:false
//		listeners:{
//			"append":function(tree,node,childNode){
//				if(!childNode.isFirst()){
//					childNode.expanded=false;
//				}
//			}
//		}
	})
	root.appendChild(buildNode(select_pid));
	var	tmptree = new Ext.tree.TreePanel({
		region:'west',
		width:270,
		autoScroll:true,
		rootVisible :false,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		tbar:[{
            iconCls : 'icon-expand-all',
            tooltip : '全部展开',
            handler : function() {
              root.expand(true);}
            }
        , '-', {
           iconCls : 'icon-collapse-all',
            tooltip : '全部折叠',
           handler : function() {
                root.collapse(true);}
        },filter],
		loader:new Ext.tree.TreeLoader(),
		root:root,
		listeners:{
			beforeclick:function(node){
				if(node.attributes.href!=undefined&&node.attributes.href!=""){
					var title = "<center>"+node.attributes.pname+" "+node.text+"</center>";
					centerPanel.setTitle(title)
				}
			}
		}
	});
	return tmptree;
}