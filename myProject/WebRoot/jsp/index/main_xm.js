var hd,west,ct,bt,viewport,pwdWindow,helpWindow,configWindow,portletConfigPanel, changeCurrentPIDWin;
var configChanged = false
var WelcomePageUrl = CONTEXT_PATH + "/jsp/index/portal2.jsp";//门户jsp
var headerUrl = CONTEXT_PATH + "/jsp/index/header.jsp";
var leftUrl = CONTEXT_PATH + "/jsp/index/left.jsp";
var params = "";
var loadPortalFirst = true;
var portalSecondSt = [{ id:'portal', title: '首页',iconCls:'icon-portal',
         	html:'<div class=powerNode><img src=../res/images/application_side_boxes.png align=absmiddle>&nbsp;<a href='+ WelcomePageUrl + ' target=contentFrame>个人工作台</a></div>'
         }]
if (loadPortalFirst)
	naviSecondSt = portalSecondSt
var i=100;
Ext.onReady(function(){
	var fm = Ext.form
    Ext.QuickTips.init();
	/*	构造各个部分面板	*/
	hd = new Ext.Panel({
		region: 'north',
		border: false,
		bodyBorder: false,
		html : "<iframe name='headerFrame' src='" + headerUrl + "' frameborder=0 style='width:100%;height:100%;' scrolling='no'></iframe>",
		split: false,
		collapseMode : 'mini',
		animCollapse : false,
		height: 81,
		autoScroll: false
	})
	
	
	ct = new Ext.Panel({
        border: false,
        id: 'center',
        region: 'center',
        split: true,
        html: "<iframe name='contentFrame' src='" + WelcomePageUrl + "?" + params+"' frameborder=0 style='width:100%;height:100%;' scrolling='no'></iframe>"
	});
	
	bt = new Ext.Panel({
		region: 'south',
		border: false,
		contentEl: "bottomDiv",
		split: false,
		frame: true,
		height: 28
	})
//	west = new WestPanel({//define in FeedPanel.js
//		region: 'west',
//		collapseMode : 'mini',
//		split: true,
//		width: 200,
//	    minSize: 199,
//	    maxSize: 201
//	});
//	
	west = new Ext.Panel({
        border: false,
        id: 'west',
        region: 'west',
        animCollapse : false,
        width: 206,
	    maxSize: 206,
        html: "<iframe name='leftFrame' src='" + leftUrl + "' frameborder=0 style='width:100%;height:100%;' scrolling='no' ></iframe>"
	});

	
	/*	构造页面整体布局	*/
	viewport = new Ext.Viewport({
        layout:'border',
		items:[hd, ct, bt,west]
    });
    //loadInfo()//读取消息中心
    //loadInfoGrid()//读取待办事项 
    //loadFlowOk()//读取流程完成，附件移交
    //viewport.doLayout();
	
	/*	处理进度条	*/
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);

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
	});
	
});

function logout(){
	window.location.href = CONTEXT_PATH + "/servlet/SysServlet?ac=logout";
}

function modifyPwd(){
	if (!pwdWindow){
		pwdWindow = new Ext.Window({
			title: '修改口令', iconCls: 'icon-modify-key',
			html: "<iframe id='tree' scrolling='no' align='center' src='../system/sys.password.setting.jsp' width='100%' height='100%'></iframe>",
			closeAction: 'hide', modal: true, plain: true, 
			closable: true, border: true, maximizable: false,
			width: 500, height: 400
		});
	}
	pwdWindow.show();
}

function showHelp(){
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
						autoLoad: '../system/sys.user.readme.html'
					},{
						title: '帮助手册',
						html: '<iframe src="../system/sys.office.template.show.jsp?templateCode=SystemHelp&readOnly=true" width=100% height=100% frameborder=0></iframe>'
					}]
				})
			]
		});
	}
	helpWindow.show();	
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
		var where ="fromnode='"+USERID+"' and ftype like '%A' and status='2'";
		var sql="select distinct title from ("+
				"(select title from Ins_File_Info_View a ,(select insid,fromnode,title  from task_view where "+where+" ) b where a.insid=b.insid  and a.userid = b.fromnode and a.ismove='0')"+
				"union "+
				"(select title from Flw_Adjunct_Ins a ,(select insid,title from task_view where "+where+") b where a.insid =b.insid and a.ismove='0' ))";
		var str="";
		baseDao.getDataAutoCloseSes(sql,function(list){
			for(var i=0;i<list.length;i++){
				str+="["+list[i]+"] ,";
			}
		if(list.length>0){
			Ext.MessageBox.confirm("已处理流程有未移交资料附件","如下已处理流程主题为： "+str+" 未移交资料附件，确认移交?",
		    function(btn){
		           if(btn == "yes"){
		                window.frames["contentFrame"].location.href=CONTEXT_PATH+"/jsp/flow/flw.ins.flowed.jsp"
		             }
		           else{
		              return;
		           }
		  });
		}	
			
		})
		DWREngine.setAsync(true);
	},3000)
};
function collapsedWestAndNorth(){
	west.collapse();
	hd.collapse();
	//east.collapse()
};
function expandWestAndNorth(){
	west.expand();
	hd.expand();
}

function openFun(rockId){
	window.frames['leftFrame'].openFun(rockId);
}

function showRockWin(tab){
	var rockWin = new RockWindow({tab:tab});
	rockWin.show();
}

function changeCurrentPID(){
	var pidDataArr = new Array();
	var pidArr = USERPIDS.split(",");
	if(pidArr.length>1) {
		if (!changeCurrentPIDWin){
			changeCurrentPIDWin = new Ext.Window({
				title: '切换项目', iconCls: 'icon-modify-key',
				html: "<iframe id='changepid' scrolling='no' align='center' src='../index/pid.change.jsp' width='100%' height='100%'></iframe>",
				closeAction: 'hide', modal: true, plain: true, 
				closable: true, border: true, maximizable: false,
				width: 500, height: 400
			});
		}
		changeCurrentPIDWin.show();	
	} else {
		window.frames["headerFrame"].document.getElementById("changePid").title = CURRENTAPPNAME;
		return false;
	}
}