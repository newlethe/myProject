/**
 * 收藏夹面板
 * @class FeedPanel
 * @extends Ext.tree.TreePanel
 */
var del = false;
FeedPanel = function() {
    FeedPanel.superclass.constructor.call(this, {
        id:'fav-tree',
        enableDD : true,
        margins:'0 0 0 0',
        cmargins:'0 0 0 0',
        rootVisible:false,
        lines:false,
        autoScroll:true,
        root: new Ext.tree.TreeNode('Feed Viewer'),
        collapseFirst:false
    });

    this.feeds = this.root;

    this.getSelectionModel().on({
        'beforeselect' : function(sm, node){
             return node.isLeaf();
        },
        'selectionchange' : function(sm, node){
            if(node){
                this.fireEvent('feedselect', node.attributes);
            }
        },
        scope:this
    });
	
    this.addEvents({feedselect:true});

    this.on('contextmenu', this.onContextMenu, this);
    //this.on('click',this.openFun,this);
    this.on('render',this.buildNodes,this)
};
Ext.extend(FeedPanel, Ext.tree.TreePanel, {
	buildNodes : function(){
		if(systemMgm&&(systemMgm.getFavByUserID)&&USERID){
			var favPanel = this;
			DWREngine.setAsync(false);
			systemMgm.getFavByUserID(USERID,function(data){
				if(data != ""){
					var arr = data.split(";")
			     	if(arr.length > 0){
			     		for(var i=0;i<arr.length;i++){
			     			var powerpk = arr[i].split("|")[0];
			     			var powername = arr[i].split("|")[1];
			     			var url = arr[i].split("|")[2];
			     			var iconCls = arr[i].split("|")[3];
			     			favPanel.addFav({
						        powerpk:powerpk,
						        text: powername,
						        href: url,
						        iconCls: iconCls,
						        hrefTarget:'contentFrame'
						    }, false, true);
			     		}
			     	}
				}
		    })
			DWREngine.setAsync(true);
		}
	},
	openFun: function(node,e){
		if(node.attributes.url){
			var obj = new Object()
			obj.id = node.attributes.id+"`"+node.attributes.url
			obj.text = node.attributes.text
			parent.loadModule(obj)
			parent.west.collapse()
		}
	},
    onContextMenu : function(node, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'feeds-ctx',
                items: [{
                    text:'移除',
                    iconCls:'delete-icon',
                    scope: this,
                    handler:function(){
                        this.ctxNode.ui.removeClass('x-node-ctx');
                        this.removeFeed(this.ctxNode.attributes.powerpk);
                        this.ctxNode = null;
                    }
                }]
            });
            this.menu.on('hide', this.onContextHide, this);
        }
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
        if(node.isLeaf()){
            this.ctxNode = node;
            this.ctxNode.ui.addClass('x-node-ctx');
            this.menu.showAt(e.getXY());
        }
    },

    onContextHide : function(){
        if(this.ctxNode){
            this.ctxNode.ui.removeClass('x-node-ctx');
            this.ctxNode = null;
        }
    },


    selectFeed: function(powerpk){
    	try{
        this.getNodeById(powerpk).select();
        }catch(e){}
    },

    removeFeed: function(powerpk){
        var node = this.getNodeById(powerpk);
        if(node){
        	node.unselect();
        	systemMgm.addFav(powerpk,USERID,function(data){
            	if(data=="deleteSucess"){
            		del = true;
            		Ext.fly(node.ui.elNode).ghost('l', {
		                callback: node.remove, scope: node, duration: .4
		            });
            	}else{
            		Ext.MessageBox.alert("提示","删除操作失败")
            	}   
            })
            
        }
    },

    addFav : function(attrs, inactive, preventAnim){
        var exists = this.getNodeById(attrs.powerpk);
        if(exists){
            if(!inactive){
                exists.select();
                exists.ui.highlight();
            }
            return;
        }
        Ext.applyIf(attrs, {
            iconCls: 'feed-icon',
            leaf:true,
            cls:'feed',
            id: attrs.powerpk
        });
        var node = new Ext.tree.TreeNode(attrs);
        this.feeds.appendChild(node);
        return node;
       
    },
    afterRender : function(){
        FeedPanel.superclass.afterRender.call(this);
        this.el.on('contextmenu', function(e){
            e.preventDefault();
        });
    }
});
Ext.reg('feedpanel',FeedPanel)
/**
 * 功能面板
 * @class RockPanel
 * @extends Ext.Panel
 */
