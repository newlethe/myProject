var bean = "com.sgepit.frame.flow.hbm.FlwDefinitionView";
var frameBean = "com.sgepit.frame.flow.hbm.FlwFrame";
var business = "baseMgm";
var listMethod = "findWhereOrderBy";
var addWindow;

Ext.onReady(function(){
	
	var root = new Ext.tree.TreeNode({
    	text: '业务工作流程树',
    	id: 'root',
    	type: 'root'
    });
    
    var treePanel = new Ext.tree.TreePanel({
		region: 'west',
		split: true,
		width: 200,
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
		loader: new Ext.tree.TreeLoader(),
		root: root,
		collapseFirst: false
	});
	var treeMenu = new Ext.menu.Menu({id: 'treeMenu'});
	treePanel.on('contextmenu', contexttreemenu, this);
	
	var sm = new Ext.grid.CheckboxSelectionModel({singleSelect: true});
	
	var cm = new Ext.grid.ColumnModel([
		sm, {
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
			width: 120
		},{
			id: 'modid',
			header: '模块ID',
			dataIndex: 'modid',
			hidden: true
		},{
			id: 'modname',
			header: '模块名称',
			dataIndex: 'modname',
			width: 120
		},{
			id: 'xmlname',
			header: '流程图',
			dataIndex: 'xmlname',
			width: 120,
			renderer: function(value){
				return value+'.xml';
			}
		},{
			id: 'frameid',
			header: '结构ID',
			dataIndex: 'frameid',
			hidden: true
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'flowid', type: 'string'},
		{name: 'modid', type: 'string'},
		{name: 'flowtitle', type: 'string'},
		{name: 'modname', type: 'string'},
		{name: 'xmlname', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'frameid', type: 'string'}
	];
	
	var ds = new Ext.data.Store({
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
		}, Columns),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('flowid', 'desc');
	
	var grid = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: [
			{text: "<font color=#15428b><b>&nbsp;定义的流程</b></font>", iconCls: 'option'},
			'->',
			'<font color=green>将下列定义好的【流程】移动到左边的【结构树】上&nbsp;</font>'
		],
		border: false,
		header: false, stripeRows: true,
		split: true,
		region: 'center',
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
	
	var gridMenu = new Ext.menu.Menu({id: 'gridMenu'});
	grid.on('rowcontextmenu', contextmenu, this);
	
	var mainPanel = new Ext.Panel({
		layout: 'border',
		region: 'center',
		border: false,
		collapsible: true,
    	animCollapse: true,
    	items: [grid]
	})
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		border: false,
		items: [treePanel, mainPanel]
	});
	
	reloadAll();
	
	function contexttreemenu(node, e){
		e.stopEvent();
		treeMenu.removeAll();
		if (node.attributes.type == 'root') {
			treeMenu.addMenuItem({
				state: 'tree_add',
				text: '　新增文件夹',
				value: node,
				iconCls: 'add',
				handler: toHandler
			});
		} else if (node.attributes.type == 'document') {
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
		} else if (node.attributes.type == 'flow') {
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
		}
		treeMenu.showAt(e.getXY());
	}
	
	function contextmenu(thisGrid, rowIndex, e){
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		gridMenu.removeAll();
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
					iconCls: 'returnTo',
					handler: toHandler
				});
				menuItem.menu.items.add(item);
			}
		}
		gridMenu.add(menuItem);
		gridMenu.showAt(e.getXY());
	}
	
	function toHandler(){
		var state = this.state;
//		var record = this.value;
		if ("" != state){
			if ("tree_add" == state){
				addWin();
				addForm.getForm().reset();
			} else if ("tree_edit" == state){
				addWin();
				addForm.getForm().findField('frameid').setValue(this.value.id);
				addForm.getForm().findField('framename').setValue(this.value.text);
			} else if ("grid_add" == state || "flow_change" == state){
				flwDefinitionMgm.changeFlowFrame(this.value, this.id, function(){
					("flow_change" == state) ? buildFrameTree() : reloadAll()
				});
			} else if ("tree_del" == state){
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
						buildFrameTree();
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
		ds.load({
			params: {
				start: 0,
				limit: PAGE_SIZE
			}
		});
		buildFrameTree();
	}
	
	function buildFrameTree(){
		treePanel.getEl().mask("Loading...");
		clearChildNodes(root);
		baseDao.findByWhere2(frameBean, '', function(frame_list){
			for (var i = 0; i < frame_list.length; i++) {
				var treeNode = new Ext.tree.TreeNode({
					id: frame_list[i].frameid,
					text: frame_list[i].framename,
					type: 'document'
				});
				DWREngine.setAsync(false);
				baseDao.findByWhere2(bean, 'frameid = \''+frame_list[i].frameid+'\'', function(flow_list){
					for (var j = 0; j < flow_list.length; j++) {
						treeNode.appendChild(
							new Ext.tree.TreeNode({
								id: flow_list[j].flowid,
								text: flow_list[j].flowtitle,
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
			root.expandChildNodes(true);
			treePanel.getEl().unmask();
		});
	}
	
	function clearChildNodes(node){
		if (node.childNodes.length > 0){
			node.childNodes[0].remove();
			clearChildNodes(node);
		}
	}
});
