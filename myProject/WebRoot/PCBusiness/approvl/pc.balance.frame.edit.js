var treePanelTitle = "概算结构维护";
var store;
var node;
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var currentPid = CURRENTAPPID;
var beanName = "com.sgepit.pcmis.balance.hbm.PcBalanceSortTree";
Ext.onReady(function() {
	Ext.QuickTips.init();
	
	//按钮定义
		var addBtn = new Ext.Button({
			id : 'add-btn',
			xtype: 'tbbutton',
			text : '新增',
			iconCls : 'add',
			handler : toHandler
		})
		
		//修改按钮
		var editBtn = new Ext.Button({
			id : 'edit-btn',
			xtype: 'tbbutton',
			text : '修改',
			iconCls: 'icon-edit',
			handler : toHandler
		});
		
		//删除按钮
		var deleteBtn = new Ext.Button({
			id : 'delete-btn',
			xtype: 'tbbutton',
			text : '删除',
			disabled: true,
			iconCls : 'icon-delete',
			handler : toHandler
		});
		
		//查询按钮
		var checkBtn = {
			id : 'check-btn',
			xtype: 'tbbutton',
			text : '查看',
			iconCls : 'form'
		};
		
	var columns = [{
				id : 'uids',
				header : "结算主键",
				width : 100,
				sortable : true,
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'balanceName',
				header : "费用名称",
				width : 220,
				sortable : true,
				dataIndex : 'balanceName'
			}, {
				header : '费用编号',
				width : 85,
				sortable : true,
				dataIndex : 'balanceNo'
			}, {
				header : '工程总价',
				width : 85,
				sortable : true,
				align : 'right',
				dataIndex : 'constructionCost'
			}, {
				header : '已完成金额',// 44
				width : 100,
				dataIndex : 'coMoney',
				align : 'right'
			},{
				header: '详细附件',
				width: 80,
				align: 'center',
				dataIndex: 'uids',
				renderer: function(v,meta,record){
						if(v==''||v==null||record.get('isleaf')=='0')
							return '';
						else
							return "<a href='javascript:uploadfile(\"" + v
														+ "\",\"balanceFiles\")'>"+'附件'+"</a>"
						}
			}
           ];
            
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'balanceManagerTree',// 后台java代码的业务逻辑方法定义
					business : 'balanceMgm',// spring 管理的bean定义
					bean : 'com.sgepit.pcmis.balance.hbm.PcBalanceSortTree',// gridtree展示的bean
					params : 'pid' + SPLITB +  currentPid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'balanceNo',  //这里指定beforload处理事件中active_node对应表中的哪一列
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["uids", "pid", "balanceName", "balanceNo", "constructionCost",
									'coMoney', "parent", "isleaf"]
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

    var btnexpendAll = new Ext.Button({
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                               store.expandAllNode();
                            }
                        });
                        
     var btnexpendClose = new Ext.Button({
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                                store.collapseAllNode();
                            }
                        }) ;   
     
     //导出为excel文档                   
     var exportExcelBtn = new Ext.Button({
                id : 'export',
                text : '导出数据',
                tooltip : '导出数据到Excel',
                cls : 'x-btn-text-icon',
                icon : 'jsp/res/images/icons/page_excel.png',
                handler : function() {
                    exportDataFile();
                }
            }); 
    
    //根据权限确定顶部工具栏是否有新增,修改,删除按钮        
    var  tbarArr  = (rwFlag?['-',btnexpendAll,'-',btnexpendClose,
    			'-',addBtn,'-',editBtn,'-',deleteBtn,'->'] : ['-',btnexpendAll,'-',btnexpendClose]);      
	var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				title : '结算分类树',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'balanceName',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				tbar : tbarArr,
				columns : columns,
				stripeRows : true,
				listeners:{
					rowclick: function(grid, rowIndex){
						formPanel.collapse(true);//隐藏面板
						var record = grid.getSelectionModel().getSelected();
						
						if(record.get('isleaf')!='1') //删除按钮状态
						{
							Ext.getCmp('delete-btn').disable();
						}
						else
						{
							Ext.getCmp('delete-btn').enable();
						}
					},
					render: function(){
						//如果是只读权限, 隐藏新增,修改,删除按钮, 修改记录的formPanel一直处于隐藏状态
//							if(!rwFlag)
//							{
//								Ext.getCmp('add-btn').hide();
//								Ext.getCmp('edit-btn').hide();
//								Ext.getCmp('delete-btn').hide();
//							}
					}
				}
			});

	store.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});
	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [treeGrid, formPanel]
			});
       
	function toHandler() {
		var rec = treeGrid.getSelectionModel().getSelected();
		if(rec==undefined){
			Ext.Msg.show({
					title: '提示',
					width: 120,
					msg: '请选择一条记录!',
					buttons: Ext.Msg.OK
				});
			return;		
		}
		var state = this.id;
		var no = rec.data.balanceNo;
		//根据编号来判断是不是根节点
//		var isRoot = (rootText == node.text);
//		var isRoot = (no=='01');
        var ty = Ext.getCmp('gcType');
		if ("add-btn" == state) {
			var formRecord = Ext.data.Record.create(Columns);
			//获取费用编号
			var num = rec.data.balanceNo + getBalancenoFun(rec.data.balanceNo, rec.data.pid);
			
			loadFormRecord = new formRecord({
						pid : rec.data.pid,
						balanceNo : num,
						balanceName : '',
						parentBalanceNo : rec.data.balanceNo,
						parentBalanceName :rec.data.balanceName,
						constructionCost : 0,
						coMoney : 0,
						isleaf : 1,
						parent : rec.data.balanceNo
					});
			formPanel.isNew = true,  //标志formPanel加载新数据,保存一条心记录
			formPanel.getForm().loadRecord(loadFormRecord);
			formPanel.expand();
		} else if ("delete-btn" == state) {
			if (no == '01' || no == '0101' || no == '0102' || no == '0103'|| no == '0104') {
				Ext.Msg.alert('提示信息', '基础数据不能删除')
			} else {
				delHandler(rec.data.uids);
			}
		} else if ("edit-btn" == state) {
			//获得上级费用名称
			var upBalanceName = "";
			var getNameSql = "select balancename from pc_balance_sort where pid='" + 
										rec.data.pid + "' and balanceno='" + rec.data.parent + "'";
			DWREngine.setAsync(false);		
			    baseMgm.getData(getNameSql, function(list){
					upBalanceName = list[0];
			    })
		    DWREngine.setAsync(true);
		    //设置加载数据的上级费用编号和上级费用名称
		    rec.data.parentBalanceName = upBalanceName;
		    rec.data.parentBalanceNo = rec.data.parent;
		    
			formPanel.getForm().loadRecord(rec);
			formPanel.isNew = false     //标志formpanel加载已经存在的数据, 保存已经有主键的数据
			formPanel.expand();
		}
	}

	function delHandler(uids) {
		var rec = treeGrid.getSelectionModel().getSelected();
		var hasChild = true;
		DWREngine.setAsync(false);
		balanceMgm.deleteBalanceInfo(uids, function(flag) {
					if (flag=='1') {
						Ext.example.msg('保存成功！', '您成功删除了一条结算信息!',1);
						store.load();
					} else {
						Ext.Msg.show({
								title : '提示',
								msg : '删除数据失败!',
								width: 120,
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO
						});
					}
				})
		DWREngine.setAsync(true);
	}
});

//上传附件
function uploadfile(uids, businessType) {
	var param = {
		businessId : uids,
		businessType : businessType,
		editable : rwFlag
	};
	showMultiFileWin(param);
}

//根据项目编号和费用编码获得新增条目项目编码
function getBalancenoFun(balanceNo, pid){
    	var regEx = "^" + balanceNo + "[0-9]{2}";
    	var no = '';
    	var sql = "select bdg_no from "
    			+ "(select substr(balanceNo,-2,2) bdg_no from pc_balance_sort where pid='" + pid +"' and REGEXP_LIKE(balanceNo, '"+regEx+"')" 
    			+ "order by balanceNo desc) where rownum=1";
    	DWREngine.setAsync(false);		
	    baseMgm.getData(sql, function(value){
	    	if(value==''){
	    		no = '01';
	    	}else{
				no = value.length<2 ? '0'+((Number(value)+1)).toString(): value;
	    	}
	    })
	    DWREngine.setAsync(true);
	    
	    return no;
    }