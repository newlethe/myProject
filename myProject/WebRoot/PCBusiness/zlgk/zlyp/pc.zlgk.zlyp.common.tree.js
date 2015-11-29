/**
 * 通用质量验评分类树
 * @author yanglh 2013-6-21
 */
 
var root;
var treeLoader;
var treePanel;
var selectedPath;
var getTemplateNum = "";
//带条件进行查询
var orgdata = " and deptId='"+USERDEPTID+"'";

var selectUuid= "";
var beanTree = 'com.sgepit.pcmis.zlgk.hbm.PcZlgkZlypTree';
Ext.onReady(function(){
    var treePanelTitle = '检验项目名称';
    root = new Ext.tree.AsyncTreeNode({
        id : "01",
        text: "验评标准树"
    })
    var roothide = true;
    
	treeLoader = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"zlgkZlypTypeTree", 
			businessName:"zlgkImpl",
			parent:0,
			pid: CURRENTAPPID,
			orgid:orgdata
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 300,
        minSize: 300,
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
            width: 300,
            dataIndex: 'engineerName'
        },{
            header: '主键',
            width: 0,
            dataIndex: 'uuid',
            renderer: function(value){
            	return "<div id='uuid'>"+value+"</div>";
            }
        },{
            header: '工程名称',
            width: 0,
            dataIndex: 'engineerName',
            renderer: function(value){
            	return "<div id='engineerName'>"+value+"</div>";
            }
        }, {
            header: '工程编号',
            width: 0,
            dataIndex: 'engineerNo',
            renderer: function(value){
            	return "<div id='engineerNo'>"+value+"</div>";
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
            dataIndex: 'parentNo',
            renderer: function(value){
            	return "<div id='parentNo'>"+value+"</div>";
            }
        },{
            header: '父节点(ID)',
            width: 0,
            dataIndex: 'parentId',
            renderer: function(value){
            	return "<div id='parentId'>"+value+"</div>";
            }
        },{
            header: '子节点(ID)',
            width: 0,
            dataIndex: 'treeId',
            renderer: function(value){
            	return "<div id='treeId'>"+value+"</div>";
            }
        }], 
        loader: treeLoader,
        root: root
	});
	
	treePanel.on('beforeload', function(node) {
        var parent = node.attributes.treeId;
		if (parent == null)
			parent = '01';
			var baseParams = treePanel.loader.baseParams
			baseParams.orgid = orgdata;
			baseParams.pid =  CURRENTAPPID;
			baseParams.parent = parent;
	});
	//根据需求展开节点
	root.on('load',function(rootNode){
	       var childs = rootNode.childNodes;
	          if(childs.length>0){
                    childs[0].expand();
                }    
	})
	
	treePanel.on('click', onClick);
	function onClick(node, e){
	   	var elNode = node.getUI().elNode;
	   	var isRoot = node == root;
	   	selectUuid = isRoot ? "01" : elNode.all("uuid").innerText;
	   	var getWhere = "";
	   	selectedPath = node.getPath();			    
	   	if(selectUuid == '01'){
	   	    getWhere = " uuid = (select uuid from Pc_Zlgk_Zlyp_Tree t  where t.pid='"+CURRENTAPPID+"' and t.tree_id='01')";
	   	}else{
	   	    getWhere = "uuid ='"+selectUuid+"'";
	   	}
	   	var treeIdSql="select tree_id from pc_zlgk_zlyp_tree where "+getWhere;
		var treeIdstr = "";
		DWREngine.setAsync(false);
		baseDao.getData(treeIdSql,function(list){
			if(list!=null&&list.length==1){
				treeIdstr=list[0];
			}
		});	
		DWREngine.setAsync(true);
		//查询当前选中节点的所有子节点主键。
		//由于验平树层级比较多且数据上千条，所以servlet的get请求传参数由于长度限制而导致加载失败
		//这主要是解决get请求传参数长度限制。
		var sql = "select uuid from "+beanTree+" where treeId like '"+treeIdstr+"%'" +
						  		" and pid='"+CURRENTAPPID+"'";
        ds.baseParams.params = "pid='"+CURRENTAPPID+"' and treeUuid in ("+sql+") and "+ whereSql;
        ds.load({params:{start:0,limit:PAGE_SIZE}});			
	}

});
	