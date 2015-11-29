var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var insDataBean = "com.sgepit.frame.flow.hbm.InsDataInfoView";
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";
var tabPanel, flowWindow, fileWindow, moduleWindow, uploadWindow, logWin, adjunctWindow, resetWin, saveTitleWindow;
var FLOW_ID = "-1", FLOW_NAME, FLOW_IDS, FLOW_NODETYPE;
var FLOW_TYPE = "";
var docMenu, menuBtn, msgItem, saveBtn;
var INS_ID = "-1";
var FILE_ID = "-1";
var FILE_NAME = "-1";

Ext.onReady(function(){
	Ext.QuickTips.init();
	
	var root = new Ext.tree.AsyncTreeNode({
    	text: '业务工作流程树',
    	id: 'root',
    	nodeType: 'root',
    	expanded :true
    });
    
    var treePanel = new Ext.tree.TreePanel({
		region: 'west',
		split: true,
		width: 175,
		minSize: 175,
		maxSize: 500,
		frame: false,
		margins: '5 0 5 5',
		cmargins: '0 0 0 0',
		rootVisible: true,
		lines: true,
		animate: true,
		autoScroll: true,
		animCollapse : true,
		collapsible: true,
		collapseMode: 'mini',
		tbar: ['<font color=#15428b>&nbsp;流程结构树</font>'],
		loader: new Ext.tree.DWRTreeLoader({dataUrl: flwFrameMgm.getFlowTreeNodeByIdAndRole}),
		root: root,
		collapseFirst: false
	});
	
	var treeMenu = new Ext.menu.Menu({id: 'treeMenu'});
	treePanel.on('contextmenu', contexttreemenu, this);
	
	tabPanel = new Ext.TabPanel({
		activeTab: tab,
		deferredRender: true,
		split: true,
		height: 240,
		minSize: 100,
		maxSize: 460,
		plain: true,
		border: false,
		region: 'center',
		forceFit: true,
		tbar: ['->', {
			text:'展开',
			iconCls:'add',
			handler:function(){
					if(treePanel.collapsed){
						treePanel.expand()
						//parent.api.expand()		
						this.setText('展开')
						this.setIconClass('add')						
					}else{
						treePanel.collapse()
						//parent.api.collapse()
						this.setText('还原')
						this.setIconClass('remove')						
					}	
			}
		}],		
		items: [{
			id: 'flowing',
			title: '处理中流程',
			iconCls: 'refresh',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=flowing',
				text: 'Loading...'
			}
		},{
			id: 'flowed',
			title: '已处理流程',
			iconCls: 'finish',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=flowed',
				text: 'Loading...'
			}
		}]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [treePanel, tabPanel]
	});
	
	//buildFrameTree();
	
	treePanel.on('click', function(node, e){
		FLOW_NODETYPE = node.attributes.nodeType
		if (node.attributes.nodeType == 'flow'){
			FLOW_ID = node.id;
			FLOW_NAME = node.text;
			FLOW_TYPE = node.parentNode.text
			
		}else if (node.attributes.nodeType == 'document'){
			var nodes = node.childNodes;
			var flowids = "";
			for (var i=0; i<nodes.length; i++){
				if (i != 0) flowids += ","
				flowids += "'"+nodes[i].id+"'";
			}
			if (nodes.length == 0) return;
			FLOW_IDS = flowids
		} 
		refreshTab();
	});
	
	treePanel.on('dblclick', function(node, e){
		if (node.attributes.nodeType == 'flow'){
			FLOW_ID = node.id;
			FLOW_NAME = node.text;
			showFlow();
		}
	});
	
	tabPanel.on('tabchange', refreshTab);
	
	function contexttreemenu(node, e){
		e.stopEvent();
		treeMenu.removeAll();
		if (node.attributes.nodeType == 'flow') {
			FLOW_ID = node.id;
			FLOW_NAME = node.text;
			treeMenu.addMenuItem({
				state: 'flow_new',
				text: '　发起流程',
				iconCls: 'returnTo',
				handler: showFlow
			});
			treeMenu.showAt(e.getXY());
		}
	}
	
	function buildFrameTree(){
		treePanel.getEl().mask("Loading...");
		clearChildNodes(root);
		baseDao.queryWhereOrderBy(frameBean, '', 'framename', function(frame_list){
			for (var i = 0; i < frame_list.length; i++) {
				var treeNode = new Ext.tree.TreeNode({
					id: frame_list[i].frameid,
					text: frame_list[i].framename,
					type: 'document'
				});
				DWREngine.setAsync(false);
				flwFrameMgm.getFlowTreeByFrameidAndUserid(frame_list[i].frameid,USERID,function(data){
					var nodes = eval(data);
					for(var i=0,l=nodes.length;i<l;i++){
						if(nodes[i].isyp=="0")
							treeNode.appendChild(new Ext.tree.TreeNode(nodes[i]));
					}
				})
				DWREngine.setAsync(true);
				root.appendChild(treeNode);
			}
			root.expand();
			//root.expandChildNodes(true);
			treePanel.getEl().unmask();
		});
	}
	
	function clearChildNodes(node){
		if (node.childNodes.length > 0){
			node.childNodes[0].remove();
			clearChildNodes(node);
		}
	}
	
});
//end Ext.onReady
function refreshTab(){
	tabPanel.getActiveTab().doAutoLoad();
}

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
		header: '签署意见',
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
	{name: 'nodename', type: 'string'}
];

