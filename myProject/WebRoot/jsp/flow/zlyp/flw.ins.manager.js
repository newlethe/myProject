var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var insDataBean = "com.sgepit.frame.flow.hbm.InsDataInfoView";
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";
var tabPanel,westPanel, flowModelWindow,fileWindow, moduleWindow, uploadWindow, logWin, adjunctWindow, resetWin, saveTitleWindow;
var FLOW_ID = "-1", FLOW_NAME, FLOW_IDS, FLOW_NODETYPE;
var FLOW_TYPE = "";
var docMenu, menuBtn, msgItem, saveBtn;
var INS_ID = "-1";
var FILE_ID = "-1";
var FILE_NAME = "-1";

var ZlypFlowInfo = {
	xmmc:null,//验评项目名称
	xmbh:null,//验评项目编号
	flowid:null,//流程id
	fileid:null,//文件id
	flowname:null//流程名称
}

Ext.onReady(function(){
	Ext.QuickTips.init();
	westPanel= new Flw.Ins.treeZlyp({
		id:'treezlyp',
		region:'west',
		animate: false,
		collapsible:true,
    	collapseMode:'mini',
		split: true,
		width: 200,
	    minSize: 199,
	    maxSize: 201
	});
	
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
				if(westPanel.collapsed){
					westPanel.expand()
					this.setText('展开')
					this.setIconClass('add')						
				}else{
					westPanel.collapse()
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
				params: 'type=zlypflowing',
				text: 'Loading...'
			}
		},{
			id: 'flowed',
			title: '已处理流程',
			iconCls: 'finish',
			layout: 'fit',
			autoLoad: {
				url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
				params: 'type=zlypflowed',
				text: 'Loading...'
			}
		}]
	});
	westPanel.on('click', refreshTab);
	tabPanel.on('tabchange', refreshTab);
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [tabPanel,westPanel]
	});
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
		width: 120,
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
		renderer: function(value){ return ('0' == value ? '未完成' : '完成'); }
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
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: ds,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    })
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
	ds.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});
	logWin.show();
	notesTip = new Ext.ToolTip({
		title: '签署意见',
		width: 200,
		target: logGrid.getEl()
	});
}

//发起流程
function showFlow(){
	var node = westPanel.getSelectionModel().getSelectedNode();
	if(node&&node.isLeaf()){//选中了验评分类节点并且是叶子节点
		if(!flowModelWindow) flowModelWindow = new Flw.Ins.WindowFlwModel({});               
		flowModelWindow.show(node)
	}else{
		Ext.example.msg('','请先选择具体的质量验评分类！');
	}
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
							displayOCX(true);
							TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
							saveBtn.setDisabled(false);
							document.getElementById('TANGER_OCX').height='519'
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
		} else {
			msgItem = new Ext.Toolbar.TextItem({id:'msgbtn' ,text: '<font color=red>没有可查看的业务数据</color>'});
		}
		moduleWindow.getTopToolbar().add(msgItem);
	});
}