RockPanel = Ext.extend(Ext.Panel ,{
	autoScroll:true,
	layout:'fit',
	initComponent:function(){
		if(this.toolPos&&this.toolPos=='left'){//在左边显示
			var tt = new Ext.Template(
	             '<div class="x-tool-left x-tool-{id}">&#160;</div>'
	        );
	        tt.disableFormats = true;
	        tt.compile();
			this.toolTemplate = tt;
		};
		this.on('render',function(cmp1){
			if(!(cmp1.collapsed)){
				DWREngine.setAsync(false);
				systemMgm.getTreeByPk(cmp1.id, function(rtn){
					if(rtn&&rtn!=""){
						var obj = eval(rtn);
						cmp1.add(obj);
					}
				})
				DWREngine.setAsync(true);
			}
		});
		this.on('beforeexpand',function(cmp){
			if(cmp.items&&cmp.items.length==0){
				DWREngine.setAsync(false);
				systemMgm.getTreeByPk(cmp.id, function(rtn){
					if(rtn&&rtn!=""){
						var obj = eval(rtn);
						cmp.add(obj)
					}
				})
				DWREngine.setAsync(true);
			}
		});
		RockPanel.superclass.initComponent.call(this);
	}
});
Ext.reg('rockpanel',RockPanel);
/**
 * 可选功能窗口
 * @class RockWindow
 * @extends Ext.Window
 */
RockWindow = Ext.extend(Ext.Window,{
	title: '可选菜单', 
	iconCls: 'flow',  
	closeAction: 'close',
	width: 300,       
	height: 500,     
	modal: true,     
	plain: true,     
	border: false, 
	resizable: false, 
	expandBtn:null,  
	collapseBtn:null,
	submitBtn:null,
	showtab:0,
	tab:null,
	initComponent:function(){
		var _self = this;
		this.expandBtn = new Ext.Toolbar.Button({
			iconCls : 'icon-expand-all',tooltip : '全部展开',
			handler : function() {
				var  favdocument = window.frames['favid'];
				if(favdocument&&favdocument.powerTree){
					favdocument.powerTree.getRootNode().expand(true);
				};
			}
		});
		this.collapseBtn = new Ext.Toolbar.Button({
			iconCls : 'icon-collapse-all',tooltip : '全部折叠',
			handler : function() {
				var  favdocument = window.frames['favid'];
				if(favdocument&&favdocument.powerTree){
					favdocument.powerTree.getRootNode().collapse(true);
				};
			}
		});
		this.submitBtn = new Ext.Toolbar.Button({
			tooltip: '确认选择',
			iconCls: 'icon-submit',	
			handler: function(){
				var  favdocument = window.frames['favid'];
				if(!favdocument){
					Ext.example.msg("提示","操作失败！");
					return;
				} 
				var selectedList = favdocument.selectedList;
				if(selectedList.length==0){
					Ext.example.msg("提示","没有选择添加的功能项")
				}else{
					systemMgm.addFavs(USERID,selectedList.join("`"),function(data){		
						if(data=="操作成功"){		
							Ext.example.msg("提示",data)
							_self.hide();
						}else{
							Ext.MessageBox.alert("提示",data)
						}				
					})
				}
			}
		});
		this.favCheckBox = new Ext.form.Checkbox({
			xtype:'checkbox',
			boxLabel :'是否显示常用操作',
			listeners:{
				check:function(cbox,checked){
					_self.showtab = checked?1:0;
					DWREngine.setAsync(false);
                	systemMgm.setShowTab(USERID,_self.showtab,function(flag){
                		if(flag){
                		}else{
                			Ext.Msg.alert('提示','设置失败!')
                		}
                	})
                	DWREngine.setAsync(true);
				},
				render:function(cbox){
					baseDao.findById("com.sgepit.frame.sysman.hbm.RockUser",USERID,function(rku){
						if(rku&&rku.showtab=="1"){
							cbox.setValue(true);
						}else{
							cbox.setValue(false);
						}
					})
				}
			}
		});
		this.tbar = new Ext.Toolbar({
			height:25,
			disabled :true,
			items:[' ', _self.expandBtn,'-', _self.collapseBtn,'-',_self.submitBtn,'->',_self.favCheckBox]
		});
		this.id = (this.id&&this.id!="")?this.id:("rockwin-" + (++Ext.Component.AUTO_ID)),
		this.html = '<iframe id="favid" src="'+BASE_PATH+'jsp/index/fav.jsp?id='+this.id+'" style="width:100%; height:100%" frameborder=no></iframe>';
		this.on('beforehide',function(){
			if(this.tab){
				var index = this.tab.items.length - 1;
				var feedPanel = this.tab.items.get(index).items.get(0);
				feedPanel.buildNodes(feedPanel);
				
			}
		});
		RockWindow.superclass.initComponent.call(this);
	}
});
Ext.reg('rockwindow',RockWindow);
/**
 * 功能操作+常用操作TAB
 * @class WestPanel
 * @extends Ext.Panel
 */
