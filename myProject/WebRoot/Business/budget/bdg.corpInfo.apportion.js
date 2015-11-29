var ServletUrl = "/wbf/servlet/BdgServlet"
var bean = "com.sgepit.pmis.budget.hbm.BdgCorpInfo"
var pid = CURRENTAPPID;
var gridPanelTitle = "建设法人管理树显示页面";
var rootText = "法人建设管理费";

Ext.onReady(function (){
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
		history.back();
		}
	});
	
	
	var btnSelect = new Ext.Button({
		text: '选择',
		iconCls: 'btn',
		handler: function(){
			window.location.href = BASE_PATH + "Business/budget/bdg.select.tree.jsp?corpbasicid="+corpbasicid;
	    }
	});
	
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form'
    });
    
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: "/wbf/servlet/BdgServlet?ac=corpInfoTree&corpbasicid="+corpbasicid,
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 800,
        minSize: 275,
        maxSize: 600,
        frame: false,
        header: false,
        //title: '建设法人管理树显示页面',
        /*tbar:[{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            }, '-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            },'->',btnSelect,'->',btnReturn],*/
        border: false,
        rootVisible: true,
        lines: true,
        autoScroll: true,
        animate: false,
		columns:[{
            header: '概算名称',
            width: 200,				//隐藏字段
            dataIndex: 'bdgname'
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
            header: '法人信息主键',	
            width: 0,				
            dataIndex: 'corpid',
            renderer: function(value){
            	return "<div id='corpid'>"+value+"</div>";
            }
        },{
            header: '法人主表主键',	
            width: 0,				
            dataIndex: 'basicid',
            renderer: function(value){
            	return "<div id='basicid'>"+value+"</div>";
            }
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '分摊金额',
            width: 80,
            dataIndex: 'appmoney',
            renderer: function(value){
            	return "<div id='appmoney' align='right'> ￥"+value+"</div>"
            }
        },{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header: '概算编号',
            width: 0,
            dataIndex: 'bdgno',
            renderer: function(value){
            	return "<div id='bdgno'>"+value+"</div>";
            }
        },{
            header: '概算金额',
            width: 80,
            dataIndex: 'bdgmoney',
            renderer: function(value){
            	return "<div id='bdgmoney' align='right'> ￥"+value+"</div>";
            }
        },{
            header:'备注',
            width:250,
            dataIndex:'corpremark',
            renderer: function(value){
            	return value == "null" ? "" : value;
            }
        }], 
        loader: treeLoaderNew,
        root: rootNew
	});
	
	//右键菜单
	treePanelNew.on('contextmenu', contextmenu, this);

	function contextmenu(node, e){
		var name = e.getTarget().innerText;
		if (rootText == name) return;
	    var treeMenu = new Ext.menu.Menu({
	        id: 'treeMenu',
	        width: 100,
	        items: [{
                    	id: 'menu_del',
		                text: '　删除',
		                value: node,
		                iconCls: 'multiplication',
		                handler: toHandler
                	}]
	    });
	    treeMenu.showAt(e.getXY());
	}
	
	function toHandler(){
		var node = this.value;
		var state = this.text;
		var elNode = node.getUI().elNode;
		menu_nodeId = elNode.all("corpid").innerText;
		menu_isLeaf = elNode.all("isleaf").innerText;
		if ("" != menu_nodeId){
			if ("　删除" == state){
				Ext.Msg.show({
					title: '提示',
					msg: '是否要删除?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
							delHandler(menu_isLeaf, menu_nodeId);
						}
					}
				});
			}else{return}
		}else{
			Ext.Msg.show({
			   title: '提示',
			   msg: '请选择树节点后再进行操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		}
	}
	
	function delHandler(isleaf, nodeid){
		if ("0" == isleaf){
			Ext.Msg.show({
			   title: '提示',
			   msg: '父节点不能进行删除操作！',
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
		}else{
			DWREngine.setAsync(false);
    		bdgCorpMgm.deleteChildNodeBdgCorpInfo(nodeid, function(flag){
    			if ("0" == flag){
	   				Ext.example.msg('删除成功！', '您成功删除了一条建设法人信息！');
	   				rootNew.reload();
					treePanelNew.expandAll();
	   			}else{
	   				Ext.Msg.show({
						title: '提示',
						msg: '数据删除失败！',
						buttons: Ext.Msg.OK,
						icon: Ext.MessageBox.ERROR
					});
	   			}
    		});
    		DWREngine.setAsync(true);
		}
	}
    
    treePanelNew.on('click', onClick);
	function onClick(node, e ){
		var elNode = node.getUI().elNode;
		menu_corpid = elNode.all("corpid").innerText;
		menu_bdgid = elNode.all("bdgid").innerText;
		menu_isLeaf = elNode.all("isleaf").innerText;
	    var formRecord = Ext.data.Record.create(Columns);
	    var loadFormRecord = null;
	    
	    if (menu_isLeaf == 0 ){
	    	saveBtn.setVisible(false);
	    }else{
	    	saveBtn.setVisible(true);
	    }
    	DWREngine.setAsync(false);
    	baseMgm.findById(beanName, menu_corpid, function(obj){
	    	loadFormRecord = new formRecord(obj);
	    });
		baseMgm.findById(beanNameInfo, menu_bdgid, function(obj){
			loadFormBdgInfo = new formRecord({
				bdgname : obj.bdgname,
				bdgno: obj.bdgno,
				bdgmoney : obj.bdgmoney
			}); 
		});
		DWREngine.setAsync(true);
		    
	    formPanel.getForm().loadRecord(loadFormRecord);
		formPanel.getForm().loadRecord(loadFormBdgInfo);	    
	}
	
	var contentPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		header: false,
		tbar:[{text: '<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
			   iconCls: 'title'
        		},'-',{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            },'->',btnSelect,'-',btnReturn],
		items: [treePanelNew, formPanel]
		
	}) 
	
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
	treePanelNew.render();
	rootNew.expand(true);

});
