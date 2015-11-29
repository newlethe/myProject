Ext.onReady(function (){
	//--------TreeGrid--------
	var paramsTree = 'conid'+SPLITB+conid+';monId'+SPLITB+masterId+';pid'+SPLITB+CURRENTAPPID;
	var treeStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad:true,
		leaf_field_name:'isleaf',//是否叶子节点字段
		parent_id_field_name:'parent',//树节点关联父节点字段
		url:MAIN_SERVLET,
		baseParams:{
			ac:'list',
			method:'getProAcmTree',//后台java代码的业务逻辑方法定义
			business:'proAcmMgm',//spring 管理的bean定义
			bean:'com.sgepit.pmis.investmentComp.hbm.ProAcmTree',//gridtree展示的bean
			params:paramsTree//查询条件
		},
		reader:new Ext.data.JsonReader({
			id:'bdgid',
			root:'topics',
			totalProperty:'totalCount',
			fields:["uuid","conid","bdgid","bdgname","proMoney","sumMoney","isleaf","parent","pid"]
		}),
		listeners:{
			'beforeload':function(ds,options){
				var parent = null;
				if(options.params[ds.paramNames.active_node]==null){
					options.params[ds.paramNames.active_node]='0';
					parent = "0";//此处设置第一次加载时的parent参数
				}else{
					parent = options.params[ds.paramNames.active_node];
				}
				//此处设置除第一次加载外的加载参数设置
				ds.baseParams.params=paramsTree+";parent"+SPLITB+parent;
			}
		}
	});
	
	
	var TreeGridPanel = new Ext.ux.maximgb.treegrid.GridPanel({
//		ifcheck : true,	//设置是否添加checkbox按钮
		title:' 合同分摊概算',
		store : treeStore,
		tbar : [{
                iconCls: 'icon-expand-all',
				tooltip: '全部展开',
                handler: function(){ treeStore.expandAllNode(); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: '全部收起',
                handler: function(){ treeStore.collapseAllNode(); }
            }],
		master_column_id : 'bdgname',//定义设置哪一个数据项为展开定义
		autoScroll:true,
		region:'center',
		viewConfig:{
			forceFit:true,
			ignoreAdd:true
		},
		frame:false,
		collapsible:false,
		animCollapse:false,
		border:false,
//		tbar:[{
//			text:'aaa',
//			iconCls:'btn',
//			handler:function(){
//				var sm = TreeGridPanel.getSelectionModel();
//				alert(sm.getSelected().get('bdgid'))
//			}
//		}],
		columns:[{
			id:'uuid',	
				header:"主键",
				hidden:true,
				dataIndex:'uuid'
			},{
				id:'conid',	
				header:"合同编号",
				hidden:true,
				dataIndex:'conid'
			},{	
				id:'bdgid',	
				header:"概算主键",
				hidden:true,
				dataIndex:'bdgid'
			},{
				id:'bdgname',	
				header:"概算名称",
				width:300,	
				sortable:true,
				dataIndex:'bdgname'
			},{
	            header: '本月总额',
	            width: 100,
	            dataIndex: 'proMoney',
				renderer: cnMoneyToPrec
	        },{
	            header: '累计总额',
	            width: 100,
	            dataIndex: 'sumMoney',
				renderer: cnMoneyToPrec
            },{
	            header: '是否子节点',
	            hidden: true,
	            dataIndex: 'isleaf'
	        },{
	            header: '父节点',
	            hidden: true,
	            dataIndex: 'parent'
			},{
				header : 'PID',
				hidden: true,
	            dataIndex: 'pid'
			}],
		stripeRows:true
	});
	
	treeStore.on("load",function(ds1,recs){
		if(ds1.getCount()>0){
			var rec1=ds1.getAt(0);
			if(!ds1.isExpandedNode(rec1)){
				ds1.expandNode(rec1);
			}
		}
	});
	
	
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [TreeGridPanel]
    });
    
});
