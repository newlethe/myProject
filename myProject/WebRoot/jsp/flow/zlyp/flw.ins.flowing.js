var insBean = "com.sgepit.frame.flow.hbm.TaskView";;
var logBean = "com.sgepit.frame.flow.hbm.LogView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
//var params = "fromnode='"+_userid+"' and ftype like '%A' and status='0' and isyp='1' and unitid='"+CURRENTAPPID+"'";
var params = "fromnode='"+_userid+"' and ftype like '%A' and status='0' and isyp='1' ";
var dsFlowing, gridFlowing, gridMenuFlowing,paramsStr;
fixedFilterPart=params;
Ext.onReady(function(){
	var cmFlowing = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({width: 20	}), 
		{
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
			header: '发送时间',
			type: 'date',
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
		}
	]);
	cmFlowing.defaultSortable = true;
	
	var ColumnsFlowing = [
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
		{name: 'status', type: 'string'}
	];
	
	dsFlowing = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: insBean,
			business: business,
			method: listMethod,
			params:params
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'insid'
		}, ColumnsFlowing),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	dsFlowing.setDefaultSort('ftime', 'desc');
	ds=dsFlowing;//查询需要
	gridFlowing = new Ext.grid.QueryExcelGridPanel({
		id: 'my8',
		ds: ds,
		cm: cmFlowing,
		//sm: sm,
		region: 'center', 
		tbar: [],
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
			id: 'my014',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	grid=gridFlowing;//flw.ins.query.js中需要用到变量grid
	gridFlowing.on('rowcontextmenu', contextgridmenu);
	gridMenuFlowing = new Ext.menu.Menu({id: 'gridMenu'});
	
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
		items: [qPanel, gridFlowing, timeBar]
	});
	
	if(parent.westPanel&&parent.westPanel.getSelectionModel&&
		parent.westPanel.getSelectionModel().getSelectedNode){
		var node = parent.westPanel.getSelectionModel().getSelectedNode();
		if(node){
			dsFlowing.baseParams.params = params+" and xmbh='"+node.id+"'";
		}else{
			dsFlowing.baseParams.params = params;
		}
	}
	
	dsFlowing.load({
		params:{
			start: 0,
			limit: PAGE_SIZE
		}
	});			
	
	var notesTip2 = new Ext.ToolTip({
		width: 200,
		target: gridFlowing.getEl()
	});
	
	gridFlowing.on('cellclick', function(grid, rowIndex, columnIndex, e){
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
function contextgridmenu(_grid, _rowIndex, _e){
	_e.stopEvent();
	_grid.getSelectionModel().selectRow(_rowIndex);
	var record = _grid.getSelectionModel().getSelected();
	gridMenuFlowing.removeAll();
	gridMenuFlowing.addMenuItem({
		state: 'flow_log',
		text: '　流转日志',
		iconCls: 'refresh',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.addMenuItem({
		state: 'flow_file',
		text: '　流程文件',
		iconCls: 'word',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.addMenuItem({
		state: 'flow_adjunct',
		text: '　流程附件',
		iconCls: 'copyUser',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.addMenuItem({
		state: 'flow_module',
		text: '　业务数据',
		iconCls: 'select',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.addMenuItem({
		state: 'flow_remove',
		text: '　删除流程',
		iconCls: 'multiplication',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.addMenuItem({
		state: 'flow_reset',
		text: '　重置受理人',
		iconCls: 'pasteUser0',
		value: record,
		handler: gridHandler
	});
	gridMenuFlowing.showAt(_e.getXY());
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
	} else if ('flow_remove' == state) {
		removeFlow(record.get('insid'));
	} else if ('flow_reset' == state) {
		parent.resetRecipients(record.get('insid'), record.get('title'));
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
		}
		dsFlowing.baseParams.params = params+sql;
		dsFlowing.load({
			params:{
				start: 0,
				limit: PAGE_SIZE
			}
		});
}
function removeFlow(insid){
	baseDao.findByWhere2(logBean, "insid='"+insid+"'", function(list){
		if (list.length > 0 && list.length < 2) {
			Ext.Msg.show({
				title: '提示',
				msg: '您确定要删除流程吗？',
				icon: Ext.Msg.QUESTION,
				buttons: Ext.Msg.YESNO,
				fn: function(value){
					if ('yes' == value){
						flwInstanceMgm.deleteFlwInstance(insid, function(flag){
							if (flag) {
								Ext.example.msg('提示', '流程成功删除！');
								dsFlowing.baseParams.params = params+"";
								dsFlowing.load({
									params:{
										start: 0,
										limit: PAGE_SIZE
									}
								});
							}
						});
					}
				}
			});
		} else {
			Ext.Msg.show({
				title: '提示',
				msg: '该流程已被其它用户处理，不能删除！',
				icon: Ext.Msg.WARNING,
				buttons: Ext.Msg.OK
			});
		}
	});
}