var ds = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: 'com.sgepit.frame.flow.hbm.TaskView',
		business: 'baseMgm',
		method: 'findWhereOrderBy'
//		params: "insid='"+_insid+"'"
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
	if ("7" == columnIndex){
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
	logWin.setTitle('主题为：【'+_insTitle+'】 - 流转日志');
	ds.baseParams.params = "insid = '" + _insid + "'";
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

//发起流程
function showFlow(){
	if(!flowWindow){
		flowWindow = new Ext.Window({	               
			title: '发起流程',
			iconCls: 'form',
			width: 640,
			height: 355,
			modal: true,
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=ins',
				text: 'Loading...'
			}
		});
	} else {
		flowWindow.doAutoLoad();
	}
	flowWindow.show();
	flowWindow.on('hide', function(){
		if (FLOW_ID != "-1") refreshTab();
	});
}

//查看流程文档
function showFlowFile(_insid, _title){
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
		
		saveBtn = new Ext.Button({
			text: '保存',
			iconCls: 'save',
			disabled: true,
			handler: function(){
				if ('-1' != FILE_ID && '-1' != FILE_NAME){
					var outHTML = document.all.item("TANGER_OCX").SaveToURL(
						_basePath+'/servlet/FlwServlet?ac=saveDoc',
						'EDITFILE',
						'fileid='+FILE_ID,
						FILE_NAME
					);
					Ext.example.msg('文件保存成功', outHTML);
				}
			}
		});
		
		fileWindow = new Ext.Window({	               
			title: '查看流程文档',
			iconCls: 'form',
			tbar: [menuBtn,'-',saveBtn],
			width: 900,
			height: 512,
            draggable : false,
			modal: true,
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,	                
			contentEl: TANGER_OCX
		});
	}
	
	fileWindow.setTitle('查看['+_title+'] - 流程文档');
	
	fileWindow.on('hide', function(){
        displayOCX(false);
		if (TANGER_OCX_OBJ) TANGER_OCX_OBJ.Close();
		saveBtn.setDisabled(true);
	});
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
							FILE_ID = _file.fileid;
							FILE_NAME = _file.filename;
							//displayOCX(true);
							//TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
							openFlwFile(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
							document.getElementById('TANGER_OCX').height='519'
                            if(USERNAME == 'system'){
                                saveBtn.setDisabled(false);
                                TANGER_OCX_SetReadOnly(false);
                            }
						}
					})
				);
			}
			menuBtn.setDisabled(false);
		} else { 
			menuBtn.setDisabled(true);
		}
	});
	document.getElementById('TANGER_OCX').height='1'
	fileWindow.show();
}

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
//	bbar: ['-','<font color=#15428b>资料名称：</font>', comboxWithTree, '->', 
//		{text: '移交资料室', iconCls: 'refresh', handler: removeToZl}],
	bbar: ['-', 
		{
			text: '上传', iconCls: 'upload', handler: function(){
				if (INS_ID != '-1'){
					showUpload();
				}
			}
		},'-',
		{
			text: '删除', iconCls: 'multiplication', handler: function(){
				var _record = gridAdjunct.getSelectionModel().getSelected();
				if (_record){
					Ext.Msg.show({
						title: '提示',
						msg: '您确定要删除['+_record.get('filename')+']附件吗？',
						icon: Ext.Msg.INFO,
						buttons: Ext.Msg.YESNO,
						fn: function(value){
							if ('yes' == value){
								Ext.Ajax.request({
									url: ''+CONTEXT_PATH+'/servlet/FlwServlet?ac=deleteAdjunct&fileid='+_record.get('fileid'),
									success: function(response, options){
										Ext.example.msg('提示', response.responseText);
										dsAdjunct.reload();
									},
									failure: function(response, options){
										Ext.Msg.alert('提示', response.responseText);
									}
								});
							}
						}
					});
				} else {
					Ext.example.msg('提示', '请先选择数据！');
				}
			}
		}
	],
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	}
});

