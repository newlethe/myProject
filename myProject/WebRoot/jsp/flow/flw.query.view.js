var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var insBean = "com.sgepit.frame.flow.hbm.TaskView";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var insfileBean = "com.sgepit.frame.flow.hbm.InsFileInfoView";
var insDataBean = "com.sgepit.frame.flow.hbm.InsDataInfoView";
var adjunctBean = "com.sgepit.frame.flow.hbm.FlwAdjunctIns";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var params = "ftype like '%A' and ftype <> 'TA'";
var timeParams = '-1';
var app_flowid = '-1';
var app_flowid_temp = '-1';
var app_frameid = '-1';
var app_type = " and status='0'"; //用户更关注未处理的流程
var userParams = '-1';
var flowWindow, fileWindow, moduleWindow, adjunctWindow;
var docMenu, menuBtn, printDocBtn, msgItem;
var formWin, flowInfoWin;
var ds;
var dsAdjunct, gridAdjunct;
var unit_Array = new Array(),user_Array_q = new Array();
var fileSortArr = [['day','今天的文件'],['week','一周内的文件'],['month','本月内的文件'],['all','所有文件']]
var fileSortDs = new Ext.data.SimpleStore({
	fields : ['k', 'v'],
	data : fileSortArr
});
var deptCombo,userCombo;
var formPanel;
var exportFilter;//保存过滤条件，用来导出