function displayOCX(flag){
	var ocxDom = document.getElementById('TANGER_OCX');
	flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
}

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
				width: 120,
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
				renderer: function(value){ return ('0' == value ? '未完成' : '完成'); }
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
		
		resetDs = new Ext.data.Store({
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
};
Ext.ns("Flw","Flw.Ins");
/**
 * 质量验评项目分类树
 * @class Flw.Ins.treeZlyp
 * @extends Ext.tree.TreePanel
 */
Flw.Ins.treeZlyp=Ext.extend(Ext.tree.TreePanel ,{
		frame: false,
		margins: '5 0 5 5',
		cmargins: '0 0 0 0',
		header : false,
		border : false,
		collapsible : true,
		collapseFirst : false,
		lines : true,
		autoScroll : true,
		rootVisible : true,
		animate : false,
		initComponent: function(){
			
			var thisRootUids;
			//判断当前登陆项目是否有质量验评树的更节点，没有则自动添加
			DWREngine.setAsync(false);
			gczlJyxmImpl.isHaveTreeRoot(CURRENTAPPID,"验评标准树",function(str){
				thisRootUids = str;
			});
			DWREngine.setAsync(true);
			
			this.tbar = ['<font color=#15428b>&nbsp;检验项目分类树</font>'];
			this.root = new Ext.tree.AsyncTreeNode({
				text : "验评标准树",
				iconCls : 'form',
				leaf:false,
				expanded:true,
				id : thisRootUids  // 重要 : 展开第一个节点 !!
			});
			this.loader = new Ext.tree.DWRTreeLoader({
				dataUrl: flwZlypMgm.getZlypNodeById
			});
			this.treeMenu = new Ext.menu.Menu({});
			this.on('contextmenu', this.contexttreemenu, this);
			Flw.Ins.treeZlyp.superclass.initComponent.call(this);
		},
		contexttreemenu:function(node, e){
			e.stopEvent();
			this.treeMenu.removeAll();
			this.selectPath(node.getPath());
			if(node.isLeaf()){
				this.treeMenu.addMenuItem({
					state: 'flow_new',
					text: '　发起流程',
					iconCls: 'returnTo',
					handler: showFlow
				});
				this.treeMenu.showAt(e.getXY());
			}
		}
});
/**
 * 验评分类下对应的流程和模板定义
 * @class Flw.Ins.WindowFlwModel
 * @extends Ext.Window
 */
Flw.Ins.WindowFlwModel=Ext.extend(Ext.Window ,{
	title:"流程定义及模板信息",
	width:400,
	height:450,
	closeAction: 'hide',
	layout:"anchor",
	modal: true,
	initComponent: function(){
		var smFlow = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
		var smModel= new Ext.grid.CheckboxSelectionModel({singleSelect:true});
		this.flowWindow = new Ext.Window({	               
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
				params: 'type=inszlyp',
				text: 'Loading...'
			}
		});
		
		this.items=[{
				xtype:"grid",
				title:"流程定义",
				anchor: "100% 50%",
				sm:smFlow,
				columns:[smFlow,{
					header:"流程ID",
						sortable:true,
						resizable:true,
						dataIndex:"flowid",
						hidden:true,
						width:100
					},{
						header:"流程名称",
						sortable:true,
						resizable:true,
						dataIndex:"flowtitle",
						width:220
					},{
						header:"默认选中",
						sortable:true,
						resizable:true,
						dataIndex:"isdefault",
						width:100,
						renderer:function(value){
							if(value==1) return '<font color="blue"><b>是</b></font>'
							else return '<font color="gray">否</font>'
						}
				}],
				ds: new Ext.data.SimpleStore({
					fields: [
						{name: 'flowid', type: 'string'},
						{name: 'flowtitle', type: 'string'},
						{name: 'isdefault', type: 'int'}
					]
				})
			},{
				xtype:"grid",
				title:"模板定义",
				anchor: "100% 50%",
				sm:smModel,
				columns:[smModel,{
					header:"文档ID",
					sortable:false,
					resizable:false,
					dataIndex:"fileid",
					hidden:true,
					width:100
				},{
					header:"文档名称",
					sortable:false,
					resizable:false,
					dataIndex:"mbname",
					width:220
				},{
					header:"默认文档",
					sortable:false,
					resizable:false,
					dataIndex:"isdefault",
					width:100,
					renderer:function(value){
						if(value==1) return '<font color="blue"><b>是</b></font>'
						else return '<font color="gray">否</font>'
					}
				}],
				ds: new Ext.data.SimpleStore({
					fields: [
						{name: 'fileid', type: 'string'},
						{name: 'mbname', type: 'string'},
						{name: 'isdefault', type: 'int'}
					]
				})
		}];
		this.on("beforeshow",function(){
			if(this.ypxmbh!==undefined){
				this.loadData();
			}else{
				Ext.example.msg('','请先选择质量验评项目分类！');
				return false;
			}
		});
		this.on("show",function(){
			var gridFlow =this.items.get(0);
			var gridModel=this.items.get(1);
			var dsFlow   =gridFlow.getStore();
			var dsModel  =gridModel.getStore();
			
			if(dsFlow.getCount()==1&&dsModel.getCount()==1){
				ZlypFlowInfo.xmbh=this.ypxmbh;
				ZlypFlowInfo.xmmc=this.ypxmmc;
				ZlypFlowInfo.flowid= dsFlow.getAt(0).get("flowid");
				ZlypFlowInfo.flowname=dsFlow.getAt(0).get("flowtitle");
				ZlypFlowInfo.fileid=dsModel.getAt(0).get("fileid");
				this.hide();
				this.flowWindow.show();
			};
		});
		this.buttons = [{
			text:'确定',
			scope:this,
			handler:function(){
				var gridFlow =this.items.get(0);
				var gridModel=this.items.get(1);
				var dsFlow   =gridFlow.getStore();
				var dsModel  =gridModel.getStore();
				var selectedFlow = gridFlow.getSelectionModel().getSelected();
				var selectedModel= gridModel.getSelectionModel().getSelected();
				
				if(dsFlow.getCount()==0){
					Ext.example.msg('提示信息','该质量检验项目下未设置流程，不能发起流程!');
					this.hide();
				}else if(dsModel.getCount()==0){
					Ext.example.msg('提示信息','该质量检验项目下未设置文档，不能发起流程!');
					this.hide();
				}else{
					if(selectedFlow&&selectedModel){
						ZlypFlowInfo.xmbh=this.ypxmbh;
						ZlypFlowInfo.xmmc=this.ypxmmc;
						ZlypFlowInfo.flowid=selectedFlow.get("flowid");
						ZlypFlowInfo.flowname=selectedFlow.get("flowtitle");
						ZlypFlowInfo.fileid=selectedModel.get("fileid");
						this.hide();
						this.flowWindow.show();
					}else if(!selectedFlow){
						Ext.example.msg('提示信息','请先选择流程!');
					}else if(!selectedModel){
						Ext.example.msg('提示信息','请先选择模板!');
					}
				}
			}
		},{
			text:'取消',
			scope:this,
			handler:function(){this.hide();}
		}];
		this.buttonAlign="center";
		Flw.Ins.WindowFlwModel.superclass.initComponent.call(this);
	},
	show:function(ypnode,animateTarget, cb, scope){
		this.ypxmbh = ypnode.id;//验评项目主键
		this.ypxmmc = ypnode.text;
		Flw.Ins.WindowFlwModel.superclass.show.call(this);
	},
	loadData : function(){
		DWREngine.setAsync(false);
		var xmbh = this.ypxmbh;
		var xmbhStr = "";
		//查询出当前节点的所有父节点（包括父节点的父节点）。
		var xmbhSql = "select t.xmbh from gczl_jyxm t where t.pid = '"+CURRENTAPPID+"' " +
				" start with t.xmbh= '"+xmbh+"' connect by prior t.parentbh = t.xmbh ";
		baseDao.getData(xmbhSql,function(list){
			for (var i = 0; i < list.length; i++) {
				xmbhStr +=",'"+list[i]+"'"
			}
		});
		xmbhStr = xmbhStr.substring(1);
		var gridFlow =this.items.get(0);
		var gridModel=this.items.get(1);
		var dsFlow   =gridFlow.getStore();
		var dsModel  =gridModel.getStore();
		dsFlow.removeAll();
		dsModel.removeAll();
		
		var dsArrFlow = new Array();
		baseDao.findByWhere2("com.sgepit.pmis.gczl.hbm.GczlFlowView", "jyxmUids in ("+xmbhStr+")", function(list1){
			var sel1Row=0;
			var isdefualt1Arr=new Array();
			for(var i=0;i<list1.length;i++){
				var tempArrFlow = new Array();
				if(list1[i].isdefault==1) isdefualt1Arr.push(i);				
				tempArrFlow.push(list1[i].flowid);
				tempArrFlow.push(list1[i].flowtitle);
				tempArrFlow.push(list1[i].isdefault);
				dsArrFlow.push(tempArrFlow);
			}
			if(dsArrFlow.length>0){
				if(isdefualt1Arr.length>0) sel1Row=isdefualt1Arr[0];//如果设置了两个或更多的默认流程，则选取第一个
				dsFlow.loadData(dsArrFlow);
				gridFlow.getSelectionModel().selectRow(sel1Row);
			}
		});
		
		var dsArrModel = new Array();
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.GczlJymb", 
			"jyxmUids in (select uids from com.sgepit.frame.flow.hbm.GczlJyxm where uids in ("+xmbhStr+") ) and isstart='1'", function(list2){
			var sel2Row=0;
			var isdefualt2Arr=new Array();
			for(var j=0;j<list2.length;j++){
				var tempArrModel = new Array();
				if(list2[j].isdefault==1) isdefualt2Arr.push(j);				
				tempArrModel.push(list2[j].fileid);
				tempArrModel.push(list2[j].mbname);
				tempArrModel.push(list2[j].isdefault);
				dsArrModel.push(tempArrModel);
			}
			if(dsArrModel.length>0){
				if(isdefualt2Arr.length>0) sel2Row=isdefualt2Arr[0];//如果设置了两个或更多的默认文档，则选取第一个
				dsModel.loadData(dsArrModel);
				gridModel.getSelectionModel().selectRow(sel2Row);
			}
		});
		DWREngine.setAsync(true); 
	}
});