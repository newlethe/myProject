var treePanelNew;
var proappGrid;
var proappDs;
var proappBean = "com.sgepit.pmis.budget.hbm.BdgProject";

Ext.onReady(function() {
	var conUnit = new Array();
	var subjectArr = new Array();//财务科目
	DWREngine.setAsync(false);
	appMgm.getCodeValue('工程量施工单位', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					conUnit.push(temp)
				}
			});
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
	DWREngine.setAsync(true);

	/** =================================工程量清单概算树Begin===================================== */
	var rootNew = new Ext.tree.AsyncTreeNode({
			text : "工程量分摊",
			iconCls : 'form'
		});

	var treeLoaderNew = new Ext.tree.TreeLoader({
				url : MAIN_SERVLET,
				baseParams : {
					ac : "columntree",
					treeName : "bdgMoneyProjectTree",
					businessName : "bdgMgm",
					conid : conid,
					conmoney : 0,
					parent : 0
				},
				clearOnLoad : true,
				uiProviders : {
					'col' : Ext.tree.ColumnNodeUI
				}
			});

	treePanelNew = new Ext.tree.ColumnTree({
				id : 'budget-tree-panel',
				iconCls : 'icon-by-category',
				region : 'west',
				width : 300,
				minSize : 100,
				maxSize : 500,
				frame : false,
				header : false,
				border : false,
				split : true,
				collapsible : true,
				collapseMode : 'mini',
				lines : true,
				autoScroll : true,
				columns : [{
						header : '概算名称_概算编码(签订分摊金额)',
						width : 500,
						dataIndex : 'bdgname'
					}, {
						header : '概算编码',
						width : 0,
						dataIndex : 'bdgno',
						hidden : true
					}, {
						header : '项目工程编号',
						width : 0, // 隐藏字段
						dataIndex : 'pid',
						renderer : function(value) {
							return "<div id='pid'>" + value + "</div>";
						}
					}, {
						header : '概算金额主键',
						width : 0,
						dataIndex : 'appid',
						renderer : function(value) {
							return "<div id='appid' >" + value
									+ "</div>";
						}
					}, {
						header : '概算主键',
						width : 0,
						dataIndex : 'bdgid',
						renderer : function(value) {
							return "<div id='bdgid'>" + value + "</div>";
						}
					}, {
						header : '内部流水号',
						width : 0,
						dataIndex : 'conid',
						renderer : function(value) {
							return "<div id='conid'>" + value + "</div>";
						}
					}, {
						header : '本合同分摊总金额',
						width : 0,
						hidden : true,
						dataIndex : 'conappmoney',
						renderer : function(value) {
							return "<div id='conappmoney' align='right'>" + cnMoneyToPrec(value) + "</div>";
						}
					}, {
						header : '本合同签订分摊金额',
						width : 0,
						hidden : true,
						dataIndex : 'initappmoney',
						renderer : function(value) {
							return "<div id='initappmoney' align='right'>" + cnMoneyToPrec(value) + "</div>";
						}
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
						header : '备注',
						width : 0,
						dataIndex : 'remark'
					}],
				loader : treeLoaderNew,
				root : rootNew,
				rootVisible : false,
				tbar : [{
							iconCls : 'icon-expand-all',
							tooltip : 'Expand All',
							text : '全部展开',
							handler : function() {
								rootNew.expand(true);
							}
						}, '-', {
							iconCls : 'icon-collapse-all',
							tooltip : 'Collapse All',
							text : '全部收起',
							handler : function() {
								rootNew.collapse(true);
							}
						}]
				});

	treePanelNew.on('beforeload', function(node) {
				if(!conid){
					return false;
				}
				var bdgid = node.attributes.bdgid;
				if (bdgid == null)
					bdgid = '0';
				var baseParams = treePanelNew.loader.baseParams;
				baseParams.conid = conid;
				baseParams.conmoney = 0;
				baseParams.parent = bdgid;
			});

	treePanelNew.on('click', function(node, e) {
				selectedPath = "";
				var elNode = node.getUI().elNode;
				var bdgno = node.attributes.bdgno;
				var bdgid = elNode.all('bdgid').innerText;
				if(bdgno == '01'){
					proappDs.baseParams.params = "pid='" + pid + "' and conid='" + conid + "'";
				}else {
					var isLeaf = elNode.all("isleaf").innerText;
					if (isLeaf != 1) {
						var bdgids = "";
						var nodeid = node.id;
						DWREngine.setAsync(false);
						db2Json.selectData("select bdgid,bdgno from bdg_info where pid='" + pid
										+ "' start with parent='" + nodeid + "' connect by prior bdgid=parent",
								function(jsonData) {
									var list = eval(jsonData);
									if (list != null) {
										for (var i = 0; i < list.length; i++) {
											var bdgid = list[i].bdgid;
											bdgids += "'" + bdgid + "'" + ",";
										}
										bdgids = bdgids.substring(0, bdgids.length - 1);
									}
								});
						DWREngine.setAsync(true);
						proappDs.baseParams.params = "pid='" + pid + "' and conid='" + conid + "' and bdgid in (" + bdgids + ")" ;
					} else {
						proappDs.baseParams.params = "pid='" + pid + "' and bdgid='" + bdgid + "' and conid='" + conid + "'";
					}
				}
				proappDs.load();
			});

	treePanelNew.on('load', function(){
		if(!rootNew.isExpanded()){
			rootNew.expandChildNodes();
		}
		rootNew.eachChild(function(child){
			if(!child.isExpanded()){
				child.expandChildNodes();
			}
		})
	})

	/** =================================工程量清单概算树End======================================= */
	/** ===================================关联工程量Begin========================================= */
	var proappFc = { // 创建编辑域配置
		'proappid' : {
			name : 'proappid',
			fieldLabel : '工程量主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'pid'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键'
		},
		'bdgid' : {
			name : 'bdgid',
			fieldLabel : '概算主键'
		},
		'prono' : {
			name : 'prono',
			fieldLabel : '工程量编号'
		},
		'proname' : {
			name : 'proname',
			fieldLabel : '工程量名称'
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位'
		},
		'price' : {
			name : 'price',
			fieldLabel : '单价'
		},
		'amount' : {
			name : 'amount',
			fieldLabel : '总工程量'
		},
		'money' : {
			name : 'money',
			fieldLabel : '金额'
		},
		'state' : {
			name : 'state',
			fieldLabel : '状态'
		},
		'constructionUnit' : {
			name : 'constructionUnit',
			fieldLabel : '施工单位'
		},
		'quantitiesType' : {
			name : 'quantitiesType',
			fieldLabel : '工程量类型'
		},
		'financialAccount' : {
			name : 'financialAccount',
			fieldLabel : '财务科目'
		},
		'isper' : {
			name : 'isper',
			fieldLabel : '总工程量是否带百分号'
		}
	}

	var proappColumns = [{
				name : 'proappid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'bdgid',
				type : 'string'
			}, {
				name : 'prono',
				type : 'string'
			}, {
				name : 'proname',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'price',
				type : 'float'
			}, {
				name : 'amount',
				type : 'float'
			}, {
				name : 'money',
				type : 'float'
			}, {
				name : 'state',
				type : 'string'
			}, {
				name : 'constructionUnit',
				type : 'string'
			}, {
				name : 'quantitiesType',
				type : 'string'
			}, {
				name : 'financialAccount',
				type : 'string'
			}, {
				name : 'isper',
				type : 'string'
			}];

	var proappSm = new Ext.grid.CheckboxSelectionModel();

	var proappCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				id : 'proappid',
				header : proappFc['proappid'].fieldLabel,
				dataIndex : proappFc['proappid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : proappFc['pid'].fieldLabel,
				dataIndex : proappFc['pid'].name,
				hidden : true
			}, {
				id : 'conid',
				header : proappFc['conid'].fieldLabel,
				dataIndex : proappFc['conid'].name,
				hidden : true
			}, {
				id : 'bdgid',
				header : proappFc['bdgid'].fieldLabel,
				dataIndex : proappFc['bdgid'].name,
				hidden : true
			}, {
				id : 'prono',
				header : proappFc['prono'].fieldLabel,
				dataIndex : proappFc['prono'].name,
				width : 80,
				align : 'center'
			}, {
				id : 'proname',
				header : proappFc['proname'].fieldLabel,
				dataIndex : proappFc['proname'].name,
				width : 120,
				align : 'center'
			}, {
				id : 'unit',
				header : proappFc['unit'].fieldLabel,
				dataIndex : proappFc['unit'].name,
				width : 50,
				align : 'center'
			}, {
				id : 'price',
				header : proappFc['price'].fieldLabel,
				dataIndex : proappFc['price'].name,
				width : 80,
				align : 'right',
				renderer : cnMoney
			}, {
				id : 'amount',
				header : proappFc['amount'].fieldLabel,
				dataIndex : proappFc['amount'].name,
				width : 70,
				align : 'right',
				renderer : function(v, m, r) {
					return r.get('isper') == '1' ? (v * 100).toFixed(2) + "%" : v;
				}
			}, {
				id : 'money',
				header : proappFc['money'].fieldLabel,
				dataIndex : proappFc['money'].name,
				align : 'right',
				width : 70
			}, {
				id : 'constructionUnit',
				header : proappFc['constructionUnit'].fieldLabel,
				dataIndex : proappFc['constructionUnit'].name,
				renderer : function(v) {
					for (var i = 0; i < conUnit.length; i++) {
						if (conUnit[i][0] == v) {
							return conUnit[i][1];
						}
					}
				}
			}, {
				id : 'quantitiesType',
				header : proappFc['quantitiesType'].fieldLabel,
				dataIndex : proappFc['quantitiesType'].name,
				width : 120
			}, {
				id : 'financialAccount',
				header : proappFc['financialAccount'].fieldLabel,
				dataIndex : proappFc['financialAccount'].name,
				width : 250,
				renderer : function(v) {
					for (var i = 0; i < subjectArr.length; i++) {
						if (v == subjectArr[i][0]) {
							return subjectArr[i][1];
						}
					}
				}
			}, {
				id : 'state',
				header : proappFc['state'].fieldLabel,
				dataIndex : proappFc['state'].name,
				width : 40,
				align : 'center',
				renderer : function(value) {
					if (value == '4') {
						value = '签订';
					}
					return value;
				}
			}, {
				id : 'isper',
				header : proappFc['isper'].fieldLabel,
				dataIndex : proappFc['isper'].name,
				hidden : true
			}]);
	proappCm.defaultSortable = true;

	proappDs = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : proappBean,
					business : business,
					method : listMethod,
					params: "pid = '" + pid + "' and conid='" + conid + "'"  // where 子句
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'proappid'
						}, proappColumns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	proappDs.setDefaultSort('conid', 'asc');

	proappGrid = new Ext.grid.GridPanel({
				ds : proappDs,
				cm : proappCm,
				sm : proappSm,
				header : false,
				tbar : ['<span style="color:#15428b; font-weight:bold">&nbsp;工程量清单</span>'],
				region : 'center',
				border : true,
				autoScroll : true, //自动出现滚动条
				animCollapse : false, //折叠时显示动画
				loadMask : true, //加载时是否显示进度
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 15,
					store : proappDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});	

	/** ===================================关联工程量End=========================================== */
});
