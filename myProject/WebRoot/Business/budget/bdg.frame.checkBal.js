var contentPanel;
var treePanelTitle = "<b>概算平衡检查</b>";
var currentPid = CURRENTAPPID;

var store, treeGrid;

Ext.onReady(function() {
	var columns = [{
				id : 'bdgid',
				header : "概算主键",
				width : 100,
				sortable : true,
				dataIndex : 'bdgid',
				hidden : true
			}, {
				id : 'bdgname',
				header : "概算名称",
				width : 220,
				sortable : true,
				dataIndex : 'bdgname'
			}, {
				header : '概算编号',
				width : 100,
				sortable : true,
				dataIndex : 'bdgno'
			}, {
				header : '概算金额(录入)',
				width : 150,
				sortable : true,
				align : 'right',
				dataIndex : 'bdgmoney',
				renderer : function(value) {
						return cnMoneyToPrec(value,2);
				}
			}, {
				header : '概算金额(计算)',
				width : 150,
				sortable : true,
				align : 'right',
				dataIndex : 'bdgmoneyCal',
				renderer : function(v, p, r) {
					var diff = v - r.get('bdgmoney');
					if (diff == 0) {
						return cnMoneyToPrec(v,2);
					} else {
						return '<div align="right" style="color:red">' + cnMoneyToPrec(v,2) + '</div>';
					}
				}
			},  {
				header : '初设概算金额(录入)',
				width : 150,
				sortable : true,
				align : 'center',
				dataIndex : 'ratifyBdg',
				renderer : function(value) {
						return cnMoneyToPrec(value,2);
				}
			}, {
				header : '初设概算金额(计算)',
				width : 150,
				sortable : true,
				align : 'center',
				dataIndex : 'ratifyBdgCal',
				renderer : function(value) {
						return cnMoneyToPrec(value,2);
				}
			}, {
				header : '差值',// 55
				width : 120,
				dataIndex : 'remainder',
				align : 'right',
				renderer : function(v, p, r) {
					var diff = r.get('bdgmoneyCal') - r.get('bdgmoney');
					return cnMoneyToPrec(diff,2);
				}
			}, {
				header : '预计未签订合同金额(录入)',
				width : 160,
				dataIndex : 'remainingMoney',
				align : 'center',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				header : '预计未签订合同金额(计算)',
				width : 160,
				sortable : true,
				align : 'right',
				dataIndex : 'remainingMoneyCal',
				renderer : function(v, p, r) {
					var diff = v - r.get('remainingMoney');
					if (diff == 0) {
						return cnMoneyToPrec(v,2);
					} else {
						return '<div align="right" style="color:red">' + cnMoneyToPrec(v,2) + '</div>';
					}
				}
			}, {
				header : '差值',// 55
				width : 120,
				dataIndex : 'remainder1',
				align : 'right',
				renderer : function(v, p, r) {
					var diff = r.get('remainingMoneyCal') - r.get('remainingMoney');
					return cnMoneyToPrec(diff,2);
				}
            }];
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'bdgCheckTreeGrid',// 后台java代码的业务逻辑方法定义
					business : 'bdgInfoMgm',// spring 管理的bean定义
					bean : 'com.sgepit.pmis.budget.hbm.BdgInfo',// gridtree展示的bean
					params : 'pid' + SPLITB +  currentPid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "bdgmoney",
									'bdgmoneyCal', 'remainder',
									'remainingMoney', 
									'remainingMoneyCal', "remainder1",'flag',
									"parent", "isleaf","gcType","ratifyBdg","ratifyBdgCal"]
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
						ds.baseParams.params = 'pid' + SPLITB + currentPid
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});

	treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'bdgname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				columns : columns,
				stripeRows : true
