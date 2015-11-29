var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "概算查询";
var rootText = "所有概算单";
var tmpNode; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var allRealmoney = 0;
var queryBdgid;
var checkBgdWin;
var currentPid = CURRENTAPPID;

Ext.onReady(function() {

	DWREngine.setAsync(false);
	bdgInfoMgm.sumAllRealmoney(currentPid, function(total) {
		if (total) {
			allRealmoney = cnMoneyToPrec(total);
		}
	})
	DWREngine.setAsync(false);
	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : '0'  // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "BudgetInfoTreeQuery",
			businessName : "bdgMgm",
			parent : 0,
			pid : currentPid
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'center',
		width : 800,
		minSize : 275,
		maxSize : 600,
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		columns : [{
			header : '概算名称',
			width : 350,
			dataIndex : 'bdgname'
		}, {
			header : '概算主键',
			width : 0, // 隐藏字段
			dataIndex : 'bdgid',
			renderer : function(value) {
				return "<div id='bdgid'>" + value + "</div>";
			}
		}, {
			header : '项目工程编号',
			width : 0, // 隐藏字段
			dataIndex : 'pid'
		}, {
			header : '财务编码',
			width : 100,
			dataIndex : 'bdgno'
		}, {
			header : '是否工程量',
			width : 0,
			dataIndex : 'bdgflag',
			renderer : function(value) {
				return value > 0 ? '概算' : '工程量';
			}
		}, {
			header : '概算金额',
			width : 120,
			dataIndex : 'bdgmoney',
			renderer : function(value) {
				return '<div id="bdgmoney" align=right>' + cnMoneyToPrec(value) + '</div>';
			}			
		}, {
			header : '合同分摊总金额',
			width : 120,
			dataIndex : 'contmoney',
			align : 'right',
			renderer : function(value) {
				return '<div align=right>' + cnMoneyToPrec(value) + '</div>';
			}
		},{
			header : '已付款分摊',
			width : 120,
			dataIndex : 'sumfactpay',
			align : 'right',
			renderer : function(value) {
				return '<div align=right>' + cnMoneyToPrec(value) + '</div>';
			}
		}, {
			header : '付款分摊差值',
			width : 120,
			dataIndex : 'difference',
			align : 'right',
			renderer : function(value) {
				return '<div align=right>' + cnMoneyToPrec(value) + '</div>';
			}
		},  {
			header : '合同分摊差值',
			width : 120,
			dataIndex : 'remainder',
			align : 'right',
			renderer : function(value) {
				var str;
				if (value.toString().charAt(0) == "-") {
					str = '<div align=right style="color:red">'
							+ cnMoneyToPrec(value) + '</div>';
				} else {
					str = '<div align=right >' + cnMoneyToPrec(value) + '</div>';
				}
				return str;
			}
		}, {
			header : '材料金额',
			width : 0,
			dataIndex : 'matrmoney'
		}, {
			header : '建筑金额',
			width : 0,
			dataIndex : 'buildmoney'
		}, {
			header : '设备安装金额',
			width : 0,
			dataIndex : 'equmoney'
		}, {
			header : '是否子节点',
			width : 0,
			dataIndex : 'isleaf',
			renderer : function(value) {
				return "<div id='isleaf'>" + value + "</div>";
			}
		}, {
			header : '父节点',
			width : 0,
			dataIndex : 'parent',
			renderer : function(value) {
				return "<div id='parent'>" + value + "</div>";
			}
		}, {
			header : '概算金额Cal1',
			width : 0,			
			dataIndex : 'bdgmoneyCal',
			renderer : function(value) {
				return '<div id="bdgmoneyCal" align=right style="display:none"> ' + cnMoneyToPrec(value) + '</div>';
			}			
		}],
		loader : treeLoader,
		root : root,
		rootVisible : false
	});

	treePanel.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = bdgid;
	})

	treePanel.on('contextmenu', contextmenu, this);
	var treeMenu
	function contextmenu(node, e) {
		node.fireEvent("click", node, e)
		var name = e.getTarget().innerText;
		var isRoot = (rootText == name);
		if (rootText == name)
			return;
		var treeMenu = new Ext.menu.Menu({
			id : 'treeMenu',
			width : 100,
			items : [
				{
				id : 'menu_add',
				text : '　新增',
				hidden:true,
				value : node,
				iconCls : 'add',
				handler : toHandler
			},  {
				id : 'menu_update',
				text : '　修改',
				hidden:true,
				value : node,
				iconCls : 'btn',
				handler : toHandler
			}, {
				id : 'menu_del',
				text : '　删除',
				hidden:true,
				value : node,
				iconCls : 'remove',
				handler : toHandler
			}, 
			{
				id : 'overview',
				text : '查看',
				iconCls : 'btn',
				value : node,
				handler : popQueryBdgid
			}]
		});

		var coords = e.getXY();
		treeMenu.showAt([coords[0], coords[1]]);
		if (isRoot) {
			treeMenu.items.get("menu_update").disable();
			treeMenu.items.get("menu_del").disable();
		} else {
			treeMenu.items.get("menu_update").enable();
			treeMenu.items.get("menu_del").enable();
		}
	}

	function toHandler() {
		formPanel.expand();
		var node = tmpNode;
		var state = this.text;
		var elNode = node.getUI().elNode;
		var isRoot = (rootText == node.text);
		var menu_nodeId = isRoot ? "0" : elNode.all("bdgid").innerText;
		var menu_parent = isRoot ? "0" : elNode.all("parent").innerText;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;

		if ("　新增" == state) {
			saveBtn.setDisabled(false);
			var formRecord = Ext.data.Record.create(Columns);
			loadFormRecord = new formRecord({
				pid : CURRENTAPPID,
				bdgid : null,
				bdgno : '',
				bdgname : '',
				bdgflag : 0,
				bdgmoney : 0,
				contmoney : 0,
				matrmoney : 0,
				buildmoney : 0,
				equmoney : 0,
				isleaf : 1,
				parent : menu_nodeId,
				bdgmoneyCal : 0
			});
			formPanel.isNew = true
			formPanel.getForm().loadRecord(loadFormRecord);
		} else if ("　删除" == state) {
			delHandler(menu_nodeId, node);
		} else {
			formPanel.isNew = false
			// if (menu_isLeaf == 1) {
			saveBtn.setDisabled(false);
			// }
		}
	}

	function delHandler(nodeid, node) {
		var hasChild = true;
		DWREngine.setAsync(false);
		bdgInfoMgm.isHasChilds(nodeid, function(flag){
			if(flag){
				Ext.Msg.show({
					title : '提示',
					msg : '父节点不能直接删除操作！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
			} else{
				hasChild = false
			}
		})
		DWREngine.setAsync(true);
		//如果存在子節點，則不執行
		if (hasChild) return;
		//是否可刪除（true：是 false：否）
		var isDel = false;
		DWREngine.setAsync(false);
		bdgInfoMgm.isApportion(nodeid, function(flag) {
			if (flag == true) {
				isDel = false
				Ext.Msg.show({
					title : '提示',
					msg : '有分摊记录不能删除',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});					
			} else{
				isDel = true;
			}
		})
		DWREngine.setAsync(true);
		if( !isDel ) return
		Ext.Msg.show({
			title : '提示',
			msg : '是否删除' + node.attributes.bdgname + '['
					+ node.attributes.bdgno + ']',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,

			fn : function(value) {
				if ("yes" == value) {
					treePanel.getEl().mask("loading...");
					bdgInfoMgm.deleteChildNode(nodeid, function(flag) {
						if ("0" == flag) {

							var formDelRecord = Ext.data.Record
									.create(Columns);
							var flag = (node.parentNode.childNodes.length == 1)
							var pNode = flag
									? node.parentNode.parentNode
									: node.parentNode

							var formRecord = Ext.data.Record
									.create(Columns);
							var emptyRecord = new formRecord({
								pid : CURRENTAPPID,
								bdgid : null,
								bdgno : '',
								bdgname : '',
								bdgflag : 0,
								bdgmoney : 0,
								matrmoney : 0,
								buildmoney : 0,
								equmoney : 0,
								isleaf : 1,
								parent : ""
							});
							formPanel.getForm().loadRecord(emptyRecord);
							formPanel.getForm().clearInvalid();

							if (flag) {
								var bdgid = pNode.attributes.bdgid;
								var baseParams = treePanel.loader.baseParams
								baseParams.parent = bdgid;
							}
							treeLoader.load(pNode);
							pNode.expand();
							Ext.example.msg('删除成功！', '您成功删除了一条概算信息！');
						} else {
							Ext.Msg.show({
								title : '提示',
								msg : '数据删除失败！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
						treePanel.getEl().unmask();
					});
				}
			}
		});
		
	}

	treePanel.on('click', onClick);
	function onClick(node, e) {
		var elNode = node.getUI().elNode;
		var isRoot = node == root;
		var menu_isLeaf = isRoot ? "false" : elNode.all("isleaf").innerText;
		var menu_bdgid = isRoot ? "0" : elNode.all("bdgid").innerText;
		var formRecord = Ext.data.Record.create(Columns);
		var loadFormRecord = null;

		saveBtn.setDisabled(true);
		DWREngine.setAsync(false);
		baseMgm.findById(beanName, menu_bdgid, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);

		tmpNode = node;
		tmpLeaf = menu_isLeaf;

		formPanel.getForm().loadRecord(loadFormRecord);
	}
	
	var btnCheck = new Ext.Button({
		id: 'checkBal',
		text: '查看',
		tooltip: '检查概算平衡情况',
		iconCls: 'btn',
		handler: popQueryBdgid
	});

	var contentPanel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		border : false,
		header : false,
		tbar : [
				'<font color=#15428b><b>&nbsp;' + treePanelTitle
						+ '</b></font>', btnCheck,'->', '所有合同分摊总金额：' + allRealmoney],
		items : [treePanel, formPanel]
	})

	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
			layout : 'border',
			items : [contentPanel],
			title : 'Simple Tasks',
			iconCls : 'icon-show-all'
		}).render();
	} else {
		var viewport = new Ext.Viewport({
			layout : 'border',
			items : [contentPanel]
		});
	}
	treePanel.render(); // 显示树
	root.expand();
	treePanel.expand();
