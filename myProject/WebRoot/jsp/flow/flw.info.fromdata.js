var notesTip;
var FIRST_FILE_ID = '-1';

Ext.onReady(function(){
	
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
	
	var docMenu = new Ext.menu.Menu({
	    id: 'mainMenu',
	    items: ['-'],
		listeners: {
			beforeshow: function(menu){displayOCX(true);},
			beforehide: function(menu){displayOCX(true);}
		}
	});
	
	var menuBtn = new Ext.Button({
		text: '打开本流程文档',
		iconCls: 'bmenu',
		menu: docMenu
	});
	
	var filePanel = new Ext.Panel({
		border: false, header: false,
		iconCls: 'form',
		tbar: [menuBtn],
		contentEl: TANGER_OCX
	});
	
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
			bean: 'com.sgepit.frame.flow.hbm.FlwAdjunctIns',
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
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		}
	});
	
	var tabPanel = new Ext.TabPanel({
		activeTab: 0,
		deferredRender: true,
		minSize: 100,
		maxSize: 460,
		plain: true,
		border: false,
		forceFit: true,
		items: [{
			id: 'flw-log',
			title: '流转日志',
			iconCls: 'refresh',
			layout: 'fit',
			items: [ logGrid ]
		},{
			id: 'flw-adjunct',
			title: '流程附件',
			iconCls: 'copyUser',
			layout: 'fit',
			items: [ gridAdjunct ]
		},{
			id: 'flw-file',
			title: '流程文件',
			iconCls: 'word',
			layout: 'fit',
			items: [ filePanel ]
		}],
		listeners: {
			tabchange: function(tp, p){
				document.getElementById('TANGER_OCX').height=1
				if ('flw-file' == p.id){
					if ('-1' != FIRST_FILE_ID) {
						TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", FIRST_FILE_ID);
						TANGER_OCX_SetReadOnly(true);
						document.getElementById('TANGER_OCX').height='519'
						displayOCX(true);
					} else {
						DWREngine.setAsync(false); 
						var filterFile=" filedate in( select filedate from com.sgepit.frame.flow.hbm.InsFileInfoMaxView where insid='"+_insid+"')"
						baseDao.findByWhere2("com.sgepit.frame.flow.hbm.InsFileInfoView", "insid='"+_insid+"'and "+filterFile, function(list){
							if (list.length > 0){
								docMenu.removeAll();
								FIRST_FILE_ID = list[0].fileid;
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
						displayOCX(false);
					}
				} else if ('flw-adjunct' == p.id){
					dsAdjunct.baseParams.params = "insid='"+_insid+"'";
					dsAdjunct.load();
				} else if ('flw-log' == p.id){
					ds.baseParams.params = " insid='"+_insid+"' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'";
					ds.load({
						params: {
							start: 0,
							limit: PAGE_SIZE
						}
					});
					notesTip = new Ext.ToolTip({
						title: '签署意见',
						width: 200,
						target: logGrid.getEl()
					});
				}
			}
		}
	});
	
	var viewport = new Ext.Viewport({
		layout: 'fit',
		border: false,
		items: [tabPanel],
		listeners: {
//			afterlayout: function(){
//				if ('-1' != FIRST_FILE_ID){
//					TANGER_OCX_OpenDoc(_basePath+"/servlet/FlwServlet?ac=loadDoc", FIRST_FILE_ID);
//					TANGER_OCX_SetReadOnly(true);
//					displayOCX(true);
//				}
//			}
		}
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
});

function refreshTab(){
	tabPanel.getActiveTab().doAutoLoad();
}

function displayOCX(flag){
	var ocxDom = document.getElementById('TANGER_OCX');
	flag ? ocxDom.style.display = 'block' : ocxDom.style.display = 'none'
}