//				title : '概算树动态展示' // 设置标题
			});
			
	store.on("load", function(ds1, recs) {
		if (ds1.getCount() > 0) {
			var rec1 = ds1.getAt(0);
			if (!ds1.isExpandedNode(rec1)) {
				ds1.expandNode(rec1);
			}
		}
	});
	
	var btnexpendAll = new Ext.Button({
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                               store.expandAllNode();
                            }
                        }) ;
     var btnexpendClose = new Ext.Button({
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                                store.collapseAllNode();
                            }
                        }) ;
	
    var button = new Ext.Button({
        id : 'clearBdg',
	    text : '应用计算值',
		tooltip : '平衡概算金额：父节点的概算金额、预计未签订金额的值等于所有子节点的汇总值',        
        cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/ex_ok.gif',
        handler : function(){
        	  Ext.Msg.confirm('应用计算值',
                  '此操作将更新概算金额(录入)值、预计未签订金额(录入)值为系统计算值。' +
                  '<br>是否确定更新？',function(btn){
				if (btn == 'yes') {
		            DWREngine.setAsync(false);
		            bdgInfoMgm.clearBdgMoney(CURRENTAPPID, '1', function(rtn){
		                if(true==rtn){
		                    Ext.Msg.alert('提示信息','概算金额(录入)值、预计未签订金额(录入)值已经更新为系统计算值')
		                    store.load();
		                }else {
		                    Ext.Msg.alert('提示信息','应用计算值失败')
		                }
		            })
		            DWREngine.setAsync(true);
				}
			})
        }
    });
    
    var chekcBalancebtn = new Ext.Button({
		id : 'checkBalance',
		text : '重新计算',
		tooltip : '计算概算金额、预计未签订金额的汇总值',
		cls : 'x-btn-text-icon',
		icon : 'jsp/res/images/icons/page_white_magnify.png',
		handler : function() {
			var myMask = new Ext.LoadMask(document.body, {
						msg : "正在进行概算平衡检查，请稍等......"
					});
			DWREngine.setAsync(false);
			myMask.show();
			bdgInfoMgm.sumMoneyOfBdgInfo(CURRENTAPPID, '1', function(rtn) {
						store.load();
					})
			myMask.hide();
			DWREngine.setAsync(true);
		}
	});

    var button2 = new Ext.Button({
				id : 'clearBdg2',
				text : '应用批准概算金额计算值',
				tooltip : '父节点的批准概算金额的值等于所有子节点的汇总值',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/ex_ok.gif',
				handler : function() {
					Ext.Msg.confirm('应用计算值', '此操作将更新批准概算金额(录入)值为系统计算值。'
									+ '<br>是否确定更新？', function(btn) {
								if (btn == 'yes') {
									DWREngine.setAsync(false);
									bdgInfoMgm.clearBdgMoney(CURRENTAPPID, '2', function(rtn) {
												Ext.Msg.alert('提示信息','批准概算金额(录入)值已经更新为系统计算值')
												store.load();
											})
									DWREngine.setAsync(true);
								}
							})
				}
			});

	var chekcBalancebtn2 = new Ext.Button({
				id : 'checkBalance2',
				text : '重新计算批准概算',
				tooltip : '计算批准概算金额',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_white_magnify.png',
				handler : function() {
					var myMask = new Ext.LoadMask(document.body, {
								msg : "正在进行概算平衡检查，请稍等......"
							});
					DWREngine.setAsync(false);
					myMask.show();
					bdgInfoMgm.sumMoneyOfBdgInfo(CURRENTAPPID, '2');
					store.load();
					myMask.hide();
					DWREngine.setAsync(true);
				}
			});

	if(ModuleLVL!='1'){
		button.disable();
		button2.disable();
	}
	
	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : [treePanelTitle, '-', btnexpendAll, btnexpendClose, '-',
				chekcBalancebtn, '-', button, '-', chekcBalancebtn2, '-', button2],
		items : [treeGrid]
	})

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
			layout : 'border',
			items : [contentPanel],
			title : 'Simple Tasks',
			iconCls : 'icon-show-all'
		}).render();
	} else {
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [contentPanel]
		});
	}
	
	//打开页面，首先进行平衡检查及批准概算检查
	pageOnReadyCheck();

	function pageOnReadyCheck() {
		var myMask = new Ext.LoadMask(document.body, {
					msg : "正在进行概算平衡检查及批准概算检查，请稍等......"
				});
		DWREngine.setAsync(false);
		myMask.show();
		bdgInfoMgm.sumMoneyOfBdgInfo(CURRENTAPPID, '0');
		store.load();
		myMask.hide();
		DWREngine.setAsync(true);
	}

});