Ext.onReady(function(){
	Ext.QuickTips.init();
	//获取单位
	DWREngine.setAsync(false);
 	baseDao.getData('select unitid,unitname from sgcc_ini_unit',function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			unit_Array.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	
 	var unitSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : unit_Array
	});
 	var fqrSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : [['','']]
	});
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
		loader: new Ext.tree.DWRTreeLoader({dataUrl: flwFrameMgm.getFlowTreeNodeByIdAndSearchRole}),
		root: root,
		collapseFirst: false
	});
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		sm, {
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
			header: '流程标题',
			dataIndex: 'flowtitle',
			hidden: true
		},{
			id: 'title',
			header: '主题',
			dataIndex: 'title',
			width: 120
		},{
			id: 'flowno',
			header: '文件编号',
			dataIndex: 'flowno',
			width: 80
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
			header: '发送人意见',//签署意见',
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
			header: '发起状态',
			dataIndex: 'status',
			width: 80,
			renderer: function(value){
				return value == '2' ? '处理完毕！' : '处理中...';
			}
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
		{name: 'flowno', type:'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: insBean,
			business: "flwFrameMgm",
			method: "getFlwInsBySearchRoles"
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
	
	ds.on('load', function(){
		exportFilter = ds.baseParams.params;
		if (!exportFilter) {
			exportFilter = "1=1";
		}
		if(this.getCount()>0){
			grid.getSelectionModel().selectFirstRow();	
		}
	});
	
	var changeBtn = new Ext.Button({
		text:'展开',
		iconCls:'add',
		handler:function(){
			if(treePanel.collapsed&&parent.api.collapsed){
				treePanel.expand();
				parent.api.expand();
				this.setText('展开');
				this.setIconClass('add');
			}else{
				treePanel.collapse();
				parent.api.collapse();
				this.setText('还原');
				this.setIconClass('remove');
			}
		}
	});
	
	var lookPersonBtn = new Ext.Button({
		text: '查看员工工作情况',
		iconCls: 'pasteUser', pressed: true,
		handler: userFlowInfo
	});
	
	var fileSortCombo = new Ext.form.ComboBox({
		name : 'fileSortCombo',
		store : fileSortDs,
		mode : 'local',
		triggerAction : 'all',
		valueField : 'k',
		displayField : 'v',
		lazyRender : false,
		lazyInit : false,
		readOnly : true,
		value: 'all',
		width:100,
		listeners: {
			'select': doTimeQuery
		}
	});
	
	var flowFileBtn = new Ext.Button({
		id: 'flow_file',
		text: '流程文件',
		iconCls: 'word',
		handler: gridHandler
	});
	
	var businessDateBtn = new Ext.Button({
		id: 'business_data',
		text: '业务数据',
		iconCls: 'select',
		handler: gridHandler	
	});
	
	var flowAffixBtn = new Ext.Button({
		id: 'flow_affix',
		text: '流程附件',
		iconCls: 'copyUser',
		handler: gridHandler
	});
	userCombo = new Ext.form.ComboBox({
		id : 'send_combo',
		fieldLabel : '发起人',
		disabled: true, 
		readOnly : true,
		width:80,
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		typeAhead : true,
		triggerAction : 'all',
		store : fqrSt,
		lazyRender : true,
		listClass : 'x-combo-list-small',
		anchor : '95%'
	});
	deptCombo = new Ext.form.ComboBox({
		id : 'deptid_combo',
		fieldLabel : '部门',
		valueField : 'k',
		displayField : 'v',
		mode : 'local',
		width:100,
		typeAhead : true,
		triggerAction : 'all',
		store : unitSt,
		lazyRender : true,
		listClass : 'x-combo-list-small',
		anchor : '95%',
		listeners:{
			'collapse':function(com){
	        	userCombo.clearValue();
	        	userCombo.focus(true);
	        	userCombo.setDisabled(false);
			    //获取用户
				DWREngine.setAsync(false);
			 	baseDao.getData("select userid,realname from rock_user where dept_id='"+com.value+"'",function(list){  
					user_Array_q.splice(0,user_Array_q.length)
					for(i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						user_Array_q.push(temp);
					}
			    });
			 	DWREngine.setAsync(true);
	 			fqrSt.loadData(user_Array_q);
    		}
    	}
	});

	var exportExcelBtn = new Ext.Button({
		id : 'export',
		text : '导出数据',
		tooltip : '导出数据到Excel',
		cls : 'x-btn-text-icon', 
		icon : 'jsp/res/images/icons/page_excel.png',
		handler : function() {
			var orderBy = ds.getSortState().field + " " + ds.getSortState().direction;
			var openUrl = CONTEXT_PATH + "/servlet/FlowStatisticsServlet?ac=exportData&businessType="
				+ "exportTaskView&whereStr=" + encodeURIComponent(exportFilter) + "&orderBy=" + orderBy;
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}
	});

	var grid = new Ext.grid.GridPanel({
		id: 'grid',
		ds: ds,
		cm: cm,
		sm: sm,
		border: false, 
		tbar : [flowFileBtn, '-', businessDateBtn, '-', flowAffixBtn, '-', '文件日期：', fileSortCombo, '-',
			exportExcelBtn, '->', {text : '查询', iconCls : 'btn', handler : showWindow}, '-', changeBtn],
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
        }),
        listeners: {
        	'rowdblclick': function(){
        		var record = Ext.getCmp('grid').getSelectionModel().getSelected();
        		showFlowFile(record.get('insid'), record.get('title'));
        	}
        }
	});
	
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});

	var tabPanel = new Ext.TabPanel({
		activeTab: 1,
		deferredRender: true, region: 'center',
		plain: true,
		border: false,
		forceFit: true,
		items: [{
			id: 'flowed',
			title: '已处理流程',
			layout: 'fit',
			iconCls: 'finish'
		}, {
			id: 'flowing',
			title: '处理中流程',
			layout: 'fit',
			iconCls: 'refresh'
		}],
		listeners: {
			tabchange : function(tp, p){
				if (p.id == 'flowing'){
					app_type = " and status='0'";
				} else if (p.id == 'flowed'){
					app_type = " and status='2'";
				}
				p.add(grid);
				p.doLayout();
				
				fileSortCombo.setValue('all');
				var whereStr = params + app_type;
				ds.baseParams.params = "whereStr`" + whereStr +";flowid`"+app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;//+todaySQL;

				if ('-1' != app_flowid){
					timeParams = params+app_type+" and flowid='"+app_flowid+"'";
				} else {
					timeParams = params+app_type;
				}
				
				ds.load({
					params:{
						start: 0,
						limit: PAGE_SIZE
					}
				});
			}
		}
	});
	
	var cmLog = new Ext.grid.ColumnModel([
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
			renderer: formatDate
		},{
			id: 'fromname',
			header: '发送人',
			dataIndex: 'fromname',
			width: 80
		},{
			id: 'notes',
			header: '发送人意见',//签署意见',
			dataIndex: 'notes',
			width: 300,
			renderer: function(value){
				if (value.length > 30) return value.substring(0, 25)+'.....详细'
				return value;
			}
		},{
			id: 'ftype',
			header: '处理说明',
			dataIndex: 'ftype',
			width: 150,
			renderer: getFType,
			hidden: true
		},{
			id: 'orgname',
			header: '受理人部门',
			dataIndex: 'orgname',
			width: 80
		},{
			id: 'posname',
			header: '受理人岗位',
			dataIndex: 'posname',
			width: 80
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
			id: 'fromnode',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'flag',
			header: '状态',
			dataIndex: 'flag',
			width: 60,
            renderer : function(value) {
				return ('0' == value || '-1' == value ? '未完成' : '完成');
			}
		}
	]);
	cmLog.defaultSortable = true;
	
	var ColumnsLog = [
		{name: 'logid', type: 'string'},
		{name: 'insid', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromname', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'orgname', type: 'string'},
		{name: 'posname', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'toname', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'flag', type: 'string'}
	];
	
	var dsLog = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: insBean,
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
			id: 'logid'
		}, ColumnsLog),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	dsLog.setDefaultSort('ftime', 'asc');
	
	var logGrid = new Ext.grid.GridPanel({
		ds: dsLog,
		cm: cmLog,
		title: '流程详细流转日志',
		collapsible:true,titleCollapse:true,
		border: false, region: 'south',
		header: true, stripeRows: true,
		autoScroll: true,
		loadMask: true,
		height: 300,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsLog,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items : [treePanel,
			{
				border : false,
				region : 'center',
				layout : 'border',
				items : [tabPanel, logGrid]
			}]
	});
	
	//buildFrameTree();
	//默认加载已处理的所有流程
	ds.baseParams.params = "whereStr`" + "ftype like '%A' and ftype<>'TA' and status='0'"
		+ ";flowid`" + "-1" + ";frameid`" + "-1" + ";userid`" + USERID;
	ds.load({
		params:{
			start: 0,
			limit: PAGE_SIZE
		}
	});
	
	treePanel.on('click', function(node, e){
		fileSortCombo.setValue('all');
		if (node.attributes.nodeType == 'flow'){
			app_flowid = node.id;
			app_flowid_temp = node.id;
			ds.baseParams.params = "whereStr`" + params + app_type + ";flowid`" + app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;
			timeParams = params+app_type+" and flowid='"+app_flowid+"'";
		} else if (node.attributes.nodeType == 'document'){
			app_flowid_temp = "0";
			app_frameid = node.id;
			var whereStr = params+app_type;
			ds.baseParams.params = "whereStr`" + whereStr + ";flowid`" + app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;
			timeParams = params+app_type;
		} else if (node.attributes.nodeType == 'root'){
			app_flowid_temp = "-1";
			var whereStr = params+app_type;
			ds.baseParams.params = "whereStr`" + whereStr + ";flowid`" + app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;
			timeParams = params+app_type;
		}
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});

		var record = logGrid.getSelectionModel().getSelected();
		if (record){
			var _insid = record.get('insid');
			logGrid.setTitle(''+record.get('title')+' - 流程详细流转日志');
			dsLog.baseParams.params = "insid='"+_insid+"' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'";
			dsLog.load({params: {start: 0, limit: PAGE_SIZE}});
		} else {
			dsLog.removeAll();
		}
	});
	
	sm.on('selectionchange', function(){
		var record = sm.getSelected();
		if (record){
			var _insid = record.get('insid');
			logGrid.setTitle(''+record.get('title')+' - 流程详细流转日志');
			dsLog.baseParams.params = "insid='"+_insid+"' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'";
			dsLog.load({
				params: {
			    	start: 0,
			    	limit: PAGE_SIZE
		    	}
			});
		}
	});
	
	grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("5" == columnIndex){
			if(notesTip2.findById('title_id')) notesTip2.remove('title_id');
			notesTip2.add({
				id: 'title_id', 
				html: grid.getStore().getAt(rowIndex).get('title')
			});
			point = e.getXY();
			notesTip2.showAt([point[0], point[1]]);
		}
	});
	
	var notesTip2 = new Ext.ToolTip({
		width: 200,
		target: grid.getEl()
	});
	
	var notesTip = new Ext.ToolTip({
		title: '发送人意见',//签署意见',
		width: 200,
		target: logGrid.getEl()
	});
	
	logGrid.on('cellclick', function(_grid, _rowIndex, _columnIndex, e){
		if ("5" == _columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: _grid.getStore().getAt(_rowIndex).get('notes')
			});
			notesTip.showAt(e.getXY());
		}
	});
	
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
				baseDao.queryWhereOrderBy(bean, 'frameid = \''+frame_list[i].frameid+'\'', 'flowtitle', function(flow_list){
					for (var j = 0; j < flow_list.length; j++) {
						treeNode.appendChild(
							new Ext.tree.TreeNode({
								id: flow_list[j].flowid,
								text: flow_list[j].flowtitle,
								qtip: flow_list[j].flowtitle,
								iconCls: 'flow',
								type: 'flow'
							})
						);
					}
				});
				DWREngine.setAsync(true);
				root.appendChild(treeNode);
			}
			root.expand();
			treePanel.getEl().unmask();
		});
	}
	
	function clearChildNodes(node){
		if (node.childNodes.length > 0){
			node.childNodes[0].remove();
			clearChildNodes(node);
		}
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
	
	dsAdjunct = new Ext.data.Store({
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
	
	gridAdjunct = new Ext.grid.GridPanel({
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
	
	function doTimeQuery(){
		if ('-1' != timeParams){
			var type = this.getValue();  //使用下拉框选择文件的方法
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
						+" and to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')"
			} else if ('month' == type){
				sql += " and ftime between to_date('"+month_begin_day+"','YYYY-MM-DD')"
						+" and to_date('"+today+" 23:59:59','YYYY-MM-DD hh24:mi:ss')"
			} else if ('all' == type){
				// do nothing...
			}
			
			var whereStr = timeParams+sql;
			ds.baseParams.params = "whereStr`" + whereStr + ";flowid`" + app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;
			ds.load({
				params:{
					start: 0,
					limit: PAGE_SIZE
				}
			});
		} else {
			Ext.example.msg('提示', '请先选择左边的流程结构树!');
		}
	}
	formPanel = new Ext.FormPanel({
	    header: false, border: false, autoScroll: true,
	    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
	    items: [{
	    	xtype: 'fieldset',
			title: '字段查询',
	      	border: true,
	      	layout: 'table',
	      	layoutConfig: {columns: 1},
	      	defaults: {bodyStyle:'padding:1px 1px'},
	      	items: [{
				layout: 'column',
				border: false,
				width: 420,
				items:[{
					layout: 'form', columnWidth: .6, bodyStyle: 'border: 1px;',
					items:[
						new Ext.form.DateField({
							id: 'date_begin',
							fieldLabel: '发送时间',
							format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
						})
					]
				},{
					layout: 'form', columnWidth: .4, bodyStyle: 'border: 1px;',
					items:[
						new Ext.form.DateField({
							id: 'date_end',
							hideLabel: true,
							format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
						})
					]
				}]
			},{
				layout: 'form',
				border: false,
				width: 400,
				items: [{
					xtype: 'textfield',
					id: 'title',
					fieldLabel: '主题',
					width: 183
				}]
			},{
				layout: 'form',
				border: false,
				width: 400,
				items: [deptCombo]
			},{
				layout: 'form',
				border: false,
				width: 400,
				items: [userCombo]
			}]
		}],
		bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery
		}]
	});
});

