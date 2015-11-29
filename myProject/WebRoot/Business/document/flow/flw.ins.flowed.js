var insBean = "com.sgepit.frame.flow.hbm.TaskView";;
var logBean = "com.sgepit.frame.flow.hbm.LogView";
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";
var zlInfoBean = "com.sgepit.frame.flow.hbm.ZlInfo";
var zlTreeBean = "com.sgepit.pmis.document.hbm.ZlTree";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
//var params = "fromnode='"+_userid+"' and ftype like '%A' and status='2' and insid='"+_insid+"'";
var params = "fromnode='"+_userid+"' and ftype like '%A' and status='2' and insid='"+_insid+"'";
var ds, grid, removeWindow;
var FILE_TYPE = 8, FLW_INS_TITLE = '';
var rootText = "资料分类";
var root, treeLoader, treePanel;
var SEL_INDEX_ID = "-1", SEL_ORG_ID = "-1";

var ZlInfo = function(){
	this.infoid,			//主键
	this.pid,				//项目别
	this.indexid,			//分类条件
	this.fileno,			//文件编号
	this.materialname,		//材料名称（流程主题）
	this.responpeople,		//录入人（发起人）
	this.stockdate,			//文件形成日期
	this.quantity,			//每份数量
	this.book,				//单位
	this.portion,			//份
	this.filelsh,			//附件流水号
	this.billstate,			//单据状态
	this.orgid,				//部门id
	this.weavecompany,		//责任者
	this.infgrade,			//资料电子文档密级
	this.filename,			//附件文件名称（文件名称）
	this.remark,			//备注
	this.yjr,				//移交人（发起人）
	this.jsr,				//经手人
	this.zltype,			//资料类型（8定为流程文件、9定为流程附件）
	this.rkrq,				//入库日期
	this.modtabid,
	this.flwinsid,
	this.zldaid
	
}

