var btn,helpWindow,pwdWindow,msgPublishPanel,userMsgWin,taskPanel,taskWin;
var WelcomePageUrl = CONTEXT_PATH + '/servlet/SysServlet?ac=loadUserHome';
var leftUrl = CONTEXT_PATH + "/login/gj/left.jsp";
var naviSecondSt = new Array();
var IS_SHOW_WINDOW = false;
//var oldSelectSubSys="homePage",newSelectSubSys
Ext.onReady(function(){
   var tb = new Ext.Toolbar({
    	cls: "toolbar-c"
    });
    //tb.render('menu1');
    
    var menu = new Ext.menu.Menu({
        id: 'mainMenu'
	});
	
	btn = new Ext.Toolbar.Button({
		tooltip: "切换项目",
		tooltipType: 'title',
		iconCls: 'current-c',
        text: "<font size='4px'>" + CURRENTAPPNAME + "</font>",
        menu: menu  // assign menu by instance
	});
	//tb.add(btn);
    
	var pidArr = USERPIDS.split(",");
	var pNameArr = USERPNAMES.split(",");
	for (i=0; i<pidArr.length; i++) {
		var iconClsTemp = "pid-no-check";
		var itemTextCls = "proTextCss-no-check"
		var menuText = pNameArr[i]
		if(pidArr[i]==CURRENTAPPID){
			iconClsTemp = "pid-check";
			itemTextCls = "proTextCss-check"
		}
		var menuItem = new Ext.menu.Item({id: pidArr[i], text: menuText, iconCls: iconClsTemp, handler: onItemClick,cls:itemTextCls,ctCls:itemTextCls});
		menu.add(menuItem);
	}
  hd = new Ext.Panel({
				region : 'north',
				border : true,
				bodyBorder : false,
				contentEl : "top",
				split : true,
				minHeight : 101,
				maxHeight : 101,
				collapseMode : 'mini',
				height : 101,
				autoScroll : false,
				listeners:{
					beforecollapse : function(){
						Ext.get("pidList").setVisible(false);
					},
					expand :function(){
						Ext.get("pidList").setVisible(true);
					}
				}
			})
	 lt = new Ext.Panel({
				border : false,
				region : 'west',
				shim : false,
				animCollapse : false,
				constrainHeader : true,
				layout : 'accordion',
				layoutConfig : {
					animate : false
				},
				split : true,
				collapseMode : 'mini',
				width : 200,
				html : "<iframe name='leftFrame' src='"
					+ leftUrl
					+ "' frameborder='0' style='width:100%;height:100%;' scrolling='no' ></iframe>"
			});
   ct = new Ext.Panel({
				border : true,
				id : 'center',
				region : 'center',
				split : true,
				/*
				tbar: new Ext.Toolbar({
					items:[]
			    }),*/
				html : '<iframe name="contentFrame" src="'
						+ WelcomePageUrl
						+ '" frameborder="0" style="width:100%;height:100%;z-index:-10008;"></iframe>'
			});
			
		viewport = new Ext.Viewport({
				layout : 'border',
				items : [hd, lt, ct]
			});     
	function onItemClick(item){
		if(item.id!=CURRENTAPPID) {
			commonUtilDwr.changeCurrentAppPid(item.id, item.text, function() {
				CURRENTAPPID = item.id;
				CURRENTAPPNAME = item.text;
				btn.setText("<font size='4px'>" + CURRENTAPPNAME + "</font>");
				var itemArr = menu.items;
				for(var i=0; i<itemArr.length; i++) {
					var itemTemp = itemArr.itemAt(i);
					if(itemTemp.id == item.id) {
						//itemTemp.setText("<b>" + item.text + "</b>");
						itemTemp.setText(item.text);
						itemTemp.removeClass();						
						itemTemp.addClass("proTextCss-check");
						itemTemp.setIconClass("pid-check");
					}
					if(itemTemp.id != item.id){
						itemTemp.setIconClass("pid-no-check");
						itemTemp.removeClass();
						itemTemp.addClass("proTextCss-no-check");
						itemTemp.setText(itemTemp.text);
						//itemTemp.setText(itemTemp.text.substring(3, itemTemp.text.length-4));
					}
				}
				window.frames["contentFrame"].location.reload();
			});
		}
  	}
  	naviTabs = new Ext.TabPanel({
				renderTo : 'naviHeader',
				width : '100%',
				border : false,
				bodyBorder : false,
				activeTab : 0,
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
	naviTabs.on('tabchange', function(tab, p) {
	if ( p.id != 'homePage' ){
			loadSecondNavi(p.id);
		}else{
			loadHomePage();
		}
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

	// 文件发布
	msgPublishPanel = new Ext.Panel({
		html : '<iframe name="userMsgSearchFrame" src="'
				+ CONTEXT_PATH
				+ '/Business/fileAndPublish/search/com.fileSearch.publish.jsp" frameborder="0" style="width:100%;height:100%;"></iframe>'
	});
});	

function loadSecondNavi(parentId, parentUrl) {
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
		DWREngine.setAsync(false);
		systemMgm.getChildRockPowerStr(parentId, function(rtn) {
			naviSecondSt = new Array();
			var obj = eval(rtn);
			for (var i = 0; i < obj.length; i++) {
				var tree = obj[i];
				firstModulePk = obj[0].id;
				try {
					tree.on("click", function(node) {
							});
				} catch (e) {
				}
				naviSecondSt.push(tree);
				lt.add(tree)
			}
		});
		DWREngine.setAsync(true);
		lt.doLayout();
		var o = lt.getComponent(naviSecondSt[0].id);
		var childNodes = o.getRootNode();
		loadFirstModule(childNodes);
	}
}


function loadFirstModule(v_node) {
	var childNodes = v_node.childNodes;
	if(childNodes && childNodes.length>0) {
		loadFirstModule(childNodes[0]);
	} else {
		v_node.select();
		parent.frames["contentFrame"].location.href = CONTEXT_PATH +"/servlet/SysServlet?ac=loadmodule&modid="+v_node.id;
	}
}

function loadHomePage(){
	for (var i = 0; i < naviSecondSt.length; i++) {
		var o = lt.getComponent(naviSecondSt[i].id)
		if (o != null) {
			lt.remove(o)
		}
	}
	window.frames["contentFrame"].location.href = WelcomePageUrl
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
	window.frames["contentFrame"].location.href = CONTEXT_PATH
			+ "/jsp/flow/flw.main.frame.jsp?flowInstantId=" + flowInstantId;

}
function openSecondNaviTab(funId){
	loadSecondNavi(funId)
}

//流程处理页面展开/还原面板操作；
function collapsedWestAndNorth(){
	lt.collapse()
	hd.collapse()
};
function expandWestAndNorth(){
	if(lt.items.length>0){
		lt.expand()
		hd.expand()
	}
}
//用户登陆右下角消息提示框
DWREngine.setAsync(false);
appMgm.getCodeValue("登录提示",function(list){
	IS_SHOW_WINDOW = list.length == 1 && list[0].propertyCode == 1 ? true : false;
});
DWREngine.setAsync(true);
function loginTipsShow(){
    var loginUids = "";
    var sql = "select to_char(t.thistime,'YYYY-MM-DD HH24:MI:SS') thistime, t.thisip, T.UIDS, T.HASALERT " +
            "from rock_user_login_log t " +
            "WHERE t.userid = '"+USERID+"' ORDER BY t.thistime DESC";
    var str=""   
    DWREngine.setAsync(false);
    baseDao.getData(sql,function(list){
        if(list.length > 0 && list[0][3]=="0"){
	        str += "本次登陆IP："+(list.length>0 ? list[0][1] : "无")+"<br>";
	        str += "本次登陆时间："+(list.length>0 ? list[0][0] : "无")+"<br><br>";
			str += "上次登陆IP："+(list.length>1 ? list[1][1] : "无")+"<br>";
			str += "上次登陆时间："+(list.length>1 ? list[1][0] : "无")+"";
	        loginUids = list[0][2];
        }
    });
    DWREngine.setAsync(true);
    
    if(loginUids!="" && loginUids.length>0){
        //消息提示框
	    new Ext.ux.Notification({
	        iconCls: 'orangeUser',
	        title: '登陆提示',
	        html: str,
	        autoDestroy: true,
	        bodyStyle : 'padding:5px;line-height:160%;font-size:12px;',
	        hideDelay:  5000
	    }).show(document);
	    DWREngine.setAsync(false);
	    baseDao.updateBySQL("update rock_user_login_log set hasalert='1' " +
                "where uids='"+loginUids+"'",function(list){
	        
	    });
	    DWREngine.setAsync(true);
    }
}
if(IS_SHOW_WINDOW == true){
	setTimeout(loginTipsShow,2000);
}
