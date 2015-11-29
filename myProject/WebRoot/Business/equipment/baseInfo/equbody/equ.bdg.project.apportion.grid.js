/**
 * 出库明细关联到工程量，yanglh 2013-12-16
 */
var beanGcl = "com.sgepit.pmis.budget.hbm.BdgProject";
var listMethod = "findWhereOrderby";
var business = "baseMgm";
var primaryKeyGcl = "proappid";
var conUnit = new Array();
var gcType = new Array();
var bdgArr = new Array();
var subjectArr = new Array();
var assetArr = new Array();

var gclDs;
var gclGrid;

Ext.onReady(function() {
	
	DWREngine.setAsync(false);
	appMgm.getCodeValue('工程量施工单位', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					conUnit.push(temp)
				}
			})
	var sql = "select treeid,gc_type_name from FAComp_Gc_Type where pid='" + CURRENTAPPID + "'";
	baseDao.getData(sql, function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					gcType.push(temp);
				}
			});
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='"
					+ CURRENTAPPID + "' order by bdgid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					bdgArr.push(temp);
				}
			});
	baseDao.getData("select TREEID,SUBJECT_NAME,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='"
							+ CURRENTAPPID + "'", function(list) {
						for (i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							subjectArr.push(temp);
						}
					});
	baseDao.getData("select t.treeid,t.fixedname from FACOMP_FIXED_ASSET_LIST t where PID='"
					+ CURRENTAPPID + "'", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					assetArr.push(temp);
				}
			});
	/*baseMgm.getData("select uids,treeid,treename from UNIT_WAREHOUSE_CON_EQUSUB_VIEW start with parentid='01' connect by prior treeid=parentid", function(list) {
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][1]);
			temp.push(list[i][2]);
			assetArr.push(temp);
		}
	})*/
	DWREngine.setAsync(true);

	var fm = Ext.form;
	var fc = {
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
			fieldLabel : '项目编码',
			anchor : '95%'
		},
		'proname' : {
			name : 'proname',
			fieldLabel : '项目名称',
			allowBlank : false,
			anchor : '95%'
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'price' : {
			name : 'price',
			fieldLabel : '综合单价（元）',
			anchor : '95%'
		},
		'amount' : {
			name : 'amount',
			fieldLabel : '合同工程量',
			anchor : '95%'
		},
		'money' : {
			name : 'money',
			fieldLabel : '合同价款（元）',
			anchor : '95%'
		},
		'state' : {
			name : 'state',
			fieldLabel : '状态'
		},

		'parent' : {
			name : 'parent',
			fieldLabel : '父节点编号'
		},
		'isleaf' : {
			name : 'isleaf',
			fieldLabel : '是否是叶子节点'
		},
		'treeid' : {
			name : 'treeid',
			fieldLabel : '工程量编码'
		},
		'typeid' : {
			name : 'typeid',
			fieldLabel : '所属类别',
			anchor : '95%',
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			allowBlank : false,
			readOnly : true,
			triggerAction : 'all',
			store : new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : [['01', '安装工程乙供材料'], ['02', '建筑安装工程'],
								['03', '其他合同']]
					})
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		},
		'constructionUnit' : {
			name : 'constructionUnit',
			fieldLabel : '施工单位',
			anchor : '95%'
		},
		'quantitiesType' : {
			name : 'quantitiesType',
			fieldLabel : '工程量类型',
			anchor : '95%'
		},
		'financialAccount' : {
			name : 'financialAccount',
			fieldLabel : '财务科目',
			anchor : '95%'
		},
		'financialBudget' : {
			name : 'financialBudget',
			fieldLabel : '所属财务概算',
			anchor : '95%'
		},
		'isper' : {
			name : 'isper',
			fieldLabel : '百分数'
		},
		'fixedAssetList' : {
			name : 'fixedAssetList',
			fieldLabel : '所属固定资产'
		}
	}

	var Columns = [{
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
				name : 'parent',
				type : 'string'
			}, {
				name : 'isleaf',
				type : 'float'
			}, {
				name : 'treeid',
				type : 'string'
			}, {
				name : 'typeid',
				type : 'string'
			}, {
				name : 'remark',
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
				name : 'financialBudget',
				type : 'string'
			}, {
				name : 'isper',
				type : 'string'
			}, {
				name : 'fixedAssetList',
				type : 'string'
			}];

	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		proappid : '',
		pid : CURRENTAPPID,
		conid : null,
		bdgid : null,
		prono : null,
		proname : null,
		unit : null,
		price : null,
		amount : null,
		money : null,
		state : '4',
		parent : '',
		isleaf : '',
		treeid : '',
		typeid : '',
		remark : ''

		,
		constructionUnit : '' // 施工单位
		,
		quantitiesType : '' // 工程量类型
		,
		financialAccount : '' // 财务科目
		,
		financialBudget : '',
		isper : '',
		fixedAssetList : ''
	}
	// var sm = new Ext.grid.CheckboxSelectionModel()

	var cm =  new Ext.grid.ColumnModel([{
				id : 'proappid',
				header : fc['proappid'].fieldLabel,
				dataIndex : fc['proappid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true
			}, {
				id : 'bdgid',
				header : fc['bdgid'].fieldLabel,
				dataIndex : fc['bdgid'].name,
				hidden : true
			}, {
				id : 'proname',
				header : fc['proname'].fieldLabel,
				dataIndex : fc['proname'].name,
				width : 220
			}, {
				id : 'prono',
				header : fc['prono'].fieldLabel,
				dataIndex : fc['prono'].name,
				width : 140
			}, {
				id : 'unit',
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				width : 90,
				align : 'center'
			}, {
				id : 'price',
				align : 'price',
				header : fc['price'].fieldLabel,
				dataIndex : fc['price'].name,
				width : 120,
				align : 'right',
				renderer : cnMoney
			}, {
				id : 'amount',
				header : fc['amount'].fieldLabel,
				dataIndex : fc['amount'].name,
				width : 120,
				renderer : function(value, cell, record) {
					if (record.get('isper') == '1')
						return (value * 100).toFixed(2) + "%";
					else
						return value;
				},
				align : 'right'
			}, {
				id : 'money',
				header : fc['money'].fieldLabel,
				dataIndex : fc['money'].name,
				align : 'right',
				width : 120
			}, {
				id : 'state',
				header : fc['state'].fieldLabel,
				dataIndex : fc['state'].name,
				width : 60,
				hidden : true,
				align : 'center',
				renderer : function(value) {
					if (value == '4') {
						value = '签订';
					}
					return value;
				}
			}, {
				id : 'parent',
				header : fc['parent'].fieldLabel,
				dataIndex : fc['parent'].name,
				hidden : true
			}, {
				id : 'isleaf',
				header : fc['isleaf'].fieldLabel,
				dataIndex : fc['isleaf'].name,
				hidden : true
			}, {
				id : 'treeid',
				header : fc['treeid'].fieldLabel,
				dataIndex : fc['treeid'].name,
				hidden : true
			}, {
				id : 'typeid',
				header : fc['typeid'].fieldLabel,
				dataIndex : fc['typeid'].name,
				width : 120,
				renderer : function(v) {
					if (v == "01") {
						return '安装工程乙供材料';
					} else if (v == "02") {
						return '建筑安装工程';
					} else if (v == "03") {
						return '其他合同';
					} else {
						return "";
					}
				}
		   }, {
				id : 'constructionUnit',
				header : fc['constructionUnit'].fieldLabel,
				dataIndex : fc['constructionUnit'].name,
				renderer : function(v) {
					for (var i = 0; i < conUnit.length; i++) {
						if (conUnit[i][0] == v) {
							return conUnit[i][1];
						}
					}
				},
				width : 120
			}, {
				id : 'quantitiesType',
				header : fc['quantitiesType'].fieldLabel,
				dataIndex : fc['quantitiesType'].name,
				renderer : function(v) {
					for (var i = 0; i < gcType.length; i++) {
						if (gcType[i][0] == v) {
							return gcType[i][1];
						}
					}
				},
				hidden : true,
				width : 120
			}, {
				id : 'financialAccount',
				header : fc['financialAccount'].fieldLabel,
				dataIndex : fc['financialAccount'].name,
				width : 200,
				renderer : function(v) {
					for (var i = 0; i < subjectArr.length; i++) {
						if (v == subjectArr[i][0]) {
							return subjectArr[i][1];
						}
					}
				}
			}, {
				id : 'financialBudget',
				header : fc['financialBudget'].fieldLabel,
				dataIndex : fc['financialBudget'].name,
				renderer : function(v) {
					for (var i = 0; i < bdgArr.length; i++) {
						if (bdgArr[i][0] == v) {
							return bdgArr[i][1];
						}
					}
				},
				width : 120
			}, {
				id : 'fixedAssetList',
				header : fc['fixedAssetList'].fieldLabel,
				dataIndex : fc['fixedAssetList'].name,
				width : 240,
				renderer : function(v) {
					for (var i = 0; i < assetArr.length; i++) {
						if (v == assetArr[i][0]) {
							return assetArr[i][1];
						}
					}
				}
			}, {
				id : 'isper',
				header : fc['isper'].fieldLabel,
				dataIndex : fc['isper'].name,
				hidden : true
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				width : 180
			}]);
	gclDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanGcl,
	    	business: business,
	    	method: listMethod,
	    	params: "pid='"+CURRENTAPPID+"' and 1=2 "
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyGcl
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    gclDs.setDefaultSort('proappid', 'desc'); // 设置默认排序列

	gclGridPanel = new Ext.grid.EditorGridTbarPanel({
			id : "gclGridPanel",
			ds : gclDs,
			cm : cm,
			sm : new Ext.grid.CheckboxSelectionModel({
						singleSelect : true
					}),
			title : '工程量',
			addBtn : false,
			saveBtn : false,
			delBtn : false,
			header : false,
			height : document.body.clientHeight * 0.5,
			border : false,
			region : 'center',
			stripeRows : true,
			loadMask : true,
			viewConfig : {
				forceFit : false,
				ignoreAdd : true
			},
			bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
				pageSize : PAGE_SIZE,
				store : gclDs,
				displayInfo : true,
				displayMsg : ' {0} - {1} / {2}',
				emptyMsg : "无记录。"
			}),
			plant : Plant,
			plantInt : PlantInt,
			servletUrl : MAIN_SERVLET,
			bean : beanGcl,
			business : business,
			primaryKey : primaryKeyGcl
		});
})