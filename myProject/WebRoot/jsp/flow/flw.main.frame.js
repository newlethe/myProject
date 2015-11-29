var logWin, fileWindow, moduleWindow, adjunctWindow, sendFilesWindow;
var notesTip, docMenu, menuBtn, printDocBtn, msgItem;
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var insDataBean = "com.sgepit.frame.flow.hbm.InsDataInfoView";
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";

Ext.onReady(function(){
	var tabPanel = new Ext.TabPanel({
		activeTab: 0,
		deferredRender: true,
		height: 240,
		minSize: 100,
		maxSize: 460,
		plain: true,
		border: false,
		region: 'center',
		forceFit: true,
		items: [{
			title: '待办事项',
			iconCls: 'title',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=task',
				text: 'Loading...'
			}
		},{
			title: '已处理流程',
			iconCls: 'option',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=worked',
				text: 'Loading...'
			}
		},{
			title: '本人发起流程',
			iconCls: 'returnTo',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=action',
				text: 'Loading...'
			}
		},{
			title: '处理完毕流程',
			iconCls: 'finish',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=finish',
				text: 'Loading...'
			}
		}]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [tabPanel]
	});
});

var cm = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer({
		width: 20
	}),{
		id: 'logid',
		header: '流转日志ID',
		dataIndex: 'logid',
		hidden: true
	},{
		id: 'insid',
		header: '流程实例ID',
		dataIndex: 'insid',
		hidden: true
	},{
		id: 'ftime',
		header: '发送时间',
		dataIndex: 'ftime',
		width: 140,
		renderer: function formatDate(value){
	        return value ? value.dateFormat('Y-m-d H:i:s') : '';
	    }
	},{
		id: 'ftype',
		header: '处理类型',
		dataIndex: 'ftype',
		hidden: true,
		renderer: function(value){
			for (var i = 0; i < F_TYPE.length; i++) {
				if (F_TYPE[i][0] == value) return F_TYPE[i][1];
			}
		}
	},{
		id: 'fromname',
		header: '发送人',
		dataIndex: 'fromname',
		width: 80
	},{
		id: 'notes',
		header: '发送人意见',//'签署意见',
		dataIndex: 'notes',
		width: 300,
		renderer: function(value,c,r){
			var tempFtype=r.get('ftype');
			var str="";
			if(tempFtype=="T"||tempFtype=="7T"||tempFtype=="TA"){
				str+='<font color=red>【退回】</font>'+value
			}else{
				str+=value;
			}
			if (str.length > 50) return str.substring(0, 50)+'.....详细'
			return str;
		}
	},{
		id: 'tonode',
		header: '受理人',
		dataIndex: 'toname',
		width: 80
	},{
		id: 'nodename',
		header: '处理说明',
		dataIndex: 'nodename',
		width: 150
	},{
		id: 'flag',
		header: '状态',
		dataIndex: 'flag',
		width: 80,
		renderer: function(value){ return ('0' == value || '-1' == value ? '未完成' : '完成'); }
	},{
		id: 'nodeid',
		header: '节点ID',
		dataIndex: 'nodeid',
		hidden: true
	}
]);
cm.defaultSortable = true;

var Columns = [
	{name: 'logid', type: 'string'},
	{name: 'insid', type: 'string'},
	{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'ftype', type: 'string'},
	{name: 'fromname', type: 'string'},
	{name: 'notes', type: 'string'},
	{name: 'toname', type: 'string'},
	{name: 'flag', type: 'string'},
	{name: 'nodename', type: 'string'},
	{name: 'nodeid', type: 'string'}
];

var ds = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: 'com.sgepit.frame.flow.hbm.TaskView',
		business: 'baseMgm',
		method: 'findWhereOrderBy'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'logid'
	}, Columns),
	remoteSort: true,
	pruneModifiedRecords: true
});
ds.setDefaultSort('ftime', 'asc');

var logGrid = new Ext.grid.GridPanel({
	ds: ds,
	cm: cm,
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	}/*,
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: ds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    })*/
});

logGrid.on('cellclick', function(grid, rowIndex, columnIndex, e){
	if ("6" == columnIndex){
		if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
		notesTip.add({
			id: 'notes_id', 
			html: grid.getStore().getAt(rowIndex).get('notes')
		});
		point = e.getXY();
		notesTip.showAt([point[0], point[1]]);
	}

});

//查看流转日志
var showLogWin = function(_insid, _insTitle){
	if (!logWin) {
		logWin = new Ext.Window({
			title: '流转日志',
			iconCls: 'refresh',
			layout: 'fit',
			width: 850, height: 400,
			modal: true,
			closeAction: 'hide', resizable: false,
			maximizable: false, plain: true,
			items: [logGrid]
		});
	}
	logWin.setTitle('主题为：【'+decodeURIComponent(encodeURIComponent(_insTitle))+'】 - 流转日志');
	ds.baseParams.params = "insid = '" + _insid + "' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'";
//	ds.load({
//		params: {
//			start: 0,
//			limit: PAGE_SIZE
//		}
//	});
    ds.load();
	logWin.show();
	notesTip = new Ext.ToolTip({
		title: '签署意见',
		width: 200,
		target: logGrid.getEl()
	});
}

