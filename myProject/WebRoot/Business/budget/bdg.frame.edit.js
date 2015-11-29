var contentPanel;
var saveBtn;
var treePanelTitle = "概算结构维护";
if(DEPLOY_UNITTYPE == '0') treePanelTitle = '';
var rootText = "所有概算单";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;
var store;
var node;
var queryBdgid; 
var currentPid = CURRENTAPPID;
var checkRtn = '0';
var treeGrid;
var selectedPath = "";
Ext.onReady(function() {
	Ext.QuickTips.init();
	if(getPid == null || getPid == ''){
           treePanelTitle = treePanelTitle;
	}else{
	   DWREngine.setAsync(false);
	   baseDao.getData("select t.prj_name from pc_zhxx_prj_info t where pid = '"+getPid+"'",function(text){
           treePanelTitle = text+"-"+treePanelTitle;
         })
       DWREngine.setAsync(true);    
	}
	DWREngine.setAsync(false);
	bdgInfoMgm.checkBdgInit("0", currentPid, function(rtn) {
		checkRtn = rtn;
	})
	DWREngine.setAsync(true);
	
	var columns = [{
				id : 'bdgid',
				header : "概算主键",
				width : 100,
				sortable : true,
				dataIndex : 'bdgid',
				hidden : true, 
				locked : true
			}, {
				id : 'bdgname',
				header : "概算名称",
				locked : true,
				width : 320,
				sortable : true,
				renderer :function(value) {
					var qtip = "qtip=" + value;
					return'<span ' + qtip + '>' + value + '</span>';
				},
				dataIndex : 'bdgname'
			}, {
				header : '概算编号',
				width : 85,
				sortable : true,
				hidden : true,
//                hidden : (DEPLOY_UNITTYPE == "0"),
				dataIndex : 'bdgno'
			}, {
				header : '序号',
				width : 85,
				sortable : true,
				hidden : true,
				dataIndex : 'prono'
			}, {
				header : '执行概算金额',
				width : 110,
				sortable : true,
				align : 'right',
				dataIndex : 'bdgmoney',
				renderer : function(value) {
						return cnMoneyToPrec(value,2);
				}
			}, {
				header : '初设概算金额',
				width : 120,
				sortable : true,
				align : 'right',
				hidden : true,
//                hidden : (DEPLOY_UNITTYPE == "0"),
				dataIndex : 'ratifyBdg',
				renderer : function(value) {
						return cnMoneyToPrec(value,2);
				}
			}, {
				//BUG8335新增字段 zhangh 2015-11-18
				//系统自动计算，取所有招标项分摊到概算的累计金额；
				header : '招标对应<br>概算金额',
				width : 140, align : 'right',
				dataIndex : 'bidbdgmoney',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				//BUG8335新增字段 zhangh 2015-11-18
				//系统自动累计，取所有已签合同对应招标内容的合同的招标对应概算金额的累计值；
				header : '（已签合同）招标<br>对应概算金额',
				width : 140, align : 'right',
				dataIndex : 'signconbidbdgmoney',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				//BUG8335 调整此字段取数 zhangh 2015-11-18
				//合同分摊总金额=招标合同分摊金额+非标合同分摊金额 
				header : '合同分摊总金额',// 44
				width : 110,
				dataIndex : 'conbdgappmoney',
				align : 'right',
				renderer : function(value ,p, r) {
					if(r.get("flag")==1){
					   return '<div align=right style="color:blue;font-weight: bold">'
                                + cnMoneyToPrec(value,2) + '</div>';
                       
                    } else {
                        return '<div align=right>' + cnMoneyToPrec(value,2)
                                + '</div>';
                    }
                }
            }, {
				//BUG8335新增字段 zhangh 2015-11-18
            	//系统自动计算，取所有对应到招标内容的合同的合同分摊金额的累计
				header : '招标合同<br>分摊金额',
				width : 140, align : 'right',
				dataIndex : 'bidconappmoney',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				//BUG8335新增字段 zhangh 2015-11-18
				//系统自动计算，取所有没有对应到招标内容的合同的合同分摊金额
				header : '非招标合同<br>分摊金额',
				width : 140, align : 'right',
				dataIndex : 'notbidconappmoney',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				//BUG8335新增字段 zhangh 2015-11-18
				//招标合同结余金额=（已签合同）招标对应概算金额-招标合同分摊金额 
				header : '招标合同<br>结余金额',
				width : 140, align : 'right',
				dataIndex : 'bidconothermoney',
				renderer : function(value) {
					return cnMoneyToPrec(value,2);
				}
			}, {
				header : '合同结余金额',
				width : 110,
				dataIndex : 'conjymoney',
				hidden:true,
				align : 'right',
				renderer : function(value ,p, r) {
					if(r.get("flag")==1){
					   return '<div align=right style="color:blue;font-weight: bold">'
                                + cnMoneyToPrec(value,2) + '</div>';
                       
                    } else {
                        return '<div align=right>' + cnMoneyToPrec(value,2)
                                + '</div>';
                    }
                }
			}, {
				header : '差值',// 55
				width : 100,
				dataIndex : 'remainder',
//                hidden : (DEPLOY_UNITTYPE == "0"),
				hidden : true,
				align : 'right',
				renderer : function(v, p, r) {
					var str = cnMoneyToPrec(r.get('bdgmoney')
									- r.get('conbdgappmoney'), 2);
					if (str.toString().charAt(0) == '-') {
						str = '<div align="right" style="color:red">' + str
								+ '</div>';
					} else {
						str = '<div align="right" >' + str + '</div>';
					}
					return str;
				}
			}, {
//				header : '预计未签订合同金额',
				//BUG8335 调整此字段取数 zhangh 2015-11-18
				//未签订合同金额=执行概算金额-（已签合同）招标对应概算金额-非招标合同分摊金额
				header : '未签订合同金额',
				width : 140,
				dataIndex : 'remainingMoney',
				align : 'center',
				renderer : function(value) {
					if (value < 0) {
						return '<div align=right style="color:red">'
								+ cnMoneyToPrec(value,2) + '</div>';
					} else {
						return '<div align=right>' + cnMoneyToPrec(value,2)
								+ '</div>';
					}
				}
            }, {
				header : '预计概算执行金额',
				width : 130,
				align : 'center',
				dataIndex : 'expectedBdgActMoney',
				hidden : true,
				renderer : function(value) {
                    if (value < 0) {
                        return '<div align=right style="color:red">'
                                + cnMoneyToPrec(value,2) + '</div>';
                    } else {
                        return '<div align=right>' + cnMoneyToPrec(value,2)
                                + '</div>';
                    }
                }
			}, {
				header : '已签订合同结余金额',
				width : 130,
				align : 'center',
				dataIndex : 'expectedjyMoney',
				hidden:true,
				renderer : function(value) {
                    if (value < 0) {
                        return '<div align=right style="color:red">'
                                + cnMoneyToPrec(value,2) + '</div>';
                    } else {
                        return '<div align=right>' + cnMoneyToPrec(value,2)
                                + '</div>';
                    }
                }
			}, {
				header : '预计超概金额',
				width : 100,
				align : 'center',
				dataIndex : 'expectedAmountMoney',
				hidden : true,
				renderer : function(value,record) {
					var flag1 = record;
                    if (value < 0) {
                        return '<div align=right style="color:red;font-weight: bold">'
                                + cnMoneyToPrec(value,2) + '</div>';
                    } else {
                        return '<div align=right>' + cnMoneyToPrec(value,2)
                                + '</div>';
                    }
                }
			}, {
//				header : '概算对应合同信息',
				header : '合同信息',
				width : 120,
				align : 'center',
				dataIndex : 'caozuo',
				renderer : function(v, p, r) {
					var bdgid=r.get('bdgid');
   					return "<a onclick='popQueryBdgid(\"" + bdgid + "\")' style='color:blue;cursor:hand'>查看</a>";
                }
			}, {
                header : '概算项目分类',
                width : 85,
                sortable : true,
                hidden : true,
                align : 'right',
                dataIndex : 'gcType'
            }, {
                header : '颜色变化标志',
                width : 0,
                sortable : true,
                hidden : true,
                align : 'right',
                dataIndex : 'flag'
            }];
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'budgetMaintenanceTree',// 后台java代码的业务逻辑方法定义
					business : 'bdgInfoMgm',// spring 管理的bean定义
					bean : 'com.sgepit.pmis.budget.hbm.VBdgInfo',// gridtree展示的bean
					params : 'pid' + SPLITB +  currentPid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "prono", "bdgmoney",
									'conbdgappmoney', 'remainder',
									'remainingMoney', 'expectedBdgActMoney',
									'expectedAmountMoney','flag', "parent", 
									
									//BUG8335新增字段 zhangh 2015-11-18
									
									"bidbdgmoney","signconbidbdgmoney","bidconappmoney","notbidconappmoney","bidconothermoney",
									
									"isleaf","gcType","ratifyBdg","conjymoney","expectedjyMoney"]
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

    var initBdgTree = new Ext.Button({
                            text : '初始化',
                            iconCls : 'btn',
                            tooltip : '初始化数据 ：<div align="center" style="color:red">预计未签订金额 = 概算金额 - 合同分摊总金额</div>',
                            handler : initialization
                        })  ;
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
	var formulaDesc = new Ext.Button({
		id : 'formulaDesc',
        text : '公式说明',
        tooltip : '字段公式说明',
       	cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/script_gear.png',
        handler : function() {
            showFormulaDesc();
        }
	});
	var btnCheck = new Ext.Button({
		id: 'checkBal',
		text: '概算平衡',
		tooltip: '检查概算平衡情况',
		cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icon-show-complete.gif',
        hidden : (DEPLOY_UNITTYPE == "0"),
		handler: funCkeckBal
	});
	
	var conBdgAppr = new Ext.Button({
		id: 'conBdgAppr',
		text: '合同概算分摊',
		cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icon-show-complete.gif',
        hidden : DEPLOY_UNITTYPE != "0",
		handler: function(){
			dolink("Business/budget/bdg.main.frame.jsp");
		}
	});

	var tbarArr ="";
    if(getPid == null || getPid == ""){   
        tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>', '-',btnexpendAll,'-',btnexpendClose, '-', btnCheck,'-',exportExcelBtn,'-',formulaDesc, '-', conBdgAppr,'->','计量单位： 元'];      
    }else{
        tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>', '-',btnexpendAll,'-',btnexpendClose,'-',exportExcelBtn,'-',formulaDesc, '->','计量单位： 元'];
    }
	treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'bdgname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
				viewConfig : {
					forceFit : false,
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
		if(selectedPath && selectedPath!="") {
			store.expandPath(selectedPath, "bdgid");
		} else {
			if (ds1.getCount() > 0) {
				var rec1 = ds1.getAt(0);
				if (!ds1.isExpandedNode(rec1)) {
					ds1.expandNode(rec1);
				}
			}
		}
	});
		
	
   store.on('expandnode', function(ds, rc) {
				if (selectedPath && selectedPath != "") {
					var equidArr = selectedPath.split("/");
					if (rc.get("bdgid") == equidArr.pop()) {
						treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
					}
				}
			});
			
  var initBdgTreeGrid = new Ext.Button({
	   id : 'initbdgtree',
	   text : '初始化概算结构树',
	   tooltip : '初始化概算结构树',
	   iconCls : 'btn',
	   handler : initbdgtreefunction
   })
   
    if(checkRtn=='0'){
    	//initBdgTree.disable(false);
    	exportExcelBtn.disable(false);
    	btnCheck.disable(false);
        tbarArr.splice(16,0,initBdgTreeGrid)
    }
    
	var contentPanel = new Ext.Panel({
			layout : 'border',
			region : 'center',
			border : false,
			header : false,
			tbar : tbarArr,
			items : [treeGrid, formPanel]
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
	treeGrid.on('rowcontextmenu', contextmenu, this);
	var treeMenu;
	function contextmenu(thisGrid, rowIndex, e) {
		// e.preventDefault();//阻止系统默认的右键菜单
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var name = e.getTarget().innerText;
		var bdgid = record.get("bdgid");
		var bdgname = record.get("bdgname");
		var bdgno = record.get("bdgno");
		var isRoot = (rootText == name);
		if (rootText == name)
			return;
		var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
			// node : node,
			handler : toHandler
		};
		var menuUpdate = {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			// node : node,
			handler : toHandler
		};
		var menuDelete = {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			// node : node,
			handler : toHandler
		};
		var menuDetail = {
			id : 'overview',
			text : '　查看',
			iconCls : 'form',
			// node : node,
			handler : popQueryBdgid
		};
		var items;
		if (ModuleLVL == '1') {
			items = [menuAdd, menuDelete, menuUpdate, '-', menuDetail];
		} else {
			items = [menuDetail];
		}
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : items
		});
		
		if(indexView == "1"){
			treeMenu.items.get("menu_add").disable();
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
			var coords = e.getXY();
			treeMenu.showAt([coords[0], coords[1]]);	
		}else{
		
	 		if (ModuleLVL == '1') {
				if (isRoot) {
					treeMenu.items.get("menu_update").disable();
					treeMenu.items.get("menu_del").disable();
				} else {
					treeMenu.items.get("menu_update").enable();
					treeMenu.items.get("menu_del").enable();
				}
			} 
			var coords = e.getXY();
			treeMenu.showAt([coords[0], coords[1]]);		
			/*如果是根节点，则右键只允许查看,根节点概算编码01
		 	* 如果是四大父节点，则只允许新增，查看，四大节点概算编码分别是0101,0102,0103,0104
		 	* */	
			if(bdgno=='01'){
				treeMenu.items.get("menu_add").disable();
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("menu_del").disable();
				treeMenu.items.get("overview").enable();				
			}else if(bdgno=='0101'||bdgno=='0102'||bdgno=='0103'||bdgno=='0104'){
				treeMenu.items.get("menu_add").enable();
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("overview").enable();
				treeMenu.items.get("menu_del").disable();		
			}else{
				treeMenu.items.get("menu_add").enable();
				treeMenu.items.get("overview").enable();
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("menu_del").enable();			
			}
		}
	}

	function toHandler(node) {
		var rec = treeGrid.getSelectionModel().getSelected();        
		var state = this.id;
		var no = rec.data.bdgno;
		var isRoot = (rootText == node.text);
        var ty = Ext.getCmp('gcType');
		var menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		var parent = rec.data.parent;
		if (parent != '0') {
			DWREngine.setAsync(false);
			baseMgm.findById(beanName, parent, function(obj) {
						parentbdgno = obj.bdgno;
						parentbdgname = obj.bdgname;
					});
			DWREngine.setAsync(true);
		}
		
		if ("menu_add" == state) {
			var isleaf=rec.data.isleaf;
			var bdgid=rec.data.bdgid;
			var bdgmoney=rec.data.bdgmoney;
			var remainingMoney=rec.data.remainingMoney;
			if(isleaf==1){//叶子节点的新增
				var isDel = false;
				DWREngine.setAsync(false);
				bdgInfoMgm.isApportion(bdgid, function(flag) {
					if (flag == true) {
						isDel = false
					} else {
						isDel = true;
					}
				})
				DWREngine.setAsync(true);
				if (!isDel){//新增的叶子节点有分摊记录，不允许新增
					Ext.Msg.alert("提示","本记录已有合同分摊信息，不允许新增");
					formPanel.collapse();
					return;
				} else {//新增的叶子节点无分摊记录，允许新增
					saveBtn.setDisabled(false);
					var formRecord = Ext.data.Record.create(Columns);
					formPanel.getForm().findField('remainingMoney').el.dom.readOnly = false;
					formPanel.getForm().findField('bdgmoney').el.dom.disabled = false;
					loadFormRecord = new formRecord({
							parentbdgname :rec.data.bdgname,
							parentbdgno : rec.data.bdgno,
							pid : currentPid,
							bdgid : null,
							bdgno : '',
							prono : '',
							bdgname : '',
							bdgflag : 0,
							bdgmoney : bdgmoney,
							remainingMoney : remainingMoney,
							contmoney : 0,
							matrmoney : 0,
							buildmoney : 0,
							equmoney : 0,
							isleaf : 1,
							parent : rec.data.bdgid,
							bdgmoneyCal : 0,
							ratifyBdg : 0,
							conjymoney : 0,
							expectedjyMoney : 0
						});
					formPanel.isNew = false
					formPanel.getForm().loadRecord(loadFormRecord);
					formPanel.expand();					
				}
			}
			else{//非叶子节点的新增
				saveBtn.setDisabled(false);
				var formRecord = Ext.data.Record.create(Columns);
				formPanel.getForm().findField('remainingMoney').el.dom.readOnly = false;
				loadFormRecord = new formRecord({
						parentbdgname :rec.data.bdgname,
						parentbdgno : rec.data.bdgno,
						pid : currentPid,
						bdgid : null,
						bdgno : '',
						prono : '',
						bdgname : '',
						bdgflag : 0,
						bdgmoney : 0,
						remainingMoney : 0,
						contmoney : 0,
						matrmoney : 0,
						buildmoney : 0,
						equmoney : 0,
						isleaf : 1,
						parent : rec.data.bdgid,
						bdgmoneyCal : 0,
						ratifyBdg : 0,
						conjymoney : 0,
						expectedjyMoney : 0
					});
				formPanel.isNew = false
				formPanel.getForm().loadRecord(loadFormRecord);
				formPanel.expand();						
			}

		} else if ("menu_del" == state) {
			/*
			if (no == '01' || no == '0101' || no == '0102' || no == '0103' || no == '0104') {
				Ext.Msg.alert('提示信息', '基础数据不能删除')
			} else {
			*/
				node = '[' + 'Node' + ' ' + rec.data.bdgid + ']';
				delHandler(rec.data.bdgid, node);
			/*
			}
			*/
		} else if ("menu_update" == state) {
            formPanel.getForm().findField('remainingMoney').el.dom.readOnly = false;
            if (no == '01') {
				formPanel.getForm().findField('parentbdgname').el.parent().parent().parent().first().dom.style.display = "none"; 
				formPanel.getForm().findField('parentbdgname').hide(); 
				formPanel.getForm().findField('parentbdgno').hide();
                formPanel.getForm().findField('parentbdgno').getEl().up('.x-form-item').setDisplayed(false); 
			} else {
				formPanel.getForm().findField('parentbdgname').el.parent().parent().parent().first().dom.style.display = "block"; 
				formPanel.getForm().findField('parentbdgname').show(); 
				formPanel.getForm().findField('parentbdgno').show();
                formPanel.getForm().findField('parentbdgno').getEl().up('.x-form-item').setDisplayed(true); 
				formPanel.getForm().findField('parentbdgname').setValue(parentbdgname);
				formPanel.getForm().findField('parentbdgno').setValue(parentbdgno);
			}
            formPanel.getForm().findField('contmoney').setValue(rec.data.conbdgappmoney);
            formPanel.getForm().findField('pid').setValue(currentPid);
			if (menu_isLeaf == 1) {
				formPanel.isNew = true
				formPanel.expand();
				formPanel.getForm().loadRecord(rec);
				if (no == '01' || no == '0101' || no == '0102' || no == '0103' || no == '0104') {
					formPanel.getForm().findField('bdgname').el.dom.readOnly = true;
					formPanel.getForm().findField('bdgno').el.dom.readOnly = true;
				}
				var bdgid=formPanel.getForm().findField('bdgid').getValue();
				var isDel = false;
				DWREngine.setAsync(false);
				bdgInfoMgm.isApportion(bdgid, function(flag) {
					if (flag == true) {
						isDel = false
					} else {
						isDel = true;
					}
				})
				DWREngine.setAsync(true);
				if (!isDel){//有分摊记录不允许修改概算名称   
					formPanel.getForm().findField('bdgname').el.dom.disabled = true;
					formPanel.getForm().findField('bdgno').el.dom.disabled = false;	
				}else{
					formPanel.getForm().findField('bdgname').el.dom.disabled = false;
					formPanel.getForm().findField('bdgno').el.dom.disabled = false;
				}
				formPanel.getForm().findField('gcType').el.dom.disabled = false;
				formPanel.getForm().findField('bdgmoney').el.dom.disabled = false;
				formPanel.getForm().findField('remainingMoney').el.dom.disabled = false;
				saveBtn.setDisabled(false);
				
			} else {//非叶子节点
				formPanel.getForm().findField('bdgmoney').el.dom.disabled = false;
				formPanel.getForm().findField('remainingMoney').el.dom.disabled = false;				
				var bdgid=rec.data.bdgid;
				
				formPanel.expand();
				formPanel.getForm().loadRecord(rec);
				var isDel = false;
				DWREngine.setAsync(false);
				bdgInfoMgm.isApportion(bdgid, function(flag) {
					if (flag == true) {
						isDel = false
					} else {
						isDel = true;
					}
				})
				DWREngine.setAsync(true);
				if (!isDel){//有分摊记录时，概算名称不能修改
					formPanel.getForm().findField('bdgname').el.dom.disabled = true;
				} else {
					formPanel.getForm().findField('bdgname').el.dom.disabled = false;
				}
				if (no == '01' || no == '0101' || no == '0102' || no == '0103' || no == '0104') {
					formPanel.getForm().findField('bdgname').el.dom.disabled = true;
					formPanel.getForm().findField('bdgno').el.dom.disabled = true;
				}
				saveBtn.setDisabled(false);
				/*
				if (!isDel){//有分摊记录时，概算编码不能修改
					formPanel.collapse();
					Ext.Msg.show({
							title : '提示',
							msg : '已有合同分摊至概算项，不能修改',
							buttons : Ext.Msg.OK,
							icon : Ext.MessageBox.INFO
						});					
					formPanel.getForm().findField('bdgno').el.dom.disabled = true;
					saveBtn.setDisabled(true);
				}else{
					formPanel.isNew = true;
					formPanel.expand();
					formPanel.getForm().loadRecord(rec);
					formPanel.getForm().findField('bdgno').el.dom.disabled = false;
					formPanel.getForm().findField('bdgname').el.dom.disabled = false;	  
					saveBtn.setDisabled(false);
				}
				*/
				/*
				
				*/
				return;
			}
		}
	}

	function delHandler(menu_nodeId, node) {
		var rec = treeGrid.getSelectionModel().getSelected();
		var childNodes=store.getNodeChildren(rec);
		var hasChild = true;
		DWREngine.setAsync(false);
		bdgInfoMgm.isHasChilds(menu_nodeId, function(flag) {
			if (!flag) {
				hasChild = false
			}
		})
		DWREngine.setAsync(true);
		
		
		var isDel = false;// 是否可刪除（true：是 false：否）	
		DWREngine.setAsync(false);
		bdgInfoMgm.isApportion(menu_nodeId, function(flag) {
			if (flag == true) {
				isDel = false
			} else {
				isDel = true;
			}
		})
		DWREngine.setAsync(true);	
		
		if (!isDel){
			Ext.Msg.show({
						title : '提示',
						msg : '已有合同分摊至概算项，不能删除！',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.INFO
					});
			return;		
		}else{
			var msgStr = "";
			if (hasChild){//有子节点
				msgStr = '是否删除' + rec.data.bdgname + '[' + rec.data.bdgno+ '] 及下层所有概算项目?';
			} else {
				msgStr = '是否删除' + rec.data.bdgname + '[' + rec.data.bdgno+ '] 概算项目?';
			}
			Ext.Msg.show({
				title : '提示',
				msg : msgStr,
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						treeGrid.getEl().mask("loading...");
						//进行删除 递归计算上级节点的概算金额、预计未签订金额 合同分摊总金额
						bdgInfoMgm.deleteChildNodesByCalMoney(menu_nodeId, function(flag) {
							if ("0" == flag) {
								selectedPath = store.getPath(rec, "bdgid");
								store.load();
								Ext.example.msg('删除成功！',
										'您成功删除了本概算信息！');
							} else {
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							treeGrid.getEl().unmask();
						});
					}
				}
			});					
		}
	}
    
	function popQueryBdgid() {
		var rec = treeGrid.getSelectionModel().getSelected();
        queryBdgid =rec.data.bdgid;
        var url= BASE_PATH +"Business/budget/bdg.frame.edit.querybdg.jsp?queryBdgid="+queryBdgid;
        window.showModalDialog(url,"",
                "dialogWidth:1200px;dialogHeight:500px;location:no; " +
                "scroll:yes;resizable:yes;status:no;Minimize=yes;Maximize=yes");
	}

