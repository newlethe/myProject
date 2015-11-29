var hd, lt, ct, bt, naviTabs, viewport, pwdWindow, helpWindow, configWindow, portletConfigPanel, changeCurrentPIDWin;
var configChanged = false
// var WelcomePageUrl = CONTEXT_PATH + "/jsp/index/portal.jsp";//门户jsp
var WelcomePageUrl = CONTEXT_PATH + '/servlet/SysServlet?ac=loadUserHome';// 上下布局，分为上下（三维、综合查询）
var params = "";
var loadPortalFirst = true;
var portalSecondSt = [{
	id : 'portal',
	title : '首页',
	iconCls : 'icon-portal',
	html : '<div class=powerNode><img src=../res/images/application_side_boxes.png align=absmiddle>&nbsp;<a href='
			+ WelcomePageUrl + ' target=contentFrame>个人工作台</a></div>'
}]
if (loadPortalFirst)
	naviSecondSt = portalSecondSt
var msgPublishPanel;
var userMsgWin;
var taskPanel;
var taskWin;
var proTreeCombo //项目单位选择
var pathButton   //当前位置路径显示BUTTON
var selectedSubSystemId //当前选择的子系统ID
var selectedSubSystemName //当前选择的子系统名称
var selectSubSystemUrl //当前选择的子系统URL
var backToSubSystemBtn //返回子系统首页按钮
var maxWinBtn,minWinBtn
Ext.onReady(function() {
	var fm = Ext.form
	Ext.QuickTips.init();
	
	proTreeCombo = new Ext.ux.TreeCombo({
		resizable:true,
		hidden :true,
		fieldLabel : "当前项目",
		loader:new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:USERBELONGUNITID,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId in ('0','1','2','3','4','5','A')"
			}
		}),
		value:USERBELONGUNITID,
		root:  new Ext.tree.AsyncTreeNode({
	       text: USERBELONGUNITNAME,
	       id: USERBELONGUNITID,
	       expanded:true
	    }),
	    onTreeNodeClick: function(node, e) {
	    	if(node.attributes.unitTypeId==="A"){
		        this.setRawValue(node.text);
		        this.value = node.id;
		        this.fireEvent('select', this, node);
		        this.collapse();
	    	}else{
		        this.collapse();
	    	}
	    }
	});
	var treepanel = this.proTreeCombo.getTree();
	treepanel.on('beforeload',function(node){
		proTreeCombo.loader.baseParams.parentId = node.id;
	});
	proTreeCombo.on("select",function(obj,rec,inx){
		if(obj.getValue()!=CURRENTAPPID){
			commonUtilDwr.changeCurrentAppPid(obj.getValue(), obj.getRawValue(), function() {
				switchoverProj(obj.getValue(),obj.getRawValue());
				window.frames["contentFrame"].location.reload();
			})
		}
	})
	pathButton = new Ext.Button({
		name: 'powerPath',
        text: "<b>"+FUN_NAME+"</b>",
        //iconCls: 'copyUser',
        handler: function(){
        }
	})
	maxWinBtn = new Ext.Button({
		name: 'maxWin',
        //text: "最大化",
        tooltip :  "工作区最大化",
        hidden: false,
        iconCls: 'maxWin',
        handler: function(){
        	hd.collapse()
        	lt.collapse()
        	east.collapse()
        	maxWinBtn.hide();
        	minWinBtn.show();
        }
	})
	minWinBtn = new Ext.Button({
		name: 'minWin',
        //text: "还原",
        tooltip :  "还原工作区",
        hidden : true,
        iconCls: 'minWin',
        handler: function(){
        	hd.expand()
        	lt.expand()
        	//east.expand()
        	maxWinBtn.show();
        	minWinBtn.hide();
        }
	})
	backToSubSystemBtn = new Ext.Button({
		name : 'backToPower',
		text : '返回子系统',
		tooltip :  "返回当前子系统首页",
		iconCls : 'returnTo',
		hidden : true,
		handler : function(){
			loadSubSystem()
		}
	})
	/* 构造各个部分面板 */
	hd = new Ext.Panel({
				region : 'north',
				border : true,
				bodyBorder : false,
				contentEl : "headerDiv",
				split : true,
				minHeight : 101,
				maxHeight : 101,
				collapseMode : 'mini',
				height : 101,
				autoScroll : false
			})

	lt = new Ext.Panel({
				border : false,
				region : 'west',
				shim : false,
				animCollapse : false,
				constrainHeader : true,
				collapsed : loadPortalFirst ? true : false,
				layout : 'accordion',
				layoutConfig : {
					animate : false
				},
				split : true,
				collapseMode : 'mini',
				width : 200
			});

	ct = new Ext.Panel({
				border : true,
				id : 'center',
				region : 'center',
				split : true,
				tbar: new Ext.Toolbar({
					items:[maxWinBtn,minWinBtn,pathButton,'->',proTreeCombo,'-',backToSubSystemBtn]
			    }),
				html : '<iframe name="contentFrame" src="'
						+ WelcomePageUrl
						+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
			});

	bt = new Ext.Panel({
				region : 'south',
				border : false,
				contentEl : "bottomDiv",
				split : false,
				frame : true,
				height : 28
			})

	var feedPanel = new FeedPanel({
	
	});
	feedPanel.on('click', function(node){
		deactivateAllTab();
	});
	
	
	var setFavBtn = new Ext.Toolbar.Button({
		id : 'set-fav',
		iconCls : 'btn',
		text : "设置常用操作",
		handler :function(){
			var favRockWin = new RockWindow(); 
	favRockWin.on('beforehide', function() {
								feedPanel.buildNodes(feedPanel);
							});
			favRockWin.show();
		}
	});
	
	
			
	east = new Ext.Panel({
				id : 'east',
				title:'常用操作',
				region : 'east',
				layout: 'fit',
				collapsible: true,
				collapsed: true,
				split : true,
				width : 200,
				minSize : 199,
				maxSize : 201,
				border : false,
				animCollapse : false,
				tbar : [setFavBtn],
				items : [feedPanel]
			});

	/* 构造页面整体布局 */
	viewport = new Ext.Viewport({
				layout : 'border',
				items : [hd, lt, ct, east]
			});

	// viewport.doLayout();

	/* 处理进度条 */
	setTimeout(function() {
				Ext.get('loading').remove();
				Ext.get('loading-mask').fadeOut({
							remove : true
						});
			}, 250);

	/* 默认值处理,数据加载和交互控制 */

	naviTabs = new Ext.TabPanel({
				renderTo : 'naviHeader',
				width : '100%',
				border : false,
				bodyBorder : false,
				//activeTab : 'portal',
				enableTabScroll : true,
				defaults : {
					autoScroll : true
				},
				bodyStyle : "background-color: transparent",
				defaults : {
					autoHeight : true
				},
				items : naviTopSt
			});
	naviTabs.hideTabStripItem('dummy');
	naviTabs.on('tabchange', function(tab, p) {
			if ( p.id != 'dummy' )
				loadSecondNavi(p.id);
				selectedSubSystemId = p.id
				selectedSubSystemName = p.title
				selectedSubSystemUrl = p.url
				if(selectedSubSystemUrl){
					loadSubSystem()	
				}
			});

	naviTabs.header.dom.style.background = 'transparent'
	naviTabs.strip.dom.style.background = 'transparent'
	naviTabs.stripWrap.dom.style.background = 'transparent'

	/* 待办事项 */
	var FlowTask = Ext.extend(Ext.grid.QueryExcelGridPanel, {
		region : 'center',
		enableColumnMove : false,
		enableColumnHide : false,
		enableDragDrop : false,
		loadMask : true,
		pagesize : 8,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		initComponent : function() {
			var flowColumns = [{
						name : 'logid',
						type : 'string'
					}, {
						name : 'flowid',
						type : 'string'
					}, {
						name : 'insid',
						type : 'string'
					}, {
						name : 'flowtitle',
						type : 'string'
					}, {
						name : 'title',
						type : 'string'
					}, {
						name : 'ftime',
						type : 'date',
						dateFormat : 'Y-m-d H:i:s'
					}, {
						name : 'ftype',
						type : 'string'
					}, {
						name : 'fromnode',
						type : 'string'
					}, {
						name : 'tonode',
						type : 'string'
					}, {
						name : 'notes',
						type : 'string'
					}, {
						name : 'flag',
						type : 'string'
					}, {
						name : 'nodename',
						type : 'string'
					}, {
						name : 'fromname',
						type : 'string'
					}, {
						name : 'toname',
						type : 'string'
					}, {
						name : 'nodeid',
						type : 'string'
					}];
			this.ds = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : "com.sgepit.frame.flow.hbm.TaskView",
							business : "baseMgm",
							method : "findWhereOrderBy",
							params : "tonode='" + USERID + "' and flag=0"
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'logid'
								}, flowColumns),
						remoteSort : true,
						pruneModifiedRecords : true
					});
			this.ds.setDefaultSort('ftime', 'desc');
			this.sm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					});
			this.cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({}), {
						id : 'insid',
						type : 'string',
						header : '流程实例ID',
						dataIndex : 'insid',
						hidden : true,
						width : 100
					}, {
						id : 'flowid',
						type : 'string',
						header : '流程ID',
						dataIndex : 'flowid',
						hidden : true,
						width : 0
					}, {
						id : 'flowtitle',
						type : 'string',
						header : '流程类型',
						dataIndex : 'flowtitle',
						width : 150
					}, {
						id : 'title',
						type : 'string',
						header : '主题',
						dataIndex : 'title',
						renderer : function(value, md, rec, rInx, cInx, ds1) {
							return "<a title=【处理】" + value
									+ " href=javascript:doFlow('"
									+ rec.data.insid + "')>" + value + "</a>"
						},
						width : 320
					}, {
						id : 'ftime',
						type : 'date',
						header : '发送时间',
						dataIndex : 'ftime',
						renderer : function(value) {
							return value ? value.dateFormat('Y-m-d H:i:s') : '';
						},
						// hidden : true,
						width : 140
					}, {
						id : 'fromname',
						type : 'string',
						type : 'string',
						header : '发送人',
						dataIndex : 'fromname',
						// hidden : true,
						width : 60
					}, {
						id : 'nodename',
						type : 'string',
						header : '处理说明',
						dataIndex : 'nodename',
						width : 130
					}]);
			this.cm.defaultSortable = true;
			var _self = this;
			this.bbar = new Ext.PagingToolbar({
						pageSize : _self.pagesize,
						store : _self.ds,
						beforePageText : "第",
						afterPageText : "页  共 {0} 页",
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					});
			this.on('render', function() {
						_self.store.load({
									params : {
										start : 0,
										limit : _self.pagesize
									}
								});
					});
			FlowTask.superclass.initComponent.call(this);
		}
	})
	taskPanel = new FlowTask();

	// 文件发布
	msgPublishPanel = new Ext.Panel({
		html : '<iframe name="userMsgSearchFrame" src="'
				+ CONTEXT_PATH
				+ '/Business/fileAndPublish/search/com.fileSearch.publish.jsp" frameborder="0" style="width:100%;height:100%;"></iframe>'
	});

});