// 查看流程附件
function showFlowAdjunct(_insid, _title){
	INS_ID = _insid;
	
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
	
	adjunctWindow.setTitle('查看['+_title+'] - 流程附件');
	
	adjunctWindow.show();
	
	//流程实例【附件】加载
	dsAdjunct.baseParams.params = "insid='"+_insid+"'";
	dsAdjunct.load();
}

//查看流程关联的业务数据
function showModule(_insid, _title){
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
	
	moduleWindow.setTitle('查看['+_title+'] - 流程业务数据');
	
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
									+'&business='+_data.businessname+'&method='+_data.methodname+'&table='+_data.tablename,
							text: '<b>Loading...</b>'
						});
					}
				})
			}
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=green><<<请选择要打开的业务数据</color>'});
//			moduleWindow.load({
//				text: '<b>['+_title+']<br><font color=green>请选择要查看的业务数据...</font></b>'
//			});
		} else {
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=red>没有可查看的业务数据</color>'});
//			moduleWindow.load({
//				text: '<b>['+_title+']<br><font color=red>没有可查看的业务数据...</font></b>'
//			});
		}
		moduleWindow.getTopToolbar().add(msgItem);
	});
}

//function displayOCX(flag){
//	var ocxDom = document.getElementById('TANGER_OCX');
//	flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
//}

function showUpload(){
	if(!uploadWindow){
		uploadWindow = new Ext.Window({
			title: '附件上传',
			iconCls: 'form',
			width: 650,
			height: 390,
			modal: true,
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=uploadAdjunct',
				text: 'Loading...'
			},
			listeners: {
				hide: function(){
					if(dsAdjunct.baseParams.params) dsAdjunct.reload();
				}
			}
		});
	} else {
		uploadWindow.doAutoLoad();
	}
	uploadWindow.show();
}

var resetRecipients = function (_insid, _insTitle){
	if (!resetWin) {
		resetWin = new Ext.Window({
			title: '重置受理人',
			iconCls: 'pasteUser0',
			layout: 'fit',
			width: 850, height: 400,
			modal: true,
			closeAction: 'hide', resizable: false,
			maximizable: false, plain: true,
			tbar: ['->',{
				text: '确定重置',
				iconCls: 'save',
				handler: function(){
					var editRecords = Ext.getCmp('resetGrid').getStore().getModifiedRecords();
					if (editRecords.length > 0){
						var arrEdit = new Array();
						for (var i=0; i<editRecords.length; i++){
							var temp = new Array();
							temp.push(editRecords[i].get('logid'));
							temp.push(editRecords[i].get('tonode'));
							arrEdit.push(temp);
						}
						flwInstanceMgm.resetFlwLog(arrEdit, function(flag){
							if (flag) Ext.getCmp('resetGrid').getStore().reload();
						});
					} else {
						Ext.example.msg('提示', '请重新选择受理人！');
					}
				}
			}],
			items: [resetGrid]
		});
	}
	resetWin.setTitle('主题为：【'+_insTitle+'】- 重置受理人');
	resetDs.baseParams.params = " flag='0' and insid = '" + _insid + "'";
	resetDs.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});
	resetWin.show();
}