Ext.onReady(function(){
	
//	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}), {
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
			id: 'flowid',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'flowtitle',
			header: '流程类型',
			dataIndex: 'flowtitle',
			hidden: true
		},{
			id: 'title',
			header: '主题',
			dataIndex: 'title',
			width: 120
		},{
			id: 'ftime',
			header: '发送时间',
			dataIndex: 'ftime',
			width: 100,
			renderer: function(value){
		        return value ? value.dateFormat('Y-m-d H:i:s') : '';
		    }
		},{
			id: 'ftype',
			header: '处理说明',
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
			id: 'fromnode',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'toname',
			header: '接收人',
			dataIndex: 'toname',
			hidden: true
		},{
			id: 'tonode',
			header: '接受人ID',
			dataIndex: 'tonode',
			hidden: true
		},{
			id: 'notes',
			header: '签署意见',
			dataIndex: 'notes',
			hidden: true
		},{
			id: 'flag',
			header: '是否完成',
			dataIndex: 'flag',
			hidden: true
		},{
			id: 'nodename',
			header: '节点名称',
			dataIndex: 'nodename',
			hidden: true
		},{
			id: 'status',
			header: '流程状态',
			dataIndex: 'status',
			width: 80,
			renderer: function(value){
				return value == '2' ? '处理完毕！' : '处理中...';
			}
		},{
			id: 'flowno',
			header: '文件编号',
			dataIndex: 'flowno',
			width: 100
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'logid', type: 'string'},
		{name: 'flowid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'status', type: 'string'},
		{name: 'flowno', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: insBean,
			business: business,
			method: listMethod,
			params:" insid='"+_insid+"'"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'insid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('ftime', 'desc');
	
	grid = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
//		sm: sm,
		border: false, region: 'center',
		header: false, stripeRows: true,
		autoScroll: true,
		loadMask: true,
		collapsible: true,
    	animCollapse: true,
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
	
	grid.on('rowcontextmenu', contextgridmenu);
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	
	var timeBar = new Ext.Toolbar({
		region: 'south',
		items: ['-',
			{id: 'day', text: '<font color=#FF4500>今天的文件</font>', handler: doTimeQuery}, '-',
			{id: 'week', text: '<font color=#B8860B>一周内的文件</font>', handler: doTimeQuery}, '-',
			{id: 'month', text: '<font color=#4B0082>本月内的文件</font>', handler: doTimeQuery}, '-',
			{id: 'all', text: '<font color=#006400>所有的文件</font>', handler: doTimeQuery}
		]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [qPanel, grid]
	});
	alert(parent.FLOW_NODETYPE+"===")
	if (parent.FLOW_NODETYPE == "flow"){
		ds.baseParams.params = params+" and flowid='"+parent.FLOW_ID+"'  and insid='"+_insid+"'";
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		params += " and flowid='"+parent.FLOW_ID+"' and insid='"+_insid+"'";
	}else if(parent.FLOW_NODETYPE == "document"){
		ds.baseParams.params = params+" and flowid in ("+parent.FLOW_IDS+") and insid='"+_insid+"'";
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		params += " and flowid in ("+parent.FLOW_IDS+") and insid='"+_insid+"'";		
	}else{
		ds.baseParams.params = params;
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});			
	}
	
	function contextgridmenu(_grid, _rowIndex, _e){
		_e.stopEvent();
		_grid.getSelectionModel().selectRow(_rowIndex);
		var record = _grid.getSelectionModel().getSelected();
		gridMenu.removeAll();
		gridMenu.addMenuItem({
			state: 'flow_log',
			text: '　流转日志',
			iconCls: 'refresh',
			value: record,
			handler: gridHandler
		});
		gridMenu.addMenuItem({
			state: 'flow_file',
			text: '　流程文件',
			iconCls: 'word',
			value: record,
			handler: gridHandler
		});
		gridMenu.addMenuItem({
			state: 'flow_adjunct',
			text: '　流程附件',
			iconCls: 'copyUser',
			value: record,
			handler: gridHandler
		});
		gridMenu.addMenuItem({
			state: 'flow_module',
			text: '　业务数据',
			iconCls: 'select',
			value: record,
			handler: gridHandler
		});
		gridMenu.addMenuItem({
			state: 'remove_tozl',
			text: '　移交资料',
			iconCls: 'print',
			value: record,
			handler: gridHandler
		});
		gridMenu.showAt(_e.getXY());
	}
	
	function gridHandler(){
		var state = this.state;
		var record = this.value;
		if ('flow_log' == state) {
			parent.showLogWin(record.get('insid'), record.get('title'));
		} else if ('flow_file' == state) {
			parent.showFlowFile(record.get('insid'), record.get('title'));
		} else if ('flow_adjunct' == state) {
			parent.showFlowAdjunct(record.get('insid'), record.get('title'));
		} else if ('flow_module' == state) {
			parent.showModule(record.get('insid'), record.get('title'));
		} else if ('remove_tozl' == state) {
			if (USERORGID){
				showFilesToRemove(record.get('insid'), record.get('title'));
			} else {
				Ext.example.msg('提示', '您没有设置部门，无法移交资料室！');
				return;
			}
		}
	}
	
	function doTimeQuery(){
//		if (parent.FLOW_ID != "-1"){
			var type = this.id;
			var date = new Date();
			var today = date.getYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
			var date1 = new Date(date.getTime()-(date.getDay()==0?6:date.getDay()-1)*1000*60*60*24);
			var week_begin_day = (date.getYear()+(date1.getYear()==date.getYear()?0:-1))+'-'+((date.getMonth()+(date1.getMonth()==date.getMonth()?1:0))==0?12:(date.getMonth()+(date1.getMonth()==date.getMonth()?1:0)))+'-'+date1.getDate();
			var month_begin_day = date.getYear()+'-'+(date.getMonth()+1)+'-1';
			
			var sql = '';
			if ('day' == type){
				sql += " and ftime >= to_date('"+today+" 00:00:00','YYYY-MM-DD hh24:mi:ss')"
						+" and ftime <= to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')"
			} else if ('week' == type){
				sql += " and ftime between to_date('"+week_begin_day+"','YYYY-MM-DD')"
						+" and to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')";
			} else if ('month' == type){
				sql += " and ftime between to_date('"+month_begin_day+"','YYYY-MM-DD')"
						+" and to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')";
			} else if ('all' == type){
				// do nothing...
			}
			
			ds.baseParams.params = params+sql;
			ds.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
//		} else {
//			Ext.example.msg('提示', '请先选择左边的流程结构树!');
//		}
	}
	
	var notesTip2 = new Ext.ToolTip({
		width: 200,
		target: grid.getEl()
	});
	
	grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("5" == columnIndex){
			if(notesTip2.findById('notes_id')) notesTip2.remove('notes_id');
			notesTip2.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('title')
			});
			point = e.getXY();
			notesTip2.showAt([point[0], point[1]]);
		}
	});
});

