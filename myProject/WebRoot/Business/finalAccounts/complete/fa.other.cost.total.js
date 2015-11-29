var business = "baseMgm"
var listMethod = "findWhereOrderby"
var fixedBean="com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedTotalView";
var fixedStore,fixedTreeGrid;
Ext.onReady(function() {
	/*********************************固定资产信息   start*************************************/
	fixedStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentid',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'getFACompFixedAssetTotalList',// 后台java代码的业务逻辑方法定义
					business : 'faCostManageService',// spring 管理的bean定义
					bean : fixedBean,// gridtree展示的bean
					params : 'costType' + SPLITB +  costType+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["treeid", "fixedno","fixedname","costValue1",
									"costValue2","costValue3","remark", "parentid","isleaf"]
						}),
				listeners : {
					'beforeload' : function(ds2, options) {
						var parent = null;
						if (options.params[ds2.paramNames.active_node] == null) {
							options.params[ds2.paramNames.active_node] = '0';	
							parent = "0"; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds2.paramNames.active_node];
						}
						ds2.baseParams.params = 'costType' + SPLITB + costType
								+ ";parent" + SPLITB + parent+ ";pid" + SPLITB + CURRENTAPPID;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});
	var fixedColumns=[{
			id:"fixedno",
            header: '固定资产编号',
            width: 150,
            dataIndex: 'fixedno'
        },{
        	id:"treeid",
            header: '固定资产树主键',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'treeid'
        },{
        	id:"fixedname",
            header: '项目名称',
            width: 260,
            dataIndex: 'fixedname'
        },{
        	id:"costValue2",
            header: costType=='0001'?'一类费用分摊':'二类费用分摊',
            width: 150,
            align:"right",
            dataIndex: 'costValue2',
            renderer: cnMoneyToPrec
        },{
        	id:"costValue3",
            header: '含一类费用造价',
            width: 150,
            align:"right",
            dataIndex: 'costValue3',
            renderer: cnMoneyToPrec
        },{
        	id:"remark",
            header: '备注',
            width: 120,
            dataIndex: 'remark'
        },{
        	id:"isleaf",
            header: '是否子节点',
            width: 0,
            hidden:true,
            dataIndex: 'isleaf'
            
        },{
        	id:"parentid",
            header: '父节点',
            width: 0,
            hidden:true,
            dataIndex: 'parentid',
            cls : 'parentid'
            
        }]
    var extraMode={
        	id:"costValue1",
            header: '不含一类费用造价',
            width: 150,
            align:"right",
            dataIndex: 'costValue1',
            renderer: cnMoneyToPrec
        }
    if(costType=='0001'){
    	fixedColumns.splice(3,0,extraMode)
    }
	fixedTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'fixed-tree-panel',
				iconCls : 'icon-by-category',
				store : fixedStore,
				master_column_id : 'fixedname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
//				height : document.body.clientHeight * 0.5,
				viewConfig : {
//					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				stripeRows : true,
				title : '', // 设置标题	      
        tbar:['<font color=#15428b><b>&nbsp;生产用固定资产-'+title+'</b></font>'],
		columns:fixedColumns
	});
	fixedStore.on("load", function(ds1, recs) {
        if (ds1.getCount() > 0) {
            var rec1 = ds1.getAt(0);
            if (!ds1.isExpandedNode(rec1)) {
                ds1.expandNode(rec1);
            }
        }
    });
	/*********************************固定资产信息   end*************************************/
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [fixedTreeGrid]
			});
});