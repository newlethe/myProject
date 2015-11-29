var treePanel,store;
var data;
var treeTitle = '合同分摊'
var bean = "com.sgepit.pmis.budget.hbm.VBdgConApp"
var currentPid = CURRENTAPPID;
var chooseOther;
Ext.onReady(function (){
    chooseOther = new Ext.Button({
    	text: '选择其他概算',
    	iconCls: 'returnTo',
    	handler: chooseOther
    });
     btnConfirm = new Ext.Button({
    	text: '确定选择',
    	iconCls: 'save',
    	handler: confirmChoose
    });
    
    var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			history.back();
		}
	});
	
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'getBdgMoneyChangeTree',// 后台java代码的业务逻辑方法定义
					business : 'bdgMoneyMgm',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'conid' + SPLITB +  conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"conbdgappmoney","conappmoney","initappmoney", "changeappmoney",
									"claappmoney","breachappmoney","isleaf","parent","ischeck"]
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
								+ ";parent" + SPLITB + parent+ ";changeId" + SPLITB + childid;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});	

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
        tbar:[ '<font color=#15428b><b>&nbsp;'+treeTitle+'</b></font>',
        		'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){  store.expandAllNode(); }
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){store.collapseAllNode();  }
		            },'-',chooseOther,
		            '->', btnConfirm, '-', btnReturn],
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
				id: 'bdgname',
				header : '概算名称',
				width : 270, // 隐藏字段
				dataIndex : 'bdgname'
			}, {
				header : '概算编码',
				width : 120,
				dataIndex : 'bdgno',
				renderer : function(value) {
					return "<div id='bdgno'>" + value + "</div>";
				}
			}, {
				header : '项目工程编号',
				width : 0, // 隐藏字段
				hidden:true,
				dataIndex : 'pid',
				renderer : function(value) {
					return "<div id='pid'>" + value + "</div>";
				}
			}, {
				header : '概算主键',
				width : 0,
				hidden:true,
				dataIndex : 'bdgid',
				renderer : function(value) {
					return "<div id='bdgid'>" + value + "</div>";
				}
			}, {
				header : '内部流水号',
				width : 0,
				hidden:true,
				dataIndex : 'conid',
				renderer : function(value) {
					return "<div id='conid'>" + value + "</div>";
				}
			}, {
				header : '概算金额',
				width : 70,
				dataIndex : 'bdgmoney',
				renderer : function(value) {
					return "<div id='bdgmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
			}, {
				header : '合同分摊总金额',
				width : 100,
				dataIndex : 'conbdgappmoney',//old sumconappmoney
				renderer : function(value) {
					return "<div id='conbdgappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '本合同分摊总金额',
				width : 110,
				dataIndex : 'conappmoney',//old realmoney
				renderer : function(value) {
					return "<div id='conappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '本合同签订分摊',
				width : 100,
				dataIndex : 'initappmoney',
				renderer : function(value) {
					return "<div id='initappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '本合同变更分摊',
				width : 100,
				dataIndex : 'changeappmoney',
				renderer : function(value) {
					return "<div id='changeappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '本合同索赔分摊',
				width : 100,
				dataIndex : 'claappmoney',
				renderer : function(value) {
					return "<div id='claappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '本合同违约分摊',
				width : 100,
				
				dataIndex : 'breachappmoney',
				renderer : function(value) {
					return "<div id='breachappmoney' align='right'>"
							+ cnMoneyToPrec(value) + "</div>";
				}
				// renderer: cnMoney
			}, {
				header : '是否子节点',
				width : 0,
				hidden:true,
				dataIndex : 'isleaf',
				renderer : function(value) {
					return "<div id='isleaf'>" + value + "</div>";
				}
			}, {
				header : '父节点',
				width : 0,
				hidden:true,
				dataIndex : 'parent',
				renderer : function(value) {
					return "<div id='parent'>" + value + "</div>";
				}
			}, {
				header : '备注',
				hidden:true,
				width : 0
			},{
            header: 'ischeck',
            width: 0,
            hidden:true,
            dataIndex: 'ischeck'
        }]
	});

	
	
	var viewport = new Ext.Viewport({
        layout: 'border',
        items: [treePanel]
    });
	store.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});
	
	function confirmChoose(){
		treePanel.getEl().mask('loading.....');
	   	var nodes = treePanel.getCheckNodes();
	   	var nodesArray=new Array();
	   	if(nodes){
	   		for(var i=0;i<nodes.length;i++){
	   				nodesArray.push(nodes[i].data.bdgid);
	   			}
	   	    DWREngine.setAsync(false);	
			bdgChangeMgm.saveBdgmoneyNewTree(conid,childid,nodesArray);
			window.parent.frames[0].location.href=(document.referrer)
			DWREngine.setAsync(true);	   		
	   	}
	   	else{
	   		Ext.Msg.alert("提示","请选择");
	   		treePanel.getEl().unmask();
	   	}
	}
	function chooseOther(){
		var chooseOtherTreeUrl=CONTEXT_PATH+"/Business/budget/bdg.chooseOther.tree.jsp";
		chooseOtherTreeUrl=chooseOtherTreeUrl+"?conid="+conid+"&changeid="+childid;
		window.location.href=chooseOtherTreeUrl;
	}
});