//查看流程文档
var showFlowFile = function(_insid, _title){
	if(!fileWindow){
		docMenu = new Ext.menu.Menu({
		    id: 'mainMenu',
		    items: ['-'],
			listeners: {
				beforeshow: function(menu){displayOCX(false);},
				beforehide: function(menu){displayOCX(true);}
			}
		});
		
		menuBtn = new Ext.Button({
			text: '打开本流程文档',
			iconCls: 'bmenu',
			menu: docMenu
		});
		
		printDocBtn = new Ext.Button({
			text: '打印',
			iconCls: 'print',
			handler: function(){
				if (TANGER_OCX_bDocOpen){
					TANGER_OCX_PrintDoc();
				} else {
					Ext.example.msg('提示', '请先打开文档！');
				}
			}
		});
		
		closeBtn = new Ext.Button({
			text:'关闭窗口',
			iconCls:'remove',
			handler:function(){
				fileWindow.hide();
			}
		})
		
		fileWindow = new Ext.Window({	               
			title: '查看流程文档',
			iconCls: 'form',
			tbar: [menuBtn,'-',printDocBtn,'-',closeBtn],
			width: 900,
			height: 512,
            draggable : false,
			modal: true,
			closeAction: 'hide',
			maximizable: false,
            resizable: false,
			plain: true,	
			//autoScroll: true,              
			contentEl: TANGER_OCX
		});
	}
	
	fileWindow.on('hide', function(){
        displayOCX(false);
		if(TANGER_OCX_OBJ)
			TANGER_OCX_OBJ.Close();
	});
	
	fileWindow.setTitle('查看['+decodeURIComponent(encodeURIComponent(_title))+'] - 流程文档');
	
	var filterFile=" filedate in( select filedate from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
				
	baseDao.findByWhere2(insfileBean, "insid='"+_insid+"'and "+filterFile, function(list){
		if (list.length > 0){
			docMenu.removeAll();
			for (var i = 0; i < list.length; i++) {
				docMenu.addItem(
					new Ext.menu.Item({
						text: list[i].filename,
						iconCls: 'word',
						value: list[i],
						handler: function(){
							var _file = this.value;
							//displayOCX(true);
							//TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
							openFlwFile(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
                            TANGER_OCX_SetReadOnly(true);
							document.getElementById('TANGER_OCX').height='499'
						}
					})
				);
			}
			menuBtn.setDisabled(false);
		} else { 
			menuBtn.setDisabled(true);
		}
	});
	fileWindow.show();
}
//附件
var cmAdjunct = new Ext.grid.ColumnModel([
	new Ext.grid.RowNumberer({
		width: 20
	}), {
		id: 'insid',
		header: '实例ID',
		dataIndex: 'insid',
		hidden: true
	},{
		id: 'ismove',
		header: '是否移交',
		dataIndex: 'ismove',
		hidden: true
	},{
		id: 'filename',
		header: '文件名称',
		dataIndex: 'filename',
		width: 150
	},{
		id: 'filedate',
		header: '创建时间',
		dataIndex: 'filedate',
		width: 80,
		renderer: function(value){
			return value ? value.dateFormat('Y-m-d H:i:s') : '';
		}
	}, {
		id: 'fileid',
		header: '下载',
		align: 'center',
		dataIndex: 'fileid',
		width: 50,
		renderer: function(value){
			return "<center><a href='"+BASE_PATH+"servlet/FlwServlet?ac=loadAdjunct&fileid="+value+"'>"
					+"<img src='"+BASE_PATH+"jsp/res/images/shared/icons/page_copy.png'></img></a></center>";
		}
	}
]);

var ColumnsAdjunct = [
	{name: 'fileid', type: 'string'},
	{name: 'insid', type: 'string'},
	{name: 'ismove', type: 'string'},
	{name: 'filename', type: 'string'},
	{name: 'filedate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
];

var dsAdjunct = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: adjunctBean,
		business: 'baseMgm',
		method: 'findWhereOrderBy'
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'fileid'
	}, ColumnsAdjunct),
	remoteSort: true,
	pruneModifiedRecords: true
});

var gridAdjunct = new Ext.grid.GridPanel({
	ds: dsAdjunct,
	cm: cmAdjunct,
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	collapsible: true,
	animCollapse: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	}
});
// 查看流程附件
var showFlowAdjunct = function (_insid, _title){
	adjunctWindow = new Ext.Window({	               
		title: '查看流程附件',
		iconCls: 'copyUser',
		width: 650,
		height: 300,
		modal: true, layout: 'fit',
		closeAction: 'hide',
		maximizable: false,
		resizable: false,
		plain: true,
		items: [gridAdjunct]
	});
	adjunctWindow.setTitle('查看['+decodeURIComponent(encodeURIComponent(_title))+'] - 流程附件');
	adjunctWindow.show();
	//流程实例【附件】加载
	dsAdjunct.baseParams.params = "insid='"+_insid+"'";
	dsAdjunct.load();
}

