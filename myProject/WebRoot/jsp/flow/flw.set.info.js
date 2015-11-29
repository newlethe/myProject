var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var flwrolesbean = "com.sgepit.frame.flow.hbm.FlwRoles";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var addWindow,flwRoleWin;
var FLOW_ID, FLOW_TITLE;

Ext.onReady(function(){
	Ext.QuickTips.init();
	var root = new Ext.tree.AsyncTreeNode({
    	text: '业务工作流程树',
    	id: 'root',
    	nodeType: 'root',
    	expanded:true,
    	leaf:false
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
		autoScroll: true,
		animCollapse : false,
		collapsible: true,
		collapseMode: 'mini',
		collapsed:true,
		tbar: ['<font color=#15428b>&nbsp;流程结构树</font>'],
		loader: new Ext.tree.DWRTreeLoader({dataUrl: flwFrameMgm.getFlowTreeNodeById}),
		root: root,
		collapseFirst: false
	});
	var treeMenu = new Ext.menu.Menu({id: 'treeMenu'});
	treePanel.on('contextmenu', contexttreemenu, this);
	
	function contexttreemenu(node, e){
		e.stopEvent();
		treeMenu.removeAll();
		if (node.attributes.nodeType == 'root') {
			treeMenu.addMenuItem({
				state: 'tree_add',
				text: '　新增文件夹',
				value: node,
				iconCls: 'add',
				handler: toHandler
			});
		} else if (node.attributes.nodeType == 'document') {
			treeMenu.addMenuItem({
				state: 'tree_edit',
				text: '　修改文件夹',
				value: node,
				iconCls: 'btn',
				handler: toHandler
			});
			treeMenu.addMenuItem({
				state: 'tree_del',
				text: '　移除文件夹',
				value: node,
				iconCls: 'multiplication',
				handler: toHandler
			});
		} else if (node.attributes.nodeType == 'flow') {
			treeMenu.addMenuItem({
				state: 'flow_del',
				text: '　移除流程',
				value: node.id,
				iconCls: 'multiplication',
				handler: toHandler
			});
			var menuItem = new Ext.menu.Item({
				text: '　移动',
	        	iconCls: 'add',
	        	menu: {
	        		items: [{
	        			text: '可选文件夹',
	        			disabled: true
	        		},'-']
	        	}
			});
			var nodes = root.childNodes;
			if (nodes.length > 0){
				for (var i = 0; i < nodes.length; i++) {
					if (nodes[i].id == node.parentNode.id) continue;
					var item = new Ext.menu.Item({
						id: nodes[i].id,
						text: '　'+nodes[i].text,
						state: 'flow_change',
						value: node.id,
						iconCls: 'returnTo',
						handler: toHandler
					});
					menuItem.menu.items.add(item);
				}
			}
			treeMenu.addMenuItem(menuItem);
			
			treeMenu.addMenuItem({
				state: 'flow_role_set',
				text: '　权限配置',
				value: node,
				iconCls: 'option',
				handler: toHandler
			});
			
		}
		treeMenu.showAt(e.getXY());
	}
	
	var ypCheck = new Ext.grid.CheckColumn({
		header : "是否验评流程",
		dataIndex : "isyp",
		autoCommit:true,
		align :"center",
		width: 30
	});
	
	var unUsedFlwSm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var unUsedFlwCm = new Ext.grid.ColumnModel([
		unUsedFlwSm, {
			id: 'flowid',
			header: '流程ID',
			dataIndex: 'flowid',
			hidden: true
		},{
			id: 'state',
			header: '流程状态',
			dataIndex: 'state',
			width: 20,
			hidden: true
		},{
			id: 'flowtitle',
			header: '流程标题',
			dataIndex: 'flowtitle',
			width: 100
		},{
			id: 'xmlname',
			header: '流程图',
			dataIndex: 'xmlname',
			width: 100,
			renderer: function(value){
				return value+'.xml';
			}
		},ypCheck,{
			id: 'frameid',
			header: '结构ID',
			dataIndex: 'frameid',
			hidden: true
		}
	]);
	unUsedFlwCm.defaultSortable = true;
	
	var unUsedFlwColumns = [
		{name: 'flowid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'xmlname', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'isyp', type: 'bool'},
		{name: 'frameid', type: 'string'}
	];
	
	var unUsedFlwDs = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: bean,
			business: business,
			method: listMethod,
			params: 'state = \'0\' and frameid = null or frameid = \'\''
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'flowid'
		}, unUsedFlwColumns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	unUsedFlwDs.setDefaultSort('flowid', 'desc');
	
	var unUsedFlwGrid = new Ext.grid.GridPanel({
		ds: unUsedFlwDs,
		cm: unUsedFlwCm,
		sm: unUsedFlwSm,
		plugins:ypCheck,
		tbar: [
			{text: "<font color=#15428b><b>&nbsp;定义的流程</b></font>", iconCls: 'option'},
			'->',
			'<font color=green>将下列定义好的【流程】移动到左边的【结构树】上&nbsp;</font>'
		],
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
            store: unUsedFlwDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners:{
        	afteredit:function(e){
        		var flowid = e.record.get("flowid");
        		flwZlypMgm.setIsypByFlowid(flowid,e.value,function(success){
        			if(!success) Ext.example.msg('','操作失败！');
        		});
        	}
        }
	});
	
	var unUsedFlwGridMenu = new Ext.menu.Menu({id: 'gridMenuUnUsedFlw'});
	unUsedFlwGrid.on('rowcontextmenu', contextmenu, this);
	
	var tabPanel = new Ext.TabPanel({
		activeTab: 0,
		deferredRender: true,
		split: true,
		height: 240,
		minSize: 100,
		maxSize: 460,
    	animCollapse: true,
		plain: true,
		border: false,
		region: 'center',
		forceFit: true,
		items: [{
			id: 'flow', title: '流程定义', layout: 'fit', iconCls: 'title',
			autoLoad:{
	    		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
	    		params: 'type=flow',
	    		text: '<div style="font: bold  15px; color: #15428b">Loading...</div>'
	    	}
		},{
			id: 'grid', title: '未使用流程', layout: 'fit', iconCls: 'remove',
			items: [unUsedFlwGrid]
		},{
			id: 'file', title: '文档模板设定', layout: 'fit', iconCls: 'word',
			autoLoad:{
	    		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
	    		params: 'type=form',
	    		text: '<div style="font: bold  15px; color: #15428b">Loading...</div>'
	    	}
		},{
			id: 'common', title: '普通节点配置', layout: 'fit', iconCls: 'btn',
			autoLoad:{
	    		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
	    		params: 'type=common',
	    		text: '<div style="font: bold  15px; color: #15428b">Loading...</div>'
	    	}
		},{
			id: 'bookmark', title: '文档书签配置', layout: 'fit', iconCls: 'bookmark',
			autoLoad:{
	    		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
	    		params: 'type=bookmark',
	    		text: '<div style="font: bold  15px; color: #15428b">Loading...</div>'
	    	}
		}]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [treePanel, tabPanel]
	});
	
	//treePanel.collapse();
	//buildFrameTree();
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		unUsedFlwGridMenu.removeAll();
		var menuItem = new Ext.menu.Item({
			text: '　添加',
        	iconCls: 'add',
        	menu: {
        		items: [{
        			text: '可选文件夹',
        			disabled: true
        		},'-']
        	}
		});
		var nodes = root.childNodes;
		if (nodes.length > 0){
			for (var i = 0; i < nodes.length; i++) {
				var item = new Ext.menu.Item({
					id: nodes[i].id,
					text: '　'+nodes[i].text,
					state: 'grid_add',
					value: record.get('flowid'),
					flowtitle: record.get('flowtitle'),
					iconCls: 'returnTo',
					handler: toHandler
				});
				menuItem.menu.items.add(item);
			}
		}
		unUsedFlwGridMenu.add(menuItem);
		unUsedFlwGridMenu.showAt(e.getXY());
	}
	
	function toHandler(){
		var state = this.state;
		if ("" != state){
			if ("tree_add" == state){//添加文件夹
				addWin();
				addForm.getForm().reset();
			} else if ("tree_edit" == state){//修改文件夹
				addWin();
				addForm.getForm().findField('frameid').setValue(this.value.id);
				addForm.getForm().findField('framename').setValue(this.value.text);
			} else if ("grid_add" == state || "flow_change" == state){//流程设置
				//先判断是否给流程定义了角色
				var flowid = this.value;
				var frameid = this.id;
				var flowtitle = this.flowtitle;
				flwDefinitionMgm.changeFlowFrame(flowid, frameid, function(){
					root.reload(function(){
						var node = treePanel.getNodeById(frameid);
						if(node) node.expand();
					})
					if("grid_add" == state){
						unUsedFlwDs.load({
							params: {
								start: 0,
								limit: PAGE_SIZE
							},
							callback:function(){
								editFlwRoles(flowid,flowtitle);
							}
						});
					}
				});
			} else if ("tree_del" == state){//流程文件夹删除
				var _frameid = this.value.id;
				if (this.value.childNodes.length){
					Ext.Msg.show({
						title: '警告',
						msg: '有流程已归属到本文件夹中，是否要移除文件夹？',
						icon: Ext.Msg.WARNING,
						buttons: Ext.Msg.YESNO,
						fn: function(value){
							if('yes' == value){
								flwFrameMgm.deleteFlwFrame(_frameid, true, function(){
									reloadAll();
								});
							}
						}
					});
				} else {
					flwFrameMgm.deleteFlwFrame(_frameid, false, function(){
						reloadAll();
					});
				}
			} else if ("flow_del" == state){
				flwDefinitionMgm.changeFlowFrame(this.value, '', function(){
					reloadAll();
				});
			} else if ("flow_role_set" == state){
				editFlwRoles(this.value.id,this.value.text)
			}
		}
	}
	
	var addForm = new Ext.form.FormPanel({
		header: false, border: false,
		bodyStyle: 'padding: 5px 0px;',
		labelAlign: 'right',
		labelWidth: 90,
		items: [
			{xtype: 'textfield', name: 'framename', fieldLabel: '流程文件夹名', allowBlank: false},
			{xtype: 'textfield', name: 'frameid', fieldLabel: '文件夹ID', hidden: true, hideLabel: true}
		],
		bbar: ['->',{
			text: '添加',
			iconCls: 'add',
			handler: function(){
				if (!addForm.getForm().isValid()) {
					Ext.example.msg('提示', '请填写文件夹名！');
					return;
				}
				addForm.getForm().submit({
					url: ''+CONTEXT_PATH+'/servlet/FlwServlet', 
					waitMsg: 'Saving Data...',
					params: {
						ac: 'saveFrame',
						frameid: addForm.getForm().findField('frameid').getValue(),
						framename: addForm.getForm().findField('framename').getValue()
					},
					success: function(form, action){
						addWindow.hide();
						root.reload();
						Ext.example.msg('提示', '添加文件夹成功！^_^');
					},
					failure: function(form, action){
						addWindow.hide();
						var failType = action.failureType;
						var msg;
						if ("client" == failType){
							msg = "客户端验证错误！";
						} else if ("server" == failType){
							msg = "服务器端验证错误！";
						} else if ("connect" == failType){
							msg = "连接错误！";
						} else if ("load" == failType){
							msg = "加载错误！";
						}
						Ext.example.msg('提示', msg);
					}
				})	
			}
		}]
	});
	
	function addWin(){
		if (!addWindow){
			addWindow = new Ext.Window({
				title: '添加流程文件夹',
				iconCls: 'form',
				layout: 'fit',
				width: 240,
				height: 90,
				modal: true,
				closeAction: 'hide',
				resizable: false,
				plain: true,
				items: [addForm]
			});
		}
		addWindow.show();
	}
	
	function reloadAll(){
		unUsedFlwDs.load({
			params: {
				start: 0,
				limit: PAGE_SIZE
			},
			callback:function(){
				root.reload();
			}
		});
	}
	treePanel.on('click', function(node, e){
		if (node.attributes.nodeType == 'flow'){
			FLOW_ID = node.id;
			FLOW_TITLE = node.text;
			if (tabPanel.getActiveTab().getId() == 'file') {
				tabPanel.getItem('file').doAutoLoad();
			} else if (tabPanel.getActiveTab().getId() == 'common') {
				tabPanel.getItem('common').doAutoLoad();
			} else if (tabPanel.getActiveTab().getId() == 'bookmark') {
				tabPanel.getItem('bookmark').doAutoLoad();
			}
		}
	});
	
	tabPanel.on('tabchange', function(tPanel, tab){
		if (tab.getId() == 'flow'){
			treePanel.collapse();
		} else if (tab.getId() == 'grid'){
			unUsedFlwDs.load({
				params: {
					start: 0,
					limit: PAGE_SIZE
				}
			});
			treePanel.expand();
		} else if (tab.getId() == 'file') {
			tab.doAutoLoad();
			treePanel.expand();
		} else if (tab.getId() == 'common') {
			tab.doAutoLoad();
			treePanel.expand();
		} else if (tab.getId() == 'bookmark') {
			tab.doAutoLoad();
			treePanel.expand();
		}
	});
});
function editFlwRoles(flowid,flwname){
	if(!flwRoleWin){
		flwRoleWin = (new FlwRoles());
	}
	flwRoleWin.show(flowid,flwname)
};

