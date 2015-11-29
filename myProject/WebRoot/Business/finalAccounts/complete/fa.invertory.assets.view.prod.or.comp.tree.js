/**
 * 通用材料合同分类树
 * @author yanglh 2013-07-26
 *//*
 
var root;
var treeLoader;
var treePanel;


Ext.onReady(function(){
    
		root = new Ext.tree.AsyncTreeNode({
	        id : "0",
	        text: edit_flag == "comp"?"综合材料合同":"生产准备合同",
	        iconCls: 'tree'
	    })
		treeLoader = new Ext.tree.TreeLoader({
			url: MAIN_SERVLET,
			baseParams: {
				ac:"columntree", 
				treeName:"getFACompAssetCompOrProdConTree", 
				businessName:"faFixedAssetService",
				parent:"0",
				pid: CURRENTAPPID,
				conid:"",
				orgid : edit_flag
				
			},
			clearOnLoad: true,
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			}
		});
		
		treePanel = new Ext.tree.ColumnTree({
	        region: 'west',
	        width: 250,
	        minSize: 240,
	        maxSize: 550,
	        frame: false,
	        header: false,
	        border: false,
	        collapsible : true,
	        collapseMode : 'mini',
	        rootVisible: true,
	        split: true,
	        lines: true,
	        autoScroll: true,
	        animate: false,
			columns:[{
	            header: edit_flag == "comp"?"综合材料合同分类":"生产准备合同分类",
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
	*/
	
/**
 * 主体设备出入库单稽核，主体材料出入库单稽核，综合部出入库单稽核，生产准备入出库单稽核树
 * 
 * @author pengy 2013-07-17
 */

var root;
var treeLoader;
var treePanel;
var isLeaf = '';
var selectTreeid = '';
var selectUuid = '';
var selectConid = '';
var selectParentid = '';
var treeSql;
var whereStr = "compOrProd='"+edit_flag+"' and billState = '1' and auditState='1'";

Ext.onReady(function() {
    if(edit_flag=="prod"){
    	  treeFlag = "SCZB";
    }else{
          treeFlag =  "ZHB";
    }
	root = new Ext.tree.AsyncTreeNode({
				id : "0",
				text : "出入库单稽核合同树",
				iconCls : 'form'
			});

	treeLoader = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "intoAndOutAuditTreeList",
					businessName : "wzglMgmImpl",
					parent : "0",
					pid : CURRENTAPPID,
					treeFlag :  treeFlag,
					conid : ""
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanel = new Ext.tree.ColumnTree({
				region : 'west',
				width : 260,
				minSize : 240,
				maxSize : 550,
				frame : false,
				header : false,
				border : false,
				collapsible : true,
				collapseMode : 'mini',
				rootVisible : false,
				split : true,
				lines : true,
				autoScroll : true,
				animate : false,
				columns : [{
							header : '合同分类树',
							width : 540,
							dataIndex : 'treename'
						}, {
							header : '合同分类树主键',
							width : 0,
							dataIndex : 'uids',
							renderer : function(value) {
								return "<div id='uids'>" + value + "</div>";
							}
						}, {
							header : '系统编码',
							width : 0,
							dataIndex : 'treeid',
							renderer : function(value) {
								return "<div id='treeid'>" + value + "</div>";
							}
						}, {
							header : '合同主键',
							width : 0,
							dataIndex : 'conid',
							renderer : function(value) {
								return "<div id='conid1'>" + value + "</div>";
							}
						}, {
							header : '是否子节点',
							width : 0,
							dataIndex : 'isleaf',
							renderer : function(value) {
								return "<div id='isleaf'>" + value + "</div>";
							}
						}, {
							header : '父节点',
							width : 0,
							dataIndex : 'parentid',
							renderer : function(value) {
								return "<div id='parentid'>" + value + "</div>";
							}
						}],
				loader : treeLoader,
				root : root
			});

	treePanel.on('beforeload', function(node) {
				var treeid = node.attributes.treeid;
				var conid = node.attributes.conid;
				if (treeid == null) {
					treeid = "0";
					conid = "";
				}
				treePanel.loader.baseParams.parent = treeid;
				treePanel.loader.baseParams.conid = conid;
			});

	treePanel.on('click', onClick);
	treePanel.on('load', function() {
				if (root.hasChildNodes()) {
					root.childNodes[0].expand(false, false, null);
				}
			});

	function onClick(node, e) {
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		selectTreeid = isRoot ? "0" : elNode.all("treeid").innerText;
		selectUuid = isRoot ? "0" : elNode.all("uids").innerText;
		selectConid = isRoot ? "0" : elNode.all("conid1").innerText;
		selectParentid = isRoot ? "" : elNode.all("parentid").innerText;
		if (selectParentid == "0") {
			ds.baseParams.params = whereStr;
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
		} else if (selectTreeid == null || selectTreeid == '') {
			ds.baseParams.params = whereStr;
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});		
		} else {
			ds.baseParams.params = whereStr+" and  conno='"+selectTreeid+"'";
			ds.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
		}
	}

});
	
	