function loadSecondNavi(parentId) {
	for (var i = 0; i < naviSecondSt.length; i++) {
		var o = lt.getComponent(naviSecondSt[i].id)
		if (o != null) {
			lt.remove(o)
		}
	}
	if (parentId == "portal") {
		lt.collapse();
		if (contentFrame.location.href.indexOf(WelcomePageUrl) < 0)
			contentFrame.location.href = WelcomePageUrl
	} else {
		lt.expand();
		systemMgm.getChildRockPowerStr(parentId, function(rtn) {
					naviSecondSt = new Array();
					// var a = window.open('about:blank'); a.document.open();
					// a.document.write(rtn)
					var obj = eval(rtn);
					for (var i = 0; i < obj.length; i++) {
						var tree = obj[i];
						try {
							tree.on("click", function(node) {
										pathButton.setText("<b>当前位置:"+selectedSubSystemName+node.getPath("text")+"</b>")
										if(node.attributes.flowflag=="1"){
											proTreeCombo.show();
											proTreeCombo.setValue(CURRENTAPPID)
 											backToSubSystemBtn.show();
										}else{
											proTreeCombo.hide();
 											backToSubSystemBtn.hide();
										}									
										east.collapse(false);
									});
						} catch (e) {
						}
						naviSecondSt.push(tree);
						lt.add(tree)
					}
					lt.doLayout();
				})
	}
}