function displayOCX(flag){
	var ocxDom = document.getElementById('TANGER_OCX');
	flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none';
}

var waitCm = new Ext.grid.ColumnModel([
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
		width: 120
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
		id: 'fromname',
		header: '发送人',
		dataIndex: 'fromname',
		width: 80
	},{
		id: 'ftype',
		header: '处理说明',
		dataIndex: 'ftype',
		width: 60,
		renderer: function(value){
			for (var i = 0; i < F_TYPE.length; i++) {
				if (F_TYPE[i][0] == value) return F_TYPE[i][1];
			}
		}
	},{
		id: 'fromnode',
		header: '发送人ID',
		dataIndex: 'fromnode',
		hidden: true
	},{
		id: 'toname',
		header: '接收人',
		dataIndex: 'toname',
		width: 80
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
		header: '发起状态',
		dataIndex: 'status',
		width: 80,
		renderer: function(value){
			return value == '2' ? '处理完毕！' : '处理中...';
		}
	},{
		id: 'nodeid',
		header: '节点ID',
		dataIndex: 'nodeid',
		hidden: true
	}
]);
waitCm.defaultSortable = true;

var waitColumns = [
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
	{name: 'nodeid', type: 'string'}
];

var waitDs = new Ext.data.Store({
	baseParams: {
		ac: 'list',
		bean: insBean,
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
		id: 'logid'
	}, waitColumns),
	remoteSort: true,
	pruneModifiedRecords: true
});
waitDs.setDefaultSort('ftime', 'desc');

