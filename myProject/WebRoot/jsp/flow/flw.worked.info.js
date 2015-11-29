//var bean = "com.sgepit.frame.flow.hbm.FlwLogView";
var bean = "com.sgepit.frame.flow.hbm.TaskView";
var insBean = "com.sgepit.frame.flow.hbm.FlwInstanceView";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
//var params = "(tonode='"+_userid+"' or fromnode='"+_userid+"') and flag=1";
var params = "tonode='"+_userid+"' and flag=1";
fixedFilterPart=params;
var ds, gird,paramsStr;
var formWin;
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
			id: 'flowtitle',
			header: '流程类型',
			type: 'string',
			dataIndex: 'flowtitle',
			width: 120
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
			header: '处理类型',
			dataIndex: 'ftype',
			hidden: true,
			renderer: function(value){
				for (var i = 0; i < F_TYPE.length; i++) {
					if (F_TYPE[i][0] == value) return F_TYPE[i][1];
				}
			}
		},{
			id: 'nodename',
			header: '处理说明',
			dataIndex: 'nodename',
			width: 80
		},{
			id: 'fromnode',
			header: '发送人ID',
			dataIndex: 'fromnode',
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
		{name: 'flowtitle', type: 'string'},
		{name: 'title', type: 'string'},
		{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'ftype', type: 'string'},
		{name: 'fromnode', type: 'string'},
		{name: 'tonode', type: 'string'},
		{name: 'notes', type: 'string'},
		{name: 'flag', type: 'string'},
		{name: 'nodename', type: 'string'},
		{name: 'nodeid', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: params
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
	ds.setDefaultSort('ftime', 'desc');
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
			id: 'remove_tozl', text: '　移交当前资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}, {
			id: 'remove_all', text: '　移交全部资料', iconCls: 'print',hidden:false,
			handler: controlHandler
		}]
	}
});	
	grid = new Ext.grid.QueryExcelGridPanel({
		id: 'my3',
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
			id: 'my009',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })        
        
	});
	
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	
//	grid.on('click', function(){if (!qPanel.collapsed) qPanel.collapse();});
	
	grid.on('celldblclick', function(grid, rowIndex, columnIndex){
		var record = grid.getStore().getAt(rowIndex);
		parent.showLogWin(record.get('insid'), record.get('title'));
	});
	
	grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("4" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('title')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [grid]
	});
	grid.getTopToolbar().add(controlMenu);
	ds.load({
		params: {
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
	});
	
	var notesTip = new Ext.ToolTip({
		width: 200,
		target: grid.getEl()
	});
	
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		gridMenu.removeAll();
		gridMenu.addMenuItem({
			id: 'menu_query',
			text: '　查询',
			value: record,
			iconCls: 'form',
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_log',
			text: '　流转日志',
			value: record,
			iconCls: 'refresh',
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_file',
			text: '　流程文件',
			iconCls: 'word',
			value: record,
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_adjunct',
			text: '　流程附件',
			iconCls: 'copyUser',
			value: record,
			handler: toHandler
		});
		gridMenu.addMenuItem({
			id: 'menu_module',
			text: '　业务数据',
			iconCls: 'select',
			value: record,
			handler: toHandler
		});
		gridMenu.showAt(e.getXY());
	}
	
	function toHandler(){
		var state = this.id;
		var record = this.value;
		if ("" != state){
			if ("menu_query" == state){
				showWindowQuery();
			} else if ("menu_log" == state){
				parent.showLogWin(record.get('insid'), record.get('title'));
			} else if ("menu_file" == state){
				parent.showFlowFile(record.get('insid'), record.get('title'));
			} else if ("menu_adjunct" == state){
				parent.showFlowAdjunct(record.get('insid'), record.get('title'));
			} else if ("menu_module" == state){
				parent.showModule(record.get('insid'), record.get('title'));
			}
		}
	}
	
});
function controlHandler(){
	var _type = this.id;
	if(_type=="remove_all"&&parent.showRemoveFiles) {//parent jsp is flw.main.frame.jsp
		parent.showRemoveFiles(grid.getStore());	
	}else if  (grid.getSelectionModel().getSelected()){
		var record = grid.getSelectionModel().getSelected();
		var _insid = record.get('insid'), _title = record.get('title');
		if(!_insid && !_title){
			_insid = record.get('INSID'); 
			_title = record.get('TITLE');
		}
		if ('log' == _type) {
			parent.showLogWin(_insid, _title);
		} else if ('file' == _type) {
			parent.showFlowFile(_insid, _title);
		} else if ('adjunct' == _type) {
			parent.showFlowAdjunct(_insid, _title);
		} else if ('module' == _type) {
			parent.showModule(_insid, _title);
		} else if ('remove_tozl' == _type) {
			parent.showRemoveFiles(grid.getStore(),_insid, _title);
		} 
	} else {
		Ext.example.msg('提示', '请先选择一条数据！');
	}
}
function showWindowQuery(){
		if(!formWin){
		formWin = new Ext.Window({	               
			title: '查询数据',
			width: 600, minWidth: 460, height: 300,
			layout: 'fit', iconCls: 'form', closeAction: 'hide',
			border: false, constrain: true, maximizable: false, modal: true,
			items: [formPanelQuery]
		});   
    	}
    	formWin.show();
  	}