//查看流程关联的业务数据
var showModule = function(_insid, _title){
	moduleWindow = new Ext.Window({	               
		title: '查看流程业务数据',
		iconCls: 'title',
		tbar: ['-'],
		width: 800,
		height: 512,
		modal: true,
		closeAction: 'hide',
		maximizable: false,
		resizable: false,
		plain: true
	});
	
	moduleWindow.setTitle('查看['+decodeURIComponent(encodeURIComponent(_title))+'] - 流程业务数据');
	
	moduleWindow.show();
	
	baseDao.findByWhere2(insDataBean, "insid='"+_insid+"'", function(list){
		if (list.length > 0){
			for (var i = 0; i < list.length; i++) {
				if (i != 0) moduleWindow.getTopToolbar().add('-');
				moduleWindow.getTopToolbar().add({
					text: list[i].funname,
					iconCls: 'btn',
					value: list[i],
					handler: function(){
						var _data = this.value;
						moduleWindow.load({
							url: BASE_PATH + 'jsp/flow/queryDispatcher.jsp',
							params: 'params='+_data.paramvalues+'&url='+_data.url+'&funname='+_data.funname
									+'&business='+_data.businessname+'&method='+_data.methodname+'&table='+_data.tablename+'&insid='+_insid,
							text: '<b>Loading...</b>'
						});
					}
				})
			}
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=green><<<请选择要打开的业务数据</color>'});
		} else {
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=red>没有可查看的业务数据</color>'});
		}
		moduleWindow.getTopToolbar().add(msgItem);
	});
}

//查看抄送文件和附件
var showSendFiles = function(_insid, _title, _logid){
	if(!sendFilesWindow){
		docMenu = new Ext.menu.Menu({
		    id: 'mainMenu',
		    items: ['-'],
			listeners: {
				beforeshow: function(menu){displayOCX(false);},
				beforehide: function(menu){displayOCX(true);}
			}
		});
		
		menuBtn = new Ext.Button({
			text: '打开本流程文档',
			iconCls: 'bmenu',
			menu: docMenu
		});
		
		printDocBtn = new Ext.Button({
			text: '打印',
			iconCls: 'print',
			handler: function(){
				if (TANGER_OCX_bDocOpen){
					TANGER_OCX_PrintDoc();
				} else {
					Ext.example.msg('提示', '请先打开文档！');
				}
			}
		});
		
		sendFilesWindow = new Ext.Window({	               
			title: '流程文档/附件',
			iconCls: 'form',
			width: 900,
			height: 512,
			modal: true,
			layout: 'fit',
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,
			items: [
				new Ext.TabPanel({
					id: 'file-tab-panel',
					activeTab: 0,
			        deferredRender: false,
			        split: true,
			        plain: true,
			        border: false,
			        forceFit: true,
			        items:[{
						id: 'file',
						title: '流程文件',
						layout: 'fit',
						items: [{
							tbar: [menuBtn,'-',printDocBtn],
							border: false,
							contentEl: TANGER_OCX
						}]
					},{
						id: 'adjunct',
						title: '附件',
						layout: 'fit',
						items: [gridAdjunct]
					}],
					listeners: {
						tabchange: function(tPanel, tab){
							if (tab.getId() == 'adjunct'){
								dsAdjunct.baseParams.params = "insid='"+_insid+"'";
								dsAdjunct.load();
							}
						}
					}
				})
			],
			bbar: ['->',{
				id: 'finish_send',
				text: '查阅完毕', 
				iconCls: 'finish'
			}]
		});
	}
	
	sendFilesWindow.on('hide', function(){
		if(TANGER_OCX_OBJ)
			TANGER_OCX_OBJ.Close();
	});
	
	sendFilesWindow.setTitle('传阅['+decodeURIComponent(encodeURIComponent(_title))+'] - 流程文档/附件');
	
	baseDao.findByWhere2(insfileBean, "insid='"+_insid+"'", function(list){
		if (list.length > 0){
			docMenu.removeAll();
			for (var i = 0; i < list.length; i++) {
				docMenu.addItem(
					new Ext.menu.Item({
						text: list[i].filename,
						iconCls: 'word',
						value: list[i],
						handler: function(){
							var _file = this.value;
							displayOCX(true);
							TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
							TANGER_OCX_SetReadOnly(true);
							document.getElementById('TANGER_OCX').height='499'
						}
					})
				);
			}
			menuBtn.setDisabled(false);
		} else { 
			menuBtn.setDisabled(true);
		}
	});
	sendFilesWindow.show();
	
	Ext.getCmp('finish_send').setHandler(function(){
		flwLogMgm.finishSendFileLog(_logid, function(flag){
			window.location.reload();
		});
	});
} 
//资料移交
function showRemoveFiles(_insid,_title,_store){
	if(!window["removewin"]||!(window["removewin"].show)){
		window["removewin"] = new Flw.FlwFilesWindow({});
	}
	window["removewin"].show(_insid,_title,_store);
};
function displayOCX(flag){
	var ocxDom = document.getElementById('TANGER_OCX');
	flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
}