	/*
	 * Ext JS Library 2.0 Beta 1
	 * Copyright(c) 2006-2007, Ext JS, LLC.
	 * licensing@extjs.com
	 * 
	 * http://extjs.com/license
	 */
	// 全局变量
var gridPanelTitle = "合同:" +　g_conname + " 变更号：" + g_chano + " , 所有合同变更概算记录"
var rootText = "合同变更分摊";
var baseUrl = "http://localhost:8080/wbf/"
var tmpNodeRecord; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var currentPid = CURRENTAPPID;
	 
Ext.onReady(function (){
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH + "Business/budget/bdg.change.jsp?conid=" + g_conid + "&conname=" + g_conname +"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
		}
	});
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'btn',
		handler: function(){
			window.location.href = BASE_PATH  + "Business/budget/bdg.apportion.change.tree.jsp?conid="
				 + g_conid +  "&chaid=" +g_chaid;
		}
	});
	
	/**
	 * @description 被流程所调用的页面中，按钮的统一化管理
	 * @param BUTTON_CONFIG - 存放当前页面上的所有按钮
	 * @author xiaos
	 */
    var BUTTON_CONFIG = {
    	'BACK': {
			text: '返回',
			iconCls: 'returnTo',
			disabled: true,
			handler: function(){
				window.location.href = BASE_PATH + "Business/budget/bdg.change.jsp?conid="+g_conid+"&conname="+g_conname +"&uids="+UIDS+"&conids="+CONIDS+"&optype="+OPTYPE+"&dyView="+dyView;
			}
		},'SELECT': {
			text: '选择',
			iconCls: 'btn',
			disabled: true,
			handler: function(){
			window.location.href = BASE_PATH  + "Business/budget/bdg.apportion.change.tree.jsp?conid="
				 + g_conid +  "&chaid=" +g_chaid;
			}
		}
    };
    
    /**
     * @description 本页面一共有3种被调用的状态：
     * 		1、普通应用程序调用；
     * 		2、流程实例在流转中，任务节点调用；
     * 		3、流程实例被查看的时候调用；
     * @param isFlwTask = true 为第2种状态
     * @param isFlwView = true 为第3种状态
     * @param isFlwTask != true && isFlwView != true 为第1种状态
     */
    if (isFlwTask == true){
    	BUTTON_CONFIG['SELECT'].disabled = false;
    } else if (isFlwView == true){
    	
    } else if (isFlwTask != true && isFlwView != true) {
    	BUTTON_CONFIG['BACK'].disabled = false;
 
    	if ( ModuleLVL == '1' ){
		
		BUTTON_CONFIG['SELECT'].disabled = false;
		}
		else{
		BUTTON_CONFIG['SELECT'].disabled = true;
		}
    }
	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'bdgChangeTreeGrid',// 后台java代码的业务逻辑方法定义
					business : 'bdgChangeMgm',// spring 管理的bean定义
					bean : beanName,// gridtree展示的bean
					params : 'conid' + SPLITB +  g_conid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["bdgid", "bdgname", "bdgno", "pid","conid","bdgmoney",
									"conbdgappmoney","conappmoney","cano","isleaf","parent","caid","camoney"]
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
								+ ";parent" + SPLITB + parent+ ";chaid" + SPLITB + g_chaid;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});	
	
	
	treePanelNew = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'change-tree-panel',
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
            width: 270,				//隐藏字段
            dataIndex: 'bdgname'
        },{
            header: '概算编码',
            width: 120,
            dataIndex: 'bdgno',
            renderer: function(value){
            	return "<div id='bdgno'>"+value+"</div>";
            }
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
            header: '分摊主键',	
            width: 0,		
            hidden:true,
            dataIndex: 'caid',
            renderer: function(value){
            	return "<div id='caid' >"+value+"</div>";
            }
        },{
        	id:"bdgid",
            header: '概算主键',	
            width: 0,	
            hidden:true,
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '内部流水号',
            width: 0,
            hidden:true,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },{
            header: '概算金额', 
            width: 70,
            dataIndex: 'bdgmoney',
            renderer: function(value){
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
			hidden:true,
			dataIndex : 'conappmoney',
			renderer : function(value) {
				return "<div id='conappmoney' align='right'>"
						+ cnMoneyToPrec(value) + "</div>";
				}
			},
			{
            header: '变更分摊金额',
            width: 85,
            dataIndex: 'camoney',//old camoney
             renderer: function(value){
            	return "<div id='camoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
            //renderer: cnMoney
        },{
            header: '变更单号',
            width: 0,
            hidden:true,
            dataIndex: 'cano',
            renderer: function(value){
            	return "<div id='cano'>"+value+"</div>";
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
		var menu_nodeId = isRoot ? "0" :rec.data.caid;
		var menu_parent = isRoot ? "0" : rec.data.parent;
		var menu_isLeaf = isRoot ? "false" :rec.data.isleaf;
		var menu_bdgid=isRoot ? "0" : rec.data.bdgid;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;	
		if ("　删除" == state){
			delHandler(menu_isLeaf, menu_nodeId, menu_parent);
		} 
		else{
			formPanel.isNew = false;	
			if (menu_isLeaf == 1) {
				saveBtn.setDisabled(false);
			}	
			else{
				saveBtn.setDisabled(true);
			}
	    var formRecord = Ext.data.Record.create(Columns);
	    var loadFormRecord = null;
	    var loadFormBdgInfo = null;
	    var loadFormBdgMoney = null;
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
	
	function delHandler(isleaf, claid, parentid){
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
				
						treePanelNew.getEl().mask("loading...");
			    		bdgChangeMgm.deleteChildNodeBdgChangeApp(claid, function(flag){
			    			if ("0" == flag){
				   					var formDelRecord = Ext.data.Record.create(Columns);
									var formRecord = Ext.data.Record.create(Columns);
									var emptyRecord = new formRecord({
										caid: null,
										pid : CURRENTAPPID,
										bdgid : '',
										conid: '',
										camoney: 0,
										cano:'',
										bdgmoney:0,
										bdgno : '',
										bdgname : '',
										isleaf : 1,
										parent : "",
										conbdgappmoney:0,
										conappmoney:0
									});
									formPanel.getForm().loadRecord(emptyRecord);
									formPanel.getForm().clearInvalid();
//		

								var bdgidsArr=new Array();
								bdgidsArr.push(rec.data.bdgid);
								var oldFactMoneyStr = rec.data.camoney+"";
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
								removeDeletedNode();//删除节点
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
function onClick(e){
	var rec = treePanelNew.getSelectionModel().getSelected(); 
	if(rec){
		var isRoot ="";
		if(rec&&rec.data){
			isRoot=(rec.data.bdgname== rootText);
		}
		menu_nodeId = isRoot ? "0" : rec.data.caid;
		menu_bdgid = isRoot ? "0" : rec.data.bdgid;
		menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		tmpNodeRecord=rec;
		tmpLeaf = menu_isLeaf;			
	    var formRecord = Ext.data.Record.create(Columns);
	    var loadFormRecord = null;
	    var loadFormBdgInfo = null;
	    var loadFormBdgMoney = null;
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
		tbar:[
			'<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>','-',
			{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ store.expandAllNode(); }
		    }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ store.collapseAllNode(); }
            },'->',
	        BUTTON_CONFIG['SELECT'],'-',
	        BUTTON_CONFIG['BACK']
		],
		items: [treePanelNew,formPanel]
		
	}) 

	// 7. 创建viewport加入面板content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
        	title : gridPanelTitle,
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
    // 10. 其他自定义函数，如格式化，校验等

  saveBtn.setDisabled(true);  
});

function formatDate(value){
	return value ? value.dateFormat('Y-m-d') : '';
};
	    
    
	
	
	
