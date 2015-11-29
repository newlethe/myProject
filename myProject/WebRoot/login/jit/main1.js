var hd, lt, ct, bt, naviTabs, viewport, pwdWindow, helpWindow, configWindow, portletConfigPanel, changeCurrentPIDWin;
var configChanged = false

var naviMenus;//新版导航

var WelcomePageUrl = CONTEXT_PATH + '/servlet/SysServlet?ac=loadUserHome';// 上下布局，分为上下（三维、综合查询）
var params = "";
var loadPortalFirst = false;
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
var tabPublishUploadPanel;
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
var array_prjs=new Array();
//左边的导航栏是否需要隐藏：（如果有汇总页面配置，隐藏左边导航栏；如果是加载二级导航的第一个功能点，则无需隐藏左边导航栏）
var ltCollapsed = true;

var indexChangeMonth ;	//综合查询首页月份切换下拉框
var dsCombo_yearMonth;
var unitCombo;
var unitComboText
var yearMonthText ;
var MonthBoxCollapse ;
var unitComboDataArr = new Array();

var ct_tool;
var CT_TOOL_DISPLAY
var wanyuan;
Ext.onReady(function() {
	var fm = Ext.form
	Ext.QuickTips.init();
	//-----------------
		
		var dsCombo_prjs=new Ext.data.SimpleStore({
		    fields: ['k', 'v'],   
		    data: [['','']]
		});
		var bean2="com.sgepit.frame.sysman.hbm.SgccIniUnit";
		DWREngine.setAsync(false);
		systemMgm.getPidsByUnitid(USERBELONGUNITID,function(list){   
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i].unitid);
				temp.push(list[i].unitname);
				array_prjs.push(temp);			
			}
	    }); 
	    DWREngine.setAsync(true);
	    dsCombo_prjs.loadData(array_prjs);
		proTreeCombo=new Ext.form.ComboBox({
			hidden :true,
			anchor : '95%',
			width:200,
			listWidth:300,
			store:dsCombo_prjs,
        	displayField:'v',
       		valueField:'k',
        	typeAhead: true,
        	editable:false,
       		mode: 'local',
        	lazyRender:true,
        	triggerAction: 'all',
        	emptyText:"",
       		selectOnFocus:true
		});
		
		proTreeCombo.on("select",function(obj,rec,inx){
		if(obj.getValue()!=CURRENTAPPID){
			commonUtilDwr.changeCurrentAppPid(rec.get('k'), rec.get('v'), function() {
				switchoverProj(rec.get('k'), rec.get('v'));
				window.frames["contentFrame"].location.reload();
			})
		}
	})
	//-----------------------
		//新兴能源首页添加公司层面下拉框，供选择之后回到非新兴能源首页
	DWREngine.setAsync(false);
		baseDao.getData("select unitid,unitname from SGCC_INI_UNIT where UPUNIT = '1' and (UNIT_TYPE_ID in ('0','2', 'A')) order by view_order_num asc",function(list){
			for(i = 0; i < list.length; i++) {
				var temp = new Array();	
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				unitComboDataArr.push(temp);			
			}
	    }); 
	    DWREngine.setAsync(true);
    unitComboData=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: unitComboDataArr
	});
	unitCombo = new Ext.form.ComboBox({
		typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		hidden : true,
		width:280,
		lazyRender : true,
		store : unitComboData,
		valueField : 'k',
		displayField : 'v',
		emptyText:"请选择...",
		editable:false,
		listeners:{
   			'select':function(combo,record){
				   var unitid = unitCombo.getValue();
				   var unitname = unitCombo.getRawValue();
				   if(unitid =='103')
				   return;
				   var url = BASE_PATH+"PCBusiness/zhxx/query/pc.zhxx.projinfo.index.jsp?unitid="+unitid+"&unitname="+unitname;
				   parent.frames["contentFrame"].location.href = url;
		 	 }
		 }
	})     

	unitComboText = new Ext.Button({
		text : '单位：',
		hidden : true
	});
    unitCombo.on('beforequery',function(){
		  unitComboCollapse = document.getElementById('contentFrame');
		  if(unitComboCollapse){
				unitComboCollapse.onfocus = function(){
					if(unitCombo.list)
						unitCombo.list.hide();
				};
			}
	});