WestPanel=Ext.extend(Ext.Panel ,{
	layout:'fit',
	region: 'west',
	split:true,
	width: 200,
    minSize: 199,
    maxSize: 201,
	collapseMode : 'mini',
	animCollapse : false,
	initComponent: function(){
		this.items=[{
			activeTab:0,
			border: false,
			xtype:'tabpanel',
	        frame:false,
	        shim: false,
			layoutConfig: {animate:false},
	        split: true,
	        width: 200,
	        minSize: 199,
	        maxSize: 201,
			items:[{
				xtype:"panel",
				title:"功能操作",
				layout:"accordion",
			    layoutConfig: {
					//hideCollapseTool:true,
			        titleCollapse: true,//标题单击折叠与显示
			        animate: false,//不显示动画显示
			        activeOnTop: false//不置顶
			    }
			},{
				xtype:"panel",
				title:"常用操作",
				layout:'fit',
				items:[{xtype:'feedpanel'}]
			}],
			listeners:{
				'render':function(tab){
					DWREngine.setAsync(false);//设置显示tab
					baseDao.findById("com.sgepit.frame.sysman.hbm.RockUser",USERID,function(rku){
						if(rku&&rku.showtab=="1"){
							tab.setActiveTab(tab.items.get(1))
						}else{
							tab.setActiveTab(tab.items.get(0))
						}
					});
					DWREngine.setAsync(true);
					//初始化功能菜单/////////
					var funPanel = tab.items.get(0);
					var funArr = naviObjectToArray(naviTopObj);
					for(var i=0;i<funArr.length;i++){
						var rock = funArr[i];
						if(!(rock.iconCls)||rock.iconCls==''){//图标未设置，则显示默认图标
							rock.iconCls = 'icon-config';//默认图标
						}
						funPanel.add({
							xtype:'rockpanel',
							title: rock.title,
							toolPos:'right',//工具显示位置，如果想要在左侧显示toolPos:'left'
							iconCls:rock.iconCls,
							id:rock.id
						});
					};
					//添加tab上的齿轮及单击事件
					var tt = new Ext.Template(
						'<div><a href="#">',
						'<img id="{id}" src="{path}/jsp/res/images/gear.png" border="0" height="16" width="16"  ',
						'title="设置" style="background:none;margin:4px 0 0 33px;"/></a></div>'
					);
					var setBtn = tt.insertAfter(tab.strip.dom.childNodes[tab.items.length-1], {path:g_path,id:"favset"},true);//返回Ext.Element
					setBtn.on('click',function(){
						tab.setActiveTab(tab.items.get(1));
						var rockwin = new RockWindow({tab:tab});
						if ( window.name == 'contentFrame' ){
							rockwin.show();
						}
						else{
							parent.showRockWin(tab);
						}
						
					});
				}//end of render
			}
		}]
		WestPanel.superclass.initComponent.call(this);
	}
});

Ext.reg('westpanel',WestPanel);