var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsTz";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";
var orderBy = 'inSubUids asc,chbm asc,finished desc,danhao desc,shrq asc';

var selectTreeId = "";
var fixedFilterPart = "1=1";
var pageFilter = "1=1";
var exportType = "";
var exportFilter = "1=1";
Ext.onReady(function() {

	var root = new Ext.tree.TreeNode({
				text : '出入库类型',
				id : '0'
			});
	var node1 = new Ext.tree.TreeNode({
				text : '主体设备出入库',
				id : 'ZTSB'
			});
	var node2 = new Ext.tree.TreeNode({
				text : '主体材料出入库',
				id : 'ZTCL'
			});
	var node3 = new Ext.tree.TreeNode({
				text : '备品备件出入库',
				id : 'BPBJ'
			});
	var node4 = new Ext.tree.TreeNode({
				text : '专用工具出入库',
				id : 'ZYGJ'
			});
	root.appendChild(node1);
	root.appendChild(node2);
	root.appendChild(node3);
	root.appendChild(node4);

	var treePanel = new Ext.tree.TreePanel({
				id : 'orgs-tree',
				region : 'west',
				split : true,
				width : 160,
				frame : false,
				border : true,
				collapsible : true,
				rootVisible : true,
				lines : true,
				autoScroll : true,
				animCollapse : false,
				animate : false,
				collapseMode : 'mini',
				loader : new Ext.tree.TreeLoader({}),
				root : root,
				collapseFirst : false
			});

	var tzTypeArr1 = [['ZTSBRK', '主体设备入库'], ['ZTSBCK', '主体设备出库']];
	var tzTypeArr2 = [['ZTCLRK', '主体材料入库'], ['ZTCLCK', '主体材料出库']];
	var tzTypeArr3 = [['BPBJRK', '备品备件入库'], ['BPBJCK', '备品备件出库']];
	var tzTypeArr4 = [['ZYGJRK', '专用工具入库'], ['ZYGJCK', '专用工具出库']];
	var tzTypeArr = tzTypeArr1.concat(tzTypeArr2).concat(tzTypeArr3).concat(tzTypeArr4);
	var tzTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : tzTypeArr
			});

	//出入库类型
	var equTypeArr = [['正式入库','正式入库'],['暂估入库','暂估入库'],['正式出库','正式出库'],['暂估出库','暂估出库']];

	var fm = Ext.form;
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'type' : {
			name : 'type',
			fieldLabel : '物资台帐类型'
		},
		'shrq' : {
			name : 'shrq',
			fieldLabel : '审核日期'
		},
		'chbm' : {
			name : 'chbm',
			fieldLabel : '存货编码'
		},
		'chmc' : {
			name : 'chmc',
			fieldLabel : '存货名称'
		},
		'ggxh' : {
			name : 'ggxh',
			fieldLabel : '规格型号'
		},
		'dw' : {
			name : 'dw',
			fieldLabel : '主计量单位'
		},
		'finiStockNum' : {
			name : 'finiStockNum',
			fieldLabel : '期初数量'
		},
		'finiStockPrice' : {
			name : 'finiStockPrice',
			fieldLabel : '期初单价'
		},
		'finiStockMoney' : {
			name : 'finiStockMoney',
			fieldLabel : '期初金额'
		},
		'inNum' : {
			name : 'inNum',
			fieldLabel : '收入数量'
		},
		'inPrice' : {
			name : 'inPrice',
			fieldLabel : '收入单价'
		},
		'inAmount' : {
			name : 'inAmount',
			fieldLabel : '收入金额'
		},
		'outNum' : {
			name : 'outNum',
			fieldLabel : '发出数量'
		},
		'outPrice' : {
			name : 'outPrice',
			fieldLabel : '发出单价'
		},
		'outAmount' : {
			name : 'outAmount',
			fieldLabel : '发出金额'
		},
		'llyt' : {
			name : 'llyt',
			fieldLabel : '领料用途'
		},
		'cwkm' : {
			name : 'cwkm',
			fieldLabel : '财务科目'
		},
		'stockNum' : {
			name : 'stockNum',
			fieldLabel : '结存数量'
		},
		'stockPrice' : {
			name : 'stockPrice',
			fieldLabel : '结存单价'
		},
		'stockMoney' : {
			name : 'stockMoney',
			fieldLabel : '结存金额'
		},

		'riqi' : {
			name : 'riqi',
			fieldLabel : '出入库日期'
		},
		'danhao' : {
			name : 'danhao',
			fieldLabel : '单据号'
		},
		'cangkuType' : {
			name : 'cangkuType',
			fieldLabel : '仓库类型'
		},
		'cangku' : {
			name : 'cangku',
			fieldLabel : '仓库号'
		},
		'kczz' : {
			name : 'kczz',
			fieldLabel : '库存组织'
		},
		'conno' : {
			name : 'conno',
			fieldLabel : '合同号'
		},
		'ghdw' : {
			name : 'ghdw',
			fieldLabel : '供货单位'
		},
		'zdr' : {
			name : 'zdr',
			fieldLabel : '制单人'
		},
		'shr' : {
			name : 'shr',
			fieldLabel : '审核人'
		},
		'kks' : {
			name : 'kks',
			fieldLabel : 'KKS编码'
		},
		'azbw' : {
			name : 'azbw',
			fieldLabel : '安装部位'
		},
		'conmoneyno' : {
			name : 'conmoneyno',
			fieldLabel : '财务合同编号'
		},
		'conttreetype' : {
			name : 'conttreetype',
			fieldLabel : '设备合同分类树'
		}
	};

	sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([
			// sm,
			{
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'conmoneyno',
				header : fc['conmoneyno'].fieldLabel,
				dataIndex : fc['conmoneyno'].name,
				hidden : true
			}, {
				id : 'riqi',
				header : fc['riqi'].fieldLabel,
				dataIndex : fc['riqi'].name,
				renderer : formatDate,
				align : 'center',
				width : 140,
				type : 'date'
			}, {
				id : 'type',
				header : fc['type'].fieldLabel,
				dataIndex : fc['type'].name,
				align : 'center',
				renderer : function(v) {
					for (var i = 0; i < tzTypeArr.length; i++) {
						if (v.indexOf(tzTypeArr[i][0]) == 0) {
							return tzTypeArr[i][1]
						}
					}
				}
			}, {
				id : 'danhao',
				header : fc['danhao'].fieldLabel,
				dataIndex : fc['danhao'].name,
				align : 'center',
				width : 220,
				type : 'string'
			}, {
				id : 'cangkuType',
				header : fc['cangkuType'].fieldLabel,
				dataIndex : fc['cangkuType'].name,
				align : 'center',
				width : 100
			}, {
				id : 'cangku',
				header : fc['cangku'].fieldLabel,
				dataIndex : fc['cangku'].name,
				align : 'center',
				width : 100
			}, {
				id : 'kczz',
				header : fc['kczz'].fieldLabel,
				dataIndex : fc['kczz'].name,
				width : 220,
				type : 'string'
			}, {
				id : 'conno',
				header : fc['conno'].fieldLabel,
				dataIndex : fc['conno'].name,
				width : 180,
				type : 'string'
			}, {
				id : 'ghdw',
				header : fc['ghdw'].fieldLabel,
				dataIndex : fc['ghdw'].name,
				width : 220,
				type : 'string'
			}, {
				id : 'zdr',
				header : fc['zdr'].fieldLabel,
				dataIndex : fc['zdr'].name,
				align : 'center',
				width : 100,
				type : 'string'
			}, {
				id : 'shr',
				header : fc['shr'].fieldLabel,
				dataIndex : fc['shr'].name,
				align : 'center',
				width : 100,
				type : 'string'
			}, {
				id : 'shrq',
				header : fc['shrq'].fieldLabel,
				dataIndex : fc['shrq'].name,
				renderer : formatDate,
				align : 'center',
				width : 120,
				type : 'date'
			}, {
				id : 'chbm',
				header : fc['chbm'].fieldLabel,
				dataIndex : fc['chbm'].name,
				align : 'center',
				width : 160,
				type : 'string'
			}, {
				id : 'chmc',
				header : fc['chmc'].fieldLabel,
				dataIndex : fc['chmc'].name,
				width : 240,
				type : 'string'
			}, {
				id : 'ggxh',
				header : fc['ggxh'].fieldLabel,
				dataIndex : fc['ggxh'].name,
				align : 'center',
				width : 160,
				type : 'string'
			}, {
				id : 'dw',
				header : fc['dw'].fieldLabel,
				dataIndex : fc['dw'].name,
				align : 'center',
				width : 90,
				type : 'string'
			}, {
				id : 'finiStockNum',
				header : fc['finiStockNum'].fieldLabel,
				dataIndex : fc['finiStockNum'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'first') {
						meta.attr = "style=background-color:#FF9F9E";
						return v;
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v;
					} else {
						return "";
					}
				}
			}, {
				id : 'finiStockPrice',
				header : fc['finiStockPrice'].fieldLabel,
				dataIndex : fc['finiStockPrice'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'first') {
						meta.attr = "style=background-color:#FF9F9E";
						return v.toFixed(2);
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v.toFixed(2);
					} else {
						return "";
					}
				}
			}, {
				id : 'finiStockMoney',
				header : fc['finiStockMoney'].fieldLabel,
				dataIndex : fc['finiStockMoney'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'first') {
						meta.attr = "style=background-color:#FF9F9E";
						return v.toFixed(2);
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v.toFixed(2);
					} else {
						return "";
					}
				}
			}, {
				id : 'inNum',
				header : fc['inNum'].fieldLabel,
				dataIndex : fc['inNum'].name,
				align : 'right',
				width : 120
			}, {
				id : 'inPrice',
				header : fc['inPrice'].fieldLabel,
				dataIndex : fc['inPrice'].name,
				align : 'right',
				width : 120,
				renderer : function(v) {
					return v.toFixed(2);
				}
			}, {
				id : 'inAmount',
				header : fc['inAmount'].fieldLabel,
				dataIndex : fc['inAmount'].name,
				align : 'right',
				width : 120,
				renderer : function(v) {
					return v.toFixed(2);
				}
			}, {
				id : 'outNum',
				header : fc['outNum'].fieldLabel,
				dataIndex : fc['outNum'].name,
				align : 'right',
				width : 120
			}, {
				id : 'outPrice',
				header : fc['outPrice'].fieldLabel,
				dataIndex : fc['outPrice'].name,
				align : 'right',
				width : 120,
				renderer : function(v) {
					return v.toFixed(2);
				}
			}, {
				id : 'outAmount',
				header : fc['outAmount'].fieldLabel,
				dataIndex : fc['outAmount'].name,
				align : 'right',
				width : 120,
				renderer : function(v) {
					return v.toFixed(2);
				}
			}, {
				id : 'llyt',
				header : fc['llyt'].fieldLabel,
				dataIndex : fc['llyt'].name,
				width : 200
			}, {
				id : 'cwkm',
				header : fc['cwkm'].fieldLabel,
				dataIndex : fc['cwkm'].name,
				width : 200
			}, {
				id : 'kks',
				header : fc['kks'].fieldLabel,
				dataIndex : fc['kks'].name,
				width : 200
			}, {
				id : 'azbw',
				header : fc['azbw'].fieldLabel,
				dataIndex : fc['azbw'].name,
				width : 200
			},
		
			{
				id : 'stockNum',
				header : fc['stockNum'].fieldLabel,
				dataIndex : fc['stockNum'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'last') {
						meta.attr = "style=background-color:#C8C8FE";
						return v;
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v;
					} else {
						return "";
					}
				}
			}, {
				id : 'stockPrice',
				header : fc['stockPrice'].fieldLabel,
				dataIndex : fc['stockPrice'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'last') {
						meta.attr = "style=background-color:#C8C8FE";
						return v.toFixed(2);
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v.toFixed(2);
					} else {
						return "";
					}
				}
			}, {
				id : 'stockMoney',
				header : fc['stockMoney'].fieldLabel,
				dataIndex : fc['stockMoney'].name,
				align : 'right',
				width : 120,
				renderer : function(v, meta, rec) {
					if (rec.get('flag') == 'last') {
						meta.attr = "style=background-color:#C8C8FE";
						return v.toFixed(2);
					} else if (rec.get('flag') == 'both') {
						meta.attr = "style=background-color:#fcd677";
						return v.toFixed(2);
					} else {
						return "";
					}
				}
			}, {
				id : 'conttreetype',
				header : fc['conttreetype'].fieldLabel,
				dataIndex : fc['conttreetype'].name,
				hidden : true
			}, {
				id : 'flag',
				header : "是否第一条或最后一条",
				dataIndex : "flag",
				hidden : true
			}, {
				id : 'inSubUids',
				header : "入库单明细主键",
				dataIndex : "inSubUids",
				hidden : true
			}, {
				id : 'equType',
				header : "出入库类型",
				dataIndex : "equType",
				hidden : false,
				type : 'combo',
				store : equTypeArr
			}]);

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'riqi',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'type',
				type : 'string'
			}, {
				name : 'danhao',
				type : 'string'
			}, {
				name : 'cangkuType',
				type : 'string'
			}, {
				name : 'cangku',
				type : 'string'
			}, {
				name : 'kczz',
				type : 'string'
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'ghdw',
				type : 'string'
			}, {
				name : 'zdr',
				type : 'string'
			}, {
				name : 'shr',
				type : 'string'
			}, {
				name : 'shrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'chbm',
				type : 'string'
			}, {
				name : 'chmc',
				type : 'string'
			}, {
				name : 'ggxh',
				type : 'string'
			}, {
				name : 'dw',
				type : 'string'
			}, {
				name : 'finiStockNum',
				type : 'float'
			}, {
				name : 'finiStockPrice',
				type : 'float'
			}, {
				name : 'finiStockMoney',
				type : 'float'
			}, {
				name : 'inNum',
				type : 'float'
			}, {
				name : 'inPrice',
				type : 'float'
			}, {
				name : 'inAmount',
				type : 'float'
			}, {
				name : 'outNum',
				type : 'float'
			}, {
				name : 'outPrice',
				type : 'float'
			}, {
				name : 'outAmount',
				type : 'float'
			}, {
				name : 'llyt',
				type : 'string'
			}, {
				name : 'cwkm',
				type : 'string'
			}, {
				name : 'stockNum',
				type : 'float'
			}, {
				name : 'stockPrice',
				type : 'float'
			}, {
				name : 'stockMoney',
				type : 'float'
			}, {
				name : 'kks',
				type : 'string'
			}, {
				name : 'azbw',
				type : 'string'
			}, {
				name : 'conmoneyno',
				type : 'string'
			}, {
				name : 'conttreetype',
				type : 'string'
			}, {
				name : 'flag',
				type : 'string'
			}, {
				name : 'inSubUids',
				type : 'string'
			}, {
				name : 'equType',
				type : 'string'
			}];

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'equGoodsTz',
					bean : bean,
					business : business,
					orderby : orderBy,
					params : "1=1"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : CONTEXT_PATH + "/servlet/EquServlet"
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'asc');
	ds.on('load', function() {
		exportFilter = ds.baseParams.params;
		if (exportFilter == null || exportFilter == '') {
			exportFilter = "1=1";
		}
		var whereStr = exportFilter;
		//此处特殊处理，fixedFilterPart条件中的仓库号不带下划线，
		//此处查询直接用原始sql，需要为仓库号增加下划线
		if (whereStr.indexOf('cangkuType') > 1) {
			whereStr = whereStr.replace(/cangkuType/g, 'cangku_Type');
		}
		if (whereStr.indexOf('equType') > 1) {
			whereStr = whereStr.replace(/equType/g, 'equ_Type');
		}
		// 获得过滤条件下所有数据的期初，入库，出库，结存统计值 pengy 2013-10-18
		equMgm.equGoodsTzStatistic(whereStr, function(list) {
					Ext.get('begin1').update(typeof list[0].finiStockNum == 'undefined'
									? 0 : list[0].finiStockNum);
					Ext.get('begin2').update(typeof list[0].finiStockMoney == 'undefined'
									? 0 : list[0].finiStockMoney);
					Ext.get('in1').update(typeof list[0].inNum == 'undefined'
									? 0 : list[0].inNum);
					Ext.get('in2').update(typeof list[0].inAmount == 'undefined'
									? 0 : list[0].inAmount);
					Ext.get('out1').update(typeof list[0].outNum == 'undefined'
									? 0 : list[0].outNum);
					Ext.get('out2').update(typeof list[0].outAmount == 'undefined'
									? 0 : list[0].outAmount);
					Ext.get('end1').update(typeof list[0].stockNum == 'undefined'
									? 0 : list[0].stockNum);
					Ext.get('end2').update(typeof list[0].stockMoney == 'undefined'
									? 0 : list[0].stockMoney);
				})
	})
	cm.defaultSortable = false;

	ds.on('beforeload', function() {
				var tz = tzCombo.getValue();
				if (tz) {
					if (tz == '0') {
						ds.baseParams.params += " and finished=1";
					} else if (tz == '1') {
						ds.baseParams.params += " and finished=0";
					}
				}
			});

	var initBtn = new Ext.Button({
				id : 'initBtn',
				text : '初始化',
				tooltip : '初始化所有已完结出入库数据',
				iconCls : 'btn',
				hidden : (init == ''),
				handler : function() {
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍等 ！"
							});
					myMask.show();
					equMgm.initEquWzTz(selectTreeId, CURRENTAPPID, function() {
								myMask.hide();
								ds.load({
											params : {
												start : 0,
												limit : PAGE_SIZE
											}
										});
							});
				}
			});

	var initUnfinishBtn = new Ext.Button({
				id : 'initUnfinishBtn',
				text : '初始化未完结台账',
				tooltip : '初始化所有未完结出入库数据',
				iconCls : 'btn',
				handler : function() {
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍等 ！"
							});
					myMask.show();
					equMgm.initEquUnfinishWzTz(selectTreeId, CURRENTAPPID, function(str) {
								if (str == 'true') {
									Ext.example.msg('提示', '初始化成功!');
								} else {
									Ext.example.msg('提示', '初始化失败!');
								}
								myMask.hide();
								tzCombo.setValue('1');
								pageFilter = "1=1";
								root.select();
								wareTreeCombo.reset();
								tzTypeDs.loadData(tzTypeArr);
								tzTypeCombo.clearValue();
								ds.baseParams.params = " 1=1";
								ds.load({
											params : {
												start : 0,
												limit : PAGE_SIZE
											}
										});
							});
				}
			});

	var tzCombo = new Ext.form.ComboBox({
				id : 'tzCombo',
				name : 'tzCombo',
				width : 80,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : [["0", "完结台账"], ["1", "未完结台账"], ["2", "所有台账"]],
				value : '0',
				readOnly : true,
				listeners : {
					'select' : function(combo, record, index) {
						pageFilter = "1=1";
						root.select();
						wareTreeCombo.reset();
						tzTypeDs.loadData(tzTypeArr);
						tzTypeCombo.clearValue();
						ds.baseParams.params = " 1=1";
						ds.load({
									params : {
										start : 0,
										limit : PAGE_SIZE
									}
								});
					}
				}
			});

	//新设备仓库分类树
	var wareTreeCombo = new Ext.ux.TreeCombo({
				id : 'equid',
				name : 'equid',
				fieldLabel : '仓库号',
				resizable : true,
				width : 100,
				treeWidth : 230,
				allowBlank : false,
				rootVisible : false,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "ckxxTreeNew",
								businessName : "equBaseInfo",
								parent : '01'
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "仓库信息",
							iconCls : 'form',
							expanded : true
						})
			});
	wareTreeCombo.getTree().on('beforeload', function(node) {
				wareTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	wareTreeCombo.on('select', function(tree, node) {
				var value = wareTreeCombo.getValue();
				var text = wareTreeCombo.getRawValue()
				if (value.length == 4) {
					ds.baseParams.params = pageFilter + " and cangkuType='" + text + "'";
				} else {
					ds.baseParams.params = pageFilter + " and cangku='" + text + "'";
				}
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				fixedFilterPart = ds.baseParams.params;
			});

	var tzTypeCombo = new Ext.form.ComboBox({
				width : 100,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				triggerAction : 'all',
				store : tzTypeDs,
				readOnly : true,
				listeners : {
					select : function(combo, record, index) {
						var type = record.data.k;
						exportType = type;
						if (type.indexOf('BPBJ') == 0) {
							ds.baseParams.params = " type like 'ZTSB"
									+ type.substring(4, 6) + "%' and conttreetype = '备品备件' ";
							ds.load({
										params : {
											start : 0,
											limit : PAGE_SIZE
										}
									});
							pageFilter = " 1=1 and type like 'ZTSB"
									+ type.substring(4, 6) + "%' and conttreetype = '备品备件'";
						} else if (type.indexOf('ZYGJ') == 0) {
							ds.baseParams.params = " type like 'ZTSB"
									+ type.substring(4, 6) + "%' and conttreetype = '专用工具' ";
							ds.load({
										params : {
											start : 0,
											limit : PAGE_SIZE
										}
									});
							pageFilter = " 1=1 and type like 'ZTSB"
									+ type.substring(4, 6) + "%' and conttreetype = '专用工具'";
						} else {
							ds.baseParams.params = " type like '" + type + "%' and conttreetype is null ";
							ds.load({
										params : {
											start : 0,
											limit : PAGE_SIZE
										}
									});
							pageFilter = " 1=1 and type like '" + type + "%' and conttreetype is null ";
						}
						fixedFilterPart = ds.baseParams.params;
						wareTreeCombo.reset();
					}
				}
			})

	var exportExcelBtn = new Ext.Button({
				id : 'export',
				text : '导出',
				tooltip : '导出数据到Excel',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler : function() {
					exportTzDataFile();
				}
			});

	//数据的导出
	function exportTzDataFile() {
		if (exportFilter == null || exportFilter == '') {
			exportFilter = "1=1";
		}
		//此处特殊处理，fixedFilterPart条件中的仓库号不带下划线，
		//此处查询直接用原始sql，需要为仓库号增加下划线
		var exportFilter2 = exportFilter;
		if (exportFilter2.indexOf('cangkuType') > 1) {
			exportFilter2 = exportFilter.replace(/cangkuType/g, 'cangku_Type');
		}
		var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportTzData&businessType=ExportEquGoodsTz&type="
				+ exportType + "&exportFilter=" + encodeURIComponent(exportFilter2);

		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	var exportMonthTotalBtn = new Ext.Button({
				id : 'exportMonthTotalBtn',
				text : '月度汇总表',
				tooltip : '导出月度汇总数据到Excel',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler : function() {
					exportMonthTotalTzFile();
				}
			});

	//数据的导出
	function exportMonthTotalTzFile() {
		if (exportFilter == null || exportFilter == '') {
			exportFilter = "1=1";
		}
		//此处特殊处理，fixedFilterPart条件中的仓库号不带下划线，
		//此处查询直接用原始sql，需要为仓库号增加下划线
		var exportFilter2 = exportFilter;
		if (exportFilter2.indexOf('cangkuType') > 1) {
			exportFilter2 = exportFilter.replace(/cangkuType/g, 'cangku_Type');
		}
		var openUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=exportTzData&businessType=ExportMonthTotalTz" +
				"&exportFilter=" + encodeURIComponent(exportFilter2);

		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	var totalTool1 = new Ext.Toolbar({
				items : ["期初数量累计：", "<div id='begin1'>0</div>", "期初金额累计：", "<div id='begin2'>0</div>",
						"收入数量累计：", "<div id='in1'>0</div>", "收入金额累计：", "<div id='in2'>0</div>"]
			});
	var totalTool2 = new Ext.Toolbar({
				items : ["发出数量累计：", "<div id='out1'>0</div>", "发出金额累计：", "<div id='out2'>0</div>",
						"结存数量累计：", "<div id='end1'>0</div>", "结存金额累计：", "<div id='end2'>0</div>"]
			});

	var gridPanel = new Ext.grid.QueryExcelGridPanel({
				ds : ds,
				cm : cm,
				sm : sm,
				title : '物资台帐',
				tbar : ['<font color=#15428b><B>物资台帐<B></font>', '-', initBtn, '-', '出入库：', tzTypeCombo, '-', 
						'仓库号：', wareTreeCombo, '-', exportExcelBtn, '-', initUnfinishBtn, '-', tzCombo, '-', exportMonthTotalBtn,'-'],
				header : false,
				border : true,
				region : 'center',
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				listeners : {
					"render" : function() {
						totalTool1.render(this.tbar);
						totalTool2.render(this.tbar);
					}
				}
			});

	var view = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, gridPanel],
				listeners : {
					afterlayout : function() {
						treePanel.root.expand();
						treePanel.root.select();
					}
				}
			});
	gridPanel.getTopToolbar().add('->', '单位：元', '&nbsp;&nbsp;');

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	treePanel.on('click', function(node) {
				selectTreeId = node.id;
				tzTypeCombo.clearValue();
				wareTreeCombo.reset();
				exportType = "";
				ds.baseParams.orderby = orderBy;
				if (selectTreeId == '0') {
					selectTreeId = "";
					tzTypeDs.loadData(tzTypeArr);
					ds.baseParams.params = "1=1";
					ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				} else {
					tzTypeCombo.clearValue();
					if (selectTreeId.indexOf("ZTSB") == 0) {
						tzTypeDs.loadData(tzTypeArr1);
					} else if (selectTreeId.indexOf("ZTCL") == 0) {
						tzTypeDs.loadData(tzTypeArr2);
					}
					ds.baseParams.params = " type like '" + selectTreeId + "%' and conttreetype is null ";
					pageFilter = " 1=1 and type like '" + selectTreeId + "%' and conttreetype is null ";

					if (selectTreeId.indexOf("BPBJ") == 0) {
						tzTypeDs.loadData(tzTypeArr3);
						ds.baseParams.params = " conttreetype = '备品备件' ";
						pageFilter = " 1=1 and conttreetype = '备品备件' ";
					} else if (selectTreeId.indexOf("ZYGJ") == 0) {
						tzTypeDs.loadData(tzTypeArr4);
						ds.baseParams.params = " conttreetype = '专用工具' ";
						pageFilter = " 1=1 and conttreetype = '专用工具' ";
					}
					if (selectTreeId.indexOf("ZHB") == 0 || selectTreeId.indexOf("SCB") == 0) {
						ds.baseParams.orderby = 'chbm asc,finished desc,danhao desc,shrq asc';
					}
					ds.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				}
				fixedFilterPart = ds.baseParams.params;
			})

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
});
