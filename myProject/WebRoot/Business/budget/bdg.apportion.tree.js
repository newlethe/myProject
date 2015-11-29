var treePanel;
var data;
var treeTitle = '合同分摊'
var currentPid = CURRENTAPPID;
var store;
var bean = "com.sgepit.pmis.budget.hbm.VBdgLibrary";
Ext.onReady(function (){
    btnConfirm = new Ext.Button({
    	text: '确定选择',
    	iconCls: 'save',
    	handler: confirmChoose
    });
    
    var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.parent.frames[0].location.href=(document.referrer)
			//history.back();
			
		}
	});
	
 	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'getBdgMoneyPayBreClaTree',// 后台java代码的业务逻辑方法定义
					business : 'bdgMoneyMgm',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'conid' + SPLITB +  conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"realmoney","isleaf","parent","ischeck","prosign"]
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
								+ ";parent" + SPLITB + parent+ ";type" + SPLITB + type+ ";typeId" + SPLITB + childid;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});
	treePanel =new Ext.ux.maximgb.treegrid.GridPanel({
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
        tbar:[ '<font color=#15428b><b>&nbsp;'+treeTitle+'</b></font>',
        		'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){  store.expandAllNode();}
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ store.collapseAllNode(); }
		            },'->', btnConfirm, '-', btnReturn],

		columns:[{
			id:"bdgname",
            header: '概算名称',
            width: 300,
            dataIndex: 'bdgname'
        },{
            header: '概算主键',	
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'pid'
        },{
            header: '内部流水号',
            width: 0,
            hidden:true,
            dataIndex: 'conid'
        },{
            header: '概算编码',
            width: 100,
            dataIndex: 'bdgno'
        },{
            header: '概算金额',
            width: 120,
            dataIndex: 'bdgmoney',
            renderer: cnMoneyToPrec
        },{
            header: '实际金额',
            width: 120,
            dataIndex: 'realmoney',
            renderer: cnMoneyToPrec
        },{
            header: '项目标识',
            width: 0,
            hidden:true,
            dataIndex: 'prosign',
            renderer: function(value){
            	if (value == 0){
            		return "<div id='prosign' align='center'>概算金额</div>";
            	}
            	if (value == 1){
            		return "<div id='prosign' align='center'>工程量</div>";
            	}
            	
            } 
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
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header: 'ischeck',
            width: 0,
            hidden:true,
            dataIndex: 'ischeck'
        }]
	});

	
	store.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});
	
	
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [treePanel]
    });

function confirmChoose(){
	treePanel.getEl().mask('loading.....');
	var nodes = treePanel.getCheckNodes();
	var nodesArray=new Array();
	if(nodes){
	   	for(var i=0;i<nodes.length;i++){
	   		nodesArray.push(nodes[i].data.bdgid);
	   	}		
	    if (type != null){
	    	DWREngine.setAsync(false);
		    if (type == 'pay'){
				bdgPayMgm.savePayLibraryTree(conid, childid, nodesArray);
				window.parent.frames[0].location.href=(document.referrer)
			}
			if (type == 'breach'){
				
				bdgBreachMgm.saveBreachLibraryTree(conid, childid, nodesArray);
				window.parent.frames[0].location.href=(document.referrer)
			}
			if (type == 'balance') {
	
				bdgBalMgm.saveBalTree(conid,childid,nodesArray);
				window.parent.frames[0].location.href=(document.referrer)
			}
			if (type == 'compensate') {
	
				bdgCompensateMgm.saveBdgcompensateLibraryTree(conid,childid,nodesArray, function(){
					treePanel.getEl().unmask();
				});
				window.parent.frames[0].location.href=(document.referrer)
			}
			DWREngine.setAsync(true);
		}
	}
	else{
		Ext.Msg.alert("提示","请选择");
		treePanel.getEl().unmask();
	}
}

});
