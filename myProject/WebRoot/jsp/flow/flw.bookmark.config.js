var nodeBean = "com.sgepit.frame.flow.hbm.FlwNodeView";
var commonBean = "com.sgepit.frame.flow.hbm.FlwCommonNode";
var BMData = new Array();
var CURRENT_FILE_ID = '-1', CURRENT_FILE_NAME = '-1';
var BKWin, BKGrid;
var CUURENT_GRID_ID = '-1';

Ext.onReady(function(){
	
	var docMenu = new Ext.menu.Menu({
        id: 'mainMenu',
        items: ['-'],
		listeners: {
			beforeshow: function(menu){ 
				if (TANGER_OCX_bDocOpen) {
					displayOCX(false); //infoWindow.show();
				}
			},
			beforehide: function(menu){ 
				if (TANGER_OCX_bDocOpen) {
					displayOCX(true); //infoWindow.hide();
				}
			}
		}
    });
	
	var menuBtn = new Ext.Button({
		text: '流程模板',
		iconCls: 'bmenu',
		menu: docMenu
	});
	
	var getBookMarkBtn = new Ext.Button({
		text: '获得文档书签',
		iconCls: 'getbookmark',
		disabled: true,
		handler: getBookMark
	});
	
	var nodeSave = new Ext.Button({
		id: 'nodeSave',
		text: '保存',
		iconCls: 'save',
		handler: doSave
	});
	
	var commonSave = new Ext.Button({
		id: 'commonSave',
		text: '保存',
		iconCls: 'save',
		handler: doSave
	});
	
	var mTitle = parent.FLOW_TITLE ? '<font color=#15428b>'+parent.FLOW_TITLE+'</font>' : '<font color=red>未选择流程</font>';
	
	var modelFilePanel = new Ext.Panel({
		region: 'center', layout: 'fit',
		header: false, border: false,
		split: true, height: 200,
    	tbar: ['<font color=#15428b>>>> </font>'+mTitle,'->',menuBtn,'-'],
		contentEl: 'ocxTab'
	});
	
	var bookmarkGrid = new Ext.grid.GridPanel({
		ds: new Ext.data.SimpleStore({
			fields: [{name: 'bookmark', type: 'string'}]
		}),
		cm: new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer({
				width: 20
			}), {
				id: 'bookmark',
				header: '书签',
				dataIndex: 'bookmark',
				width: .8
			}
		]),
		border: false, header: false,
		region: 'west',
		tbar: ['<font color=#15428b>>>> 模板书签</font>','->',getBookMarkBtn,'-'],
		autoScroll: true, split: true,
		collapseMode: 'mini',
		collapsible: true,
    	animCollapse: true,
    	margins:'0 0 5 0',
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
	    width: 200
	});
	
	var nodeSm = new Ext.grid.CheckboxSelectionModel();
	
	var nodeGrid = new Ext.grid.EditorGridPanel({
		id: 'nodeGrid',
		sm: nodeSm,
		ds: new Ext.data.Store({
			baseParams: {
				ac: 'list',
				bean: nodeBean,
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
				id: 'nodeid'
			}, [
				{name: 'nodeid', type: 'string'},
				{name: 'flowid', type: 'string'},
				{name: 'name', type: 'string'},
				{name: 'bookmark', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		}),
		cm: new Ext.grid.ColumnModel([
			nodeSm, {
				id: 'nodeid',
				header: '关键节点ID',
				dataIndex: 'nodeid',
				hidden: true
			}, {
				id: 'flowid',
				header: '流程ID',
				dataIndex: 'flowid',
				hidden: true
			}, {
				id: 'name',
				header: '节点名称',
				dataIndex: 'name',
				width: .3
			}, {
				id: 'bookmark',
				header: '书签名',
				dataIndex: 'bookmark',
				editor: new Ext.form.TriggerField({
					name: 'bookmark', 
					triggerClass: 'x-form-date-trigger',
					readOnly: false, selectOnFocus: true,
					width: 100, allowBlank: true,
					onTriggerClick: showBookMark
				}),
				width: .6
			}
		]),
		clicksToEdit: 1,
		region: 'center', margins:'0 0 5 0',
		tbar: ['<font color=#15428b>>>> 关键节点</font>','->',nodeSave,'-'],
		border: false, header: false,
		autoScroll: true, split: true,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	var commonNodeSm = new Ext.grid.CheckboxSelectionModel();
	
	var commonNodeGrid = new Ext.grid.EditorGridPanel({
		id: 'commonGrid',
		sm: commonNodeSm,
		ds: new Ext.data.Store({
			baseParams: {
				ac: 'list',
				bean: commonBean,
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
				id: 'cnodeid'
			}, [
				{name: 'cnodeid', type: 'string'},
				{name: 'nodeid', type: 'string'},
				{name: 'flowid', type: 'string'},
				{name: 'name', type: 'string'},
				{name: 'bookmark', type: 'string'}
			]),
			remoteSort: true,
			pruneModifiedRecords: true
		}),
		cm: new Ext.grid.ColumnModel([
			commonNodeSm, {
				id: 'cnodeid',
				header: '普通节点ID',
				dataIndex: 'cnodeid',
				hidden: true
			}, {
				id: 'nodeid',
				header: '关键节点ID',
				dataIndex: 'nodeid',
				hidden: true
			}, {
				id: 'flowid',
				header: '流程ID',
				dataIndex: 'flowid',
				hidden: true
			}, {
				id: 'name',
				header: '节点名称',
				dataIndex: 'name',
				width: .3
			}, {
				id: 'bookmark',
				header: '书签名',
				dataIndex: 'bookmark',
				editor: new Ext.form.TriggerField({
					name: 'bookmark', 
					triggerClass: 'x-form-date-trigger',
					readOnly: false, selectOnFocus: true,
					width: 100, allowBlank: true,
					onTriggerClick: showBookMark
				}),
				width: .6
			}
		]),
		clicksToEdit: 1,
		region: 'east', margins:'0 0 5 0',
		tbar: ['<font color=#15428b>>>> 普通节点</font>','->',commonSave,'-'],
		border: false, header: false,
		autoScroll: true,split: true,
		collapseMode: 'mini',
		collapsible: true,
    	animCollapse: true,
    	width: 285,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	var bookmarkMain = new Ext.Panel({
		region: 'south', layout: 'border',
		header: false, border: false,
		split: true,
		collapseMode: 'mini',
		collapsible: true,
    	animCollapse: true,
    	height: 300,
		items: [bookmarkGrid, nodeGrid, commonNodeGrid]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [modelFilePanel, bookmarkMain]
	});
	
	nodeGrid.getSelectionModel().on('beforerowselect', function(sm){
		var _records = commonNodeGrid.getStore().getModifiedRecords();
		if (_records.length > 0) {
			displayOCX(false);
			Ext.Msg.show({
				title: '警告',
				msg: '【普通节点】有未保存书签！',
				icon: Ext.Msg.WARNING,
				buttons: Ext.Msg.OK,
				fn: function(value){ if ('ok' == value) displayOCX(true); }
			});
			return false;
		}
	});
	
	nodeGrid.getSelectionModel().on('rowselect', function(sm){
		var _nodeid = sm.getSelected().get('nodeid');
		commonNodeGrid.getStore().baseParams.params = "flowid='"+parent.FLOW_ID+"' and nodeid='"+_nodeid+"'";
		commonNodeGrid.getStore().load();
	});
	
	nodeGrid.on('rowclick', function(grid, rowIndex, e){
		CUURENT_GRID_ID = grid.getId();
	});
	
	commonNodeGrid.on('rowclick', function(grid, rowIndex, e){
		CUURENT_GRID_ID = grid.getId();
	});
	
	if (parent.FLOW_ID){
		baseDao.findByWhere2("com.sgepit.frame.flow.hbm.FlwFiles", "flowid='"+parent.FLOW_ID+"'", function(list){
			for (var i = 0; i < list.length; i++) {
				if (list.length > 0){
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
									document.getElementById('TANGER_OCX').height='519'
									getBookMarkBtn.setDisabled(false);
									CURRENT_FILE_ID = _file.fileid;
									CURRENT_FILE_NAME = _file.filename;
								}
							})
						);
					}
				} else { menuBtn.setDisabled(true); }
			}
		});
		initOthers();
	}
	
	function initOthers(){
		nodeGrid.getStore().baseParams.params = "flowid='"+parent.FLOW_ID+"'";
		nodeGrid.getStore().load();
	}
	
	function displayOCX(flag){
		var ocxDom = document.getElementById('ocxTab');
		flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
	}
	
	function findTheSame(value){
		for (var i=0; i<BMData.length; i++){
			if (BMData[i][0] == value) return true;
		}
		return false;
	}
	
	function getBookMark(){
		var isAdd = false;
		var ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
		for (var i=0; i<ocxBookMarks.Count; i++){
			var bookmark = ocxBookMarks(i+1).Name;
			if (!findTheSame(bookmark)){
				var temp = new Array();
				temp.push(bookmark);
				BMData.push(temp);
				isAdd = true;
			}
		}
		if (isAdd){
			bookmarkGrid.getStore().loadData(BMData);
		} else {
			displayOCX(false);
			Ext.Msg.show({
				title: '提示',
				msg: '文档【'+CURRENT_FILE_NAME+'】没有定义书签！',
				icon: Ext.Msg.INFO,
				buttons: Ext.Msg.OK,
				fn: function(value){ if ('ok' == value) displayOCX(true); }
			});
		}
		getBookMarkBtn.setDisabled(true);
	}
	
	function showBookMark(){
		if (BMData.length > 0){
			showBK();
		} else {
			Ext.example.msg('提示', '请先打开流程模板！');
		}
	}
	var sm =  new Ext.grid.CheckboxSelectionModel();
		    var btn = new Ext.Button({
		text: '确认',
		iconCls: 'btn',
		handler: function(){
		  if (CUURENT_GRID_ID != '-1') {
		  			var bk = new Array();
					 bk = BKGrid.getSelectionModel().getSelections()//.get('bookmark');
					 var str="";
					
				
				/*	 
					
					if (_bk != '') bk = _bk+','+bk;
					record.set('bookmark', bk);
					*/
					//record = Ext.getCmp(CUURENT_GRID_ID).getSelectionModel().getSelections();
					for(var i=0;i<bk.length;i++){
					 	str += bk[i].get('bookmark')+","
					 	}
					//str=str.substr(0,str.length-1)
					
					 alert(str.substr(0,str.length-1))
					record = Ext.getCmp(CUURENT_GRID_ID).getSelectionModel().getSelected();
					record.set('bookmark',str.substr(0,str.length-1));
					BKWin.hide();
				}
		}
	});
	
	function showBK(){
		if (!BKWin){			

		    //var Plant_fw = Ext.data.Record.create(Columns_fw);
			/*var cm_fw = new Ext.grid.ColumnModel([
			    sm_fw,
				{	id:'bookmark',  
					header:"书签",  
					dataIndex:fc_fw['bookmark'].name,  
					width:90	
				}
			])*/

			BKGrid = new Ext.grid.GridPanel({
				sm:sm,
				ds: new Ext.data.SimpleStore({
					fields: [{name: 'bookmark', type: 'string'}]
				}),
				cm: new Ext.grid.ColumnModel([
	                sm,			
					new Ext.grid.RowNumberer({
						width: 20
					}), {
						id: 'bookmark',
						header: '书签',
						dataIndex: 'bookmark',
						width: .8
					}
				
				]),
				tbar: ['->',btn],
				border: false, header: false,
				autoScroll: true, split: true,
				collapseMode: 'mini',
				collapsible: true,
		    	animCollapse: true,
		    	margins:'0 0 5 0',
				loadMask: true, stripeRows: true,
				viewConfig: {
					forceFit: true,
					ignoreAdd: true
				},
			    width: 200
			});
			BKWin = new Ext.Window({
				title: '模板书签',
				button: new  Ext.Button({
		               id: 'Save',
		               text: '保存',
		               iconCls: 'save',
		               handler: doSave
	            }),
				iconCls: 'option',
				layout: 'fit',
				width: 310, height: 260,
				modal: true, resizable: false,
				closable: true, closeAction: 'hide',
				maximizable: false, plain: true,
				items: [BKGrid]
			});
			/*BKGrid.on('dbclick', function(){
				if (CUURENT_GRID_ID != '-1') {
					var bk = BKGrid.getSelectionModel().getSelected().get('bookmark');
					var record = Ext.getCmp(CUURENT_GRID_ID).getSelectionModel().getSelected();
					var _bk = record.get('bookmark'); 
					if (_bk != '') bk = _bk+','+bk;
					record.set('bookmark', bk);
					BKWin.hide();
				}
			});*/
			BKWin.on('hide', function(){
				if (TANGER_OCX_bDocOpen) displayOCX(true);
			});
		}

		displayOCX(false);
		BKWin.show();
		BKGrid.getStore().loadData(BMData);
	}
	
	function doSave(){
		var type = this.id;
		if ('nodeSave' == type) {
			var _records = nodeGrid.getStore().getModifiedRecords();
			if (_records.length > 0) {
				var nodeList = new Array();
				for (var i=0; i<_records.length; i++){
					var node = new Array();
					node[0] = _records[i].get('flowid');
					node[1] = _records[i].get('nodeid');
					node[2] = _records[i].get('bookmark');
					nodeList.push(node);
				}
				flwDefinitionMgm.saveBKToNode(nodeList, function(flag){
					if (flag){ nodeGrid.getStore().load(); }
				});
			}
		} else if ('commonSave' == type) {
			var _records = commonNodeGrid.getStore().getModifiedRecords();
			if (_records.length > 0) {
				var commonList = new Array();
				for (var i=0; i<_records.length; i++){
					var common = new Array();
					common[0] = _records[i].get('flowid');
					common[1] = _records[i].get('nodeid');
					common[2] = _records[i].get('bookmark');
					common[3] = _records[i].get('cnodeid');
					commonList.push(common);
				}
				flwDefinitionMgm.saveBKToCommon(commonList, function(flag){
					if (flag){ commonNodeGrid.getStore().load(); }
				});
			}
		}
	}
	
});