var waitGrid = new Ext.grid.GridPanel({
	ds: waitDs,
	cm: waitCm,
	split: true, stripeRows: true,
	collapsible: true,
	animCollapse: true,
	border: false,
	layout: 'fit',
	header: false,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	bbar: new Ext.PagingToolbar({
        pageSize: PAGE_SIZE,
        store: waitDs,
        displayInfo: true,
        displayMsg: ' {0} - {1} / {2}',
        emptyMsg: "无记录。"
    })
});

var waitMenu = new Ext.menu.Menu({id: 'gridMenu'});
waitGrid.on('rowcontextmenu', function(_grid, _rowIndex, _e){
	_e.stopEvent();
	_grid.getSelectionModel().selectRow(_rowIndex);
	var record = _grid.getSelectionModel().getSelected();
	waitMenu.removeAll();
	waitMenu.addMenuItem({
		state: 'flow_file',
		text: '　流程文件',
		iconCls: 'word',
		value: record,
		handler: gridHandler
	});
	waitMenu.addMenuItem({
		state: 'flow_module',
		text: '　业务数据',
		iconCls: 'select',
		value: record,
		handler: gridHandler
	});
	waitMenu.addMenuItem({
		state: 'flow_adjunct',
		text: '　流程附件',
		iconCls: 'copyUser',
		value: record,
		handler: gridHandler
	});
	waitMenu.showAt(_e.getXY());
});