//初始化预计未签订金额
    function initialization(){
        Ext.Msg.confirm('初始化提示',
                  '<div align="center" style="color:red">预计未签订金额 = 概算金额  -&nbsp;&nbsp;合同分摊总金额</div>' +
                  '<div align="center"><br>是否要进行初始化？</div>',function(btn){
		                 if (btn == 'yes') {
								var myMask = new Ext.LoadMask(Ext.getBody(), {
											msg : "正在进行数据初始化，请稍等......"
										});
								myMask.show();
		                 		DWREngine.setAsync(false);
								bdgInfoMgm.initializationAction(currentPid,
										defaultOrgRootID, function(value) {
											myMask.hide();
											selectedPath = "";
											store.load();
											Ext.example.msg('信息提示', '您初始化了所有的预计未签订金额！');
										})
								DWREngine.setAsync(true);
							}else{
		                   Ext.example.msg('信息提示', '您放弃了初始化！');
		                 }
        })
    }
//数据的导出

    function exportDataFile() {
        var openUrl = CONTEXT_PATH
                + "/servlet/BdgServlet?ac=exportData&&businessType=BdgInfo&unitId="
                + currentPid;
        document.all.formAc.action = openUrl
        document.all.formAc.submit();
    }
    //公式说明
    function showFormulaDesc(){
    	var url = CONTEXT_PATH +"/Business/budget/bdg.frame.edit.formula.jsp";
    	window.showModalDialog(
				url,
				"",
				"dialogWidth:"
						+ screen.availWidth*.6
						+ "px;dialogHeight:"
						+ screen.availHeight*.5
						+ "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
    }
    
  //结构树初始化
     function initbdgtreefunction() {
		DWREngine.setAsync(false);
		bdgInfoMgm.initBdgTree("0", currentPid, function(rtn) {
				})
		DWREngine.setAsync(true);
		selectedPath = "";
        store.load();
		initBdgTreeGrid.destroy();
		//initBdgTree.enable();
	    exportExcelBtn.enable();
	    btnCheck.enable();
	}
	
	function funCkeckBal(){
		window.showModalDialog( BASE_PATH + "Business/budget/bdg.frame.checkBal.jsp",null,"dialogWidth:1200px;dialogHeight:600px;center:yes;resizable:yes;")
		store.load();
	}
});

function popQueryBdgid(queryBdgid) {
    var url= BASE_PATH +"Business/budget/bdg.frame.edit.querybdg.jsp?queryBdgid="+queryBdgid;
    window.showModalDialog(url,"",
            "dialogWidth:1200px;dialogHeight:500px;location:no; " +
            "scroll:yes;resizable:yes;status:no;Minimize=yes;Maximize=yes");
}

function dolink(url){
	top.frames["contentFrame"].location.href = CONTEXT_PATH+'/'+url;
	try{
		top.backToSubSystemBtn.show()
	}catch(ex){}
}