//结束下拉框相关操作
	yearMonthText = new Ext.Button({
		text : '年月：',
		hidden : true
	});
	dsCombo_yearMonth=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: ''
	});
	
	indexChangeMonth = new Ext.form.ComboBox({
		typeAhead : true,
		triggerAction : 'all',
		mode : 'local',
		hidden : true,
		lazyRender : true,
		store : dsCombo_yearMonth,
		valueField : 'k',
		displayField : 'v',
		emptyText:"默认当前年月",
		editable:false,
		width : 100,
		listeners:{
   			'select':function(combo,record){
   				var sj = record.get('k');
   				var url = CONTEXT_PATH+'/PCBusiness/zhxx/index/pc.zhxx.pro.index.jsp?unitid='+USERBELONGUNITID+'&sjType='+sj;
   				parent.frames["contentFrame"].location.href = url;
			}
		}
	});
	indexChangeMonth.on('beforequery',function(){
		MonthBoxCollapse = document.getElementById('contentFrame');
		if(MonthBoxCollapse){
			MonthBoxCollapse.onfocus = function(){
				if(indexChangeMonth.list)
					indexChangeMonth.list.hide();
			};
		}
	});
	//-----------------------
	pathButton = new Ext.Button({
		name: 'powerPath',
        //text: "<b>"+FUN_NAME+"</b>",
        text : '',
        hidden : false,
        handler: function(){
        }
	})
	maxWinBtn = new Ext.Button({
		name: 'maxWin',
        //text: "最大化",
        tooltip :  "工作区最大化",
        hidden: true,
        iconCls: 'maxWin',
        handler: function(){
        	hd.collapse()
        	//lt.collapse()
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
			ltCollapsed = true;
			loadSubSystem()
		}
	})
    
    wanyuan = new Ext.Button({
        name: 'wanyuan',
        text: "<font color=#15428b><b>单位：万元</b></font>"
    })
    
	/* 构造各个部分面板 */
	hd = new Ext.Panel({
				region : 'north',
				border : true,
				bodyBorder : false,
				contentEl : "headerDiv",
				collapseMode : 'mini',
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
                hidden : true,
				width : 200
			});
            
    ct_tool = new Ext.Toolbar({
            autoShow : true,
				items : [unitComboText, unitCombo, pathButton, '->',
						proTreeCombo, backToSubSystemBtn, yearMonthText,
						indexChangeMonth,wanyuan]
			});
            
	ct = new Ext.Panel({
				border : false,
                bodyBorder : false,
				id : 'center',
				region : 'center',
				split : true,
				tbar: ct_tool,
				html : '<iframe name="contentFrame" src="'
						+ "#"
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
				//tbar : [setFavBtn],
				items : [feedPanel]
			});

	/* 构造页面整体布局 */
	viewport = new Ext.Viewport({
				layout : 'border',
				items : [hd, {
						region : 'center',
				    	border:false,
						layout:'border',
						items:[{
							region : 'north',
							xtype:'panel',
					    	border:false,
							contentEl : "naviHeader"
						},{
							region : 'center',
					    	border : false,
					    	layout:'border',
					    	items:[lt, ct]
						}]
					}/*, east*/
				]
			});
	//ct.getTopToolbar().el.dom.setAttribute("title","双击工作区最大化或取消最大化");
	/*ct.getTopToolbar().el.dom.ondblclick = function(){
		try{
	    	if(hd.collapsed){
	    		hd.expand();
	            lt.expand();
	    	}else{
	    	 	hd.collapse();
	            //lt.collapse();
	    	}
    	}catch(e){}
	}*/
	// viewport.doLayout();
    
    CT_TOOL_DISPLAY = function(bool){
	    //ct_tool.el.parent().dom.style.display = bool == true ? 'block':'none';
        
        pathButton.setVisible(bool)
        proTreeCombo.setVisible(bool)
        backToSubSystemBtn.setVisible(bool)
        wanyuan.setVisible(!bool);
    };

	/* 处理进度条 */
	setTimeout(function() {
				Ext.get('loading').remove();
				Ext.get('loading-mask').fadeOut({
							remove : true
						});
			}, 250);

	/* 默认值处理,数据加载和交互控制 */

	naviTabs = new Ext.TabPanel({
				//renderTo : 'naviHeader',
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
	if(selectId!=""){
		var p = Ext.getCmp(selectId);
		selectedSubSystemId = p.id
		selectedSubSystemName = p.title
		selectedSubSystemUrl = p.url
		loadSecondNavi(p.id);
		//naviTabs.setActiveTab(p);
		ltCollapsed = true;
		loadSubSystem()
	}
//	naviTabs.hideTabStripItem('dummy');
//	naviTabs.mon(naviTabs.strip,'click',function(){
//		if(selectedSubSystemUrl && selectedSubSystemUrl.length>0){
//			ltCollapsed = true;
//			loadSubSystem()	
//		} else {
//			//加载子系统的第一个功能点，作为子系统首页；
//			systemMgm.getFirstPowerFromSubSystem(selectedSubSystemId,USERID,function(dat){
//				if(dat != null){
//					selectedSubSystemUrl = dat.url;
//					ltCollapsed = false;
//					loadSubSystem();
//					var o = lt.getComponent(naviSecondSt[0].id);
//					o.getNodeById(dat.powerpk).select();
//				}
//			})
//		}
//		
//	},naviTabs)
//	naviTabs.on('tabchange', function(tab, p) {
//			if ( p.id != 'dummy' )
//				loadSecondNavi(p.id);
//				selectedSubSystemId = p.id
//				selectedSubSystemName = p.title
//				selectedSubSystemUrl = p.url
//				/*if(selectedSubSystemUrl){
//					loadSubSystem()	
//				}*/
//			});
//
//	naviTabs.header.dom.style.background = 'transparent'
//	naviTabs.strip.dom.style.background = 'transparent'
//	naviTabs.stripWrap.dom.style.background = 'transparent'
    //去掉了查询首页二级菜单，将功能地址直接放到一级菜单
	if(naviMenusObject&&naviMenusObject[0]&&naviMenusObject[0].handler){
        //调整综合信息管理模块的查询首页的连接
        naviMenusObject[0].handler = function() {
            if(USERBELONGUNITTYPEID=="0"){//集团公司用户首页
                window.frames["contentFrame"].location.href = CONTEXT_PATH + "/PCBusiness/zhxx/baseInfoInput/welcomePage.jsp"
            }
            if(USERBELONGUNITID=="103"){//新兴能源用户
                window.frames["contentFrame"].location.href = CONTEXT_PATH + "/PCBusiness/zhxx/index/pc.zhxx.pro.index.jsp";
            }
		}
    }
    
    
    var tbarMenus = new Ext.Toolbar({
        bodyStyle : "background: transparent",
        items : naviMenusObject
    });
    
    naviMenus = new Ext.Panel({
        renderTo : 'naviHeader',
        width : '100%',
        border : false,
        bodyBorder : false,
        tbar : tbarMenus
    });
    

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
});