//	treePanel.expandPath('/0/01/0103/010305');
//	treePanel.selectPath('/0/01/0103/010305');

	function popQueryBdgid() {
		var node = tmpNode;
		var elNode = node.getUI().elNode;
		var bdgid = elNode.all("bdgid").innerText;
		var datas = new Array();

		DWREngine.setAsync(false);
		bdgInfoMgm.queryBdgid(bdgid, function(list) {
			for (var i = 0; i < list.length; i++) {
				var obj = new Array();
				obj.push((list[i].BDGID));
				obj.push((list[i].CONID));
				obj.push((list[i].CONNO));
				obj.push((list[i].CONNAME));
				obj.push((list[i].REALMONEY));
				obj.push((list[i].BDGNAME));
				
				obj.push((list[i].CAMONEY));
				obj.push((list[i].BDGMONEY));
				
				obj.push((list[i].MONEY));
				obj.push((list[i].FACTPAY));
				obj.push((list[i].APPMONEY));
				obj.push((list[i].CLAMONEY));
				obj.push((list[i].BALMONEY));
				datas.push(obj);
			}
		});
		DWREngine.setAsync(true);
		ds.loadData(datas)

		if (!queryBdgid) {
			queryBdgid = new Ext.Window({
				header : false,
				layout : 'fit',
				width : 800,
				height : 350,
				title: "该概算分摊情况查看",
				// constrain: true,
				modal : false,
				maximizable : true,
				// minimizable: true,
				closeAction : 'hide',
				plain : true,
				items : [grid]
			});
		}
		queryBdgid.show();
	}
	
	function funCkeckBal(){
		window.showModalDialog( basePath+ "Business/budget/bdg.frame.checkBal.jsp",null,"dialogWidth:800px;dialogHeight:600px;center:yes;resizable:yes;")
	}

});