function loadSubSystem(){
	lt.collapse()
	proTreeCombo.hide();
    backToSubSystemBtn.hide();
	pathButton.setText("<b>当前位置:"+selectedSubSystemName+"首页</b>")
	var subSystemUrl = "";
	if(selectedSubSystemUrl.indexOf("?")>-1){
		subSystemUrl = selectedSubSystemUrl + "&modid="+selectedSubSystemId;
	}else{
		subSystemUrl = selectedSubSystemUrl + "?modid="+selectedSubSystemId;
	}
	window.frames["contentFrame"].location.href = CONTEXT_PATH +"/"+ subSystemUrl+""
}


// 切换功能标签页
function openSecondNaviTab(rockId) {
	var funTab = naviTabs.findById(rockId);
	if (funTab) {
		naviTabs.activate(funTab);
	}
}

function logout() {
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function modifyPwd() {
	if (!pwdWindow) {
		pwdWindow = new Ext.Window({
			title : '修改口令',
			iconCls : 'icon-modify-key',
			html : "<iframe id='tree' scrolling='no' align='center' src='../system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
			closeAction : 'hide',
			modal : true,
			plain : true,
			closable : true,
			border : true,
			maximizable : false,
			width : 500,
			height : 400
		});
	}
	pwdWindow.show();
}

function showHelp() {
	if (!helpWindow) {
		helpWindow = new Ext.Window({
					title : '帮助',
					iconCls : 'icon-sys-help',
					closeAction : 'hide',
					modal : true,
					plain : true,
					closable : true,
					border : true,
					maximizable : true,
					width : 800,
					height : 600,
					layout : 'fit',
					items : [new Ext.TabPanel({
								border : false,
								bodyBorder : false,
								activeTab : 0,
								enableTabScroll : true,
								defaults : {
									autoScroll : true
								},
								items : [{
											title : '使用须知',
											bodyStyle : {
												padding : "10,10,10,10"
											},
											autoLoad : '../system/sys.user.readme.html'
										}, {
											title : '帮助手册',
											// html: '<iframe
											// src="../system/sys.office.template.show.jsp?templateCode=SystemHelp&readOnly=true"
											// width=100% height=100%
											// frameborder=0></iframe>'
											html : '从"下载插件"中下载按说明进行插件的安装。'
										}]
							})]
				});
	}
	helpWindow.show();
}

function portalConfig() {
	if (!configWindow) {
		configWindow = new Ext.Window({
					title : '首页设置',
					iconCls : 'icon-sys-config',
					closeAction : 'hide',
					modal : true,
					plain : true,
					closable : true,
					border : true,
					maximizable : true,
					width : 460,
					height : 300,
					layout : 'fit',
					items : [portletConfigPanel],
					listeners : {
						hide : afterPortletConfig
					}
				});
		configWindow.show();
		portletConfigPanel.getStore().load();
	} else {
		configWindow.show();
	}
}

function afterPortletConfig() {
	if (configChanged) {
		configChanged = false
		window.frames["contentFrame"].location.href = WelcomePageUrl
	}
}

function collapsedWestAndNorth() {
	lt.collapse()
	hd.collapse()
	// east.collapse()
};
function expandWestAndNorth() {
	lt.expand()
	hd.expand()
}

/*--  切换项目  --*/
function changeCurrentPID() {
	var pidDataArr = new Array();
	var pidArr = USERPIDS.split(",");
	if (pidArr.length > 1) {
		if (!changeCurrentPIDWin) {
			changeCurrentPIDWin = new Ext.Window({
				title : '切换项目',
				iconCls : 'icon-modify-key',
				html : "<iframe id='changepid' scrolling='no' align='center' src='../index/pid.change.jsp' width='100%' height='100%'></iframe>",
				closeAction : 'hide',
				modal : true,
				plain : true,
				closable : true,
				border : true,
				maximizable : false,
				width : 500,
				height : 400
			});
		}
		changeCurrentPIDWin.show();
	} else {
		document.getElementById("changePid").title = CURRENTAPPNAME;
		return false;
	}
}

function changePnameFun(pname) {
	document.getElementById("changePid").innerHTML = pname;
	var pidDataArr = new Array();
	var pidArr = parent.USERPIDS.split(",");
	if (pidArr.length > 1) {
		document.getElementById("changePid").title = pname + "【切换项目】"
	} else {
		document.getElementById("changePid").title = pname;
	}
}

function showMsgWin() {
	if (!userMsgWin) {
		userMsgWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 780,
					height : 355,
					title : '信息发布查询',
					modal : true,
					maximizable : true,
					closeAction : 'hide',
					plain : true,
					items : [msgPublishPanel]
				});
	}

	userMsgWin.show();
	return userMsgWin;
}

function showTaskWin() {
	if (!taskWin) {
		taskWin = new Ext.Window({
					header : false,
					layout : 'fit',
					width : 780,
					height : 300,
					title : '待办事项',
					modal : true,
					maximizable : true,
					closeAction : 'hide',
					plain : true,
					items : [taskPanel]
				});
	}

	taskWin.show();
}

function formatDateTime(value) {
	return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
};
function doFlow(flowInstantId) {
	if (taskWin) {
		taskWin.hide();
	}
	deactivateAllTab();
	window.frames["contentFrame"].location.href = CONTEXT_PATH
			+ "/jsp/flow/flw.main.frame.jsp?flowInstantId=" + flowInstantId;

}

//选中隐藏标签，让所有可见标签处于未激活状态
function deactivateAllTab(){
	naviTabs.activate('dummy');
}
