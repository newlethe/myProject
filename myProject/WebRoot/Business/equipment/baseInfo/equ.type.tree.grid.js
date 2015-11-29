var SPLITB = "`";
var treePanel, treeLoader, contentPanel;
var state;
var sbTreeType=new Array();
var treeIdIf,oldParentId;
var addBtn;
var editBtn;
var delBtn;
var treeGridName = CURRENTAPPID == "1031902"? "设备/材料合同分类树维护":"设备合同分类树维护";
DWREngine.setAsync(false); 
appMgm.getCodeValue('设备合同树分类',function(list){         //获取合同状态
		for(i = 0; i < list.length; i++) {
			var temp = new Array();	
			temp.push(list[i].propertyCode);		
			temp.push(list[i].propertyName);	
			sbTreeType.push(temp);			
		}
    }); 
DWREngine.setAsync(true);
	addBtn = new Ext.Button({
		id : 'menu_add',
		text : '新增',
		iconCls : 'add',
		disabled:true
	});
	editBtn = new Ext.Button({
		id : 'menu_update',
		text : '修改',
		iconCls : 'btn',
		disabled:true
	});
	delBtn = new Ext.Button({
		id : 'menu_del',
		text : '删除',
		disabled:true,
		iconCls : 'remove'
	});
    var columns = [		// 创建列模型
    	{
         header: fc['pid'].fieldLabel,dataIndex: 'pid',hidden: true       
        },{header: fc['uuid'].fieldLabel,dataIndex: 'uuid',hidden: true       
        },{header: fc['parentid'].fieldLabel, dataIndex: 'parentid', hidden: true
        },{header: fc['isleaf'].fieldLabel,dataIndex: 'isleaf',hidden: true
        },{id:'treeid',header: fc['treeid'].fieldLabel,dataIndex: 'treeid',
           width: 100
        },{id:'treename',header: fc['treename'].fieldLabel,dataIndex: 'treename',
        renderer: sbTreeRender,
           width: 150
        },{header: fc['conid'].fieldLabel,dataIndex: 'conid',
           width: 100,hidden: true
        },{
           header: fc['memo'].fieldLabel,dataIndex: 'memo',
           width: 80,hidden: true
        } ,{
        	header: fc['jzid'].fieldLabel,dataIndex: 'jzid',
           renderer: dsJzhRender,width: 100
        }
    ];
    // 4. 创建数据源
    var store= new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentid',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'buildEquTypeTree',// 后台java代码的业务逻辑方法定义
					business : 'equBaseInfo',// spring 管理的bean定义
					bean : "com.sgepit.pmis.equipment.hbm.EquTypeTree",// gridtree展示的bean
					params : 'pid' + SPLITB +  CURRENTAPPID+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["treeid", "pid", "uuid", "treename",
									'conid',
									'memo','jzid', "parentid", "isleaf"]
						}),
				listeners : {
					'beforeload' : function(ds, options) {
						var parent = null;
						if (options.params[ds.paramNames.active_node] == null) {//根据左边的设备合同分类树加载右边的树的条件
							options.params[ds.paramNames.active_node]=treeId;
							parent=treeId;
						} else {//自身加载的条件
							parent = options.params[ds.paramNames.active_node];
						}
						ds.baseParams.params = 'pid' + SPLITB + CURRENTAPPID + ";parent" + SPLITB + parent+ ";conid" + SPLITB + conId;
					}
				}
			});
    
    var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'equ-tree-panel',
				iconCls : 'icon-by-category',
				store : store,
				master_column_id : 'treename',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				tbar : ['<font color=#15428b><B>'+treeGridName+'<B></font>','-',addBtn,'-',editBtn,'-',delBtn],
				region : 'center',
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				columns : columns,
				stripeRows : true
			});
    store.on("load", function(ds1, recs) {
    	store.setRootNodes(treeId);
		if(selectedPath && selectedPath!="") {
			store.expandPath(selectedPath, "treeid");
		} 
		else {
			if (ds1.getCount() > 0) {
				var rec1 = ds1.getAt(0);
				if (!ds1.isExpandedNode(rec1)) {
					ds1.expandNode(rec1);
				}
			}
		}
//		if (ds1.getCount() > 0) {
//			treeGrid.getView().getRow(0).style.display='none';
//		}
	});	
   //机组号
   function dsJzhRender(value){
   		var str = '';
   		for(var i=0; i<jzhType.length; i++) {
   			if (jzhType[i][0] == value) {
   				str = jzhType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   //渲染设备合同主属性
   function sbTreeRender(value){
   		var str = value;
   		for(var i=0; i<sbTreeType.length; i++) {
   			if (sbTreeType[i][0] == value) {
   				str = sbTreeType[i][1]
   				break; 
   			}
   		}
   		return str;
   }
   treeGrid.on('rowmousedown',function(thisGrid,rowIndex,e){
        var record = thisGrid.getStore().getAt(rowIndex);
        var treeid = record.get("treeid");
        var parentid=record.get("parentid");
        funcHandler(treeid,parentid,toHandlerright);
   });
 function funcHandler(treeid,parentid,fhandler){
 	    addBtn.handler=fhandler;
 	    editBtn.handler=fhandler;
 	    delBtn.handler=fhandler;
 		if(treeid=='01'||treeid=='02'||treeid=='03'||treeid=='04'){
			addBtn.enable();
			editBtn.disable();
			delBtn.disable();		
		}else if(parentid=='0'){
			addBtn.disable();
			editBtn.disable();
			delBtn.disable();
		}else{
			addBtn.enable();
			editBtn.enable();
			delBtn.enable();			
		}
 }
 treeGrid.on('rowcontextmenu', contextmenu, this);
	function contextmenu(thisGrid, rowIndex, e) {
		// e.preventDefault();//阻止系统默认的右键菜单
		e.stopEvent();
		thisGrid.getSelectionModel().selectRow(rowIndex);
		var record = thisGrid.getStore().getAt(rowIndex);
		var name = e.getTarget().innerText;
		var treeid = record.get("treeid");
		var parentid=record.get("parentid");
		var isRoot = (rootText == name);
		if (rootText == name)
			return;
		contextmenutemp(isRoot,treeid,parentid,e,toHandlerright);

	}
	function contextmenutemp(isRoot,treeid,parentid,e,handlerTree){
		var menuAdd = {
			id : 'menu_add',
			text : '　新增',
			iconCls : 'add',
			// node : node,
			handler : handlerTree
		};
		var menuUpdate = {
			id : 'menu_update',
			text : '　修改',
			iconCls : 'btn',
			// node : node,
			handler : handlerTree
		};
		var menuDelete = {
			id : 'menu_del',
			text : '　删除',
			iconCls : 'remove',
			// node : node,
			handler : handlerTree
		};
		var items;
		if (ModuleLVL == '1') {
			items = [menuAdd, menuUpdate,menuDelete];
		} 
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : items
		});

 		if (ModuleLVL == '1') {
			if (isRoot) {
				treeMenu.items.get("menu_update").disable();
				treeMenu.items.get("menu_del").disable();
			} else {
				treeMenu.items.get("menu_update").enable();
				treeMenu.items.get("menu_del").enable();
			}
		} 
		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if(treeid=='01'||treeid=='02'||treeid=='03'||treeid=='04'){
			treeMenu.items.get("menu_add").enable();
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();		
		}else if(parentid=='0'){
			treeMenu.items.get("menu_add").disable();
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		}else{
			treeMenu.items.get("menu_add").enable();
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();			
		}
	}
	function toHandlerright(node){
		var rec = treeGrid.getSelectionModel().getSelected();
		toHandler(node,rec);
	}
	function toHandler(node,rec) {
		var parentName=sbTreeRender(rec.data.treename);
		state = node.id;
		var no = rec.data.treeid;
		var isRoot = (rootText == node.text);
		var menu_isLeaf = isRoot ? "false" : rec.data.isleaf;
		var parent = rec.data.parentid;
		var con = rec.data.conid;
		if (parent != '0') {
			DWREngine.setAsync(false);
			equBaseInfo.getEquTypeTreeByProperties(parent,con, function(obj) {
						ptreeid = obj.treeid;
						if(obj.treename==null){//修改主属性时显示设备合同分类名称
							ptreename=nodeText;
						}else{
							ptreename = sbTreeRender(obj.treename);
						}
					});
			DWREngine.setAsync(true);
		}
		formPanel.getForm().findField('treeid').el.dom.readOnly = false;
		if ("menu_add" == state) {
			var isleaf=rec.data.isleaf;
			if(isleaf==1){//叶子节点的新增
					saveBtn.setDisabled(false);
					var formRecord = Ext.data.Record.create(Columns);
					loadFormRecord = new formRecord({
							ptreename :parentName,
							ptreeid : rec.data.treeid,
							pid : CURRENTAPPID,
							uuid : null,
							treeid : '',
							treename : '',
							conid : rec.data.conid,
							memo : '',
							isleaf : 1,
							parentid : rec.data.treeid,
							jzid : ''
						});
					formPanel.isNew = false
					formPanel.getForm().loadRecord(loadFormRecord);
					formPanel.expand();					
			}
			else{//非叶子节点的新增
				saveBtn.setDisabled(false);
				var formRecord = Ext.data.Record.create(Columns);
				loadFormRecord = new formRecord({
						ptreename :parentName,
						ptreeid : rec.data.treeid,
						pid : CURRENTAPPID,
						uuid : null,
						treeid : '',
						treename : '',
						conid : rec.data.conid,
						memo : '',
						isleaf : 1,
						parentid : rec.data.treeid,
						jzid : ''
					});
				formPanel.isNew = false
				formPanel.getForm().loadRecord(loadFormRecord);
				formPanel.expand();						
			}
		} else if ("menu_del" == state) {
			/*
			if (no == '01' || no == '0101' || no == '0102' || no == '0103' || no == '0104') {
				Ext.Msg.alert('提示信息', '基础数据不能删除')
			} else {
			*/
				node = '[' + 'Node' + ' ' + rec.data.uuid + ']';
				delHandler(rec, node);
			/*
			}
			*/
		} else if ("menu_update" == state) {
            	var formRecord = Ext.data.Record.create(Columns);
            	treeIdIf=rec.data.treeid;//下拉设备合同分类树过滤当前选中的节点及其子节点
            	oldParentId=ptreeid;
				loadFormRecord = new formRecord({
						ptreename :ptreename,
						ptreeid : ptreeid,
						pid : CURRENTAPPID,
						uuid : rec.data.uuid,
						treeid : rec.data.treeid,
						treename : parentName,
						conid : rec.data.conid,
						memo : rec.data.memo,
						isleaf : rec.data.isleaf,
						parentid : ptreeid,
						jzid : rec.data.jzid
					});
			formPanel.getForm().findField('treeid').el.dom.readOnly = true;
			if (menu_isLeaf == 1) {
				formPanel.isNew = true
				formPanel.expand();
				formPanel.getForm().loadRecord(loadFormRecord);

				saveBtn.setDisabled(false);
				
			} else {//非叶子节点
				formPanel.expand();
				formPanel.getForm().loadRecord(loadFormRecord);
				saveBtn.setDisabled(false);
				return;
			}
		}
	}

	function delHandler(rec, node) {
		var menu_nodeId=rec.data.uuid;
		var hasChild = true;
		DWREngine.setAsync(false);
		equBaseInfo.isHasChilds(menu_nodeId, function(flag) {
			if (!flag) {
				hasChild = false
			}
		})
		DWREngine.setAsync(true);
			var msgStr = "";
			if (hasChild){//有子节点
				msgStr = '是否删除' + rec.data.treename + '[' + rec.data.treeid+ '] 及下层所有设备合同分类信息?';
			} else {
				msgStr = '是否删除' + rec.data.treename + '[' + rec.data.treeid+ '] 设备信息?';
			}
			Ext.Msg.show({
				title : '提示',
				msg : msgStr,
				buttons : Ext.Msg.YESNO,
				icon : Ext.MessageBox.QUESTION,
				fn : function(value) {
					if ("yes" == value) {
						treeGrid.getEl().mask("loading...");
						equBaseInfo.deleteChildNodes(menu_nodeId, function(flag) {
							if ("0" == flag) {
								prerec = treeGrid.getSelectionModel().getSelected();
								if(prerec)
		   							selectedPath = store.getPath(prerec, "treeid");
								store.load();
								reloadTree();
								Ext.example.msg('删除成功！',
										'您成功删除了本设备合同分类信息！');
							} else if("2"==flag){
								Ext.Msg.show({
									title : '提示',
									msg : '该设备合同分类属性下存在设备数据，不能删除！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}else if("3"==flag){
								Ext.Msg.show({
									title : '提示',
									msg : '该设备合同分类技术资料属性下存在资料信息，不能删除！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}else{
								Ext.Msg.show({
									title : '提示',
									msg : '数据删除失败！',
									buttons : Ext.Msg.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
							treeGrid.getEl().unmask();
						});
					}
				}
			});					
		
	}
	