var FlwRoles=Ext.extend(Ext.Window ,{
	title:"流程角色设置",
	width:450,
	height:400,
	layout:'fit',
	closable:false,
	flowid:null,
	modal: true,
	closeAction: 'hide',
	initComponent: function(){
		var startCheckColumn = new Ext.grid.CheckColumn({
			header : "起草流程",
			dataIndex : "selectStart",
			fixed:true,
			align :"center",
			autoCommit:true,
			width: 75
		});
		
		var searchCheckColumn = new Ext.grid.CheckColumn({
			header : "查看流程",
			dataIndex : "selectSearch",
			fixed:true,
			align :"center",
			autoCommit:true,
			width: 75
		});
		/*
		startCheckColumn.on('afteredit', function(e){
			alert(1)
		});
		searchCheckColumn.on('afteredit', function(e){
			alert(2)
		});
		*/
		this.items=[{
			xtype:"grid",
			plugins:[startCheckColumn,searchCheckColumn],
			enableHdMenu :false,
			enableDragDrop :false,
			enableColumnResize:false,
			enableColumnMove :false,
			enableColumnHide :false,
        	clicksToEdit:1,
        	viewConfig: {forceFit: true},
			columns:[
				{
					header:"流程ID",
					dataIndex:"flowid",
					hidden:true
				},{
					header:"角色ID",
					dataIndex:"roleid",
					hidden:true
				},{
					header:"角色名称",
					sortable:false,
					resizable :false,
					dataIndex:"rolename",
					width:120
		        }, startCheckColumn, searchCheckColumn
			],
			store: new Ext.data.Store({
	    		reader: new Ext.data.JsonReader({
				}, [
					{name: 'flowid', type: 'string'},
					{name: 'roleid', type: 'string'},
					{name: 'rolename', type: 'string'},
					{name: 'selectStart', type: 'bool'},
					{name: 'selectSearch', type: 'bool'}
				])
	    	}),
	    	listeners:{
	        	afteredit:function(e){
	        		var rec = e.record;
	        		var field = e.field;
	        		var val = e.value;
	        		//有起草权限就有查询权限
              		if(field=="selectStart" && val) {
              			rec.set('selectSearch', true);
						rec.commit();
              		}
              		//没有查询权限也没有起草权限
              		if(field=="selectSearch" && !val) {
              			rec.set('selectStart', false);
						rec.commit();
              		}
	        	}
	        }
		}],
		this.buttonAlign="center";
		this.buttons = [{
			text:'确定',
			scope:this,
			handler:function(){
				if(this.flowid){
					var win = this;
					var rolestore = this.items.get(0).getStore();
					var rolesStr = "";
					var rolesSearchStr = "";
					var i=0;
					rolestore.each(function(r){
						if(r.get('selectStart')){
							rolesStr+=","+r.get('roleid');
						}
						if(r.get('selectSearch')){
							rolesSearchStr+=","+r.get('roleid');
						}
					});
					if(rolesStr!="") rolesStr=rolesStr.substring(1);
					if(rolesSearchStr!="") rolesSearchStr=rolesSearchStr.substring(1);
					flwDefinitionMgm.setFlwRolws(this.flowid,rolesStr, rolesSearchStr, function(bool){
						if(bool){
							win.hide();
							Ext.example.msg('提示信息','设置成功！')
						}else{
							Ext.example.msg('提示信息','设置失败！')
						}
					});
				}
			}
		},{
			text:'取消',
			scope:this,
			handler:function(){
				this.hide()
			}
		}],
		this.on('show',function(){
			//Ext.get('selectall').on('click',this.selectAll,this);
		});
		FlwRoles.superclass.initComponent.call(this);
	},
	/*
	selectAll:function(){
		var store = this.items.get(0).getStore();
		var checked = document.getElementById('selectall').checked;
		store.each(function(rcd){
			rcd.set('selectStart',checked);
			rcd.commit();
		})
	},
	*/
	show:function(flowid,flwname){
		if(flwname){
			this.setTitle(flwname+" - 流程角色设置");
		}else{
			this.setTitle("流程角色设置");
		}
		if(flowid){
			this.flowid = flowid;
			var rolegrid = this.items.get(0);
			rolegrid.getStore().removeAll();
			DWREngine.setAsync(false);
			flwDefinitionMgm.getFlwRolws(flowid,function(json){
				rolegrid.getStore().loadData(eval(json));
			});
			DWREngine.setAsync(true);
		}else{
			this.flowid = null;
		}
		FlwRoles.superclass.show.call(this);
	}
});