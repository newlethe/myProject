var servletName = 'servlet/FACompleteServlet';
var beanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompUncompPrj";
var conBeanName = "com.sgepit.pmis.finalAccounts.complete.hbm.FACompUncompCon";
var business = "baseMgm";
var uncompBusiness = "faBaseInfoService";
var listMethod = "findWhereOrderby";
var pageSize = 10;
var gridfilter = "pid = '" + pid + "'";
// 是否禁用添加/修改/删除按钮
var btnDisabled = ModuleLVL != '1';
// 必填项后加*号
var requiredMark = "<font color='red' >*</font>";
var conSm;
var bdgProappWin;
var conid;

Ext.onReady(function() {
	/**=================================未完工工程管理Begin=====================================*/
	var fc = {
			uids : {
				name : 'uids',
				fieldLabel : 'uids'
			},
			pid : {
				name : 'pid',
				fieldLabel : 'pid'
			},
			xh : {
				name : 'xh',
				fieldLabel : '序号' + requiredMark
			},
			prjName : {
				name : 'prjName',
				fieldLabel : '工程项目' + requiredMark
			},
			prjLocation : {
				name : 'prjLocation',
				fieldLabel : '所在地'
			},
			unit : {
				name : 'unit',
				fieldLabel : '计量单位'
			},
			prjNumber : {
				name : 'prjNumber',
				fieldLabel : '数量'
			},
			bdgMoney : {
				name : 'bdgMoney',
				fieldLabel : '概算金额'
			},
			compMoney : {
				name : 'compMoney',
				fieldLabel : '已完成-金额'
			},
			compPercent : {
				name : 'compPercent',
				fieldLabel : '已完成-百分比'
			},
			predUnbuild : {
				name : 'predUnbuild',
				fieldLabel : '预计未完成-建筑工程'
			},
			installEng : {
				name : 'installEng',
				fieldLabel : '安装工程'
			},
			equipPurch : {
				name : 'equipPurch',
				fieldLabel : '设备购置'
			},
			otherCost : {
				name : 'otherCost',
				fieldLabel : '其他费用'
			},
			totalmoney : {
				name : 'totalmoney',
				fieldLabel : '小计'
			},
			remark : {
				name : 'remark',
				fieldLabel : '说明'
			}
		};

	var columnParams = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'xh',
				type : 'string'
			}, {
				name : 'prjName',
				type : 'string'
			}, {
				name : 'prjLocation',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'prjNumber',
				type : 'float'
			}, {
				name : 'bdgMoney',
				type : 'float'
			}, {
				name : 'compMoney',
				type : 'float'
			}, {
				name : 'compPercent',
				type : 'float'
			}, {
				name : 'predUnbuild',
				type : 'float'
			}, {
				name : 'installEng',
				type : 'float'
			}, {
				name : 'equipPurch',
				type : 'float'
			}, {
				name : 'otherCost',
				type : 'float'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'totalmoney',
				type : 'float'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel({});

	var predUnbuildField = new Ext.form.NumberField({
				id : 'predUnbuildF',
				allowNegative : false
			});
	var installEngField = new Ext.form.NumberField({
				id : 'installEngF',
				allowNegative : false
			});
	var equipPurchField = new Ext.form.NumberField({
				id : 'equipPurchF',
				allowNegative : false
			});
	var otherCostField = new Ext.form.NumberField({
				id : 'otherCostF',
				allowNegative : false
			});
	var totalField = new Ext.form.NumberField({
				id : 'totalF'
			});

	var cm = new Ext.grid.ColumnModel([sm, {
				id : fc['uids'].name,
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : fc['pid'].name,
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : fc['xh'].name,
				header : fc['xh'].fieldLabel,
				dataIndex : fc['xh'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						})
			}, {
				id : fc['prjName'].name,
				header : fc['prjName'].fieldLabel,
				dataIndex : fc['prjName'].name,
				editor : new Ext.form.TextField({
							allowBlank : false
						}),
				width : 150
			}, {
				id : fc['prjLocation'].name,
				header : fc['prjLocation'].fieldLabel,
				dataIndex : fc['prjLocation'].name,
				editor : new Ext.form.TextField({}),
				width : 150
			}, {
				id : fc['unit'].name,
				header : fc['unit'].fieldLabel,
				dataIndex : fc['unit'].name,
				editor : new Ext.form.TextField({})
			}, {
				id : fc['prjNumber'].name,
				header : fc['prjNumber'].fieldLabel,
				dataIndex : fc['prjNumber'].name,
				editor : new Ext.form.NumberField({
							allowNegative : false
						})
			}, {
				id : fc['bdgMoney'].name,
				header : fc['bdgMoney'].fieldLabel,
				dataIndex : fc['bdgMoney'].name,
				editor : new Ext.form.NumberField({
							allowNegative : false
						})
			}, {
				id : fc['compMoney'].name,
				header : fc['compMoney'].fieldLabel,
				dataIndex : fc['compMoney'].name,
				editor : new Ext.form.NumberField({
							allowNegative : false
						})
			}, {
				id : fc['compPercent'].name,
				header : fc['compPercent'].fieldLabel,
				dataIndex : fc['compPercent'].name,
				editor : new Ext.form.NumberField({}),
				renderer : function(v) {
					return v && v != 0 ? v + "%" : '0%';
				}
			}, {
				id : fc['predUnbuild'].name,
				header : fc['predUnbuild'].fieldLabel,
				dataIndex : fc['predUnbuild'].name,
				editor : predUnbuildField,
				width : 150
			}, {
				id : fc['installEng'].name,
				header : fc['installEng'].fieldLabel,
				dataIndex : fc['installEng'].name,
				editor : installEngField
			}, {
				id : fc['equipPurch'].name,
				header : fc['equipPurch'].fieldLabel,
				dataIndex : fc['equipPurch'].name,
				editor : equipPurchField
			}, {
				id : fc['otherCost'].name,
				header : fc['otherCost'].fieldLabel,
				dataIndex : fc['otherCost'].name,
				editor : otherCostField
			}, {
				id : fc['totalmoney'].name,
				header : fc['totalmoney'].fieldLabel,
				dataIndex : fc['totalmoney'].name,
				editor : totalField,
				renderer : function(v, m, r) {
					var value = r.get('predUnbuild') + r.get('installEng')
							+ r.get('equipPurch') + r.get('otherCost');
					return value && value != 0 ? value.toFixed(2) : '0';
				}
			}, {
				id : fc['remark'].name,
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				editor : new Ext.form.TextField({}),
				width : 150
			}]);
	cm.defaultSortable = true;
	cm.defaultWidth = 120;

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanName,
					business : business,
					method : listMethod,
					params : gridfilter
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, columnParams),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort('xh', 'asc');

	var PlantParam = Ext.data.Record.create(columnParams);
	var PlantParamInt = {
		uids : null,
		pid : pid,
		xh : '',
		prjName : '',
		prjLocation : '',
		unit : '',
		prjNumber : 0,
		bdgMoney : 0,
		compMoney : 0,
		compPercent : 0,
		predUnbuild : 0,
		installEng : 0,
		equipPurch : 0,
		otherCost : 0,
		remark : ''
	};

	var uncompGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'north',
				id : 'uncompGrid',
				titel : '未完工工程管理',
				iconCls : 'icon-by-category',
				height : 330,
				ds : ds,
				cm : cm,
				sm : sm,
				servletUrl : MAIN_SERVLET,
				bean : beanName,
				tbar : ['未完工工程管理', '-'],
				border : false,
				autoScroll : 'true',
				clicksToEdit : 1,
				primaryKey : 'uids',
				loadMask : true,
				stripeRows : true,
				bbar : new Ext.PagingToolbar({
							pageSize : pageSize,
							beforePageText : '第',
							store : ds,
							displayInfo : true,
							emptyMsg : '无记录'
						}),
				plant : PlantParam,
				plantInt : PlantParamInt,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				saveHandler : function(){
					var records = ds.getModifiedRecords();
					if (records.length == 0)
						return;
					var daInsert = [];
					var daUpdate = [];
					for (var i = 0; i < ds.getCount(); i++) {
						var record = ds.getAt(i);
						var value = record.get('predUnbuild') + record.get('installEng')
								+ record.get('equipPurch') + record.get('otherCost');
						value = value && value != 0 ? value.toFixed(2) : 0;
						record.set('totalmoney', value);
					}
					this.defaultSaveHandler();
				},
				listeners : {
					beforeedit : function(e) {
						if (e.field == 'totalmoney') {
							return false;
						}
					}
				}
			});

	/**=================================未完工工程管理End=====================================*/
	/**=================================未完工合同Begin=======================================*/

	var fcCon = {
			conid : {
				name : 'conid',
				fieldLabel : '合同Id'
			},
			pid : {
				name : 'pid',
				fieldLabel : '项目Id'
			},
			conmoneyno : {
				name : 'conmoneyno',
				fieldLabel : '合同财务编号'
			},
			conno : {
				name : 'conno',
				fieldLabel : '合同编号'
			},
			conname : {
				name : 'conname',
				fieldLabel : '合同名称'
			},
			conmoney : {
				name : 'conmoney',
				fieldLabel : '合同签订金额'
			},
			changemoney : {
				name : 'changemoney',
				fieldLabel : '合同变更金额'
			},
			convaluemoney : {
				name : 'convaluemoney',
				fieldLabel : '合同总金额'
			},
			investmoney : {
				name : 'investmoney',
				fieldLabel : '投资完成金额'
			}
	};
	
	var conColumnParams = [{
				name : 'conid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'	
			}, {
				name : 'conmoneyno',
				type : 'string'	
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			}, {
				name : 'changemoney',
				type : 'float'
			}, {
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'investmoney',
				type : 'float'
			}];
	
	conSm = new Ext.grid.CheckboxSelectionModel({});
	
	var conCm = new Ext.grid.ColumnModel([conSm,
			{
				id : 'conid',
				header : fcCon['conid'].fieldLabel,
				dataIndex : fcCon['conid'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcCon['pid'].fieldLabel,
				dataIndex : fcCon['pid'].name,
				hidden : true
			}, {
				id : 'conmoneyno',
				header : fcCon['conmoneyno'].fieldLabel,
				dataIndex : fcCon['conmoneyno'].name,
				width : 180,
				hidden : true
			}, {
				id : 'conno',
				header : fcCon['conno'].fieldLabel,
				dataIndex : fcCon['conno'].name
			}, {
				id : 'conname',
				header : fcCon['conname'].fieldLabel,
				dataIndex : fcCon['conname'].name,
				width : 280
			}, {
				id : 'conmoney',
				header : fcCon['conmoney'].fieldLabel,
				dataIndex : fcCon['conmoney'].name
			}, {
				id : 'changemoney',
				header : fcCon['changemoney'].fieldLabel,
				dataIndex : fcCon['changemoney'].name
			}, {
				id : 'convaluemoney',
				header : fcCon['convaluemoney'].fieldLabel,
				dataIndex : fcCon['convaluemoney'].name
			}, {
				id : 'investmoney',
				header : fcCon['investmoney'].fieldLabel,
				dataIndex : fcCon['investmoney'].name
			}, {
				id : 'inventoryComplete',
				header : '工程量清单及完成情况',
				dataIndex : 'inventoryComplete',
				renderer : function(v){
						return "<a style='color:blue;' href='javascript:openBdgProappWin()'><div align='center'>工程量清单信息</div></a>";
					}
			}
		]);
	conCm.defaultSortable = true;
	conCm.defaultWidth = 140;

	var conDs = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : conBeanName,
				business : uncompBusiness,
				method : 'getUncompCon',
				params : 'pid' + SPLITB + pid + SPLITB
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'conid'
					}, conColumnParams),
			remoteSort : true
		});
	conDs.setDefaultSort("conid", 'asc');

	var conGrid = new Ext.grid.EditorGridTbarPanel({
			region : 'center',
			id : 'conGrid',
			titel : '未完工合同',
			iconCls : 'icon-by-category',
			ds : conDs,
			cm : conCm,
			sm : conSm,
			servletUrl : MAIN_SERVLET,
			bean : conBeanName,
			tbar : ['未完工合同'],
			border : false,
			autoScroll : 'true',
			clicksToEdit : 2,
			primaryKey : 'conid',
			addBtn : false,
			saveBtn : false,
			delBtn : false,
			loadMask : true,
			stripeRows : true,
			bbar : new Ext.PagingToolbar({
						pageSize : pageSize,
						beforePageText : '第',
						store : conDs,
						displayInfo : true,
						emptyMsg : '无记录'
					}),
			viewConfig : {
				forceFit : false,
				ignoreAdd : true
			}
		});
	
	/**=================================未完工合同End=========================================*/

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [uncompGrid,conGrid]
			});

	ds.load({
			params : {
				start : 0,
				limit : pageSize
			}
		});
	conDs.load({
			params : {
				start : 0,
				limit : pageSize
			}
	})
});

function openBdgProappWin() {
	var rec = conSm.getSelected();
	conid = rec.get('conid');
	if (!bdgProappWin) {
		bdgProappWin = new Ext.Window({
					header : false,
					layout : 'border',
					width : document.body.clientWidth - 20,
					height : document.body.clientHeight - 20,
					modal : true,
					maximizable : true,
					closeAction : 'hide',
					plain : true,
					items : [treePanelNew,proappGrid]
				});
	}
	bdgProappWin.setTitle('概算及工程量清单(' + rec.get('conname') + ')');
	treePanelNew.root.reload();
	proappDs.baseParams.params = "pid='" + pid + "' and conid='" + conid + "'";
	proappDs.load();
	bdgProappWin.show();
}