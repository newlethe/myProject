var bean = "com.sgepit.pmis.routine.hbm.GzWeekReport";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var primaryKey = 'uuid';
var orderColumn = 'reportweek';

var PAGE_SIZE = 10
var PAGE_SIZE_CONT = 20

var beanCont = "com.sgepit.pmis.routine.hbm.GzWeekReportList"
var primaryKeyCont = 'uuid';
var orderColumnCont = 'reportuuid';

var selectContUuid;

var dsCont

var planstate = new Array();
planstate = [['0', '未汇总'], ['1', '已汇总']];
var completestate = new Array();
completestate = [['0', '未完成'], ['1', '已完成']];
var billstate = new Array();
billstate = [['0', '上报完成'], ['-1', '汇总中'], ['1', '汇总完成']];
var bill = "0";
var recordstate = new Array();
recordstate = [['0', '部门上报'], ['1', '公司汇总']];
var contenttype = new Array();
contenttype = [['0', '本周完成情况'], ['1', '本周存在的问题'], ['2', '需要上级解决的问题'],
		['3', '下周工作计划']];

var monthArray = [['01', '01月'], ['02', '02月'], ['03', '03月'], ['04', '04月'],
		['05', '05月'], ['06', '06月'], ['07', '07月'], ['08', '08月'],
		['09', '09月'], ['10', '10月'], ['11', '11月'], ['12', '12月']];
var weekArray = [['01', '第1周'], ['02', '第2周'], ['03', '第3周'], ['04', '第4周']];

var gridPanel

var filterStr = " 1=1 and PLANSTATE = '1' AND RECORDSTATE = '1'";

