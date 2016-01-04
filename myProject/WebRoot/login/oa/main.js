var btn,helpWindow,pwdWindow,msgPublishPanel,userMsgWin,taskPanel,taskWin;
//var WelcomePageUrl = CONTEXT_PATH + '/PCBusiness/zhxx/index/pc.zhxx.pro.item.index.guofeng.jsp';
var WelcomePageUrl = CONTEXT_PATH + '/servlet/SysServlet?ac=loadUserHome';
var naviSecondSt = new Array();
var loadPortalFirst = false;
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
        text: CURRENTAPPNAME,
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
				collapsed : true,
				collapseMode : 'mini',
				width : 160
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
				html : '<iframe name="contentFrame" src="'+ WelcomePageUrl+ '" frameborder="0" style="width:100%;height:100%;"></iframe>'
			}); 
		viewport = new Ext.Viewport({
				layout : 'border',
				items : [hd, lt, ct]
			});  
//			loadEquUrge()//设备催交提醒
	function onItemClick(item){
		if(item.id!=CURRENTAPPID) {
			commonUtilDwr.changeCurrentAppPid(item.id, item.text, function() {
				CURRENTAPPID = item.id;
				CURRENTAPPNAME = item.text;
				btn.setText(CURRENTAPPNAME);
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
		DWREngine.setAsync(false);
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
										/*
										pathButton.setText("<b>当前位置:"+selectedSubSystemName+node.getPath("text")+"</b>")
										if(node.attributes.flowflag=="1"){
											proTreeCombo.show();
											proTreeCombo.setValue(CURRENTAPPID)
 											backToSubSystemBtn.show();
										}else{
											proTreeCombo.hide();
 											backToSubSystemBtn.hide();
										}									
										east.collapse(false);*/
									});
						} catch (e) {
						}
						naviSecondSt.push(tree);
						lt.add(tree)
					}
					lt.doLayout();
				})
		DWREngine.setAsync(true);
	}
}	
function loadHomePage(){
	window.frames["contentFrame"].location.href = WelcomePageUrl
	lt.collapse()
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

//function loadFlowOk(){
//	setTimeout(function(){
//		DWREngine.setAsync(false);
//		var urge = loadEquUrge();
//		if(!urge) urge = "";
//		var str = "资料移交提醒：<br/><br/>";
//		var sql="SELECT DISTINCT TITLE FROM INS_FILE_ADJUNCT_INFO_VIEW WHERE FROMNODE='"+USERID+"' AND ISMOVE='0' AND STATUS='2'";
//   	    //Ext.log(sql);
//		baseDao.getDataAutoCloseSes(sql,function(list){
//			for(var i=0;i<list.length&&i<20;i++){
//				str+="&nbsp;&nbsp;&nbsp;&nbsp;["+list[i]+"]<br/>";
//			}
//			if(list.length>20){
//				str+="&nbsp... ... <br/><br/>共{"+list.length+"}条已处理流程对应的资料未移交，确认移交?"
//			}else{
//				str+="<br/>已处理流程对应的资料未移交，确认移交?"
//			} 
//			if(list.length>0){
//				if(urge != "")urge += "<br/><br/><hr style='height:2px;width:380px;'/><br/>"
//				Ext.Msg.show({
//				   //title:'标题为',
//				   msg: urge+str,
//				   closable:false,
//				   buttons: Ext.Msg.YESNO ,
//				   fn: function(btn){
//			           if(btn == "yes"){
//			                window.frames["contentFrame"].location.href=CONTEXT_PATH+"/jsp/flow/flw.ins.manager.jsp?tab=1"
//			           }
//			           else{
//			              return;
//			           }
//				   }
//				});
//			}else if(list.length==0){
//				if(urge != ""){
//					Ext.Msg.show({
//					   //title:'催交信息提醒',
//					   msg: urge,
//					   closable:false,
//					   buttons: Ext.Msg.YESNO ,
//					   fn: function(btn){
//				           if(btn == "yes"){
//				                window.frames["contentFrame"].location.href = CONTEXT_PATH
//										+ "/Business/equipment/equMgm/equ.goods.urge.jsp?remind=true"
//				           }else{
//				              return;
//				           }
//					   }
//					});
//				}
//			}
//		})
//		DWREngine.setAsync(true);
//	},300)
//};
//查询设备催交提醒
//function loadEquUrge(){
//	DWREngine.setAsync(false);
//	/*var _sql = "select t.* from equ_goods_urge_reming_log t where t.userid='"+USERID+"' and t.remind_time=to_date('"+SYS_DATE_STR+"','YYYY-MM-DD')";
//	var hasRemind = false;
//	baseDao.getDataAutoCloseSes(_sql,function(list){
//		if(list!=null && list.length > 0) hasRemind = true;
//	});
//	//if(hasRemind == true)return;*/
//	var rtn = "";
//	var str="催交信息提醒：<br/><br/>";
//	var sql="select distinct j.uids,j.conno,j.conname,j.jz_name,j.sb_name " +
//			" from EQU_GOODS_URGE_VIEW j,equ_goods_urge_remind r " +
//			" where j.remind_date <= to_date('"+SYS_DATE_STR+"','YYYY-MM-DD') " +
//			" and j.uids = r.jz_date_id and j.finished = '0' " +
//			" and r.userid = '"+USERID+"' order by j.uids";
//	baseDao.getDataAutoCloseSes(sql,function(list){
//		if(list.length < 1)return;
//		for(var i=0;i<list.length&&i<20;i++){
//			str+="&nbsp;&nbsp;&nbsp;&nbsp;【"+list[i][1]+" "+list[i][2]+"】中 【"+list[i][3]+" - "+list[i][4]+"】<br/>";
//		}
//		if(list.length>20){
//			str+="&nbsp... ... <br/><br/>已经到了设置的提醒时间，请对该设备的催交情况进行处理！";
//		}else{
//			str+="<br/>已经到了设置的提醒时间，请对该设备的催交情况进行处理！";
//		}
//		for(var i=0;i<list.length;i++){
//			var sql = "insert into EQU_GOODS_URGE_REMING_LOG " +
//					"values('"+CURRENTAPPID+"','"+USERID+"',to_date('"+SYS_DATE_STR+"','YYYY-MM-DD'),'"+list[i][0]+"')"
//			db2Json.execute(sql,function(b){});
//		}
//		if(list.length>0){
//			rtn = str;
//			Ext.Msg.show({
//			   title:'催交信息提醒',
//			   msg: str,
//			   closable:false,
//			   buttons: Ext.Msg.YESNO ,
//			   fn: function(btn){
//		           if(btn == "yes"){
//		                window.frames["contentFrame"].location.href = CONTEXT_PATH
//								+ "/Business/equipment/equMgm/equ.goods.urge.jsp?remind=true"
//		           }else{
//		              return;
//		           }
//			   }
//			});
//		}else if(list.length==0){
//			rtn = "";
//		}
//	});
//	DWREngine.setAsync(true);
//	return rtn;
//}