/**
 * @author tengri
 * 说明：招标分摊概算选择页面
 */
//全局变量
var treePanel,store,btnConfirm,btnReturn,data,win,viewport;
var idS = new Array();
var currentPid = CURRENTAPPID;
var bean = "com.sgepit.pmis.budget.hbm.BidBdgInfo";
Ext.onReady(function (){
	initToolbar();
	loadStore();
	initTreeGrid();
	//加载数据
	store.on("load", function(ds1, recs) {
		if (ds1.getCount() > 0) {
			var rec1 = ds1.getAt(0);
			if (!ds1.isExpandedNode(rec1)) {
				ds1.expandNode(rec1);
			}
		}
	});
	//初始化容器
	viewport = new Ext.Viewport({
       layout: 'border',
       items: [treePanel]
    });
	
 });

function initTreeGrid(){
	treePanel = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'bdgname',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		region : 'center',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		frame : false,
		collapsible : false,
		animCollapse : false,
		ifcheck:true,	
		ifdisable:true,
		border : true,
		stripeRows : true,
		title : '', // 设置标题	      
		tbar:['<font color=#15428b><b>&nbsp;招标概算</b></font>','-',
		     {
            	iconCls: 'icon-expand-all',
            	tooltip: 'Expand All',
            	handler: function(){ store.expandAllNode();}
             }, '-',
            {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ store.collapseAllNode(); }
            },'->',btnConfirm,'-',btnReturn],
		columns:[{
			id:"bdgname",
		    header: '概算名称',
		    width: 300,
		    dataIndex: 'bdgname'
		},{
		    header: '概算主键',	
		    width:0,				//隐藏字段
		    hidden:true,
		    dataIndex: 'bdgid'
		},{
		    header: '项目工程编号',
		    width: 0,				//隐藏字段
		    hidden:true,
		    dataIndex: 'pid'
		},{
		    header: '概算编码',
		    width: 100,
		    dataIndex: 'bdgno'
		},{
		    header: '概算金额',
		    width: 80,
		    dataIndex: 'bdgmoney',
		    renderer: cnMoneyToPrec
		},{
		    header: '招标对应概算金额',
		    width: 110,
		    dataIndex: 'zbgsMoney',
		    renderer: cnMoneyToPrec
		},{
		    header: '是否子节点',
		    width: 0,
		    hidden:true,
		    dataIndex: 'isleaf'
		    
		},{
		    header: '父节点',
		    width: 0,
		    hidden:true,
		    dataIndex: 'parent',
		    cls : 'parent'
		    
		},{
		    header: 'ischeck',
		    width: 0,
		    hidden:true,
		    dataIndex: 'ischeck' 
		}]
	});
	
}


function loadStore(){
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name : 'isleaf',// 是否叶子节点字段
		parent_id_field_name : 'parent',// 树节点关联父节点字段
		url : MAIN_SERVLET,
		baseParams : {
			ac : 'list',
			method : 'getZbgsTree',// 后台java代码的业务逻辑方法定义
			business : 'bidBdgApportionMgm',// spring 管理的bean定义
			bean : bean,// gridtree展示的bean
			params : 'conid' + SPLITB +  conid+SPLITB// 查询条件
		},
		reader : new Ext.data.JsonReader({
					id : 'bdgid',
					root : 'topics',
					totalProperty : 'totalCount',
					fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
							"zbgsMoney","isleaf","parent","ischeck"]
				}),
		listeners : {
			'beforeload' : function(ds, options) {
				var parent = null;
				if (options.params[ds.paramNames.active_node] == null) {
					options.params[ds.paramNames.active_node] = '0';	
					parent = "0"; // 此处设置第一次加载时的parent参数
				} else {
					parent = options.params[ds.paramNames.active_node];
				}
				ds.baseParams.params = 'conid' + SPLITB + conid
						+ ";parent" + SPLITB + parent+ ";pid" + SPLITB + currentPid;// 此处设置除第一次加载外的加载参数设置
			}
		}
	}); 
	
}

/**
 * 初始化工具条
 */
function initToolbar(){
	btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	});
	btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
   //确认选择事件
	function confirmChoose(){
		treePanel.getEl().mask('laoding....');
   		var nodes = treePanel.getCheckNodes();
   		var nodesArray=new Array();
   		if(nodes){
   			for(var i=0;i<nodes.length;i++){
   				var value = nodes[i].data.bdgid + "~" + nodes[i].data.zbgsMoney;
   				nodesArray.push(value);
   			}
    		DWREngine.setAsync(false);  
    		bidBdgApportionMgm.saveGetZbgsTree(zbUids,conid,nodesArray, function(){
    			treePanel.getEl().unmask();                                       
			});                                
			DWREngine.setAsync(true);
			viewport.hide();
			window.history.back();	   			
   		}else{
   			Ext.Msg.alert("提示","请选择");
   			treePanel.getEl().unmask();
   		}
	}
	
}
	
