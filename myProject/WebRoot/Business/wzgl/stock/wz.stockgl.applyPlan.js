var bean = "com.sgepit.pmis.wzgl.hbm.WzCjspb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'bh'

var bean_fw = "com.sgepit.pmis.wzgl.hbm.WzCjsxb"
var primaryKey_fw = 'uids'
var orderColumn_fw = 'bm'

var insertFlag = 0;
var PlantInt_fw, selectedData, ds_fw;

// PID查询条件
var pidWhereString = "pid = '" + CURRENTAPPID + "'"
var hasFlow=false;//页面是否配置流程
Ext.onReady(function() {
	// --用户userid:realname
	var userArray = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where unitid = '"
					+ CURRENTAPPID + "'", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArray.push(temp);
				}
			})
	DWREngine.setAsync(true);
	var getuserSt = new Ext.data.SimpleStore({
				fields : ['userid', 'realname'],
				data : userArray
			})

	// --物资编码bm:pm
	var wzArray = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select bm,pm from wz_ckclb where " + pidWhereString + " ",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					wzArray.push(temp);
				}
			})
	DWREngine.setAsync(true);

	// -----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select unitid,unitname from sgcc_ini_unit where unitid='"
					+ USERDEPTID + "'order by unitid", function(list) {
				if (list == null || list == "") {
					var temp = new Array();
					temp.push(USERDEPTID);
					temp.push(UNITNAME);
					bmbzArr.push(temp);
				} else {
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						bmbzArr.push(temp);
					}
				}  

			});
	DWREngine.setAsync(true);

	// 流程状态
	var billArray = new Array();
	DWREngine.setAsync(false);
	appMgm.getCodeValue('流程状态', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					billArray.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// -----------------概算（bdgno：bdg_info==bdgname)
	var bdgArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select bdgno,bdgname from bdg_info where "
					+ pidWhereString + " ", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					bdgArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// -----------------申请计划细表中对应主表编号的申请总金额（wz_cjsxb)
	var cjxbdsArr = new Array();
	cjxbdsArr = sumPrice();
	/*
	 * DWREngine.setAsync(false); baseMgm.getData("select bh,sum (dj*sqsl) from
	 * wz_cjsxb group by bh",function(list){ for(i = 0; i < list.length; i++) {
	 * var temp = new Array(); temp.push(list[i][0]); temp.push(list[i][1]);
	 * cjxbdsArr.push(temp); } }); DWREngine.setAsync(true);
	 */

	// --用户userid:realname
	var sj_yearArray = new Array();
	DWREngine.setAsync(false);
	var sql_year = "select distinct substr(to_char(sqrq,'yyyy-mm-dd'),1,4) year,  substr(to_char(sqrq,'yyyy-mm-dd'),1,4) years from wz_cjspb where "
			+ pidWhereString + " order by year";
	baseMgm.getData(sql_year, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					sj_yearArray.push(temp);
				}
			})
	DWREngine.setAsync(true);
	var getSj_yearSt = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : sj_yearArray
			})
	DWREngine.setAsync(false);
    var rtnState='';
	systemMgm.getFlowType(USERUNITID,MODID,function(rtn){
	    rtnState=rtn;
	})
	if(isFlwTask != true && isFlwView != true){
		if(rtnState=='BusinessProcess'){
		    hasFlow=true;
		}else{
			hasFlow=false;
		}
	}else{
		hasFlow=true;
	}
	DWREngine.setAsync(true);
	// ----------------------采购需用计划申请信息----------------------------//
	var fm = Ext.form;

	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '流水号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'bh' : {
			name : 'bh',
			fieldLabel : '申请计划编号',
			allowBlank : false,
			anchor : '95%'
		},
		'bh_zje' : {
			name : 'bh_zje',
			fieldLabel : '申请总金额',
			allowBlank : false,
			decimalPrecision : 4,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			hidden : true,
			value : CURRENTAPPID
		},
		'hth' : {
			name : 'hth',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'fybh' : {
			name : 'fybh',
			fieldLabel : '预算项目',
			anchor : '95%'
		},
		'cwbm' : {
			name : 'cwbm',
			fieldLabel : '费用科目',
			anchor : '95%'
		},
		'sqrq' : {
			name : 'sqrq',
			fieldLabel : '申请日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'jhlb' : {
			name : 'jhlb',
			fieldLabel : '计划类别(项目大类)',
			anchor : '95%'
		},
		'bmmc' : {
			name : 'bmmc',
			fieldLabel : '申请部门',
			anchor : '95%'
		},
		'sqr' : {
			name : 'sqr',
			fieldLabel : '申请人',
			anchor : '95%'
		},
		'spr' : {
			name : 'spr',
			fieldLabel : '审批人',
			anchor : '95%'
		},
		'billState' : {
			name : 'billState',
			fieldLabel : '审批状态',
			anchor : '95%'
		},
		'pzrq' : {
			name : 'pzrq',
			fieldLabel : '批准日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'phbh' : {
			name : 'phbh',
			fieldLabel : '采购计划编号',
			anchor : '95%'
		},
		'xz' : {
			name : 'xz',
			fieldLabel : '是否汇总列入采购计划',
			anchor : '95%'
		},
		'userid' : {
			name : 'userid',
			fieldLabel : '用户ID',
			anchor : '95%'
		},
		'wonum' : {
			name : 'wonum',
			fieldLabel : '工单',
			anchor : '95%'
		},
		'wzlb' : {
			name : 'wzlb',
			fieldLabel : '物资类别',
			anchor : '95%'
		},
		'xmbm' : {
			name : 'xmbm',
			fieldLabel : '项目类别(概算编号)',
			anchor : '95%'
		},
		'cjyy' : {
			name : 'cjyy',
			fieldLabel : '年度',
			anchor : '95%'
		},
		'cjmm' : {
			name : 'cjmm',
			fieldLabel : '月度',
			anchor : '95%'
		},
		'stage' : {
			name : 'stage',
			fieldLabel : '期别',
			anchor : '95%'
		},
		'bgdid' : {
			name : 'bgdid',
			fieldLabel : '概算编号',
			anchor : '95%'
		}
	}

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'bh',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'hth',
				type : 'string'
			}, {
				name : 'fybh',
				type : 'string'
			}, {
				name : 'cwbm',
				type : 'string'
			}, {
				name : 'sqrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'jhlb',
				type : 'string'
			}, {
				name : 'bh_zje',
				type : 'string'
			}, {
				name : 'bmmc',
				type : 'string'
			}, {
				name : 'sqr',
				type : 'string'
			}, {
				name : 'spr',
				type : 'string'
			}, {
				name : 'billState',
				type : 'string'
			}, {
				name : 'pzrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'phbh',
				type : 'string'
			}, {
				name : 'xz',
				type : 'string'
			}, {
				name : 'userid',
				type : 'string'
			}, {
				name : 'wonum',
				type : 'string'
			}, {
				name : 'wzlb',
				type : 'string'
			}, {
				name : 'xmbm',
				type : 'string'
			}, {
				name : 'cjyy',
				type : 'string'
			}, {
				name : 'cjmm',
				type : 'string'
			}, {
				name : 'stage',
				type : 'string'
			}, {
				name : 'bgdid',
				type : 'string'
			}]

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		bh : '',
		pid : '',
		hth : '',
		fybh : '',
		cwbm : '',
		sqrq : '',
		jhlb : '',
		bmmc : '',
		sqr : '',
		spr : '',
		billState : '',
		pzrq : '',
		phbh : '',
		xz : '',
		userid : '',
		wonum : '',
		wzlb : '',
		xmbm : '',
		cjyy : '',
		cjmm : '',
		stage : '',
		bgdid : '',
		bh_zje : '',
		pid : CURRENTAPPID
	}

	// ----------------------采购需用计划申请信息（新计划）----------------------------//
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'bh',
				header : fc['bh'].fieldLabel,
				dataIndex : fc['bh'].name
			}, {
				id : 'sqrq',
				header : fc['sqrq'].fieldLabel,
				dataIndex : fc['sqrq'].name,
				renderer : formatDate
			}, {
				id : 'bmmc',
				header : fc['bmmc'].fieldLabel,
				dataIndex : fc['bmmc'].name,
				renderer : function(value) {
					if (bmbzArr == null || bmbzArr == "") {
						return UNITNAME;
					} else {
						for (var i = 0; i < bmbzArr.length; i++) {
							if (value == bmbzArr[i][0]) {
								return bmbzArr[i][1]
							}
						}
					}

				}
			}, {
				id : 'sqr',
				header : fc['sqr'].fieldLabel,
				dataIndex : fc['sqr'].name,
				renderer : function(value) {
					if (userArray == null || userArray == "") {
						return REALNAME;
					} else {
						var flag = false;
						for (var i = 0; i < userArray.length; i++) {
							if (value == userArray[i][0]) {
								flag = true;
								return userArray[i][1];
							}
						}
						if (flag == false) {
							return REALNAME;
						} 
					}

				}
			}, {
				id : 'bh_zje',
				header : fc['bh_zje'].fieldLabel,
				dataIndex : fc['bh_zje'].name,
				renderer : function(value, cellmeta, record, rowIndex,
						columnIndex, store) {
					for (var i = 0; i < cjxbdsArr.length; i++) {
						if (record.data.bh == cjxbdsArr[i][0]) {
							return cjxbdsArr[i][1]
						}
					}
				}
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'hth',
				header : fc['hth'].fieldLabel,
				dataIndex : fc['hth'].name,
				hidden : true
			}, {
				id : 'fybh',
				header : fc['fybh'].fieldLabel,
				dataIndex : fc['fybh'].name,
				hidden : true
			}, {
				id : 'cwbm',
				header : fc['cwbm'].fieldLabel,
				dataIndex : fc['cwbm'].name,
				hidden : true
			}, {
				id : 'jhlb',
				header : fc['jhlb'].fieldLabel,
				dataIndex : fc['jhlb'].name,
				hidden : true
			}, {
				id : 'spr',
				header : fc['spr'].fieldLabel,
				dataIndex : fc['spr'].name,
				hidden : true
			}, {
				id : 'billState',
				header : fc['billState'].fieldLabel,
				dataIndex : fc['billState'].name,
				hidden:!hasFlow,
				renderer : function(value) {
					for (var i = 0; i < billArray.length; i++) {
						if (billArray[i][0] == value) {
							return billArray[i][1]
						}
					}
				}
			}, {
				id : 'pzrq',
				header : fc['pzrq'].fieldLabel,
				dataIndex : fc['pzrq'].name,
				renderer : formatDate,
				hidden : true
			}, {
				id : 'phbh',
				header : fc['phbh'].fieldLabel,
				dataIndex : fc['phbh'].name,
				hidden : true
			}, {
				id : 'xz',
				header : fc['xz'].fieldLabel,
				dataIndex : fc['xz'].name,
				hidden : true
			}, {
				id : 'userid',
				header : fc['userid'].fieldLabel,
				dataIndex : fc['userid'].name,
				hidden : true
			}, {
				id : 'wonum',
				header : fc['wonum'].fieldLabel,
				dataIndex : fc['wonum'].name,
				hidden : true
			}, {
				id : 'wzlb',
				header : fc['wzlb'].fieldLabel,
				dataIndex : fc['wzlb'].name,
				hidden : true
			}, {
				id : 'xmbm',
				header : fc['xmbm'].fieldLabel,
				dataIndex : fc['xmbm'].name,
				hidden : true
			}, {
				id : 'cjyy',
				header : fc['cjyy'].fieldLabel,
				dataIndex : fc['cjyy'].name,
				hidden : true
			}, {
				id : 'cjmm',
				header : fc['cjmm'].fieldLabel,
				dataIndex : fc['cjmm'].name,
				hidden : true
			}, {
				id : 'stage',
				header : fc['stage'].fieldLabel,
				dataIndex : fc['stage'].name,
				hidden : true
			}, {
				id : 'bgdid',
				header : fc['bgdid'].fieldLabel,
				dataIndex : fc['bgdid'].name,
				hidden : true,
				renderer : function(value) {
					for (var i = 0; i < bdgArr.length; i++) {
						if (value == bdgArr[i][0]) {
							return bdgArr[i][1]
						}
					}
				}
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}]);

	cm.defaultSortable = true;// 可排序

	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : pidWhereString
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			})
	ds.setDefaultSort(orderColumn, 'desc');

	var addBtn = new Ext.Button({
				text : '新增',
				iconCls : 'add',
				handler : insertFun_plan
			})
	var editBtn = new Ext.Button({
				text : '修改',
				iconCls : 'btn',
				handler : toEditHandler_plan
			})
	var delBtn = new Ext.Button({
				text : '删除',
				iconCls : 'remove',
				handler : DelFun
			})
	function DelFun() {
		// 删除申请计划主表时，同时删除从表
		// var records = sm.getSelections();
		var record = sm.getSelected();
		if (record == null || record == "")
			return;
		var uids = record.get('uids');
		var bh = record.get('bh');
		DWREngine.setAsync(false)
		stockMgm.deleteApplyPlan(uids, bh, function(bool) {
					if (bool) {
						Ext.example.msg('提示', '申请计划删除成功');
						ds.reload();
						ds_fw.reload();
					} else {
						Ext.example.msg('提示', '申请计划删除失败');
					}
				});
		DWREngine.setAsync(true);
	}
	var comboFilter_y = new Ext.form.ComboBox({
				name : 'sj_y',
				readOnly : true,
				width : 60,
				store : getSj_yearSt,
				valueField : 'k',
				displayField : 'v',
				triggerAction : 'all',
				mode : 'local',
				listeners : {
					select : function(combo, record, index) {
						billStateFilter.setValue("");
						if (comboFilter_m.getValue() != "") {
							ds.baseParams.params = "sqr='" + USERID
									+ "' and to_char(sqrq,'yyyy-mm')='"
									+ record.data.k + '-'
									+ comboFilter_m.getValue() + "' and "
									+ pidWhereString + " ";
							ds.load({
										params : {
											start : 0,
											limit : 20
										}
									});
						}
					}
				}
			});
	var comboFilter_m = new Ext.form.ComboBox({
				name : 'sj_m',
				readOnly : true,
				width : 60,
				store : new Ext.data.SimpleStore({
							fields : ['id', 'name'],
							data : [['01', '01'], ['02', '02'], ['03', '03'],
									['04', '04'], ['05', '05'], ['06', '06'],
									['07', '07'], ['08', '08'], ['09', '09'],
									['10', '10'], ['11', '11'], ['12', '12']]
						}),
				mode : 'local',
				displayField : 'name',
				valueField : 'id',
				triggerAction : 'all',
				listeners : {
					select : function(combo, record, index) {
						billStateFilter.setValue("");
						if (comboFilter_y.getValue() != "") {
							ds.baseParams.params = "sqr='" + USERID
									+ "' and to_char(sqrq,'yyyy-mm')='"
									+ comboFilter_y.getValue() + '-'
									+ record.data.id + "' and "
									+ pidWhereString + " ";
							ds.load({
										params : {
											start : 0,
											limit : 20
										}
									});
						}
					}
				}
			});

	// 根据流程状态查询
	var billFilterArr = [['', '查看全部'], ['0', '新建'], ['-1', '审批中'], ['1', '已审批']];
	var dsBillState = new Ext.data.SimpleStore({
				fields : ['v', 'k'],
				data : billFilterArr
			})

	var billStateFilter = new Ext.form.ComboBox({
				id : 'billFilter',
				fieldLabel : '流程状态',
				readOnly : true,
				store : dsBillState,
				width : 70,
				readOnly : true,
				displayField : 'k',
				valueField : 'v',
				mode : 'local',
				triggerAction : 'all',
				emptyText : '查看全部',
				listeners : {
					select : filterByBillState
				}
			})
	function filterByBillState() {
		var filter = Ext.getCmp('billFilter').getValue();
		comboFilter_y.setValue("");
		comboFilter_m.setValue("");
		if (filter == "") {
			ds.baseParams.params = " sqr='" + USERID + "' and "
					+ pidWhereString + " ";
		} else {
			ds.baseParams.params = " bill_state='" + filter + "' and sqr='"
					+ USERID + "' and " + pidWhereString + " ";
		}
		ds.reload();
	}

	gridPanel = new Ext.grid.EditorGridTbarPanel({
				name : 'xjh_panel',
				title : '新 计 划',
				ds : ds,
				cm : cm,
				sm : sm,
				border : false,
				region : 'center',
				addBtn : false,
				saveBtn : false,
				delBtn : false,
				clicksToEdit : 2,
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>申请计划<B></font>'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 20,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			});

	// bill_state:0新计划，-1审批中，1已审批
	// ds.baseParams.params = "bill_state=0 and sqr='"+USERID+"'";
	ds.baseParams.params = " sqr='" + USERID + "' and " + pidWhereString + " ";

	ds.load({
				params : {
					start : 0,
					limit : 20
				}
			});

	function insertFun_plan() {
		var url = BASE_PATH
				+ "Business/wzgl/stock/wz.stockgl.applyPlan.addorupdate.jsp?modid="+MODID;
		window.location.href = url;
	}
	function toEditHandler_plan() {
		var record = gridPanel.getSelectionModel().getSelected();
		if(record){
			var url = BASE_PATH
					+ "Business/wzgl/stock/wz.stockgl.applyPlan.addorupdate.jsp?uids="
					+ record.get('uids') + "&bh=" + record.get('bh');
			window.location.href = url;
		}else{
			Ext.example.msg('提示', '请先选择一条数据！');
		}
	}

	if (bh_flow != "") {
		addBtn.disable();
		editBtn.disable();
		delBtn.disable();
		ds.baseParams.params = " sqr='" + USERID + "' and bh='" + bh_flow + "'";
		ds.load({
					params : {
						start : 0,
						limit : 20
					}
				});
	}

	// ----------------------物资申请计划细表范围----------------------------//
	var fm_fw = Ext.form;

	var fc_fw = {
		'uids' : {
			name : 'uids',
			fieldLabel : '流水号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程编号',
			allowBlank : false,
			value : '',
			anchor : '95%'
		},
		'bh' : {
			name : 'bh',
			fieldLabel : '申请计划编号',
			allowBlank : false,
			anchor : '95%'
		},
		'bm' : {
			name : 'bm',
			fieldLabel : '物资编码',
			anchor : '95%'
		},
		'pm' : {
			name : 'pm',
			fieldLabel : '品名',
			anchor : '95%'
		},
		'gg' : {
			name : 'gg',
			fieldLabel : '规格',
			anchor : '95%'
		},
		'cz' : {
			name : 'cz',
			fieldLabel : '材质',
			anchor : '95%'
		},
		'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'xqrq' : {
			name : 'xqrq',
			fieldLabel : '需求日期',
			format : 'Y-m-d',
			anchor : '95%'
		},
		'sqsl' : {
			name : 'sqsl',
			fieldLabel : '申请数量',
			anchor : '95%'
		},
		'sl' : {
			name : 'sl',
			fieldLabel : '批准数量',
			anchor : '95%'
		},
		'dj' : {
			name : 'dj',
			fieldLabel : '计划单价',
			decimalPrecision : 4,
			anchor : '95%'
		},
		'sqsl_dj' : {
			name : 'sqsl_dj',
			fieldLabel : '申请总金额',
			decimalPrecision : 4,
			anchor : '95%'
		},
		'ffsl' : {
			name : 'ffsl',
			fieldLabel : '<font color=red>领用数量</font>',
			anchor : '95%'
		},
		'bz' : {
			name : 'bz',
			fieldLabel : '备注',
			anchor : '95%'
		},
		'sqje' : {
			name : 'sqje',
			fieldLabel : '申请金额',
			anchor : '95%'
		},
		'spje' : {
			name : 'spje',
			fieldLabel : '审批金额',
			anchor : '95%'
		},
		'ffje' : {
			name : 'ffje',
			fieldLabel : '发放金额',
			anchor : '95%'
		},
		'rate' : {
			name : 'rate',
			fieldLabel : '换算率',
			anchor : '95%'
		},
		'hsdw' : {
			name : 'hsdw',
			fieldLabel : '换算单位',
			anchor : '95%'
		},
		'jhbh' : {
			name : 'jhbh',
			fieldLabel : '采购计划编号',
			anchor : '95%'
		},
		'ftsl' : {
			name : 'ftsl',
			fieldLabel : '<font color=red>分摊数量</font>',
			anchor : '95%'
		},
		'tdTotalNum' : {
			name : 'tdTotalNum',
			fieldLabel : '<font color=red>替代数量</font>',
			anchor : '95%'
		},
		'stage' : {
			name : 'stage',
			fieldLabel : '期别',
			anchor : '95%'
		},
		'isvalid' : {
			name : 'isvalid',
			fieldLabel : '是否有效',
			anchor : '95%'
		},
		'pzrq' : {
			name : 'pzrq',
			fieldLabel : '批准时间',
			format : 'Y-m-d',
			anchor : '95%'
		}
	}

	var Columns_fw = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'bh',
				type : 'string'
			}, {
				name : 'bm',
				type : 'string'
			}, {
				name : 'pm',
				type : 'string'
			}, {
				name : 'gg',
				type : 'string'
			}, {
				name : 'cz',
				type : 'string'
			}, {
				name : 'dw',
				type : 'string'
			}, {
				name : 'xqrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'sqsl',
				type : 'float'
			}, {
				name : 'sl',
				type : 'float'
			}, {
				name : 'dj',
				type : 'float'
			},
			// {name:'sqsl_dj',type:'float'},
			{
				name : 'ffsl',
				type : 'float'
			}, {
				name : 'bz',
				type : 'string'
			}, {
				name : 'sqje',
				type : 'float'
			}, {
				name : 'spje',
				type : 'float'
			}, {
				name : 'ffje',
				type : 'float'
			}, {
				name : 'rate',
				type : 'float'
			}, {
				name : 'hsdw',
				type : 'string'
			}, {
				name : 'jhbh',
				type : 'string'
			}, {
				name : 'ftsl',
				type : 'float'
			}, {
				name : 'tdTotalNum',
				type : 'float'
			}, {
				name : 'stage',
				type : 'string'
			}, {
				name : 'isvalid',
				type : 'string'
			}, {
				name : 'pzrq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}]

	var Plant_fw = Ext.data.Record.create(Columns_fw);

	PlantInt_fw = {
		uids : '',
		pid : '',
		bh : '',
		bm : '',
		pm : '',
		gg : '',
		cz : '',
		dw : '',
		xqrq : '',
		sqsl : '',
		sl : '',
		dj : '',
		ffsl : '',
		bz : '',
		sqje : '',
		spje : '',
		ffje : '',
		rate : '',
		hsdw : '',
		jhbh : '',
		ftsl : '',
		tdTotalNum : '',
		stage : '',
		isvalid : '',
		pzrq : null,
		sqsl_dj : ''
	}
	var sm_fw = new Ext.grid.CheckboxSelectionModel();

	var cm_fw = new Ext.grid.ColumnModel([sm_fw, {
				id : 'uids',
				header : fc_fw['uids'].fieldLabel,
				dataIndex : fc_fw['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc_fw['pid'].fieldLabel,
				dataIndex : fc_fw['pid'].name,
				width : 90,
				hidden : true
			}, {
				id : 'bh',
				header : fc_fw['bh'].fieldLabel,
				dataIndex : fc_fw['bh'].name,
				width : 90,
				hidden : true
			}, {
				id : 'cz',
				header : fc_fw['cz'].fieldLabel,
				dataIndex : fc_fw['cz'].name,
				width : 90,
				hidden : true
			}, {
				id : 'bm',
				header : fc_fw['bm'].fieldLabel,
				dataIndex : fc_fw['bm'].name,
				width : 90
			}, {
				id : 'pm',
				header : fc_fw['pm'].fieldLabel,
				dataIndex : fc_fw['pm'].name,
				width : 90
			}, {
				id : 'gg',
				header : fc_fw['gg'].fieldLabel,
				dataIndex : fc_fw['gg'].name,
				width : 90
			}, {
				id : 'dw',
				header : fc_fw['dw'].fieldLabel,
				dataIndex : fc_fw['dw'].name,
				width : 90
			}, {
				id : 'sqsl',
				header : fc_fw['sqsl'].fieldLabel,
				dataIndex : fc_fw['sqsl'].name,
				width : 90,
				editor : new fm.NumberField(fc_fw['sqsl']),
				renderer : function(value, cell) {
					cell.attr = "style=background-color:#FBF8BF";
					return value
				}
			}, {
				id : 'dj',
				header : fc_fw['dj'].fieldLabel,
				dataIndex : fc_fw['dj'].name,
				width : 90,
				editor : new fm.NumberField(fc_fw['dj']),
				renderer : function(value, cell) {
					cell.attr = "style=background-color:#FBF8BF";
					return value;
				}
			}, {
				id : 'sqsl_dj',
				header : fc_fw['sqsl_dj'].fieldLabel,
				dataIndex : fc_fw['sqsl_dj'].name,
				width : 90,
				renderer : function(value, cellmeta, record, rowIndex,
						columnIndex, store) {
							var getValue = 0;
							getValue = (record.data.sqsl*record.data.dj).toFixed(4);
					        return parseFloat(getValue);
					        
				}
			}, {
				id : 'xqrq',
				header : fc_fw['xqrq'].fieldLabel,
				dataIndex : fc_fw['xqrq'].name,
				width : 90,
				editor : new fm.DateField(fc_fw['xqrq']),
				renderer : function(value, cell) {
					cell.attr = "style=background-color:#FBF8BF";
					return value ? value.dateFormat('Y-m-d') : '';
				}
			}, {
				id : 'sl',
				header : fc_fw['sl'].fieldLabel,
				dataIndex : fc_fw['sl'].name,
				width : 90,
				hidden : true
			}, 
            {
				id : 'ftsl',
				header : fc_fw['ftsl'].fieldLabel,
				dataIndex : fc_fw['ftsl'].name,
				width : 90
			}, // 分摊数量
            {
				id : 'tdTotalNum',
				header : fc_fw['tdTotalNum'].fieldLabel,
				dataIndex : fc_fw['tdTotalNum'].name,
				width : 90
			}, // 替代数量
			{
				id : 'ffsl',
				header : fc_fw['ffsl'].fieldLabel,
				dataIndex : fc_fw['ffsl'].name,
				width : 90
			}, // 发放数量
			{
				id : 'bz',
				header : fc_fw['bz'].fieldLabel,
				dataIndex : fc_fw['bz'].name,
				width : 90,
				hidden : true
			}, {
				id : 'sqje',
				header : fc_fw['sqje'].fieldLabel,
				dataIndex : fc_fw['sqje'].name,
				width : 90,
				hidden : true
			}, {
				id : 'spje',
				header : fc_fw['spje'].fieldLabel,
				dataIndex : fc_fw['spje'].name,
				width : 90,
				hidden : true
			}, {
				id : 'ffje',
				header : fc_fw['ffje'].fieldLabel,
				dataIndex : fc_fw['ffje'].name,
				width : 90,
				hidden : true
			}, {
				id : 'rate',
				header : fc_fw['rate'].fieldLabel,
				dataIndex : fc_fw['rate'].name,
				width : 90,
				hidden : true
			}, {
				id : 'hsdw',
				header : fc_fw['hsdw'].fieldLabel,
				dataIndex : fc_fw['hsdw'].name,
				width : 90,
				hidden : true
			}, {
				id : 'jhbh',
				header : fc_fw['jhbh'].fieldLabel,
				dataIndex : fc_fw['jhbh'].name,
				width : 90,
				hidden : true
			}, {
				id : 'stage',
				header : fc_fw['stage'].fieldLabel,
				dataIndex : fc_fw['stage'].name,
				width : 90,
				hidden : true
			}, {
				id : 'isvalid',
				header : fc_fw['isvalid'].fieldLabel,
				dataIndex : fc_fw['isvalid'].name,
				width : 90,
				hidden : true
			}, {
				id : 'pzrq',
				header : fc_fw['pzrq'].fieldLabel,
				dataIndex : fc_fw['pzrq'].name,
				width : 90,
				renderer : formatDate,
				hidden : true
			}

	]);

	cm_fw.defaultSortable = true;// 可排序

	ds_fw = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean_fw,
					business : business,
					method : listMethod,
					params : "0>1"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey_fw
						}, Columns_fw),
				remoteSort : true,
				pruneModifiedRecords : true
			})
	ds_fw.setDefaultSort(orderColumn_fw, 'asc');

	var addBtn_fw = new Ext.Button({
				text : '选择物资',
				iconCls : 'add',
				handler : insertFun
			})
	var delBtn_fw = new Ext.Button({
				text : '删除',
				iconCls : 'remove',
				handler : function() {
					gridPanel_fw.defaultDeleteHandler()
				}
			})
	var saveBtn_fw = new Ext.Button({
				text : '保存',
				iconCls : 'save',
				handler : saveDetail
			})

	function saveDetail() {
		gridPanel_fw.defaultSaveHandler();
		if (isFlwTask) {
			Ext.Msg.show({
						title : '保存成功！',
						msg : '保存成功！可以发送流程到下一步操作！<br><br>是：[完成流程任务] 否：[继续维护数据]',
						buttons : Ext.Msg.YESNO,
						icon : Ext.MessageBox.INFO,
						fn : function(value) {
							if ('yes' == value) {
								parent.IS_FINISHED_TASK = true;
								parent.mainTabPanel.setActiveTab('common');
							}
						}
					});
		}
	}

	gridPanel_fw = new Ext.grid.EditorGridTbarPanel({
				ds : ds_fw,
				cm : cm_fw,
				sm : sm_fw,
				border : false,
				region : 'south',
				height : 300,
				split : true,
				model : 'mini',
				clicksToEdit : 1,
				addBtn : false,
				delBtn : false,
				saveBtn : false,
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>物资明细(橙色列可编辑)<B></font>'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 20,
					store : ds_fw,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant_fw,
				plantInt : PlantInt_fw,
				servletUrl : MAIN_SERVLET,
				bean : bean_fw,
				business : business,
				primaryKey : primaryKey_fw,
				listeners:{
					afteredit:function(e){
						if(e.field == 'sqsl'){
							var record = e.record;
					    	var realNew = e.value;
							record.set('sl',realNew);
						 }
					}
				}
			});

	gridPanel_fw.on('aftersave', function() {
				sumPrice();
				ds.reload();
			})
	gridPanel_fw.on('afterdelete', function() {
				sumPrice();
				ds.reload();
			})

	//申请总金额
	function sumPrice() {
		DWREngine.setAsync(false);
		cjxbdsArr = new Array();
		baseMgm.getData("select bh,sum (dj*sqsl) from wz_cjsxb where "
						+ pidWhereString + "  group by bh ", function(list) {
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0]);
						temp.push(list[i][1]);
						cjxbdsArr.push(temp);
					}
				});
		DWREngine.setAsync(true);
		return cjxbdsArr
	}

	//----------------------------------关联----------------------------------

	sm.on('rowselect', function(sm, rowIndex, record) {
				var bh_fw = record.get('bh');
				ds_fw.baseParams.params = " bh='" + bh_fw + "'";
				ds_fw.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				selectedData = record.get('bh');
				PlantInt_fw.bh = record.get('bh');
				if(hasFlow){
					if (record.get('billState') != "0") {
						delBtn.disable();
						if(!isFlwTask||record.get('billState') == "1"){
							addBtn_fw.disable();
							delBtn_fw.disable();
							saveBtn_fw.disable();
							editBtn.disable();
						}else{
							editBtn.enable();
						}
					} else {
						addBtn_fw.enable();
						delBtn_fw.enable();
						saveBtn_fw.enable();
						if (!isFlwTask)
							delBtn.enable();
						if (!isFlwView)
							editBtn.enable();
					}
					if (isFlwView) {
						addBtn_fw.disable()
						delBtn_fw.disable()
						saveBtn_fw.disable()
						editBtn.disable();
						delBtn.disable();
						addBtn.disable();
					}
				}
			})

	function insertFun() {
		var record = sm.getSelected();
		selectedData = "";
		if (record)
			selectedData = record.get('bh');
		if (selectedData == null || selectedData == "") {
			Ext.Msg.show({
						title : '提示',
						msg : '请先选择上面的计划信息！',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.INFO
					});
			return;
		} else {
			wz_treePanel.root.reload();
			wz_ds.baseParams.params = "  bm_state = '1' and bm not in(select bm from  WzCjsxb where bh ='"
					+ selectedData
					+ "' and "
					+ pidWhereString
					+ " ) and "
					+ pidWhereString + " ";
			wz_ds.load({params:{start:0,limit:PAGE_SIZE}});
			selectWin.show(true);
		}
	}

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel, gridPanel_fw]
			});

	if (ModuleLVL < 3) {
		gridPanel.getTopToolbar().add('-', addBtn, '-', editBtn, '-', delBtn,
				'-');
		gridPanel_fw.getTopToolbar().add('-', addBtn_fw, '-', saveBtn_fw, '-',
				delBtn_fw);
	}
	
	if (!isFlwTask && !isFlwView){
		if(hasFlow){
			gridPanel.getTopToolbar().add('审批状态：', billStateFilter, '-', '按时间过滤: ',
				comboFilter_y, "年", comboFilter_m, "月");
		}else{
			gridPanel.getTopToolbar().add('按时间过滤: ',
				comboFilter_y, "年", comboFilter_m, "月");
		}
	}
	
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

});