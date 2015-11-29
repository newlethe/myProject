var hd,lt,ct,bt,naviTabs,viewport,pwdWindow,helpWindow,configWindow,portletConfigPanel
var configChanged = false
//var WelcomePageUrl = CONTEXT_PATH + "/jsp/index/portal.jsp";//门户jsp
var WelcomePageUrl ="portal/portal.jsp";//上下布局，分为上下（三维、综合查询）
var params = "";
var loadPortalFirst = true;
var portalSecondSt = [{ id:'portal', title: '首页',iconCls:'icon-portal',
         	html:'<div class=powerNode><img src=images/application_side_boxes.png align=absmiddle>&nbsp;<a href='+ WelcomePageUrl + ' target=contentFrame>个人工作台</a></div>'
         }]
if (loadPortalFirst)   
	naviSecondSt = portalSecondSt

Ext.onReady(function(){
	var fm = Ext.form
    Ext.QuickTips.init();
	/*	构造各个部分面板	*/
	hd = new Ext.Panel({
		region: 'north',
		border: true,
		bodyBorder: false,
		contentEl: "headerDiv",
		split: true,
		minHeight: 104,
		maxHeight: 104,
		collapseMode : 'mini',
		height: 104,
		autoScroll: false
	})
	
	lt = new Ext.Panel({
		border: false,
        region: 'west',
        shim: false,
		animCollapse:false,
		constrainHeader:true,
		collapsed: loadPortalFirst?true:false,
		layout:'accordion',
		layoutConfig: {
			animate:false
        },
        split: true,
        collapseMode : 'mini',
        width: 200
	});
	
	ct = new Ext.Panel({
        border: true,
        id: 'center',
        region: 'center',
        split: true,
        html: "<iframe name=contentFrame  src='" + WelcomePageUrl + "?" + params+"' frameborder=0 style='width:100%;height:100%;'></iframe>"
	});
	
	ct.on('resize', function(p, adjWidth, adjHeight, rawWidth, rawHeight ){
		if(window.frames["contentFrame"] && window.frames["contentFrame"].reSizePanel) {
			if(window.frames["contentFrame"].location.href.indexOf(WelcomePageUrl)>-1) {
				window.frames["contentFrame"].reSizePanel(adjHeight);
			}
		}
	})
	
	bt = new Ext.Panel({
		region: 'south',
		border: false,
		contentEl: "bottomDiv",
		split: false,
		frame: true,
		height: 28
	})
	
	/*	构造页面整体布局	*/
	viewport = new Ext.Viewport({
        layout:'border',
		//items:[hd, lt, ct, bt,east]
		items:[hd, lt, ct]
    });
    //loadInfo()//读取消息中心
    //loadInfoGrid()//读取待办事项 
    loadFlowOk()//读取流程完成，附件移交
    //viewport.doLayout();
    
    //loadEquUrge();
	
	/*	处理进度条	*/
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);

	/*	默认值处理,数据加载和交互控制		*/
	
	naviTabs = new Ext.TabPanel({
        renderTo: 'naviHeader',
        width: '100%',
        border: false,
        bodyBorder: false,
        activeTab: 0,
        enableTabScroll:true,
        defaults: {autoScroll:true},
        bodyStyle: "background-color: transparent",
        defaults:{autoHeight: true},
        items:naviTopSt
    });
    
    naviTabs.on('tabchange', function(tab, p){
    	loadSecondNavi(p.id)
    })
    naviTabs.header.dom.style.background='transparent'
    naviTabs.strip.dom.style.background='transparent'
    naviTabs.stripWrap.dom.style.background='transparent'
    loadSecondNavi("portal");
    
    
    
    /* portlet config */

	var fc = { // 创建编辑域配置
		'configId' : {
			name : 'configId',
			fieldLabel : 'configId',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'userId' : {
			name : 'userId',
			fieldLabel : 'userId',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'portletId' : {
			name : 'portletId',
			fieldLabel : 'Portlet',
			allowBlank : false,
			anchor : '95%'
		},
		'portletName' : {
			name : 'portletName',
			fieldLabel : 'portletName',
			allowBlank : false,
			anchor : '95%'
		},
		'colIdx' : {
			name : 'colIdx',
			fieldLabel : '列',
			allowNegative : false,
			maxValue : 3,
			allowDecimals : false,
			anchor : '95%'
		},
		'rowIdx' : {
			name : 'rowIdx',
			fieldLabel : '行',
			allowNegative : false,
			maxValue : 10,
			allowDecimals : false,
			anchor : '95%'
		},
		'ph' : {
			name : 'ph',
			fieldLabel : '高度',
			allowNegative : false,
			maxValue : 1000,
			allowDecimals : false,
			anchor : '95%'
		},
		'show' : {
			name : 'show',
			fieldLabel : '是否显示',
			anchor : '95%'
		}
	}

	var Columns = [{
		name : 'configId',
		type : 'string'
	},{
		name : 'userId',
		type : 'string'
	}, {
		name : 'portletId',
		type : 'string'
	}, {
		name : 'portletName',
		type : 'string'
	}, {
		name : 'colIdx',
		type : 'int'
	}, {
		name : 'rowIdx',
		type : 'int'
	}, {
		name : 'ph',
		type : 'int'
	}, {
		name : 'show',
		type : 'bool'
	}];
	var checkColumn = new Ext.grid.CheckColumn({
		id: 'show',
		header : fc['show'].fieldLabel,
		dataIndex : fc['show'].name,
		width: 90
	})
	var sm = new Ext.grid.CheckboxSelectionModel()

	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'configId',
		header : fc['configId'].fieldLabel,
		dataIndex : fc['configId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'userId',
		header : fc['userId'].fieldLabel,
		dataIndex : fc['userId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'portletId',
		header : fc['portletId'].fieldLabel,
		dataIndex : fc['portletId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'portletName',
		header : fc['portletName'].fieldLabel,
		dataIndex : fc['portletName'].name,
		width : 100,
		readOnly : true
	}, {
		id : 'colIdx',
		align : 'right',
		header : fc['colIdx'].fieldLabel,
		dataIndex : fc['colIdx'].name,
		width : 60,
		editor : new fm.NumberField(fc['colIdx'])
	}, {
		id : 'rowIdx',
		align : 'right',
		header : fc['rowIdx'].fieldLabel,
		dataIndex : fc['rowIdx'].name,
		width : 60,
		editor : new fm.NumberField(fc['rowIdx'])
	}, {
		id : 'ph',
		align : 'right',
		header : fc['ph'].fieldLabel,
		dataIndex : fc['ph'].name,
		width : 60,
		editor : new fm.NumberField(fc['ph'])
	},checkColumn])
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams : {
			userid : USERID,
			ac : "getUserPortletConfig"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : SYS_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'rows',
			totalProperty : 'results',
			id : "configId"
		}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	portletConfigPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'portlet-config-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		title : false,
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		plugins: checkColumn,
		header : false,
		autoScroll : true,
		loadMask : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
//		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
//			pageSize : 20,
//			store : ds,
//			displayInfo : true,
//			displayMsg : ' {0} - {1} / {2}',
//			emptyMsg : "无记录。"
//		}),
		
		servletUrl : MAIN_SERVLET,
		bean : "com.sgepit.frame.sysman.hbm.SysPortletConfig",
		addBtn: false,
		delBtn: false,
		business : "systemMgm",
		primaryKey : "configId",
		saveMethod : 'updatePortletConfig'
	});
	
	portletConfigPanel.on("aftersave", function(){
		configChanged = true;
	})
})