//var smFile = new Ext.grid.CheckboxSelectionModel();
var smFile =  new Ext.grid.CheckboxSelectionModel({
        renderer: function(value, metaData, record){
			if(record.get('ismove')==0){
			     return Ext.grid.CheckboxSelectionModel.prototype.renderer.apply(this, arguments);
			}else 
			 return;
		}
});
var cmFile = new Ext.grid.ColumnModel([
	smFile, {
		id: 'fileid',
		header: '文件ID',
		dataIndex: 'fileid',
		hidden: true
	},{
		id: 'insid',
		header: '实例ID',
		dataIndex: 'insid',
		hidden: true
	},{
		id: 'ismove',
		header: '是否移交',
		dataIndex: 'ismove',
		renderer:function(value){
			if(value==0){return "<font color='green'>未移交</font>"}
			else if(value==1){return "<font color='red'>已移交</font>"}
		}
		//hidden: true
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
	}
]);

var ColumnsFile = [
	{name: 'fileid', type: 'string'},
	{name: 'insid', type: 'string'},
	{name: 'ismove', type: 'string'},
	{name: 'filename', type: 'string'},
	{name: 'filedate', type: 'date', dateFormat: 'Y-m-d H:i:s'}
];

var dsFile = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: insfileBean,
		business: business,
		method: listMethod
	},
	proxy: new Ext.data.HttpProxy({
		method: 'GET',
		url: MAIN_SERVLET
	}),
	reader: new Ext.data.JsonReader({
		root: 'topics',
		totalProperty: 'totalCount',
		id: 'fileid'
	}, ColumnsFile),
	remoteSort: true,
	pruneModifiedRecords: true
});

var comboxWithTree = new Ext.form.ComboBox({
	mode: 'local',
	editable: false,
    listWidth: 280,
    maxHeight: 200,
    triggerAction: 'all',
    store: new Ext.data.SimpleStore({fields: [], data: [[]]}),
    tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
    listClass: 'x-combo-list-small'
});

