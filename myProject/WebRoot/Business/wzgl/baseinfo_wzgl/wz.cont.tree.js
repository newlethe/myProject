/**
 * 通用材料合同分类树
 * @author zhangh 2012-07-06
 */
 
var root;
var treeLoader;
var treePanel;

var fileWin;

var whereSqls = "";

    //填写单位
    var rightArr = new Array();
    var competenceFlag = false;
    var viewSql = "1=1";
    var viewSql2 = "2=2";//只在正式出库使用此条件

Ext.onReady(function(){
    
        //材料开箱申请，开箱检查，正式入库，正式出库的单据需要根据用户过滤
	    DWREngine.setAsync(false);
	    appMgm.getCodeValue("填写单位",function(list){
	        for(i = 0; i < list.length; i++) {
	            var temp = new Array();
	            temp.push(list[i].propertyCode);    
	            temp.push(list[i].propertyName);        
	            rightArr.push(temp);            
	        }
	    });
	    DWREngine.setAsync(true);
	    //权限控制，只有属性代码中“填写单位”对应的部门用户才能进行数据操作
	    //当前用户只能编辑自己添加的数据
	    for(var i=0;i<rightArr.length;i++){
	        if(USERDEPTID == rightArr[i][0]){
	            competenceFlag = true;
            if(typeof userFilter != "undefined" && userFilter == true){
	            viewSql = "createUnit='"+rightArr[i][0]+"'";
		    }
	            viewSql2 = "createUnit='"+rightArr[i][0]+"'";
	            break;
	        }
	    }
    
	if(edit_flagLayout ==''){
	   whereSqls = "  and judgmentFlag ='noBody' and "+viewSql;
	}else if(edit_flagLayout=="query"){
	   whereSqls = " and 1=1 and "+viewSql;
	}else{
	   whereSqls = "  and judgmentFlag ='body' ";
	}
    
	root = new Ext.tree.AsyncTreeNode({
        id : "0",
        text: "材料合同分类",
        iconCls: 'form'
    })
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"WzTypeTreeList", 
			businessName:"wzglMgmImpl",
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
        width: 350,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: false,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '材料合同分类树',
            width: 540,
            dataIndex: 'treename'
        },{
            header: '合同分类树主键',
            width: 0,
            dataIndex: 'uids',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
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
		if(node.attributes.parentid=="0"){
			queryParent=node.attributes.treeid;
		}
		treePanel.loader.baseParams.parent = treeid;
		treePanel.loader.baseParams.conid = conid;
	});
	
	treePanel.on('click', onClick);
	function onClick(node, e){
		var elNode = node.getUI().elNode;
		if(flagaddorupdate){
		      onClick(node, e);
		}else{
			var treeuuidflag =false;
			for(i = 0; i < selTreeuids.length; i++) {
				if(selTreeuids[i]==elNode.all("uuid").innerText){
				     treeuuidflag=true;
				     break;
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
            selectUuid = isRoot ? "0" : elNode.all("uuid").innerText;
            selectConid = isRoot ? flowconid : elNode.all("conid").innerText;
            selectParentid = isRoot ? "0" : elNode.all("parentid").innerText;
        }else{
			isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
			selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
			selectUuid = isRoot ? "0" : elNode.all("uuid").innerText;
			selectConid = isRoot ? "0" : elNode.all("conid").innerText;
			selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
        }
		if(selectParentid == "0"){
            if((typeof isFlwTask != "undefined" || typeof isFlwView != "undefined")&&(isFlwTask == true || isFlwView == true) && flowid != ""){ 
                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from WzConOveTreeView  where parentid = '"+selectTreeid+"' )"+" and flowid='"+flowid+"'"+ whereSqls;
            }else{
                ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid in (select conid from WzConOveTreeView  where parentid = '"+selectTreeid+"' )"+ whereSqls;
            }
            ds.load({params:{start:0,limit:PAGE_SIZE}});
		}else{
				//查询当前选中节点的所有子节点主键。
				var sql = "select a.uids from ( select t.* from wz_con_ove_tree_view t " +
						" where t.conid = '"+selectConid+"' ) a start with a.treeid = "+
						" (SELECT t.treeid from wz_con_ove_tree_view t where t.uids = '"+selectUuid+"' " +
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
                    ds.baseParams.params = "pid='"+CURRENTAPPID+"' and conid='"+selectConid+"' and treeuids in ("+treeuuidstr+")  and flowid='"+flowid+"'"+ whereSqls;
                }else{
                    ds.baseParams.params = "pid='"+CURRENTAPPID+"' and (conid='"+selectConid+"' or treeuids in ("+treeuuidstr+"))"+ whereSqls;
                }
                ds.load({params:{start:0,limit:PAGE_SIZE}});		
		}
	}
});
	