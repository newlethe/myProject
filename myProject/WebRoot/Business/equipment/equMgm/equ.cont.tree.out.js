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
    var flowsort,flowsortname,flowconid,flowconname;
    if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && (flowconno != null && flowconno != "")){
        DWREngine.setAsync(false);
        baseDao.findByWhere2("com.sgepit.pmis.contract.hbm.ConOve", "conno='"+flowconno+"'", function(conList){
            flowsort = conList[0].sort;
            flowconid = conList[0].conid;
            flowconname = conList[0].conname;
        });
        roothide = true;
        //流程中，当前合同二级分类为根节点
        var sql = "SELECT C.Property_Name FROM PROPERTY_CODE C " +
                "WHERE C.TYPE_NAME = (SELECT T.UIDS FROM PROPERTY_TYPE T WHERE T.TYPE_NAME = '设备合同') " +
                "AND C.PROPERTY_CODE = '"+flowsort+"'";
        baseDao.getData(sql,function(str){
            flowsortname = str;
        })
        DWREngine.setAsync(true);
		root = new Ext.tree.AsyncTreeNode({
			id : flowsort,
			text: flowsortname,
			treeid : flowsort,
			conid : flowconid,
			expanded : true,
			iconCls: 'form'
		});
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
            width: 0,
            dataIndex: 'treeid',
            renderer: function(value){
            	return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '合同主键',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
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
		var conid=node.attributes.conid;
		if (treeid == null){
			treeid = "0";
			conid="";
		}
		treePanel.loader.baseParams.parent = treeid+SPLITB+"04";
		treePanel.loader.baseParams.conid = conid;
	});
	
	treePanel.on('click', onclicktree);
	function onclicktree(node, e){
		var elNode = node.getUI().elNode;
		if(flagaddorupdate){
		      onClick(node, e);
		}else{
			var treeuuidflag =false;
			for(i = 0; i < selTreeuids.length; i++) {
				if(selTreeuids[i]==elNode.all("uids").innerText){
				     treeuuidflag=true;
				     break;
				}else{
                    Ext.example.msg('提示信息','请先选择库存中相同设备类型的分类！');
                    return;
                }
			}
			if(treeuuidflag){
				onClick(node, e);
			}
		}
	}
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
            ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
            ds.load({params:{start:0,limit:PAGE_SIZE}});
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )"+" and flowid='"+flowid+"'";
            }else{
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from EquConOveTreeView  where parentid = '"+selectTreeid+"' )";
            }
            dsOut.load({params:{start:0,limit:PAGE_SIZE}});
            if(dsOutSub)dsOutSub.removeAll();
		}else{			//查询当前选中节点的所有子节点主键。
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
			ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
			ds.load({params:{start:0,limit:PAGE_SIZE}});
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")"+" and flowid='"+flowid+"'";
            }else{
                dsOut.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")";
            }
			dsOut.load({params:{start:0,limit:PAGE_SIZE}});
			if(dsOutSub)dsOutSub.removeAll();
		}
	}
});
	