var gridFile = new Ext.grid.GridPanel({
	ds: dsFile,
	cm: cmFile,
	sm: smFile,
	bbar: ['-','<font color=#15428b>资料名称：</font>', comboxWithTree, '->', 
		{text: '移交资料室', iconCls: 'refresh', handler: removeToZl}],
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

smFile.on('rowselect', function(sm) { // grid 行选择事件
	var record = gridFile.getSelectionModel().getSelected();				
	var getismove=record.get('ismove');
	if(getismove ==1){
		Ext.example.msg('提示', '请选择未移交的附件！')
		smFile.clearSelections();
	}
 });

var removeTabPanel = new Ext.TabPanel({
	activeTab: 0,
	deferredRender: true,
	plain: true,
	border: false,
	forceFit: true,
	items: [{
		id: 'file-tab',
		title: '流程文件',
		layout: 'fit',
		items: gridFile
	}, {
		id: 'adjunct-tab',
		title: '流程附件',
		layout: 'fit'
	}],
	listeners: {
		tabchange : function(tp, p){
			if (p.id == 'file-tab'){
				dsFile.baseParams.bean = insfileBean;
				FILE_TYPE = 8;
			} else if (p.id == 'adjunct-tab'){
				dsFile.baseParams.bean = adjunctBean;
				FILE_TYPE = 9;
			}
			p.add(gridFile);
			p.doLayout();
			dsFile.load();
			comboxWithTree.setValue("");
			SEL_INDEX_ID = "-1";
			SEL_ORG_ID = "-1";
		},
		beforetabchange : function(tp, np, cp){
			if (smFile.getSelections().length > 0){
				Ext.example.msg('您选择了数据', '请先取消勾选或处理完数据之后，再进行切换！')
				return false;
			}
		}
	}
});

/**
 * 移交资料室
 */
function showFilesToRemove(_insid, _title){
	//dsFile.baseParams.params = "ismove='0' and insid='"+_insid+"'";
	dsFile.baseParams.params = "insid='"+_insid+"'";
	FLW_INS_TITLE = _title;
	if(!removeWindow){
		DWREngine.setAsync(false);
		baseDao.findByWhere2(zlTreeBean, "orgid='"+USERORGID+"'", function(list){
			if (list.length > 0){
				root = new Ext.tree.AsyncTreeNode({
					text : rootText,
					iconCls : 'form'
				});
				treeLoader = new Ext.tree.TreeLoader({
					url : MAIN_SERVLET,
					baseParams : {
						ac: "columntree",
						treeName: " ",
						businessName: "zldaMgm",
						orgid: list[0].orgid,
						parent: list[0].parent,
						pid : CURRENTAPPID
					},
					clearOnLoad : true,
					uiProviders : {
						'col' : Ext.tree.ColumnNodeUI
					}
				});
				treePanel = new Ext.tree.ColumnTree({
					border: false,
					rootVisible : false,
					lines : true,
					autoScroll: true,
					animCollapse: true,
					animate: true,
					columns: [{
						header: '资料名称', width: 260, dataIndex: 'mc'
					}, {
				        header: '主键', width: 0, dataIndex: 'treeid',
				        renderer: function(value){ return "<div id='treeid'>"+value+"</div>";  }
				    },{
				        header: '编码', width: 0, dataIndex: 'bm',
				        renderer: function(value){ return "<div id='bm'>"+value+"</div>";  }
				    },{
				        header: '是否子节点', width: 0, dataIndex: 'isleaf',
				        renderer: function(value){ return "<div id='isleaf'>"+value+"</div>"; }
				    },{
				        header: '系统自动存储编码', width: 0, dataIndex: 'indexid',
				        renderer: function(value){ return "<div id='indexid'>"+value+"</div>"; }
				    },{
				        header: '部门id', width: 0, dataIndex: 'orgid',
				        renderer: function(value){ return "<div id='orgid'>"+value+"</div>"; }
				    },{
				        header: '父节点', width: 0, dataIndex: 'parent',
				        renderer: function(value){ return "<div id='parent'>"+value+"</div>"; }
				    }],
					loader : treeLoader,
					root : root
				});
				treePanel.on('beforeload', function(node) {
					var parent = node.attributes.treeid;
					if (parent == null) parent = 'root';
					var baseParams = treePanel.loader.baseParams
					baseParams.parent = parent;
				});
			} else {
				Ext.example.msg('提示', '部门['+USERORG+']，不在资料树中！');
			}
		});
		DWREngine.setAsync(true);
		removeWindow = new Ext.Window({	               
			title: '文档|附件',
			iconCls: 'print',
			width: 400, height: 240,
			modal: true, closeAction: 'hide',
			maximizable: false, resizable: false,
			plain: true, layout: 'fit',
			items: [removeTabPanel]
		});
	}
	removeWindow.setTitle('【'+_title+'】 - 流程文档|附件');
	removeWindow.show();
	removeWindow.on('hide', function(){
		comboxWithTree.setValue("");
		SEL_INDEX_ID = "-1";
		SEL_ORG_ID = "-1";
	});
	//alert(treePanel+removeWindow)
	if(treePanel){
		comboxWithTree.on('expand', function(){
			treePanel.render('tree');
		});
		treePanel.on('click', function(node){
			if ("" != node.attributes.mc){
				comboxWithTree.setValue(node.attributes.mc);
				SEL_INDEX_ID = node.attributes.indexid;
				SEL_ORG_ID = node.attributes.orgid;
				comboxWithTree.collapse();
			}
		});
	}
}

function removeToZl(){
	if (smFile.getSelections().length < 1){
		Ext.example.msg('提示', '请先选择数据！');
		return;
	} else if (comboxWithTree.getValue() == ''){
		Ext.example.msg('提示', '请先选择移交到哪个部门资料！');
		return;
	}
	if (SEL_INDEX_ID == "-1" || SEL_ORG_ID == "-1"){
		Ext.example.msg('提示', '参数错误，无法移交！');
		return;
	}
	Ext.Msg.show({
		title: '提示',
		msg: '您确定要移交勾选的流程'+(FILE_TYPE==8?'文件':'附件')+'吗？',
		buttons: Ext.Msg.YESNO,
		icon: Ext.Msg.WARNING,
		fn: function(value){
			if ('yes' == value) {
				doRemove(SEL_INDEX_ID, SEL_ORG_ID);
			}
		}
	});
}

function doRemove(_indexid, _orgid){
	var zlInfo_objs = new Array();
	var records = smFile.getSelections();
	for (var i=0; i<records.length; i++){
		var _fileid = records[i].get('fileid');
		var _filename = records[i].get('filename');
		var _fileno = "";
		if(FILE_TYPE==8){
			_fileno=grid.getSelectionModel().getSelected().get('flowno')+"_gjflow";
		}else{
			_fileno=grid.getSelectionModel().getSelected().get('flowno')+"_0"+i;
		}
		
		//alert(_fileid+'\n'+_filename+'\n'+_indexid+'\n'+FLW_INS_TITLE+'\n'+REALNAME+'\n'+FILE_TYPE);
		var zlInfo = new ZlInfo();
			zlInfo.infoid = '';						//主键
			zlInfo.pid = CURRENTAPPID;						//项目别
			zlInfo.indexid = _indexid;				//分类条件
			zlInfo.fileno = _fileno;						//文件编号
			zlInfo.materialname = FLW_INS_TITLE;	//材料名称（流程主题）
			zlInfo.responpeople = REALNAME;			//录入人（发起人）
			zlInfo.stockdate = new Date();			//文件形成日期
			zlInfo.quantity = '';					//每份数量
			zlInfo.book = '';						//单位
			zlInfo.portion = '';					//份
			zlInfo.filelsh = _fileid;				//附件流水号
			zlInfo.billstate = 1;					//单据状态
			zlInfo.orgid = _orgid;					//部门id
			zlInfo.weavecompany = '';				//责任者
			zlInfo.infgrade = '';					//资料电子文档密级
			zlInfo.filename = _filename;			//附件文件名称（文件名称）
			zlInfo.remark = '';						//备注
			zlInfo.yjr = REALNAME;					//移交人（发起人）
			zlInfo.jsr = '';						//经手人
			zlInfo.zltype = FILE_TYPE;				//资料类型（8定为流程文件、9定为流程附件）
			zlInfo.rkrq = new Date();				//入库日期
			zlInfo.modtabid='';
			zlInfo.flwinsid='';
			zlInfo.zldaid='';
		zlInfo_objs.push(zlInfo);
	}
	var s_flag=false;
	DWREngine.setAsync(false);
	for(var i=0;i<zlInfo_objs.length;i++){
		flwFileMgm.removeToZlObj(zlInfo_objs[i], function(flag){
			s_flag=flag;
		});
	DWREngine.setAsync(true);
	//alert(s_flag)
	if (s_flag){
		Ext.Msg.show({
			title: '提示',
			msg: '流程'+(FILE_TYPE==8?'文件':'附件')+'移交成功！',
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO,
			fn: function(value){
				if ('ok' == value) {
					dsFile.load();
				}
			}
		});
	}
		
	}
/*	flwFileMgm.removeToZlInfo(zlInfo_objs, function(flag){
		if (flag){
			Ext.Msg.show({
				title: '提示',
				msg: '流程'+(FILE_TYPE==8?'文件':'附件')+'移交成功！',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO,
				fn: function(value){
					if ('ok' == value) {
						dsFile.load();
					}
				}
			});
		}
	});*/
}
