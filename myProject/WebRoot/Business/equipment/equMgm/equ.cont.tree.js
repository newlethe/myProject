/**
 * 通用设备合同分类树
 * @author zhangh 2012-07-06
 */
 
var root;
var treeLoader;
var treePanel;

var fileWin;

Ext.onReady(function(){
    var treePanelTitle = CURRENTAPPID == "1031902"? "设备/材料合同分类树":"设备合同分类树";
    root = new Ext.tree.AsyncTreeNode({
        id : "0",
        text: "设备合同分类树",
        iconCls: 'form'
    })
    var roothide = false;
    
    //流程中，根据选择的合同编号显示合同树
    var flowconid,flowconname;
    if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && (flowconno != null && flowconno != "")){
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conno='"+flowconno+"'", function(conList){
            flowconid = conList[0].conid;
            flowconname = conList[0].conname;
        });
        DWREngine.setAsync(true);
        roothide = true;
        //流程中，当前合同为根节点
            root = new Ext.tree.AsyncTreeNode({
		        id : flowconid,
		        text: flowconno+"【"+flowconname+"】",
		        treeid : flowconno,
		        conid : flowconid,
                expanded : true,
		        iconCls: 'form'
		    })
            
    }
    
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"newEquTypeTreeList", 
			businessName:"equMgm",
			parent:"0",
			pid: CURRENTAPPID,
			conid:""
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 240,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: roothide,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
		columns:[{
            header: treePanelTitle,
            width: 540,
            dataIndex: 'treename'
        },{
            header: '设备合同分类树主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '系统编码',
            //width: 90,
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            //width: 90,
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            //width: 60,
           	width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            //width: 70,
            width: 0,
            dataIndex: 'parentid',
            renderer: function(value){
            	return "<div id='parentid'>"+value+"</div>";
            }
        },{
        	header: '机组号',
        	width: 0,
        	dataIndex: 'jzid'
        }], 
        loader: treeLoader,
        root: root
	});

	treePanel.on('beforeload', function(node) {
		var treeid = node.attributes.treeid;
		var conid = node.attributes.conid;
		if (treeid == null){
			treeid = "0";
			conid="";
		}
		if(node.attributes.parentid=="0"){
			queryParent=node.attributes.treeid;
		}
		if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true)){
            treePanel.loader.baseParams.parent = treeid+SPLITB+"4";
        }else{
            treePanel.loader.baseParams.parent = treeid
        }
		treePanel.loader.baseParams.conid = conid;
	});
	
	treePanel.on('click', onClick);
	function onClick(node, e){
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
        if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true)){
            isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
            selectTreeid = isRoot ? flowconno : elNode.all("treeid").innerText;
            selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
            selectConid = isRoot ? flowconid : elNode.all("conid").innerText;
            selectParentid = isRoot ? "0" : elNode.all("parentid").innerText;
        }else{
			isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
			selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
			selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
			selectConid = isRoot ? "0" : elNode.all("conid").innerText;
			selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
        }
		if(selectParentid == "0"){
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )"+" and flowid='"+flowid+"'";
            }else{
                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
            }
            ds.load({params:{start:0,limit:PAGE_SIZE}});
			if(dsSub)dsSub.removeAll();
		}else{
			//以04开头的为技术资料
			if(selectTreeid.indexOf("04")== 0){
                if(typeof isFlwView != "undefined" && isFlwView == true) return;
				var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
						"?uuid="+selectUuid+"&conid="+selectConid+"&edit=false";
				fileWin = new Ext.Window({
					width: 950,
					height: 500,
					modal: true, 
					plain: true, 
					border: false, 
					resizable: false,
					layout : 'fit',
					html:"<iframe id='fileWinFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
					listeners : {
						'show' : function(){
							fileWinFrame.location.href  = url;
						}
					}
			    });
				fileWin.show();
			}else{
				//查询当前选中节点的所有子节点主键。
				var sql = "select a.uids from ( select t.* from equ_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from equ_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
						" and a.conid = '"+selectConid+"') connect by PRIOR  a.treeid =  a.parentid";
				var treeuuidstr = "";
				DWREngine.setAsync(false);
				baseDao.getData(sql,function(list){
					for(i = 0; i < list.length; i++) {
						treeuuidstr += ",'"+list[i]+"'";		
					}
				});	
				DWREngine.setAsync(true);
				treeuuidstr = treeuuidstr.substring(1);
                if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                    ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+") and flowid='"+flowid+"'";
                }else{
                    ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
                }
                ds.load({params:{start:0,limit:PAGE_SIZE}});
				if(dsSub)dsSub.removeAll();
			}
		}
	}

});
	