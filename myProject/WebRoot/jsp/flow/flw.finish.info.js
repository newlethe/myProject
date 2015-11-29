var bean = "com.sgepit.frame.flow.hbm.TaskView";
var insBean = "com.sgepit.frame.flow.hbm.FlwInstanceView";
var business = "baseMgm";
var listMethod = "findbysqlforlist";
var params = "select i.*, d.flowtitle, d.xmlname, d.state, d.frameid, row_number() over ( order by null ) rn from flw_instance i, flw_definition d where i.flowid = d.flowid and i.insid in (select distinct t.insid from task_view t where t.TONODE = '"+_userid+"' and flag = 1 and status = 2)";
fixedFilterPart=params;
var ds, gird,paramsStr;
var orgdata='';
var Bill = new Array();
var formWin,formPanelQuery;
var flowtitle = new Ext.form.TextField({
	id: 'flowtitle', name: 'flowtitle',
	fieldLabel: "流程类型"
});

var title = new Ext.form.TextField({
	id: 'title', name: 'title',
	fieldLabel: "流程主题"
});
var doSelect = new Ext.Button({
	text: '查询',
	iconCls: 'btn',
	handler: selHandler
});
var formPanelQuery;
formPanelQuery = new Ext.FormPanel({
    header: false, border: false, autoScroll: true,
    bodyStyle: 'padding:10px 10px;', iconCls: 'icon-detail-form', labelAlign: 'left',
	bbar: ['->',doSelect
	]
});
var fieldSet = new Ext.form.FieldSet({
	title: '字段查询',
     	border: true,
     	layout: 'table',
     	layoutConfig: {columns: 1},
     	defaults: {bodyStyle:'padding:1px 1px'}
});
fieldSet.add(new Ext.Panel({
	layout: 'form',
	border: false,
	width: 400,
	items: [flowtitle]
}));
fieldSet.add(new Ext.Panel({
	layout: 'form',
	border: false,
	width: 400,
	items: [title]
}));
formPanelQuery.add(fieldSet);
Ext.onReady(function(){

	DWREngine.setAsync(false);
//	zlMgm.getUserOrgid(USERID,function(list) {
//		for (i = 0; i < list.length; i++) {
//			var temp = new Array();
//			temp.push(list[i].orgid);
//			//temp.push(list[i].PARENT);
//			Bill.push(temp);
//		}
//		
//	});
//	for(j=0;j<Bill.length;j++){
//		if(j != 0) orgdata = orgdata + SPLITString
// 		 orgdata = orgdata + Bill[j];
// 	}
	orgdata = USERDEPTID;

	DWREngine.setAsync(true);

	var cm = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}), {
			id: 'insid',
			header: '流程实例ID',
			dataIndex: 'INSID',
			hidden: true
		},{
			id: 'flowtitle',
			header: '流程类型',
			type: 'string',
			dataIndex: 'FLOWTITLE',
			width: 120
		},{
			id: 'title',
			header: '主题',
			type: 'string',
			dataIndex: 'TITLE',
			width: 120
		},{
			id: 'flowno',
			header: '文件编号',
			dataIndex: 'FLOWNO',
			width: 120
		},{
			id: 'status',
			header: '流程状态',
			dataIndex: 'status',
			hidden: true
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'INSID', type: 'string'},
		{name: 'FLOWTITLE', type: 'string'},
		{name: 'TITLE', type: 'string'},
		{name: 'FLOWNO', type: 'string'},
		{name: 'STATUS', type: 'string'}
	];
	
	ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: insBean,
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
			id: 'INSID'
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('FLOWTITLE', 'desc');
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
		id: 'my5',
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
			id: 'my011',
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	grid.on('celldblclick', function(grid, rowIndex, columnIndex){
		var record = grid.getStore().getAt(rowIndex);
		parent.showLogWin(record.get('INSID'), record.get('TITLE'));
	});
	grid.on('cellclick', function(grid, rowIndex, columnIndex, e){
		if ("3" == columnIndex){
			if(notesTip.findById('notes_id')) notesTip.remove('notes_id');
			notesTip.add({
				id: 'notes_id', 
				html: grid.getStore().getAt(rowIndex).get('TITLE')
			});
			point = e.getXY();
			notesTip.showAt([point[0], point[1]]);
		}
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [ grid]
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
				parent.showLogWin(record.get('INSID'), record.get('TITLE'));
			} else if ("menu_file" == state){
				parent.showFlowFile(record.get('INSID'), record.get('TITLE'));
			} else if ("menu_adjunct" == state){
				parent.showFlowAdjunct(record.get('INSID'), record.get('TITLE'));
			} else if ("menu_module" == state){
				parent.showModule(record.get('INSID'), record.get('TITLE'));
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
function selHandler(){
		sql = params;
		var fFlowtitle = flowtitle.getValue();
		if ('' != fFlowtitle){
			sql += " and flowtitle like '%"+fFlowtitle+"%'";
		}
		var fTitle = title.getValue();
		if ('' != fTitle){
			sql += " and title like '%"+fTitle+"%'";
		}
		ds.baseParams.params = sql;
		ds.load({
			params: {
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
		});
		formPanelQuery.getForm().reset();
		formWin.hide();
}
  	