function loadSecondNavi(parentId){
	for(var i=0; i<naviSecondSt.length; i++){
		var o = lt.getComponent(naviSecondSt[i].id)
		if (o!=null){
			lt.remove(o)
		}
	}
	if (parentId == "portal") {
		lt.collapse();
		if (contentFrame.location.href.indexOf(WelcomePageUrl)<0)
		contentFrame.location.href = WelcomePageUrl
	} else {
		DWREngine.setAsync(false);
		lt.expand();
		systemMgm.getChildRockPowerStr(parentId, function(rtn){
			if ( rtn == 'null' ){
				window.location.href = CONTEXT_PATH;
				return;
			}
			naviSecondSt = new Array();
			var obj = eval(rtn);
			for(var i=0; i<obj.length; i++){
				var tree=obj[i];
				try{
/*					tree.on("click",function(){
						east.collapse(false);
					});*/
				}catch(e){}
				naviSecondSt.push(tree);
				lt.add(tree)
			}
			lt.doLayout();
		})
		DWREngine.setAsync(true);
	}
}

function logout(){	
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function modifyPwd(){
	var passUrl=CONTEXT_PATH + "/jsp/system/sys.password.setting.jsp";
	if (!pwdWindow){
		pwdWindow = new Ext.Window({
			title: '修改口令', iconCls: 'icon-modify-key',
			html: "<iframe id='tree' scrolling='no' align='center' src='"+passUrl+"' width='100%' height='100%'></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: false,  
			width: 500, height: 400
		});
	}
	pwdWindow.show();
}

function showHelp(){
	if(Ext.isIE){
		//使用统一的帮助页面
		var url = BASE_PATH+"help/index.html";
		var sFeatures = "toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		var sFeatures = "top=0,left=0,toolbar=no,resizable=yes,height="+screen.availHeight+",width="+screen.availWidth
		window.open(url,"_blank",sFeatures);
	}else{
		if (!helpWindow){
			helpWindow = new Ext.Window({
				title: '帮助', iconCls: 'icon-sys-help',
				closeAction: 'hide', modal: true, plain: true, 
				closable: true, border: true, maximizable: true,
				width: 800, height: 600,layout: 'fit',
				items:[
					new Ext.TabPanel({
				 		border: false,
				        bodyBorder: false,
				        activeTab: 0,
				        enableTabScroll:true,
				        defaults: {autoScroll: true},
						items:[{
							title: '使用须知',
							bodyStyle: {padding:"10,10,10,10"},
							autoLoad: 'sys.user.readme.html'
						},{
							title: '帮助手册',
							//html: '<iframe src="../system/sys.office.template.show.jsp?templateCode=SystemHelp&readOnly=true" width=100% height=100% frameborder=0></iframe>'
							html: '从"下载插件"中下载按说明进行插件的安装。'
						}]
					})
				]
			});
		}
		helpWindow.show();
	}
}

function portalConfig(){
	if (!configWindow){
		configWindow = new Ext.Window({
			title: '首页设置', iconCls: 'icon-sys-config',
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: true,
			width: 460, height: 300,layout: 'fit',
			items:[
				portletConfigPanel
			],
			listeners: {
				hide: afterPortletConfig
			}
		});
		configWindow.show();
		portletConfigPanel.getStore().load();
	} else {
		configWindow.show();
	}
}

function afterPortletConfig(){
	if (configChanged) {
		configChanged = false
		window.frames["contentFrame"].location.href = WelcomePageUrl
	}
}

function loadFlowOk(){
	setTimeout(function(){
		DWREngine.setAsync(false);
		var urge = loadEquUrge();
		if(!urge) urge = "";
		var str = "资料移交提醒：<br/><br/>";
		var sql="SELECT DISTINCT TITLE FROM INS_FILE_ADJUNCT_INFO_VIEW WHERE FROMNODE='"+USERID+"' AND ISMOVE='0' AND STATUS='2'";
   	    //Ext.log(sql);
		baseDao.getDataAutoCloseSes(sql,function(list){
			for(var i=0;i<list.length&&i<20;i++){
				str+="&nbsp;&nbsp;&nbsp;&nbsp;["+list[i]+"]<br/>";
			}
			if(list.length>20){
				str+="&nbsp... ... <br/><br/>共{"+list.length+"}条已处理流程对应的资料未移交，确认移交?"
			}else{
				str+="<br/>已处理流程对应的资料未移交，确认移交?"
			} 
			if(list.length>0){
				if(urge != "")urge += "<br/><br/><hr style='height:2px;width:380px;'/><br/>"
				Ext.Msg.show({
				   //title:'标题为',
				   msg: urge+str,
				   closable:false,
				   buttons: Ext.Msg.YESNO ,
				   fn: function(btn){
			           if(btn == "yes"){
			                window.frames["contentFrame"].location.href=CONTEXT_PATH+"/jsp/flow/flw.ins.manager.jsp?tab=1"
			           }
			           else{
			              return;
			           }
				   }
				});
			}else if(list.length==0){
				if(urge != ""){
					Ext.Msg.show({
					   //title:'催交信息提醒',
					   msg: urge,
					   closable:false,
					   buttons: Ext.Msg.YESNO ,
					   fn: function(btn){
				           if(btn == "yes"){
				                window.frames["contentFrame"].location.href = CONTEXT_PATH
										+ "/Business/equipment/equMgm/equ.goods.urge.jsp?remind=true"
				           }else{
				              return;
				           }
					   }
					});
				}
			}
		})
		DWREngine.setAsync(true);
	},300)
};
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

//查询设备催交提醒
function loadEquUrge(){
	DWREngine.setAsync(false);
	var _sql = "select t.* from equ_goods_urge_reming_log t where t.userid='"+USERID+"' and t.remind_time=to_date('"+SYS_DATE_STR+"','YYYY-MM-DD')";
	var hasRemind = false;
	baseDao.getDataAutoCloseSes(_sql,function(list){
		if(list!=null && list.length > 0) hasRemind = true;
	});
	if(hasRemind == true)return;
	var rtn = "";
	var str="催交信息提醒：<br/><br/>";
	var sql="select distinct j.uids,j.conno,j.conname,j.jz_name,j.sb_name " +
			" from EQU_GOODS_URGE_VIEW j,equ_goods_urge_remind r " +
			" where j.remind_date <= to_date('"+SYS_DATE_STR+"','YYYY-MM-DD') " +
			" and j.uids = r.jz_date_id and j.finished = '0' " +
			" and r.userid = '"+USERID+"' order by j.uids";
	baseDao.getDataAutoCloseSes(sql,function(list){
		for(var i=0;i<list.length&&i<20;i++){
			str+="&nbsp;&nbsp;&nbsp;&nbsp;【"+list[i][1]+" "+list[i][2]+"】中 【"+list[i][3]+" - "+list[i][4]+"】<br/>";
		}
		if(list.length>20){
			str+="&nbsp... ... <br/><br/>已经到了设置的提醒时间，请对该设备的催交情况进行处理！";
		}else{
			str+="<br/>已经到了设置的提醒时间，请对该设备的催交情况进行处理！";
		}
		for(var i=0;i<list.length;i++){
			var sql = "insert into EQU_GOODS_URGE_REMING_LOG " +
					"values('"+CURRENTAPPID+"','"+USERID+"',to_date('"+SYS_DATE_STR+"','YYYY-MM-DD'),'"+list[i][0]+"')"
			db2Json.execute(sql,function(b){});
		}
		if(list.length>0){
			rtn = str;
			/*
			Ext.Msg.show({
			   title:'催交信息提醒',
			   msg: str,
			   closable:false,
			   buttons: Ext.Msg.YESNO ,
			   fn: function(btn){
		           if(btn == "yes"){
		                window.frames["contentFrame"].location.href = CONTEXT_PATH
								+ "/Business/equipment/equMgm/equ.goods.urge.jsp?remind=true"
		           }else{
		              return;
		           }
			   }
			});
			*/
		}else if(list.length==""){
			rtn = "";
		}
	});
	DWREngine.setAsync(true);
	return rtn;
}
