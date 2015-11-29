var bean = "com.sgepit.pmis.wzgl.hbm.WzBmwh"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'bh'
var orderColumn = 'qr'
// PID查询条件
var pidWhereString = "pid = '" + CURRENTAPPID + "'"
Ext.onReady(function() {

	// -----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData(
			"select unitid,unitname from sgcc_ini_unit where UPUNIT = '"
					+ CURRENTAPPID + "' order by unitid", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					bmbzArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// -----------------申请人（sqr: rock_user=realname)
	var userArr = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where unitid = '"
					+ CURRENTAPPID + "' order by userid", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					userArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// ---仓库号：仓库名 CKH：CKMC
	var ck_Array = new Array();
	DWREngine.setAsync(false);
	baseMgm.getData("select CKH,CKMC from WZ_CKH where " + pidWhereString
					+ " order by CKH", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					ck_Array.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// 工程期
	var stagetArr = [['公用', '公用'], ['一期', '一期'], ['二期', '二期']];
	// ----------------------物资维护信息----------------------------//

	var fc = {
		'qr' : {
			name : 'qr',
			fieldLabel : '确认',
			anchor : '95%'
		},
		'wzbm' : {
			name : 'wzbm',
			fieldLabel : '物资编码',
			anchor : '95%'
		},
		'stage' : {
			name : 'stage',
			fieldLabel : '工程期',
			anchor : '95%'
		},
		'flbm' : {
			name : 'flbm',
			fieldLabel : '物资分类',
			anchor : '95%'
		},
		'ckh' : {
			name : 'ckh',
			fieldLabel : '仓库',
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
		'dw' : {
			name : 'dw',
			fieldLabel : '单位',
			anchor : '95%'
		},
		'dj' : {
			name : 'dj',
			fieldLabel : '单价',
			anchor : '95%'
		},
		'bmbz' : {
			name : 'bmbz',
			fieldLabel : '部门',
			anchor : '95%'
		},
		'sqr' : {
			name : 'sqr',
			fieldLabel : '申请人',
			anchor : '95%'
		},
		'rq' : {
			name : 'rq',
			fieldLabel : '申请日期',
			anchor : '95%',
			format : 'Y-m-d',
			minValue : '2000-01-01'
		},
		'bh' : {
			name : 'bh',
			fieldLabel : '记录编号',
			anchor : '95%'
		},
		'bz' : {
			name : 'bz',
			fieldLabel : '备注',
			anchor : '95%'
		},
		'qrr' : {
			name : 'qrr',
			fieldLabel : '确认人',
			anchor : '95%'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID',
			value : CURRENTAPPID,
			hidden : true
		}
	}

	var Columns = [{
				name : 'qr',
				type : 'string'
			}, {
				name : 'wzbm',
				type : 'string'
			}, {
				name : 'stage',
				type : 'string'
			}, {
				name : 'flbm',
				type : 'string'
			}, {
				name : 'ckh',
				type : 'string'
			}, {
				name : 'pm',
				type : 'string'
			}, {
				name : 'gg',
				type : 'string'
			}, {
				name : 'dw',
				type : 'string'
			}, {
				name : 'dj',
				type : 'float'
			}, {
				name : 'bmbz',
				type : 'string'
			}, {
				name : 'sqr',
				type : 'string'
			}, {
				name : 'rq',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'bh',
				type : 'string'
			}, {
				name : 'bz',
				type : 'string'
			}, {
				name : 'qrr',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}]

	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		qr : '',
		wzbm : '',
		stage : '',
		flbm : '',
		ckh : '',
		pm : '',
		gg : '',
		dw : '',
		dj : '',
		bmbz : USERDEPTID,
		sqr : USERID,
		rq : new Date(),
		bh : '',
		bz : '',
		qrr : '',
		pid : CURRENTAPPID
	}
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});

	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'qr',
				header : fc['qr'].fieldLabel,
				dataIndex : fc['qr'].name,
				renderer : function(value) {
					if (value == "1") {
						return "已确认"
					} else if (value == "-1") {
						return "<font color=red>新申请</font>";
					} else if (value == "0") {
						return "<font color=blue>退回</font>"
					}
				}
			}, {
				id : 'wzbm',
				header : fc['wzbm'].fieldLabel,
				dataIndex : fc['wzbm'].name
			}, {
				id : 'stage',
				header : fc['stage'].fieldLabel,
				dataIndex : fc['stage'].name
			}, {
				id : 'flbm',
				header : fc['flbm'].fieldLabel,
				dataIndex : fc['flbm'].name,
				hidden : true
			}, {
				id : 'ckh',
				header : fc['ckh'].fieldLabel,
				dataIndex : fc['ckh'].name,
				renderer : function(value) {
					for (var i = 0; i < ck_Array.length; i++) {
						if (value == ck_Array[i][0]) {
							return ck_Array[i][1]
						}
					}
				}
			}, {
				id : 'pm',
				header : fc['pm'].fieldLabel,
				dataIndex : fc['pm'].name
			}, {
				id : 'gg',
				header : fc['gg'].fieldLabel,
				dataIndex : fc['gg'].name
			}, {
				id : 'dw',
				header : fc['dw'].fieldLabel,
				dataIndex : fc['dw'].name
			}, {
				id : 'dj',
				header : fc['dj'].fieldLabel,
				dataIndex : fc['dj'].name
			}, {
				id : 'bmbz',
				header : fc['bmbz'].fieldLabel,
				dataIndex : fc['bmbz'].name,
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
					if (userArr == "" || userArr == null) {
						return REALNAME;

					} else {
						var flag = false;
						for (var i = 0; i < userArr.length; i++) {
							if (value == userArr[i][0]) {
								flag = true;
								return userArr[i][1];
							}
						}
						if (flag == false) {
							return REALNAME;
						}
					}

				}
			}, {
				id : 'rq',
				header : fc['rq'].fieldLabel,
				dataIndex : fc['rq'].name,
				renderer : formatDate
			}, {
				id : 'bh',
				header : fc['bh'].fieldLabel,
				dataIndex : fc['bh'].name,
				hidden : true
			}, {
				id : 'bz',
				header : fc['bz'].fieldLabel,
				dataIndex : fc['bz'].name
			}, {
				id : 'qrr',
				header : fc['qrr'].fieldLabel,
				dataIndex : fc['qrr'].name,
				hidden : true
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
					params : "sqr = '" + USERID + "' and " + pidWhereString
							+ " "
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
	ds.setDefaultSort(orderColumn, 'asc');
	var addBtn = new Ext.Button({
				text : '新增',
				iconCls : 'add',
				handler : insertFun
			})
	var editBtn = new Ext.Button({
				text : '修改',
				iconCls : 'btn',
				handler : toEditHandler
			})

	gridPanel = new Ext.grid.EditorGridTbarPanel({
				id : 'ff-grid-panel',
				ds : ds,
				cm : cm,
				sm : sm,
				border : false,
				region : 'center',
				clicksToEdit : 2,
				header : false,
				addBtn : false,
				saveBtn : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>编码申请信息<B></font>','-',addBtn,'-',editBtn,'-'],
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				deleteHandler : toDelHandler,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
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

	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel]
			});
	if (ModuleLVL < 3) {
		//gridPanel.getTopToolbar().add(addBtn, editBtn);
	}
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};

	function insertFun() {
		var url = BASE_PATH
				+ "Business/wzgl/baseinfo/wz.baseinfo.wzbm.bmwh.apply.addorupdate.jsp";
		window.location.href = url;
	}
	function toEditHandler() {
		var record = gridPanel.getSelectionModel().getSelected();
		if (record.get('qr') == "1") {
			Ext.MessageBox.alert("提示", "已确认的不能修改!");
		}
		if (record && record.get('qr') == "-1" || record
				&& record.get('qr') == "0") {
			var url = BASE_PATH
					+ "Business/wzgl/baseinfo/wz.baseinfo.wzbm.bmwh.apply.addorupdate.jsp?bh="
					+ record.get('bh');
			window.location.href = url;
		}
	}
	function toDelHandler() {
		var record = gridPanel.getSelectionModel().getSelected();
		if (record.get('qr') == "1") {
			Ext.MessageBox.alert("提示", "已确认的不能删除!");
		} else {
			gridPanel.defaultDeleteHandler()
		}
	}
});