function loadSecondNavi(parentId) {
	for (var i = 0; i < naviSecondSt.length; i++) {
		var o = lt.getComponent(naviSecondSt[i].id)
		if (o != null) {
			lt.remove(o)
		}
	}
	if (parentId == "portal") {
		//lt.collapse();
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
										switch(node.attributes.ifalone){
											//0：不显示，1：只显示返回子系统按钮，2：只显示项目选择框，3：两者均显示';
											case "0":
												proTreeCombo.hide();
 												backToSubSystemBtn.hide();
												break;
											case "1":
												proTreeCombo.hide();
												backToSubSystemBtn.show();
												break;
											case "2":
												proTreeCombo.show();
												proTreeCombo.setValue(CURRENTAPPID)
												backToSubSystemBtn.hide();
												break;
											case "3":
												proTreeCombo.show();
												proTreeCombo.setValue(CURRENTAPPID)
	 											backToSubSystemBtn.show();
												break;
											default:
												proTreeCombo.hide();
 												backToSubSystemBtn.hide();
 												break;
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
	if(ltCollapsed) {
		lt.collapse();
	}
	proTreeCombo.hide();
    backToSubSystemBtn.hide();
	//pathButton.setText("<b>欢迎进入"+selectedSubSystemName+"首页</b>")
	var subSystemUrl = "";
	backToSubSystemBtn.setText("返回子系统");
	if(selectedSubSystemUrl.indexOf("?")>-1){
        selectedSubSystemUrl= "/servlet/SysServlet?ac=loadmodule";
		subSystemUrl = selectedSubSystemUrl + "&modid="+selectedSubSystemId;
	}else{
		subSystemUrl = selectedSubSystemUrl + "?modid="+selectedSubSystemId;
	}
	window.frames["contentFrame"].location.href = CONTEXT_PATH +"/"+ subSystemUrl+""
	//bug0001996: 所有子系统存在的问题：左侧功能树中的功能模块没有及时刷新 
	try{
		for(var i=0;i<lt.items.length;i++){
			if(lt.items.get(i).getXType()=="treepanel"){
				lt.items.get(i).getSelectionModel().clearSelections();
			}
		}
	}catch(e){}
}


// 切换功能标签页
function openSecondNaviTab(rockId) {
	var funTab = naviTabs.findById(rockId);
	if (funTab) {
		naviTabs.activate(funTab);
		selectedSubSystemId = funTab.id
		selectedSubSystemName = funTab.title
		selectedSubSystemUrl = funTab.url
		if(selectedSubSystemUrl){
			ltCollapsed = true;
			loadSubSystem()	
		}
	}
}

function logout() {
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function tohome(){
    window.location.reload();
}

function modifyPwd() {
	if (!pwdWindow) {
		pwdWindow = new Ext.Window({
			title : '修改口令',
			iconCls : 'icon-modify-key',
			html : "<iframe id='tree' scrolling='no' align='center' src='../../jsp/system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
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
	if(Ext.isIE){
		var url = BASE_PATH+"help/index.html";
		var sFeatures = "toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		var sFeatures = "top=0,left=0,toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		window.open(url,"_blank",sFeatures);
	}else{
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
													//padding : "10,10,10,10"
												},
												//autoLoad : '../../jsp/system/sys.user.readme.html'
												 html: '<iframe name="helps" src="../../jsp/system/sys.user.readme.html" width=100% height=100% frameborder=0></iframe>'
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
	//lt.collapse()
	hd.collapse()
	// east.collapse()
};
function expandWestAndNorth() {
	if(lt.items.length>0){
		lt.expand()
		hd.expand()
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
	   var publishCount=0;
	   var uploadCount=0;
	   	var publishUrl='';
	   	var uploadUrl='';
		DWREngine.setAsync(false);
            ComFileManageDWR.getModuleUrlByUserId('发布消息提醒', USERID, function(url) {
            	if(url){
            		publishUrl=CONTEXT_PATH+"/"+url;
            		var rootId=getRootId(url);
 					ComFileManageDWR.getUnreadMsgNumPublish(USERID, USERDEPTID,rootId,function(retVal){
						if(retVal){
							publishCount=retVal;
						}
					});           		
            	}else{
            		publishCount=0;
            	}
             });   
            ComFileManageDWR.getModuleUrlByUserId('上报消息提醒', USERID, function(url) {
            	if(url){
            		uploadUrl=CONTEXT_PATH+"/"+url;            		
            		var rootId=getRootId(url);
					ComFileManageDWR.getUnreadMsgNumUpload(USERID, USERDEPTID,rootId,function(retVal){
						if(retVal){
						uploadCount=retVal;
					}
				});	            		
            	}else{
            		uploadCount=0;
            	}
             });             	
		DWREngine.setAsync(false);
		  
		
	// 文件发布
	msgPublishPanel = new Ext.Panel({
		collapsible : true,
		title:"信息发布查询"+"("+publishCount+")",
		html : '<iframe name="userMsgSearchPublishFrame" src="'+publishUrl+'"   frameborder="0" style="width:100%;height:100%;"></iframe>'
	});	
	
	
	// 文件上报
	msgUploadPanel = new Ext.Panel({
		collapsible : true,
		title:"信息上报查询"+"("+uploadCount+")",
		html : '<iframe name="userMsgSearchUploadFrame" src="'+uploadUrl+'"  frameborder="0" style="width:100%;height:100%;"></iframe>'
	});	
	tabPublishUploadPanel= new Ext.TabPanel({
		height : 450,
		tabWidth:135,
		enableTabScroll : false,
		resizeTabs : true,
		activeTab : 0,  
		bodyStyle : 'text-align:left', 
		items : [ 
		msgPublishPanel,
		msgUploadPanel
	]
	});

	userMsgWin = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 920,
				height : 450,
				title : '信息查询',
				modal : true,
				maximizable : true,
				//closeAction : 'hide',
				plain : true,
				items : [tabPublishUploadPanel]
			});

	userMsgWin.show();
	return userMsgWin;
}
//解析url得到rootid的值
function getRootId(url){
	var params="";
	var array=url.split("?");
    if(array.length>1){
    	var paramArr = array[1].split("&");
    	for (i=0; i<paramArr.length; i++) {
    		if(paramArr[i].indexOf("rootId=")==0) {
    			params = (paramArr[i].split("="))[1];
    		}
    	}
    }
    return params;
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

    function loadMenusModule(indexModid,powerid,powername,query){
        if(query == 1){
            selectedSubSystemId = powerid;
        }else{
            proTreeCombo.show();
            backToSubSystemBtn.show();
            
            CT_TOOL_DISPLAY(true);
            pathButton.setText('<font color=#15428b><b>&nbsp;' + powername+ '</b></font>');
        }
        selectedSubSystemId = indexModid;
        proTreeCombo.setValue(CURRENTAPPID);
        window.frames["contentFrame"].location.href = CONTEXT_PATH +"/servlet/SysServlet?ac=loadmodule&modid="+powerid;
        selectedSubSystemUrl = "/servlet/SysServlet?ac=loadmodule";
    }
