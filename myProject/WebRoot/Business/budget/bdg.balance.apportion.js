	/*
	 * Ext JS Library 2.0 Beta 1
	 * Copyright(c) 2006-2007, Ext JS, LLC.
	 * licensing@extjs.com
	 * 
	 * http://extjs.com/license
	 */
	// 全局变量

var bean = "com.sgepit.pmis.budget.hbm.BdgBalApp"
var gridPanelTitle = "合同:" +　g_conname  + " , 所有合同结算概算记录"
var rootText = "合同结算分摊";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
	 
	 
Ext.onReady(function (){

		var btnReturn = new Ext.Button({
			text: '返回',
			iconCls: 'returnTo',
			handler: function(){
				window.location.href = BASE_PATH + "Business/budget/bdg.balance.jsp?conid=" + g_conid + "&conname=" + g_conname +"&conno=" +g_conno;
			}
		});
		
		var btnSelect = new Ext.Button({
			text: '选择',
			iconCls: 'btn',
			handler: function(){
				window.location.href = BASE_PATH  + "Business/budget/bdg.apportion.tree.jsp?conid="
					 + g_conid +  "&balid=" + balid  + "&type=balance";
			}
		});
		
		rootNew = new Ext.tree.AsyncTreeNode({
	        text: rootText,
	        iconCls: 'form'
	        
	    })

		/*treeLoaderNew = new Ext.tree.TreeLoader({
			url: basePath + "servlet/BdgServlet?ac=bdgBalTree&conid=" + g_conid + "&balid=" + balid ,
			clearOnLoad: true,
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			}
		});*/
		treeLoaderNew = new Ext.tree.TreeLoader({
			url: MAIN_SERVLET,
			baseParams: {
				ac:"columntree", 
				treeName:"bdgBalTree", 
				businessName:"bdgMgm", 
				conid:g_conid, 
				balid:balid,
				parent:0
			},
			clearOnLoad: true,
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			}
		});
		
		treePanelNew = new Ext.tree.ColumnTree({
	        id: 'budget-tree-panel',
	        iconCls: 'icon-by-category',
	        region: 'center',
	        width: 200,
	        minSize: 275,
	        maxSize: 400,
	        split: true,
	        frame: false,
	        header: false,
	        border: false,
	        rootVisible: true,
	        lines: true,
	        autoScroll: true,
	        animate: false,
			columns:[{
	            header: '概算名称',
	            width: 350,				
	            dataIndex: 'bdgname'
	        },{
	            header: '概算编号',
	            width: 0,
	            dataIndex: 'bdgno',
	            renderer: function(value){
	            	return "<div id='bdgno'>"+value+"</div>";
	            }
	        },{
	            header: '项目工程编号',
	            width: 0,				//隐藏字段
	            dataIndex: 'pid',
	            renderer: function(value){
	            	return "<div id='pid'>"+value+"</div>";
	            }
	        },{
	            header: '结算主键',	
	            width: 0,				
	            dataIndex: 'balid',
	            renderer: function(value){
	            	return "<div id='balid' >"+value+"</div>";
	            }
	        },{
	            header: '结算分摊主键',	
	            width: 0,				
	            dataIndex: 'balappid',
	            renderer: function(value){
	            	return "<div id='balappid' >"+value+"</div>";
	            }
	        },{
	            header: '概算主键',	
	            width: 0,				
	            dataIndex: 'bdgid',
	            renderer: function(value){
	            	return "<div id='bdgid'>"+value+"</div>";
	            }
	        },{
	            header: '内部流水号',
	            width: 0,
	            dataIndex: 'conid',
	            renderer: function(value){
	            	return "<div id='conid'>"+value+"</div>";
	            }
	        },{
	            header: '概算金额',
	            width: 150,
	            dataIndex: 'bdgmoney',
	            renderer: cnMoneyToPrec
	        },{
	            header: '结算分摊金额',
	            width: 150,
	            dataIndex: 'balmoney',
	             renderer: function(value){
	            	return "<div id='balmoney' align='right'>￥"+value+"</div>";
	            }
	           //renderer: cnMoney
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
	        }], 
	        loader: treeLoaderNew,
	        root: rootNew,
	        rootVisible: false
		});
		
		
		/*treePanelNew.on('beforeload', function(node) {
			var bdgid = node.attributes.bdgid;
			if (bdgid == null)
				bdgid = '0';
			treePanelNew.loader.dataUrl = BASE_PATH
					+ "servlet/BdgServlet?ac=bdgBalTree&conid=" + g_conid + "&balid=" + balid  +"&parent=" + bdgid + "";
		})*/
		treePanelNew.on('beforeload', function(node) {
			var bdgid = node.attributes.bdgid;
			if (bdgid == null)
				bdgid = '0';
			var baseParams = treePanelNew.loader.baseParams
			baseParams.parent = bdgid;
			baseParams.conid = g_conid;
			baseParams.balid = balid;	
		})
		
		//右键菜单
		treePanelNew.on('contextmenu', contextmenu, this);
		var treeMenu
		function contextmenu(node, e){
			node.fireEvent("click", node, e)
			var name = e.getTarget().innerText;
			var isRoot = (rootText == name);
		    treeMenu = new Ext.menu.Menu({
		        id: 'treeMenu',
		        width: 100,
		        items: [{
							id : 'menu_update',
							text : '　修改',
							value : node,
							iconCls : 'btn',
							handler : toHandler
						}, '-', {
	                    	id: 'menu_del',
			                text: '　删除',
			                value: node,
			                iconCls: 'remove',
			                handler : toHandler
	                	}]
		    });
		    treeMenu.showAt(e.getXY());
		    if (isRoot){
				treeMenu.items.get("menu_update").disable();
				treeMenu.items.get("menu_del").disable();
			} else {
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("menu_del").enable();
			}
		}
		
		function toHandler(){
			var node = tmpNode
			var state = this.text;
			var elNode = node.getUI().elNode;
			var isRoot = (rootText == node.text);
			var menu_nodeId = isRoot ? "0" : elNode.all('balappid').innerText;
			var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
			var amenu_isLeaf = isRoot ? "false" :elNode.all('isleaf').innerText;

			if ("　删除" == state){
				delHandler(menu_isLeaf, menu_nodeId, menu_parent,node);
			} else{
				formPanel.isNew = false
					if (menu_isLeaf == 1) {
						saveBtn.setDisabled(false);
					}	
			}
		}
		
		function delHandler(isleaf, nodeid, menu_parent,node){
			if ("0" == isleaf){
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
				    		bdgBalMgm.deleteBalChildNode(nodeid, function(flag){
				    			if ("0" == flag){
					   					var formDelRecord = Ext.data.Record.create(Columns);
										var flag = (node.parentNode.childNodes.length == 1)
										var pNode = flag? node.parentNode.parentNode: node.parentNode
										var formRecord = Ext.data.Record.create(Columns);
										var emptyRecord = new formRecord({
											balappid: null,
											pid : CURRENTAPPID,
											balid:'',
											bdgid : '',
											conid: '',
											balmoney: 0,
											bdgmoney:0,
											bdgno : '',
											bdgname : '',
											isleaf : 1,
											parent : ""
										});
										formPanel.getForm().loadRecord(emptyRecord);
										formPanel.getForm().clearInvalid();
										if (flag) {
											node.remove();
										}else{
											treeLoaderNew.load(pNode);
											pNode.expand();
										}
									
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
	    
	    
	    treePanelNew.on('click', onClick);
		function onClick(node, e ){
			var elNode = node.getUI().elNode;
			var isRoot = node == rootNew; //----------
			menu_nodeId = isRoot ? "0" : elNode.all("balappid").innerText;
			menu_bdgid = isRoot ? "0" : elNode.all("bdgid").innerText;
			menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		    var formRecord = Ext.data.Record.create(Columns);
		    var loadFormRecord = null;
		    
		    saveBtn.setDisabled(true);//------------
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
					bdgmoney : obj[0].realmoney
				}); 
			});
			DWREngine.setAsync(true);
			tmpNode = node;    //---------------
			tmpLeaf = menu_isLeaf;     //------------     
		    formPanel.getForm().loadRecord(loadFormRecord);
			formPanel.getForm().loadRecord(loadFormBdgInfo);	
			formPanel.getForm().loadRecord(loadFormBdgMoney);    
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
		treePanelNew.render();
		treePanelNew.expand();
	    rootNew.expand();
	    // 10. 其他自定义函数，如格式化，校验等
	   
	    
	});
	
	    
    
	
	
	
