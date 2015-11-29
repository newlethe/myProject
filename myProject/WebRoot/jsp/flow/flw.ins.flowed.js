var insBean = "com.sgepit.frame.flow.hbm.TaskView";;
var logBean = "com.sgepit.frame.flow.hbm.LogView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var params = "fromnode='"+_userid+"' and ftype like '%A' and status='2'";
if(USERNAME == 'system'){
    //如果当前用户为系统管理员，则开放查询所有流程
    params = "ftype like '%A' and status='2'";
}
var ds, grid, filesWin,paramsStr;
fixedFilterPart=params;
Ext.onReady(function(){
	
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
			type: 'string',
			dataIndex: 'title',
			width: 120
		},{
			id: 'ftime',
			type: 'date',
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
		},{
			id: 'removeinfo',
			header: '资料移交',
			dataIndex: 'removeinfo',
			width: 80,
			hidden:false,
			renderer: function(value){
				if(value=='0'){
					return '<font color=red>未移交</font>'
				}else if(value=='-1'){
					return '<font color=blue>部分移交</font>'
				}else if(value=='1'){
					return '<font color=green>全部移交</font>'
				}else if(value=='2'){
					return '<font color=gray>没有资料</font>'
				}else{
					return '<font color=gray>没有资料</font>'
				}
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
		{name: 'removeinfo', type: 'string'},
		{name: 'flowno', type: 'string'}
	];
	
	ds = new Ext.data.Store({
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
			id: 'insid'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('ftime', 'desc');
	var newFlow = new Ext.Button({
		text: '发起流程',
		iconCls: 'returnTo',
		handler: fireFlow
	});	
var controlMenu = new Ext.Button({
	text: '相关操作', iconCls: 'option',
	menu: {
		items: [{
			id: 'log', text: '　流转日志', iconCls: 'refresh',
			handler: controlHandler
		}, {
			id: 'file', text: '　流程文件', iconCls: 'word',
			handler: controlHandler
		}, {
			id: 'adjunct', text: '　流程附件', iconCls: 'copyUser',
			handler: controlHandler
		}, {
			id: 'module', text: '　业务数据', iconCls: 'select',
			handler: controlHandler
		}, {
			id: 'flow_remove', text: '　删除流程', iconCls: 'multiplication',
			disabled: type == 'flowed' ? true : false,
			handler: controlHandler
		}, {
			id: 'remove_tozl', text: '　移交当前资料', iconCls: 'print',
			disabled: type == 'flowing' ? true : false,hidden:false,
			handler: controlHandler
		}, {
			id: 'remove_all', text: '　移交全部资料', iconCls: 'print',
			disabled: type == 'flowing' ? true : false,hidden:false,
			handler: controlHandler
		}, {
			id: 'reset', text: '　重置受理人', iconCls: 'pasteUser0',
			disabled: type == 'flowed' ? true : false,
			handler: controlHandler
		}, {
			id: 'save_flw_title', text: '　修改主题', iconCls: 'save',
			disabled: type == 'flowed' ? true : false,
			handler: controlHandler
		}]
	}
});		
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	grid = new Ext.grid.QueryExcelGridPanel({
		id: 'my7',
		ds: ds,
		cm: cm,
		//sm: sm,
		region: 'center', 
		tbar: ["->"],
		split: true, 
		stripeRows: true,
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
			id: 'my013',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	sm.on('rowselect', function(sm) { // grid 行选择事件
		var record = grid.getSelectionModel().getSelected();				
		insid_file=record.get('insid');
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
		items: [ grid, timeBar]
	});
	grid.getTopToolbar().add(newFlow);
	grid.getTopToolbar().add(controlMenu);
	
	if (parent.FLOW_NODETYPE == "flow"){
		ds.baseParams.params = params+" and flowid='"+parent.FLOW_ID+"'";
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		params += " and flowid='"+parent.FLOW_ID+"'";
	}else if(parent.FLOW_NODETYPE == "document"){
		ds.baseParams.params = params+" and flowid in ("+parent.FLOW_IDS+")";
		ds.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
		params += " and flowid in ("+parent.FLOW_IDS+")";		
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
			if(!filesWin){
				filesWin = new Flw.FlwFilesWindow({})
			}
			filesWin.show(ds,record.get('insid'), record.get('title'));
		}
	}
	
	function doTimeQuery(){
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
function fireFlow(){
	if (parent.FLOW_ID != "-1"){
		parent.showFlow();
	} else {
		Ext.example.msg('提示', '请先选择流程类型！');
	}
}
function controlHandler(){
	var _type = this.id;
	if ('remove_all' == _type) {
		if(!window["filesWin"]||!(window["filesWin"].show)){
			window["filesWin"] = new Flw.FlwFilesWindow({});
		}
		window["filesWin"].show(ds);
	}else if (grid.getSelectionModel().getSelected()){
		var record = grid.getSelectionModel().getSelected();
		if ('log' == _type) {
			parent.showLogWin(record.get('insid'), record.get('title'));
		} else if ('file' == _type) {
			parent.showFlowFile(record.get('insid'), record.get('title'));
		} else if ('adjunct' == _type) {
			parent.showFlowAdjunct(record.get('insid'), record.get('title'));
		} else if ('module' == _type) {
			parent.showModule(record.get('insid'), record.get('title'));
		} else if ('flow_remove' == _type) {
			removeFlow(record.get('insid'));
		}  else if ('reset' == _type) {
			parent.resetRecipients(record.get('insid'), record.get('title'));
		} else if ('save_flw_title' == _type) {
			parent.saveFlwTitle(record.get('insid'), record.get('title'));
		} else if ('remove_tozl' == _type) {
			if(!window["filesWin"]||!(window["filesWin"].show)){
				window["filesWin"] = new Flw.FlwFilesWindow({});
			}
			window["filesWin"].show(ds,record.get('insid'), record.get('title'));
		}
	} else {
		Ext.example.msg('提示', '请先选择一条数据！');
	}
}