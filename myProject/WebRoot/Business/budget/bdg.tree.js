
var treePanel,store;
var data;
var idS = new Array();
var win;
var viewport;
var currentPid = CURRENTAPPID;
var bean = "com.sgepit.pmis.budget.hbm.VBdgInfo"
Ext.onReady(function (){
	var clientWidth=document.body.clientWidth;
	btnConfirm = new Ext.Button({
		text: '确定选择',
		iconCls : 'save',
		handler: confirmChoose
	})
            
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
					method : 'getBudgetNewTree',// 后台java代码的业务逻辑方法定义
					business : 'bdgMoneyMgm',// spring 管理的bean定义
					bean : bean,// gridtree展示的bean
					params : 'conid' + SPLITB +  conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"bidbdgmoney",
									"conbdgappmoney","remainingMoney","expectedBdgActMoney", "expectedAmountMoney",
									"matrmoney","buildmoney","equmoney","isleaf","parent","ischeck"]
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
        tbar:['<font color=#15428b><b>&nbsp;合同概算</b></font>'
        		,'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ store.expandAllNode();}
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ store.collapseAllNode(); }
		            },
        		'->',btnConfirm,'-',btnReturn],
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
            header: '是否工程量',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'bdgflag',
            renderer: function(value){
            	return value > 0 ? '概算金额' : '工程量';
            }
        },{
            header: '概算金额',
            width: 90,
            dataIndex: 'bdgmoney',
            align : 'right',
            renderer: cnMoneyToPrec
        },{
        	//BUG8335新增字段 zhangh 2015-11-16
            header: '招标对应概算金额',
            width: 120,
            dataIndex: 'bidbdgmoney',
            align : 'right',
            renderer: cnMoneyToPrec
        },{
            header: '合同分摊总金额',
            width: 110,
            dataIndex: 'conbdgappmoney',
            align : 'right',
            renderer: cnMoneyToPrec
        },{
            header: '预计未签订金额',
            width: 95,
            dataIndex: 'remainingMoney',
            align : 'right',
            renderer: cnMoneyToPrec
        }
        ,{
            header: '  预计概算执行金额',
            width: 110,
            dataIndex: 'expectedBdgActMoney',
            align : 'right',
			renderer : cnMoneyToPrec
        }
       ,{
            header: '  预计超概金额',
            width: 85,
            dataIndex: 'expectedAmountMoney',
            align : 'right',
			renderer : cnMoneyToPrec
        }
        ,{
            header: '材料金额',
            width: 0,
            hidden:true,
            dataIndex: 'matrmoney',
            renderer: cnMoneyToPrec
        },{
            header: '建筑金额',
            width: 0,
            hidden:true,
            dataIndex: 'buildmoney',
            renderer: cnMoneyToPrec
        },{
            header: '设备安装金额',
            width: 0,
            hidden:true,
            dataIndex: 'equmoney',
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
		treePanel.getEl().mask('laoding....');
	   		var nodes = treePanel.getCheckNodes();
	   		var nodesArray=new Array();
	   		if(nodes){
	   			for(var i=0;i<nodes.length;i++){
	   				nodesArray.push(nodes[i].data.bdgid);
	   			}
	    		DWREngine.setAsync(false);   // 合同概算金额
				bdgMoneyMgm.saveGetBudgetTree(conid,nodesArray, function(){
				treePanel.getEl().unmask();                                       
				});                                
				DWREngine.setAsync(true);
				viewport.hide();
				window.history.back();	   			
	   		}
	   		else{
	   			Ext.Msg.alert("提示","请选择");
	   			treePanel.getEl().unmask();
	   		}
		}

 });
	