function resetUserWin(){
	cuserWindow.show();
	cbuildRoleTree();
}

var resetSm = new Ext.grid.CheckboxSelectionModel();

var resetCm = new Ext.grid.ColumnModel([
	resetSm,{
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
		id: 'tonode',
		header: '接收人ID',
		dataIndex: 'tonode',
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
		header: '签署意见',
		dataIndex: 'notes',
		width: 300,
		renderer: function(value){
			if (value.length > 50) return value.substring(0, 50)+'.....详细'
			return value;
		}
	},{
		id: 'toname',
		header: '受理人',
		dataIndex: 'toname',
		editor: new Ext.form.TriggerField({
			name: 'toname', 
			triggerClass: 'x-form-date-trigger',
			readOnly: false, selectOnFocus: true,
			width: 100, allowBlank: true,
			onTriggerClick: resetUserWin
		}),
		width: 100
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
	}
]);
resetCm.defaultSortable = true;

var resetColumns = [
	{name: 'logid', type: 'string'},
	{name: 'insid', type: 'string'},
	{name: 'tonode', type: 'string'},
	{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
	{name: 'ftype', type: 'string'},
	{name: 'fromname', type: 'string'},
	{name: 'notes', type: 'string'},
	{name: 'toname', type: 'string'},
	{name: 'flag', type: 'string'},
	{name: 'nodename', type: 'string'}
];

var resetDs = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: 'com.sgepit.frame.flow.hbm.TaskView',
		business: 'baseMgm',
		method: 'findWhereOrderBy',
		params: "flag='0'"
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'logid'
	}, resetColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
resetDs.setDefaultSort('ftime', 'asc');

var resetGrid = new Ext.grid.EditorGridPanel({
	id: 'resetGrid',
	ds: resetDs,
	cm: resetCm,
	sm: resetSm,
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	clicksToEdit: 1,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: resetDs,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    })
});

function saveFlwTitle(_insid, _title){
	if (!saveTitleWindow){
		saveTitleWindow = new Ext.Window({	               
			title: '修改流程主题',
			iconCls: 'btn',
			width: 380,
			height: 140,
			modal: true, layout: 'fit',
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,
			border: false,
			items: [{
				xtype: 'form', layout: 'form', bodyStyle: 'padding: 10px 20px;', border: false,
				items: [
					{xtype: 'textarea', fieldLabel: '流程主题', name: 'title', id: 'flw_title', width: 200, height: 60},
					{xtype: 'textfield', fieldLabel: '流程实例ID', name: 'insid', id: 'ins_id', hidden: true, hideLabel: true}
				]
			}],
			bbar: ['->', {
				text: '保存', iconCls: 'save',
				handler: function(){
					var _oldValue = _title;
					var _thisValue = Ext.getCmp('flw_title').getValue();
					var _flwInsId = Ext.getCmp('ins_id').getValue();
					if (_oldValue == _thisValue){
						Ext.example.msg('提示', '没做任何修改！');
					} else if (_thisValue == ''){
						Ext.example.msg('提示', '不能为空！');
					} else {
						flwInstanceMgm.saveFlwTitle(_flwInsId, _thisValue, function(){
							Ext.example.msg('提示', '保存成功！');
							window.frames(0).ds.reload();
						});
					}
				}
			}]
		});
	}
	
	saveTitleWindow.show();
	Ext.getCmp('flw_title').setValue(_title);
	Ext.getCmp('ins_id').setValue(_insid);
}