var userTabPanel = new Ext.TabPanel({
	activeTab: 0,
	deferredRender: true,
	height: 240,
	minSize: 100,
	maxSize: 460,
	plain: true,
	border: false,
	region: 'center',
	forceFit: true,
	tabPosition: 'bottom',
	tbar: ['-',
		'<font color=#15428b>员工名：</font>',
		{
			xtype: 'trigger',
			id: 'realname', 
			triggerClass: 'x-form-date-trigger',
			readOnly: true, selectOnFocus: true,
			width: 125, allowBlank: false,
			onTriggerClick: showWin
		}, {xtype: 'textfield', id: 'userid', hidden: true}, '-',
		'<font color=#15428b>时间：</font>',
		{
			xtype: 'datefield',
			id: 'bDate', name: 'bDate', format: 'Y-m-d'
		}, '-',{
			xtype: 'datefield',
			id: 'eDate', name: 'eDate', format: 'Y-m-d'
		}, '-',
		{
			text: '查询', iconCls: 'btn', handler: function(){
				var userField = Ext.getCmp('userid');
				if (userField.getValue() != ''){
					loadWaitGrid(userTabPanel.getActiveTab(), userField.getValue(), Ext.getCmp('bDate'), Ext.getCmp('eDate'));
				} else {
					Ext.example.msg('提示', '请先选择员工！');
				}
			}
		}
	],
	items: [{
		id: 'wait',
		title: '待办事项', iconCls: 'title', layout: 'fit'
	},{
		id: 'worked',
		title: '已处理流程', iconCls: 'option', layout: 'fit'
	},{
		id: 'action',
		title: '本人发起流程', iconCls: 'returnTo', layout: 'fit'
	}],
	listeners: {
		tabchange : function(tp, p){
			var userField = Ext.getCmp('userid');
			if (userField.getValue() != ''){
				loadWaitGrid(p, userField.getValue(), Ext.getCmp('bDate'), Ext.getCmp('eDate'));
			} else {
				Ext.example.msg('提示', '请先选择员工！');
			}
		}
	}
});