Ext.onReady(function() {

	var hzBtn = new Ext.Button({
		text : '进入汇总',
		tooltip : '进入汇总',
		iconCls : 'btn',
		handler : hzFun
	})

	var queryBtn = new Ext.Button({
		text : '查询',
		iconCls : 'option',
		handler : showWindow
	})
	if (isFlwTask || isFlwView) {
		filterStr += " and flowid = '" + bh_flow + "'";
		hzBtn.setVisible(false);
		queryBtn.setVisible(false);
	}
	

	function hzFun() {
		var url = BASE_PATH + "Business/routine/gz.week.report.hz.add.jsp";
		window.location.href = url;
	}

	var planStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : planstate
	})
	var completeStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : completestate
	})
	var billStateDs = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : billstate
	})

	// --------------------周报--------------------
	var fm = Ext.form;

	var fc = {
		'uuid' : {
			name : 'uuid',
			fieldLabel : 'UUID',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'flowid' : {
			name : 'flowid',
			fieldLabel : '汇总编号',
			readOnly : true,
			anchor : '95%'
		},
		'reportweek' : {
			name : 'reportweek',
			fieldLabel : '汇总周期',
			anchor : '95%'
		},
		'reporttime' : {
			name : 'reporttime',
			fieldLabel : '汇总时间',
			readOnly : true,
			anchor : '95%'
		},
		'reportuser' : {
			name : 'reportuser',
			fieldLabel : '汇总人',
			readOnly : true,
			anchor : '95%'
		},
		'reportdept' : {
			name : 'reportdept',
			fieldLabel : '汇总部门',
			readOnly : true,
			anchor : '95%'
		},
		'planstate' : {
			name : 'planstate',
			fieldLabel : '汇总状态',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '审批状态',
			anchor : '95%'
		},
		'recordstate' : {
			name : 'recordstate',
			fieldLabel : '记录类型',
			anchor : '95%'
		}
	};

	Columns = [{
		name : 'uuid',
		type : 'string'
	}, {
		name : 'flowid',
		type : 'string'
	}, {
		name : 'reportweek',
		type : 'string'
	}, {
		name : 'reporttime',
		type : 'date',
		dateFormat : 'Y-m-d H:i:s'
	}, {
		name : 'reportuser',
		type : 'string'
	}, {
		name : 'reportdept',
		type : 'string'
	}, {
		name : 'reportdeptlead',
		type : 'string'
	}, {
		name : 'planstate',
		type : 'string'
	}, {
		name : 'billstate',
		type : 'float'
	}, {
		name : 'completestate',
		type : 'string'
	}, {
		name : 'recordstate',
		type : 'string'
	}];

	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.ColumnModel([
			// sm,
			{
				id : 'uuid',
				header : fc['uuid'].fieldLabel,
				dataIndex : fc['uuid'].name,
				hidden : true
			}, {
				id : 'flowid',
				header : fc['flowid'].fieldLabel,
				dataIndex : fc['flowid'].name,
				align : "center",
				width : 80,
				type : 'string'
			}, {
				id : 'reportweek',
				header : fc['reportweek'].fieldLabel,
				dataIndex : fc['reportweek'].name,
				align : "center",
				width : 100,
				renderer : function(value) {
					var str = value.substring(0, 4) + "年";
					for (var i = 0; i < monthArray.length; i++) {
						if (value.substring(4, 6) == monthArray[i][0]) {
							str += monthArray[i][1];
						}
					}
					for (var i = 0; i < weekArray.length; i++) {
						if (value.substring(6, 8) == weekArray[i][0]) {
							str += weekArray[i][1];
						}
					}
					return str;
				},
				type : 'string'
			}, {
				id : 'reporttime',
				header : fc['reporttime'].fieldLabel,
				dataIndex : fc['reporttime'].name,
				align : "center",
				width : 120,
				renderer : formatDate,
				type : 'date'
			}, {
				id : 'reportuser',
				header : fc['reportuser'].fieldLabel,
				dataIndex : fc['reportuser'].name,
				align : "center",
				width : 100,
				renderer : function(value) {
					DWREngine.setAsync(false);
					var user = "";
					// -----------------汇总人
					baseMgm.getData(
							"select userid,realname from rock_user where userid = '"
									+ value + "'", function(list) {
								if (list.length > 0) {
									user = list[0][1];
								}
							});
					DWREngine.setAsync(true);
					return user;
				}
			}, {
				id : 'reportdept',
				header : fc['reportdept'].fieldLabel,
				dataIndex : fc['reportdept'].name,
				hidden : true,
				align : "center",
				width : 100,
				renderer : function(value) {
					// reportdept == "00";
					return '公司汇总';
				}
			}, {
				id : 'planstate',
				header : fc['planstate'].fieldLabel,
				dataIndex : fc['planstate'].name,
				align : "center",
				hidden : true,
				width : 80,
				store : planStateDs,
				renderer : function(value) {
					for (var i = 0; i < planstate.length; i++) {
						if (value == planstate[i][0]) {
							return planstate[i][1]
						}
					}
				}
			}, {
				id : 'billstate',
				header : fc['billstate'].fieldLabel,
				dataIndex : fc['billstate'].name,
				align : "center",
				width : 80,
				store : billStateDs,
				renderer : function(value) {
					for (var i = 0; i < billstate.length; i++) {
						if (value == billstate[i][0]) {
							return billstate[i][1]
						}
					}
				}
			}, {
				id : 'recordstate',
				header : fc['recordstate'].fieldLabel,
				dataIndex : fc['recordstate'].name,
				align : "center",
				hidden : true,
				width : 80,
				renderer : function(value) {
					for (var i = 0; i < recordstate.length; i++) {
						if (value == recordstate[i][0]) {
							return recordstate[i][1]
						}
					}
				}
			}]);

	cm.defaultSortable = true;// 可排序

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : filterStr
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
	});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列

	gridPanel = new Ext.grid.GridPanel({
		ds : ds,
		sm : sm,
		cm : cm,
		border : false,
		region : 'north',
		height : 286,
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>部门周工作汇总<B></font>', hzBtn, queryBtn],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
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
		})

	});
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});

	// ----------------------所有已经汇总的汇总记录内容
	var ColumnsCont = [{
		name : 'uuid',
		type : 'string'
	},		// Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'reportuuid',
				type : 'string'
			},
			// {name: 'reportdept', type: 'string'},
			{
				name : 'contenttype',
				type : 'string'
			}, {
				name : 'reportcontent',
				type : 'string'
			}, {
				name : 'con',
				type : 'string'
			}];

	var smCont = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});

	var cmCont = new Ext.grid.ColumnModel([smCont, {
		id : 'uuid',
		header : 'UUID',
		width : 0,
		dataIndex : 'uuid',
		hidden : true
	}, {
		id : 'reportuuid',
		header : '周报UUID',
		dataIndex : 'reportuuid',
		hidden : true
	}, {
		id : 'reportuuid',
		header : '汇总部门',
		dataIndex : 'reportdept',
		renderer : function(val, metadata, rec) {
			var reportuuid = rec.get("reportuuid");
			DWREngine.setAsync(false);
			var dept = "";
			var deptId = ""
			baseMgm.getData(
					"select reportdept from gz_week_report where uuid='"
							+ reportuuid + "'", function(list) {
						if (list.length > 0) {
							deptId = list[0];
						}
					});
			// -----------------汇总部门
			baseMgm.getData(
					"select unitid,unitname from sgcc_ini_unit where unitid='"
							+ deptId + "' order by unitid", function(list) {
						if (list.length > 0) {
							dept = list[0][1];
						}
					});
			DWREngine.setAsync(true);
			return dept;
		}
	},

	{
		id : 'contenttype',
		type : 'string',
		header : '内容类别',
		dataIndex : 'contenttype',
		hidden : true,
		renderer : function(value) {
			for (var i = 0; i < contenttype.length; i++) {
				if (value == contenttype[i][0]) {
					return contenttype[i][1]
				}
			}
		}
	},

	{
		id : 'reportcontent',
		type : 'string',
		header : '工作详情',
		width : 400,
		dataIndex : 'reportcontent'
	}, {
		id : 'con',
		type : 'string',
		header : '操作',
		width : 50,
		dataIndex : 'con',
		renderer : function(val, metadata, rec) {
			var uuid = rec.get("uuid")
			if(bill==1 || (bill==-1 && isFlwTask!=true)){
				return "";
			}else{
				return "<button onclick=outFun('"+uuid+"') style='height:16px' class='pageBtn'>剔除</button>"
			}
		}
	}]);

	dsCont = new Ext.data.GroupingStore({ // 分组
		baseParams : {
			ac : 'list', // 表示取列表
			bean : beanCont,
			business : business,
			method : listMethod
		},
		// 设置代理（保持默认）
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),

		// 创建reader读取数据（保持默认）
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyCont
		}, ColumnsCont),

		// 设置是否可以服务器端排序
		remoteSort : true,
		//remoteGroup : true,
		pruneModifiedRecords : true,
		sortInfo : {
			field : 'reportuuid',
			direction : "ASC"
		}, // 分组
		groupField : 'contenttype' // 分组
	});
	
	//dsCont.setDefaultSort("reportuuid", 'asc');

	gridPanelCont = new Ext.grid.GridPanel({
		ds : dsCont,
		cm : cmCont,
		sm : smCont,
		border : false,
		region : 'center',
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>已经汇总的部门周报内容<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE_CONT,
			store : dsCont,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		view : new Ext.grid.GroupingView({ // 分组
			forceFit : true,
			groupTextTpl : '{text}(共{[values.rs.length]}项)'
		})
	})

	// ----------------------------------关联----------------------------------
	sm.on('rowselect', function(sm, rowIndex, record) {
		cmCont.defaultSortable = true;// 可排序
		selectObj = record;
		var week = record.get('reportweek');
		bill = record.get('billstate')
		DWREngine.setAsync(false);
		var uuids = new Array();
		// -----------------汇总人
		baseMgm.getData("select uuid from gz_week_report where reportweek = '"
				+ week + "'", function(list) {
			for (i = 0; i < list.length; i++) {
				uuids.push("'" + list[i] + "'");
			}
		});
		DWREngine.setAsync(true);
		var ids = uuids.join(",");
		dsCont.baseParams.params = " reportuuid in (" + ids
				+ ") and remove='1' ";
		dsCont.load({
			params : {
				start : 0,
				limit : PAGE_SIZE_CONT
			}
		});
		selectedData = record.get('uuid');
	})
	smCont.on('rowselect', function(sm, rowIndex, record) {
		selectContObj = record;
		selectContUuid = record.get('uuid');
	})

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [gridPanel, gridPanelCont]
			// items:[gridPanel]
	})

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
})

// function outFun(id,rec){
function outFun(id) {
	DWREngine.setAsync(false);
	baseMgm.getData("update gz_week_report_list set remove='0' where uuid= '"
			+ id + "'", function(list) {
		// alert(list)
		// dsCont.remove(rec);
		dsCont.reload();
	});
	DWREngine.setAsync(true);
}