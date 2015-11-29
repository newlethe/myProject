
var gridPanelTitle = "合同：" + g_conname + ", 违约编号：" + g_breno + ", 违约分摊";
var rootText = '违约分摊';
var tmpNodeRecord; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var loadFormBdgMoney
Ext.onReady(function (){
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href =BASE_PATH + "Business/budget/bdg.breach.jsp?conid=" 
				+ g_conid + "&conname=" + g_conname+ "&conno=" + g_conno+"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;	
		}
	});
	
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'option',
		handler: function(){
			window.location.href = baseUrl + "Business/budget/bdg.apportion.tree.jsp?type=breach&conid="+g_conid+"&breid="+g_breid;
		}
	});
	
	if ( ModuleLVL == '1' ){
		
		btnSelect.setDisabled(false);
		}
		else{
			btnSelect.setDisabled(true);
		}
	
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'bgdgBreachTreeGrid',// 后台java代码的业务逻辑方法定义
					business : 'bdgBreachMgm',// spring 管理的bean定义
					bean : beanName,// gridtree展示的bean
					params : 'conid' + SPLITB +  g_conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"conbdgappmoney","conappmoney","breappno","isleaf","parent","breappid","appmoney"]
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
						ds.baseParams.params = 'conid' + SPLITB + g_conid
								+ ";parent" + SPLITB + parent+ ";breid" + SPLITB + g_breid;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});	
	
	treePanelNew =new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'breach-tree-panel',
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
		border : true,
		stripeRows : true,
		title : '', // 设置标题
		columns:[{
			id:"bdgname",
            header: '概算名称',
            width: 270,	
            dataIndex: 'bdgname'
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'pid'
        },{
            header: '概算主键',
            width: 0,	
            hidden:true,
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>" + value + "</div>";
            }
        },{
            header: '内部流水号',
            width: 0,
  			hidden:true,           
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>" + value + "</div>";
            }
        },{
            header: '违约分摊主键',
            width: 0,
            hidden:true,  
            dataIndex: 'breappid',
            renderer: function(value){
            	return "<div id='breappid'>" + value + "</div>";
            }
        },{
            header: '概算编码',
            width:120,
            dataIndex: 'bdgno',
            renderer: function(value){
            	return value == 'null' ? '' : value;
            }
        },{
            header: '违约分摊编号',
            width: 0,
             hidden:true,
            dataIndex: 'breappno',
            renderer: function(value){
            	return value == 'null' ? '' : value;
            }
        },{
            header: '概算金额',
            width: 70,
            dataIndex: 'bdgmoney',
            renderer:  function(value){
            	return "<div id='bdgmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        }, 
        	{
			header : '合同分摊总金额',
			width : 100,
			dataIndex : 'conbdgappmoney',
			renderer : function(value) {
				return "<div id='conbdgappmoney' align='right'>"
						+ cnMoneyToPrec(value) + "</div>";
			}
			// renderer: cnMoney
		}, {
			header : '本合同分摊总金额',
			width :0,
			hidden:true,
			dataIndex : 'conappmoney',
			renderer : function(value) {
				return "<div id='conappmoney' align='right'>"
						+ cnMoneyToPrec(value) + "</div>";
				}
			},{
            header: '违约分摊金额',
            width: 90,
            dataIndex: 'appmoney',
            renderer: function(value){
            	return "<div id='appmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
            //renderer: cnMoney
        },{
            header: '序号',
            width: 0,
             hidden:true,
            dataIndex: 'num',
            renderer: function(value){
            	return value == 'null' ? '' : value;
            }
        },{
            header: '是否子节点',
            width: 0,
             hidden:true,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
             hidden:true,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
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
	
	//右键菜单
	treePanelNew.on('rowcontextmenu', contextmenu, this);
	var treeMenu
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		if (ModuleLVL != '1'){
			return;
		}
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
	    treeMenu = new Ext.menu.Menu({
	        id: 'treeMenu',
	        width: 100,
	        items: [{
							id : 'menu_update',
							text : '　修改',
							iconCls : 'btn',
							handler : toHandler
						}, '-', {
	                    	id: 'menu_del',
			                text: '　删除',
			                iconCls: 'remove',
			                handler : toHandler
                	}]
	    });
	    treeMenu.showAt(e.getXY());
	     if (isRoot) {
				treeMenu.items.get("menu_update").disable();
				treeMenu.items.get("menu_del").disable();
			} else {
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("menu_del").enable();
			}
	}
	
	function toHandler(){
		var rec = treePanelNew.getSelectionModel().getSelected(); 
		var state = this.text;
		var isRoot = (rootText == rec.data.bdgname);
		var menu_nodeId = isRoot ? "0" :rec.data.breappid;
		var menu_parent = isRoot ? "0" : rec.data.parent;
		var menu_isLeaf = isRoot ? "false" :rec.data.isleaf;
		var menu_bdgid=isRoot ? "0" : rec.data.bdgid;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;
		if ("　删除" == state){
			delHandler(menu_isLeaf, menu_nodeId, menu_parent);
		} else{
			formPanel.isNew = false
	    var formRecord = Ext.data.Record.create(Columns);
	    var loadFormRecord = null;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;		    
		if (menu_isLeaf == '1') {
			saveBtn.setDisabled(false);
		} else {
			saveBtn.setDisabled(true);
		}
    	DWREngine.setAsync(false);
    	baseMgm.findById(beanName, menu_nodeId, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
		baseMgm.findById(beanNameInfo, menu_bdgid, function(obj){
			loadFormBdgInfo = new formRecord({
				bdgname : obj.bdgname,
				bdgno: obj.bdgno
			}); 
		});
		var  s = "conid='" + g_conid + "' and bdgid='" + menu_bdgid + "'";
		baseDao.findByWhere5(beanNameMoney, s, null,null,null,function(obj){
			loadFormBdgMoney = new formRecord({
				conappmoney :obj[0].conappmoney
			}); 
		});
		DWREngine.setAsync(true);  
	    formPanel.getForm().loadRecord(loadFormRecord);
		formPanel.getForm().loadRecord(loadFormBdgInfo);
		formPanel.getForm().loadRecord(loadFormBdgMoney); 
		}
	}
	
	function delHandler(isLeaf, nodeid, menu_parent){
		var rec = treePanelNew.getSelectionModel().getSelected(); 
		if (0 == isleaf){
			Ext.Msg.show({
			   title: '提示',
			   msg: '父节点不能进行删除操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		}else{
			Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
				
							treePanelNew.getEl().mask();
				    		bdgBreachMgm.deleteBreachChildNode(nodeid, function(flag){
				    			if ("0" == flag){
					   				var formDelRecord = Ext.data.Record.create(Columns);
										var formRecord = Ext.data.Record.create(Columns);
										var emptyRecord = new formRecord({
											breappid: null,
											pid : CURRENTAPPID,
											bdgid : '',
											conid: '',
											breappno:'',
											num: '',
											appmoney: 0,
											bdgmoney:0,
											bdgno : '',
											bdgname : '',
											isleaf : 1,
											parent : ""
										});
										formPanel.getForm().loadRecord(emptyRecord);
										formPanel.getForm().clearInvalid();
								var bdgidsArr=new Array();
								bdgidsArr.push(rec.data.bdgid);
								var oldFactMoneyStr = rec.data.appmoney+"";
								oldFactMoneyStr =oldFactMoneyStr.replace(new RegExp(",",'gm'), "");
								var oldFactMoney =oldFactMoneyStr.replace("￥","")*1;
								var parent = store.getNodeParent(rec);
								while(parent){	
									var bdgid=parent.data.bdgid;
									bdgidsArr.push(bdgid);
								    parent = store.getNodeParent(parent);
								}
								DWREngine.setAsync(false);
								var value=0-oldFactMoney*1;
								bdgInfoMgm.updaterRemainingMoney(bdgidsArr,value);//更新预计未签订金额字段
								DWREngine.setAsync(true);	
									removeDeletedNode();
									Ext.example.msg('删除成功！', '您成功删除了一条概算信息！');
					   			}else{
					   				Ext.Msg.show({
										title: '提示',
										msg: '数据删除失败！',
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
					   			}
					   			treePanelNew.getEl().unmask();
				    		});
				    	}
					}
				});
		}
	}
 
	//在页面上同步删除 本次已经删除的节点
	function removeDeletedNode(){
		store.load();
	}	
    
    treePanelNew.on('click', onClick);
	function onClick(e ){
		var rec = treePanelNew.getSelectionModel().getSelected(); 
	if(rec){
		var isRoot ="";
		if(rec&&rec.data){
			isRoot=(rec.data.bdgname== rootText);
		}
		menu_nodeId = isRoot ? "0" :rec.data.breappid;
		menu_bdgid =isRoot ? "0" : rec.data.bdgid;
		menu_isLeaf =isRoot ? "false" : rec.data.isleaf;
	    var formRecord = Ext.data.Record.create(Columns);
	    var loadFormRecord = null;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;		    
		if (menu_isLeaf == '1') {
			saveBtn.setDisabled(false);
		} else {
			saveBtn.setDisabled(true);
		}
    	DWREngine.setAsync(false);
    	baseMgm.findById(beanName, menu_nodeId, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
		baseMgm.findById(beanNameInfo, menu_bdgid, function(obj){
			loadFormBdgInfo = new formRecord({
				bdgname : obj.bdgname,
				bdgno: obj.bdgno
			}); 
		});
		var  s = "conid='" + g_conid + "' and bdgid='" + menu_bdgid + "'";
		baseDao.findByWhere5(beanNameMoney, s, null,null,null,function(obj){
			loadFormBdgMoney = new formRecord({
				conappmoney :obj[0].conappmoney
			}); 
		});
		DWREngine.setAsync(true);  
	    formPanel.getForm().loadRecord(loadFormRecord);
		formPanel.getForm().loadRecord(loadFormBdgInfo);
		formPanel.getForm().loadRecord(loadFormBdgMoney); 	    
	}
}	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		tbar:['<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
			  '-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ store.expandAllNode();}
		            }, '-', {
		                iconCls: 'icon-collapse-all',
		                tooltip: 'Collapse All',
		                handler: function(){ store.collapseAllNode(); }
		            },'->',btnSelect,'-',btnReturn],
		items: [treePanelNew,formPanel]
		
	}) 
	/////////////////////////////////////////////////////////////////////////////
    
	// 7. 创建viewport加入面板content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
            layout:'border',
            items: [contentPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [contentPanel]
        });
    }

    saveBtn.setDisabled(true);
    // 10. 其他自定义函数，如格式化，校验等
    function formatDate(value){
        return (value == null) ? value.substring(0,10) : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i') : value;
    };

});