function loadWaitGrid(p, userid, bd, ed){
	if ("" != bd.getValue && "" != ed.getValue() && bd.getValue() > ed.getValue()){
		Ext.example.msg('提示！', '查询结束日期必须大于开始日期！');
		return;
	}
	if (p.id == 'wait'){
		userParams = " tonode='"+userid+"' and flag=0";
	} else if (p.id == 'worked'){
		userParams = " (tonode='"+userid+"' or fromnode='"+userid+"') and flag=1";
	} else if (p.id == 'action'){
		userParams = " fromnode='"+userid+"' and ftype like '%A'";
	}
	var timeSql = '';
	var fBeginDate = formatDate(bd.getValue());
	var fEndDate = formatDate(ed.getValue());
	if ('' != fBeginDate && '' == fEndDate) {
		timeSql += " and ftime > to_date('"+fBeginDate+"','YYYY-MM-DD')";
	} else if ('' == fBeginDate && '' != fEndDate) {
		timeSql += " and ftime < to_date('"+fEndDate+"','YYYY-MM-DD')";
	} else if ('' != fBeginDate && '' != fEndDate) {
		timeSql += " and ftime between to_date('"+fBeginDate+"','YYYY-MM-DD') "
				+"and to_date('"+fEndDate+"', 'YYYY-MM-DD')";
	}
	p.add(waitGrid);
	p.doLayout();
	if ('-1' != userParams){
		waitDs.baseParams.params = userParams + timeSql;
		waitDs.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
	}
}

function userFlowInfo(){
	if(!flowInfoWin){
		flowInfoWin = new Ext.Window({	               
			title: '工作内容',
			width: 900, height: 512,
			layout: 'border', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [userTabPanel]
		});
	}
	flowInfoWin.show();
}

function showWin(){
	if(!userWindow){
		userWindow = new Ext.Window({
			title: '员工列表',
			iconCls: 'form',
			layout: 'border',
			width: 600, height: 300,
			modal: true,
			closeAction: 'hide',
			maximizable: true,
			plain: true,
			items: [userTreePanel, userGrid]
		});
		userWindow.on('hide', function(){
		});
		buildRoleTree();
	}
	userWindow.show();
	gridTitleBar.setText('<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>');
	userGrid.getStore().removeAll();
}

function showWindow(){
	if(!formWin){
		formWin = new Ext.Window({	               
			title: '查询数据',
			width: 500, minWidth: 500, height: 240,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [formPanel]
		});   
 	}
 	formPanel.getForm().reset();
 	formWin.show();
}

function execQuery(){
	var form = formPanel.getForm(), queStr = '';
	if (form.isValid()){
		var tb = form.findField('date_begin');
		var te = form.findField('date_end');
		if ('' == tb.getValue() && '' != te.getValue()){
			queStr += 'ftime <= to_date(\'' + formatDate(te.getValue()) + '\',\'YYYY-MM-DD\')';
		} else if ('' != tb.getValue() && '' == te.getValue()){
			queStr += 'ftime >= to_date(\'' + formatDate(tb.getValue()) + '\',\'YYYY-MM-DD\')';
		} else if ('' != tb.getValue() && '' != te.getValue()){
			if (tb.getValue() > te.getValue()){
				Ext.example.msg('提示！', '发送时间：开始时间应该小于等于结束时间！');
				return;
			} else {
				queStr += 'ftime between to_date(\'' + formatDate(tb.getValue()) + '\',\'YYYY-MM-DD\')' 
						+ ' and to_date(\'' + formatDate(te.getValue())+ '\',\'YYYY-MM-DD\')'; 
			}
		}
		var title = form.findField('title');
		if ('' != title.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += 'title like \'%' + title.getValue() + '%\'';
		}
		var sendname = form.findField('send_combo');
		var depname = form.findField('deptid_combo');
		if ('' != depname.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += "orgname = '" + depname.getRawValue() + "'";
		}
		if ('' != sendname.getValue()){
			if ('' != queStr) queStr += ' and ';
			queStr += "fromname = '" + sendname.getRawValue() + "'";
		}
		if ('-1' != app_flowid) queStr += ' and flowid=\''+app_flowid+'\'';
		if ('' != queStr) queStr += ' and ';
		queStr += ' ftype like \'%A\' and ftype <> \'TA\''+app_type;
		
		ds.baseParams.params = "whereStr`" + queStr + ";flowid`" + app_flowid_temp + ";frameid`" + app_frameid + ";userid`" + USERID;
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		formWin.hide()
	}
}

function gridHandler(){
	var state = this.id;
	var record = Ext.getCmp('grid').getSelectionModel().getSelected();
	if(null==record||'null'==record) {
		Ext.example.msg('提示', '请选择一条流程！');
		return;
	} else {
		if ('flow_file' == state) {
			showFlowFile(record.get('insid'), record.get('title'));
		} else if ('business_data' == state) {
			showModule(record.get('insid'), record.get('title'));
		} else if ('flow_affix' == state) {
			showFlowAdjunct(record.get('insid'), record.get('title'));
		}
	}
}

//查看流程文档
function showFlowFile(_insid, _title){
	var firstFileItem = '';
	if(!fileWindow){
		docMenu = new Ext.menu.Menu({
		    id: 'mainMenu',
		    items: ['-'],
			listeners: {
				beforeshow: function(menu){displayOCX(true);},
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
					TANGER_OCX_OBJ.PrintOut();
				} else {
					Ext.example.msg('提示', '请先打开文档！');
				}
			}
		});
		
		fileWindow = new Ext.Window({	               
			title: '查看流程实例文档',
			iconCls: 'form',
			tbar: [menuBtn,'-',printDocBtn],
			width: document.body.clientWidth,
			height: document.body.clientHeight,
			modal: true,
			closeAction: 'hide',
			maximizable: false,
			resizable: false,
			plain: true,	                
			contentEl: TANGER_OCX,
			listeners:{'hide':function(){displayOCX(false);}}
		});
	}
	
	var filterFile=" filedate in( select filedate from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
	DWREngine.setAsync(false);
	baseDao.findByWhere2(insfileBean, "insid='"+_insid+"' and "+filterFile, function(list){
		if (list.length > 0){
			docMenu.removeAll();
			firstFileItem = list[0];
			for (var i = 0; i < list.length; i++) {
				docMenu.addItem(
					new Ext.menu.Item({
						text: list[i].filename,
						iconCls: 'word',
						value: list[i],
						handler: function(){
							fileWindow.setTitle('查看['+_title+this.text+'] - 流程实例文档');
							var _file = this.value;
							displayOCX(true);
							TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", _file.fileid);
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
	DWREngine.setAsync(true);
	
	fileWindow.on('show', function(){
		fileWindow.setTitle('查看['+_title+firstFileItem.filename+'] - 流程实例文档');
		displayOCX(true);
		TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", firstFileItem.fileid);
		document.getElementById('TANGER_OCX').height='519'	
	});
	
	document.getElementById('TANGER_OCX').height=1
	fileWindow.show();
}
	
//查看流程关联的业务数据
function showModule(_insid, _title){
	var firstBusinessDate = null;   //第一个业务数据
	
	moduleWindow = new Ext.Window({	               
		title: '查看流程业务数据',
		iconCls: 'title',
		tbar: [],
		width: 800,
		height: 512,
		modal: true,
		closeAction: 'hide',
		maximizable: false,
		resizable: false,
		plain: true
	});
	
	moduleWindow.on('render', function(){
		DWREngine.setAsync(false);
		baseDao.findByWhere2(insDataBean, "insid='"+_insid+"'", function(list){
			if (list.length > 0){
				firstBusinessDate = list[0];
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
		DWREngine.setAsync(false);	
	})
	
	moduleWindow.setTitle('查看['+_title+'] - 流程业务数据');
	
	moduleWindow.on('show', function(){
		if(firstBusinessDate!=null){
			moduleWindow.load({
				url: BASE_PATH + 'jsp/flow/queryDispatcher.jsp',
				params: 'params='+firstBusinessDate.paramvalues+'&url='+firstBusinessDate.url+'&funname='+firstBusinessDate.funname
						+'&business='+firstBusinessDate.businessname+'&method='+firstBusinessDate.methodname+'&table='+firstBusinessDate.tablename,
				text: '<b>Loading...</b>'
			});
		}
	});
	
	moduleWindow.show();
}

// 查看流程附件
function showFlowAdjunct(_insid, _title){
	if (!adjunctWindow){
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
	}
	
	adjunctWindow.setTitle('查看['+_title+'] - 流程附件');
	
	adjunctWindow.show();
	
	//流程实例【附件】加载
	dsAdjunct.baseParams.params = "insid='"+_insid+"'";
	dsAdjunct.load();
}

function formatDate(value){ return value ? value.dateFormat('Y-m-d') : ''; };

function getFType(type){
	for (var i = 0; i < F_TYPE.length; i++) {
		if (F_TYPE[i][0] == type) return F_TYPE[i][1];
	}
}